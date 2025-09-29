import chokidar from 'chokidar'
import { 
  TChange, 
  TProduct, 
  TCategory,
  generateChecksum,
  signedFetch,
  retryFetch
} from '@tdc/sync-protocol'
import { LocalFileManager } from './file-manager'
import { logger } from '../lib/logger'

export class WatcherService {
  private fileManager: LocalFileManager
  private cloudBaseUrl: string
  private syncToken: string
  private watcher: chokidar.FSWatcher | null = null
  private isWatching = false

  constructor() {
    this.fileManager = new LocalFileManager()
    this.cloudBaseUrl = process.env.CLOUD_SYNC_BASE || ''
    this.syncToken = process.env.SYNC_TOKEN || ''
  }

  /**
   * Start watching for file changes
   */
  async start(): Promise<void> {
    if (this.isWatching) {
      logger.warn('Watcher is already running')
      return
    }

    if (!this.cloudBaseUrl || !this.syncToken) {
      logger.error('Cloud sync not configured, skipping watcher')
      return
    }

    const dataDir = process.env.DATA_DIR || 'data'
    const watchPattern = `${dataDir}/**/*.json`

    logger.info('Starting file watcher', { pattern: watchPattern })

    this.watcher = chokidar.watch(watchPattern, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 100
      }
    })

    this.watcher
      .on('change', (path) => this.handleFileChange(path, 'change'))
      .on('add', (path) => this.handleFileChange(path, 'add'))
      .on('unlink', (path) => this.handleFileChange(path, 'unlink'))
      .on('error', (error) => logger.error('Watcher error', { error }))

    this.isWatching = true
    logger.info('File watcher started successfully')
  }

  /**
   * Stop watching for file changes
   */
  async stop(): Promise<void> {
    if (this.watcher) {
      await this.watcher.close()
      this.watcher = null
    }
    this.isWatching = false
    logger.info('File watcher stopped')
  }

  /**
   * Handle file change events
   */
  private async handleFileChange(path: string, event: string): Promise<void> {
    try {
      logger.debug('File change detected', { path, event })

      // Skip if this is a sync from cloud
      if (path.includes('/.sync-temp/')) {
        return
      }

      const change = await this.buildChangeFromFile(path, event)
      if (!change) {
        return
      }

      await this.pushChangeToCloud(change)

    } catch (error) {
      logger.error('Failed to handle file change', { path, event, error })
    }
  }

  /**
   * Build change object from file path and event
   */
  private async buildChangeFromFile(
    path: string, 
    event: string
  ): Promise<TChange | null> {
    try {
      if (path.includes('/products/')) {
        return await this.buildProductChange(path, event)
      } else if (path.includes('/categories/')) {
        return await this.buildCategoryChange(path, event)
      }
      return null
    } catch (error) {
      logger.error('Failed to build change from file', { path, event, error })
      return null
    }
  }

  private async buildProductChange(
    path: string, 
    event: string
  ): Promise<TChange | null> {
    const id = this.extractIdFromPath(path)
    if (!id) return null

    if (event === 'unlink') {
      // File deleted - create delete change
      return {
        entity: 'product',
        op: 'delete',
        data: {
          id,
          name: '',
          price: 0,
          enabled: false,
          rev: 0,
          updatedBy: 'local',
          checksum: '',
          updatedAt: new Date().toISOString()
        }
      }
    }

    // File added/changed - read content
    const content = await this.fileManager.getProduct(id)
    if (!content) return null

    // Update checksum and mark as local change
    const updatedProduct: TProduct = {
      ...content,
      checksum: generateChecksum(content),
      updatedBy: 'local',
      updatedAt: new Date().toISOString()
    }

    return {
      entity: 'product',
      op: 'upsert',
      data: updatedProduct
    }
  }

  private async buildCategoryChange(
    path: string, 
    event: string
  ): Promise<TChange | null> {
    const id = this.extractIdFromPath(path)
    if (!id) return null

    if (event === 'unlink') {
      // File deleted - create delete change
      return {
        entity: 'category',
        op: 'delete',
        data: {
          id,
          name: '',
          slug: '',
          enabled: false,
          rev: 0,
          updatedBy: 'local',
          checksum: '',
          updatedAt: new Date().toISOString()
        }
      }
    }

    // File added/changed - read content
    const content = await this.fileManager.getCategory(id)
    if (!content) return null

    // Update checksum and mark as local change
    const updatedCategory: TCategory = {
      ...content,
      checksum: generateChecksum(content),
      updatedBy: 'local',
      updatedAt: new Date().toISOString()
    }

    return {
      entity: 'category',
      op: 'upsert',
      data: updatedCategory
    }
  }

  /**
   * Push change to cloud
   */
  private async pushChangeToCloud(change: TChange): Promise<void> {
    try {
      const latestRev = await this.fileManager.getLatestRevision()
      
      const batch = {
        clientRev: latestRev,
        changes: [change],
        clientId: 'local-agent'
      }

      await retryFetch(
        () => signedFetch(`${this.cloudBaseUrl}/api/sync/push`, this.syncToken, batch),
        3,
        1000
      )

      logger.info('Change pushed to cloud', {
        entity: change.entity,
        operation: change.op,
        entityId: change.data.id
      })

    } catch (error) {
      logger.error('Failed to push change to cloud', {
        entity: change.entity,
        entityId: change.data.id,
        error
      })
      
      // TODO: Queue for retry
    }
  }

  /**
   * Extract entity ID from file path
   */
  private extractIdFromPath(path: string): string | null {
    const match = path.match(/\/([^\/]+)\.json$/)
    return match ? match[1] : null
  }
}
