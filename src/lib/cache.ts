// Advanced caching system for performance optimization

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  hits: number;
  lastAccessed: number;
}

interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds
  maxSize?: number; // Maximum number of items in cache
  maxAge?: number; // Maximum age in milliseconds
}

class AdvancedCache<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private options: Required<CacheOptions>;
  private accessOrder: string[] = [];

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutes default
      maxSize: options.maxSize || 100,
      maxAge: options.maxAge || 30 * 60 * 1000 // 30 minutes default
    };
  }

  set(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const itemTTL = ttl || this.options.ttl;

    // Remove oldest items if cache is full
    if (this.cache.size >= this.options.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      ttl: itemTTL,
      hits: 0,
      lastAccessed: now
    });

    // Update access order
    this.updateAccessOrder(key);
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();

    // Check if item has expired
    if (now - item.timestamp > item.ttl || now - item.timestamp > this.options.maxAge) {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      return null;
    }

    // Update access statistics
    item.hits++;
    item.lastAccessed = now;
    this.updateAccessOrder(key);

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.removeFromAccessOrder(key);
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  stats(): {
    size: number;
    hits: number;
    missRate: number;
    averageAge: number;
  } {
    const now = Date.now();
    let totalHits = 0;
    let totalAge = 0;

    this.cache.forEach((item) => {
      totalHits += item.hits;
      totalAge += now - item.timestamp;
    });

    return {
      size: this.cache.size,
      hits: totalHits,
      missRate: totalHits === 0 ? 0 : 1 - (totalHits / (totalHits + this.cache.size)),
      averageAge: this.cache.size === 0 ? 0 : totalAge / this.cache.size
    };
  }

  private updateAccessOrder(key: string): void {
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private evictOldest(): void {
    if (this.accessOrder.length > 0) {
      const oldestKey = this.accessOrder[0];
      this.cache.delete(oldestKey);
      this.accessOrder.shift();
    }
  }

  // Cleanup expired items
  cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl || now - item.timestamp > this.options.maxAge) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => {
      this.cache.delete(key);
      this.removeFromAccessOrder(key);
    });
  }
}

// Global cache instances
export const productCache = new AdvancedCache({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 200
});

export const userCache = new AdvancedCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100
});

export const apiCache = new AdvancedCache({
  ttl: 2 * 60 * 1000, // 2 minutes
  maxSize: 50
});

// Cache utilities
export const cacheUtils = {
  // Generate cache key from parameters
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  },

  // Cache with automatic key generation
  async cacheWithKey<T>(
    cache: AdvancedCache<T>,
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    try {
      const data = await fetcher();
      cache.set(key, data, ttl);
      return data;
    } catch (error) {
      console.error('Cache fetch error:', error);
      throw error;
    }
  },

  // Batch cache operations
  async batchGet<T>(cache: AdvancedCache<T>, keys: string[]): Promise<Map<string, T | null>> {
    const results = new Map<string, T | null>();
    
    for (const key of keys) {
      results.set(key, cache.get(key));
    }
    
    return results;
  },

  async batchSet<T>(cache: AdvancedCache<T>, items: Map<string, T>, ttl?: number): Promise<void> {
    items.forEach((data, key) => {
      cache.set(key, data, ttl);
    });
  },

  // Cache warming
  async warmCache<T>(
    cache: AdvancedCache<T>,
    keys: string[],
    fetcher: (key: string) => Promise<T>,
    ttl?: number
  ): Promise<void> {
    const promises = keys.map(async (key) => {
      if (!cache.has(key)) {
        try {
          const data = await fetcher(key);
          cache.set(key, data, ttl);
        } catch (error) {
          console.error(`Cache warming failed for key ${key}:`, error);
        }
      }
    });

    await Promise.allSettled(promises);
  }
};

// Memory usage monitoring
export const memoryMonitor = {
  getMemoryUsage(): {
    used: number;
    total: number;
    percentage: number;
  } {
    if (typeof window === 'undefined') {
      return { used: 0, total: 0, percentage: 0 };
    }

    const memory = (performance as any).memory;
    if (!memory) {
      return { used: 0, total: 0, percentage: 0 };
    }

    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100
    };
  },

  isMemoryPressure(): boolean {
    const usage = this.getMemoryUsage();
    return usage.percentage > 80; // 80% memory usage threshold
  }
};

// Auto cleanup interval
if (typeof window !== 'undefined') {
  setInterval(() => {
    // Cleanup expired items every 5 minutes
    productCache.cleanup();
    userCache.cleanup();
    apiCache.cleanup();

    // Check memory pressure
    if (memoryMonitor.isMemoryPressure()) {
      console.warn('High memory usage detected, clearing caches');
      productCache.clear();
      userCache.clear();
      apiCache.clear();
    }
  }, 5 * 60 * 1000);
}

export default AdvancedCache;
