/**
 * Risk Management API Routes
 * Handles risk assessment, rule management, and risk monitoring
 */

import { Router } from 'express';
import { z } from 'zod';
import { RiskService } from '@tdc/infra';

const router = Router();
const riskService = new RiskService();

// Validation schemas
const RiskAssessmentSchema = z.object({
  entityId: z.string().min(1),
  entityType: z.enum(['CUSTOMER', 'SELLER', 'ORDER', 'PAYMENT']),
  tenantId: z.string().min(1),
  context: z.object({
    signals: z.array(z.object({
      signalType: z.string(),
      signalName: z.string(),
      value: z.any(),
      weight: z.number(),
      source: z.string(),
      timestamp: z.string().datetime(),
      metadata: z.any().optional()
    })),
    contextData: z.any(),
    metadata: z.any().optional()
  })
});

const RiskRuleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ruleType: z.enum(['SCORING', 'THRESHOLD', 'BLACKLIST', 'WHITELIST', 'NOTIFICATION', 'AUTO_ACTION']),
  category: z.enum(['CUSTOMER', 'SELLER', 'ORDER', 'PAYMENT', 'FRAUD', 'COMPLIANCE', 'GEOGRAPHIC', 'BEHAVIORAL', 'FINANCIAL', 'TECHNICAL']),
  priority: z.number().int().min(1).default(1),
  conditions: z.any(),
  threshold: z.number().optional(),
  weight: z.number().default(1.0),
  action: z.enum(['SCORE', 'BLOCK', 'HOLD', 'NOTIFY', 'REVIEW', 'APPROVE', 'ESCALATE']),
  actionParams: z.any().optional(),
  isActive: z.boolean().default(true),
  isEnabled: z.boolean().default(true),
  createdBy: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.any().optional()
});

const RiskScoreReviewSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  notes: z.string().optional(),
  reviewedBy: z.string().optional()
});

const BlacklistWhitelistSchema = z.object({
  entityId: z.string().min(1),
  entityType: z.enum(['CUSTOMER', 'SELLER', 'ORDER', 'PAYMENT']),
  reason: z.string().min(1)
});

// Risk Assessment endpoints

/**
 * POST /api/risk/assess
 * Assess risk for an entity
 */
router.post('/assess', async (req, res) => {
  try {
    const validatedData = RiskAssessmentSchema.parse(req.body);
    
    const result = await riskService.assessRisk(validatedData);
    
    res.json({
      success: true,
      data: result,
      message: 'Risk assessment completed'
    });
  } catch (error) {
    console.error('Risk assessment error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Risk assessment failed',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/risk/profile/:entityId
 * Get risk profile for an entity
 */
router.get('/profile/:entityId', async (req, res) => {
  try {
    const { entityId } = req.params;
    const { entityType, tenantId } = req.query;

    if (!entityType || !tenantId) {
      return res.status(400).json({
        success: false,
        error: 'entityType and tenantId are required'
      });
    }

    const profile = await riskService.getRiskProfile(
      entityId,
      entityType as string,
      tenantId as string
    );

    res.json({
      success: true,
      data: profile,
      message: profile ? 'Risk profile found' : 'No risk profile found'
    });
  } catch (error) {
    console.error('Get risk profile error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get risk profile'
    });
  }
});

/**
 * GET /api/risk/events/:entityId
 * Get risk events for an entity
 */
router.get('/events/:entityId', async (req, res) => {
  try {
    const { entityId } = req.params;
    const { entityType, tenantId, limit = '50' } = req.query;

    if (!entityType || !tenantId) {
      return res.status(400).json({
        success: false,
        error: 'entityType and tenantId are required'
      });
    }

    const events = await riskService.getRiskEvents(
      entityId,
      entityType as string,
      tenantId as string,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: events,
      message: `Found ${events.length} risk events`
    });
  } catch (error) {
    console.error('Get risk events error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get risk events'
    });
  }
});

// Risk Rule Management endpoints

/**
 * GET /api/risk/rules
 * Get risk rules for a tenant
 */
router.get('/rules', async (req, res) => {
  try {
    const { tenantId, category, page = '1', limit = '50' } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const rules = await riskService.getActiveRiskRules(
      tenantId as string,
      category as string
    );

    res.json({
      success: true,
      data: rules,
      message: `Found ${rules.length} active risk rules`
    });
  } catch (error) {
    console.error('Get risk rules error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get risk rules'
    });
  }
});

/**
 * POST /api/risk/rules
 * Create a new risk rule
 */
router.post('/rules', async (req, res) => {
  try {
    const validatedData = RiskRuleSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const rule = await riskService.createRiskRule({
      ...validatedData,
      tenantId: tenantId as string
    });

    res.status(201).json({
      success: true,
      data: rule,
      message: 'Risk rule created successfully'
    });
  } catch (error) {
    console.error('Create risk rule error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create risk rule',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * PUT /api/risk/rules/:ruleId
 * Update a risk rule
 */
router.put('/rules/:ruleId', async (req, res) => {
  try {
    const { ruleId } = req.params;
    const updates = req.body;

    const rule = await riskService.updateRiskRule(ruleId, updates);

    res.json({
      success: true,
      data: rule,
      message: 'Risk rule updated successfully'
    });
  } catch (error) {
    console.error('Update risk rule error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update risk rule'
    });
  }
});

/**
 * DELETE /api/risk/rules/:ruleId
 * Delete a risk rule
 */
router.delete('/rules/:ruleId', async (req, res) => {
  try {
    const { ruleId } = req.params;

    const result = await riskService.deleteRiskRule(ruleId);

    res.json({
      success: result.success,
      message: result.success ? 'Risk rule deleted successfully' : 'Failed to delete risk rule'
    });
  } catch (error) {
    console.error('Delete risk rule error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete risk rule'
    });
  }
});

// Risk Score Management endpoints

/**
 * POST /api/risk/scores/:scoreId/review
 * Review a risk score
 */
router.post('/scores/:scoreId/review', async (req, res) => {
  try {
    const { scoreId } = req.params;
    const validatedData = RiskScoreReviewSchema.parse(req.body);

    const score = await riskService.reviewRiskScore(
      scoreId,
      validatedData.action,
      validatedData.notes,
      validatedData.reviewedBy
    );

    res.json({
      success: true,
      data: score,
      message: `Risk score ${validatedData.action.toLowerCase()}d successfully`
    });
  } catch (error) {
    console.error('Review risk score error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to review risk score',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

// Blacklist/Whitelist Management endpoints

/**
 * POST /api/risk/blacklist
 * Add entity to blacklist
 */
router.post('/blacklist', async (req, res) => {
  try {
    const validatedData = BlacklistWhitelistSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await riskService.blacklistEntity(
      validatedData.entityId,
      validatedData.entityType,
      tenantId as string,
      validatedData.reason
    );

    res.json({
      success: result.success,
      message: result.success ? 'Entity blacklisted successfully' : 'Failed to blacklist entity'
    });
  } catch (error) {
    console.error('Blacklist entity error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to blacklist entity',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * POST /api/risk/whitelist
 * Add entity to whitelist
 */
router.post('/whitelist', async (req, res) => {
  try {
    const validatedData = BlacklistWhitelistSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await riskService.whitelistEntity(
      validatedData.entityId,
      validatedData.entityType,
      tenantId as string,
      validatedData.reason
    );

    res.json({
      success: result.success,
      message: result.success ? 'Entity whitelisted successfully' : 'Failed to whitelist entity'
    });
  } catch (error) {
    console.error('Whitelist entity error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to whitelist entity',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * DELETE /api/risk/list/:entityId
 * Remove entity from blacklist/whitelist
 */
router.delete('/list/:entityId', async (req, res) => {
  try {
    const { entityId } = req.params;
    const { entityType, tenantId, listType } = req.query;

    if (!entityType || !tenantId || !listType) {
      return res.status(400).json({
        success: false,
        error: 'entityType, tenantId, and listType are required'
      });
    }

    if (!['BLACKLIST', 'WHITELIST'].includes(listType as string)) {
      return res.status(400).json({
        success: false,
        error: 'listType must be BLACKLIST or WHITELIST'
      });
    }

    const result = await riskService.removeFromList(
      entityId,
      entityType as string,
      tenantId as string,
      listType as 'BLACKLIST' | 'WHITELIST'
    );

    res.json({
      success: result.success,
      message: result.success ? 'Entity removed from list successfully' : 'Failed to remove entity from list'
    });
  } catch (error) {
    console.error('Remove from list error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove entity from list'
    });
  }
});

// Statistics and Monitoring endpoints

/**
 * GET /api/risk/statistics
 * Get risk statistics for a tenant
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

    const statistics = await riskService.getRiskStatistics(
      tenantId as string,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );

    res.json({
      success: true,
      data: statistics,
      message: 'Risk statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Get risk statistics error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get risk statistics'
    });
  }
});

/**
 * GET /api/risk/alerts
 * Get risk alerts for a tenant
 */
router.get('/alerts', async (req, res) => {
  try {
    const { tenantId, severity, limit = '50' } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const alerts = await riskService.getRiskAlerts(
      tenantId as string,
      severity as string,
      parseInt(limit as string)
    );

    res.json({
      success: true,
      data: alerts,
      message: `Found ${alerts.length} risk alerts`
    });
  } catch (error) {
    console.error('Get risk alerts error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get risk alerts'
    });
  }
});

/**
 * POST /api/risk/events/:eventId/process
 * Mark risk event as processed
 */
router.post('/events/:eventId/process', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { processedBy } = req.body;

    const result = await riskService.markEventAsProcessed(eventId, processedBy);

    res.json({
      success: result.success,
      message: result.success ? 'Event marked as processed' : 'Failed to mark event as processed'
    });
  } catch (error) {
    console.error('Mark event as processed error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mark event as processed'
    });
  }
});

// System endpoints

/**
 * GET /api/risk/health
 * Health check for risk service
 */
router.get('/health', async (req, res) => {
  try {
    const health = await riskService.healthCheck();

    res.status(health.status === 'healthy' ? 200 : 503).json({
      success: health.status === 'healthy',
      data: health,
      message: health.message
    });
  } catch (error) {
    console.error('Risk service health check error:', error);
    res.status(503).json({
      success: false,
      error: error instanceof Error ? error.message : 'Health check failed'
    });
  }
});

/**
 * GET /api/risk/capabilities
 * Get risk service capabilities
 */
router.get('/capabilities', async (req, res) => {
  try {
    const capabilities = await riskService.getCapabilities();

    res.json({
      success: true,
      data: capabilities,
      message: 'Risk service capabilities retrieved'
    });
  } catch (error) {
    console.error('Get capabilities error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get capabilities'
    });
  }
});

export { router as riskRouter };

