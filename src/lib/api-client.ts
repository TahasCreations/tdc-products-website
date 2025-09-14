// Advanced API client with caching, retry logic, and performance optimization

import { productCache, apiCache, cacheUtils } from './cache';

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  cached?: boolean;
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  cache?: boolean;
  cacheTTL?: number;
  retries?: number;
  timeout?: number;
  signal?: AbortSignal;
}

interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private retryConfig: RetryConfig;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffFactor: 2
    };
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private calculateRetryDelay(attempt: number): number {
    const delay = this.retryConfig.baseDelay * Math.pow(this.retryConfig.backoffFactor, attempt);
    return Math.min(delay, this.retryConfig.maxDelay);
  }

  private async retryRequest<T>(
    requestFn: () => Promise<Response>,
    attempt: number = 0
  ): Promise<Response> {
    try {
      const response = await requestFn();
      
      // Don't retry on client errors (4xx) except 408, 429
      if (response.status >= 400 && response.status < 500 && 
          response.status !== 408 && response.status !== 429) {
        return response;
      }

      // Retry on server errors (5xx) or specific client errors
      if (response.status >= 500 || response.status === 408 || response.status === 429) {
        if (attempt < this.retryConfig.maxRetries) {
          const delay = this.calculateRetryDelay(attempt);
          await this.delay(delay);
          return this.retryRequest(requestFn, attempt + 1);
        }
      }

      return response;
    } catch (error) {
      if (attempt < this.retryConfig.maxRetries) {
        const delay = this.calculateRetryDelay(attempt);
        await this.delay(delay);
        return this.retryRequest(requestFn, attempt + 1);
      }
      throw error;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      cache = true,
      cacheTTL,
      retries = 3,
      timeout = 30000,
      signal
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = cacheUtils.generateKey(endpoint, { method, body: JSON.stringify(body) });

    // Check cache for GET requests
    if (method === 'GET' && cache) {
      const cached = apiCache.get(cacheKey);
      if (cached) {
        return {
          data: cached,
          status: 200,
          headers: new Headers(),
          cached: true
        };
      }
    }

    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers
    };

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: signal || AbortSignal.timeout(timeout)
    };

    if (body && method !== 'GET') {
      requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const requestFn = () => fetch(url, requestOptions);

    try {
      const response = await this.retryRequest(requestFn);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Cache successful GET responses
      if (method === 'GET' && cache && response.status === 200) {
        apiCache.set(cacheKey, data, cacheTTL);
      }

      return {
        data,
        status: response.status,
        headers: response.headers,
        cached: false
      };
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, options: Omit<ApiOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, options: Omit<ApiOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: any, options: Omit<ApiOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: any, options: Omit<ApiOptions, 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, options: Omit<ApiOptions, 'method'> = {}): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Batch requests
  async batch<T>(requests: Array<{ endpoint: string; options?: ApiOptions }>): Promise<ApiResponse<T>[]> {
    const promises = requests.map(({ endpoint, options }) => 
      this.makeRequest<T>(endpoint, options)
    );

    return Promise.allSettled(promises).then(results =>
      results.map(result => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          throw result.reason;
        }
      })
    );
  }

  // Prefetch data
  async prefetch<T>(endpoints: string[]): Promise<void> {
    const promises = endpoints.map(endpoint => 
      this.get<T>(endpoint, { cache: true, cacheTTL: 5 * 60 * 1000 })
    );

    await Promise.allSettled(promises);
  }

  // Clear cache
  clearCache(pattern?: string): void {
    if (pattern) {
      const keys = apiCache.keys().filter(key => key.includes(pattern));
      keys.forEach(key => apiCache.delete(key));
    } else {
      apiCache.clear();
    }
  }

  // Get cache stats
  getCacheStats() {
    return apiCache.stats();
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Specialized API methods
export const api = {
  // Products
  products: {
    async getAll(params?: { page?: number; limit?: number; category?: string; search?: string }) {
      const endpoint = '/products';
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.category) queryParams.set('category', params.category);
      if (params?.search) queryParams.set('search', params.search);

      const url = queryParams.toString() ? `${endpoint}?${queryParams}` : endpoint;
      return apiClient.get(url, { cache: true, cacheTTL: 10 * 60 * 1000 });
    },

    async getById(id: string) {
      return apiClient.get(`/products/${id}`, { cache: true, cacheTTL: 15 * 60 * 1000 });
    },

    async create(data: any) {
      const response = await apiClient.post('/products', data);
      // Clear related cache
      apiClient.clearCache('products');
      return response;
    },

    async update(id: string, data: any) {
      const response = await apiClient.put(`/products/${id}`, data);
      // Clear related cache
      apiClient.clearCache('products');
      return response;
    },

    async delete(id: string) {
      const response = await apiClient.delete(`/products/${id}`);
      // Clear related cache
      apiClient.clearCache('products');
      return response;
    }
  },

  // Users
  users: {
    async getAll(params?: { page?: number; limit?: number }) {
      const endpoint = '/users';
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());

      const url = queryParams.toString() ? `${endpoint}?${queryParams}` : endpoint;
      return apiClient.get(url, { cache: true, cacheTTL: 5 * 60 * 1000 });
    },

    async getById(id: string) {
      return apiClient.get(`/users/${id}`, { cache: true, cacheTTL: 10 * 60 * 1000 });
    }
  },

  // Orders
  orders: {
    async getAll(params?: { page?: number; limit?: number; status?: string }) {
      const endpoint = '/orders';
      const queryParams = new URLSearchParams();
      
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.limit) queryParams.set('limit', params.limit.toString());
      if (params?.status) queryParams.set('status', params.status);

      const url = queryParams.toString() ? `${endpoint}?${queryParams}` : endpoint;
      return apiClient.get(url, { cache: true, cacheTTL: 2 * 60 * 1000 });
    },

    async getById(id: string) {
      return apiClient.get(`/orders/${id}`, { cache: true, cacheTTL: 5 * 60 * 1000 });
    },

    async updateStatus(id: string, status: string) {
      const response = await apiClient.patch(`/orders/${id}`, { status });
      // Clear related cache
      apiClient.clearCache('orders');
      return response;
    }
  },

  // Analytics
  analytics: {
    async getDashboard() {
      return apiClient.get('/analytics/dashboard', { cache: true, cacheTTL: 5 * 60 * 1000 });
    },

    async getSales(params?: { period?: string; startDate?: string; endDate?: string }) {
      const endpoint = '/analytics/sales';
      const queryParams = new URLSearchParams();
      
      if (params?.period) queryParams.set('period', params.period);
      if (params?.startDate) queryParams.set('startDate', params.startDate);
      if (params?.endDate) queryParams.set('endDate', params.endDate);

      const url = queryParams.toString() ? `${endpoint}?${queryParams}` : endpoint;
      return apiClient.get(url, { cache: true, cacheTTL: 10 * 60 * 1000 });
    }
  }
};

export default apiClient;
