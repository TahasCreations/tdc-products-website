import { Environment } from './schema.js';

// Environment helper functions
export class EnvHelper {
  private static env: Environment | null = null;

  /**
   * Get validated environment variables
   * This should be called once at application startup
   */
  static getEnv(): Environment {
    if (!this.env) {
      const { validateEnv } = require('./schema.js');
      this.env = validateEnv();
    }
    return this.env;
  }

  /**
   * Check if running in development
   */
  static isDevelopment(): boolean {
    return this.getEnv().NODE_ENV === 'development';
  }

  /**
   * Check if running in production
   */
  static isProduction(): boolean {
    return this.getEnv().NODE_ENV === 'production';
  }

  /**
   * Check if running in staging
   */
  static isStaging(): boolean {
    return this.getEnv().NODE_ENV === 'staging';
  }

  /**
   * Get database URL
   */
  static getDatabaseUrl(): string {
    return this.getEnv().DATABASE_URL;
  }

  /**
   * Get Redis URL
   */
  static getRedisUrl(): string {
    return this.getEnv().REDIS_URL;
  }

  /**
   * Get S3 configuration
   */
  static getS3Config() {
    const env = this.getEnv();
    return {
      endpoint: env.S3_ENDPOINT,
      bucket: env.S3_BUCKET,
      accessKeyId: env.S3_KEY,
      secretAccessKey: env.S3_SECRET,
    };
  }

  /**
   * Get payment configuration
   */
  static getPaymentConfig() {
    const env = this.getEnv();
    return {
      merchantId: env.PAYMENT_MERCHANT_ID,
      key: env.PAYMENT_KEY,
      secret: env.PAYMENT_SECRET,
    };
  }

  /**
   * Get authentication configuration
   */
  static getAuthConfig() {
    const env = this.getEnv();
    return {
      nextAuthSecret: env.NEXTAUTH_SECRET,
      jwtSecret: env.JWT_SECRET || env.NEXTAUTH_SECRET,
    };
  }

  /**
   * Get feature flags
   */
  static getFeatureFlags() {
    const env = this.getEnv();
    return {
      analytics: env.ENABLE_ANALYTICS,
      pwa: env.ENABLE_PWA,
      ai: env.ENABLE_AI,
    };
  }

  /**
   * Get site configuration
   */
  static getSiteConfig() {
    const env = this.getEnv();
    return {
      url: env.NEXT_PUBLIC_SITE_URL,
      allowedOrigins: env.ALLOWED_ORIGINS,
    };
  }

  /**
   * Get application configuration
   */
  static getAppConfig() {
    const env = this.getEnv();
    return {
      port: env.PORT,
      nodeEnv: env.NODE_ENV,
      logLevel: env.LOG_LEVEL,
    };
  }

  /**
   * Check if a feature is enabled
   */
  static isFeatureEnabled(feature: keyof ReturnType<typeof this.getFeatureFlags>): boolean {
    const flags = this.getFeatureFlags();
    return flags[feature];
  }

  /**
   * Get environment summary for logging
   */
  static getEnvSummary() {
    const env = this.getEnv();
    return {
      nodeEnv: env.NODE_ENV,
      port: env.PORT,
      logLevel: env.LOG_LEVEL,
      features: this.getFeatureFlags(),
      database: {
        url: env.DATABASE_URL.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
      },
      redis: {
        url: env.REDIS_URL.replace(/\/\/.*@/, '//***:***@'), // Hide credentials
      },
      s3: {
        endpoint: env.S3_ENDPOINT,
        bucket: env.S3_BUCKET,
      },
      payment: {
        merchantId: env.PAYMENT_MERCHANT_ID,
        hasKey: !!env.PAYMENT_KEY,
        hasSecret: !!env.PAYMENT_SECRET,
      },
    };
  }
}

// Export singleton instance
export const env = EnvHelper;

