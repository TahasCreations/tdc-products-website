/**
 * API Cache Layer with SWR (Stale-While-Revalidate)
 * 
 * Features:
 * - SWR pattern: serve stale data while fetching fresh data in background
 * - Distributed lock (SETNX emulation) to prevent cache stampede
 * - Hot-key limiter: rate limit per cache key to prevent abuse
 * - TTL jitter to prevent thundering herd
 * - Event-based invalidation matrix
 * 
 * @module lib/api-cache
 */

import { kv, CACHE_TTL } from './redis';

type CacheRecord<T> = {
  ts: number;
  data: T;
  version?: string;
};

const BASE_TTL = Number(process.env.CACHE_DEFAULT_TTL_SEC ?? 120);
const STALE_TTL = Number(process.env.CACHE_STALE_TTL_SEC ?? 360);
const LOCK_TTL = 5; // seconds

/**
 * Add jitter to TTL to prevent thundering herd
 * Randomizes TTL between 90% and 110% of original value
 */
function jitter(sec: number): number {
  const factor = 0.9 + Math.random() * 0.2;
  return Math.max(1, Math.floor(sec * factor));
}

/**
 * Cache with SWR pattern
 * 
 * @param key - Cache key
 * @param ttlSec - Fresh TTL in seconds
 * @param fetcher - Function to fetch fresh data
 * @param opts - Additional options
 * @returns Cached or fresh data
 * 
 * @example
 * ```ts
 * const products = await cached(
 *   'products:list:v1:p1',
 *   120,
 *   () => db.product.findMany({ take: 24 }),
 *   { staleTtlSec: 360, hotLimitPerSec: 300 }
 * );
 * ```
 */
export async function cached<T>(
  key: string,
  ttlSec: number = BASE_TTL,
  fetcher: () => Promise<T>,
  opts?: {
    staleTtlSec?: number;
    hotLimitPerSec?: number;
    version?: string;
  }
): Promise<T> {
  const now = Date.now();
  const staleTtl = (opts?.staleTtlSec ?? STALE_TTL) * 1000;

  // Hot-key limiter: prevent too many requests to same key per second
  if (opts?.hotLimitPerSec) {
    const rateLimitKey = `rl:cache:${key}:${Math.floor(now / 1000)}`;
    const count = await kv.incr(rateLimitKey);
    if (count === 1) {
      await kv.expire(rateLimitKey, 2);
    }
    if (count > opts.hotLimitPerSec) {
      // Degrade: return stale cache if available
      const rec = await kv.get<CacheRecord<T>>(key);
      if (rec?.data) {
        console.warn(`[cache] Hot key limit exceeded: ${key}, serving stale`);
        return rec.data;
      }
    }
  }

  // Try to get cached data
  const rec = await kv.get<CacheRecord<T>>(key);

  // Check version mismatch
  if (rec && opts?.version && rec.version !== opts.version) {
    console.log(`[cache] Version mismatch for ${key}, invalidating`);
    await kv.del(key);
    return await revalidate(key, ttlSec, fetcher, opts?.version);
  }

  // Fresh cache hit
  if (rec && now - rec.ts < ttlSec * 1000) {
    return rec.data;
  }

  // Stale cache hit - serve stale and revalidate in background
  if (rec && now - rec.ts < staleTtl) {
    // Async revalidation (fire and forget)
    revalidate(key, ttlSec, fetcher, opts?.version).catch((err) => {
      console.error(`[cache] Background revalidation failed for ${key}:`, err);
    });
    return rec.data;
  }

  // Cache miss or expired - synchronous revalidation with lock
  return await revalidate(key, ttlSec, fetcher, opts?.version);
}

/**
 * Revalidate cache with distributed lock to prevent stampede
 * 
 * Uses simple lock strategy (Upstash doesn't support SETNX directly)
 * For Memorystore migration, use: SET key val NX EX 5
 */
async function revalidate<T>(
  key: string,
  ttlSec: number,
  fetcher: () => Promise<T>,
  version?: string
): Promise<T> {
  const lockKey = `lock:${key}`;

  // Try to acquire lock
  const lockExists = await kv.exists(lockKey);
  if (lockExists) {
    // Another process is already fetching, wait and retry
    await sleep(100);
    const rec = await kv.get<CacheRecord<T>>(key);
    if (rec?.data) {
      return rec.data;
    }
    // If still no data, proceed anyway (lock might be stale)
  }

  try {
    // Set lock
    await kv.set(lockKey, '1', { ex: LOCK_TTL });

    // Fetch fresh data
    const data = await fetcher();

    // Store with jittered TTL
    const record: CacheRecord<T> = {
      ts: Date.now(),
      data,
      version,
    };
    await kv.set(key, record, { ex: jitter(ttlSec) });

    return data;
  } catch (error) {
    console.error(`[cache] Revalidation error for ${key}:`, error);
    throw error;
  } finally {
    // Release lock
    await kv.del(lockKey);
  }
}

/**
 * Invalidate cache keys
 * Supports single key, array of keys, or pattern
 * 
 * @example
 * ```ts
 * // Single key
 * await invalidate('products:list:v1:p1');
 * 
 * // Multiple keys
 * await invalidate(['products:list:v1:p1', 'products:list:v1:p2']);
 * 
 * // Pattern (use with caution in production)
 * await invalidatePattern('products:list:*');
 * ```
 */
export async function invalidate(keys: string[] | string): Promise<void> {
  try {
    if (Array.isArray(keys)) {
      if (keys.length > 0) {
        await kv.del(keys);
      }
    } else {
      await kv.del(keys);
    }
  } catch (error) {
    console.error('[cache] Invalidation error:', error);
  }
}

/**
 * Invalidate cache keys by pattern
 * WARNING: Use with caution, KEYS command can be slow on large datasets
 * 
 * @param pattern - Redis pattern (e.g., 'products:*')
 */
export async function invalidatePattern(pattern: string): Promise<void> {
  try {
    const keys = await kv.keys(pattern);
    if (keys.length > 0) {
      console.log(`[cache] Invalidating ${keys.length} keys matching ${pattern}`);
      await kv.del(keys);
    }
  } catch (error) {
    console.error('[cache] Pattern invalidation error:', error);
  }
}

/**
 * Invalidation Matrix
 * Defines which cache keys to invalidate on specific events
 * 
 * Usage:
 * ```ts
 * import { invalidationMatrix } from '@/lib/api-cache';
 * 
 * // On product update
 * await invalidationMatrix.product.update(productId);
 * 
 * // On category update
 * await invalidationMatrix.category.update(categoryId);
 * ```
 */
export const invalidationMatrix = {
  product: {
    async update(productId: string) {
      await invalidate([
        `product:${productId}`,
        // Invalidate all product lists (could be optimized with category info)
      ]);
      await invalidatePattern('products:list:*');
      await invalidatePattern('search:*');
      await invalidatePattern('trending:*');
    },
    async delete(productId: string) {
      await this.update(productId);
    },
  },
  
  category: {
    async update(categoryId: string) {
      await invalidate([`category:${categoryId}`]);
      await invalidatePattern('categories:list*');
      await invalidatePattern('products:list:*');
    },
    async delete(categoryId: string) {
      await this.update(categoryId);
    },
  },
  
  user: {
    async update(userId: string) {
      await invalidate([
        `user:${userId}`,
        `cart:${userId}`,
        `wishlist:${userId}`,
      ]);
    },
  },
  
  cart: {
    async update(userId: string) {
      await invalidate([`cart:${userId}`]);
    },
  },
  
  wishlist: {
    async update(userId: string) {
      await invalidate([`wishlist:${userId}`]);
    },
  },
  
  search: {
    async clear() {
      await invalidatePattern('search:*');
    },
  },
  
  trending: {
    async refresh() {
      await invalidatePattern('trending:*');
    },
  },
  
  // Bulk invalidation for major updates
  async clearAll() {
    console.warn('[cache] Clearing ALL cache - use with caution!');
    await invalidatePattern('*');
  },
};

/**
 * Cache statistics helper
 */
export async function getCacheStats(keyPattern: string = '*'): Promise<{
  totalKeys: number;
  keys: string[];
}> {
  try {
    const keys = await kv.keys(keyPattern);
    return {
      totalKeys: keys.length,
      keys: keys.slice(0, 100), // Limit to first 100 for display
    };
  } catch (error) {
    console.error('[cache] Stats error:', error);
    return { totalKeys: 0, keys: [] };
  }
}

/**
 * Utility: sleep for async operations
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Backward compatibility with old ApiCache class
 */
export class ApiCache {
  static async get<T>(key: string): Promise<T | null> {
    const rec = await kv.get<CacheRecord<T>>(key);
    return rec?.data ?? null;
  }

  static async set<T>(
    key: string,
    value: T,
    ttl: number = BASE_TTL
  ): Promise<"OK" | null> {
    const record: CacheRecord<T> = {
      ts: Date.now(),
      data: value,
    };
    await kv.set(key, record, { ex: ttl });
    return "OK";
  }

  static async invalidate(key: string): Promise<number> {
    await kv.del(key);
    return 1;
  }
}
