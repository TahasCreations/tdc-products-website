import { TEntityBase, TRevisionLog } from './index';
/**
 * Conflict resolution strategies
 */
export declare enum ConflictStrategy {
    LAST_WRITE_WINS = "last-write-wins",
    FIELD_PRIORITY = "field-priority",
    MANUAL = "manual"
}
/**
 * Conflict resolution result
 */
export interface ConflictResult {
    winner: 'current' | 'incoming';
    reason: string;
    revisionLog?: Partial<TRevisionLog>;
}
/**
 * Last Write Wins conflict resolution
 */
export declare function resolveLastWriteWins(current: TEntityBase, incoming: TEntityBase): ConflictResult;
/**
 * Field priority conflict resolution
 */
export declare function resolveFieldPriority(current: TEntityBase, incoming: TEntityBase, priorityFields: string[]): ConflictResult;
/**
 * Main conflict resolver
 */
export declare function resolveConflict(current: TEntityBase, incoming: TEntityBase, strategy?: ConflictStrategy, options?: any): ConflictResult;
/**
 * Check if two entities are in conflict
 */
export declare function hasConflict(current: TEntityBase, incoming: TEntityBase): boolean;
