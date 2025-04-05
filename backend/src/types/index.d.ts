declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      roles: string[];
    };
  }
}

declare module 'aws-lambda' {
  export interface APIGatewayProxyEvent {
    requestContext: {
      authorizer?: {
        claims: {
          sub: string;
          email: string;
        };
      };
    };
  }
}

interface LoanApplication {
  id: string;
  userId: string;
  vehicleDetails: {
    make: string;
    model: string;
    year: number;
    price: number;
  };
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    income: number;
    employmentStatus: string;
  };
  loanDetails: {
    amount: number;
    term: number;
    downPayment: number;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  createdAt: string;
  updatedAt: string;
}

interface DocumentUpload {
  id: string;
  loanApplicationId: string;
  fileName: string;
  fileType: string;
  status: 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED';
  extractedText?: string;
  entities?: Array<{
    Type?: string;
    Text?: string;
    Score?: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface EligibilityCheck {
  userId: string;
  income: number;
  creditScore: number;
  employmentStatus: 'EMPLOYED' | 'SELF_EMPLOYED' | 'UNEMPLOYED' | 'RETIRED';
  monthlyExpenses: number;
  loanAmount: number;
  downPayment: number;
  vehiclePrice: number;
  vehicleAge: number;
} 