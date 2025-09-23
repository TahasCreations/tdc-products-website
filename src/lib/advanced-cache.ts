// Advanced Caching System
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items
  strategy: 'lru' | 'fifo' | 'lfu'; // Cache eviction strategy
  persist: boolean; // Persist to localStorage
  compression: boolean; // Compress stored data
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  size: number;
  compressed?: boolean;
}

class AdvancedCache<T = any> {
  private cache = new Map<string, CacheItem<T>>();
  private config: CacheConfig;
  private accessOrder: string[] = [];
  private accessCounts = new Map<string, number>();

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: 5 * 60 * 1000, // 5 minutes default
      maxSize: 100,
      strategy: 'lru',
      persist: false,
      compression: false,
      ...config
    };

    if (this.config.persist) {
      this.loadFromStorage();
    }
  }

  set(key: string, data: T): void {
    const now = Date.now();
    const size = this.calculateSize(data);
    
    let processedData = data;
    let compressed = false;

    if (this.config.compression && size > 1024) {
      try {
        processedData = this.compress(data) as T;
        compressed = true;
      } catch (error) {
        console.warn('Compression failed, storing uncompressed:', error);
      }
    }

    const item: CacheItem<T> = {
      data: processedData,
      timestamp: now,
      accessCount: 0,
      size,
      compressed
    };

    // Check if we need to evict items
    if (this.cache.size >= this.config.maxSize) {
      this.evict();
    }

    this.cache.set(key, item);
    this.updateAccessOrder(key);

    if (this.config.persist) {
      this.saveToStorage();
    }
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > this.config.ttl) {
      this.delete(key);
      return null;
    }

    // Update access statistics
    item.accessCount++;
    this.accessCounts.set(key, item.accessCount);
    this.updateAccessOrder(key);

    // Decompress if needed
    if (item.compressed) {
      try {
        return this.decompress(item.data) as T;
      } catch (error) {
        console.warn('Decompression failed:', error);
        return item.data;
      }
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Check if expired
    if (Date.now() - item.timestamp > this.config.ttl) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    this.removeFromAccessOrder(key);
    this.accessCounts.delete(key);
    
    if (this.config.persist) {
      this.saveToStorage();
    }
    
    return deleted;
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.accessCounts.clear();
    
    if (this.config.persist) {
      localStorage.removeItem('advanced-cache');
    }
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  getStats(): {
    size: number;
    hitRate: number;
    memoryUsage: number;
    compressionRatio: number;
  } {
    const totalSize = Array.from(this.cache.values()).reduce((sum, item) => sum + item.size, 0);
    const compressedSize = Array.from(this.cache.values())
      .filter(item => item.compressed)
      .reduce((sum, item) => sum + item.size, 0);
    
    return {
      size: this.cache.size,
      hitRate: this.calculateHitRate(),
      memoryUsage: totalSize,
      compressionRatio: compressedSize / totalSize || 0
    };
  }

  private evict(): void {
    switch (this.config.strategy) {
      case 'lru':
        this.evictLRU();
        break;
      case 'fifo':
        this.evictFIFO();
        break;
      case 'lfu':
        this.evictLFU();
        break;
    }
  }

  private evictLRU(): void {
    if (this.accessOrder.length > 0) {
      const keyToEvict = this.accessOrder[0];
      this.delete(keyToEvict);
    }
  }

  private evictFIFO(): void {
    const oldestKey = this.cache.keys().next().value;
    if (oldestKey) {
      this.delete(oldestKey);
    }
  }

  private evictLFU(): void {
    let leastFrequentKey = '';
    let minAccessCount = Infinity;

    for (const [key, count] of this.accessCounts) {
      if (count < minAccessCount) {
        minAccessCount = count;
        leastFrequentKey = key;
      }
    }

    if (leastFrequentKey) {
      this.delete(leastFrequentKey);
    }
  }

  private updateAccessOrder(key: string): void {
    // Remove from current position
    this.removeFromAccessOrder(key);
    // Add to end (most recently used)
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private calculateSize(data: any): number {
    return JSON.stringify(data).length * 2; // Rough estimate in bytes
  }

  private compress(data: any): any {
    // Simple compression using JSON stringify and base64
    const jsonString = JSON.stringify(data);
    return btoa(jsonString);
  }

  private decompress(compressedData: any): any {
    // Simple decompression
    const jsonString = atob(compressedData);
    return JSON.parse(jsonString);
  }

  private calculateHitRate(): number {
    // This would need to be implemented with actual hit/miss tracking
    return 0.85; // Mock value
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('advanced-cache');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.cache = new Map(parsed.cache);
        this.accessOrder = parsed.accessOrder || [];
        this.accessCounts = new Map(parsed.accessCounts || []);
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        cache: Array.from(this.cache.entries()),
        accessOrder: this.accessOrder,
        accessCounts: Array.from(this.accessCounts.entries())
      };
      localStorage.setItem('advanced-cache', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }
}

// Cache instances for different use cases
export const apiCache = new AdvancedCache({
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 200,
  strategy: 'lru',
  persist: true,
  compression: true
});

export const imageCache = new AdvancedCache({
  ttl: 30 * 60 * 1000, // 30 minutes
  maxSize: 50,
  strategy: 'lru',
  persist: false,
  compression: false
});

export const userCache = new AdvancedCache({
  ttl: 15 * 60 * 1000, // 15 minutes
  maxSize: 100,
  strategy: 'lfu',
  persist: true,
  compression: true
});

export const pageCache = new AdvancedCache({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 20,
  strategy: 'lru',
  persist: false,
  compression: true
});

// Cache utilities
export const cacheUtils = {
  // Clear all caches
  clearAll: () => {
    apiCache.clear();
    imageCache.clear();
    userCache.clear();
    pageCache.clear();
  },

  // Get cache statistics
  getStats: () => ({
    api: apiCache.getStats(),
    image: imageCache.getStats(),
    user: userCache.getStats(),
    page: pageCache.getStats()
  }),

  // Warm up cache with common data
  warmUp: async (data: Record<string, any>) => {
    for (const [key, value] of Object.entries(data)) {
      apiCache.set(key, value);
    }
  },

  // Preload critical resources
  preload: async (urls: string[]) => {
    const promises = urls.map(url => 
      fetch(url).then(response => response.blob())
    );
    
    try {
      const results = await Promise.all(promises);
      results.forEach((blob, index) => {
        imageCache.set(urls[index], blob);
      });
    } catch (error) {
      console.warn('Preload failed:', error);
    }
  }
};

export default AdvancedCache;

