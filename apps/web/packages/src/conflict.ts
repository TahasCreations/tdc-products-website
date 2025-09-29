import { TEntityBase, TRevisionLog } from './index'

/**
 * Conflict resolution strategies
 */
export enum ConflictStrategy {
  LAST_WRITE_WINS = 'last-write-wins',
  FIELD_PRIORITY = 'field-priority',
  MANUAL = 'manual'
}

/**
 * Conflict resolution result
 */
export interface ConflictResult {
  winner: 'current' | 'incoming'
  reason: string
  revisionLog?: Partial<TRevisionLog>
}

/**
 * Last Write Wins conflict resolution
 */
export function resolveLastWriteWins(
  current: TEntityBase,
  incoming: TEntityBase
): ConflictResult {
  const currentTime = new Date(current.updatedAt).getTime()
  const incomingTime = new Date(incoming.updatedAt).getTime()

  if (incomingTime >= currentTime) {
    return {
      winner: 'incoming',
      reason: `Incoming updated at ${incoming.updatedAt} >= current ${current.updatedAt}`
    }
  }

  return {
    winner: 'current',
    reason: `Current updated at ${current.updatedAt} > incoming ${incoming.updatedAt}`
  }
}

/**
 * Field priority conflict resolution
 */
export function resolveFieldPriority(
  current: TEntityBase,
  incoming: TEntityBase,
  priorityFields: string[]
): ConflictResult {
  // For now, fall back to LWW
  // In the future, this could implement field-level merging
  return resolveLastWriteWins(current, incoming)
}

/**
 * Main conflict resolver
 */
export function resolveConflict(
  current: TEntityBase,
  incoming: TEntityBase,
  strategy: ConflictStrategy = ConflictStrategy.LAST_WRITE_WINS,
  options?: any
): ConflictResult {
  switch (strategy) {
    case ConflictStrategy.LAST_WRITE_WINS:
      return resolveLastWriteWins(current, incoming)
    
    case ConflictStrategy.FIELD_PRIORITY:
      return resolveFieldPriority(
        current,
        incoming,
        options?.priorityFields || []
      )
    
    case ConflictStrategy.MANUAL:
      return {
        winner: 'current', // Default to current for manual resolution
        reason: 'Manual resolution required'
      }
    
    default:
      return resolveLastWriteWins(current, incoming)
  }
}

/**
 * Check if two entities are in conflict
 */
export function hasConflict(current: TEntityBase, incoming: TEntityBase): boolean {
  // Entities are in conflict if they have the same ID but different revisions
  // and the incoming entity is not newer
  if (current.id !== incoming.id) return false
  
  const currentTime = new Date(current.updatedAt).getTime()
  const incomingTime = new Date(incoming.updatedAt).getTime()
  
  // No conflict if incoming is clearly newer
  if (incomingTime > currentTime) return false
  
  // No conflict if revisions are the same
  if (current.rev === incoming.rev) return false
  
  // Conflict if they have different revisions and similar timestamps
  return Math.abs(currentTime - incomingTime) < 5000 // 5 second threshold
}
