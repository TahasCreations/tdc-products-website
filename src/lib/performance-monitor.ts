/**
 * Performance Monitoring System
 * Tracks and optimizes database queries, API responses, and page load times
 */

interface PerformanceMetric {
  id: string;
  type: 'database' | 'api' | 'page' | 'component';
  name: string;
  duration: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface PerformanceStats {
  averageResponseTime: number;
  slowestQueries: PerformanceMetric[];
  errorRate: number;
  totalRequests: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 1000; // Keep last 1000 metrics

  /**
   * Start timing a performance metric
   */
  startTiming(type: PerformanceMetric['type'], name: string, metadata?: Record<string, any>) {
    const id = `${type}-${name}-${Date.now()}`;
    const startTime = performance.now();
    
    return {
      end: () => {
        const duration = performance.now() - startTime;
        this.recordMetric({
          id,
          type,
          name,
          duration,
          timestamp: new Date(),
          metadata
        });
        return duration;
      }
    };
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only the latest metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow operations
    if (metric.duration > 1000) { // > 1 second
      console.warn(`Slow ${metric.type} operation: ${metric.name} took ${metric.duration.toFixed(2)}ms`, metric.metadata);
    }
  }

  /**
   * Get performance statistics
   */
  getStats(): PerformanceStats {
    const recentMetrics = this.metrics.filter(
      m => Date.now() - m.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    const totalDuration = recentMetrics.reduce((sum, m) => sum + m.duration, 0);
    const averageResponseTime = recentMetrics.length > 0 ? totalDuration / recentMetrics.length : 0;

    const slowestQueries = [...recentMetrics]
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    const errorCount = recentMetrics.filter(m => m.metadata?.error).length;
    const errorRate = recentMetrics.length > 0 ? (errorCount / recentMetrics.length) * 100 : 0;

    return {
      averageResponseTime,
      slowestQueries,
      errorRate,
      totalRequests: recentMetrics.length
    };
  }

  /**
   * Database query performance wrapper
   */
  async wrapDatabaseQuery<T>(
    queryName: string,
    query: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const timer = this.startTiming('database', queryName, metadata);
    
    try {
      const result = await query();
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      this.recordMetric({
        id: `db-error-${Date.now()}`,
        type: 'database',
        name: queryName,
        duration: 0,
        timestamp: new Date(),
        metadata: { ...metadata, error: error instanceof Error ? error.message : 'Unknown error' }
      });
      throw error;
    }
  }

  /**
   * API route performance wrapper
   */
  async wrapApiRoute<T>(
    routeName: string,
    handler: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const timer = this.startTiming('api', routeName, metadata);
    
    try {
      const result = await handler();
      timer.end();
      return result;
    } catch (error) {
      timer.end();
      this.recordMetric({
        id: `api-error-${Date.now()}`,
        type: 'api',
        name: routeName,
        duration: 0,
        timestamp: new Date(),
        metadata: { ...metadata, error: error instanceof Error ? error.message : 'Unknown error' }
      });
      throw error;
    }
  }

  /**
   * Clear old metrics
   */
  clearOldMetrics() {
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
  }

  /**
   * Get metrics for specific type
   */
  getMetricsByType(type: PerformanceMetric['type'], limit = 50): PerformanceMetric[] {
    return this.metrics
      .filter(m => m.type === type)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get slow operations
   */
  getSlowOperations(threshold = 500): PerformanceMetric[] {
    return this.metrics
      .filter(m => m.duration > threshold)
      .sort((a, b) => b.duration - a.duration);
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const measureAsync = async <T>(
  name: string,
  fn: () => Promise<T>,
  type: PerformanceMetric['type'] = 'api'
): Promise<T> => {
  return performanceMonitor.wrapApiRoute(name, fn);
};

export const measureDatabase = async <T>(
  queryName: string,
  query: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> => {
  return performanceMonitor.wrapDatabaseQuery(queryName, query, metadata);
};

// Auto-cleanup old metrics every hour
if (typeof window === 'undefined') {
  setInterval(() => {
    performanceMonitor.clearOldMetrics();
  }, 60 * 60 * 1000); // 1 hour
}
