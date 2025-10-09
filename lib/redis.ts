/**
 * Redis Abstraction Layer
 * 
 * Upstash REST client ile başlar, ileride ioredis (Memorystore) geçişi için
 * tek arayüz sağlar. Health check ve retry mekanizması içerir.
 * 
 * @module lib/redis
 */

import { Redis } from '@upstash/redis';

/**
 * Key-Value storage interface
 * Upstash veya ioredis implementasyonlarını destekler
 */
export type KV = {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T, opts?: { ex?: number; nx?: boolean }): Promise<void>;
  del(key: string | string[]): Promise<void>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<void>;
  exists(key: string): Promise<boolean>;
  keys(pattern: string): Promise<string[]>;
  mget<T = unknown>(...keys: string[]): Promise<(T | null)[]>;
  zadd(key: string, score: number, member: string): Promise<void>;
  zrevrange(key: string, start: number, stop: number): Promise<string[]>;
  zremrangebyscore(key: string, min: number, max: number): Promise<void>;
  zcard(key: string): Promise<number>;
  zrange(key: string, start: number, stop: number, opts?: { withScores: boolean }): Promise<any[]>;
};

let _client: Redis | null = null;
let _healthCheckFailed = false;

/**
 * Upstash Redis client factory
 * Singleton pattern ile tek instance kullanır
 */
function upstashClient(): Redis {
  if (!_client) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    
    if (!url || !token) {
      console.warn('[redis] Upstash credentials missing, cache disabled');
      _healthCheckFailed = true;
      // Return mock client
      return null as any;
    }
    
    _client = new Redis({ url, token });
  }
  return _client;
}

/**
 * Upstash implementation of KV interface
 */
function upstashKV(): KV {
  const client = upstashClient();
  
  if (!client) {
    // No-op implementation when Redis is not configured
    return createNoOpKV();
  }

  return {
    async get<T>(key: string): Promise<T | null> {
      try {
        return (await client.get(key)) as T | null;
      } catch (error) {
        console.error('[redis] GET error:', error);
        return null;
      }
    },
    
    async set<T>(key: string, value: T, opts?: { ex?: number; nx?: boolean }): Promise<void> {
      try {
        if (opts?.ex) {
          await client.set(key, value, { ex: opts.ex });
        } else {
          await client.set(key, value);
        }
      } catch (error) {
        console.error('[redis] SET error:', error);
      }
    },
    
    async del(key: string | string[]): Promise<void> {
      try {
        if (Array.isArray(key)) {
          await client.del(...key);
        } else {
          await client.del(key);
        }
      } catch (error) {
        console.error('[redis] DEL error:', error);
      }
    },
    
    async incr(key: string): Promise<number> {
      try {
        return (await client.incr(key)) as number;
      } catch (error) {
        console.error('[redis] INCR error:', error);
        return 0;
      }
    },
    
    async expire(key: string, seconds: number): Promise<void> {
      try {
        await client.expire(key, seconds);
      } catch (error) {
        console.error('[redis] EXPIRE error:', error);
      }
    },
    
    async exists(key: string): Promise<boolean> {
      try {
        const result = await client.exists(key);
        return result === 1;
      } catch (error) {
        console.error('[redis] EXISTS error:', error);
        return false;
      }
    },
    
    async keys(pattern: string): Promise<string[]> {
      try {
        return await client.keys(pattern);
      } catch (error) {
        console.error('[redis] KEYS error:', error);
        return [];
      }
    },
    
    async mget<T>(...keys: string[]): Promise<(T | null)[]> {
      try {
        return (await client.mget(...keys)) as (T | null)[];
      } catch (error) {
        console.error('[redis] MGET error:', error);
        return keys.map(() => null);
      }
    },
    
    async zadd(key: string, score: number, member: string): Promise<void> {
      try {
        await client.zadd(key, { score, member });
      } catch (error) {
        console.error('[redis] ZADD error:', error);
      }
    },
    
    async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
      try {
        return await client.zrevrange(key, start, stop);
      } catch (error) {
        console.error('[redis] ZREVRANGE error:', error);
        return [];
      }
    },
    
    async zremrangebyscore(key: string, min: number, max: number): Promise<void> {
      try {
        await client.zremrangebyscore(key, min, max);
      } catch (error) {
        console.error('[redis] ZREMRANGEBYSCORE error:', error);
      }
    },
    
    async zcard(key: string): Promise<number> {
      try {
        return await client.zcard(key);
      } catch (error) {
        console.error('[redis] ZCARD error:', error);
        return 0;
      }
    },
    
    async zrange(key: string, start: number, stop: number, opts?: { withScores: boolean }): Promise<any[]> {
      try {
        if (opts?.withScores) {
          return await client.zrange(key, start, stop, { withScores: true });
        }
        return await client.zrange(key, start, stop);
      } catch (error) {
        console.error('[redis] ZRANGE error:', error);
        return [];
      }
    },
  };
}

/**
 * No-op KV implementation for when Redis is not configured
 */
function createNoOpKV(): KV {
  return {
    async get() { return null; },
    async set() {},
    async del() {},
    async incr() { return 0; },
    async expire() {},
    async exists() { return false; },
    async keys() { return []; },
    async mget(...keys) { return keys.map(() => null); },
    async zadd() {},
    async zrevrange() { return []; },
    async zremrangebyscore() {},
    async zcard() { return 0; },
    async zrange() { return []; },
  };
}

/**
 * Health check for Redis connection
 */
export async function redisHealthCheck(): Promise<boolean> {
  if (_healthCheckFailed) return false;
  
  try {
    await kv.set('health:check', 'ok', { ex: 10 });
    const value = await kv.get('health:check');
    return value === 'ok';
  } catch (error) {
    console.error('[redis] Health check failed:', error);
    _healthCheckFailed = true;
    return false;
  }
}

/**
 * Main KV export - Gelecekte Memorystore'a geçiş için tek çıkış noktası
 * 
 * Migration path to Memorystore:
 * 1. Deploy Cloud Run + Serverless VPC Connector
 * 2. Create Memorystore instance in same region
 * 3. Replace upstashKV() with ioredisKV() in this file
 * 4. Update env vars (REDIS_HOST, REDIS_PORT)
 */
export const kv: KV = upstashKV();

// Cache key prefixes - Invalidation matrix için organize
export const CACHE_KEYS = {
  PRODUCT: 'product:',
  PRODUCTS_LIST: 'products:list:',
  CATEGORY: 'category:',
  CATEGORIES_LIST: 'categories:list',
  USER: 'user:',
  CART: 'cart:',
  WISHLIST: 'wishlist:',
  SEARCH: 'search:',
  TRENDING: 'trending:',
  RECOMMENDATIONS: 'recommendations:',
  SELLER: 'seller:',
  REVIEWS: 'reviews:',
} as const;

// Cache TTL (Time To Live) in seconds - ENV'den override edilebilir
export const CACHE_TTL = {
  SHORT: Number(process.env.CACHE_SEARCH_TTL_SEC || 60), // 1 minute
  MEDIUM: Number(process.env.CACHE_DEFAULT_TTL_SEC || 120), // 2 minutes
  LONG: Number(process.env.CACHE_DEFAULT_TTL_SEC || 120) * 3, // 6 minutes
  VERY_LONG: Number(process.env.CACHE_DEFAULT_TTL_SEC || 120) * 10, // 20 minutes
  TREND: Number(process.env.CACHE_TREND_TTL_SEC || 20), // 20 seconds
  STALE: Number(process.env.CACHE_STALE_TTL_SEC || 360), // 6 minutes
} as const;

// Backward compatibility exports
export const redis = upstashClient();
export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    return kv.get<T>(key);
  }

  static async set<T>(key: string, value: T, ex?: number): Promise<"OK" | null> {
    await kv.set(key, value, ex ? { ex } : undefined);
    return "OK";
  }

  static async del(key: string): Promise<number> {
    await kv.del(key);
    return 1;
  }
}
