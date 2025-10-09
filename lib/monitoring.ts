/**
 * Monitoring & Observability Layer
 * 
 * Features:
 * - RED metrics (Requests, Errors, Duration)
 * - Performance timing wrapper
 * - Health check registry
 * - OTEL-ready (OpenTelemetry export preparation)
 * - Structured logging
 * 
 * @module lib/monitoring
 */

/**
 * Metric data structure
 */
interface Metric {
  name: string;
  ok: boolean;
  dur: number;
  timestamp: string;
  err?: string;
  metadata?: Record<string, any>;
}

/**
 * Health check result
 */
interface HealthCheckResult {
  status: 'ok' | 'error' | 'degraded';
  message?: string;
  timestamp: string;
  duration?: number;
  metadata?: Record<string, any>;
}

type HealthCheckFunction = () => Promise<HealthCheckResult>;

/**
 * Health check registry
 */
const healthChecks: Record<string, HealthCheckFunction> = {};

/**
 * Health Check Manager
 */
export class HealthCheck {
  /**
   * Register a health check
   * 
   * @example
   * ```ts
   * HealthCheck.register('database', async () => {
   *   try {
   *     await prisma.$queryRaw`SELECT 1`;
   *     return { status: 'ok', timestamp: new Date().toISOString() };
   *   } catch (error) {
   *     return { 
   *       status: 'error', 
   *       message: error.message,
   *       timestamp: new Date().toISOString() 
   *     };
   *   }
   * });
   * ```
   */
  static register(name: string, checkFn: HealthCheckFunction): void {
    healthChecks[name] = checkFn;
  }

  /**
   * Run all registered health checks
   * 
   * @returns Object with all health check results
   */
  static async runAll(): Promise<Record<string, HealthCheckResult>> {
    const results: Record<string, HealthCheckResult> = {};
    
    const checks = Object.entries(healthChecks);
    await Promise.all(
      checks.map(async ([name, checkFn]) => {
        const start = performance.now();
        try {
          const result = await checkFn();
          results[name] = {
            ...result,
            duration: performance.now() - start,
          };
        } catch (error: any) {
          results[name] = {
            status: 'error',
            message: error?.message || 'Unknown error',
            timestamp: new Date().toISOString(),
            duration: performance.now() - start,
          };
        }
      })
    );

    return results;
  }

  /**
   * Run a single health check
   */
  static async run(name: string): Promise<HealthCheckResult | null> {
    const checkFn = healthChecks[name];
    if (!checkFn) return null;

    const start = performance.now();
    try {
      const result = await checkFn();
      return {
        ...result,
        duration: performance.now() - start,
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error?.message || 'Unknown error',
        timestamp: new Date().toISOString(),
        duration: performance.now() - start,
      };
    }
  }

  /**
   * Get overall health status
   */
  static async getStatus(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    checks: Record<string, HealthCheckResult>;
    timestamp: string;
  }> {
    const checks = await this.runAll();
    const statuses = Object.values(checks).map((c) => c.status);

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (statuses.some((s) => s === 'error')) {
      overallStatus = 'unhealthy';
    } else if (statuses.some((s) => s === 'degraded')) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      checks,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Performance metric wrapper
 * Wraps async functions and tracks execution time
 * 
 * @example
 * ```ts
 * const products = await withMetric('db.products.list', async () => {
 *   return await prisma.product.findMany({ take: 24 });
 * });
 * ```
 */
export async function withMetric<T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const start = performance.now();
  const timestamp = new Date().toISOString();

  try {
    const result = await fn();
    const dur = performance.now() - start;

    logMetric({
      name,
      ok: true,
      dur,
      timestamp,
      metadata,
    });

    // Log slow operations
    if (dur > 1000) {
      console.warn(`[metric] SLOW: ${name} took ${dur.toFixed(2)}ms`);
    }

    return result;
  } catch (error: any) {
    const dur = performance.now() - start;

    logMetric({
      name,
      ok: false,
      dur,
      timestamp,
      err: error?.message || String(error),
      metadata,
    });

    throw error;
  }
}

/**
 * Log metric data
 * In production, this should export to OTEL collector or monitoring service
 */
function logMetric(metric: Metric): void {
  // Structured JSON logging
  const logData = {
    type: 'metric',
    ...metric,
  };

  if (metric.ok) {
    // Success metrics at debug level
    if (process.env.NODE_ENV === 'development') {
      console.log('[metric]', JSON.stringify(logData));
    }
  } else {
    // Error metrics always logged
    console.error('[metric]', JSON.stringify(logData));
  }

  // TODO: Export to OTEL collector
  // if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
  //   exportToOTEL(logData);
  // }
}

/**
 * Monitoring utilities
 */
export const monitoring = {
  /**
   * Log an event
   * 
   * @example
   * ```ts
   * monitoring.logEvent('user.signup', { userId: '123', method: 'email' });
   * ```
   */
  logEvent(eventName: string, data: Record<string, any> = {}): void {
    const logData = {
      type: 'event',
      event: eventName,
      timestamp: new Date().toISOString(),
      ...data,
    };

    console.log('[event]', JSON.stringify(logData));

    // TODO: Send to analytics service (Google Analytics, Mixpanel, etc.)
  },

  /**
   * Log an error
   * 
   * @example
   * ```ts
   * monitoring.logError(error, { userId: '123', action: 'checkout' });
   * ```
   */
  logError(error: Error, context: Record<string, any> = {}): void {
    const logData = {
      type: 'error',
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
      timestamp: new Date().toISOString(),
      ...context,
    };

    console.error('[error]', JSON.stringify(logData));

    // TODO: Send to error tracking service (Sentry, Google Cloud Error Reporting)
  },

  /**
   * Log a warning
   */
  logWarning(message: string, context: Record<string, any> = {}): void {
    const logData = {
      type: 'warning',
      message,
      timestamp: new Date().toISOString(),
      ...context,
    };

    console.warn('[warning]', JSON.stringify(logData));
  },

  /**
   * Track a metric value
   * For counters, gauges, histograms
   * 
   * @example
   * ```ts
   * monitoring.trackMetric('cart.items', 5, { userId: '123' });
   * monitoring.trackMetric('api.latency', 123.45, { endpoint: '/api/products' });
   * ```
   */
  trackMetric(
    name: string,
    value: number,
    labels: Record<string, any> = {}
  ): void {
    const logData = {
      type: 'metric',
      metric: name,
      value,
      timestamp: new Date().toISOString(),
      ...labels,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[metric]', JSON.stringify(logData));
    }

    // TODO: Send to metrics service (Prometheus, Datadog, Google Cloud Monitoring)
  },

  /**
   * Start a timer for manual timing
   * 
   * @example
   * ```ts
   * const timer = monitoring.startTimer();
   * // ... do work
   * const duration = timer.end();
   * console.log(`Operation took ${duration}ms`);
   * ```
   */
  startTimer(): { end: () => number } {
    const start = performance.now();
    return {
      end: () => performance.now() - start,
    };
  },
};

/**
 * Request logger middleware helper
 * Logs incoming requests with timing
 * 
 * @example
 * ```ts
 * export async function GET(req: Request) {
 *   const logger = createRequestLogger(req);
 *   
 *   try {
 *     const data = await fetchData();
 *     logger.success({ itemCount: data.length });
 *     return Response.json(data);
 *   } catch (error) {
 *     logger.error(error);
 *     return Response.json({ error: 'Internal error' }, { status: 500 });
 *   }
 * }
 * ```
 */
export function createRequestLogger(req: Request) {
  const start = performance.now();
  const url = new URL(req.url);
  const method = req.method;
  const path = url.pathname;

  return {
    success(metadata: Record<string, any> = {}) {
      const duration = performance.now() - start;
      monitoring.logEvent('request.success', {
        method,
        path,
        duration,
        ...metadata,
      });
    },
    error(error: Error | any, metadata: Record<string, any> = {}) {
      const duration = performance.now() - start;
      monitoring.logError(error, {
        method,
        path,
        duration,
        ...metadata,
      });
    },
  };
}

/**
 * Initialize default health checks
 */
export function initializeHealthChecks(): void {
  // Redis health check
  HealthCheck.register('redis', async () => {
    try {
      const { redisHealthCheck } = await import('./redis');
      const isHealthy = await redisHealthCheck();
      return {
        status: isHealthy ? 'ok' : 'error',
        message: isHealthy ? 'Redis is healthy' : 'Redis connection failed',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error?.message || 'Redis check failed',
        timestamp: new Date().toISOString(),
      };
    }
  });

  // Database health check
  HealthCheck.register('database', async () => {
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.$queryRaw`SELECT 1`;
      await prisma.$disconnect();
      return {
        status: 'ok',
        message: 'Database is healthy',
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: error?.message || 'Database check failed',
        timestamp: new Date().toISOString(),
      };
    }
  });

  // System health check
  HealthCheck.register('system', async () => {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();

    return {
      status: 'ok',
      message: 'System is healthy',
      timestamp: new Date().toISOString(),
      metadata: {
        memoryUsageMB: Math.round(memUsage.heapUsed / 1024 / 1024),
        uptimeSec: Math.round(uptime),
      },
    };
  });
}
