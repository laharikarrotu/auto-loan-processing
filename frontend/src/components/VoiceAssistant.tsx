import { type FC, useState, useEffect, useRef } from 'react';
import { MicrophoneIcon, StopIcon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface Command {
  phrase: string;
  action: () => void;
}

const VoiceAssistant: FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [commands, setCommands] = useState<Command[]>([
    {
      phrase: 'check eligibility',
      action: () => window.location.href = '/eligibility',
    },
    {
      phrase: 'start application',
      action: () => window.location.href = '/application',
    },
    {
      phrase: 'upload documents',
      action: () => window.location.href = '/documents',
    },
  ]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

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
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processCommand = (text: string) => {
    const command = commands.find(cmd => 
      text.toLowerCase().includes(cmd.phrase.toLowerCase())
    );
    
    if (command) {
      setIsProcessing(true);
      setTimeout(() => {
        command.action();
        setIsProcessing(false);
      }, 1000);
    }
  };

  const toggleListening = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
      setIsListening(!isListening);
    }
  };

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    if (isListening) {
      toggleListening();
    }
  };

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
                  Processing command...
                </div>
              )}

              {transcript && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{transcript}</p>
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Available Commands:</h4>
                <ul className="text-sm text-gray-500 space-y-1">
                  {commands.map((cmd, index) => (
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
