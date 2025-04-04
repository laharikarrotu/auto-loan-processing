interface UploadResponse {
  url: string;
  key: string;
}

export async function uploadToS3(file: File): Promise<UploadResponse> {
  try {
    // First, get the pre-signed URL from our backend
    const presignedUrlResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/get-upload-url`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      }
    );

    if (!presignedUrlResponse.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { uploadUrl, key } = await presignedUrlResponse.json();

    // Upload the file directly to S3 using the pre-signed URL
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file');
    }

    // Return the public URL and key of the uploaded file
    return {
      url: `${import.meta.env.VITE_S3_PUBLIC_URL}/${key}`,
      key,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

// Helper function to validate file before upload
export function validateFile(file: File): string[] {
  const errors: string[] = [];
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

  if (file.size > maxSize) {
    errors.push('File size must be less than 10MB');
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push('File type must be JPEG, PNG, or PDF');
  }

  return errors;
}

// Helper function to get file extension
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

// Helper function to generate a unique file name
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = getFileExtension(originalName);
  return `${timestamp}-${random}.${extension}`;
}
