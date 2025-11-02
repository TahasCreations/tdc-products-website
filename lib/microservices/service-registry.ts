/**
 * Enterprise Microservices Architecture
 * Service discovery, load balancing, circuit breaker
 */

interface Service {
  name: string;
  version: string;
  host: string;
  port: number;
  protocol: 'http' | 'https' | 'grpc';
  health: 'healthy' | 'degraded' | 'unhealthy';
  lastHealthCheck: Date;
  metadata?: Record<string, any>;
}

interface ServiceInstance {
  id: string;
  service: Service;
  load: number;
  responseTime: number;
}

export class ServiceRegistry {
  private services: Map<string, ServiceInstance[]> = new Map();
  private healthCheckInterval: NodeJS.Timeout;

  constructor() {
    // Register core services
    this.registerService({
      name: 'product-service',
      version: '1.0.0',
      host: process.env.PRODUCT_SERVICE_HOST || 'localhost',
      port: 3001,
      protocol: 'http',
      health: 'healthy',
      lastHealthCheck: new Date(),
    });

    this.registerService({
      name: 'order-service',
      version: '1.0.0',
      host: process.env.ORDER_SERVICE_HOST || 'localhost',
      port: 3002,
      protocol: 'http',
      health: 'healthy',
      lastHealthCheck: new Date(),
    });

    this.registerService({
      name: 'payment-service',
      version: '1.0.0',
      host: process.env.PAYMENT_SERVICE_HOST || 'localhost',
      port: 3003,
      protocol: 'http',
      health: 'healthy',
      lastHealthCheck: new Date(),
    });

    this.registerService({
      name: 'notification-service',
      version: '1.0.0',
      host: process.env.NOTIFICATION_SERVICE_HOST || 'localhost',
      port: 3004,
      protocol: 'http',
      health: 'healthy',
      lastHealthCheck: new Date(),
    });

    // Start health checks
    this.healthCheckInterval = setInterval(() => {
      this.runHealthChecks();
    }, 30000); // Every 30 seconds
  }

  /**
   * Register a service
   */
  registerService(service: Service) {
    const instance: ServiceInstance = {
      id: `${service.name}-${Date.now()}`,
      service,
      load: 0,
      responseTime: 0,
    };

    const instances = this.services.get(service.name) || [];
    instances.push(instance);
    this.services.set(service.name, instances);

    console.log(`Service registered: ${service.name}@${service.version}`);
  }

  /**
   * Discover service with load balancing
   */
  async discoverService(serviceName: string): Promise<ServiceInstance | null> {
    const instances = this.services.get(serviceName);
    if (!instances || instances.length === 0) return null;

    // Filter healthy instances
    const healthyInstances = instances.filter(
      i => i.service.health === 'healthy' || i.service.health === 'degraded'
    );

    if (healthyInstances.length === 0) return null;

    // Load balancing strategy: Least connections
    return healthyInstances.sort((a, b) => a.load - b.load)[0];
  }

  /**
   * Health check
   */
  private async runHealthChecks() {
    for (const [serviceName, instances] of this.services) {
      for (const instance of instances) {
        try {
          const healthUrl = `${instance.service.protocol}://${instance.service.host}:${instance.service.port}/health`;
          const startTime = Date.now();
          
          const response = await fetch(healthUrl, {
            signal: AbortSignal.timeout(5000),
          });

          const responseTime = Date.now() - startTime;

          if (response.ok) {
            instance.service.health = responseTime < 1000 ? 'healthy' : 'degraded';
            instance.responseTime = responseTime;
          } else {
            instance.service.health = 'unhealthy';
          }
        } catch (error) {
          instance.service.health = 'unhealthy';
          console.error(`Health check failed for ${serviceName}:`, error);
        }

        instance.service.lastHealthCheck = new Date();
      }
    }
  }

  /**
   * Circuit breaker pattern
   */
  async callServiceWithCircuitBreaker<T>(
    serviceName: string,
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const instance = await this.discoverService(serviceName);
    if (!instance) {
      throw new Error(`Service ${serviceName} not available`);
    }

    const circuitState = await this.getCircuitState(serviceName);

    // Circuit is OPEN - reject immediately
    if (circuitState === 'OPEN') {
      throw new Error(`Circuit breaker OPEN for ${serviceName}`);
    }

    try {
      instance.load++;
      
      const url = `${instance.service.protocol}://${instance.service.host}:${instance.service.port}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000),
      });

      instance.load--;

      if (!response.ok) {
        await this.recordFailure(serviceName);
        throw new Error(`Service ${serviceName} returned ${response.status}`);
      }

      await this.recordSuccess(serviceName);
      return await response.json();
    } catch (error) {
      instance.load--;
      await this.recordFailure(serviceName);
      throw error;
    }
  }

  /**
   * Circuit breaker state management
   */
  private async getCircuitState(serviceName: string): Promise<'CLOSED' | 'OPEN' | 'HALF_OPEN'> {
    // Check failure rate in Redis
    const failures = await this.redis.get(`circuit:${serviceName}:failures`) || 0;
    const threshold = 5;

    if (failures >= threshold) {
      // Check if cooldown period has passed
      const openedAt = await this.redis.get(`circuit:${serviceName}:opened-at`);
      if (openedAt) {
        const cooldown = 60000; // 1 minute
        if (Date.now() - parseInt(openedAt) > cooldown) {
          return 'HALF_OPEN';
        }
        return 'OPEN';
      }
    }

    return 'CLOSED';
  }

  private async recordFailure(serviceName: string) {
    await this.redis.incr(`circuit:${serviceName}:failures`);
    await this.redis.expire(`circuit:${serviceName}:failures`, 60);
  }

  private async recordSuccess(serviceName: string) {
    await this.redis.del(`circuit:${serviceName}:failures`);
  }

  /**
   * Service mesh - Retry logic
   */
  async callWithRetry<T>(
    serviceName: string,
    endpoint: string,
    options: RequestInit = {},
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.callServiceWithCircuitBreaker<T>(
          serviceName,
          endpoint,
          options
        );
      } catch (error) {
        lastError = error as Error;
        console.log(`Retry ${attempt}/${maxRetries} for ${serviceName}${endpoint}`);
        
        // Exponential backoff
        if (attempt < maxRetries) {
          await this.sleep(Math.pow(2, attempt) * 100);
        }
      }
    }

    throw lastError;
  }

  /**
   * API Gateway - Request routing
   */
  async routeRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Route to appropriate microservice
    if (path.startsWith('/api/products')) {
      return await this.proxyToService('product-service', request);
    }

    if (path.startsWith('/api/orders')) {
      return await this.proxyToService('order-service', request);
    }

    if (path.startsWith('/api/payment')) {
      return await this.proxyToService('payment-service', request);
    }

    return new Response('Not Found', { status: 404 });
  }

  private async proxyToService(serviceName: string, request: Request): Promise<Response> {
    const instance = await this.discoverService(serviceName);
    if (!instance) {
      return new Response('Service Unavailable', { status: 503 });
    }

    const url = new URL(request.url);
    const targetUrl = `${instance.service.protocol}://${instance.service.host}:${instance.service.port}${url.pathname}${url.search}`;

    instance.load++;

    try {
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });

      instance.load--;
      return response;
    } catch (error) {
      instance.load--;
      throw error;
    }
  }

  private redis = {
    get: async (key: string) => null,
    incr: async (key: string) => {},
    del: async (key: string) => {},
    expire: async (key: string, seconds: number) => {},
  };

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  destroy() {
    clearInterval(this.healthCheckInterval);
  }
}

export const serviceRegistry = new ServiceRegistry();

/**
 * gRPC Service Definition (for high-performance inter-service communication)
 */
export const grpcServiceDefinition = `
syntax = "proto3";

package tdc.services;

service ProductService {
  rpc GetProduct (ProductRequest) returns (ProductResponse);
  rpc SearchProducts (SearchRequest) returns (SearchResponse);
  rpc UpdateStock (StockUpdateRequest) returns (StockUpdateResponse);
}

message ProductRequest {
  string product_id = 1;
}

message ProductResponse {
  string id = 1;
  string name = 2;
  double price = 3;
  int32 stock = 4;
}

message SearchRequest {
  string query = 1;
  int32 limit = 2;
}

message SearchResponse {
  repeated ProductResponse products = 1;
  int32 total = 2;
}

message StockUpdateRequest {
  string product_id = 1;
  int32 quantity = 2;
}

message StockUpdateResponse {
  bool success = 1;
  int32 new_stock = 2;
}
`;

