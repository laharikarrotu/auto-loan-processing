import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Validation schema for eligibility check
const eligibilityCheckSchema = z.object({
  income: z.number().min(0),
  creditScore: z.number().min(300).max(850),
  employmentStatus: z.enum(['EMPLOYED', 'SELF_EMPLOYED', 'UNEMPLOYED', 'RETIRED']),
  monthlyExpenses: z.number().min(0),
  loanAmount: z.number().min(0),
  downPayment: z.number().min(0),
  vehiclePrice: z.number().min(0),
  vehicleAge: z.number().min(0),
});

// Calculate eligibility score
function calculateEligibilityScore(data: z.infer<typeof eligibilityCheckSchema>): number {
  let score = 0;

  // Credit score weight (40%)
  if (data.creditScore >= 750) score += 40;
  else if (data.creditScore >= 700) score += 35;
  else if (data.creditScore >= 650) score += 25;
  else if (data.creditScore >= 600) score += 15;
  else score += 5;

  // Income to loan amount ratio weight (20%)
  const incomeToLoanRatio = (data.income * 12) / data.loanAmount;
  if (incomeToLoanRatio >= 3) score += 20;
  else if (incomeToLoanRatio >= 2) score += 15;
  else if (incomeToLoanRatio >= 1.5) score += 10;
  else score += 5;

  // Down payment percentage weight (15%)
  const downPaymentPercentage = (data.downPayment / data.vehiclePrice) * 100;
  if (downPaymentPercentage >= 20) score += 15;
  else if (downPaymentPercentage >= 15) score += 12;
  else if (downPaymentPercentage >= 10) score += 8;
  else score += 4;

  // Employment status weight (15%)
  switch (data.employmentStatus) {
    case 'EMPLOYED':
      score += 15;
      break;
    case 'SELF_EMPLOYED':
      score += 12;
      break;
    case 'RETIRED':
      score += 10;
      break;
    default:
      score += 0;
  }

  // Debt-to-income ratio weight (10%)
  const monthlyIncome = data.income / 12;
  const debtToIncomeRatio = (data.monthlyExpenses / monthlyIncome) * 100;
  if (debtToIncomeRatio <= 30) score += 10;
  else if (debtToIncomeRatio <= 40) score += 7;
  else if (debtToIncomeRatio <= 50) score += 4;
  else score += 0;

  return score;
}

// Check eligibility endpoint
router.post('/check', async (req, res) => {
  try {
    const data = eligibilityCheckSchema.parse(req.body);
    const eligibilityScore = calculateEligibilityScore(data);

    // Calculate maximum loan amount based on income and credit score
    const maxLoanAmount = Math.min(
      data.income * 12 * 0.5, // Maximum 50% of annual income
      data.vehiclePrice - data.downPayment
    );

    // Determine eligibility and interest rate
    let eligible = false;
    let interestRate = 0;
    let reason = '';

    if (eligibilityScore >= 80) {
      eligible = true;
      interestRate = 3.99;
      reason = 'Excellent qualification';
    } else if (eligibilityScore >= 70) {
      eligible = true;
      interestRate = 5.99;
      reason = 'Good qualification';
    } else if (eligibilityScore >= 60) {
      eligible = true;
      interestRate = 7.99;
      reason = 'Fair qualification';
    } else {
      eligible = false;
      reason = 'Score too low';
    }

    // Additional checks
    if (data.creditScore < 600) {
      eligible = false;
      reason = 'Credit score too low';
    }

    if (data.loanAmount > maxLoanAmount) {
      eligible = false;
      reason = 'Loan amount exceeds maximum allowed';
    }

    res.json({
      eligible,
      eligibilityScore,
      maxLoanAmount,
      interestRate: eligible ? interestRate : null,
      reason,
      additionalDetails: {
        monthlyPaymentEstimate: eligible
          ? (data.loanAmount * (interestRate / 100 / 12)) /
            (1 - Math.pow(1 + interestRate / 100 / 12, -60))
          : null,
        recommendedDownPayment: Math.max(data.vehiclePrice * 0.2, data.downPayment),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation Error', details: error.errors });
    } else {
      console.error('Error checking eligibility:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

export const eligibilityRouter = router; 