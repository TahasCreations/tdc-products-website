/**
 * Loyalty API Routes
 * Handles loyalty points, tiers, redemptions, and analytics
 */

import express, { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { LoyaltyService } from '@tdc/infra';

const router = express.Router();
const prisma = new PrismaClient();
const loyaltyService = new LoyaltyService(prisma);

// Validation schemas
const createTierSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  level: z.number().int().min(1),
  color: z.string().optional(),
  icon: z.string().optional(),
  minPoints: z.number().int().min(0),
  maxPoints: z.number().int().min(0).optional(),
  benefits: z.array(z.any()).optional(),
  discountRate: z.number().min(0).max(100).optional(),
  freeShipping: z.boolean().optional(),
  prioritySupport: z.boolean().optional(),
  exclusiveAccess: z.boolean().optional(),
  earningMultiplier: z.number().min(0).optional(),
  bonusCategories: z.array(z.string()).optional(),
  redemptionRate: z.number().min(0).optional(),
  maxRedemptionRate: z.number().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

const redeemPointsSchema = z.object({
  orderId: z.string(),
  orderAmount: z.number().min(0),
  pointsToRedeem: z.number().int().min(1),
});

const adjustPointsSchema = z.object({
  points: z.number().int(),
  description: z.string().min(1),
  reference: z.string().optional(),
});

// ===========================================
// LOYALTY POINTS
// ===========================================

/**
 * GET /api/loyalty/customers/:customerId/points
 * Get customer loyalty points
 */
router.get('/customers/:customerId/points', async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const customerPoints = await loyaltyService.getCustomerPoints(tenantId, customerId);
    
    if (!customerPoints) {
      return res.status(404).json({ error: 'Customer loyalty points not found' });
    }

    res.json({
      success: true,
      data: customerPoints,
    });
  } catch (error: any) {
    console.error('Error getting customer points:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/loyalty/customers/:customerId/points
 * Create customer loyalty points
 */
router.post('/customers/:customerId/points', async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const customerPoints = await loyaltyService.createCustomerPoints(tenantId, customerId);

    res.status(201).json({
      success: true,
      data: customerPoints,
    });
  } catch (error: any) {
    console.error('Error creating customer points:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/loyalty/customers/:customerId/points
 * Update customer loyalty points
 */
router.put('/customers/:customerId/points', async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const { points } = req.body;
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    if (typeof points !== 'number') {
      return res.status(400).json({ error: 'Points must be a number' });
    }

    const customerPoints = await loyaltyService.updateCustomerPoints(tenantId, customerId, points);

    res.json({
      success: true,
      data: customerPoints,
    });
  } catch (error: any) {
    console.error('Error updating customer points:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/loyalty/customers/:customerId/points/redeem
 * Redeem loyalty points
 */
router.post('/customers/:customerId/points/redeem', async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const tenantId = req.headers['x-tenant-id'] as string;
    const validation = redeemPointsSchema.safeParse(req.body);

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error.errors });
    }

    const { orderId, orderAmount, pointsToRedeem } = validation.data;

    // Get redemption rules
    const redemptionRules = await loyaltyService.getRedemptionRules(tenantId);

    const result = await loyaltyService.redeemPoints(
      tenantId,
      customerId,
      orderId,
      orderAmount,
      pointsToRedeem,
      redemptionRules
    );

    if (!result.canRedeem) {
      return res.status(400).json({ 
        error: result.reason || 'Cannot redeem points',
        success: false,
      });
    }

    res.json({
      success: true,
      data: {
        pointsUsed: result.pointsUsed,
        discountAmount: result.discountAmount,
        redemption: result.redemption,
      },
    });
  } catch (error: any) {
    console.error('Error redeeming points:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/loyalty/customers/:customerId/points/adjust
 * Adjust customer points (admin only)
 */
router.post('/customers/:customerId/points/adjust', async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const tenantId = req.headers['x-tenant-id'] as string;
    const validation = adjustPointsSchema.safeParse(req.body);

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error.errors });
    }

    const { points, description, reference } = validation.data;

    // Get customer points
    const customerPoints = await loyaltyService.getCustomerPoints(tenantId, customerId);
    if (!customerPoints) {
      return res.status(404).json({ error: 'Customer loyalty points not found' });
    }

    // Create adjustment transaction
    const transaction = await loyaltyService.loyaltyRepository.createLoyaltyTransaction({
      tenantId,
      customerId,
      loyaltyPointId: customerPoints.id,
      type: 'ADJUSTED',
      points,
      description,
      reference,
      status: 'COMPLETED',
    });

    // Update customer points
    const newPoints = customerPoints.points + points;
    await loyaltyService.updateCustomerPoints(tenantId, customerId, newPoints);

    res.json({
      success: true,
      data: {
        transaction,
        newPoints,
      },
    });
  } catch (error: any) {
    console.error('Error adjusting points:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/loyalty/customers/:customerId/history
 * Get customer loyalty history
 */
router.get('/customers/:customerId/history', async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const tenantId = req.headers['x-tenant-id'] as string;
    const limit = parseInt(req.query.limit as string) || 50;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const history = await loyaltyService.getCustomerLoyaltyHistory(tenantId, customerId, limit);

    res.json({
      success: true,
      data: history,
    });
  } catch (error: any) {
    console.error('Error getting customer history:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// LOYALTY TIERS
// ===========================================

/**
 * GET /api/loyalty/tiers
 * Get all loyalty tiers
 */
router.get('/tiers', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const tiers = await loyaltyService.loyaltyRepository.getLoyaltyTiersByTenant(tenantId);

    res.json({
      success: true,
      data: tiers,
    });
  } catch (error: any) {
    console.error('Error getting loyalty tiers:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/loyalty/tiers
 * Create loyalty tier
 */
router.post('/tiers', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;
    const validation = createTierSchema.safeParse(req.body);

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error.errors });
    }

    const tier = await loyaltyService.loyaltyRepository.createLoyaltyTier({
      tenantId,
      ...validation.data,
    });

    res.status(201).json({
      success: true,
      data: tier,
    });
  } catch (error: any) {
    console.error('Error creating loyalty tier:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/loyalty/tiers/:id
 * Get loyalty tier by ID
 */
router.get('/tiers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tier = await loyaltyService.loyaltyRepository.getLoyaltyTier(id);
    
    if (!tier) {
      return res.status(404).json({ error: 'Loyalty tier not found' });
    }

    res.json({
      success: true,
      data: tier,
    });
  } catch (error: any) {
    console.error('Error getting loyalty tier:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/loyalty/tiers/:id
 * Update loyalty tier
 */
router.put('/tiers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validation = createTierSchema.partial().safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid request data', details: validation.error.errors });
    }

    const tier = await loyaltyService.loyaltyRepository.updateLoyaltyTier(id, validation.data);

    res.json({
      success: true,
      data: tier,
    });
  } catch (error: any) {
    console.error('Error updating loyalty tier:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/loyalty/tiers/:id
 * Delete loyalty tier
 */
router.delete('/tiers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await loyaltyService.loyaltyRepository.deleteLoyaltyTier(id);

    res.json({
      success: true,
      message: 'Loyalty tier deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting loyalty tier:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// ANALYTICS
// ===========================================

/**
 * GET /api/loyalty/analytics
 * Get loyalty analytics
 */
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const analytics = await loyaltyService.getLoyaltyAnalytics(tenantId, {
      start: startDate,
      end: endDate,
    });

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    console.error('Error getting loyalty analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/loyalty/customers/:customerId/status
 * Get customer loyalty status
 */
router.get('/customers/:customerId/status', async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const status = await loyaltyService.getCustomerLoyaltyStatus(tenantId, customerId);

    res.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    console.error('Error getting customer status:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// RULES MANAGEMENT
// ===========================================

/**
 * GET /api/loyalty/rules/earning
 * Get earning rules
 */
router.get('/rules/earning', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const rules = await loyaltyService.getEarningRules(tenantId);

    res.json({
      success: true,
      data: rules,
    });
  } catch (error: any) {
    console.error('Error getting earning rules:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/loyalty/rules/redemption
 * Get redemption rules
 */
router.get('/rules/redemption', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const rules = await loyaltyService.getRedemptionRules(tenantId);

    res.json({
      success: true,
      data: rules,
    });
  } catch (error: any) {
    console.error('Error getting redemption rules:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/loyalty/rules/cost-sharing
 * Get cost sharing rules
 */
router.get('/rules/cost-sharing', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const rules = await loyaltyService.getCostSharingRules(tenantId);

    res.json({
      success: true,
      data: rules,
    });
  } catch (error: any) {
    console.error('Error getting cost sharing rules:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// VALIDATION
// ===========================================

/**
 * POST /api/loyalty/validate/earning
 * Validate points earning
 */
router.post('/validate/earning', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;
    const { customerId, orderAmount, orderItems } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const earningRules = await loyaltyService.getEarningRules(tenantId);
    const validation = await loyaltyService.validatePointsEarning(
      tenantId,
      customerId,
      orderAmount,
      orderItems,
      earningRules
    );

    res.json({
      success: true,
      data: validation,
    });
  } catch (error: any) {
    console.error('Error validating points earning:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/loyalty/validate/redemption
 * Validate points redemption
 */
router.post('/validate/redemption', async (req: Request, res: Response) => {
  try {
    const tenantId = req.headers['x-tenant-id'] as string;
    const { customerId, orderAmount, pointsToRedeem } = req.body;

    if (!tenantId) {
      return res.status(400).json({ error: 'Tenant ID required' });
    }

    const redemptionRules = await loyaltyService.getRedemptionRules(tenantId);
    const validation = await loyaltyService.validatePointsRedemption(
      tenantId,
      customerId,
      orderAmount,
      pointsToRedeem,
      redemptionRules
    );

    res.json({
      success: true,
      data: validation,
    });
  } catch (error: any) {
    console.error('Error validating points redemption:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===========================================
// HEALTH CHECK
// ===========================================

/**
 * GET /api/loyalty/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Loyalty API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;

