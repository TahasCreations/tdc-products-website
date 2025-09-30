import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { validateEnv, safeValidateEnv, envSchema } from '../environment/schema.js';

describe('Environment Schema Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Required Environment Variables', () => {
    it('should validate with all required variables', () => {
      const validEnv = {
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
        REDIS_URL: 'redis://localhost:6379',
        S3_ENDPOINT: 'https://s3.amazonaws.com',
        S3_BUCKET: 'test-bucket',
        S3_KEY: 'test-key',
        S3_SECRET: 'test-secret-key-20-chars-min',
        PAYMENT_MERCHANT_ID: 'merchant-123',
        PAYMENT_KEY: 'payment-key',
        PAYMENT_SECRET: 'payment-secret-20-chars-min',
        NEXTAUTH_SECRET: 'nextauth-secret-32-characters-minimum',
      };

      process.env = { ...process.env, ...validEnv };

      const result = safeValidateEnv();
      expect(result.success).toBe(true);
      expect(result.env).toBeDefined();
    });

    it('should fail with missing required variables', () => {
      const result = safeValidateEnv();
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it('should fail with invalid DATABASE_URL', () => {
      process.env = {
        ...process.env,
        DATABASE_URL: 'invalid-url',
        REDIS_URL: 'redis://localhost:6379',
        S3_ENDPOINT: 'https://s3.amazonaws.com',
        S3_BUCKET: 'test-bucket',
        S3_KEY: 'test-key',
        S3_SECRET: 'test-secret-key-20-chars-min',
        PAYMENT_MERCHANT_ID: 'merchant-123',
        PAYMENT_KEY: 'payment-key',
        PAYMENT_SECRET: 'payment-secret-20-chars-min',
        NEXTAUTH_SECRET: 'nextauth-secret-32-characters-minimum',
      };

      const result = safeValidateEnv();
      expect(result.success).toBe(false);
      expect(result.errors?.some(err => err.includes('DATABASE_URL'))).toBe(true);
    });

    it('should fail with invalid S3_BUCKET format', () => {
      process.env = {
        ...process.env,
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
        REDIS_URL: 'redis://localhost:6379',
        S3_ENDPOINT: 'https://s3.amazonaws.com',
        S3_BUCKET: 'Invalid-Bucket-Name!',
        S3_KEY: 'test-key',
        S3_SECRET: 'test-secret-key-20-chars-min',
        PAYMENT_MERCHANT_ID: 'merchant-123',
        PAYMENT_KEY: 'payment-key',
        PAYMENT_SECRET: 'payment-secret-20-chars-min',
        NEXTAUTH_SECRET: 'nextauth-secret-32-characters-minimum',
      };

      const result = safeValidateEnv();
      expect(result.success).toBe(false);
      expect(result.errors?.some(err => err.includes('S3_BUCKET'))).toBe(true);
    });

    it('should fail with short NEXTAUTH_SECRET', () => {
      process.env = {
        ...process.env,
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
        REDIS_URL: 'redis://localhost:6379',
        S3_ENDPOINT: 'https://s3.amazonaws.com',
        S3_BUCKET: 'test-bucket',
        S3_KEY: 'test-key',
        S3_SECRET: 'test-secret-key-20-chars-min',
        PAYMENT_MERCHANT_ID: 'merchant-123',
        PAYMENT_KEY: 'payment-key',
        PAYMENT_SECRET: 'payment-secret-20-chars-min',
        NEXTAUTH_SECRET: 'short',
      };

      const result = safeValidateEnv();
      expect(result.success).toBe(false);
      expect(result.errors?.some(err => err.includes('NEXTAUTH_SECRET'))).toBe(true);
    });
  });

  describe('Optional Environment Variables', () => {
    it('should use default values for optional variables', () => {
      const minimalEnv = {
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
        REDIS_URL: 'redis://localhost:6379',
        S3_ENDPOINT: 'https://s3.amazonaws.com',
        S3_BUCKET: 'test-bucket',
        S3_KEY: 'test-key',
        S3_SECRET: 'test-secret-key-20-chars-min',
        PAYMENT_MERCHANT_ID: 'merchant-123',
        PAYMENT_KEY: 'payment-key',
        PAYMENT_SECRET: 'payment-secret-20-chars-min',
        NEXTAUTH_SECRET: 'nextauth-secret-32-characters-minimum',
      };

      process.env = { ...process.env, ...minimalEnv };

      const result = safeValidateEnv();
      expect(result.success).toBe(true);
      expect(result.env?.NODE_ENV).toBe('development');
      expect(result.env?.PORT).toBe(3000);
      expect(result.env?.LOG_LEVEL).toBe('info');
      expect(result.env?.ENABLE_ANALYTICS).toBe(false);
      expect(result.env?.ENABLE_PWA).toBe(true);
      expect(result.env?.ENABLE_AI).toBe(false);
    });

    it('should transform string booleans correctly', () => {
      const envWithBooleans = {
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
        REDIS_URL: 'redis://localhost:6379',
        S3_ENDPOINT: 'https://s3.amazonaws.com',
        S3_BUCKET: 'test-bucket',
        S3_KEY: 'test-key',
        S3_SECRET: 'test-secret-key-20-chars-min',
        PAYMENT_MERCHANT_ID: 'merchant-123',
        PAYMENT_KEY: 'payment-key',
        PAYMENT_SECRET: 'payment-secret-20-chars-min',
        NEXTAUTH_SECRET: 'nextauth-secret-32-characters-minimum',
        ENABLE_ANALYTICS: 'true',
        ENABLE_PWA: 'false',
        ENABLE_AI: 'true',
      };

      process.env = { ...process.env, ...envWithBooleans };

      const result = safeValidateEnv();
      expect(result.success).toBe(true);
      expect(result.env?.ENABLE_ANALYTICS).toBe(true);
      expect(result.env?.ENABLE_PWA).toBe(false);
      expect(result.env?.ENABLE_AI).toBe(true);
    });

    it('should transform ALLOWED_ORIGINS to array', () => {
      const envWithOrigins = {
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
        REDIS_URL: 'redis://localhost:6379',
        S3_ENDPOINT: 'https://s3.amazonaws.com',
        S3_BUCKET: 'test-bucket',
        S3_KEY: 'test-key',
        S3_SECRET: 'test-secret-key-20-chars-min',
        PAYMENT_MERCHANT_ID: 'merchant-123',
        PAYMENT_KEY: 'payment-key',
        PAYMENT_SECRET: 'payment-secret-20-chars-min',
        NEXTAUTH_SECRET: 'nextauth-secret-32-characters-minimum',
        ALLOWED_ORIGINS: 'http://localhost:3000,https://example.com,https://app.example.com',
      };

      process.env = { ...process.env, ...envWithOrigins };

      const result = safeValidateEnv();
      expect(result.success).toBe(true);
      expect(result.env?.ALLOWED_ORIGINS).toEqual([
        'http://localhost:3000',
        'https://example.com',
        'https://app.example.com'
      ]);
    });
  });

  describe('Environment Schema', () => {
    it('should have correct shape', () => {
      expect(envSchema.shape).toHaveProperty('DATABASE_URL');
      expect(envSchema.shape).toHaveProperty('REDIS_URL');
      expect(envSchema.shape).toHaveProperty('S3_ENDPOINT');
      expect(envSchema.shape).toHaveProperty('S3_BUCKET');
      expect(envSchema.shape).toHaveProperty('S3_KEY');
      expect(envSchema.shape).toHaveProperty('S3_SECRET');
      expect(envSchema.shape).toHaveProperty('PAYMENT_MERCHANT_ID');
      expect(envSchema.shape).toHaveProperty('PAYMENT_KEY');
      expect(envSchema.shape).toHaveProperty('PAYMENT_SECRET');
      expect(envSchema.shape).toHaveProperty('NEXTAUTH_SECRET');
      expect(envSchema.shape).toHaveProperty('JWT_SECRET');
    });
  });
});

