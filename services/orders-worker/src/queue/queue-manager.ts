import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import { env } from '@tdc/config';

export interface EventJobData {
  eventId: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  payload: any;
  metadata?: any;
}

export class QueueManager {
  private redis: Redis;
  private eventQueue: Queue<EventJobData>;
  private queueEvents: QueueEvents;

  constructor() {
    this.redis = new Redis(env.getRedisUrl(), {
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
    });

    this.eventQueue = new Queue<EventJobData>('event-processing', {
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

    this.queueEvents = new QueueEvents('event-processing', {
      connection: this.redis,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.queueEvents.on('completed', (jobId) => {
      console.log(`✅ Job ${jobId} completed successfully`);
    });

    this.queueEvents.on('failed', (jobId, err) => {
      console.error(`❌ Job ${jobId} failed:`, err.message);
    });

    this.queueEvents.on('stalled', (jobId) => {
      console.warn(`⚠️ Job ${jobId} stalled`);
    });
  }

  async addEventJob(data: EventJobData): Promise<Job<EventJobData>> {
    return await this.eventQueue.add('process-event', data, {
      priority: this.getEventPriority(data.eventType),
    });
  }

  private getEventPriority(eventType: string): number {
    const priorityMap: Record<string, number> = {
      'OrderCreated': 10,
      'OrderCancelled': 9,
      'PaymentProcessed': 8,
      'UserCreated': 7,
      'ProductCreated': 6,
      'TenantCreated': 5,
    };
    
    return priorityMap[eventType] || 1;
  }

  async getQueueStats() {
    const waiting = await this.eventQueue.getWaiting();
    const active = await this.eventQueue.getActive();
    const completed = await this.eventQueue.getCompleted();
    const failed = await this.eventQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    };
  }

  async pauseQueue(): Promise<void> {
    await this.eventQueue.pause();
    console.log('⏸️ Queue paused');
  }

  async resumeQueue(): Promise<void> {
    await this.eventQueue.resume();
    console.log('▶️ Queue resumed');
  }

  async close(): Promise<void> {
    await this.eventQueue.close();
    await this.queueEvents.close();
    await this.redis.quit();
  }
}

