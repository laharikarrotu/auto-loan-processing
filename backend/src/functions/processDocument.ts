import { TextractClient, AnalyzeDocumentCommand } from '@aws-sdk/client-textract';
import { ComprehendClient, DetectEntitiesCommand } from '@aws-sdk/client-comprehend';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const textract = new TextractClient({});
const comprehend = new ComprehendClient({});
const s3 = new S3Client({});
const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

type S3EventRecord = {
  s3: {
    bucket: {
      name: string;
    };
    object: {
      key: string;
    };
  };
};

type S3Event = {
  Records: S3EventRecord[];
};

export const handler = async (event: S3Event) => {
  try {
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      
      // Get the document from S3
      const { Body } = await s3.send(new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }));

      if (!Body) {
        throw new Error('Empty document body');
      }

      // Convert stream to buffer
      const buffer = await streamToBuffer(Body);

      // Process with Textract
      const textractResponse = await textract.send(new AnalyzeDocumentCommand({
        Document: {
          Bytes: buffer,
        },
        FeatureTypes: ['FORMS', 'TABLES'],
      }));

      // Extract text from Textract response
      const extractedText = textractResponse.Blocks
        ?.filter(block => block.BlockType === 'LINE')
        .map(block => block.Text)
        .join(' ') || '';

      // Analyze text with Comprehend
      const comprehendResponse = await comprehend.send(new DetectEntitiesCommand({
        Text: extractedText,
        LanguageCode: 'en',
      }));

      // Extract relevant entities
      const entities = comprehendResponse.Entities?.filter(entity => 
        ['DATE', 'QUANTITY', 'ORGANIZATION', 'PERSON'].includes(entity.Type || '')
      );

      // Update DynamoDB with processed results
      const documentId = key.split('/')[1]; // Assuming key format: "documents/{documentId}.pdf"
      await dynamoDb.send(new UpdateCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Key: { id: documentId },
        UpdateExpression: 'SET extractedText = :text, entities = :entities, status = :status',
        ExpressionAttributeValues: {
          ':text': extractedText,
          ':entities': entities,
          ':status': 'PROCESSED',
        },
      }));
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Documents processed successfully' }),
    };
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
};

// Helper function to convert readable stream to buffer
async function streamToBuffer(stream: any): Promise<Buffer> {
  const chunks: Buffer[] = [];
  
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  
  return Buffer.concat(chunks);
} 