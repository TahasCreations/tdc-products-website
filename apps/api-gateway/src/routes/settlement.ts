import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { SettlementRepository } from '@tdc/infra';
import { PrismaClient } from '@prisma/client';
import { validateInput } from '@tdc/infra';

const router = express.Router();
const prisma = new PrismaClient();
const settlementRepo = new SettlementRepository(prisma);

// Settlement run request schema
const settlementRunSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  runType: z.enum(['MANUAL', 'SCHEDULED', 'ORDER_TRIGGERED'], {
    errorMap: () => ({ message: 'Run type must be MANUAL, SCHEDULED, or ORDER_TRIGGERED' })
  }),
  periodStart: z.string().datetime('Invalid period start date'),
  periodEnd: z.string().datetime('Invalid period end date'),
  description: z.string().optional(),
  orderIds: z.array(z.string()).optional()
});

// Order settlement request schema
const orderSettlementSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  orderId: z.string().min(1, 'Order ID is required'),
  sellerId: z.string().min(1, 'Seller ID is required'),
  orderAmount: z.number().positive('Order amount must be positive'),
  sellerType: z.enum(['TYPE_A', 'TYPE_B'], {
    errorMap: () => ({ message: 'Seller type must be TYPE_A or TYPE_B' })
  }),
  customCommissionRate: z.number().min(0).max(1).optional()
});

/**
 * Create settlement run
 * POST /api/settlement/runs
 */
router.post('/runs', validateInput(settlementRunSchema), async (req: Request, res: Response) => {
  try {
    const { tenantId, runType, periodStart, periodEnd, description, orderIds } = req.body;

    // Create settlement run
    const settlementRun = await settlementRepo.createSettlementRun({
      tenantId,
      runType,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      description,
      metadata: orderIds ? { orderIds } : undefined
    });

    // TODO: Add job to settlement worker queue
    // await settlementQueue.addSettlementRunJob({ ...req.body });

    res.status(201).json({
      success: true,
      data: settlementRun,
      message: 'Settlement run created successfully'
    });
  } catch (error: any) {
    console.error('[Settlement API] Error creating settlement run:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get settlement runs
 * GET /api/settlement/runs
 */
router.get('/runs', async (req: Request, res: Response) => {
  try {
    const { tenantId, status, limit = '50', offset = '0' } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const runs = await settlementRepo.getSettlementRunsByTenant(
      tenantId as string,
      status as any,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.status(200).json({
      success: true,
      data: runs,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: runs.length
      }
    });
  } catch (error: any) {
    console.error('[Settlement API] Error getting settlement runs:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get settlement run details
 * GET /api/settlement/runs/:id
 */
router.get('/runs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const settlementRun = await settlementRepo.getSettlementRunById(id);

    if (!settlementRun) {
      return res.status(404).json({
        success: false,
        error: 'Settlement run not found'
      });
    }

    res.status(200).json({
      success: true,
      data: settlementRun
    });
  } catch (error: any) {
    console.error('[Settlement API] Error getting settlement run:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get settlement run summary
 * GET /api/settlement/summary
 */
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const summary = await settlementRepo.getSettlementRunSummary(tenantId as string);

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    console.error('[Settlement API] Error getting settlement summary:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Create order settlement
 * POST /api/settlement/orders
 */
router.post('/orders', validateInput(orderSettlementSchema), async (req: Request, res: Response) => {
  try {
    const { tenantId, orderId, sellerId, orderAmount, sellerType, customCommissionRate } = req.body;

    // TODO: Add job to settlement worker queue
    // await settlementQueue.addOrderSettlementJob(req.body);

    res.status(202).json({
      success: true,
      message: 'Order settlement job queued successfully'
    });
  } catch (error: any) {
    console.error('[Settlement API] Error creating order settlement:', error);
    res.status(400).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get seller balances
 * GET /api/settlement/balances
 */
router.get('/balances', async (req: Request, res: Response) => {
  try {
    const { tenantId, sellerId, status, limit = '50', offset = '0' } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        error: 'Seller ID is required'
      });
    }

    const balances = await settlementRepo.getSellerBalancesBySeller(
      tenantId as string,
      sellerId as string,
      status as any
    );

    res.status(200).json({
      success: true,
      data: balances,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: balances.length
      }
    });
  } catch (error: any) {
    console.error('[Settlement API] Error getting seller balances:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get seller balance summary
 * GET /api/settlement/balances/summary
 */
router.get('/balances/summary', async (req: Request, res: Response) => {
  try {
    const { tenantId, sellerId, periodStart, periodEnd } = req.query;

    if (!tenantId || !sellerId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID and Seller ID are required'
      });
    }

    const summary = await settlementRepo.getSellerBalanceSummary(
      tenantId as string,
      sellerId as string,
      periodStart ? new Date(periodStart as string) : undefined,
      periodEnd ? new Date(periodEnd as string) : undefined
    );

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    console.error('[Settlement API] Error getting seller balance summary:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get payouts
 * GET /api/settlement/payouts
 */
router.get('/payouts', async (req: Request, res: Response) => {
  try {
    const { tenantId, sellerId, status, limit = '50', offset = '0' } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        error: 'Seller ID is required'
      });
    }

    const payouts = await settlementRepo.getPayoutsBySeller(
      tenantId as string,
      sellerId as string,
      status as any,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.status(200).json({
      success: true,
      data: payouts,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: payouts.length
      }
    });
  } catch (error: any) {
    console.error('[Settlement API] Error getting payouts:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get payout summary
 * GET /api/settlement/payouts/summary
 */
router.get('/payouts/summary', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const summary = await settlementRepo.getPayoutSummary(tenantId as string);

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    console.error('[Settlement API] Error getting payout summary:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Get sellers with pending balances
 * GET /api/settlement/sellers/pending
 */
router.get('/sellers/pending', async (req: Request, res: Response) => {
  try {
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant ID is required'
      });
    }

    const sellers = await settlementRepo.getSellersWithPendingBalances(tenantId as string);

    res.status(200).json({
      success: true,
      data: sellers
    });
  } catch (error: any) {
    console.error('[Settlement API] Error getting sellers with pending balances:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;

