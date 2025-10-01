import { z } from 'zod';

const clientSchema = z.object({
  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().default('TDC Market'),
  
  // Payment
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith('pk_'),
  NEXT_PUBLIC_IYZICO_PUBLIC_KEY: z.string().optional(),
  
  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_MIXPANEL_TOKEN: z.string().optional(),
  
  // Search
  NEXT_PUBLIC_MEILISEARCH_HOST: z.string().url(),
  NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY: z.string(),
  
  // Storage
  NEXT_PUBLIC_CDN_URL: z.string().url().optional(),
  
  // Feature Flags
  NEXT_PUBLIC_FEATURE_BLOG: z.string().transform(val => val === 'true').default('true'),
  NEXT_PUBLIC_FEATURE_REVIEWS: z.string().transform(val => val === 'true').default('true'),
  NEXT_PUBLIC_FEATURE_ADS: z.string().transform(val => val === 'true').default('false'),
  NEXT_PUBLIC_FEATURE_PWA: z.string().transform(val => val === 'true').default('true'),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
});

export const env = clientSchema.parse(process.env);

export type ClientEnv = z.infer<typeof clientSchema>;
