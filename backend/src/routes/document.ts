import { Router } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const s3 = new S3Client({});

// Get pre-signed URL for file upload
router.post('/upload-url', async (req, res) => {
  try {
    const { fileType, loanApplicationId } = req.body;

    if (!fileType || !loanApplicationId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const fileExtension = fileType.split('/')[1];
    const key = `documents/${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: fileType,
      Metadata: {
        loanApplicationId,
      },
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.json({
      uploadUrl: signedUrl,
      key,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// Get document status
router.get('/:documentId/status', async (req, res) => {
  try {
    const { documentId } = req.params;

    // Here you would typically check the status in DynamoDB
    // For now, we'll return a mock response
    res.json({
      status: 'PROCESSING',
      documentId,
    });
  } catch (error) {
    console.error('Error getting document status:', error);
    res.status(500).json({ error: 'Failed to get document status' });
  }
});

export const documentRouter = router; 