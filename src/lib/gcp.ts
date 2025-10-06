import { Storage } from '@google-cloud/storage';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { BigQuery } from '@google-cloud/bigquery';
import { WebRiskServiceClient } from '@google-cloud/web-risk';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';
import { VertexAI } from '@google-cloud/vertexai';
import admin from 'firebase-admin';

/**
 * GCP Storage Configuration
 * 
 * Bu dosya Google Cloud Storage ile etkileşim için yardımcı fonksiyonlar içerir.
 * Sadece server-side kullanım için tasarlanmıştır.
 */

let storageClient: Storage | null = null;

/**
 * GCP Storage client'ını başlatır
 */
export function getStorageClient(): Storage {
  if (!storageClient) {
    const requiredEnvVars = ['GCP_PROJECT_ID', 'GCP_CLIENT_EMAIL', 'GCP_PRIVATE_KEY', 'GCS_BUCKET'];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }

    storageClient = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      credentials: {
        client_email: process.env.GCP_CLIENT_EMAIL,
        private_key: process.env.GCP_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
    });
  }

  return storageClient;
}

/**
 * Belirtilen bucket'ı döndürür
 */
export function getBucket(bucketName?: string): any {
  const storage = getStorageClient();
  const bucket = bucketName || process.env.GCS_BUCKET;
  
  if (!bucket) {
    throw new Error('GCS_BUCKET environment variable is not set');
  }

  return storage.bucket(bucket);
}

/**
 * Belirtilen prefix'teki dosyaları listeler
 */
export async function listFilesWithPrefix(prefix: string, bucketName?: string): Promise<string[]> {
  try {
    const bucket = getBucket(bucketName);
    const [files] = await bucket.getFiles({ prefix });
    return files.map(file => file.name);
  } catch (error) {
    console.warn(`Error listing files with prefix ${prefix}:`, error);
    return [];
  }
}

/**
 * Belirtilen dosyaları siler
 */
export async function deleteFiles(fileNames: string[], bucketName?: string): Promise<number> {
  if (fileNames.length === 0) return 0;

  try {
    const bucket = getBucket(bucketName);
    const deletePromises = fileNames.map(fileName => 
      bucket.file(fileName).delete().catch(error => {
        console.warn(`Error deleting file ${fileName}:`, error);
        return null;
      })
    );
    
    const results = await Promise.all(deletePromises);
    return results.filter(result => result !== null).length;
  } catch (error) {
    console.warn(`Error deleting files:`, error);
    return 0;
  }
}

/**
 * Belirtilen prefix'teki tüm dosyaları siler
 */
export async function deleteFilesWithPrefix(prefix: string, bucketName?: string): Promise<number> {
  try {
    const fileNames = await listFilesWithPrefix(prefix, bucketName);
    return await deleteFiles(fileNames, bucketName);
  } catch (error) {
    console.warn(`Error deleting files with prefix ${prefix}:`, error);
    return 0;
  }
}

/**
 * GCS'de dosya var mı kontrol eder
 */
export async function fileExists(fileName: string, bucketName?: string): Promise<boolean> {
  try {
    const bucket = getBucket(bucketName);
    const [exists] = await bucket.file(fileName).exists();
    return exists;
  } catch (error) {
    console.warn(`Error checking file existence ${fileName}:`, error);
    return false;
  }
}

/**
 * Demo prefix'lerindeki dosyaları temizler
 */
export async function cleanupDemoFiles(bucketName?: string): Promise<Record<string, number>> {
  const { GCS_DEMO_PREFIXES } = await import('../data/demo-purge.rules');
  const results: Record<string, number> = {};

  for (const prefix of GCS_DEMO_PREFIXES) {
    try {
      const deletedCount = await deleteFilesWithPrefix(prefix, bucketName);
      results[prefix] = deletedCount;
    } catch (error) {
      console.warn(`Error cleaning prefix ${prefix}:`, error);
      results[prefix] = 0;
    }
  }

  return results;
}

/**
 * GCS bağlantısını test eder
 */
export async function testConnection(): Promise<boolean> {
  try {
    const bucket = getBucket();
    await bucket.getMetadata();
    return true;
  } catch (error) {
    console.warn('GCS connection test failed:', error);
    return false;
  }
}

// Vision API
export function getVision(): ImageAnnotatorClient {
  return new ImageAnnotatorClient();
}

// BigQuery
export function getBigQuery(): BigQuery {
  return new BigQuery();
}

export function getBigQueryDataset(datasetId: string): any {
  const bigquery = getBigQuery();
  return bigquery.dataset(datasetId);
}

// Web Risk
export function getWebRisk(): WebRiskServiceClient {
  return new WebRiskServiceClient();
}

// Recaptcha
export function getRecaptcha(): RecaptchaEnterpriseServiceClient {
  return new RecaptchaEnterpriseServiceClient();
}

// Vertex AI
export function getVertexEmbedding(): any {
  const vertex = new VertexAI({ project: process.env.GCP_PROJECT_ID, location: 'us-central1' });
  return vertex.getGenerativeModel({ model: 'text-embedding-004' });
}

// Firebase Admin
export function getFCM(): any {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.GCP_PROJECT_ID,
        clientEmail: process.env.GCP_CLIENT_EMAIL,
        privateKey: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return admin.messaging();
}

// Storage alias
export function getStorage(): Storage {
  return getStorageClient();
}