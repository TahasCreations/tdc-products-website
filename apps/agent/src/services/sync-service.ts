import { 
  ChangeBatch, 
  TChange, 
  TProduct, 
  TCategory,
  generateChecksum,
  resolveConflict,
  ConflictStrategy
} from '@tdc/sync-protocol'
import { LocalFileManager } from './file-manager'
import { logger } from '../lib/logger'

export interface SyncResult {
  appliedCount: number
  conflicts?: any[]
  latestRev: number
}

/**
 * Process changes received from cloud
 */
export async function processCloudChanges(batch: ChangeBatch): Promise<SyncResult> {
  const fileManager = new LocalFileManager()
  const conflicts: any[] = []
  let appliedCount = 0
  let latestRev = 0

  logger.info('Processing cloud changes', {
    changesCount: batch.changes.length,
    clientRev: batch.clientRev
  })

  for (const change of batch.changes) {
    try {
      const result = await processChange(fileManager, change, batch.clientRev)
      
      if (result.success) {
        appliedCount++
        latestRev = Math.max(latestRev, result.rev || 0)
        
        logger.debug('Applied cloud change', {
          entity: change.entity,
          operation: change.op,
          entityId: change.data.id,
          rev: result.rev
        })
      } else if (result.conflict) {
        conflicts.push(result.conflict)
        
        logger.warn('Conflict detected', {
          entity: change.entity,
          entityId: change.data.id,
          currentRev: result.conflict.currentRev,
          incomingRev: result.conflict.incomingRev
        })
      }
    } catch (error) {
      logger.error('Failed to process change', {
        entity: change.entity,
        entityId: change.data.id,
        error
      })
    }
  }

  return {
    appliedCount,
    conflicts: conflicts.length > 0 ? conflicts : undefined,
    latestRev
  }
}

async function processChange(
  fileManager: LocalFileManager,
  change: TChange,
  clientRev: number
): Promise<{ success: boolean; rev?: number; conflict?: any }> {
  const { entity, op, data } = change

  if (entity === 'product') {
    return await processProductChange(fileManager, op, data as TProduct, clientRev)
  } else if (entity === 'category') {
    return await processCategoryChange(fileManager, op, data as TCategory, clientRev)
  }

  return { success: false }
}

async function processProductChange(
  fileManager: LocalFileManager,
  op: string,
  data: TProduct,
  clientRev: number
): Promise<{ success: boolean; rev?: number; conflict?: any }> {
  if (op === 'delete') {
    await fileManager.deleteProduct(data.id)
    return { success: true, rev: clientRev + 1 }
  }

  // Upsert operation
  const current = await fileManager.getProduct(data.id)

  // Check for conflicts
  if (current && current.rev !== data.rev) {
    const conflict = resolveConflict(current, data, ConflictStrategy.LAST_WRITE_WINS)
    
    if (conflict.winner === 'current') {
      return {
        success: false,
        conflict: {
          entity: 'product',
          id: data.id,
          currentRev: current.rev,
          incomingRev: data.rev,
          decided: 'current'
        }
      }
    }
  }

  // Generate new checksum and update revision
  const checksum = generateChecksum(data)
  const newRev = Math.max((current?.rev || 0) + 1, clientRev + 1)

  const updatedProduct: TProduct = {
    ...data,
    rev: newRev,
    updatedBy: 'cloud',
    checksum,
    updatedAt: new Date().toISOString()
  }

  await fileManager.saveProduct(updatedProduct)

  return { success: true, rev: newRev }
}

async function processCategoryChange(
  fileManager: LocalFileManager,
  op: string,
  data: TCategory,
  clientRev: number
): Promise<{ success: boolean; rev?: number; conflict?: any }> {
  if (op === 'delete') {
    await fileManager.deleteCategory(data.id)
    return { success: true, rev: clientRev + 1 }
  }

  // Upsert operation
  const current = await fileManager.getCategory(data.id)

  // Check for conflicts
  if (current && current.rev !== data.rev) {
    const conflict = resolveConflict(current, data, ConflictStrategy.LAST_WRITE_WINS)
    
    if (conflict.winner === 'current') {
      return {
        success: false,
        conflict: {
          entity: 'category',
          id: data.id,
          currentRev: current.rev,
          incomingRev: data.rev,
          decided: 'current'
        }
      }
    }
  }

  // Generate new checksum and update revision
  const checksum = generateChecksum(data)
  const newRev = Math.max((current?.rev || 0) + 1, clientRev + 1)

  const updatedCategory: TCategory = {
    ...data,
    rev: newRev,
    updatedBy: 'cloud',
    checksum,
    updatedAt: new Date().toISOString()
  }

  await fileManager.saveCategory(updatedCategory)

  return { success: true, rev: newRev }
}
