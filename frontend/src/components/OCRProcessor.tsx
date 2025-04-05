import { type FC, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentTextIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface OCRProcessorProps {
  awsConfig?: {
    region: string;
    credentials: {
      accessKeyId: string;
      secretAccessKey: string;
    };
  };
  onDocumentProcess?: (result: any) => void;
}

const OCRProcessor: FC<OCRProcessorProps> = ({ awsConfig, onDocumentProcess }) => {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!awsConfig) {
      setError('AWS configuration is required for OCR processing');
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setProcessing(true);
    setError('');

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      
      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const base64 = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );

        // Call your AWS Lambda function here
        const response = await fetch('/api/process-document', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64,
            filename: file.name,
            ...awsConfig,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to process document');
        }

        const data = await response.json();
        setResult(data.text);
        onDocumentProcess?.(data);
      };
    } catch (err) {
      console.error('OCR Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process document');
    } finally {
      setProcessing(false);
    }
  }, [awsConfig, onDocumentProcess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.pdf'],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-500'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          {processing ? (
            <DocumentTextIcon className="h-12 w-12 text-primary-500 animate-pulse" />
          ) : (
            <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
          )}
          <p className="text-sm text-gray-600">
            {processing
              ? 'Processing document...'
              : isDragActive
              ? 'Drop the file here'
              : 'Drag & drop a document, or click to select'}
          </p>
          <p className="text-xs text-gray-500">
            Supports JPEG, PNG, and PDF files
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Extracted Text:
          </h3>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
};

export default OCRProcessor; 