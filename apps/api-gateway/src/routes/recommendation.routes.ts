/**
 * Recommendation API Routes
 * Handles product recommendations and event tracking
 */

import { Router } from 'express';
import { z } from 'zod';
import { RecommendationService } from '@tdc/domain';
import { RecommendationAdapter } from '@tdc/infra';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const recommendationAdapter = new RecommendationAdapter(prisma);
const recommendationService = new RecommendationService(recommendationAdapter);

// ===========================================
// VALIDATION SCHEMAS
// ===========================================

const RecommendationRequestSchema = z.object({
  productId: z.string().optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  category: z.string().optional(),
  limit: z.number().min(1).max(50).optional().default(10),
  excludeIds: z.array(z.string()).optional(),
  context: z.enum(['product_detail', 'cart', 'homepage', 'search']).optional(),
});

const EventCollectionSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  eventType: z.enum(['view', 'click', 'add_to_cart', 'purchase', 'search']),
  productId: z.string().optional(),
  query: z.string().optional(),
  category: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const ProductViewSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  productId: z.string(),
  metadata: z.record(z.any()).optional(),
});

const ProductClickSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  productId: z.string(),
  metadata: z.record(z.any()).optional(),
});

const AddToCartSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  productId: z.string(),
  metadata: z.record(z.any()).optional(),
});

const PurchaseSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  productId: z.string(),
  metadata: z.record(z.any()).optional(),
});

const SearchSchema = z.object({
  userId: z.string(),
  sessionId: z.string(),
  query: z.string(),
  category: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// ===========================================
// RECOMMENDATION ENDPOINTS
// ===========================================

/**
 * POST /api/recommendations
 * Get product recommendations
 */
router.post('/', async (req, res) => {
  try {
    const input = RecommendationRequestSchema.parse(req.body);
    
    const result = await recommendationService.getRecommendations(input);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting recommendations:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/recommendations/product/:productId
 * Get product detail recommendations
 */
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit } = req.query;
    
    const result = await recommendationService.getProductDetailRecommendations(
      productId,
      limit ? parseInt(limit as string) : 8
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting product recommendations:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/recommendations/cart/:userId
 * Get cart recommendations
 */
router.get('/cart/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    
    // In a real implementation, you would get cart products from a cart service
    const cartProductIds = ['prod-1', 'prod-2', 'prod-3']; // Mock cart products
    
    const result = await recommendationService.getCartRecommendations(
      cartProductIds,
      limit ? parseInt(limit as string) : 6
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting cart recommendations:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/recommendations/homepage
 * Get homepage recommendations
 */
router.get('/homepage', async (req, res) => {
  try {
    const { userId, limit } = req.query;
    
    const result = await recommendationService.getHomepageRecommendations(
      userId as string,
      limit ? parseInt(limit as string) : 12
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting homepage recommendations:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/recommendations/trending
 * Get trending products
 */
router.get('/trending', async (req, res) => {
  try {
    const { category, limit } = req.query;
    
    const result = await recommendationService.getTrendingProducts(
      category as string,
      limit ? parseInt(limit as string) : 10
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting trending products:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/recommendations/popular
 * Get popular products
 */
router.get('/popular', async (req, res) => {
  try {
    const { category, limit } = req.query;
    
    const result = await recommendationService.getPopularProducts(
      category as string,
      limit ? parseInt(limit as string) : 10
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting popular products:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/recommendations/search
 * Get search-based recommendations
 */
router.get('/search', async (req, res) => {
  try {
    const { query, limit } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required',
      });
    }
    
    const result = await recommendationService.getSearchRecommendations(
      query as string,
      limit ? parseInt(limit as string) : 8
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting search recommendations:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// EVENT TRACKING ENDPOINTS
// ===========================================

/**
 * POST /api/recommendations/events
 * Collect user event
 */
router.post('/events', async (req, res) => {
  try {
    const input = EventCollectionSchema.parse(req.body);
    
    const result = await recommendationService.collectEvent(input);

    res.json({
      success: result.success,
      data: {
        eventId: result.eventId,
        message: result.message,
      },
    });
  } catch (error: any) {
    console.error('Error collecting event:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/recommendations/events/view
 * Track product view
 */
router.post('/events/view', async (req, res) => {
  try {
    const input = ProductViewSchema.parse(req.body);
    
    const result = await recommendationService.trackProductView(
      input.userId,
      input.sessionId,
      input.productId,
      input.metadata
    );

    res.json({
      success: result.success,
      data: {
        eventId: result.eventId,
        message: result.message,
      },
    });
  } catch (error: any) {
    console.error('Error tracking product view:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/recommendations/events/click
 * Track product click
 */
router.post('/events/click', async (req, res) => {
  try {
    const input = ProductClickSchema.parse(req.body);
    
    const result = await recommendationService.trackProductClick(
      input.userId,
      input.sessionId,
      input.productId,
      input.metadata
    );

    res.json({
      success: result.success,
      data: {
        eventId: result.eventId,
        message: result.message,
      },
    });
  } catch (error: any) {
    console.error('Error tracking product click:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/recommendations/events/add-to-cart
 * Track add to cart
 */
router.post('/events/add-to-cart', async (req, res) => {
  try {
    const input = AddToCartSchema.parse(req.body);
    
    const result = await recommendationService.trackAddToCart(
      input.userId,
      input.sessionId,
      input.productId,
      input.metadata
    );

    res.json({
      success: result.success,
      data: {
        eventId: result.eventId,
        message: result.message,
      },
    });
  } catch (error: any) {
    console.error('Error tracking add to cart:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/recommendations/events/purchase
 * Track purchase
 */
router.post('/events/purchase', async (req, res) => {
  try {
    const input = PurchaseSchema.parse(req.body);
    
    const result = await recommendationService.trackPurchase(
      input.userId,
      input.sessionId,
      input.productId,
      input.metadata
    );

    res.json({
      success: result.success,
      data: {
        eventId: result.eventId,
        message: result.message,
      },
    });
  } catch (error: any) {
    console.error('Error tracking purchase:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/recommendations/events/search
 * Track search
 */
router.post('/events/search', async (req, res) => {
  try {
    const input = SearchSchema.parse(req.body);
    
    const result = await recommendationService.trackSearch(
      input.userId,
      input.sessionId,
      input.query,
      input.category,
      input.metadata
    );

    res.json({
      success: result.success,
      data: {
        eventId: result.eventId,
        message: result.message,
      },
    });
  } catch (error: any) {
    console.error('Error tracking search:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// USER PROFILE ENDPOINTS
// ===========================================

/**
 * GET /api/recommendations/profile/:userId
 * Get user profile
 */
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const profile = await recommendationService.getUserProfile(userId);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/recommendations/profile/:userId
 * Update user profile
 */
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = req.body;
    
    const result = await recommendationService.updateUserProfile(userId, profile);

    res.json({
      success: result,
      message: result ? 'Profile updated successfully' : 'Failed to update profile',
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// HEALTH CHECK
// ===========================================

/**
 * GET /api/recommendations/health
 * Health check
 */
router.get('/health', async (req, res) => {
  try {
    const isHealthy = await recommendationService.healthCheck();
    
    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      data: {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(503).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

