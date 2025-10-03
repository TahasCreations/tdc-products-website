import { z } from 'zod';

// Environment validation schema with detailed error messages
export const envSchema = z.object({
  // Database
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL must be a valid PostgreSQL connection string')
    .min(1, 'DATABASE_URL is required')
    .describe('PostgreSQL database connection string'),

  // Redis
  REDIS_URL: z
    .string()
    .url('REDIS_URL must be a valid Redis connection string')
    .min(1, 'REDIS_URL is required')
    .describe('Redis connection string for caching and queues'),

  // S3 Storage
  S3_ENDPOINT: z
    .string()
    .url('S3_ENDPOINT must be a valid URL')
    .min(1, 'S3_ENDPOINT is required')
    .describe('S3-compatible storage endpoint (Wasabi, R2, AWS S3)'),

  S3_BUCKET: z
    .string()
    .min(1, 'S3_BUCKET is required')
    .regex(/^[a-z0-9.-]+$/, 'S3_BUCKET must contain only lowercase letters, numbers, dots, and hyphens')
    .describe('S3 bucket name for file storage'),

  S3_KEY: z
    .string()
    .min(1, 'S3_KEY is required')
    .describe('S3 access key ID'),

  S3_SECRET: z
    .string()
    .min(1, 'S3_SECRET is required')
    .min(20, 'S3_SECRET must be at least 20 characters long')
    .describe('S3 secret access key'),

  // Payment
  PAYMENT_MERCHANT_ID: z
    .string()
    .min(1, 'PAYMENT_MERCHANT_ID is required')
    .describe('Payment gateway merchant ID'),

  PAYMENT_KEY: z
    .string()
    .min(1, 'PAYMENT_KEY is required')
    .describe('Payment gateway API key'),

  PAYMENT_SECRET: z
    .string()
    .min(1, 'PAYMENT_SECRET is required')
    .min(20, 'PAYMENT_SECRET must be at least 20 characters long')
    .describe('Payment gateway secret key'),

  // Authentication
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters long')
    .describe('NextAuth.js secret for JWT signing'),

  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters long')
    .describe('JWT secret for token signing')
    .optional(),

  API_KEY: z
    .string()
    .min(32, 'API_KEY must be at least 32 characters long')
    .describe('API key for external API access')
    .optional(),

  // Monitoring
  SENTRY_DSN: z
    .string()
    .url('SENTRY_DSN must be a valid URL')
    .describe('Sentry DSN for error tracking')
    .optional(),

  NEXT_PUBLIC_SENTRY_DSN: z
    .string()
    .url('NEXT_PUBLIC_SENTRY_DSN must be a valid URL')
    .describe('Public Sentry DSN for client-side error tracking')
    .optional(),

  // Optional environment variables
  NODE_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development')
    .describe('Application environment'),

  PORT: z
    .string()
    .regex(/^\d+$/, 'PORT must be a number')
    .transform(Number)
    .default('3000')
    .describe('Application port'),

  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'debug'])
    .default('info')
    .describe('Logging level'),

  // Feature flags
  ENABLE_ANALYTICS: z
    .string()
    .transform(val => val === 'true')
    .default('false')
    .describe('Enable analytics tracking'),

  ENABLE_PWA: z
    .string()
    .transform(val => val === 'true')
    .default('true')
    .describe('Enable Progressive Web App features'),

  ENABLE_AI: z
    .string()
    .transform(val => val === 'true')
    .default('false')
    .describe('Enable AI features'),

  // Site URLs
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url('NEXT_PUBLIC_SITE_URL must be a valid URL')
    .default('http://localhost:3000')
    .describe('Public site URL'),

  ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:3000,http://localhost:3001')
    .transform(val => val.split(',').map(origin => origin.trim()))
    .describe('Comma-separated list of allowed CORS origins'),
});

// Type inference
export type Environment = z.infer<typeof envSchema>;

// Environment validation function with detailed error messages
export function validateEnv(): Environment {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => {
        const path = err.path.join('.');
        const message = err.message;
        const received = err.received !== undefined ? ` (received: ${err.received})` : '';
        return `❌ ${path}: ${message}${received}`;
      });

      console.error('🚨 Environment validation failed:');
      console.error('');
      errorMessages.forEach(msg => console.error(msg));
      console.error('');
      console.error('💡 Please check your .env file and ensure all required variables are set.');
      console.error('📋 See .env.example for reference.');
      
      if (process.env.NODE_ENV === 'production') {
        console.error('');
        console.error('🔒 Production environment detected. Exiting for security.');
        process.exit(1);
      } else {
        console.error('');
        console.error('⚠️  Development environment detected. Some features may not work correctly.');
        console.error('   Please fix the environment variables above.');
      }
    }
    
    console.error('❌ Unknown environment validation error:', error);
    process.exit(1);
  }
}

// Safe environment validation (doesn't exit on error)
export function safeValidateEnv(): { success: boolean; env?: Environment; errors?: string[] } {
  try {
    const env = envSchema.parse(process.env);
    return { success: true, env };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => {
        const path = err.path.join('.');
        const message = err.message;
        const received = err.received !== undefined ? ` (received: ${err.received})` : '';
        return `${path}: ${message}${received}`;
      });
      return { success: false, errors };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
}

// Environment schema for documentation
export const envSchemaForDocs = {
  required: {
    DATABASE_URL: 'PostgreSQL connection string',
    REDIS_URL: 'Redis connection string',
    S3_ENDPOINT: 'S3-compatible storage endpoint',
    S3_BUCKET: 'S3 bucket name',
    S3_KEY: 'S3 access key ID',
    S3_SECRET: 'S3 secret access key',
    PAYMENT_MERCHANT_ID: 'Payment gateway merchant ID',
    PAYMENT_KEY: 'Payment gateway API key',
    PAYMENT_SECRET: 'Payment gateway secret key',
    NEXTAUTH_SECRET: 'NextAuth.js secret (min 32 chars)',
  },
  optional: {
    JWT_SECRET: 'JWT secret (min 32 chars)',
    NODE_ENV: 'Application environment (development|staging|production)',
    PORT: 'Application port (default: 3000)',
    LOG_LEVEL: 'Logging level (error|warn|info|debug)',
    ENABLE_ANALYTICS: 'Enable analytics (true|false)',
    ENABLE_PWA: 'Enable PWA features (true|false)',
    ENABLE_AI: 'Enable AI features (true|false)',
    NEXT_PUBLIC_SITE_URL: 'Public site URL',
    ALLOWED_ORIGINS: 'Comma-separated CORS origins',
  }
};
