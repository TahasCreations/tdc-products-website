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

export const gcsObjectPublicUrl = (p: string) =>
  `https://storage.googleapis.com/${GCS_BUCKET}/${p}`;

export async function getSignedReadUrl(objectPath: string, minutes = 60) {
  const [url] = await bucket.file(objectPath).getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + minutes * 60 * 1000,
  });
  return url;
}
