import { ChangeBatchType } from '@tdc/sync-protocol';
export interface SyncResult {
    appliedCount: number;
    conflicts?: any[];
    latestRev: number;
}
/**
 * Process changes received from cloud
 */
export declare function processCloudChanges(batch: ChangeBatchType): Promise<SyncResult>;
