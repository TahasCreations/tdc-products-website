# @tdc/config

Environment configuration and validation package for TDC Market.

## Features

- 🔒 **Type-safe environment validation** with Zod
- 🚨 **Detailed error messages** for missing or invalid variables
- 🛡️ **Production safety** with strict validation
- 🔧 **Helper functions** for easy access to configuration
- 📋 **Comprehensive .env.example** for development setup
- 🧪 **Full test coverage** with Vitest

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Setup

```bash
# Copy example environment file
cp env.example .env.local

# Edit with your values
nano .env.local
```

### 3. Basic Usage

```typescript
import { validateEnv, env } from '@tdc/config';

// Validate environment (exits on error in production)
const environment = validateEnv();

// Or use safe validation (returns errors instead of exiting)
import { safeValidateEnv } from '@tdc/config';
const { success, env, errors } = safeValidateEnv();

// Use helper functions
const isDev = env.isDevelopment();
const dbUrl = env.getDatabaseUrl();
const s3Config = env.getS3Config();
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `S3_ENDPOINT` | S3-compatible storage endpoint | `https://s3.wasabisys.com` |
| `S3_BUCKET` | S3 bucket name | `tdc-market-dev` |
| `S3_KEY` | S3 access key ID | `your-access-key` |
| `S3_SECRET` | S3 secret access key | `your-secret-key` |
| `PAYMENT_MERCHANT_ID` | Payment gateway merchant ID | `merchant-123` |
| `PAYMENT_KEY` | Payment gateway API key | `payment-key` |
| `PAYMENT_SECRET` | Payment gateway secret | `payment-secret` |
| `NEXTAUTH_SECRET` | NextAuth.js secret (min 32 chars) | `your-secret-32-chars` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | Uses `NEXTAUTH_SECRET` | JWT signing secret |
| `NODE_ENV` | `development` | Application environment |
| `PORT` | `3000` | Application port |
| `LOG_LEVEL` | `info` | Logging level |
| `ENABLE_ANALYTICS` | `false` | Enable analytics |
| `ENABLE_PWA` | `true` | Enable PWA features |
| `ENABLE_AI` | `false` | Enable AI features |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public site URL |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://localhost:3001` | CORS origins |

## API Reference

### Environment Validation

#### `validateEnv(): Environment`
Validates environment variables and returns typed configuration. Exits process on validation failure.

```typescript
import { validateEnv } from '@tdc/config';

const env = validateEnv();
console.log(env.DATABASE_URL); // Type-safe access
```

#### `safeValidateEnv(): { success: boolean; env?: Environment; errors?: string[] }`
Safe validation that returns errors instead of exiting.

```typescript
import { safeValidateEnv } from '@tdc/config';

const result = safeValidateEnv();
if (result.success) {
  console.log('Environment is valid:', result.env);
} else {
  console.log('Validation errors:', result.errors);
}
```

### Helper Functions

#### `env.isDevelopment(): boolean`
Check if running in development mode.

#### `env.isProduction(): boolean`
Check if running in production mode.

#### `env.getDatabaseUrl(): string`
Get validated database URL.

#### `env.getS3Config(): S3Config`
Get S3 configuration object.

```typescript
const s3Config = env.getS3Config();
// { endpoint, bucket, accessKeyId, secretAccessKey }
```

#### `env.getPaymentConfig(): PaymentConfig`
Get payment configuration object.

```typescript
const paymentConfig = env.getPaymentConfig();
// { merchantId, key, secret }
```

#### `env.getFeatureFlags(): FeatureFlags`
Get feature flags configuration.

```typescript
const features = env.getFeatureFlags();
// { analytics: boolean, pwa: boolean, ai: boolean }
```

#### `env.isFeatureEnabled(feature: string): boolean`
Check if a specific feature is enabled.

```typescript
if (env.isFeatureEnabled('analytics')) {
  // Initialize analytics
}
```

## Development

### Scripts

```bash
# Build package
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run environment demo
pnpm demo:env

# Validate environment
pnpm validate:env

# Type check
pnpm type-check

# Lint
pnpm lint
```

### Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test env.test.ts

# Run tests with coverage
pnpm test --coverage
```

### Environment Demo

```bash
# Run interactive environment demo
pnpm demo:env
```

This will show:
- Environment validation status
- Configuration summary
- Feature flags status
- Error messages for missing variables

## Error Handling

### Development Mode
- Shows detailed error messages
- Continues execution with warnings
- Provides helpful suggestions

### Production Mode
- Exits process on validation failure
- Shows security-focused error messages
- Prevents application startup with invalid config

## Examples

### Basic Usage in Application

```typescript
// src/app.ts
import { validateEnv, env } from '@tdc/config';

// Validate environment at startup
const environment = validateEnv();

// Use throughout application
if (env.isDevelopment()) {
  console.log('Running in development mode');
}

const dbUrl = env.getDatabaseUrl();
const s3Config = env.getS3Config();
```

### Adapter Configuration

```typescript
// src/adapters/s3.adapter.ts
import { env } from '@tdc/config';

export class S3Adapter {
  constructor() {
    const config = env.getS3Config();
    // Use config.endpoint, config.bucket, etc.
  }
}
```

### Feature Flags

```typescript
// src/features/analytics.ts
import { env } from '@tdc/config';

if (env.isFeatureEnabled('analytics')) {
  // Initialize analytics
  initializeAnalytics();
}
```

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique secrets for production
- Consider using a secrets management service for production
- Rotate secrets regularly
- Use different secrets for different environments

## Troubleshooting

### Common Issues

1. **"Environment validation failed"**
   - Check that all required variables are set
   - Verify variable names match exactly
   - Ensure values meet validation requirements

2. **"S3_BUCKET must contain only lowercase letters"**
   - S3 bucket names must be lowercase
   - Can contain numbers, dots, and hyphens
   - Must be globally unique

3. **"NEXTAUTH_SECRET must be at least 32 characters"**
   - Generate a strong secret: `openssl rand -base64 32`
   - Use a password manager to store securely

### Getting Help

- Check the `.env.example` file for reference
- Run `pnpm demo:env` to see current configuration
- Review error messages for specific validation failures
- Ensure all required services are running (PostgreSQL, Redis, etc.)

## License

MIT License - see LICENSE file for details.

