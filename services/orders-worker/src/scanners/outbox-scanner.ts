import { CronJob } from 'cron';
import { PrismaOutboxRepository } from '@tdc/infra';
import { QueueManager } from '../queue/queue-manager.js';
import { env } from '@tdc/config';

export class OutboxScanner {
  private outboxRepo: PrismaOutboxRepository;
  private queueManager: QueueManager;
  private cronJob: CronJob | null = null;
  private isRunning = false;

  constructor(queueManager: QueueManager) {
    this.outboxRepo = new PrismaOutboxRepository();
    this.queueManager = queueManager;
  }

  start(): void {
    if (this.cronJob) {
      console.log('⚠️ Outbox scanner is already running');
      return;
    }

    // Run every 5 seconds in development, every 30 seconds in production
    const cronPattern = env.isDevelopment() ? '*/5 * * * * *' : '*/30 * * * * *';
    
    this.cronJob = new CronJob(
      cronPattern,
      () => this.scanAndProcessEvents(),
      null,
      true, // Start immediately
      'UTC'
    );

    console.log('🔄 Outbox scanner started');
    console.log(`   Pattern: ${cronPattern}`);
    console.log(`   Environment: ${env.getNodeEnv()}`);
  }

  stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
      console.log('⏹️ Outbox scanner stopped');
    }
  }

  private async scanAndProcessEvents(): Promise<void> {
    if (this.isRunning) {
      console.log('⏳ Previous scan still running, skipping...');
      return;
    }

    this.isRunning = true;

    try {
      // Get unprocessed events (batch size: 50)
      const events = await this.outboxRepo.findUnprocessed(50);
      
      if (events.length === 0) {
        console.log('📭 No unprocessed events found');
        return;
      }

      console.log(`🔍 Found ${events.length} unprocessed events`);

      // Process events in parallel (max 10 concurrent)
      const batchSize = 10;
      for (let i = 0; i < events.length; i += batchSize) {
        const batch = events.slice(i, i + batchSize);
        await Promise.all(
          batch.map(event => this.processEvent(event))
        );
      }

      console.log(`✅ Processed ${events.length} events`);

    } catch (error: any) {
      console.error('❌ Error scanning outbox:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  private async processEvent(event: any): Promise<void> {
    try {
      console.log(`📤 Publishing event: ${event.eventType} (${event.id})`);

      // Add event to BullMQ queue
      await this.queueManager.addEventJob({
        eventId: event.id,
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        eventType: event.eventType,
        payload: event.payload,
        metadata: event.metadata,
      });

      console.log(`✅ Event ${event.id} queued for processing`);

    } catch (error: any) {
      console.error(`❌ Error processing event ${event.id}:`, error.message);
      
      // Mark as failed in outbox
      await this.outboxRepo.markAsFailed(event.id, error.message);
    }
  }

  async getStats(): Promise<{
    isRunning: boolean;
    cronPattern: string;
    outboxStats: any;
    queueStats: any;
  }> {
    const outboxStats = await this.outboxRepo.getStats();
    const queueStats = await this.queueManager.getQueueStats();

    return {
      isRunning: this.isRunning,
      cronPattern: this.cronJob?.cronTime?.source || 'Not running',
      outboxStats,
      queueStats,
    };
  }
}

