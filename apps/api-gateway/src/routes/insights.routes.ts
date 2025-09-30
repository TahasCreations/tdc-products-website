/**
 * Insights API Routes
 * Handles insights, analytics, and subscription management endpoints
 */

import { Router } from 'express';
import { z } from 'zod';
import { InsightsService } from '@tdc/infra';
import { PrismaClient } from '@prisma/client';
import { InsightsRepository, SubscriptionRepository } from '@tdc/infra';

const router = Router();
const prisma = new PrismaClient();
const insightsRepo = new InsightsRepository(prisma);
const subscriptionRepo = new SubscriptionRepository(prisma);
const insightsService = new InsightsService(insightsRepo, subscriptionRepo);

// ===========================================
// VALIDATION SCHEMAS
// ===========================================

const DateRangeSchema = z.object({
  start: z.string().transform(str => new Date(str)),
  end: z.string().transform(str => new Date(str)),
});

const SnapshotQuerySchema = z.object({
  tenantId: z.string(),
  sellerId: z.string().optional(),
  dateRange: DateRangeSchema.optional(),
  limit: z.string().transform(Number).default('100'),
  offset: z.string().transform(Number).default('0'),
});

const ProductAnalyticsQuerySchema = z.object({
  tenantId: z.string(),
  sellerId: z.string().optional(),
  productId: z.string().optional(),
  periodType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).optional(),
  dateRange: DateRangeSchema.optional(),
  limit: z.string().transform(Number).default('100'),
  offset: z.string().transform(Number).default('0'),
});

const CompetitorAnalysisQuerySchema = z.object({
  tenantId: z.string(),
  sellerId: z.string().optional(),
  competitorName: z.string().optional(),
  competitorType: z.enum(['DIRECT', 'INDIRECT', 'MARKETPLACE', 'BRAND']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  dateRange: DateRangeSchema.optional(),
  limit: z.string().transform(Number).default('100'),
  offset: z.string().transform(Number).default('0'),
});

const GenerateSnapshotSchema = z.object({
  tenantId: z.string(),
  sellerId: z.string().optional(),
  date: z.string().transform(str => new Date(str)),
});

const GenerateProductAnalyticsSchema = z.object({
  tenantId: z.string(),
  sellerId: z.string().optional(),
  productId: z.string(),
  periodStart: z.string().transform(str => new Date(str)),
  periodEnd: z.string().transform(str => new Date(str)),
  periodType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).default('DAILY'),
});

const RunCompetitorAnalysisSchema = z.object({
  tenantId: z.string(),
  sellerId: z.string().optional(),
  competitorName: z.string(),
  competitorUrl: z.string().optional(),
  competitorType: z.enum(['DIRECT', 'INDIRECT', 'MARKETPLACE', 'BRAND']).default('DIRECT'),
  analysisDate: z.string().transform(str => new Date(str)),
  periodStart: z.string().transform(str => new Date(str)),
  periodEnd: z.string().transform(str => new Date(str)),
});

const BulkGenerateSnapshotsSchema = z.object({
  tenantId: z.string(),
  sellerId: z.string().optional(),
  dateRange: DateRangeSchema,
});

const BulkGenerateProductAnalyticsSchema = z.object({
  tenantId: z.string(),
  sellerId: z.string().optional(),
  productIds: z.array(z.string()),
  periodStart: z.string().transform(str => new Date(str)),
  periodEnd: z.string().transform(str => new Date(str)),
  periodType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).default('DAILY'),
});

// ===========================================
// DAILY SNAPSHOTS
// ===========================================

/**
 * GET /api/insights/snapshots
 * Get daily snapshots with optional filtering
 */
router.get('/snapshots', async (req, res) => {
  try {
    const query = SnapshotQuerySchema.parse(req.query);
    
    const snapshots = await insightsService.getDailySnapshots(
      query.tenantId,
      query.sellerId,
      query.dateRange,
      query.limit,
      query.offset
    );

    res.json({
      success: true,
      data: snapshots,
      pagination: {
        limit: query.limit,
        offset: query.offset,
        total: snapshots.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching snapshots:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/insights/snapshots/generate
 * Generate a daily snapshot
 */
router.post('/snapshots/generate', async (req, res) => {
  try {
    const input = GenerateSnapshotSchema.parse(req.body);
    
    const snapshot = await insightsService.generateDailySnapshot(input);

    res.json({
      success: true,
      data: snapshot,
    });
  } catch (error: any) {
    console.error('Error generating snapshot:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/insights/snapshots/bulk-generate
 * Generate multiple daily snapshots
 */
router.post('/snapshots/bulk-generate', async (req, res) => {
  try {
    const input = BulkGenerateSnapshotsSchema.parse(req.body);
    
    const snapshots = await insightsService.bulkGenerateSnapshots(
      input.tenantId,
      input.sellerId,
      input.dateRange
    );

    res.json({
      success: true,
      data: snapshots,
      count: snapshots.length,
    });
  } catch (error: any) {
    console.error('Error bulk generating snapshots:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/insights/snapshots/summary
 * Get snapshot summary for a date range
 */
router.get('/snapshots/summary', async (req, res) => {
  try {
    const query = SnapshotQuerySchema.parse(req.query);
    
    if (!query.dateRange) {
      return res.status(400).json({
        success: false,
        error: 'Date range is required',
      });
    }

    const summary = await insightsService.getSnapshotSummary(
      query.tenantId,
      query.sellerId,
      query.dateRange
    );

    res.json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    console.error('Error fetching snapshot summary:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// PRODUCT ANALYTICS
// ===========================================

/**
 * GET /api/insights/products/analytics
 * Get product analytics
 */
router.get('/products/analytics', async (req, res) => {
  try {
    const query = ProductAnalyticsQuerySchema.parse(req.query);
    
    const analytics = await insightsService.getProductAnalytics(
      query.tenantId,
      query.sellerId,
      query.productId,
      query.periodType,
      query.dateRange,
      query.limit,
      query.offset
    );

    res.json({
      success: true,
      data: analytics,
      pagination: {
        limit: query.limit,
        offset: query.offset,
        total: analytics.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching product analytics:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/insights/products/analytics/generate
 * Generate product analytics
 */
router.post('/products/analytics/generate', async (req, res) => {
  try {
    const input = GenerateProductAnalyticsSchema.parse(req.body);
    
    const analytics = await insightsService.generateProductAnalytics(input);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    console.error('Error generating product analytics:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/insights/products/analytics/bulk-generate
 * Generate product analytics for multiple products
 */
router.post('/products/analytics/bulk-generate', async (req, res) => {
  try {
    const input = BulkGenerateProductAnalyticsSchema.parse(req.body);
    
    const analytics = await insightsService.bulkGenerateProductAnalytics(
      input.tenantId,
      input.sellerId,
      input.productIds,
      input.periodStart,
      input.periodEnd,
      input.periodType
    );

    res.json({
      success: true,
      data: analytics,
      count: analytics.length,
    });
  } catch (error: any) {
    console.error('Error bulk generating product analytics:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/insights/products/top
 * Get top products
 */
router.get('/products/top', async (req, res) => {
  try {
    const query = SnapshotQuerySchema.parse(req.query);
    
    if (!query.dateRange) {
      return res.status(400).json({
        success: false,
        error: 'Date range is required',
      });
    }

    const topProducts = await insightsService.getTopProducts(
      query.tenantId,
      query.sellerId,
      query.dateRange,
      query.limit
    );

    res.json({
      success: true,
      data: topProducts,
    });
  } catch (error: any) {
    console.error('Error fetching top products:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/insights/products/categories
 * Get top categories
 */
router.get('/products/categories', async (req, res) => {
  try {
    const query = SnapshotQuerySchema.parse(req.query);
    
    if (!query.dateRange) {
      return res.status(400).json({
        success: false,
        error: 'Date range is required',
      });
    }

    const topCategories = await insightsService.getTopCategories(
      query.tenantId,
      query.sellerId,
      query.dateRange,
      query.limit
    );

    res.json({
      success: true,
      data: topCategories,
    });
  } catch (error: any) {
    console.error('Error fetching top categories:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/insights/products/price-ranges
 * Get top price ranges
 */
router.get('/products/price-ranges', async (req, res) => {
  try {
    const query = SnapshotQuerySchema.parse(req.query);
    
    if (!query.dateRange) {
      return res.status(400).json({
        success: false,
        error: 'Date range is required',
      });
    }

    const topPriceRanges = await insightsService.getTopPriceRanges(
      query.tenantId,
      query.sellerId,
      query.dateRange,
      query.limit
    );

    res.json({
      success: true,
      data: topPriceRanges,
    });
  } catch (error: any) {
    console.error('Error fetching top price ranges:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/insights/products/tags
 * Get top tags
 */
router.get('/products/tags', async (req, res) => {
  try {
    const query = SnapshotQuerySchema.parse(req.query);
    
    if (!query.dateRange) {
      return res.status(400).json({
        success: false,
        error: 'Date range is required',
      });
    }

    const topTags = await insightsService.getTopTags(
      query.tenantId,
      query.sellerId,
      query.dateRange,
      query.limit
    );

    res.json({
      success: true,
      data: topTags,
    });
  } catch (error: any) {
    console.error('Error fetching top tags:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/insights/products/trends
 * Get product trends
 */
router.get('/products/trends', async (req, res) => {
  try {
    const query = SnapshotQuerySchema.parse(req.query);
    const metric = req.query.metric as 'revenue' | 'orders' | 'conversion' | 'products';
    
    if (!query.dateRange) {
      return res.status(400).json({
        success: false,
        error: 'Date range is required',
      });
    }

    if (!metric) {
      return res.status(400).json({
        success: false,
        error: 'Metric is required',
      });
    }

    const trends = await insightsService.getTrends(
      query.tenantId,
      query.sellerId,
      query.dateRange,
      metric
    );

    res.json({
      success: true,
      data: trends,
    });
  } catch (error: any) {
    console.error('Error fetching trends:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// COMPETITOR ANALYSIS
// ===========================================

/**
 * GET /api/insights/competitors
 * Get competitor analyses
 */
router.get('/competitors', async (req, res) => {
  try {
    const query = CompetitorAnalysisQuerySchema.parse(req.query);
    
    const analyses = await insightsService.getCompetitorAnalyses(
      query.tenantId,
      query.sellerId,
      query.competitorName,
      query.competitorType,
      query.status,
      query.dateRange,
      query.limit,
      query.offset
    );

    res.json({
      success: true,
      data: analyses,
      pagination: {
        limit: query.limit,
        offset: query.offset,
        total: analyses.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching competitor analyses:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/insights/competitors/analyze
 * Run competitor analysis
 */
router.post('/competitors/analyze', async (req, res) => {
  try {
    const input = RunCompetitorAnalysisSchema.parse(req.body);
    
    const analysis = await insightsService.runCompetitorAnalysis(input);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    console.error('Error running competitor analysis:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// SUBSCRIPTION ANALYTICS
// ===========================================

/**
 * GET /api/insights/subscriptions/stats
 * Get subscription statistics
 */
router.get('/subscriptions/stats', async (req, res) => {
  try {
    const { tenantId, sellerId } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const stats = await insightsService.getSubscriptionStats(
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
 * GET /api/insights/subscriptions/plan-distribution
 * Get plan distribution
 */
router.get('/subscriptions/plan-distribution', async (req, res) => {
  try {
    const { tenantId, sellerId } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const distribution = await insightsService.getPlanDistribution(
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
 * GET /api/insights/subscriptions/revenue-by-plan
 * Get revenue by plan
 */
router.get('/subscriptions/revenue-by-plan', async (req, res) => {
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

    const revenue = await insightsService.getRevenueByPlan(
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
 * GET /api/insights/subscriptions/churn-rate
 * Get churn rate
 */
router.get('/subscriptions/churn-rate', async (req, res) => {
  try {
    const { tenantId, sellerId, months } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const churnRate = await insightsService.getChurnRate(
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

// ===========================================
// HEALTH CHECKS
// ===========================================

/**
 * GET /api/insights/health
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
  try {
    const health = await insightsService.healthCheck();
    
    res.status(health.status === 'healthy' ? 200 : 503).json(health);
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

export default router;

