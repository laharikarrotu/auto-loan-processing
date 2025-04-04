interface EligibilityRequest {
  annualIncome: number;
  creditScore: number;
  employmentLength: number;
  loanAmount: number;
  downPayment: number;
}

interface EligibilityResponse {
  isEligible: boolean;
  maxLoanAmount?: number;
  interestRate?: number;
  reason?: string;
  recommendedDownPayment?: number;
  monthlyPayment?: number;
}

export async function fetchEligibility(data: EligibilityRequest): Promise<EligibilityResponse> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/check-eligibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to check eligibility');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking eligibility:', error);
    throw error;
  }
}

// Helper function to calculate estimated monthly payment
export function calculateMonthlyPayment(
  loanAmount: number,
  interestRate: number,
  loanTermMonths: number
): number {
  const monthlyRate = interestRate / 12 / 100;
  const monthlyPayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) /
    (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  return Math.round(monthlyPayment * 100) / 100;
}

// Helper function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Helper function to validate eligibility input
export function validateEligibilityInput(data: Partial<EligibilityRequest>): string[] {
  const errors: string[] = [];

  if (!data.annualIncome || data.annualIncome < 0) {
    errors.push('Annual income must be a positive number');
  }

  if (!data.creditScore || data.creditScore < 300 || data.creditScore > 850) {
    errors.push('Credit score must be between 300 and 850');
  }

  if (!data.employmentLength || data.employmentLength < 0) {
    errors.push('Employment length must be a positive number');
  }

  if (!data.loanAmount || data.loanAmount <= 0) {
    errors.push('Loan amount must be greater than 0');
  }

  if (data.downPayment === undefined || data.downPayment < 0) {
    errors.push('Down payment must be a positive number');
  }

  if (data.downPayment && data.loanAmount && data.downPayment >= data.loanAmount) {
    errors.push('Down payment cannot be greater than or equal to loan amount');
  }

  return errors;
}
