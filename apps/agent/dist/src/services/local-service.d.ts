import { SyncPullResponse } from '@tdc/sync-protocol';
/**
 * Get local changes to send to cloud
 */
export declare function getLocalChanges(sinceRev: number, limit: number): Promise<SyncPullResponse>;
