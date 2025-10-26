/**
 * API Response Caching Utility
 * Provides in-memory caching for API responses
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  etag: string;
}

class APICache {
  private cache: Map<string, CacheEntry>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) {
    // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Generate cache key from request
   */
  private generateKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}:${paramString}`;
  }

  /**
   * Generate ETag for response
   */
  private generateETag(data: any): string {
    return Buffer.from(JSON.stringify(data)).toString('base64').substring(0, 32);
  }

  /**
   * Get cached data
   */
  get(url: string, params?: Record<string, any>): CacheEntry | null {
    const key = this.generateKey(url, params);
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if cache is still valid
    if (Date.now() - entry.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }

    return entry;
  }

  /**
   * Set cache data
   */
  set(url: string, data: any, params?: Record<string, any>, ttl?: number): void {
    const key = this.generateKey(url, params);
    const etag = this.generateETag(data);

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      etag,
    });

    // Auto-cleanup after TTL
    setTimeout(() => {
      this.cache.delete(key);
    }, ttl || this.defaultTTL);
  }

  /**
   * Invalidate cache by URL pattern
   */
  invalidate(urlPattern: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach((key) => {
      if (key.startsWith(urlPattern)) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache stats
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const apiCache = new APICache();

/**
 * Cache middleware for API routes
 */
export function withCache(
  handler: (req: Request) => Promise<Response>,
  options: { ttl?: number; key?: string } = {}
) {
  return async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    const cacheKey = options.key || url.pathname;

    // Only cache GET requests
    if (req.method !== 'GET') {
      return handler(req);
    }

    // Check cache
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
          'ETag': cached.etag,
          'X-Cache': 'HIT',
        },
      });
    }

    // Execute handler
    const response = await handler(req);
    const data = await response.json();

    // Cache successful responses
    if (response.ok) {
      apiCache.set(cacheKey, data, undefined, options.ttl);
    }

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
        'X-Cache': 'MISS',
      },
    });
  };
}

/**
 * Revalidate cache on mutation
 */
export function revalidateCache(patterns: string[]): void {
  patterns.forEach((pattern) => {
    apiCache.invalidate(pattern);
  });
}
