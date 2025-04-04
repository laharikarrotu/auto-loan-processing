import { type FC } from 'react';
import VoiceAssistant from './VoiceAssistant';
import OCRUploader from './OCRUploader';
import EligibilityChecker from './EligibilityChecker';

const AutoLoanPlugin: FC = () => {
  return (
    <div className="p-6 border rounded-2xl shadow-lg bg-white max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">🚗 Smart Loan Assistant</h2>
      <VoiceAssistant />
      <OCRUploader />
      <EligibilityChecker />
    </div>
  );
};

export default AutoLoanPlugin;
