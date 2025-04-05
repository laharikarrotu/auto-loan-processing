import { type FC, useState, useEffect, useRef, useCallback } from 'react';
import { MicrophoneIcon, StopIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface VoiceAssistantProps {
  apiKey?: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface Command {
  phrase: string;
  action: () => void;
}

const VoiceAssistant: FC<VoiceAssistantProps> = ({ apiKey }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const recognitionRef = useRef<any>(null);
  const genAI = useRef<GoogleGenerativeAI | null>(null);

  const commands = useRef<Command[]>([
    {
      phrase: 'check eligibility',
      action: () => window.location.href = '/check-eligibility',
    },
    {
      phrase: 'start application',
      action: () => window.location.href = '/apply',
    },
    {
      phrase: 'upload documents',
      action: () => window.location.href = '/documents',
    },
  ]);

  useEffect(() => {
    if (apiKey) {
      genAI.current = new GoogleGenerativeAI(apiKey);
    }
  }, [apiKey]);

  const processWithAI = useCallback(async (text: string) => {
    if (!genAI.current) {
      console.error('Gemini API key not provided');
      return;
    }

    try {
      const model = genAI.current.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        As an auto loan assistant, help with the following query: "${text}"
        Consider:
        1. If it's about loan eligibility
        2. If it's about document requirements
        3. If it's about application status
        4. If it's about general loan terms
        
        Provide a concise, helpful response.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiResponse(response.text());
    } catch (error) {
      console.error('AI Processing Error:', error);
      setAiResponse('I apologize, but I encountered an error processing your request.');
    }
  }, []);

  const processCommand = useCallback(async (text: string) => {
    const command = commands.current.find(cmd => 
      text.toLowerCase().includes(cmd.phrase.toLowerCase())
    );
    
    setIsProcessing(true);
    
    if (command) {
      command.action();
    } else {
      await processWithAI(text);
    }
    
    setIsProcessing(false);
  }, [processWithAI]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setTranscript(transcript);
        processCommand(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [processCommand]);

  const toggleListening = useCallback(() => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
        setAiResponse('');
      }
      setIsListening(!isListening);
    }
  }, [isListening]);

  const toggleAssistant = useCallback(() => {
    setIsOpen(!isOpen);
    if (isListening) {
      toggleListening();
    }
  }, [isOpen, isListening, toggleListening]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-lg shadow-lg p-4 w-80"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Voice Assistant</h3>
              <button
                onClick={toggleAssistant}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={toggleListening}
                className={`w-full inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-semibold text-white shadow-sm ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-primary-600 hover:bg-primary-500'
                }`}
              >
                {isListening ? (
                  <>
                    <StopIcon className="h-5 w-5 mr-2" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <MicrophoneIcon className="h-5 w-5 mr-2" />
                    Start Listening
                  </>
                )}
              </button>

              {isProcessing && (
                <div className="text-center text-sm text-gray-500">
                  Processing your request...
                </div>
              )}

              {transcript && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">You said:</h4>
                  <p className="text-sm text-gray-700">{transcript}</p>
                </div>
              )}

              {aiResponse && (
                <div className="p-4 bg-primary-50 rounded-lg">
                  <h4 className="text-sm font-medium text-primary-900 mb-2">Assistant:</h4>
                  <p className="text-sm text-primary-700">{aiResponse}</p>
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Available Commands:</h4>
                <ul className="text-sm text-gray-500 space-y-1">
                  {commands.current.map((cmd, index) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">•</span>
                      {cmd.phrase}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleAssistant}
          className="bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-500"
        >
          <MicrophoneIcon className="h-6 w-6" />
        </motion.button>
      )}
    </div>
  );
};

export default VoiceAssistant;
