/**
 * Enterprise Queue System with BullMQ
 * Background job processing, scheduling & retry logic
 */

import { Queue, Worker, QueueScheduler, Job } from 'bullmq';
import { Redis } from 'ioredis';
import { sendSMS, SMS_TEMPLATES } from '@/lib/sms';
import { prisma } from '@/lib/prisma';

const connection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

// Define queue types
export enum QueueName {
  EMAIL = 'email-queue',
  SMS = 'sms-queue',
  IMAGE_PROCESSING = 'image-processing-queue',
  ANALYTICS = 'analytics-queue',
  NOTIFICATIONS = 'notifications-queue',
  DATA_EXPORT = 'data-export-queue',
  INVENTORY_SYNC = 'inventory-sync-queue',
  RECOMMENDATION = 'recommendation-queue',
}

// Job data interfaces
interface EmailJobData {
  to: string;
  subject: string;
  template: string;
  data: any;
  priority?: number;
}

interface SMSJobData {
  phone: string;
  message: string;
  provider?: 'twilio' | 'netgsm';
}

interface ImageProcessingJobData {
  imageUrl: string;
  operations: Array<'resize' | 'compress' | 'watermark' | 'format'>;
  sizes?: number[];
}

interface AnalyticsJobData {
  eventType: string;
  userId?: string;
  metadata: any;
}

export class EnterpriseQueueSystem {
  private queues: Map<QueueName, Queue> = new Map();
  private workers: Map<QueueName, Worker> = new Map();
  private schedulers: Map<QueueName, QueueScheduler> = new Map();

  constructor() {
    this.initializeQueues();
  }

  private initializeQueues() {
    // Initialize all queues
    Object.values(QueueName).forEach((queueName) => {
      const queue = new Queue(queueName, { connection });
      const scheduler = new QueueScheduler(queueName, { connection });

      this.queues.set(queueName, queue);
      this.schedulers.set(queueName, scheduler);

      // Setup worker for each queue
      this.setupWorker(queueName);
    });
  }

  private setupWorker(queueName: QueueName) {
    const worker = new Worker(
      queueName,
      async (job: Job) => {
        console.log(`Processing job ${job.id} in queue ${queueName}`);
        
        try {
          switch (queueName) {
            case QueueName.EMAIL:
              await this.processEmailJob(job.data as EmailJobData);
              break;
            case QueueName.SMS:
              await this.processSMSJob(job.data as SMSJobData);
              break;
            case QueueName.IMAGE_PROCESSING:
              await this.processImageJob(job.data as ImageProcessingJobData);
              break;
            case QueueName.ANALYTICS:
              await this.processAnalyticsJob(job.data as AnalyticsJobData);
              break;
            case QueueName.NOTIFICATIONS:
              await this.processNotificationJob(job.data);
              break;
            case QueueName.DATA_EXPORT:
              await this.processDataExportJob(job.data);
              break;
            case QueueName.INVENTORY_SYNC:
              await this.processInventorySyncJob(job.data);
              break;
            case QueueName.RECOMMENDATION:
              await this.processRecommendationJob(job.data);
              break;
          }

          return { success: true };
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
          throw error;
        }
      },
      {
        connection,
        concurrency: 5,
        limiter: {
          max: 100,
          duration: 1000,
        },
      }
    );

    // Event listeners
    worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed successfully`);
    });

    worker.on('failed', (job, error) => {
      console.error(`Job ${job?.id} failed:`, error);
    });

    this.workers.set(queueName, worker);
  }

  /**
   * Add job to queue
   */
  async addJob<T>(
    queueName: QueueName,
    data: T,
    options?: {
      priority?: number;
      delay?: number;
      attempts?: number;
      backoff?: number;
      removeOnComplete?: boolean;
    }
  ): Promise<Job> {
    const queue = this.queues.get(queueName);
    if (!queue) throw new Error(`Queue ${queueName} not found`);

    return await queue.add(`${queueName}-job`, data, {
      priority: options?.priority || 10,
      delay: options?.delay || 0,
      attempts: options?.attempts || 3,
      backoff: {
        type: 'exponential',
        delay: options?.backoff || 1000,
      },
      removeOnComplete: options?.removeOnComplete ?? true,
      removeOnFail: false,
    });
  }

  /**
   * Schedule recurring job (Cron)
   */
  async scheduleRecurringJob<T>(
    queueName: QueueName,
    cronExpression: string,
    data: T,
    jobName: string
  ) {
    const queue = this.queues.get(queueName);
    if (!queue) throw new Error(`Queue ${queueName} not found`);

    await queue.add(jobName, data, {
      repeat: {
        pattern: cronExpression,
      },
    });
  }

  // Job processors
  private async processEmailJob(data: EmailJobData) {
    // Email sending logic
    console.log(`Sending email to ${data.to}`);
    // Implement with SendGrid, SES, etc.
  }

  private async processSMSJob(data: SMSJobData) {
    await sendSMS(data.phone, data.message, data.provider);
  }

  private async processImageJob(data: ImageProcessingJobData) {
    // Sharp.js image processing
    console.log(`Processing image: ${data.imageUrl}`);
    // Resize, compress, watermark, etc.
  }

  private async processAnalyticsJob(data: AnalyticsJobData) {
    // Send to BigQuery, Mixpanel, etc.
    console.log(`Tracking event: ${data.eventType}`);
  }

  private async processNotificationJob(data: any) {
    // Push notifications, in-app notifications
    console.log('Sending notification');
  }

  private async processDataExportJob(data: any) {
    // Export data to CSV, Excel, etc.
    console.log('Exporting data');
  }

  private async processInventorySyncJob(data: any) {
    // Sync inventory across channels
    console.log('Syncing inventory');
  }

  private async processRecommendationJob(data: any) {
    // Rebuild recommendation cache
    console.log('Rebuilding recommendations');
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(queueName: QueueName) {
    const queue = this.queues.get(queueName);
    if (!queue) return null;

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return { waiting, active, completed, failed, delayed };
  }

  /**
   * Pause/Resume queue
   */
  async pauseQueue(queueName: QueueName) {
    await this.queues.get(queueName)?.pause();
  }

  async resumeQueue(queueName: QueueName) {
    await this.queues.get(queueName)?.resume();
  }

  /**
   * Clean old jobs
   */
  async cleanQueue(queueName: QueueName, olderThan: number = 24 * 60 * 60 * 1000) {
    const queue = this.queues.get(queueName);
    await queue?.clean(olderThan, 1000, 'completed');
    await queue?.clean(olderThan, 1000, 'failed');
  }
}

// Singleton instance
export const queueSystem = new EnterpriseQueueSystem();

// Helper functions
export async function queueEmail(data: EmailJobData) {
  return await queueSystem.addJob(QueueName.EMAIL, data, { priority: 5 });
}

export async function queueSMS(data: SMSJobData) {
  return await queueSystem.addJob(QueueName.SMS, data, { priority: 3 });
}

export async function queueImageProcessing(data: ImageProcessingJobData) {
  return await queueSystem.addJob(QueueName.IMAGE_PROCESSING, data);
}

export async function queueAnalyticsEvent(data: AnalyticsJobData) {
  return await queueSystem.addJob(QueueName.ANALYTICS, data, { 
    priority: 10,
    removeOnComplete: true,
  });
}

// Schedule recurring jobs
export async function setupRecurringJobs() {
  // Daily inventory sync
  await queueSystem.scheduleRecurringJob(
    QueueName.INVENTORY_SYNC,
    '0 2 * * *', // Every day at 2 AM
    {},
    'daily-inventory-sync'
  );

  // Hourly recommendation rebuild
  await queueSystem.scheduleRecurringJob(
    QueueName.RECOMMENDATION,
    '0 * * * *', // Every hour
    {},
    'hourly-recommendation-rebuild'
  );

  // Weekly analytics export
  await queueSystem.scheduleRecurringJob(
    QueueName.DATA_EXPORT,
    '0 0 * * 0', // Every Sunday at midnight
    { type: 'weekly-report' },
    'weekly-analytics-export'
  );
}

