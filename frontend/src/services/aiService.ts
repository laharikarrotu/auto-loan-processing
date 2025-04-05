import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export interface EligibilityInput {
  income: number;
  creditScore: number;
  employmentStatus: string;
  monthlyExpenses: number;
  loanAmount: number;
  downPayment: number;
  vehiclePrice: number;
  vehicleAge: number;
}

export interface EligibilityResult {
  isEligible: boolean;
  message: string;
  estimatedRate?: number;
  maxLoanAmount?: number;
  reasoning: string;
}

export async function checkEligibilityWithAI(input: EligibilityInput): Promise<EligibilityResult> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze this auto loan application and determine eligibility:
      - Monthly Income: $${input.income}
      - Credit Score: ${input.creditScore}
      - Employment Status: ${input.employmentStatus}
      - Monthly Expenses: $${input.monthlyExpenses}
      - Loan Amount Requested: $${input.loanAmount}
      - Down Payment: $${input.downPayment}
      - Vehicle Price: $${input.vehiclePrice}
      - Vehicle Age: ${input.vehicleAge} years

      Please provide:
      1. Eligibility decision (true/false)
      2. A clear message explaining the decision
      3. Recommended interest rate if eligible
      4. Maximum loan amount if eligible
      5. Detailed reasoning for the decision

      Format the response as a JSON object with these fields:
      {
        "isEligible": boolean,
        "message": string,
        "estimatedRate": number,
        "maxLoanAmount": number,
        "reasoning": string
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const aiResponse = JSON.parse(text);
    
    return {
      isEligible: aiResponse.isEligible,
      message: aiResponse.message,
      estimatedRate: aiResponse.estimatedRate,
      maxLoanAmount: aiResponse.maxLoanAmount,
      reasoning: aiResponse.reasoning
    };
  } catch (error) {
    console.error('AI eligibility check error:', error);
    throw new Error('Failed to process eligibility check with AI');
  }
} 