#!/usr/bin/env tsx

/**
 * Orders Worker Service
 * 
 * This service processes events from the EventOutbox table
 * and publishes them to BullMQ for async processing.
 * 
 * Features:
 * - Scans EventOutbox table every 5-30 seconds
 * - Publishes events to BullMQ queue
 * - Processes events with retry logic
 * - Handles different event types
 */

import { Worker } from 'bullmq';
import { QueueManager, EventJobData } from './queue/queue-manager.js';
import { EventProcessor } from './processors/event-processor.js';
import { OutboxScanner } from './scanners/outbox-scanner.js';
import { env } from '@tdc/config';

class OrdersWorkerService {
  private queueManager: QueueManager;
  private eventProcessor: EventProcessor;
  private outboxScanner: OutboxScanner;
  private worker: Worker<EventJobData> | null = null;
  private isShuttingDown = false;

  constructor() {
    this.queueManager = new QueueManager();
    this.eventProcessor = new EventProcessor();
    this.outboxScanner = new OutboxScanner(this.queueManager);
  }

  async start(): Promise<void> {
    console.log('🚀 Starting Orders Worker Service...');
    console.log(`   Environment: ${env.getNodeEnv()}`);
    console.log(`   Redis URL: ${env.getRedisUrl()}`);

    try {
      // Start BullMQ worker
      await this.startWorker();

      // Start outbox scanner
      this.outboxScanner.start();

      // Setup graceful shutdown
      this.setupGracefulShutdown();

      console.log('✅ Orders Worker Service started successfully');
      console.log('   Press Ctrl+C to stop');

      // Log stats every 30 seconds
      this.startStatsLogger();

    } catch (error: any) {
      console.error('❌ Failed to start Orders Worker Service:', error.message);
      process.exit(1);
    }
  }

  private async startWorker(): Promise<void> {
    this.worker = new Worker<EventJobData>(
      'event-processing',
      async (job) => {
        console.log(`🔄 Processing job ${job.id}: ${job.data.eventType}`);
        await this.eventProcessor.processEvent(job);
      },
      {
        connection: this.queueManager['redis'],
        concurrency: 5, // Process up to 5 jobs concurrently
        removeOnComplete: 100,
        removeOnFail: 50,
      }
    );

    this.worker.on('completed', (job) => {
      console.log(`✅ Job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`❌ Job ${job?.id} failed:`, err.message);
    });

    this.worker.on('error', (err) => {
      console.error('❌ Worker error:', err.message);
    });

    console.log('👷 BullMQ worker started');
  }

  private startStatsLogger(): void {
    setInterval(async () => {
      if (this.isShuttingDown) return;

      try {
        const stats = await this.outboxScanner.getStats();
        console.log('\n📊 Worker Stats:');
        console.log(`   Scanner Running: ${stats.isRunning}`);
        console.log(`   Cron Pattern: ${stats.cronPattern}`);
        console.log(`   Outbox - Total: ${stats.outboxStats.total}, Pending: ${stats.outboxStats.pending}, Processed: ${stats.outboxStats.processed}`);
        console.log(`   Queue - Waiting: ${stats.queueStats.waiting}, Active: ${stats.queueStats.active}, Completed: ${stats.queueStats.completed}, Failed: ${stats.queueStats.failed}`);
      } catch (error: any) {
        console.error('❌ Error getting stats:', error.message);
      }
    }, 30000); // Every 30 seconds
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      if (this.isShuttingDown) return;
      
      this.isShuttingDown = true;
      console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);

      try {
        // Stop outbox scanner
        this.outboxScanner.stop();

        // Close worker
        if (this.worker) {
          await this.worker.close();
          console.log('👷 Worker closed');
        }

        // Close queue manager
        await this.queueManager.close();
        console.log('📤 Queue manager closed');

        console.log('✅ Graceful shutdown completed');
        process.exit(0);

      } catch (error: any) {
        console.error('❌ Error during shutdown:', error.message);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGUSR2', () => shutdown('SIGUSR2')); // For nodemon
  }

  async stop(): Promise<void> {
    console.log('🛑 Stopping Orders Worker Service...');
    
    this.outboxScanner.stop();
    
    if (this.worker) {
      await this.worker.close();
    }
    
    await this.queueManager.close();
    
    console.log('✅ Orders Worker Service stopped');
  }
}

// Start the service
const service = new OrdersWorkerService();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  service.stop().then(() => process.exit(1));
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  service.stop().then(() => process.exit(1));
});

// Start the service
service.start().catch((error) => {
  console.error('❌ Failed to start service:', error);
  process.exit(1);
});

