import { Router } from 'express';
import { ChangeBatch, signedFetch, retryFetch } from '@tdc/sync-protocol';
import { processCloudChanges } from '../services/sync-service';
import { getLocalChanges } from '../services/local-service';
import { logger } from '../lib/logger';
const router = Router();
// POST /sync/push - Receive changes from cloud
router.post('/push', async (req, res) => {
    try {
        const body = await ChangeBatch.parseAsync(req.body);
        logger.info('Received sync push', {
            changesCount: body.changes.length,
            clientRev: body.clientRev,
            clientId: body.clientId
        });
        const result = await processCloudChanges(body);
        const response = {
            success: true,
            conflicts: result.conflicts,
            appliedCount: result.appliedCount,
            latestRev: result.latestRev
        };
        logger.info('Sync push completed', {
            appliedCount: result.appliedCount,
            conflictsCount: result.conflicts?.length || 0
        });
        res.json(response);
    }
    catch (error) {
        logger.error('Sync push failed', { error });
        res.status(500).json({
            success: false,
            error: 'Failed to process sync push'
        });
    }
});
// GET /sync/pull - Send local changes to cloud
router.get('/pull', async (req, res) => {
    try {
        const sinceRev = parseInt(req.query.sinceRev) || 0;
        const limit = parseInt(req.query.limit) || 100;
        logger.info('Received sync pull request', { sinceRev, limit });
        const result = await getLocalChanges(sinceRev, limit);
        const response = {
            sinceRev,
            latestRev: result.latestRev,
            changes: result.changes,
            hasMore: result.hasMore
        };
        logger.info('Sync pull completed', {
            changesCount: result.changes.length,
            latestRev: result.latestRev
        });
        res.json(response);
    }
    catch (error) {
        logger.error('Sync pull failed', { error });
        res.status(500).json({
            error: 'Failed to process sync pull'
        });
    }
});
// POST /sync/initiate - Initiate sync with cloud
router.post('/initiate', async (req, res) => {
    try {
        const cloudBaseUrl = process.env.CLOUD_SYNC_BASE;
        const syncToken = process.env.SYNC_TOKEN;
        if (!cloudBaseUrl || !syncToken) {
            return res.status(500).json({
                error: 'Cloud sync not configured'
            });
        }
        logger.info('Initiating sync with cloud', { cloudBaseUrl });
        // Pull changes from cloud
        const pullResult = await retryFetch(() => signedFetch(`${cloudBaseUrl}/api/sync/pull`, syncToken), 3, 1000);
        // Process cloud changes
        const processResult = await processCloudChanges(pullResult);
        // Push local changes to cloud
        const localChanges = await getLocalChanges(0, 1000);
        if (localChanges.changes.length > 0) {
            await retryFetch(() => signedFetch(`${cloudBaseUrl}/api/sync/push`, syncToken, {
                clientRev: 0,
                changes: localChanges.changes,
                clientId: 'local-agent'
            }), 3, 1000);
        }
        logger.info('Sync initiation completed', {
            cloudChangesApplied: processResult.appliedCount,
            localChangesPushed: localChanges.changes.length
        });
        res.json({
            success: true,
            cloudChangesApplied: processResult.appliedCount,
            localChangesPushed: localChanges.changes.length,
            conflicts: processResult.conflicts
        });
    }
    catch (error) {
        logger.error('Sync initiation failed', { error });
        res.status(500).json({
            error: 'Failed to initiate sync'
        });
    }
});
export { router as syncRouter };
