import { Router } from 'express';
import { logger } from '../lib/logger';
const router = Router();
router.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        uptime: process.uptime()
    });
});
router.get('/detailed', async (req, res) => {
    try {
        // Check database connection
        // TODO: Add actual database health check
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            environment: process.env.NODE_ENV || 'development',
            database: 'connected' // TODO: Check actual connection
        });
    }
    catch (error) {
        logger.error('Health check failed', { error });
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Health check failed'
        });
    }
});
export { router as healthRouter };
