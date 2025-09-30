import express from 'express';
import { z } from 'zod';
import { WebhookAdapter } from '../../../packages/infra/src/webhook/webhook.adapter.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const webhookAdapter = new WebhookAdapter(prisma);

// Validation schemas
const CreateWebhookSubscriptionSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  url: z.string().url(),
  secret: z.string().min(16),
  events: z.array(z.string()),
  verifySsl: z.boolean().default(true),
  includeHeaders: z.boolean().default(true),
  customHeaders: z.record(z.string()).optional(),
  maxRetries: z.number().int().min(0).max(10).default(3),
  retryDelay: z.number().int().min(100).max(60000).default(1000),
  retryBackoff: z.number().min(1).max(5).default(2.0),
  timeout: z.number().int().min(1000).max(300000).default(30000),
  metadata: z.record(z.any()).optional()
});

const UpdateWebhookSubscriptionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  url: z.string().url().optional(),
  secret: z.string().min(16).optional(),
  events: z.array(z.string()).optional(),
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

const CreateWebhookEventSchema = z.object({
  eventType: z.string(),
  eventVersion: z.string().default('1.0'),
  source: z.string(),
  data: z.record(z.any()),
  metadata: z.record(z.any()).optional()
});

const WebhookFiltersSchema = z.object({
  isActive: z.boolean().optional(),
  isHealthy: z.boolean().optional(),
  events: z.array(z.string()).optional(),
  status: z.string().optional(),
  eventType: z.string().optional(),
  subscriptionId: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0)
});

// Middleware to extract tenant ID (assuming it's in headers or JWT)
const extractTenantId = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // In a real implementation, this would extract tenant ID from JWT token or headers
  const tenantId = req.headers['x-tenant-id'] as string || 'default-tenant';
  req.tenantId = tenantId;
  next();
};

// Webhook Subscriptions
router.post('/subscriptions', extractTenantId, async (req, res) => {
  try {
    const input = CreateWebhookSubscriptionSchema.parse(req.body);
    const subscription = await webhookAdapter.createSubscription({
      ...input,
      tenantId: req.tenantId
    });
    
    res.status(201).json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error creating webhook subscription:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/subscriptions', extractTenantId, async (req, res) => {
  try {
    const filters = WebhookFiltersSchema.parse(req.query);
    const subscriptions = await webhookAdapter.getSubscriptions(req.tenantId, filters);
    
    res.json({
      success: true,
      data: subscriptions
    });
  } catch (error) {
    console.error('Error getting webhook subscriptions:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/subscriptions/:id', extractTenantId, async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await webhookAdapter.getSubscription(id, req.tenantId);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }
    
    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error getting webhook subscription:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.put('/subscriptions/:id', extractTenantId, async (req, res) => {
  try {
    const { id } = req.params;
    const input = UpdateWebhookSubscriptionSchema.parse(req.body);
    const subscription = await webhookAdapter.updateSubscription(id, req.tenantId, input);
    
    res.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error updating webhook subscription:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.delete('/subscriptions/:id', extractTenantId, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await webhookAdapter.deleteSubscription(id, req.tenantId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Subscription deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting webhook subscription:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/subscriptions/:id/test', extractTenantId, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await webhookAdapter.testSubscription(id, req.tenantId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error testing webhook subscription:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Webhook Events
router.post('/events', extractTenantId, async (req, res) => {
  try {
    const input = CreateWebhookEventSchema.parse(req.body);
    const event = await webhookAdapter.createEvent({
      ...input,
      tenantId: req.tenantId
    });
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error creating webhook event:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/events', extractTenantId, async (req, res) => {
  try {
    const filters = WebhookFiltersSchema.parse(req.query);
    const events = await webhookAdapter.getEvents(req.tenantId, filters);
    
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error getting webhook events:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/events/:id', extractTenantId, async (req, res) => {
  try {
    const { id } = req.params;
    const event = await webhookAdapter.getEvent(id, req.tenantId);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error getting webhook event:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/events/:id/process', extractTenantId, async (req, res) => {
  try {
    const { id } = req.params;
    await webhookAdapter.processEvent(id, req.tenantId);
    
    res.json({
      success: true,
      message: 'Event processed successfully'
    });
  } catch (error) {
    console.error('Error processing webhook event:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Webhook Deliveries
router.get('/deliveries', extractTenantId, async (req, res) => {
  try {
    const filters = WebhookFiltersSchema.parse(req.query);
    const deliveries = await webhookAdapter.getDeliveries(req.tenantId, filters);
    
    res.json({
      success: true,
      data: deliveries
    });
  } catch (error) {
    console.error('Error getting webhook deliveries:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/deliveries/:id', extractTenantId, async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await webhookAdapter.getDelivery(id, req.tenantId);
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        error: 'Delivery not found'
      });
    }
    
    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Error getting webhook delivery:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/deliveries/:id/retry', extractTenantId, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await webhookAdapter.retryDelivery(id, req.tenantId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error retrying webhook delivery:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/deliveries/:id/cancel', extractTenantId, async (req, res) => {
  try {
    const { id } = req.params;
    const success = await webhookAdapter.cancelDelivery(id, req.tenantId);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Delivery not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Delivery cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling webhook delivery:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Webhook Statistics
router.get('/stats', extractTenantId, async (req, res) => {
  try {
    const stats = await webhookAdapter.getWebhookStats(req.tenantId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting webhook stats:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Webhook Health Check
router.get('/health', extractTenantId, async (req, res) => {
  try {
    const stats = await webhookAdapter.getWebhookStats(req.tenantId);
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      stats: {
        totalSubscriptions: stats.totalSubscriptions,
        activeSubscriptions: stats.activeSubscriptions,
        healthySubscriptions: stats.healthySubscriptions,
        successRate: stats.successRate
      }
    };
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Error checking webhook health:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// HMAC Signature Generation
router.post('/signature/generate', async (req, res) => {
  try {
    const { payload, secret, method = 'sha256' } = req.body;
    
    if (!payload || !secret) {
      return res.status(400).json({
        success: false,
        error: 'Payload and secret are required'
      });
    }
    
    const signature = await webhookAdapter.generateHmacSignature(payload, secret, method);
    
    res.json({
      success: true,
      data: signature
    });
  } catch (error) {
    console.error('Error generating HMAC signature:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// HMAC Signature Verification
router.post('/signature/verify', async (req, res) => {
  try {
    const { payload, signature, secret, method = 'sha256' } = req.body;
    
    if (!payload || !signature || !secret) {
      return res.status(400).json({
        success: false,
        error: 'Payload, signature, and secret are required'
      });
    }
    
    const isValid = await webhookAdapter.verifyHmacSignature(payload, signature, secret, method);
    
    res.json({
      success: true,
      data: { valid: isValid }
    });
  } catch (error) {
    console.error('Error verifying HMAC signature:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Process Pending Deliveries
router.post('/process-pending', extractTenantId, async (req, res) => {
  try {
    await webhookAdapter.processPendingDeliveries(req.tenantId);
    
    res.json({
      success: true,
      message: 'Pending deliveries processed'
    });
  } catch (error) {
    console.error('Error processing pending deliveries:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;

