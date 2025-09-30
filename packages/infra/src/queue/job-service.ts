import { Queue, Job, QueueEvents, Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { env } from '@tdc/config';

// Job Types
export interface BaseJobData {
  jobId: string;
  tenantId: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  retryCount?: number;
}

export interface ImageProcessingJobData extends BaseJobData {
  type: 'image-processing';
  imageUrl: string;
  imageId: string;
  operations: {
    resize?: { width: number; height: number; quality?: number };
    thumbnail?: { width: number; height: number; quality?: number };
    optimize?: { quality: number; format?: 'webp' | 'jpeg' | 'png' };
    watermark?: { text?: string; imageUrl?: string; position?: string };
  };
  outputPath: string;
}

export interface ReportGenerationJobData extends BaseJobData {
  type: 'report-generation';
  reportType: 'sales' | 'inventory' | 'customer' | 'financial';
  dateRange: { start: string; end: string };
  filters?: Record<string, any>;
  format: 'pdf' | 'excel' | 'csv';
  outputPath: string;
  emailRecipients?: string[];
}

export interface SyncJobData extends BaseJobData {
  type: 'sync';
  syncType: 'products' | 'orders' | 'customers' | 'inventory';
  sourceSystem: string;
  targetSystem: string;
  batchSize?: number;
  lastSyncDate?: string;
}

export interface EmailJobData extends BaseJobData {
  type: 'email';
  template: string;
  recipients: string[];
  subject: string;
  data: Record<string, any>;
  attachments?: Array<{ filename: string; content: string; contentType: string }>;
}

export interface NotificationJobData extends BaseJobData {
  type: 'notification';
  channel: 'push' | 'sms' | 'webhook' | 'slack';
  recipients: string[];
  message: string;
  data?: Record<string, any>;
}

export type JobData = 
  | ImageProcessingJobData 
  | ReportGenerationJobData 
  | SyncJobData 
  | EmailJobData 
  | NotificationJobData;

export interface JobResult {
  success: boolean;
  jobId: string;
  result?: any;
  error?: string;
  duration?: number;
  outputUrl?: string;
  metadata?: Record<string, any>;
}

export interface JobStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
}

export class JobService {
  private redis: Redis;
  private queues: Map<string, Queue<JobData>> = new Map();
  private workers: Map<string, Worker<JobData>> = new Map();
  private queueEvents: Map<string, QueueEvents> = new Map();

  constructor() {
    this.redis = new Redis(env.getRedisUrl(), {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
    });

    this.initializeQueues();
  }

  private initializeQueues() {
    const queueNames = [
      'image-processing',
      'report-generation', 
      'sync',
      'email',
      'notification',
      'general'
    ];

    queueNames.forEach(queueName => {
      const queue = new Queue<JobData>(queueName, {
        connection: this.redis,
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 50,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
        },
      });

      const queueEvents = new QueueEvents(queueName, {
        connection: this.redis,
      });

      this.queues.set(queueName, queue);
      this.queueEvents.set(queueName, queueEvents);

      this.setupQueueEventListeners(queueName, queueEvents);
    });
  }

  private setupQueueEventListeners(queueName: string, queueEvents: QueueEvents) {
    queueEvents.on('completed', (jobId) => {
      console.log(`✅ Job ${jobId} completed in queue ${queueName}`);
    });

    queueEvents.on('failed', (jobId, err) => {
      console.error(`❌ Job ${jobId} failed in queue ${queueName}:`, err.message);
    });

    queueEvents.on('stalled', (jobId) => {
      console.warn(`⚠️ Job ${jobId} stalled in queue ${queueName}`);
    });
  }

  // Generic job addition
  async addJob<T extends JobData>(
    queueName: string, 
    jobData: T, 
    options?: {
      priority?: number;
      delay?: number;
      attempts?: number;
      removeOnComplete?: number;
      removeOnFail?: number;
    }
  ): Promise<Job<T>> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const jobOptions = {
      priority: options?.priority || this.getJobPriority(jobData.type),
      delay: options?.delay || 0,
      attempts: options?.attempts || 3,
      removeOnComplete: options?.removeOnComplete || 100,
      removeOnFail: options?.removeOnFail || 50,
    };

    return await queue.add(jobData.type, jobData, jobOptions);
  }

  private getJobPriority(jobType: string): number {
    const priorities: Record<string, number> = {
      'email': 10,           // High priority
      'notification': 9,     // High priority
      'image-processing': 7, // Medium priority
      'report-generation': 5, // Low priority
      'sync': 3,             // Low priority
    };
    
    return priorities[jobType] || 1;
  }

  // Specific job creators
  async addImageProcessingJob(data: Omit<ImageProcessingJobData, 'type' | 'jobId' | 'createdAt'>): Promise<Job<ImageProcessingJobData>> {
    const jobData: ImageProcessingJobData = {
      ...data,
      type: 'image-processing',
      jobId: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    return await this.addJob('image-processing', jobData);
  }

  async addReportGenerationJob(data: Omit<ReportGenerationJobData, 'type' | 'jobId' | 'createdAt'>): Promise<Job<ReportGenerationJobData>> {
    const jobData: ReportGenerationJobData = {
      ...data,
      type: 'report-generation',
      jobId: `rpt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    return await this.addJob('report-generation', jobData);
  }

  async addSyncJob(data: Omit<SyncJobData, 'type' | 'jobId' | 'createdAt'>): Promise<Job<SyncJobData>> {
    const jobData: SyncJobData = {
      ...data,
      type: 'sync',
      jobId: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    return await this.addJob('sync', jobData);
  }

  async addEmailJob(data: Omit<EmailJobData, 'type' | 'jobId' | 'createdAt'>): Promise<Job<EmailJobData>> {
    const jobData: EmailJobData = {
      ...data,
      type: 'email',
      jobId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    return await this.addJob('email', jobData);
  }

  async addNotificationJob(data: Omit<NotificationJobData, 'type' | 'jobId' | 'createdAt'>): Promise<Job<NotificationJobData>> {
    const jobData: NotificationJobData = {
      ...data,
      type: 'notification',
      jobId: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    return await this.addJob('notification', jobData);
  }

  // Job management
  async getJob(queueName: string, jobId: string): Promise<Job<JobData> | undefined> {
    const queue = this.queues.get(queueName);
    if (!queue) return undefined;

    return await queue.getJob(jobId);
  }

  async getJobStats(queueName: string): Promise<JobStats> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const [waiting, active, completed, failed, delayed, paused] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
      queue.getPaused(),
    ]);

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
      paused: paused.length,
    };
  }

  async getAllStats(): Promise<Record<string, JobStats>> {
    const stats: Record<string, JobStats> = {};
    
    for (const queueName of this.queues.keys()) {
      stats[queueName] = await this.getJobStats(queueName);
    }

    return stats;
  }

  async pauseQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.pause();
    console.log(`⏸️ Queue ${queueName} paused`);
  }

  async resumeQueue(queueName: string): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.resume();
    console.log(`▶️ Queue ${queueName} resumed`);
  }

  async cleanQueue(queueName: string, grace: number = 0): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    await queue.clean(grace, 100, 'completed');
    await queue.clean(grace, 50, 'failed');
    console.log(`🧹 Queue ${queueName} cleaned`);
  }

  // Worker management
  async startWorker(
    queueName: string, 
    processor: (job: Job<JobData>) => Promise<JobResult>
  ): Promise<void> {
    if (this.workers.has(queueName)) {
      console.log(`⚠️ Worker for queue ${queueName} already running`);
      return;
    }

    const worker = new Worker<JobData>(
      queueName,
      async (job) => {
        console.log(`🔄 Processing job ${job.id} in queue ${queueName}`);
        const startTime = Date.now();
        
        try {
          const result = await processor(job);
          const duration = Date.now() - startTime;
          
          console.log(`✅ Job ${job.id} completed in ${duration}ms`);
          return { ...result, duration };
        } catch (error: any) {
          const duration = Date.now() - startTime;
          console.error(`❌ Job ${job.id} failed after ${duration}ms:`, error.message);
          
          return {
            success: false,
            jobId: job.id!,
            error: error.message,
            duration,
          };
        }
      },
      {
        connection: this.redis,
        concurrency: this.getConcurrency(queueName),
        removeOnComplete: 100,
        removeOnFail: 50,
      }
    );

    worker.on('completed', (job) => {
      console.log(`✅ Worker completed job ${job.id} in queue ${queueName}`);
    });

    worker.on('failed', (job, err) => {
      console.error(`❌ Worker failed job ${job?.id} in queue ${queueName}:`, err.message);
    });

    worker.on('error', (err) => {
      console.error(`❌ Worker error in queue ${queueName}:`, err.message);
    });

    this.workers.set(queueName, worker);
    console.log(`👷 Worker started for queue ${queueName}`);
  }

  private getConcurrency(queueName: string): number {
    const concurrency: Record<string, number> = {
      'image-processing': 3,    // CPU intensive
      'report-generation': 2,   // Memory intensive
      'sync': 5,                // I/O intensive
      'email': 10,              // Lightweight
      'notification': 10,       // Lightweight
      'general': 5,             // Default
    };
    
    return concurrency[queueName] || 5;
  }

  async stopWorker(queueName: string): Promise<void> {
    const worker = this.workers.get(queueName);
    if (!worker) {
      console.log(`⚠️ No worker found for queue ${queueName}`);
      return;
    }

    await worker.close();
    this.workers.delete(queueName);
    console.log(`🛑 Worker stopped for queue ${queueName}`);
  }

  async stopAllWorkers(): Promise<void> {
    const promises = Array.from(this.workers.keys()).map(queueName => 
      this.stopWorker(queueName)
    );
    
    await Promise.all(promises);
    console.log('🛑 All workers stopped');
  }

  async close(): Promise<void> {
    await this.stopAllWorkers();
    
    for (const queue of this.queues.values()) {
      await queue.close();
    }
    
    for (const queueEvents of this.queueEvents.values()) {
      await queueEvents.close();
    }
    
    await this.redis.quit();
    console.log('🔌 Job service closed');
  }
}

// Singleton instance
let jobServiceInstance: JobService | null = null;

export function getJobService(): JobService {
  if (!jobServiceInstance) {
    jobServiceInstance = new JobService();
  }
  return jobServiceInstance;
}

export default JobService;