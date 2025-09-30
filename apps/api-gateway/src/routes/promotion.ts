/**
 * Promotion Management API Routes
 * Handles promotion creation, eligibility checking, and conflict resolution
 */

import { Router } from 'express';
import { z } from 'zod';
import { PromotionServiceImpl } from '@tdc/infra';
import { 
  applyPromotionsWithPriority,
  createDefaultPriorityRules,
  validateCheckoutContext,
  generatePromotionRecommendations,
  CheckoutContext
} from '@tdc/domain';

const router = Router();
const promotionService = new PromotionServiceImpl();

// Validation schemas
const CreatePromotionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  code: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'BUY_X_GET_Y', 'BUNDLE_DISCOUNT', 'CASHBACK', 'GIFT_CARD', 'POINTS']),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'BUY_X_GET_Y', 'BUNDLE_DISCOUNT']),
  discountValue: z.number().positive(),
  maxDiscountAmount: z.number().positive().optional(),
  minOrderAmount: z.number().positive().optional(),
  usageLimit: z.number().positive().optional(),
  usagePerCustomer: z.number().positive().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  priority: z.number().int().positive().optional(),
  stackable: z.boolean().optional(),
  stackableWith: z.array(z.string()).optional(),
  eligibilityRules: z.any().optional(),
  targetType: z.enum(['ALL', 'CUSTOMER', 'PRODUCT', 'CATEGORY', 'BRAND', 'SELLER', 'CUSTOMER_SEGMENT']).optional(),
  targetIds: z.array(z.string()).optional(),
  displayName: z.string().optional(),
  displayDescription: z.string().optional(),
  bannerImage: z.string().url().optional(),
  iconImage: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.any().optional()
});

const CreateCouponSchema = z.object({
  promotionId: z.string().min(1),
  code: z.string().optional(),
  usageLimit: z.number().positive().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  assignedTo: z.string().optional(),
  assignedBy: z.string().optional(),
  metadata: z.any().optional()
});

const CheckoutContextSchema = z.object({
  orderId: z.string().min(1),
  customerId: z.string().optional(),
  customerSegment: z.string().optional(),
  customerLoyaltyLevel: z.string().optional(),
  isFirstTimeBuyer: z.boolean().optional(),
  orderAmount: z.number().positive(),
  orderItems: z.array(z.object({
    productId: z.string().min(1),
    categoryId: z.string().optional(),
    brandId: z.string().optional(),
    sellerId: z.string().optional(),
    quantity: z.number().positive(),
    price: z.number().positive(),
    totalPrice: z.number().positive()
  })),
  appliedPromotions: z.array(z.string()).optional(),
  appliedCoupons: z.array(z.string()).optional(),
  shippingAddress: z.object({
    city: z.string(),
    state: z.string(),
    country: z.string()
  }).optional(),
  paymentMethod: z.string().optional(),
  orderDate: z.string().datetime().optional(),
  orderHistory: z.object({
    totalOrders: z.number().int().min(0),
    totalSpent: z.number().min(0),
    averageOrderValue: z.number().min(0),
    lastOrderDate: z.string().datetime().optional()
  }).optional(),
  metadata: z.any().optional()
});

const ConflictRuleSchema = z.object({
  conflictType: z.enum(['MUTUALLY_EXCLUSIVE', 'PRIORITY_BASED', 'RULE_BASED', 'CUSTOMER_CHOICE']),
  priority: z.number().int().positive(),
  promotionIds: z.array(z.string()).min(2),
  resolutionStrategy: z.enum(['HIGHEST_PRIORITY', 'HIGHEST_DISCOUNT', 'FIRST_APPLIED', 'CUSTOMER_CHOICE', 'CUSTOM_RULES']),
  resolutionRules: z.any().optional(),
  description: z.string().optional(),
  metadata: z.any().optional()
});

// Promotion Management

/**
 * POST /api/promotion/promotions
 * Create a new promotion
 */
router.post('/promotions', async (req, res) => {
  try {
    const validatedData = CreatePromotionSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await promotionService.createPromotion({
      ...validatedData,
      tenantId: tenantId as string,
      startDate: new Date(validatedData.startDate),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.promotion,
      message: result.success ? 'Promotion created successfully' : 'Failed to create promotion',
      error: result.error
    });
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create promotion',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/promotion/promotions
 * Get promotions with filters
 */
router.get('/promotions', async (req, res) => {
  try {
    const { 
      tenantId, 
      status, 
      type, 
      targetType, 
      customerId, 
      productId, 
      categoryId, 
      dateFrom, 
      dateTo, 
      page = '1', 
      limit = '50' 
    } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await promotionService.searchPromotions({
      tenantId: tenantId as string,
      status: status as any,
      type: type as any,
      targetType: targetType as any,
      customerId: customerId as string,
      productId: productId as string,
      categoryId: categoryId as string,
      dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo: dateTo ? new Date(dateTo as string) : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.json({
      success: true,
      data: result,
      message: `Found ${result.promotions.length} promotions`
    });
  } catch (error) {
    console.error('Get promotions error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get promotions'
    });
  }
});

/**
 * GET /api/promotion/promotions/:id
 * Get specific promotion
 */
router.get('/promotions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await promotionService.getPromotion(id);

    if (!promotion) {
      return res.status(404).json({
        success: false,
        error: 'Promotion not found'
      });
    }

    res.json({
      success: true,
      data: promotion,
      message: 'Promotion found'
    });
  } catch (error) {
    console.error('Get promotion error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get promotion'
    });
  }
});

/**
 * PUT /api/promotion/promotions/:id
 * Update promotion
 */
router.put('/promotions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = CreatePromotionSchema.partial().parse(req.body);

    const result = await promotionService.updatePromotion(id, validatedData);

    res.json({
      success: result.success,
      data: result.promotion,
      message: result.success ? 'Promotion updated successfully' : 'Failed to update promotion',
      error: result.error
    });
  } catch (error) {
    console.error('Update promotion error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update promotion',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * DELETE /api/promotion/promotions/:id
 * Delete promotion
 */
router.delete('/promotions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await promotionService.deletePromotion(id);

    res.json({
      success: result.success,
      message: result.success ? 'Promotion deleted successfully' : 'Failed to delete promotion'
    });
  } catch (error) {
    console.error('Delete promotion error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete promotion'
    });
  }
});

// Coupon Management

/**
 * POST /api/promotion/coupons
 * Create a new coupon
 */
router.post('/coupons', async (req, res) => {
  try {
    const validatedData = CreateCouponSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await promotionService.createCoupon({
      ...validatedData,
      tenantId: tenantId as string,
      startDate: new Date(validatedData.startDate),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.coupon,
      message: result.success ? 'Coupon created successfully' : 'Failed to create coupon',
      error: result.error
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create coupon',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/promotion/coupons/:code
 * Get coupon by code
 */
router.get('/coupons/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const coupon = await promotionService.getCouponByCode(code);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'Coupon not found'
      });
    }

    res.json({
      success: true,
      data: coupon,
      message: 'Coupon found'
    });
  } catch (error) {
    console.error('Get coupon error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get coupon'
    });
  }
});

/**
 * GET /api/promotion/coupons/customer/:customerId
 * Get customer coupons
 */
router.get('/coupons/customer/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const coupons = await promotionService.getCouponsByCustomer(customerId, tenantId as string);

    res.json({
      success: true,
      data: coupons,
      message: `Found ${coupons.length} coupons for customer`
    });
  } catch (error) {
    console.error('Get customer coupons error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get customer coupons'
    });
  }
});

// Checkout and Application

/**
 * POST /api/promotion/checkout/apply
 * Apply promotions to checkout
 */
router.post('/checkout/apply', async (req, res) => {
  try {
    const validatedData = CheckoutContextSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    // Validate checkout context
    const contextValidation = validateCheckoutContext({
      ...validatedData,
      tenantId: tenantId as string,
      orderDate: validatedData.orderDate ? new Date(validatedData.orderDate) : new Date()
    });

    if (!contextValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid checkout context',
        details: contextValidation.errors
      });
    }

    // Create checkout context
    const context: CheckoutContext = {
      ...validatedData,
      tenantId: tenantId as string,
      orderDate: validatedData.orderDate ? new Date(validatedData.orderDate) : new Date(),
      orderHistory: validatedData.orderHistory ? {
        ...validatedData.orderHistory,
        lastOrderDate: validatedData.orderHistory.lastOrderDate ? 
          new Date(validatedData.orderHistory.lastOrderDate) : undefined
      } : undefined
    };

    // Get available promotions (this would be implemented to fetch from database)
    const availablePromotions = []; // Placeholder

    // Apply promotions with priority
    const result = applyPromotionsWithPriority(context, availablePromotions, createDefaultPriorityRules());

    res.json({
      success: result.success,
      data: result,
      message: result.success ? 'Promotions applied successfully' : 'Failed to apply promotions'
    });
  } catch (error) {
    console.error('Apply promotions error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to apply promotions',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * POST /api/promotion/checkout/recommendations
 * Get promotion recommendations for checkout
 */
router.post('/checkout/recommendations', async (req, res) => {
  try {
    const validatedData = CheckoutContextSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    // Create checkout context
    const context: CheckoutContext = {
      ...validatedData,
      tenantId: tenantId as string,
      orderDate: validatedData.orderDate ? new Date(validatedData.orderDate) : new Date(),
      orderHistory: validatedData.orderHistory ? {
        ...validatedData.orderHistory,
        lastOrderDate: validatedData.orderHistory.lastOrderDate ? 
          new Date(validatedData.orderHistory.lastOrderDate) : undefined
      } : undefined
    };

    // Get available promotions (this would be implemented to fetch from database)
    const availablePromotions = []; // Placeholder

    // Generate recommendations
    const recommendations = generatePromotionRecommendations(context, availablePromotions);

    res.json({
      success: true,
      data: recommendations,
      message: `Found ${recommendations.length} promotion recommendations`
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get recommendations',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

// Conflict Resolution

/**
 * POST /api/promotion/conflicts
 * Create conflict rule
 */
router.post('/conflicts', async (req, res) => {
  try {
    const validatedData = ConflictRuleSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await promotionService.createConflictRule({
      ...validatedData,
      tenantId: tenantId as string
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.conflict,
      message: result.success ? 'Conflict rule created successfully' : 'Failed to create conflict rule',
      error: result.error
    });
  } catch (error) {
    console.error('Create conflict rule error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create conflict rule',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/promotion/conflicts
 * Get conflict rules
 */
router.get('/conflicts', async (req, res) => {
  try {
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const conflicts = await promotionService.getConflictRules(tenantId as string);

    res.json({
      success: true,
      data: conflicts,
      message: `Found ${conflicts.length} conflict rules`
    });
  } catch (error) {
    console.error('Get conflict rules error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get conflict rules'
    });
  }
});

// Statistics and Analytics

/**
 * GET /api/promotion/statistics
 * Get promotion statistics
 */
router.get('/statistics', async (req, res) => {
  try {
    const { tenantId, dateFrom, dateTo } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const statistics = await promotionService.getPromotionStatistics(
      tenantId as string,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );

    res.json({
      success: true,
      data: statistics,
      message: 'Promotion statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Get promotion statistics error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get promotion statistics'
    });
  }
});

/**
 * GET /api/promotion/promotions/:id/usage
 * Get promotion usage statistics
 */
router.get('/promotions/:id/usage', async (req, res) => {
  try {
    const { id } = req.params;
    const { dateFrom, dateTo } = req.query;

    const stats = await promotionService.getPromotionUsageStats(
      id,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );

    res.json({
      success: true,
      data: stats,
      message: 'Promotion usage statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Get promotion usage stats error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get promotion usage stats'
    });
  }
});

// System endpoints

/**
 * GET /api/promotion/health
 * Health check for promotion service
 */
router.get('/health', async (req, res) => {
  try {
    const health = await promotionService.healthCheck();

    res.status(health.status === 'healthy' ? 200 : 503).json({
      success: health.status === 'healthy',
      data: health,
      message: health.message
    });
  } catch (error) {
    console.error('Promotion service health check error:', error);
    res.status(503).json({
      success: false,
      error: error instanceof Error ? error.message : 'Health check failed'
    });
  }
});

export { router as promotionRouter };

