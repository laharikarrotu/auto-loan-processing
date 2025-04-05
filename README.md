# Auto Loan Processing Plugin

A modern, AI-powered auto loan processing plugin that can be embedded into any fintech application. Features include voice assistance powered by Gemini AI, document OCR processing using AWS Textract, and intelligent loan eligibility checking.

## Features

- 🎤 **Voice Assistant**: AI-powered voice interface using Gemini for natural interactions
- 📄 **Document OCR**: Automated document processing using AWS Textract
- ✅ **Eligibility Checker**: Smart loan eligibility assessment
- 🎨 **Modern UI**: Beautiful, responsive design with dark mode support
- 🔌 **Easy Integration**: Simple to embed in any React application

## Installation

```bash
npm install auto-loan-processing
# or
yarn add auto-loan-processing
```

## Quick Start

1. Set up environment variables:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_AWS_REGION=your_aws_region
VITE_AWS_ACCESS_KEY_ID=your_aws_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

2. Import and use the plugin:

```tsx
import { AutoLoanPlugin } from 'auto-loan-processing';

function App() {
  return (
    <AutoLoanPlugin
      apiKey={process.env.VITE_GEMINI_API_KEY}
      awsConfig={{
        region: process.env.VITE_AWS_REGION,
        credentials: {
          accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY,
        },
      }}
      theme="light"
      onEligibilityCheck={(result) => {
        console.log('Eligibility result:', result);
      }}
      onDocumentProcess={(result) => {
        console.log('Document processed:', result);
      }}
    />
  );
}
```

## Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/auto-loan-processing.git
cd auto-loan-processing
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Architecture

The plugin consists of three main components:

1. **Voice Assistant**: Uses the Web Speech API for voice input and Gemini AI for natural language processing.
2. **OCR Processor**: Integrates with AWS Textract for document processing and text extraction.
3. **Eligibility Checker**: Implements smart loan eligibility assessment with customizable criteria.

## AWS Lambda Setup

1. Create a new Lambda function for document processing
2. Deploy the function code from `backend/functions/processDocument.ts`
3. Configure environment variables in the Lambda function
4. Set up API Gateway to expose the Lambda function

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details
