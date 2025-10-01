import { z } from 'zod';

const serverSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  
  // Payment Providers
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  IYZICO_API_KEY: z.string().optional(),
  IYZICO_SECRET_KEY: z.string().optional(),
  
  // Email
  SENDGRID_API_KEY: z.string().startsWith('SG.'),
  SENDGRID_FROM_EMAIL: z.string().email(),
  
  // AI Services
  OPENAI_API_KEY: z.string().startsWith('sk-'),
  ANTHROPIC_API_KEY: z.string().optional(),
  
  // Search
  MEILISEARCH_HOST: z.string().url(),
  MEILISEARCH_API_KEY: z.string(),
  
  // Storage
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_BUCKET_NAME: z.string().optional(),
  
  // Redis
  REDIS_URL: z.string().url().optional(),
  
  // Analytics
  GOOGLE_ANALYTICS_ID: z.string().optional(),
  MIXPANEL_TOKEN: z.string().optional(),
  
  // Security
  ENCRYPTION_KEY: z.string().min(32),
  JWT_SECRET: z.string().min(32),
  
  // Feature Flags
  FEATURE_BLOG_MODERATION: z.string().transform(val => val === 'true').default('true'),
  FEATURE_AI_SUGGESTIONS: z.string().transform(val => val === 'true').default('true'),
  FEATURE_PROMOTED_LISTINGS: z.string().transform(val => val === 'true').default('false'),
  FEATURE_CUSTOM_DOMAINS: z.string().transform(val => val === 'true').default('false'),
  
  // Rate Limiting
  RATE_LIMIT_REQUESTS_PER_MINUTE: z.string().transform(Number).default('100'),
  RATE_LIMIT_BLOG_POSTS_PER_HOUR: z.string().transform(Number).default('3'),
  RATE_LIMIT_UPLOADS_PER_DAY: z.string().transform(Number).default('10'),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export const env = serverSchema.parse(process.env);

export type ServerEnv = z.infer<typeof serverSchema>;
