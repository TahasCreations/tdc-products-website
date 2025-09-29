import { createHash } from 'crypto';
/**
 * Generate SHA256 hash for an object
 */
export function sha256(obj) {
    const str = JSON.stringify(obj, Object.keys(obj).sort());
    return createHash('sha256').update(str).digest('hex');
}
/**
 * Generate checksum for an entity
 */
export function generateChecksum(data) {
    // Remove system fields from checksum calculation
    const { id, rev, updatedAt, updatedBy, checksum, deletedAt, ...payload } = data;
    return sha256(payload);
}
/**
 * Verify checksum for an entity
 */
export function verifyChecksum(entity) {
    if (!entity.checksum)
        return false;
    const calculated = generateChecksum(entity);
    return calculated === entity.checksum;
}
