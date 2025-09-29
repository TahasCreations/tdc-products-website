import { LocalFileManager } from './file-manager';
import { logger } from '../lib/logger';
/**
 * Get local changes to send to cloud
 */
export async function getLocalChanges(sinceRev, limit) {
    const fileManager = new LocalFileManager();
    const changes = [];
    logger.info('Fetching local changes', { sinceRev, limit });
    // Get product changes
    const products = await fileManager.getProducts();
    const productChanges = products
        .filter(p => p.rev > sinceRev && p.updatedBy === 'local')
        .sort((a, b) => a.rev - b.rev)
        .slice(0, limit);
    for (const product of productChanges) {
        if (product.deletedAt) {
            changes.push({
                entity: 'product',
                op: 'delete',
                data: product
            });
        }
        else {
            changes.push({
                entity: 'product',
                op: 'upsert',
                data: product
            });
        }
    }
    // Get category changes
    const categories = await fileManager.getCategories();
    const categoryChanges = categories
        .filter(c => c.rev > sinceRev && c.updatedBy === 'local')
        .sort((a, b) => a.rev - b.rev)
        .slice(0, limit - changes.length);
    for (const category of categoryChanges) {
        if (category.deletedAt) {
            changes.push({
                entity: 'category',
                op: 'delete',
                data: category
            });
        }
        else {
            changes.push({
                entity: 'category',
                op: 'upsert',
                data: category
            });
        }
    }
    // Get latest revision
    const latestRev = Math.max(...products.map(p => p.rev), ...categories.map(c => c.rev), sinceRev);
    logger.info('Local changes fetched', {
        changesCount: changes.length,
        latestRev
    });
    return {
        sinceRev,
        latestRev,
        changes,
        hasMore: changes.length === limit
    };
}
