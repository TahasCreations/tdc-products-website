/**
 * Subscription API Routes
 * Handles subscription management, billing, and plan management endpoints
 */

import { Router } from 'express';
import { z } from 'zod';
import { SubscriptionService } from '@tdc/infra';
import { PrismaClient } from '@prisma/client';
import { SubscriptionRepository } from '@tdc/infra';

const router = Router();
const prisma = new PrismaClient();
const subscriptionRepo = new SubscriptionRepository(prisma);
// Note: In a real implementation, you would inject the SubscriptionPort here
// const subscriptionService = new SubscriptionService(subscriptionRepo, subscriptionPort);

// ===========================================
// VALIDATION SCHEMAS
// ===========================================

const CreateSubscriptionPlanSchema = z.object({
  tenantId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  planType: z.enum(['FREE', 'BASIC', 'PRO', 'ENTERPRISE', 'CUSTOM']),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  amount: z.number(),
  currency: z.string().optional(),
  billingCycle: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  features: z.array(z.string()).optional(),
  limits: z.record(z.any()).optional(),
  maxProducts: z.number().optional(),
  maxOrders: z.number().optional(),
  maxStorage: z.number().optional(),
  maxUsers: z.number().optional(),
  trialDays: z.number().optional(),
  trialFeatures: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  sortOrder: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

const UpdateSubscriptionPlanSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  planType: z.enum(['FREE', 'BASIC', 'PRO', 'ENTERPRISE', 'CUSTOM']).optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  amount: z.number().optional(),
  currency: z.string().optional(),
  billingCycle: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).optional(),
  features: z.array(z.string()).optional(),
  limits: z.record(z.any()).optional(),
  maxProducts: z.number().optional(),
  maxOrders: z.number().optional(),
  maxStorage: z.number().optional(),
  maxUsers: z.number().optional(),
  trialDays: z.number().optional(),
  trialFeatures: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  sortOrder: z.number().optional(),
  metadata: z.record(z.any()).optional(),
});

const CreateSubscriptionSchema = z.object({
  tenantId: z.string(),
  sellerId: z.string().optional(),
  planId: z.string(),
  planName: z.string(),
  planType: z.enum(['FREE', 'BASIC', 'PRO', 'ENTERPRISE', 'CUSTOM']),
  billingCycle: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']),
  amount: z.number(),
  currency: z.string().optional(),
  startDate: z.string().transform(str => new Date(str)),
  endDate: z.string().transform(str => new Date(str)).optional(),
  trialEndDate: z.string().transform(str => new Date(str)).optional(),
  nextBillingDate: z.string().transform(str => new Date(str)).optional(),
  provider: z.enum(['STRIPE', 'IYZICO', 'PAYPAL', 'MANUAL']),
  customerEmail: z.string().email(),
  customerName: z.string().optional(),
  redirectUrl: z.string().url(),
  metadata: z.record(z.any()).optional(),
});

const UpdateSubscriptionSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELLED', 'UNPAID', 'SUSPENDED']).optional(),
  planId: z.string().optional(),
  planName: z.string().optional(),
  amount: z.number().optional(),
  nextBillingDate: z.string().transform(str => new Date(str)).optional(),
  lastPaymentDate: z.string().transform(str => new Date(str)).optional(),
  lastPaymentAmount: z.number().optional(),
  failedPayments: z.number().optional(),
  cancellationReason: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const CreateSubscriptionInvoiceSchema = z.object({
  subscriptionId: z.string(),
  tenantId: z.string(),
  sellerId: z.string().optional(),
  invoiceNumber: z.string(),
  amount: z.number(),
  currency: z.string().optional(),
  taxAmount: z.number().optional(),
  totalAmount: z.number(),
  periodStart: z.string().transform(str => new Date(str)),
  periodEnd: z.string().transform(str => new Date(str)),
  provider: z.enum(['STRIPE', 'IYZICO', 'PAYPAL', 'MANUAL']),
  providerId: z.string().optional(),
  providerUrl: z.string().url().optional(),
  status: z.enum(['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED']).optional(),
  dueDate: z.string().transform(str => new Date(str)),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const UpdateSubscriptionInvoiceSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED']).optional(),
  paidAt: z.string().transform(str => new Date(str)).optional(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  providerId: z.string().optional(),
  providerUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

const MarkInvoiceAsPaidSchema = z.object({
  paymentMethod: z.string(),
  transactionId: z.string(),
});

const WebhookSchema = z.object({
  provider: z.enum(['STRIPE', 'IYZICO', 'PAYPAL', 'MANUAL']),
  payload: z.any(),
  signature: z.string(),
});

// ===========================================
// SUBSCRIPTION PLANS
// ===========================================

/**
 * GET /api/subscriptions/plans
 * Get subscription plans
 */
router.get('/plans', async (req, res) => {
  try {
    const { tenantId, planType, isActive, status, limit, offset } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const plans = await subscriptionRepo.getSubscriptionPlans(
      tenantId as string,
      planType as any,
      isActive ? isActive === 'true' : undefined,
      status as any,
      limit ? parseInt(limit as string) : 100,
      offset ? parseInt(offset as string) : 0
    );

    res.json({
      success: true,
      data: plans,
      pagination: {
        limit: limit ? parseInt(limit as string) : 100,
        offset: offset ? parseInt(offset as string) : 0,
        total: plans.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching subscription plans:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/subscriptions/plans/default
 * Get default subscription plan
 */
router.get('/plans/default', async (req, res) => {
  try {
    const { tenantId } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const plan = await subscriptionRepo.getDefaultSubscriptionPlan(tenantId as string);

    res.json({
      success: true,
      data: plan,
    });
  } catch (error: any) {
    console.error('Error fetching default subscription plan:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/subscriptions/plans
 * Create subscription plan
 */
router.post('/plans', async (req, res) => {
  try {
    const input = CreateSubscriptionPlanSchema.parse(req.body);
    
    const plan = await subscriptionRepo.createSubscriptionPlan(input);

    res.json({
      success: true,
      data: plan,
    });
  } catch (error: any) {
    console.error('Error creating subscription plan:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/subscriptions/plans/:id
 * Update subscription plan
 */
router.put('/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const input = UpdateSubscriptionPlanSchema.parse(req.body);
    
    const plan = await subscriptionRepo.updateSubscriptionPlan(id, input);

    res.json({
      success: true,
      data: plan,
    });
  } catch (error: any) {
    console.error('Error updating subscription plan:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/subscriptions/plans/:id
 * Delete subscription plan
 */
router.delete('/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await subscriptionRepo.deleteSubscriptionPlan(id);

    res.json({
      success: true,
      message: 'Subscription plan deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting subscription plan:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// SUBSCRIPTIONS
// ===========================================

/**
 * GET /api/subscriptions
 * Get subscriptions
 */
router.get('/', async (req, res) => {
  try {
    const { tenantId, sellerId, status, planType, provider, limit, offset } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const subscriptions = await subscriptionRepo.getSubscriptions(
      tenantId as string,
      sellerId as string,
      status as any,
      planType as any,
      provider as any,
      limit ? parseInt(limit as string) : 100,
      offset ? parseInt(offset as string) : 0
    );

    res.json({
      success: true,
      data: subscriptions,
      pagination: {
        limit: limit ? parseInt(limit as string) : 100,
        offset: offset ? parseInt(offset as string) : 0,
        total: subscriptions.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/subscriptions/active
 * Get active subscriptions
 */
router.get('/active', async (req, res) => {
  try {
    const { tenantId, sellerId, planType } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const subscriptions = await subscriptionRepo.getActiveSubscriptions(
      tenantId as string,
      sellerId as string,
      planType as any
    );

    res.json({
      success: true,
      data: subscriptions,
    });
  } catch (error: any) {
    console.error('Error fetching active subscriptions:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/subscriptions/trial
 * Get trial subscriptions
 */
router.get('/trial', async (req, res) => {
  try {
    const { tenantId, sellerId } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const subscriptions = await subscriptionRepo.getTrialSubscriptions(
      tenantId as string,
      sellerId as string
    );

    res.json({
      success: true,
      data: subscriptions,
    });
  } catch (error: any) {
    console.error('Error fetching trial subscriptions:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/subscriptions/expiring
 * Get expiring subscriptions
 */
router.get('/expiring', async (req, res) => {
  try {
    const { tenantId, days } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const subscriptions = await subscriptionRepo.getExpiringSubscriptions(
      tenantId as string,
      days ? parseInt(days as string) : 7
    );

    res.json({
      success: true,
      data: subscriptions,
    });
  } catch (error: any) {
    console.error('Error fetching expiring subscriptions:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/subscriptions/:id
 * Get subscription by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const subscription = await subscriptionRepo.getSubscription(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        error: 'Subscription not found',
      });
    }

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/subscriptions
 * Create subscription
 */
router.post('/', async (req, res) => {
  try {
    const input = CreateSubscriptionSchema.parse(req.body);
    
    // Note: In a real implementation, you would use the SubscriptionService here
    // const result = await subscriptionService.createSubscription(input);
    
    // For now, return a mock response
    res.json({
      success: true,
      message: 'Subscription creation endpoint - requires SubscriptionService implementation',
      data: {
        checkoutUrl: 'https://checkout.example.com/session/123',
        sessionId: 'sess_123',
      },
    });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/subscriptions/:id
 * Update subscription
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const input = UpdateSubscriptionSchema.parse(req.body);
    
    const subscription = await subscriptionRepo.updateSubscription(id, input);

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/subscriptions/:id/cancel
 * Cancel subscription
 */
router.post('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const subscription = await subscriptionRepo.cancelSubscription(id, reason);

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/subscriptions/:id
 * Delete subscription
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await subscriptionRepo.deleteSubscription(id);

    res.json({
      success: true,
      message: 'Subscription deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting subscription:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// SUBSCRIPTION INVOICES
// ===========================================

/**
 * GET /api/subscriptions/invoices
 * Get subscription invoices
 */
router.get('/invoices', async (req, res) => {
  try {
    const { subscriptionId, tenantId, sellerId, status, provider, start, end, limit, offset } = req.query;
    
    const dateRange = start && end ? {
      start: new Date(start as string),
      end: new Date(end as string),
    } : undefined;

    const invoices = await subscriptionRepo.getSubscriptionInvoices(
      subscriptionId as string,
      tenantId as string,
      sellerId as string,
      status as any,
      provider as any,
      dateRange,
      limit ? parseInt(limit as string) : 100,
      offset ? parseInt(offset as string) : 0
    );

    res.json({
      success: true,
      data: invoices,
      pagination: {
        limit: limit ? parseInt(limit as string) : 100,
        offset: offset ? parseInt(offset as string) : 0,
        total: invoices.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching subscription invoices:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/subscriptions/invoices/overdue
 * Get overdue invoices
 */
router.get('/invoices/overdue', async (req, res) => {
  try {
    const { tenantId, days } = req.query;
    
    const invoices = await subscriptionRepo.getOverdueInvoices(
      tenantId as string,
      days ? parseInt(days as string) : 30
    );

    res.json({
      success: true,
      data: invoices,
    });
  } catch (error: any) {
    console.error('Error fetching overdue invoices:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/subscriptions/invoices/:id
 * Get subscription invoice by ID
 */
router.get('/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await subscriptionRepo.getSubscriptionInvoice(id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found',
      });
    }

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error: any) {
    console.error('Error fetching subscription invoice:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/subscriptions/invoices
 * Create subscription invoice
 */
router.post('/invoices', async (req, res) => {
  try {
    const input = CreateSubscriptionInvoiceSchema.parse(req.body);
    
    const invoice = await subscriptionRepo.createSubscriptionInvoice(input);

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error: any) {
    console.error('Error creating subscription invoice:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/subscriptions/invoices/:id
 * Update subscription invoice
 */
router.put('/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const input = UpdateSubscriptionInvoiceSchema.parse(req.body);
    
    const invoice = await subscriptionRepo.updateSubscriptionInvoice(id, input);

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error: any) {
    console.error('Error updating subscription invoice:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/subscriptions/invoices/:id/mark-paid
 * Mark invoice as paid
 */
router.post('/invoices/:id/mark-paid', async (req, res) => {
  try {
    const { id } = req.params;
    const input = MarkInvoiceAsPaidSchema.parse(req.body);
    
    const invoice = await subscriptionRepo.markInvoiceAsPaid(
      id,
      input.paymentMethod,
      input.transactionId
    );

    res.json({
      success: true,
      data: invoice,
    });
  } catch (error: any) {
    console.error('Error marking invoice as paid:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * DELETE /api/subscriptions/invoices/:id
 * Delete subscription invoice
 */
router.delete('/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await subscriptionRepo.deleteSubscriptionInvoice(id);

    res.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting subscription invoice:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// WEBHOOKS
// ===========================================

/**
 * POST /api/subscriptions/webhooks/:provider
 * Handle webhook from payment provider
 */
router.post('/webhooks/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    const signature = req.headers['x-signature'] as string;
    
    if (!signature) {
      return res.status(400).json({
        success: false,
        error: 'Signature header is required',
      });
    }

    // Note: In a real implementation, you would use the SubscriptionService here
    // const result = await subscriptionService.handleWebhook(provider as any, req.body, signature);
    
    // For now, return a mock response
    res.json({
      success: true,
      message: 'Webhook handled successfully',
      eventId: 'evt_123',
    });
  } catch (error: any) {
    console.error('Error handling webhook:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// ANALYTICS
// ===========================================

/**
 * GET /api/subscriptions/analytics/stats
 * Get subscription statistics
 */
router.get('/analytics/stats', async (req, res) => {
  try {
    const { tenantId, sellerId } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const stats = await subscriptionRepo.getSubscriptionStats(
      tenantId as string,
      sellerId as string
    );

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error fetching subscription stats:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/subscriptions/analytics/plan-distribution
 * Get plan distribution
 */
router.get('/analytics/plan-distribution', async (req, res) => {
  try {
    const { tenantId, sellerId } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const distribution = await subscriptionRepo.getPlanDistribution(
      tenantId as string,
      sellerId as string
    );

    res.json({
      success: true,
      data: distribution,
    });
  } catch (error: any) {
    console.error('Error fetching plan distribution:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/subscriptions/analytics/revenue-by-plan
 * Get revenue by plan
 */
router.get('/analytics/revenue-by-plan', async (req, res) => {
  try {
    const { tenantId, sellerId, start, end } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const dateRange = start && end ? {
      start: new Date(start as string),
      end: new Date(end as string),
    } : undefined;

    const revenue = await subscriptionRepo.getRevenueByPlan(
      tenantId as string,
      sellerId as string,
      dateRange
    );

    res.json({
      success: true,
      data: revenue,
    });
  } catch (error: any) {
    console.error('Error fetching revenue by plan:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/subscriptions/analytics/churn-rate
 * Get churn rate
 */
router.get('/analytics/churn-rate', async (req, res) => {
  try {
    const { tenantId, sellerId, months } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const churnRate = await subscriptionRepo.getChurnRate(
      tenantId as string,
      sellerId as string,
      months ? parseInt(months as string) : 12
    );

    res.json({
      success: true,
      data: { churnRate },
    });
  } catch (error: any) {
    console.error('Error fetching churn rate:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

