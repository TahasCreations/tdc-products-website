// TDC Market - Advanced Caching System
// Performance optimization for global marketplace

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL
    };
    this.cache.set(key, item);
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let active = 0;
    let expired = 0;

    this.cache.forEach((item) => {
      if (now - item.timestamp > item.ttl) {
        expired++;
      } else {
        active++;
      }
    });

    return {
      total: this.cache.size,
      active,
      expired,
      hitRate: this.calculateHitRate()
    };
  }

  private hitCount = 0;
  private missCount = 0;

  private calculateHitRate(): number {
    const total = this.hitCount + this.missCount;
    return total > 0 ? (this.hitCount / total) * 100 : 0;
  }

  // Clean expired items
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

// Global cache instance
export const cache = new CacheManager();

// Cache keys
export const CACHE_KEYS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  USER_PROFILE: 'user_profile',
  SELLER_PROFILE: 'seller_profile',
  PRODUCT_DETAILS: 'product_details',
  SEARCH_RESULTS: 'search_results'
} as const;

// Cache helper functions
export const cacheHelpers = {
  // Products cache
  getProducts: (filters: string) => cache.get(`${CACHE_KEYS.PRODUCTS}_${filters}`),
  setProducts: (filters: string, data: any, ttl?: number) => 
    cache.set(`${CACHE_KEYS.PRODUCTS}_${filters}`, data, ttl),

  // Categories cache
  getCategories: () => cache.get(CACHE_KEYS.CATEGORIES),
  setCategories: (data: any, ttl?: number) => 
    cache.set(CACHE_KEYS.CATEGORIES, data, ttl),

  // Product details cache
  getProductDetails: (productId: string) => 
    cache.get(`${CACHE_KEYS.PRODUCT_DETAILS}_${productId}`),
  setProductDetails: (productId: string, data: any, ttl?: number) => 
    cache.set(`${CACHE_KEYS.PRODUCT_DETAILS}_${productId}`, data, ttl),

  // Search results cache
  getSearchResults: (query: string) => 
    cache.get(`${CACHE_KEYS.SEARCH_RESULTS}_${query}`),
  setSearchResults: (query: string, data: any, ttl?: number) => 
    cache.set(`${CACHE_KEYS.SEARCH_RESULTS}_${query}`, data, ttl),

  // Clear related caches when data changes
  invalidateProducts: () => {
    const keysToDelete: string[] = [];
    cache.cache.forEach((_, key) => {
      if (key.startsWith(CACHE_KEYS.PRODUCTS)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => cache.delete(key));
  },

  invalidateCategories: () => {
    cache.delete(CACHE_KEYS.CATEGORIES);
  },

  invalidateProductDetails: (productId: string) => {
    cache.delete(`${CACHE_KEYS.PRODUCT_DETAILS}_${productId}`);
  }
};

// Auto cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cache.cleanup();
  }, 10 * 60 * 1000);
}

export default cache;
