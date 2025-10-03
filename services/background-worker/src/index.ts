#!/usr/bin/env tsx

/**
 * Background Job Worker Service
 * 
 * This service processes background jobs from BullMQ queues:
 * - Image processing
 * - Report generation
 * - Data synchronization
 * - Email sending
 * - Notifications
 * 
 * Designed for Vercel serverless limitations:
 * - Long-running tasks moved to background
 * - API handlers return immediately
 * - Workers process jobs asynchronously
 */

import { getJobService } from '@tdc/infra';
import { ImageProcessingHandler } from '@tdc/infra';
import { ReportGenerationHandler } from '@tdc/infra';
import { SyncHandler } from '@tdc/infra';
import { env } from '@tdc/config';

class BackgroundWorkerService {
  private jobService = getJobService();
  private imageHandler = new ImageProcessingHandler();
  private reportHandler = new ReportGenerationHandler();
  private syncHandler = new SyncHandler();
  private isShuttingDown = false;

  async start(): Promise<void> {
    console.log('🚀 Starting Background Worker Service...');
    console.log(`   Environment: ${env.getNodeEnv()}`);
    console.log(`   Redis URL: ${env.getRedisUrl()}`);

    try {
      // Start workers for each queue
      await this.startImageProcessingWorker();
      await this.startReportGenerationWorker();
      await this.startSyncWorker();
      await this.startEmailWorker();
      await this.startNotificationWorker();

      // Setup graceful shutdown
      this.setupGracefulShutdown();

      console.log('✅ Background Worker Service started successfully');
      console.log('   Press Ctrl+C to stop');

      // Log stats every 30 seconds
      this.startStatsLogger();

    } catch (error: any) {
      console.error('❌ Failed to start Background Worker Service:', error.message);
      process.exit(1);
    }
  }

  private async startImageProcessingWorker(): Promise<void> {
    await this.jobService.startWorker('image-processing', async (job) => {
      console.log(`🖼️ Processing image job ${job.id}`);
      return await this.imageHandler.process(job);
    });
  }

  private async startReportGenerationWorker(): Promise<void> {
    await this.jobService.startWorker('report-generation', async (job) => {
      console.log(`📊 Processing report job ${job.id}`);
      return await this.reportHandler.process(job);
    });
  }

  private async startSyncWorker(): Promise<void> {
    await this.jobService.startWorker('sync', async (job) => {
      console.log(`🔄 Processing sync job ${job.id}`);
      return await this.syncHandler.process(job);
    });
  }

  private async startEmailWorker(): Promise<void> {
    await this.jobService.startWorker('email', async (job) => {
      console.log(`📧 Processing email job ${job.id}`);
      return await this.processEmailJob(job);
    });
  }

  private async startNotificationWorker(): Promise<void> {
    await this.jobService.startWorker('notification', async (job) => {
      console.log(`🔔 Processing notification job ${job.id}`);
      return await this.processNotificationJob(job);
    });
  }

  private async processEmailJob(job: any): Promise<any> {
    const { jobId, template, recipients, subject, data, attachments } = job.data;

    console.log(`📧 Sending email to ${recipients.length} recipients`);

    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(`✅ Email sent successfully`);

      return {
        success: true,
        jobId,
        result: {
          recipients: recipients.length,
          subject,
          sentAt: new Date().toISOString(),
        },
      };

    } catch (error: any) {
      console.error(`❌ Email sending failed:`, error.message);
      
      return {
        success: false,
        jobId,
        error: error.message,
      };
    }
  }

  private async processNotificationJob(job: any): Promise<any> {
    const { jobId, channel, recipients, message, data } = job.data;

    console.log(`🔔 Sending ${channel} notification to ${recipients.length} recipients`);

    try {
      // Simulate notification sending
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log(`✅ Notification sent successfully`);

      return {
        success: true,
        jobId,
        result: {
          channel,
          recipients: recipients.length,
          message,
          sentAt: new Date().toISOString(),
        },
      };

    } catch (error: any) {
      console.error(`❌ Notification sending failed:`, error.message);
      
      return {
        success: false,
        jobId,
        error: error.message,
      };
    }
  }

  private startStatsLogger(): void {
    setInterval(async () => {
      if (this.isShuttingDown) return;

      try {
        const stats = await this.jobService.getAllStats();
        console.log('\n📊 Background Worker Stats:');
        
        Object.entries(stats).forEach(([queueName, queueStats]) => {
          console.log(`   ${queueName}:`);
          console.log(`     Waiting: ${queueStats.waiting}, Active: ${queueStats.active}`);
          console.log(`     Completed: ${queueStats.completed}, Failed: ${queueStats.failed}`);
        });

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
        // Close job service
        await this.jobService.close();
        console.log('🔌 Job service closed');

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
    console.log('🛑 Stopping Background Worker Service...');
    await this.jobService.close();
    console.log('✅ Background Worker Service stopped');
  }
}

// Start the service
const service = new BackgroundWorkerService();

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
