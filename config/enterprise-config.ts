/**
 * Enterprise Configuration
 * All advanced systems configuration in one place
 */

export const ENTERPRISE_CONFIG = {
  // Real-time Chat
  websocket: {
    enabled: process.env.ENABLE_WEBSOCKET === 'true',
    port: parseInt(process.env.WEBSOCKET_PORT || '3100'),
    cors: {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
  },

  // Machine Learning
  ml: {
    enabled: process.env.ENABLE_ML === 'true',
    modelPath: '/models/recommendation-model.json',
    retrainInterval: 24 * 60 * 60 * 1000, // 24 hours
    minDataPoints: 1000,
    batchSize: 32,
    epochs: 10,
  },

  // Fraud Detection
  fraud: {
    enabled: process.env.ENABLE_FRAUD_DETECTION === 'true',
    riskThresholds: {
      low: 30,
      medium: 60,
      high: 80,
      critical: 95,
    },
    autoBlock: process.env.AUTO_BLOCK_FRAUD === 'true',
    manualReviewThreshold: 70,
  },

  // Queue System
  queue: {
    enabled: process.env.ENABLE_QUEUE === 'true',
    concurrency: {
      email: 5,
      sms: 3,
      imageProcessing: 2,
      analytics: 10,
    },
    retryStrategy: {
      attempts: 3,
      backoff: 'exponential',
      delay: 1000,
    },
  },

  // Elasticsearch
  search: {
    enabled: process.env.ENABLE_ELASTICSEARCH === 'true',
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    indexName: 'tdc-products',
    fuzzyMatching: true,
    autocomplete: true,
  },

  // Predictive Inventory
  inventory: {
    enabled: process.env.ENABLE_PREDICTIVE_INVENTORY === 'true',
    autoReorder: process.env.AUTO_REORDER === 'true',
    forecastDays: 30,
    safetyStockMultiplier: 1.5,
  },

  // Analytics
  analytics: {
    realtime: process.env.ENABLE_REALTIME_ANALYTICS === 'true',
    bigquery: {
      projectId: process.env.GCP_PROJECT_ID,
      dataset: 'analytics',
    },
    mixpanel: {
      token: process.env.MIXPANEL_TOKEN,
    },
    segment: {
      writeKey: process.env.SEGMENT_WRITE_KEY,
    },
  },

  // SEO
  seo: {
    dynamicGeneration: true,
    autoSitemap: true,
    structuredData: true,
    socialMediaPreview: true,
  },

  // CDN
  cdn: {
    providers: ['cloudflare', 'fastly', 'cloudfront'],
    primaryProvider: 'cloudflare',
    failoverEnabled: true,
    caching: {
      images: 365 * 24 * 60 * 60, // 1 year
      static: 365 * 24 * 60 * 60, // 1 year
      api: 60, // 1 minute
      pages: 300, // 5 minutes
    },
  },

  // Microservices
  microservices: {
    enabled: process.env.ENABLE_MICROSERVICES === 'true',
    services: {
      products: process.env.PRODUCT_SERVICE_URL,
      orders: process.env.ORDER_SERVICE_URL,
      payments: process.env.PAYMENT_SERVICE_URL,
      notifications: process.env.NOTIFICATION_SERVICE_URL,
    },
    circuitBreaker: {
      failureThreshold: 5,
      cooldownPeriod: 60000, // 1 minute
      halfOpenAttempts: 1,
    },
  },

  // Performance
  performance: {
    enableCompression: true,
    enableHTTP2: true,
    enableBrotli: true,
    imageOptimization: {
      formats: ['webp', 'avif'],
      quality: 85,
      lazyLoading: true,
    },
    codesplitting: true,
    prefetchPages: true,
  },

  // Security
  security: {
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
    },
    csrfProtection: true,
    xssProtection: true,
    contentSecurityPolicy: true,
    ddosProtection: true,
  },

  // Monitoring
  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0.1,
    },
    newRelic: {
      licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
      appName: 'TDC Market',
    },
    datadog: {
      apiKey: process.env.DATADOG_API_KEY,
      site: 'datadoghq.eu',
    },
  },
};

/**
 * Feature flags for gradual rollout
 */
export const FEATURE_FLAGS = {
  realtimeChat: process.env.FF_REALTIME_CHAT === 'true',
  mlRecommendations: process.env.FF_ML_RECOMMENDATIONS === 'true',
  fraudDetection: process.env.FF_FRAUD_DETECTION === 'true',
  elasticsearchSearch: process.env.FF_ELASTICSEARCH === 'true',
  predictiveInventory: process.env.FF_PREDICTIVE_INVENTORY === 'true',
  nftCertificates: process.env.FF_NFT === 'true',
  auctionSystem: process.env.FF_AUCTION === 'true',
  subscriptionBox: process.env.FF_SUBSCRIPTION === 'true',
  communityFeatures: process.env.FF_COMMUNITY === 'true',
  giftCards: process.env.FF_GIFT_CARDS === 'true',
  spinToWin: process.env.FF_SPIN_TO_WIN === 'true',
};

export default ENTERPRISE_CONFIG;

