import "server-only";

import { BigQuery } from '@google-cloud/bigquery';
import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise';
import { WebRiskServiceClient } from '@google-cloud/web-risk';
import { PredictionServiceClient } from '@google-cloud/aiplatform';
import * as admin from 'firebase-admin';

// GCP Configuration
const getGcpConfig = () => {
  const projectId = process.env.GCP_PROJECT_ID;
  const clientEmail = process.env.GCP_CLIENT_EMAIL;
  const privateKey = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing required GCP environment variables: GCP_PROJECT_ID, GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY');
  }

  return {
    projectId,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  };
};

// BigQuery client
let bigQueryClient: BigQuery | null = null;
export const getBQ = (): BigQuery => {
  if (!bigQueryClient) {
    const config = getGcpConfig();
    bigQueryClient = new BigQuery({
      projectId: config.projectId,
      credentials: config.credentials,
    });
  }
  return bigQueryClient;
};

// Alias for backward compatibility
export const getBigQuery = getBQ;

// Storage client
let storageClient: any = null;
export const getStorage = () => {
  if (!storageClient) {
    const { Storage } = require('@google-cloud/storage');
    const config = getGcpConfig();
    storageClient = new Storage({
      credentials: config.credentials,
    });
  }
  return storageClient;
};

// reCAPTCHA Enterprise client
let recaptchaClient: RecaptchaEnterpriseServiceClient | null = null;
export const getRecaptcha = (): RecaptchaEnterpriseServiceClient => {
  if (!recaptchaClient) {
    const config = getGcpConfig();
    recaptchaClient = new RecaptchaEnterpriseServiceClient({
      credentials: config.credentials,
    });
  }
  return recaptchaClient;
};

// Web Risk client
let webRiskClient: WebRiskServiceClient | null = null;
export const getWebRisk = (): WebRiskServiceClient => {
  if (!webRiskClient) {
    const config = getGcpConfig();
    webRiskClient = new WebRiskServiceClient({
      credentials: config.credentials,
    });
  }
  return webRiskClient;
};

// Firebase Admin (FCM)
let fcmApp: admin.app.App | null = null;
export const getFCM = (): admin.app.App => {
  if (!fcmApp) {
    const projectId = process.env.FCM_PROJECT_ID;
    const clientEmail = process.env.FCM_CLIENT_EMAIL;
    const privateKey = process.env.FCM_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Missing required FCM environment variables: FCM_PROJECT_ID, FCM_CLIENT_EMAIL, FCM_PRIVATE_KEY');
    }

    fcmApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
  return fcmApp;
};

// Vertex AI client for embeddings
let vertexClient: PredictionServiceClient | null = null;
export const getVertexEmbedding = (): PredictionServiceClient => {
  if (!vertexClient) {
    const config = getGcpConfig();
    vertexClient = new PredictionServiceClient({
      apiEndpoint: `${config.projectId}-aiplatform.googleapis.com`,
      credentials: config.credentials,
    });
  }
  return vertexClient;
};

// Vision API client
let visionClient: any = null;
export const getVision = () => {
  if (!visionClient) {
    const { ImageAnnotatorClient } = require('@google-cloud/vision');
    const config = getGcpConfig();
    visionClient = new ImageAnnotatorClient({
      credentials: config.credentials,
    });
  }
  return visionClient;
};

// BigQuery dataset helper
export const getBigQueryDataset = () => {
  const bq = getBQ();
  const datasetId = process.env.BQ_DATASET || 'tdc_analytics';
  return bq.dataset(datasetId);
};

// Environment validation
export const validateGcpEnv = () => {
  const required = [
    'GCP_PROJECT_ID',
    'GCP_CLIENT_EMAIL', 
    'GCP_PRIVATE_KEY',
    'FCM_PROJECT_ID',
    'FCM_CLIENT_EMAIL',
    'FCM_PRIVATE_KEY',
    'RECAPTCHA_SITE_KEY',
    'RECAPTCHA_API_KEY',
    'WEBRISK_API_KEY',
    'EMBED_MODEL'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return true;
};