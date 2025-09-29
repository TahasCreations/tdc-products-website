import { 
  ChangeBatch, 
  TChange, 
  TProduct, 
  TCategory,
  generateChecksum,
  signedFetch,
  retryFetch
} from '@tdc/sync-protocol'

/**
 * Sync client for pushing changes to local agent
 */
export class SyncClient {
  private localAgentUrl: string
  private syncToken: string

  constructor() {
    this.localAgentUrl = process.env.LOCAL_AGENT_BASE || 'http://localhost:3001'
    this.syncToken = process.env.SYNC_TOKEN || ''
  }

  /**
   * Push changes to local agent
   */
  async pushChanges(changes: TChange[], clientRev: number): Promise<void> {
    if (!this.syncToken) {
      console.warn('Sync token not configured, skipping local sync')
      return
    }

    const batch: ChangeBatch = {
      clientRev,
      changes,
      clientId: 'cloud-web'
    }

    try {
      await retryFetch(
        () => signedFetch(`${this.localAgentUrl}/sync/push`, this.syncToken, batch),
        3,
        1000
      )
      console.log(`Pushed ${changes.length} changes to local agent`)
    } catch (error) {
      console.error('Failed to push changes to local agent:', error)
      // Fallback to queue if configured
      await this.queueChanges(batch)
    }
  }

  /**
   * Push product change to local agent
   */
  async pushProductChange(
    product: TProduct,
    operation: 'upsert' | 'delete'
  ): Promise<void> {
    const change: TChange = {
      entity: 'product',
      op: operation,
      data: {
        ...product,
        checksum: generateChecksum(product),
        updatedBy: 'cloud'
      }
    }

    await this.pushChanges([change], product.rev)
  }

  /**
   * Push category change to local agent
   */
  async pushCategoryChange(
    category: TCategory,
    operation: 'upsert' | 'delete'
  ): Promise<void> {
    const change: TChange = {
      entity: 'category',
      op: operation,
      data: {
        ...category,
        checksum: generateChecksum(category),
        updatedBy: 'cloud'
      }
    }

    await this.pushChanges([change], category.rev)
  }

  /**
   * Queue changes for later processing (fallback)
   */
  private async queueChanges(batch: ChangeBatch): Promise<void> {
    // TODO: Implement Upstash Queue fallback
    console.warn('Queue fallback not implemented, changes may be lost')
  }
}

// Singleton instance
export const syncClient = new SyncClient()
