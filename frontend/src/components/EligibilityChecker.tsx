import { useState, type FC } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { checkEligibilityWithAI } from '../services/aiService';

interface FormData {
  income: string;
  creditScore: string;
  vehiclePrice: string;
  employmentStatus: string;
  loanTerm: string;
}

interface EligibilityResult {
  isEligible: boolean;
  message: string;
  estimatedRate?: number;
  maxLoanAmount?: number;
  reasoning?: string;
}

const EligibilityChecker: FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>({
    income: '',
    creditScore: '',
    vehiclePrice: '',
    employmentStatus: '',
    loanTerm: '',
  });
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReasoning, setShowReasoning] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkEligibility = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestData = {
        income: parseFloat(form.income),
        creditScore: parseInt(form.creditScore),
        employmentStatus: form.employmentStatus.toUpperCase().replace('-', '_'),
        monthlyExpenses: parseFloat(form.income) * 0.3,
        loanAmount: parseFloat(form.vehiclePrice) * 0.8,
        downPayment: parseFloat(form.vehiclePrice) * 0.2,
        vehiclePrice: parseFloat(form.vehiclePrice),
        vehicleAge: 0,
      };

      const aiResult = await checkEligibilityWithAI(requestData);
      
      setResult({
        isEligible: aiResult.isEligible,
        message: aiResult.message,
        estimatedRate: aiResult.estimatedRate,
        maxLoanAmount: aiResult.maxLoanAmount,
        reasoning: aiResult.reasoning,
      });
    } catch (err) {
      console.error('Eligibility check error:', err);
      setResult({
        isEligible: false,
        message: 'Unable to check eligibility. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={checkEligibility} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="income"
            className="block text-sm font-medium text-gray-700"
          >
            Monthly Income
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="income"
              id="income"
              required
              min="0"
              value={form.income}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Enter your monthly income"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="creditScore"
            className="block text-sm font-medium text-gray-700"
          >
            Credit Score
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="creditScore"
              id="creditScore"
              required
              min="300"
              max="850"
              value={form.creditScore}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Enter your credit score"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="vehiclePrice"
            className="block text-sm font-medium text-gray-700"
          >
            Vehicle Price
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="vehiclePrice"
              id="vehiclePrice"
              required
              min="0"
              value={form.vehiclePrice}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              placeholder="Enter vehicle price"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="employmentStatus"
            className="block text-sm font-medium text-gray-700"
          >
            Employment Status
          </label>
          <div className="mt-1">
            <select
              name="employmentStatus"
              id="employmentStatus"
              required
              value={form.employmentStatus}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Select status</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="self-employed">Self-employed</option>
              <option value="unemployed">Unemployed</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="loanTerm"
            className="block text-sm font-medium text-gray-700"
          >
            Loan Term
          </label>
          <div className="mt-1">
            <select
              name="loanTerm"
              id="loanTerm"
              required
              value={form.loanTerm}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">Select term</option>
              <option value="36">36 months</option>
              <option value="48">48 months</option>
              <option value="60">60 months</option>
              <option value="72">72 months</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 ${
            loading
              ? 'bg-primary-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-500'
          }`}
        >
          {loading ? 'Checking...' : 'Check Eligibility'}
        </button>
      </div>

      {result && (
        <div
          className={`mt-4 p-4 rounded-md ${
            result.isEligible ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {result.isEligible ? (
                <CheckCircleIcon
                  className="h-5 w-5 text-green-400"
                  aria-hidden="true"
                />
              ) : (
                <XCircleIcon
                  className="h-5 w-5 text-red-400"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="ml-3">
              <h3
                className={`text-sm font-medium ${
                  result.isEligible ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {result.isEligible ? 'Good news!' : 'We apologize'}
              </h3>
              <div
                className={`mt-2 text-sm ${
                  result.isEligible ? 'text-green-700' : 'text-red-700'
                }`}
              >
                <p>{result.message}</p>
                {result.isEligible && result.estimatedRate && (
                  <p className="mt-2">
                    Estimated Interest Rate: {result.estimatedRate}%
                  </p>
                )}
                {result.isEligible && result.maxLoanAmount && (
                  <p>Maximum Loan Amount: ${result.maxLoanAmount.toLocaleString()}</p>
                )}
                {result.reasoning && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setShowReasoning(!showReasoning)}
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      {showReasoning ? 'Hide Reasoning' : 'Show Reasoning'}
                    </button>
                    {showReasoning && (
                      <p className="mt-2 text-gray-600">{result.reasoning}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {result.isEligible && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate('/apply')}
                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              >
                Start Application
                <CheckCircleIcon className="ml-2 -mr-0.5 h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default EligibilityChecker;
