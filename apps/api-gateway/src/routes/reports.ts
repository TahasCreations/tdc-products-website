import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getJobService } from '@tdc/infra';

const router = Router();

// Validation schemas
const GenerateReportSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  userId: z.string().optional(),
  reportType: z.enum(['sales', 'inventory', 'customer', 'financial']),
  dateRange: z.object({
    start: z.string().min(1, 'Start date is required'),
    end: z.string().min(1, 'End date is required'),
  }),
  filters: z.record(z.any()).optional(),
  format: z.enum(['pdf', 'excel', 'csv']).default('pdf'),
  outputPath: z.string().min(1, 'Output path is required'),
  emailRecipients: z.array(z.string().email()).optional(),
});

// POST /api/reports/generate - Generate report
router.post('/generate', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = GenerateReportSchema.parse(req.body);
    
    console.log(`📊 Generating ${validatedData.reportType} report for tenant ${validatedData.tenantId}`);

    // Add report generation job to queue
    const jobService = getJobService();
    const job = await jobService.addReportGenerationJob({
      tenantId: validatedData.tenantId,
      userId: validatedData.userId,
      reportType: validatedData.reportType,
      dateRange: validatedData.dateRange,
      filters: validatedData.filters,
      format: validatedData.format,
      outputPath: validatedData.outputPath,
      emailRecipients: validatedData.emailRecipients,
    });

    console.log('✅ Report generation job queued:', job.id);

    // Return immediately with job ID
    res.status(202).json({
      success: true,
      data: {
        jobId: job.id,
        reportType: validatedData.reportType,
        format: validatedData.format,
        status: 'queued',
        message: 'Report generation job has been queued',
      },
      message: 'Report generation request accepted',
    });

  } catch (error: any) {
    console.error('❌ Error generating report:', error);

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

// GET /api/reports/status/:jobId - Check report job status
router.get('/status/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    const jobService = getJobService();
    const job = await jobService.getJob('report-generation', jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Report job not found',
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
        reportType: job.data.reportType,
        format: job.data.format,
        result: job.returnvalue,
        failedReason: job.failedReason,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
      },
    });

  } catch (error: any) {
    console.error('❌ Error checking report status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// GET /api/reports/types - Get available report types
router.get('/types', async (req: Request, res: Response) => {
  try {
    const reportTypes = [
      {
        type: 'sales',
        name: 'Sales Report',
        description: 'Revenue, orders, and sales analytics',
        supportedFormats: ['pdf', 'excel', 'csv'],
        estimatedDuration: '2-5 minutes',
      },
      {
        type: 'inventory',
        name: 'Inventory Report',
        description: 'Product stock levels and inventory analytics',
        supportedFormats: ['pdf', 'excel', 'csv'],
        estimatedDuration: '1-3 minutes',
      },
      {
        type: 'customer',
        name: 'Customer Report',
        description: 'Customer analytics and behavior insights',
        supportedFormats: ['pdf', 'excel', 'csv'],
        estimatedDuration: '3-7 minutes',
      },
      {
        type: 'financial',
        name: 'Financial Report',
        description: 'Financial metrics and profitability analysis',
        supportedFormats: ['pdf', 'excel', 'csv'],
        estimatedDuration: '5-10 minutes',
      },
    ];

    res.json({
      success: true,
      data: reportTypes,
    });

  } catch (error: any) {
    console.error('❌ Error getting report types:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

export default router;