import "server-only";

import { Storage } from '@google-cloud/storage';
import { BigQuery } from '@google-cloud/bigquery';
import { ImageAnnotatorClient } from '@google-cloud/vision';

let storageClient: Storage | null = null;
let bigQueryClient: BigQuery | null = null;
let visionClient: ImageAnnotatorClient | null = null;

export function getStorage(): Storage {
  if (!storageClient) {
    storageClient = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }
  return storageClient;
}

export function getBigQuery(): BigQuery {
  if (!bigQueryClient) {
    bigQueryClient = new BigQuery({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }
  return bigQueryClient;
}

export function getVision(): ImageAnnotatorClient {
  if (!visionClient) {
    visionClient = new ImageAnnotatorClient({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }
  return visionClient;
}
