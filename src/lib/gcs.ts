import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
  // For production, use service account key from environment variable
  ...(process.env.GOOGLE_CLOUD_CREDENTIALS && {
    credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS)
  })
});

export const GCS_BUCKET = process.env.GCS_BUCKET_NAME || 'tdc-market-uploads';

// Export bucket for compatibility
export const bucket = storage.bucket(GCS_BUCKET);

/**
 * Get public URL for a GCS object
 */
export function gcsObjectPublicUrl(objectName: string): string {
  return `https://storage.googleapis.com/${GCS_BUCKET}/${objectName}`;
}

/**
 * Get signed URL for private access to a GCS object
 */
export async function getSignedReadUrl(
  objectName: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  try {
    const [signedUrl] = await storage
      .bucket(GCS_BUCKET)
      .file(objectName)
      .getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + expiresIn * 1000,
      });

    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }
}

/**
 * Upload file to GCS
 */
export async function uploadToGCS(
  file: Buffer,
  fileName: string,
  contentType: string,
  makePublic: boolean = true
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const bucket = storage.bucket(GCS_BUCKET);
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType,
        cacheControl: 'public, max-age=31536000', // 1 year
      },
      resumable: false,
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        console.error('Upload error:', error);
        resolve({ success: false, error: error.message });
      });

      stream.on('finish', async () => {
        try {
          if (makePublic) {
            await fileUpload.makePublic();
          }
          
          const url = makePublic 
            ? gcsObjectPublicUrl(fileName)
            : await getSignedReadUrl(fileName);

          resolve({ success: true, url });
        } catch (error) {
          console.error('Error making file public:', error);
          resolve({ success: false, error: 'Failed to make file public' });
        }
      });

      stream.end(file);
    });
  } catch (error) {
    console.error('Error uploading to GCS:', error);
    return { success: false, error: 'Upload failed' };
  }
}

/**
 * Delete file from GCS
 */
export async function deleteFromGCS(objectName: string): Promise<boolean> {
  try {
    await storage.bucket(GCS_BUCKET).file(objectName).delete();
    return true;
  } catch (error) {
    console.error('Error deleting from GCS:', error);
    return false;
  }
}

/**
 * Check if file exists in GCS
 */
export async function fileExistsInGCS(objectName: string): Promise<boolean> {
  try {
    const [exists] = await storage.bucket(GCS_BUCKET).file(objectName).exists();
    return exists;
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
}

/**
 * Get file metadata from GCS
 */
export async function getFileMetadata(objectName: string) {
  try {
    const [metadata] = await storage.bucket(GCS_BUCKET).file(objectName).getMetadata();
    return metadata;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    return null;
  }
}

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFileName(
  originalName: string,
  prefix: string = 'upload'
): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `${prefix}/${timestamp}-${randomString}.${extension}`;
}

/**
 * Validate file type and size
 */
export function validateFile(
  file: File,
  maxSize: number = 5 * 1024 * 1024, // 5MB default
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
): { valid: boolean; error?: string } {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Dosya boyutu ${Math.round(maxSize / 1024 / 1024)}MB'dan küçük olmalıdır.`
    };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Sadece ${allowedTypes.map(t => t.split('/')[1].toUpperCase()).join(', ')} formatları desteklenir.`
    };
  }

  return { valid: true };
}

/**
 * Convert File to Buffer
 */
export function fileToBuffer(file: File): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(Buffer.from(reader.result));
      } else {
        reject(new Error('Failed to convert file to buffer'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Upload file with validation
 */
export async function uploadFileWithValidation(
  file: File,
  prefix: string = 'upload',
  makePublic: boolean = true,
  maxSize: number = 5 * 1024 * 1024,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
): Promise<{ success: boolean; url?: string; error?: string }> {
  // Validate file
  const validation = validateFile(file, maxSize, allowedTypes);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    // Convert to buffer
    const buffer = await fileToBuffer(file);
    
    // Generate unique filename
    const fileName = generateUniqueFileName(file.name, prefix);
    
    // Upload to GCS
    const result = await uploadToGCS(buffer, fileName, file.type, makePublic);
    
    return result;
  } catch (error) {
    console.error('Error in uploadFileWithValidation:', error);
    return { success: false, error: 'Upload failed' };
  }
}
