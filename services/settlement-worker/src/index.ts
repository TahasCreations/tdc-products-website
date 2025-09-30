import { SettlementQueueManager } from './queue/queue-manager.js';
import cron from 'node-cron';

console.log('🚀 Starting Settlement Worker...');

const queueManager = new SettlementQueueManager();

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  await queueManager.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  await queueManager.shutdown();
  process.exit(0);
});

// Error handlers
process.on('uncaughtException', async (error) => {
  console.error('💥 Uncaught Exception:', error);
  await queueManager.shutdown();
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  await queueManager.shutdown();
  process.exit(1);
});

// Scheduled settlement runs (daily at 2 AM)
cron.schedule('0 2 * * *', async () => {
  console.log('🕐 Running scheduled settlement...');
  
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add settlement run job for all tenants
    // In a real implementation, you would get all tenant IDs
    const tenantIds = ['default-tenant']; // This should come from database
    
    for (const tenantId of tenantIds) {
      await queueManager.addSettlementRunJob({
        tenantId,
        runType: 'SCHEDULED',
        periodStart: yesterday.toISOString(),
        periodEnd: today.toISOString(),
        description: `Daily settlement for ${yesterday.toLocaleDateString('tr-TR')}`
      });
    }
    
    console.log('✅ Scheduled settlement jobs added');
  } catch (error) {
    console.error('❌ Failed to add scheduled settlement jobs:', error);
  }
});

// Weekly cleanup (Sundays at 3 AM)
cron.schedule('0 3 * * 0', async () => {
  console.log('🧹 Running weekly cleanup...');
  
  try {
    await queueManager.cleanupCompletedJobs();
    console.log('✅ Weekly cleanup completed');
  } catch (error) {
    console.error('❌ Weekly cleanup failed:', error);
  }
});

// Health check endpoint (if needed)
if (process.env.ENABLE_HEALTH_CHECK === 'true') {
  const http = require('http');
  const server = http.createServer(async (req: any, res: any) => {
    if (req.url === '/health') {
      try {
        const stats = await queueManager.getQueueStats();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          queues: stats
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  const port = process.env.HEALTH_CHECK_PORT || 3004;
  server.listen(port, () => {
    console.log(`🏥 Health check server running on port ${port}`);
  });
}

console.log('✅ Settlement Worker started successfully');
console.log('📊 Queue Manager initialized');
console.log('⏰ Scheduled jobs configured');
console.log('🔄 Workers are processing jobs...');

// Log queue stats every 5 minutes
setInterval(async () => {
  try {
    const stats = await queueManager.getQueueStats();
    console.log('📊 Queue Stats:', {
      settlementRun: `${stats.settlementRun.active} active, ${stats.settlementRun.waiting} waiting`,
      orderSettlement: `${stats.orderSettlement.active} active, ${stats.orderSettlement.waiting} waiting`
    });
  } catch (error) {
    console.error('❌ Failed to get queue stats:', error);
  }
}, 5 * 60 * 1000); // 5 minutes

