import { Job, Worker } from 'bullmq';
import { WebhookAdapter } from '../../../packages/infra/src/webhook/webhook.adapter.js';
import { PrismaClient } from '@prisma/client';

export interface WebhookDeliveryJobData {
  deliveryId: string;
  tenantId: string;
  retryCount?: number;
}

export interface WebhookEventProcessingJobData {
  eventId: string;
  tenantId: string;
}

export interface WebhookHealthCheckJobData {
  subscriptionId: string;
  tenantId: string;
}

// Webhook Delivery Job
export class WebhookDeliveryJob {
  constructor(
    private webhookAdapter: WebhookAdapter,
    private prisma: PrismaClient
  ) {}

  async process(job: Job<WebhookDeliveryJobData>) {
    const { deliveryId, tenantId, retryCount = 0 } = job.data;

    try {
      console.log(`Processing webhook delivery ${deliveryId} (attempt ${retryCount + 1})`);

      // Get delivery details
      const delivery = await this.webhookAdapter.getDelivery(deliveryId, tenantId);
      if (!delivery) {
        throw new Error(`Delivery ${deliveryId} not found`);
      }

      // Check if delivery is still pending
      if (delivery.status !== 'PENDING' && delivery.status !== 'RETRYING') {
        console.log(`Delivery ${deliveryId} is not pending, skipping`);
        return;
      }

      // Attempt delivery
      const result = await this.webhookAdapter.deliverWebhook(deliveryId, tenantId);

      // Log the result
      await this.webhookAdapter.logWebhookEvent(
        result.success ? 'INFO' : 'ERROR',
        `Webhook delivery ${result.success ? 'succeeded' : 'failed'}`,
        {
          tenantId,
          deliveryId,
          requestUrl: delivery.subscription?.url,
          requestMethod: 'POST',
          responseStatus: result.httpStatus,
          responseBody: result.responseBody,
          duration: result.duration,
          errorMessage: result.errorMessage,
          errorCode: result.errorCode
        }
      );

      // If failed and should retry, schedule retry
      if (!result.success && result.shouldRetry && retryCount < 3) {
        const retryDelay = this.calculateRetryDelay(retryCount);
        console.log(`Scheduling retry for delivery ${deliveryId} in ${retryDelay}ms`);
        
        // Schedule retry job
        await job.queue.add(
          'webhook-delivery',
          { deliveryId, tenantId, retryCount: retryCount + 1 },
          { delay: retryDelay }
        );
      }

      console.log(`Webhook delivery ${deliveryId} processed successfully`);
    } catch (error) {
      console.error(`Error processing webhook delivery ${deliveryId}:`, error);
      
      // Log error
      await this.webhookAdapter.logWebhookEvent(
        'ERROR',
        `Webhook delivery processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          tenantId,
          deliveryId,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorCode: 'PROCESSING_ERROR',
          stackTrace: error instanceof Error ? error.stack : undefined
        }
      );

      throw error;
    }
  }

  private calculateRetryDelay(retryCount: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s
    return Math.pow(2, retryCount) * 1000;
  }
}

// Webhook Event Processing Job
export class WebhookEventProcessingJob {
  constructor(
    private webhookAdapter: WebhookAdapter,
    private prisma: PrismaClient
  ) {}

  async process(job: Job<WebhookEventProcessingJobData>) {
    const { eventId, tenantId } = job.data;

    try {
      console.log(`Processing webhook event ${eventId}`);

      // Process the event (this will create deliveries for all matching subscriptions)
      await this.webhookAdapter.processEvent(eventId, tenantId);

      console.log(`Webhook event ${eventId} processed successfully`);
    } catch (error) {
      console.error(`Error processing webhook event ${eventId}:`, error);
      
      // Log error
      await this.webhookAdapter.logWebhookEvent(
        'ERROR',
        `Webhook event processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          tenantId,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorCode: 'EVENT_PROCESSING_ERROR',
          stackTrace: error instanceof Error ? error.stack : undefined
        }
      );

      throw error;
    }
  }
}

// Webhook Health Check Job
export class WebhookHealthCheckJob {
  constructor(
    private webhookAdapter: WebhookAdapter,
    private prisma: PrismaClient
  ) {}

  async process(job: Job<WebhookHealthCheckJobData>) {
    const { subscriptionId, tenantId } = job.data;

    try {
      console.log(`Checking health for webhook subscription ${subscriptionId}`);

      // Get subscription health
      const health = await this.webhookAdapter.getSubscriptionHealth(subscriptionId, tenantId);

      // Update subscription health status
      const isHealthy = health.consecutiveFailures < 5 && health.successRate > 80;
      await this.webhookAdapter.updateSubscriptionHealth(subscriptionId, tenantId, isHealthy);

      // Log health check result
      await this.webhookAdapter.logWebhookEvent(
        'INFO',
        `Webhook subscription health check completed`,
        {
          tenantId,
          subscriptionId,
          isHealthy,
          consecutiveFailures: health.consecutiveFailures,
          successRate: health.successRate,
          lastDeliveryAt: health.lastDeliveryAt
        }
      );

      console.log(`Webhook subscription ${subscriptionId} health check completed: ${isHealthy ? 'healthy' : 'unhealthy'}`);
    } catch (error) {
      console.error(`Error checking webhook subscription health ${subscriptionId}:`, error);
      
      // Log error
      await this.webhookAdapter.logWebhookEvent(
        'ERROR',
        `Webhook health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          tenantId,
          subscriptionId,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          errorCode: 'HEALTH_CHECK_ERROR',
          stackTrace: error instanceof Error ? error.stack : undefined
        }
      );

      throw error;
    }
  }
}

// Webhook Cleanup Job
export class WebhookCleanupJob {
  constructor(private prisma: PrismaClient) {}

  async process(job: Job) {
    try {
      console.log('Starting webhook cleanup job');

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 30); // Keep logs for 30 days

      // Clean up old webhook logs
      const deletedLogs = await this.prisma.webhookLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      });

      // Clean up expired deliveries
      const expiredDeliveries = await this.prisma.webhookDelivery.deleteMany({
        where: {
          status: 'EXPIRED',
          createdAt: {
            lt: cutoffDate
          }
        }
      });

      // Clean up old events
      const oldEvents = await this.prisma.webhookEvent.deleteMany({
        where: {
          status: 'PROCESSED',
          createdAt: {
            lt: cutoffDate
          }
        }
      });

      console.log(`Webhook cleanup completed: ${deletedLogs.count} logs, ${expiredDeliveries.count} deliveries, ${oldEvents.count} events deleted`);

      // Log cleanup result
      await this.prisma.webhookLog.create({
        data: {
          tenantId: 'system',
          level: 'INFO',
          message: 'Webhook cleanup job completed',
          context: {
            deletedLogs: deletedLogs.count,
            deletedDeliveries: expiredDeliveries.count,
            deletedEvents: oldEvents.count,
            cutoffDate: cutoffDate.toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Error in webhook cleanup job:', error);
      throw error;
    }
  }
}

// Webhook Workers
export function createWebhookWorkers(webhookAdapter: WebhookAdapter, prisma: PrismaClient) {
  const deliveryJob = new WebhookDeliveryJob(webhookAdapter, prisma);
  const eventProcessingJob = new WebhookEventProcessingJob(webhookAdapter, prisma);
  const healthCheckJob = new WebhookHealthCheckJob(webhookAdapter, prisma);
  const cleanupJob = new WebhookCleanupJob(prisma);

  return {
    webhookDeliveryWorker: new Worker('webhook-delivery', async (job) => {
      await deliveryJob.process(job);
    }, {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD
      },
      concurrency: 5,
      removeOnComplete: 100,
      removeOnFail: 50
    }),

    webhookEventProcessingWorker: new Worker('webhook-event-processing', async (job) => {
      await eventProcessingJob.process(job);
    }, {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD
      },
      concurrency: 3,
      removeOnComplete: 100,
      removeOnFail: 50
    }),

    webhookHealthCheckWorker: new Worker('webhook-health-check', async (job) => {
      await healthCheckJob.process(job);
    }, {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD
      },
      concurrency: 2,
      removeOnComplete: 50,
      removeOnFail: 25
    }),

    webhookCleanupWorker: new Worker('webhook-cleanup', async (job) => {
      await cleanupJob.process(job);
    }, {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD
      },
      concurrency: 1,
      removeOnComplete: 10,
      removeOnFail: 5
    })
  };
}

