import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    GCP_PROJECT_ID: process.env.GCP_PROJECT_ID ? 'SET' : 'MISSING',
    GCP_CLIENT_EMAIL: process.env.GCP_CLIENT_EMAIL ? 'SET' : 'MISSING',
    GCP_PRIVATE_KEY: process.env.GCP_PRIVATE_KEY ? 'SET' : 'MISSING',
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY ? 'SET' : 'MISSING',
    RECAPTCHA_API_KEY: process.env.RECAPTCHA_API_KEY ? 'SET' : 'MISSING',
    WEBRISK_API_KEY: process.env.WEBRISK_API_KEY ? 'SET' : 'MISSING',
    FCM_PROJECT_ID: process.env.FCM_PROJECT_ID ? 'SET' : 'MISSING',
    FCM_CLIENT_EMAIL: process.env.FCM_CLIENT_EMAIL ? 'SET' : 'MISSING',
    FCM_PRIVATE_KEY: process.env.FCM_PRIVATE_KEY ? 'SET' : 'MISSING',
    BQ_DATASET: process.env.BQ_DATASET ? 'SET' : 'MISSING',
    EMBED_MODEL: process.env.EMBED_MODEL ? 'SET' : 'MISSING',
  };

  return NextResponse.json({
    message: 'Environment variables status',
    env: envVars,
    nodeEnv: process.env.NODE_ENV,
  });
}
