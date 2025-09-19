// Enterprise-grade caching system
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
  lastAccessed: number;
}

export class AdvancedCache {
  private static instance: AdvancedCache;
  private cache = new Map<string, CacheItem<any>>();
  private maxSize = 1000;
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.startCleanupInterval();
  }

  static getInstance(): AdvancedCache {
    if (!AdvancedCache.instance) {
      AdvancedCache.instance = new AdvancedCache();
    }
    return AdvancedCache.instance;
  }

  // Set cache item
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      ttl: ttl || this.defaultTTL,
      hits: 0,
      lastAccessed: now
    };

    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, item);
  }

  // Get cache item
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    
    // Check if expired
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access info
    item.hits++;
    item.lastAccessed = now;
    
    return item.data;
  }

  // Get or set pattern
  async getOrSet<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    this.set(key, data, ttl);
    return data;
  }

  // Invalidate cache
  invalidate(key: string): boolean {
    return this.cache.delete(key);
  }

  // Invalidate by pattern
  invalidatePattern(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern);
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    return count;
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache stats
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    totalHits: number;
    oldestItem: number;
    newestItem: number;
  } {
    const items = Array.from(this.cache.values());
    const totalHits = items.reduce((sum, item) => sum + item.hits, 0);
    const hitRate = totalHits > 0 ? totalHits / (totalHits + this.cache.size) : 0;
    
    const timestamps = items.map(item => item.timestamp);
    const oldestItem = timestamps.length > 0 ? Math.min(...timestamps) : 0;
    const newestItem = timestamps.length > 0 ? Math.max(...timestamps) : 0;

    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate,
      totalHits,
      oldestItem,
      newestItem
    };
  }

  // Evict oldest items
  private evictOldest(): void {
    const items = Array.from(this.cache.entries());
    items.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    // Remove 10% of oldest items
    const toRemove = Math.ceil(this.maxSize * 0.1);
    for (let i = 0; i < toRemove && i < items.length; i++) {
      this.cache.delete(items[i][0]);
    }
  }

  // Cleanup expired items
  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now - item.timestamp > item.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Cleanup every minute
  }
}

// React hook for caching
export function useAdvancedCache() {
  const cache = AdvancedCache.getInstance();
  
  return {
    get: <T>(key: string) => cache.get<T>(key),
    set: <T>(key: string, data: T, ttl?: number) => cache.set(key, data, ttl),
    getOrSet: <T>(key: string, fetcher: () => Promise<T>, ttl?: number) => 
      cache.getOrSet(key, fetcher, ttl),
    invalidate: (key: string) => cache.invalidate(key),
    invalidatePattern: (pattern: string) => cache.invalidatePattern(pattern),
    clear: () => cache.clear(),
    getStats: () => cache.getStats()
  };
}
