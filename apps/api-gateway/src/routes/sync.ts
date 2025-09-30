import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getJobService } from '@tdc/infra';

const router = Router();

// Validation schemas
const SyncDataSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  userId: z.string().optional(),
  syncType: z.enum(['products', 'orders', 'customers', 'inventory']),
  sourceSystem: z.string().min(1, 'Source system is required'),
  targetSystem: z.string().min(1, 'Target system is required'),
  batchSize: z.number().min(1).max(1000).default(100),
  lastSyncDate: z.string().optional(),
});

// POST /api/sync/start - Start sync process
router.post('/start', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = SyncDataSchema.parse(req.body);
    
    console.log(`🔄 Starting ${validatedData.syncType} sync from ${validatedData.sourceSystem} to ${validatedData.targetSystem}`);

    // Add sync job to queue
    const jobService = getJobService();
    const job = await jobService.addSyncJob({
      tenantId: validatedData.tenantId,
      userId: validatedData.userId,
      syncType: validatedData.syncType,
      sourceSystem: validatedData.sourceSystem,
      targetSystem: validatedData.targetSystem,
      batchSize: validatedData.batchSize,
      lastSyncDate: validatedData.lastSyncDate,
    });

    console.log('✅ Sync job queued:', job.id);

    // Return immediately with job ID
    res.status(202).json({
      success: true,
      data: {
        jobId: job.id,
        syncType: validatedData.syncType,
        sourceSystem: validatedData.sourceSystem,
        targetSystem: validatedData.targetSystem,
        status: 'queued',
        message: 'Sync job has been queued',
      },
      message: 'Sync request accepted',
    });

  } catch (error: any) {
    console.error('❌ Error starting sync:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// GET /api/sync/status/:jobId - Check sync job status
router.get('/status/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    const jobService = getJobService();
    const job = await jobService.getJob('sync', jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Sync job not found',
      });
    }

    const jobState = await job.getState();
    const progress = job.progress;

    res.json({
      success: true,
      data: {
        jobId: job.id,
        state: jobState,
        progress: progress,
        syncType: job.data.syncType,
        sourceSystem: job.data.sourceSystem,
        targetSystem: job.data.targetSystem,
        result: job.returnvalue,
        failedReason: job.failedReason,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
      },
    });

  } catch (error: any) {
    console.error('❌ Error checking sync status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// GET /api/sync/types - Get available sync types
router.get('/types', async (req: Request, res: Response) => {
  try {
    const syncTypes = [
      {
        type: 'products',
        name: 'Product Sync',
        description: 'Synchronize products between systems',
        estimatedDuration: '5-15 minutes',
        batchSize: 100,
      },
      {
        type: 'orders',
        name: 'Order Sync',
        description: 'Synchronize orders between systems',
        estimatedDuration: '3-10 minutes',
        batchSize: 50,
      },
      {
        type: 'customers',
        name: 'Customer Sync',
        description: 'Synchronize customer data between systems',
        estimatedDuration: '2-8 minutes',
        batchSize: 200,
      },
      {
        type: 'inventory',
        name: 'Inventory Sync',
        description: 'Synchronize inventory levels between systems',
        estimatedDuration: '1-5 minutes',
        batchSize: 500,
      },
    ];

    res.json({
      success: true,
      data: syncTypes,
    });

  } catch (error: any) {
    console.error('❌ Error getting sync types:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

export default router;