import { Router, Request, Response } from 'express';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = Router();
const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// Validation schema for loan application
const loanApplicationSchema = z.object({
  userId: z.string(),
  vehicleDetails: z.object({
    make: z.string(),
    model: z.string(),
    year: z.number(),
    price: z.number(),
  }),
  personalInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    income: z.number(),
    employmentStatus: z.string(),
  }),
  loanDetails: z.object({
    amount: z.number(),
    term: z.number(),
    downPayment: z.number(),
  }),
});

type LoanApplicationInput = z.infer<typeof loanApplicationSchema>;

// Create new loan application
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = loanApplicationSchema.parse(req.body);
    
    const item: LoanApplication = {
      id: uuidv4(),
      ...validatedData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dynamoDb.send(new PutCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: item,
    }));

    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
    } else {
      console.error('Error creating loan application:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Get loan application by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { Item } = await dynamoDb.send(new GetCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: { id: req.params.id },
    }));

    if (!Item) {
      return res.status(404).json({ error: 'Loan application not found' });
    }

    res.json(Item as LoanApplication);
  } catch (error) {
    console.error('Error fetching loan application:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get loan applications by user ID
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { Items } = await dynamoDb.send(new QueryCommand({
      TableName: process.env.DYNAMODB_TABLE,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': req.params.userId,
      },
    }));

    res.json((Items || []) as LoanApplication[]);
  } catch (error) {
    console.error('Error fetching user loan applications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update loan application status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = req.body as { status: LoanApplication['status'] };
    
    if (!['PENDING', 'APPROVED', 'REJECTED', 'UNDER_REVIEW'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await dynamoDb.send(new PutCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: {
        id: req.params.id,
        status,
        updatedAt: new Date().toISOString(),
      },
      ConditionExpression: 'attribute_exists(id)',
    }));

    res.json({ status, updatedAt: new Date().toISOString() });
  } catch (error) {
    if (error instanceof Error && error.name === 'ConditionalCheckFailedException') {
      res.status(404).json({ error: 'Loan application not found' });
    } else {
      console.error('Error updating loan application status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

export const loanApplicationRouter = router; 