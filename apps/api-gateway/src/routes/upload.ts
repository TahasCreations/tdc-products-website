import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getJobService } from '@tdc/infra';
import { S3Adapter } from '@tdc/infra';

const router = Router();

// Validation schemas
const UploadImageSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  userId: z.string().optional(),
  imageUrl: z.string().url('Valid image URL is required'),
  imageId: z.string().min(1, 'Image ID is required'),
  operations: z.object({
    resize: z.object({
      width: z.number().min(1),
      height: z.number().min(1),
      quality: z.number().min(1).max(100).optional(),
    }).optional(),
    thumbnail: z.object({
      width: z.number().min(1),
      height: z.number().min(1),
      quality: z.number().min(1).max(100).optional(),
    }).optional(),
    optimize: z.object({
      quality: z.number().min(1).max(100),
      format: z.enum(['webp', 'jpeg', 'png']).optional(),
    }).optional(),
    watermark: z.object({
      text: z.string().optional(),
      imageUrl: z.string().url().optional(),
      position: z.string().optional(),
    }).optional(),
  }),
  outputPath: z.string().min(1, 'Output path is required'),
});

// POST /api/upload/image - Upload and process image
router.post('/image', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = UploadImageSchema.parse(req.body);
    
    console.log('📸 Processing image upload request:', validatedData.imageId);

    // Add image processing job to queue
    const jobService = getJobService();
    const job = await jobService.addImageProcessingJob({
      tenantId: validatedData.tenantId,
      userId: validatedData.userId,
      imageUrl: validatedData.imageUrl,
      imageId: validatedData.imageId,
      operations: validatedData.operations,
      outputPath: validatedData.outputPath,
    });

    console.log('✅ Image processing job queued:', job.id);

    // Return immediately with job ID
    res.status(202).json({
      success: true,
      data: {
        jobId: job.id,
        imageId: validatedData.imageId,
        status: 'queued',
        message: 'Image processing job has been queued',
      },
      message: 'Image upload request accepted',
    });

  } catch (error: any) {
    console.error('❌ Error processing image upload:', error);

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

// GET /api/upload/status/:jobId - Check job status
router.get('/status/:jobId', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const { queue } = req.query;

    if (!queue) {
      return res.status(400).json({
        success: false,
        error: 'Queue name is required',
      });
    }

    const jobService = getJobService();
    const job = await jobService.getJob(queue as string, jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
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
        data: job.data,
        result: job.returnvalue,
        failedReason: job.failedReason,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
      },
    });

  } catch (error: any) {
    console.error('❌ Error checking job status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// POST /api/upload/batch - Upload multiple images
router.post('/batch', async (req: Request, res: Response) => {
  try {
    const { tenantId, userId, images } = req.body;

    if (!tenantId || !images || !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        error: 'tenantId and images array are required',
      });
    }

    console.log(`📸 Processing batch upload: ${images.length} images`);

    const jobService = getJobService();
    const jobs = [];

    // Create jobs for each image
    for (const image of images) {
      try {
        const job = await jobService.addImageProcessingJob({
          tenantId,
          userId,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
          operations: image.operations,
          outputPath: image.outputPath,
        });

        jobs.push({
          jobId: job.id,
          imageId: image.imageId,
          status: 'queued',
        });

      } catch (error: any) {
        console.error(`❌ Failed to queue image ${image.imageId}:`, error.message);
        jobs.push({
          jobId: null,
          imageId: image.imageId,
          status: 'failed',
          error: error.message,
        });
      }
    }

    const successCount = jobs.filter(job => job.status === 'queued').length;
    const failureCount = jobs.filter(job => job.status === 'failed').length;

    res.status(202).json({
      success: true,
      data: {
        totalImages: images.length,
        queuedJobs: successCount,
        failedJobs: failureCount,
        jobs: jobs,
      },
      message: `Batch upload processed: ${successCount} queued, ${failureCount} failed`,
    });

  } catch (error: any) {
    console.error('❌ Error processing batch upload:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// GET /api/upload/queues - Get queue statistics
router.get('/queues', async (req: Request, res: Response) => {
  try {
    const jobService = getJobService();
    const stats = await jobService.getAllStats();

    res.json({
      success: true,
      data: stats,
    });

  } catch (error: any) {
    console.error('❌ Error getting queue stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

export default router;