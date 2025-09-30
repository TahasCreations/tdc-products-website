import { z } from 'zod';

// Webhook Event Types
export const WebhookEventType = z.enum([
  'order.created',
  'order.updated',
  'order.cancelled',
  'order.completed',
  'order.paid',
  'order.settled',
  'product.created',
  'product.updated',
  'product.deleted',
  'product.flagged',
  'customer.created',
  'customer.updated',
  'seller.created',
  'seller.updated',
  'payment.created',
  'payment.completed',
  'payment.failed',
  'settlement.created',
  'settlement.completed',
  'webhook.test'
]);

export type WebhookEventType = z.infer<typeof WebhookEventType>;

// Webhook Status
export const WebhookStatus = z.enum([
  'PENDING',
  'SENDING',
  'DELIVERED',
  'FAILED',
  'RETRYING',
  'CANCELLED',
  'EXPIRED'
]);

export type WebhookStatus = z.infer<typeof WebhookStatus>;

// Webhook Subscription Input
export const WebhookSubscriptionInput = z.object({
  tenantId: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  url: z.string().url(),
  secret: z.string().min(16),
  events: z.array(WebhookEventType),
  verifySsl: z.boolean().default(true),
  includeHeaders: z.boolean().default(true),
  customHeaders: z.record(z.string()).optional(),
  maxRetries: z.number().int().min(0).max(10).default(3),
  retryDelay: z.number().int().min(100).max(60000).default(1000),
  retryBackoff: z.number().min(1).max(5).default(2.0),
  timeout: z.number().int().min(1000).max(300000).default(30000),
  metadata: z.record(z.any()).optional()
});

export type WebhookSubscriptionInput = z.infer<typeof WebhookSubscriptionInput>;

// Webhook Subscription Update
export const WebhookSubscriptionUpdateInput = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  secret: z.string().min(16).optional(),
  events: z.array(WebhookEventType).optional(),
  verifySsl: z.boolean().optional(),
  includeHeaders: z.boolean().optional(),
  customHeaders: z.record(z.string()).optional(),
  maxRetries: z.number().int().min(0).max(10).optional(),
  retryDelay: z.number().int().min(100).max(60000).optional(),
  retryBackoff: z.number().min(1).max(5).optional(),
  timeout: z.number().int().min(1000).max(300000).optional(),
  isActive: z.boolean().optional(),
  metadata: z.record(z.any()).optional()
});

export type WebhookSubscriptionUpdateInput = z.infer<typeof WebhookSubscriptionUpdateInput>;

// Webhook Subscription Output
export const WebhookSubscriptionOutput = z.object({
  id: z.string(),
  tenantId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  url: z.string(),
  events: z.array(WebhookEventType),
  verifySsl: z.boolean(),
  includeHeaders: z.boolean(),
  customHeaders: z.record(z.string()).nullable(),
  maxRetries: z.number(),
  retryDelay: z.number(),
  retryBackoff: z.number(),
  timeout: z.number(),
  isActive: z.boolean(),
  isHealthy: z.boolean(),
  lastDeliveryAt: z.date().nullable(),
  lastSuccessAt: z.date().nullable(),
  lastFailureAt: z.date().nullable(),
  consecutiveFailures: z.number(),
  totalDeliveries: z.number(),
  successfulDeliveries: z.number(),
  failedDeliveries: z.number(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type WebhookSubscriptionOutput = z.infer<typeof WebhookSubscriptionOutput>;

// Webhook Delivery Input
export const WebhookDeliveryInput = z.object({
  subscriptionId: z.string(),
  tenantId: z.string(),
  eventType: z.string(),
  eventId: z.string(),
  payload: z.record(z.any()),
  headers: z.record(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

export type WebhookDeliveryInput = z.infer<typeof WebhookDeliveryInput>;

// Webhook Delivery Output
export const WebhookDeliveryOutput = z.object({
  id: z.string(),
  subscriptionId: z.string(),
  tenantId: z.string(),
  eventType: z.string(),
  eventId: z.string(),
  payload: z.record(z.any()),
  headers: z.record(z.string()).nullable(),
  status: WebhookStatus,
  httpStatus: z.number().int().nullable(),
  responseBody: z.string().nullable(),
  responseHeaders: z.record(z.string()).nullable(),
  attemptCount: z.number(),
  maxRetries: z.number(),
  nextRetryAt: z.date().nullable(),
  startedAt: z.date().nullable(),
  completedAt: z.date().nullable(),
  duration: z.number().int().nullable(),
  errorMessage: z.string().nullable(),
  errorCode: z.string().nullable(),
  errorDetails: z.record(z.any()).nullable(),
  signature: z.string().nullable(),
  signatureMethod: z.string().nullable(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type WebhookDeliveryOutput = z.infer<typeof WebhookDeliveryOutput>;

// Webhook Event Input
export const WebhookEventInput = z.object({
  tenantId: z.string(),
  eventType: z.string(),
  eventVersion: z.string().default('1.0'),
  source: z.string(),
  data: z.record(z.any()),
  metadata: z.record(z.any()).optional()
});

export type WebhookEventInput = z.infer<typeof WebhookEventInput>;

// Webhook Event Output
export const WebhookEventOutput = z.object({
  id: z.string(),
  tenantId: z.string(),
  eventType: z.string(),
  eventVersion: z.string(),
  source: z.string(),
  data: z.record(z.any()),
  metadata: z.record(z.any()).nullable(),
  status: z.enum(['PENDING', 'PROCESSING', 'PROCESSED', 'FAILED', 'CANCELLED']),
  processedAt: z.date().nullable(),
  errorMessage: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type WebhookEventOutput = z.infer<typeof WebhookEventOutput>;

// HMAC Signature Result
export const HmacSignatureResult = z.object({
  signature: z.string(),
  method: z.string(),
  timestamp: z.number(),
  nonce: z.string()
});

export type HmacSignatureResult = z.infer<typeof HmacSignatureResult>;

// Webhook Delivery Result
export const WebhookDeliveryResult = z.object({
  success: z.boolean(),
  httpStatus: z.number().int().optional(),
  responseBody: z.string().optional(),
  responseHeaders: z.record(z.string()).optional(),
  duration: z.number().int(),
  errorMessage: z.string().optional(),
  errorCode: z.string().optional(),
  shouldRetry: z.boolean(),
  retryAfter: z.number().int().optional()
});

export type WebhookDeliveryResult = z.infer<typeof WebhookDeliveryResult>;

// Webhook Statistics
export const WebhookStats = z.object({
  totalSubscriptions: z.number(),
  activeSubscriptions: z.number(),
  healthySubscriptions: z.number(),
  totalDeliveries: z.number(),
  successfulDeliveries: z.number(),
  failedDeliveries: z.number(),
  pendingDeliveries: z.number(),
  averageDeliveryTime: z.number(),
  successRate: z.number(),
  eventsByType: z.record(z.number()),
  deliveriesByStatus: z.record(z.number())
});

export type WebhookStats = z.infer<typeof WebhookStats>;

// Webhook Port Interface
export interface WebhookPort {
  // Subscription Management
  createSubscription(input: WebhookSubscriptionInput): Promise<WebhookSubscriptionOutput>;
  getSubscription(id: string, tenantId: string): Promise<WebhookSubscriptionOutput | null>;
  getSubscriptions(tenantId: string, filters?: {
    isActive?: boolean;
    isHealthy?: boolean;
    events?: string[];
  }): Promise<WebhookSubscriptionOutput[]>;
  updateSubscription(id: string, tenantId: string, input: WebhookSubscriptionUpdateInput): Promise<WebhookSubscriptionOutput>;
  deleteSubscription(id: string, tenantId: string): Promise<boolean>;
  testSubscription(id: string, tenantId: string): Promise<WebhookDeliveryResult>;

  // Event Management
  createEvent(input: WebhookEventInput): Promise<WebhookEventOutput>;
  getEvent(id: string, tenantId: string): Promise<WebhookEventOutput | null>;
  getEvents(tenantId: string, filters?: {
    eventType?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<WebhookEventOutput[]>;
  processEvent(eventId: string, tenantId: string): Promise<void>;

  // Delivery Management
  createDelivery(input: WebhookDeliveryInput): Promise<WebhookDeliveryOutput>;
  getDelivery(id: string, tenantId: string): Promise<WebhookDeliveryOutput | null>;
  getDeliveries(tenantId: string, filters?: {
    subscriptionId?: string;
    status?: WebhookStatus;
    eventType?: string;
    limit?: number;
    offset?: number;
  }): Promise<WebhookDeliveryOutput[]>;
  retryDelivery(id: string, tenantId: string): Promise<WebhookDeliveryResult>;
  cancelDelivery(id: string, tenantId: string): Promise<boolean>;

  // HMAC Security
  generateHmacSignature(payload: string, secret: string, method?: string): Promise<HmacSignatureResult>;
  verifyHmacSignature(payload: string, signature: string, secret: string, method?: string): Promise<boolean>;

  // Webhook Delivery
  deliverWebhook(deliveryId: string, tenantId: string): Promise<WebhookDeliveryResult>;
  processPendingDeliveries(tenantId?: string): Promise<void>;

  // Health and Statistics
  getWebhookStats(tenantId: string): Promise<WebhookStats>;
  getSubscriptionHealth(id: string, tenantId: string): Promise<{
    isHealthy: boolean;
    lastDeliveryAt: Date | null;
    consecutiveFailures: number;
    successRate: number;
  }>;
  updateSubscriptionHealth(id: string, tenantId: string, isHealthy: boolean): Promise<void>;

  // Logging
  logWebhookEvent(level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL', message: string, context: {
    tenantId: string;
    subscriptionId?: string;
    deliveryId?: string;
    requestUrl?: string;
    requestMethod?: string;
    requestHeaders?: Record<string, string>;
    requestBody?: string;
    responseStatus?: number;
    responseHeaders?: Record<string, string>;
    responseBody?: string;
    errorCode?: string;
    errorMessage?: string;
    stackTrace?: string;
    duration?: number;
    metadata?: Record<string, any>;
  }): Promise<void>;
}

