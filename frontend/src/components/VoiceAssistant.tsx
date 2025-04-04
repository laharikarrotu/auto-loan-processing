import { type FC, useState, useEffect } from 'react';
import { MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const VoiceAssistant: FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    let recognition: any = null;

    if ('webkitSpeechRecognition' in window) {
      recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        setTranscript(transcript);
      };

      if (isListening) {
        recognition.start();
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={toggleListening}
        className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-semibold text-white shadow-sm ${
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

      {transcript && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
