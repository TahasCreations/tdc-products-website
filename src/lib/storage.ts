import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL!,
    private_key: process.env.GCP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  },
});

export const GCS_BUCKET = process.env.GCS_BUCKET!;
export const bucket = storage.bucket(GCS_BUCKET);

// Public read için (ürün görselleri, satıcı logoları)
export const gcsObjectPublicUrl = (p: string) =>
  `https://storage.googleapis.com/${GCS_BUCKET}/${p}`;

// Private read için (dokümanlar, faturalar)
export async function getSignedReadUrl(objectPath: string, minutes = 60) {
  const [url] = await bucket.file(objectPath).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + minutes * 60 * 1000,
  });
  return url;
}

// Dosya yükleme fonksiyonu
export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: string = "uploads"
): Promise<string> {
  const filePath = `${folder}/${Date.now()}-${fileName}`;
  const fileUpload = bucket.file(filePath);
  
  await fileUpload.save(file, {
    metadata: {
      contentType,
    },
    public: true, // Public read için
  });
  
  return gcsObjectPublicUrl(filePath);
}

// Dosya silme fonksiyonu
export async function deleteFile(filePath: string): Promise<void> {
  await bucket.file(filePath).delete();
}

// Dosya boyutu kontrolü
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

// Desteklenen dosya tipleri
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Dosya tipi kontrolü
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}
