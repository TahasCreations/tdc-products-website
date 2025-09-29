// TDC Market - Performance Monitoring System
// Real-time performance tracking for global marketplace

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'duration' | 'count' | 'size' | 'rate';
  tags?: Record<string, string>;
}

interface PageLoadMetrics {
  page: string;
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private pageLoadMetrics: PageLoadMetrics[] = [];
  private isEnabled = true;

  // Track custom metrics
  track(name: string, value: number, type: PerformanceMetric['type'] = 'duration', tags?: Record<string, string>) {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      type,
      tags
    };

    this.metrics.push(metric);

    // Keep only last 1000 metrics to prevent memory issues
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance: ${name} = ${value} (${type})`, tags);
    }
  }

  // Track API call performance
  trackApiCall(endpoint: string, duration: number, status: number, method: string = 'GET') {
    this.track('api_call', duration, 'duration', {
      endpoint,
      status: status.toString(),
      method
    });
  }

  // Track page load performance
  trackPageLoad(page: string, metrics: Partial<PageLoadMetrics>) {
    if (!this.isEnabled) return;

    const pageLoadMetric: PageLoadMetrics = {
      page,
      loadTime: metrics.loadTime || 0,
      domContentLoaded: metrics.domContentLoaded || 0,
      firstContentfulPaint: metrics.firstContentfulPaint || 0,
      largestContentfulPaint: metrics.largestContentfulPaint || 0,
      cumulativeLayoutShift: metrics.cumulativeLayoutShift || 0,
      timestamp: Date.now()
    };

    this.pageLoadMetrics.push(pageLoadMetric);

    // Keep only last 100 page loads
    if (this.pageLoadMetrics.length > 100) {
      this.pageLoadMetrics = this.pageLoadMetrics.slice(-100);
    }
  }

  // Track component render time
  trackComponentRender(componentName: string, renderTime: number) {
    this.track('component_render', renderTime, 'duration', {
      component: componentName
    });
  }

  // Track database query performance
  trackDbQuery(query: string, duration: number, rows: number) {
    this.track('db_query', duration, 'duration', {
      query: query.substring(0, 50), // Truncate long queries
      rows: rows.toString()
    });
  }

  // Track cache performance
  trackCacheHit(key: string, hit: boolean) {
    this.track('cache_performance', hit ? 1 : 0, 'count', {
      key: key.substring(0, 20), // Truncate long keys
      type: hit ? 'hit' : 'miss'
    });
  }

  // Get performance summary
  getSummary() {
    const now = Date.now();
    const lastHour = now - (60 * 60 * 1000);

    // Filter metrics from last hour
    const recentMetrics = this.metrics.filter(m => m.timestamp > lastHour);
    const recentPageLoads = this.pageLoadMetrics.filter(p => p.timestamp > lastHour);

    // Calculate averages
    const apiCalls = recentMetrics.filter(m => m.name === 'api_call');
    const avgApiResponse = apiCalls.length > 0 
      ? apiCalls.reduce((sum, m) => sum + m.value, 0) / apiCalls.length 
      : 0;

    const componentRenders = recentMetrics.filter(m => m.name === 'component_render');
    const avgRenderTime = componentRenders.length > 0 
      ? componentRenders.reduce((sum, m) => sum + m.value, 0) / componentRenders.length 
      : 0;

    const avgPageLoadTime = recentPageLoads.length > 0 
      ? recentPageLoads.reduce((sum, p) => sum + p.loadTime, 0) / recentPageLoads.length 
      : 0;

    return {
      period: 'last_hour',
      metrics: {
        totalMetrics: recentMetrics.length,
        avgApiResponseTime: Math.round(avgApiResponse),
        avgComponentRenderTime: Math.round(avgRenderTime),
        avgPageLoadTime: Math.round(avgPageLoadTime),
        totalPageLoads: recentPageLoads.length
      },
      performance: {
        apiCalls: apiCalls.length,
        slowApiCalls: apiCalls.filter(m => m.value > 1000).length, // > 1s
        slowRenders: componentRenders.filter(m => m.value > 16).length, // > 16ms
        slowPageLoads: recentPageLoads.filter(p => p.loadTime > 3000).length // > 3s
      }
    };
  }

  // Get detailed metrics
  getMetrics(filter?: string) {
    if (filter) {
      return this.metrics.filter(m => m.name.includes(filter));
    }
    return this.metrics;
  }

  // Get page load metrics
  getPageLoadMetrics() {
    return this.pageLoadMetrics;
  }

  // Clear all metrics
  clear() {
    this.metrics = [];
    this.pageLoadMetrics = [];
  }

  // Enable/disable tracking
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Export metrics for analysis
  exportMetrics() {
    return {
      metrics: this.metrics,
      pageLoadMetrics: this.pageLoadMetrics,
      summary: this.getSummary(),
      timestamp: Date.now()
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Performance tracking hooks for React components
export const usePerformanceTracking = (componentName: string) => {
  const trackRender = (renderTime: number) => {
    performanceMonitor.trackComponentRender(componentName, renderTime);
  };

  const trackApiCall = (endpoint: string, duration: number, status: number, method?: string) => {
    performanceMonitor.trackApiCall(endpoint, duration, status, method);
  };

  const trackCustomMetric = (name: string, value: number, type?: PerformanceMetric['type'], tags?: Record<string, string>) => {
    performanceMonitor.track(name, value, type, tags);
  };

  return {
    trackRender,
    trackApiCall,
    trackCustomMetric
  };
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Simple performance tracking without web-vitals dependency
  try {
    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      performanceMonitor.track('page_load_time', loadTime, 'duration');
    });

    // Track DOM content loaded
    document.addEventListener('DOMContentLoaded', () => {
      const domTime = performance.now();
      performanceMonitor.track('dom_content_loaded', domTime, 'duration');
    });
  } catch (error) {
    console.warn('Performance tracking error:', error);
  }
};

export default performanceMonitor;
