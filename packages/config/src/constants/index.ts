// Application constants
export const APP_CONFIG = {
  name: 'TDC Market',
  version: '1.0.0',
  description: 'Modern E-commerce Platform with 3D Printing Figures',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  checkout: '/api/checkout',
  upload: '/api/upload',
  search: '/api/search',
  health: '/health',
} as const;

// Database constants
export const DB_CONFIG = {
  maxConnections: 10,
  connectionTimeout: 30000,
  queryTimeout: 60000,
} as const;

// Cache constants
export const CACHE_CONFIG = {
  defaultTTL: 3600, // 1 hour
  maxTTL: 86400, // 24 hours
  keyPrefix: 'tdc:',
} as const;

// Storage constants
export const STORAGE_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
  bucketPrefix: 'tdc-market',
} as const;

// Payment constants
export const PAYMENT_CONFIG = {
  currencies: ['TRY', 'USD', 'EUR'],
  methods: ['credit_card', 'bank_transfer', 'digital_wallet'],
  timeout: 30000, // 30 seconds
} as const;

// Search constants
export const SEARCH_CONFIG = {
  defaultLimit: 20,
  maxLimit: 100,
  defaultIndex: 'products',
} as const;

// Queue constants
export const QUEUE_CONFIG = {
  defaultConcurrency: 5,
  maxRetries: 3,
  retryDelay: 1000, // 1 second
} as const;

