import { type FC, useState } from 'react';
import Tesseract from 'tesseract.js';

const OCRUploader: FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setLoading(true);
    try {
      const result = await Tesseract.recognize(e.target.files[0]);
      setText(result.data.text);
    } catch (error) {
      console.error('OCR Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-primary-50 file:text-primary-700
          hover:file:bg-primary-100"
      />
      {loading && <p>Processing image...</p>}
      {text && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{text}</p>
        </div>
      )}
    </div>
  );
};

export default OCRUploader;
