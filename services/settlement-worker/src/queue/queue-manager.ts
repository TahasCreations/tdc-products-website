import { Queue, Worker, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import { SettlementProcessor } from '../processors/settlement-processor.js';
import { validateEnv } from '@tdc/config';

const env = validateEnv();

export class SettlementQueueManager {
  private redis: Redis;
  private settlementProcessor: SettlementProcessor;
  
  // Queues
  public settlementRunQueue: Queue;
  public orderSettlementQueue: Queue;
  
  // Workers
  private settlementRunWorker: Worker;
  private orderSettlementWorker: Worker;
  
  // Queue Events
  private settlementRunEvents: QueueEvents;
  private orderSettlementEvents: QueueEvents;

  constructor() {
    this.redis = new Redis(env.REDIS_URL);
    this.settlementProcessor = new SettlementProcessor();
    
    // Initialize queues
    this.settlementRunQueue = new Queue('settlement-run', {
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

    this.orderSettlementQueue = new Queue('order-settlement', {
      connection: this.redis,
      defaultJobOptions: {
        removeOnComplete: 200,
        removeOnFail: 100,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    });

    // Initialize queue events
    this.settlementRunEvents = new QueueEvents('settlement-run', {
      connection: this.redis,
    });

    this.orderSettlementEvents = new QueueEvents('order-settlement', {
      connection: this.redis,
    });

    // Initialize workers
    this.initializeWorkers();
    this.setupEventListeners();
  }

  private initializeWorkers() {
    // Settlement run worker
    this.settlementRunWorker = new Worker(
      'settlement-run',
      async (job) => {
        console.log(`[Settlement Worker] Processing settlement run job ${job.id}`);
        return await this.settlementProcessor.processSettlementRun(job);
      },
      {
        connection: this.redis,
        concurrency: 2, // Process max 2 settlement runs concurrently
      }
    );

    // Order settlement worker
    this.orderSettlementWorker = new Worker(
      'order-settlement',
      async (job) => {
        console.log(`[Settlement Worker] Processing order settlement job ${job.id}`);
        return await this.settlementProcessor.processOrderSettlement(job);
      },
      {
        connection: this.redis,
        concurrency: 10, // Process max 10 order settlements concurrently
      }
    );
  }

  private setupEventListeners() {
    // Settlement run events
    this.settlementRunEvents.on('completed', (jobId, result) => {
      console.log(`[Settlement Worker] Settlement run job ${jobId} completed:`, result);
    });

    this.settlementRunEvents.on('failed', (jobId, err) => {
      console.error(`[Settlement Worker] Settlement run job ${jobId} failed:`, err);
    });

    // Order settlement events
    this.orderSettlementEvents.on('completed', (jobId, result) => {
      console.log(`[Settlement Worker] Order settlement job ${jobId} completed:`, result);
    });

    this.orderSettlementEvents.on('failed', (jobId, err) => {
      console.error(`[Settlement Worker] Order settlement job ${jobId} failed:`, err);
    });

    // Worker events
    this.settlementRunWorker.on('error', (err) => {
      console.error('[Settlement Worker] Settlement run worker error:', err);
    });

    this.orderSettlementWorker.on('error', (err) => {
      console.error('[Settlement Worker] Order settlement worker error:', err);
    });
  }

  /**
   * Add settlement run job
   */
  async addSettlementRunJob(data: {
    tenantId: string;
    runType: 'MANUAL' | 'SCHEDULED' | 'ORDER_TRIGGERED';
    periodStart: string;
    periodEnd: string;
    description?: string;
    orderIds?: string[];
  }) {
    const job = await this.settlementRunQueue.add('process-settlement-run', data, {
      priority: data.runType === 'ORDER_TRIGGERED' ? 10 : 5, // Higher priority for order-triggered
    });

    console.log(`[Settlement Worker] Added settlement run job ${job.id}`);
    return job;
  }

  /**
   * Add order settlement job
   */
  async addOrderSettlementJob(data: {
    tenantId: string;
    orderId: string;
    sellerId: string;
    orderAmount: number;
    sellerType: 'TYPE_A' | 'TYPE_B';
    customCommissionRate?: number;
  }) {
    const job = await this.orderSettlementQueue.add('process-order-settlement', data, {
      priority: 15, // High priority for order settlements
    });

    console.log(`[Settlement Worker] Added order settlement job ${job.id}`);
    return job;
  }

  /**
   * Get queue statistics
   */
  async getQueueStats() {
    const settlementRunStats = await this.settlementRunQueue.getJobCounts();
    const orderSettlementStats = await this.orderSettlementQueue.getJobCounts();

    return {
      settlementRun: {
        waiting: settlementRunStats.waiting,
        active: settlementRunStats.active,
        completed: settlementRunStats.completed,
        failed: settlementRunStats.failed,
        delayed: settlementRunStats.delayed,
      },
      orderSettlement: {
        waiting: orderSettlementStats.waiting,
        active: orderSettlementStats.active,
        completed: orderSettlementStats.completed,
        failed: orderSettlementStats.failed,
        delayed: orderSettlementStats.delayed,
      },
    };
  }

  /**
   * Get job details
   */
  async getJobDetails(queueName: 'settlement-run' | 'order-settlement', jobId: string) {
    const queue = queueName === 'settlement-run' ? this.settlementRunQueue : this.orderSettlementQueue;
    const job = await queue.getJob(jobId);
    
    if (!job) return null;

    return {
      id: job.id,
      name: job.name,
      data: job.data,
      progress: job.progress,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      timestamp: job.timestamp,
      attemptsMade: job.attemptsMade,
      opts: job.opts,
    };
  }

  /**
   * Retry failed job
   */
  async retryJob(queueName: 'settlement-run' | 'order-settlement', jobId: string) {
    const queue = queueName === 'settlement-run' ? this.settlementRunQueue : this.orderSettlementQueue;
    const job = await queue.getJob(jobId);
    
    if (!job) {
      throw new Error(`Job ${jobId} not found in queue ${queueName}`);
    }

    await job.retry();
    console.log(`[Settlement Worker] Retrying job ${jobId} in queue ${queueName}`);
  }

  /**
   * Clean up completed jobs
   */
  async cleanupCompletedJobs() {
    await this.settlementRunQueue.clean(24 * 60 * 60 * 1000, 100, 'completed'); // 24 hours
    await this.orderSettlementQueue.clean(24 * 60 * 60 * 1000, 200, 'completed'); // 24 hours
    
    console.log('[Settlement Worker] Cleaned up completed jobs');
  }

  /**
   * Pause workers
   */
  async pauseWorkers() {
    await this.settlementRunWorker.pause();
    await this.orderSettlementWorker.pause();
    console.log('[Settlement Worker] Workers paused');
  }

  /**
   * Resume workers
   */
  async resumeWorkers() {
    await this.settlementRunWorker.resume();
    await this.orderSettlementWorker.resume();
    console.log('[Settlement Worker] Workers resumed');
  }

  /**
   * Graceful shutdown
   */
  async shutdown() {
    console.log('[Settlement Worker] Shutting down...');
    
    // Close workers
    await this.settlementRunWorker.close();
    await this.orderSettlementWorker.close();
    
    // Close queues
    await this.settlementRunQueue.close();
    await this.orderSettlementQueue.close();
    
    // Close events
    await this.settlementRunEvents.close();
    await this.orderSettlementEvents.close();
    
    // Close Redis connection
    await this.redis.quit();
    
    // Cleanup processor
    await this.settlementProcessor.cleanup();
    
    console.log('[Settlement Worker] Shutdown complete');
  }
}

