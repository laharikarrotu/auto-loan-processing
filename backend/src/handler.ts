import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { json } from 'body-parser';
import { loanApplicationRouter } from './routes/loanApplication';
import { documentRouter } from './routes/document';
import { eligibilityRouter } from './routes/eligibility';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api/loan-applications', loanApplicationRouter);
app.use('/api/documents', documentRouter);
app.use('/api/eligibility', eligibilityRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.STAGE === 'dev' ? err.message : undefined
  });
});

// Export handler for AWS Lambda
export const handler = serverless(app); 