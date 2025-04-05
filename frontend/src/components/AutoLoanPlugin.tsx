import { type FC } from 'react';
import VoiceAssistant from './VoiceAssistant';
import OCRProcessor from './OCRProcessor';
import EligibilityChecker from './EligibilityChecker';

interface AutoLoanPluginProps {
  apiKey?: string;
  awsConfig?: {
    region: string;
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
  };
  theme?: 'light' | 'dark';
  onEligibilityCheck?: (result: any) => void;
  onDocumentProcess?: (result: any) => void;
}

const AutoLoanPlugin: FC<AutoLoanPluginProps> = ({
  apiKey,
  awsConfig,
  theme = 'light',
  onEligibilityCheck,
  onDocumentProcess
}) => {
  return (
    <div className={`p-6 border rounded-2xl shadow-lg bg-white max-w-xl mx-auto space-y-6 ${
      theme === 'dark' ? 'dark' : ''
    }`}>
      <h2 className="text-2xl font-bold text-center">🚗 Smart Loan Assistant</h2>
      <VoiceAssistant apiKey={apiKey} />
      <OCRProcessor awsConfig={awsConfig} onDocumentProcess={onDocumentProcess} />
      <EligibilityChecker onEligibilityCheck={onEligibilityCheck} />
    </div>
  );
};

export default AutoLoanPlugin;
