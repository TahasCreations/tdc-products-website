import { beforeAll, afterAll } from 'vitest';

// Test setup for environment validation
beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
  process.env.REDIS_URL = 'redis://localhost:6379';
  process.env.S3_ENDPOINT = 'https://s3.amazonaws.com';
  process.env.S3_BUCKET = 'test-bucket';
  process.env.S3_KEY = 'test-key';
  process.env.S3_SECRET = 'test-secret-key-20-chars-min';
  process.env.PAYMENT_MERCHANT_ID = 'test-merchant';
  process.env.PAYMENT_KEY = 'test-payment-key';
  process.env.PAYMENT_SECRET = 'test-payment-secret-20-chars-min';
  process.env.NEXTAUTH_SECRET = 'test-nextauth-secret-32-characters-minimum';
});

afterAll(() => {
  // Clean up test environment
  delete process.env.NODE_ENV;
  delete process.env.DATABASE_URL;
  delete process.env.REDIS_URL;
  delete process.env.S3_ENDPOINT;
  delete process.env.S3_BUCKET;
  delete process.env.S3_KEY;
  delete process.env.S3_SECRET;
  delete process.env.PAYMENT_MERCHANT_ID;
  delete process.env.PAYMENT_KEY;
  delete process.env.PAYMENT_SECRET;
  delete process.env.NEXTAUTH_SECRET;
});

