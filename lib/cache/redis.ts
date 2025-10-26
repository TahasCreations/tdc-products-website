// Upstash Redis - will be configured when credentials are available
// import { Redis } from '@upstash/redis';

// Redis Client (Upstash)
// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL!,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN!,
// });

// Mock Redis implementation for development
const redis = {
  get: async () => null,
  set: async () => null,
  setex: async () => null,
  del: async () => null,
  sadd: async () => null,
  smembers: async () => [],
  flushdb: async () => null,
  exists: async () => 0,
  incrby: async () => 0,
  setnx: async () => false,
  expire: async () => null,
};

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

export class CacheService {
  /**
   * Get cached value
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      return value as T | null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  /**
   * Set cached value
   */
  static async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    try {
      if (options?.ttl) {
        await redis.setex(key, options.ttl, JSON.stringify(value));
      } else {
        await redis.set(key, JSON.stringify(value));
      }

      // Store tags
      if (options?.tags && options.tags.length > 0) {
        await Promise.all(
          options.tags.map(tag => redis.sadd(`tag:${tag}`, key))
        );
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete cached value
   */
  static async delete(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  /**
   * Invalidate cache by tags
   */
  static async invalidateTags(tags: string[]): Promise<void> {
    try {
      for (const tag of tags) {
        const keys = await redis.smembers(`tag:${tag}`);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
        await redis.del(`tag:${tag}`);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  /**
   * Clear all cache
   */
  static async clear(): Promise<void> {
    try {
      await redis.flushdb();
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  /**
   * Check if key exists
   */
  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  /**
   * Increment value
   */
  static async increment(key: string, by: number = 1): Promise<number> {
    try {
      return await redis.incrby(key, by);
    } catch (error) {
      console.error('Cache increment error:', error);
      return 0;
    }
  }

  /**
   * Set with NX (only if not exists)
   */
  static async setnx(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      const result = await redis.setnx(key, JSON.stringify(value));
      if (result && ttl) {
        await redis.expire(key, ttl);
      }
      return result === 1;
    } catch (error) {
      console.error('Cache setnx error:', error);
      return false;
    }
  }
}

// Cache key generators
export const CacheKeys = {
  // Products
  product: (id: string) => `product:${id}`,
  products: (filters?: string) => `products:${filters || 'all'}`,
  productCount: () => 'products:count',
  
  // Categories
  category: (id: string) => `category:${id}`,
  categories: () => 'categories:all',
  
  // Orders
  order: (id: string) => `order:${id}`,
  orders: (filters?: string) => `orders:${filters || 'all'}`,
  
  // Users
  user: (id: string) => `user:${id}`,
  userSession: (sessionId: string) => `session:${sessionId}`,
  
  // Analytics
  analytics: (type: string, date: string) => `analytics:${type}:${date}`,
  
  // General
  dashboard: () => 'dashboard:data',
  search: (query: string) => `search:${query}`,
};

export default CacheService;

