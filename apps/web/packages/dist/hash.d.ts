/**
 * Generate SHA256 hash for an object
 */
export declare function sha256(obj: any): string;
/**
 * Generate checksum for an entity
 */
export declare function generateChecksum(data: Record<string, any>): string;
/**
 * Verify checksum for an entity
 */
export declare function verifyChecksum(entity: Record<string, any>): boolean;
