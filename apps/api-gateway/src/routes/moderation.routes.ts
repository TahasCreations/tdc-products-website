/**
 * Moderation API Routes
 * Handles content moderation and image similarity detection
 */

import { Router } from 'express';
import { z } from 'zod';
import { ModerationService } from '@tdc/domain';
import { ModerationAdapter } from '@tdc/infra';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const moderationAdapter = new ModerationAdapter(prisma);
const moderationService = new ModerationService(moderationAdapter);

// ===========================================
// VALIDATION SCHEMAS
// ===========================================

const ModerateProductSchema = z.object({
  productId: z.string(),
  tenantId: z.string(),
  sellerId: z.string(),
  imageUrls: z.array(z.string().url()),
  triggeredBy: z.enum(['product_upload', 'manual_review', 'scheduled_check']).optional().default('product_upload'),
});

const CreateModerationCaseSchema = z.object({
  tenantId: z.string(),
  productId: z.string().optional(),
  sellerId: z.string().optional(),
  caseType: z.enum(['IMAGE_SIMILARITY', 'CONTENT_REVIEW', 'SPAM_DETECTION', 'INAPPROPRIATE', 'COPYRIGHT', 'TRADEMARK', 'COUNTERFEIT', 'MANUAL_REPORT', 'AUTOMATED_FLAG']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional().default('MEDIUM'),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  source: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

const UpdateModerationCaseSchema = z.object({
  status: z.enum(['PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'FLAGGED', 'RESOLVED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().optional(),
  reviewNotes: z.string().optional(),
  reviewDecision: z.enum(['APPROVE', 'REJECT', 'MODIFY', 'ESCALATE', 'IGNORE']).optional(),
  resolutionNotes: z.string().optional(),
  actionTaken: z.string().optional(),
});

const GenerateImageHashSchema = z.object({
  imageUrl: z.string().url(),
  hashType: z.enum(['pHash', 'dHash', 'aHash']).optional().default('pHash'),
  hashLength: z.number().min(32).max(128).optional().default(64),
});

const DetectSimilaritySchema = z.object({
  imageUrl: z.string().url(),
  threshold: z.number().min(0).max(1).optional().default(0.8),
  limit: z.number().min(1).max(50).optional().default(10),
});

// ===========================================
// PRODUCT MODERATION ENDPOINTS
// ===========================================

/**
 * POST /api/moderation/moderate-product
 * Moderate a product's images for similarity
 */
router.post('/moderate-product', async (req, res) => {
  try {
    const input = ModerateProductSchema.parse(req.body);
    
    const result = await moderationService.moderateProductImages(
      input.productId,
      input.tenantId,
      input.sellerId,
      input.imageUrls
    );

    res.json({
      success: true,
      data: {
        productId: input.productId,
        flagged: result.flagged,
        casesCount: result.cases.length,
        eventsCount: result.events.length,
        cases: result.cases.map(case_ => ({
          id: case_.id,
          caseType: case_.caseType,
          status: case_.status,
          priority: case_.priority,
          similarityScore: case_.similarityScore,
          detectedIssues: case_.detectedIssues,
        })),
      },
    });
  } catch (error: any) {
    console.error('Error moderating product:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/moderation/generate-hash
 * Generate pHash for an image
 */
router.post('/generate-hash', async (req, res) => {
  try {
    const input = GenerateImageHashSchema.parse(req.body);
    
    const result = await moderationService.generateAndStoreImageHash(
      input.imageUrl,
      req.body.tenantId || 'default-tenant'
    );

    res.json({
      success: true,
      data: {
        hash: result.imageHash,
        hashType: result.hashType,
        hashLength: result.hashLength,
        processingTime: result.processingTime,
      },
    });
  } catch (error: any) {
    console.error('Error generating image hash:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/moderation/detect-similarity
 * Detect similar images
 */
router.post('/detect-similarity', async (req, res) => {
  try {
    const input = DetectSimilaritySchema.parse(req.body);
    
    const result = await moderationService.detectSimilarImages(
      input.imageUrl,
      req.body.tenantId || 'default-tenant',
      input.threshold
    );

    res.json({
      success: true,
      data: {
        imageHash: result.imageHash,
        highestSimilarity: result.highestSimilarity,
        isFlagged: result.isFlagged,
        threshold: result.threshold,
        similarImagesCount: result.similarHashes.length,
        similarImages: result.similarHashes.map(sh => ({
          hash: sh.hash,
          similarity: sh.similarity,
          productId: sh.productId,
        })),
      },
    });
  } catch (error: any) {
    console.error('Error detecting similarity:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// MODERATION CASE ENDPOINTS
// ===========================================

/**
 * POST /api/moderation/cases
 * Create a moderation case
 */
router.post('/cases', async (req, res) => {
  try {
    const input = CreateModerationCaseSchema.parse(req.body);
    
    const case_ = await moderationService.createModerationCase(input);

    res.json({
      success: true,
      data: {
        id: case_.id,
        caseType: case_.caseType,
        status: case_.status,
        priority: case_.priority,
        createdAt: case_.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating moderation case:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/moderation/cases
 * Get moderation cases
 */
router.get('/cases', async (req, res) => {
  try {
    const { tenantId, status, caseType, assignedTo, limit, offset } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const result = await moderationService.getModerationCases({
      tenantId: tenantId as string,
      status: status as any,
      caseType: caseType as any,
      assignedTo: assignedTo as string,
      limit: limit ? parseInt(limit as string) : 20,
      offset: offset ? parseInt(offset as string) : 0,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('Error getting moderation cases:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/moderation/cases/:caseId
 * Get a specific moderation case
 */
router.get('/cases/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    
    const case_ = await moderationService.getModerationCase(caseId);

    if (!case_) {
      return res.status(404).json({
        success: false,
        error: 'Moderation case not found',
      });
    }

    res.json({
      success: true,
      data: case_,
    });
  } catch (error: any) {
    console.error('Error getting moderation case:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * PUT /api/moderation/cases/:caseId
 * Update a moderation case
 */
router.put('/cases/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    const input = UpdateModerationCaseSchema.parse(req.body);
    
    const case_ = await moderationService.updateModerationCase(caseId, input);

    res.json({
      success: true,
      data: {
        id: case_.id,
        status: case_.status,
        priority: case_.priority,
        assignedTo: case_.assignedTo,
        updatedAt: case_.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Error updating moderation case:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/moderation/cases/:caseId/assign
 * Assign a moderation case to a moderator
 */
router.post('/cases/:caseId/assign', async (req, res) => {
  try {
    const { caseId } = req.params;
    const { moderatorId } = req.body;
    
    if (!moderatorId) {
      return res.status(400).json({
        success: false,
        error: 'Moderator ID is required',
      });
    }

    const case_ = await moderationService.assignModerationCase(caseId, moderatorId);

    res.json({
      success: true,
      data: {
        id: case_.id,
        assignedTo: case_.assignedTo,
        status: case_.status,
        reviewedAt: case_.reviewedAt,
      },
    });
  } catch (error: any) {
    console.error('Error assigning moderation case:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/moderation/cases/:caseId/review
 * Review a moderation case
 */
router.post('/cases/:caseId/review', async (req, res) => {
  try {
    const { caseId } = req.params;
    const { decision, notes } = req.body;
    
    if (!decision) {
      return res.status(400).json({
        success: false,
        error: 'Decision is required',
      });
    }

    const case_ = await moderationService.reviewModerationCase(caseId, decision, notes);

    res.json({
      success: true,
      data: {
        id: case_.id,
        status: case_.status,
        reviewDecision: case_.reviewDecision,
        reviewNotes: case_.reviewNotes,
        reviewedAt: case_.reviewedAt,
        resolvedAt: case_.resolvedAt,
        actionTaken: case_.actionTaken,
      },
    });
  } catch (error: any) {
    console.error('Error reviewing moderation case:', error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// ===========================================
// ANALYTICS ENDPOINTS
// ===========================================

/**
 * GET /api/moderation/stats
 * Get moderation statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const { tenantId, startDate, endDate } = req.query;
    
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required',
      });
    }

    const dateRange = startDate && endDate ? {
      start: new Date(startDate as string),
      end: new Date(endDate as string),
    } : undefined;

    const stats = await moderationService.getModerationStats(
      tenantId as string,
      dateRange
    );

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('Error getting moderation stats:', error);
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
 * GET /api/moderation/health
 * Health check for moderation service
 */
router.get('/health', async (req, res) => {
  try {
    const isHealthy = await moderationService.healthCheck();
    
    res.status(isHealthy ? 200 : 503).json({
      success: isHealthy,
      data: {
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'moderation',
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

