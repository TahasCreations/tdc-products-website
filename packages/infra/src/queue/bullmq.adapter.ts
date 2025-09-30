import { 
  QueuePort, 
  QueueJob, 
  QueueJobResult, 
  QueueOptions, 
  QueueStats 
} from '@tdc/domain';
import { validateEnv } from '@tdc/config';

export class BullMQAdapter implements QueuePort {
  private readonly redisUrl: string;
  private readonly queues: Map<string, any> = new Map();

  constructor() {
    const env = validateEnv();
    this.redisUrl = env.REDIS_URL || env.UPSTASH_REDIS_URL || 'redis://localhost:6379';
  }

  async publish(job: QueueJob): Promise<QueueJobResult> {
    try {
      const queue = await this.getQueue(job.name);
      
      const bullJob = await queue.add(job.name, job.data, {
        priority: job.priority,
        delay: job.delay,
        attempts: job.attempts || 3,
        backoff: job.backoff ? {
          type: job.backoff.type,
          delay: job.backoff.delay
        } : undefined,
        removeOnComplete: job.removeOnComplete,
        removeOnFail: job.removeOnFail
      });

      return {
        success: true,
        jobId: bullJob.id?.toString() || '',
        result: bullJob.data
      };
    } catch (error) {
      return {
        success: false,
        jobId: '',
        error: error instanceof Error ? error.message : 'Job publish failed'
      };
    }
  }

  async publishBulk(jobs: QueueJob[]): Promise<QueueJobResult[]> {
    try {
      const results: QueueJobResult[] = [];
      
      for (const job of jobs) {
        const result = await this.publish(job);
        results.push(result);
      }
      
      return results;
    } catch (error) {
      return jobs.map(() => ({
        success: false,
        jobId: '',
        error: error instanceof Error ? error.message : 'Bulk publish failed'
      }));
    }
  }

  async consume(queueName: string, processor: (job: QueueJob) => Promise<any>): Promise<void> {
    try {
      const queue = await this.getQueue(queueName);
      
      queue.process(async (bullJob: any) => {
        const job: QueueJob = {
          id: bullJob.id?.toString() || '',
          name: bullJob.name,
          data: bullJob.data,
          priority: bullJob.opts.priority,
          delay: bullJob.opts.delay,
          attempts: bullJob.opts.attempts,
          backoff: bullJob.opts.backoff,
          removeOnComplete: bullJob.opts.removeOnComplete,
          removeOnFail: bullJob.opts.removeOnFail
        };

        try {
          const result = await processor(job);
          return result;
        } catch (error) {
          throw error;
        }
      });

      console.log(`Started consuming queue: ${queueName}`);
    } catch (error) {
      throw new Error(`Failed to start consuming queue ${queueName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getJobStatus(jobId: string): Promise<QueueJob | null> {
    try {
      // Search through all queues to find the job
      for (const [queueName, queue] of this.queues) {
        const job = await queue.getJob(jobId);
        if (job) {
          return {
            id: job.id?.toString() || '',
            name: job.name,
            data: job.data,
            priority: job.opts.priority,
            delay: job.opts.delay,
            attempts: job.opts.attempts,
            backoff: job.opts.backoff,
            removeOnComplete: job.opts.removeOnComplete,
            removeOnFail: job.opts.removeOnFail
          };
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async retryJob(jobId: string): Promise<QueueJobResult> {
    try {
      for (const [queueName, queue] of this.queues) {
        const job = await queue.getJob(jobId);
        if (job) {
          await job.retry();
          return {
            success: true,
            jobId,
            result: job.data
          };
        }
      }
      
      return {
        success: false,
        jobId,
        error: 'Job not found'
      };
    } catch (error) {
      return {
        success: false,
        jobId,
        error: error instanceof Error ? error.message : 'Job retry failed'
      };
    }
  }

  async removeJob(jobId: string): Promise<QueueJobResult> {
    try {
      for (const [queueName, queue] of this.queues) {
        const job = await queue.getJob(jobId);
        if (job) {
          await job.remove();
          return {
            success: true,
            jobId,
            result: job.data
          };
        }
      }
      
      return {
        success: false,
        jobId,
        error: 'Job not found'
      };
    } catch (error) {
      return {
        success: false,
        jobId,
        error: error instanceof Error ? error.message : 'Job removal failed'
      };
    }
  }

  async getQueueStats(queueName: string): Promise<QueueStats> {
    try {
      const queue = await this.getQueue(queueName);
      
      const waiting = await queue.getWaiting();
      const active = await queue.getActive();
      const completed = await queue.getCompleted();
      const failed = await queue.getFailed();
      const delayed = await queue.getDelayed();
      
      return {
        waiting: waiting.length,
        active: active.length,
        completed: completed.length,
        failed: failed.length,
        delayed: delayed.length
      };
    } catch (error) {
      throw new Error(`Failed to get queue stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async pauseQueue(queueName: string): Promise<void> {
    try {
      const queue = await this.getQueue(queueName);
      await queue.pause();
    } catch (error) {
      throw new Error(`Failed to pause queue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async resumeQueue(queueName: string): Promise<void> {
    try {
      const queue = await this.getQueue(queueName);
      await queue.resume();
    } catch (error) {
      throw new Error(`Failed to resume queue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async cleanQueue(queueName: string, grace: number): Promise<void> {
    try {
      const queue = await this.getQueue(queueName);
      await queue.clean(grace, 'completed');
      await queue.clean(grace, 'failed');
    } catch (error) {
      throw new Error(`Failed to clean queue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getQueue(queueName: string): Promise<any> {
    if (this.queues.has(queueName)) {
      return this.queues.get(queueName);
    }

    // In real implementation, import BullMQ
    // import { Queue } from 'bullmq';
    // const queue = new Queue(queueName, { connection: this.redisUrl });
    
    // Mock queue for now
    const mockQueue = {
      add: async (name: string, data: any, opts: any) => ({
        id: Date.now(),
        name,
        data,
        opts
      }),
      process: async (processor: any) => {
        console.log(`Mock processor registered for ${queueName}`);
      },
      getJob: async (id: string) => null,
      getWaiting: async () => [],
      getActive: async () => [],
      getCompleted: async () => [],
      getFailed: async () => [],
      getDelayed: async () => [],
      pause: async () => {},
      resume: async () => {},
      clean: async (grace: number, type: string) => {}
    };

    this.queues.set(queueName, mockQueue);
    return mockQueue;
  }
}



