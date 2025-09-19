// Enterprise-grade performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.set('lcp', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.set('fid', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // CLS (Cumulative Layout Shift)
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.set('cls', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  // Memory usage monitoring
  getMemoryUsage(): number {
    if (typeof window === 'undefined') return 0;
    
    const memory = (performance as any).memory;
    if (memory) {
      return Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
    }
    return 0;
  }

  // Component render time measurement
  measureRenderTime(componentName: string, renderFn: () => void): void {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    
    this.metrics.set(`${componentName}_render_time`, end - start);
  }

  // API call performance measurement
  async measureApiCall<T>(
    apiName: string, 
    apiCall: () => Promise<T>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await apiCall();
      const end = performance.now();
      this.metrics.set(`${apiName}_api_time`, end - start);
      return result;
    } catch (error) {
      const end = performance.now();
      this.metrics.set(`${apiName}_api_error_time`, end - start);
      throw error;
    }
  }

  // Get all metrics
  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Get Core Web Vitals
  getCoreWebVitals(): {
    lcp?: number;
    fid?: number;
    cls?: number;
    memory?: number;
  } {
    return {
      lcp: this.metrics.get('lcp'),
      fid: this.metrics.get('fid'),
      cls: this.metrics.get('cls'),
      memory: this.getMemoryUsage()
    };
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    measureRender: (componentName: string, renderFn: () => void) => 
      monitor.measureRenderTime(componentName, renderFn),
    measureApi: <T>(apiName: string, apiCall: () => Promise<T>) => 
      monitor.measureApiCall(apiName, apiCall),
    getMetrics: () => monitor.getMetrics(),
    getCoreWebVitals: () => monitor.getCoreWebVitals(),
    getMemoryUsage: () => monitor.getMemoryUsage()
  };
}
