// Performance analytics and monitoring for TDC Market

import React, { useEffect, useRef } from 'react';

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
  userAgent?: string;
  connection?: string;
}

export interface CoreWebVitals {
  CLS: number; // Cumulative Layout Shift
  FID: number; // First Input Delay
  FCP: number; // First Contentful Paint
  LCP: number; // Largest Contentful Paint
  TTFB: number; // Time to First Byte
}

export interface PageLoadMetrics {
  domContentLoaded: number;
  windowLoad: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

class PerformanceAnalytics {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    this.isInitialized = true;
    this.setupObservers();
    this.trackPageLoad();
    this.trackNavigationTiming();
    this.trackResourceTiming();
  }

  private setupObservers() {
    // Core Web Vitals observer
    if ('PerformanceObserver' in window) {
      try {
        const vitalsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.recordMetric({
              name: entry.name,
              value: (entry as any).value || 0,
              timestamp: Date.now(),
              url: window.location.href,
              userAgent: navigator.userAgent,
              connection: this.getConnectionInfo()
            });
          });
        });

        vitalsObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        this.observers.push(vitalsObserver);
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }
  }

  private trackPageLoad() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.recordMetric({
          name: 'page_load_time',
          value: navigation.loadEventEnd - navigation.fetchStart,
          timestamp: Date.now(),
          url: window.location.href,
          connection: this.getConnectionInfo()
        });

        this.recordMetric({
          name: 'dom_content_loaded',
          value: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          timestamp: Date.now(),
          url: window.location.href
        });

        this.recordMetric({
          name: 'first_byte_time',
          value: navigation.responseStart - navigation.fetchStart,
          timestamp: Date.now(),
          url: window.location.href
        });
      }
    });
  }

  private trackNavigationTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            const navEntry = entry as PerformanceNavigationTiming;
            
            this.recordMetric({
              name: 'navigation_timing',
              value: navEntry.loadEventEnd - navEntry.fetchStart,
              timestamp: Date.now(),
              url: window.location.href
            });
          });
        });

        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navigationObserver);
      } catch (error) {
        console.warn('Navigation timing observer not supported:', error);
      }
    }
  }

  private trackResourceTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // Track slow resources
            if (resourceEntry.duration > 1000) {
              this.recordMetric({
                name: 'slow_resource',
                value: resourceEntry.duration,
                timestamp: Date.now(),
                url: window.location.href
              });
            }
          });
        });

        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        console.warn('Resource timing observer not supported:', error);
      }
    }
  }

  private getConnectionInfo(): string {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return `${connection.effectiveType}-${connection.downlink}Mbps`;
    }
    return 'unknown';
  }

  recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Send to analytics service
    this.sendToAnalytics(metric);
    
    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Performance]', metric);
    }
  }

  private async sendToAnalytics(metric: PerformanceMetric) {
    try {
      // Send to Google Analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'performance_metric', {
          metric_name: metric.name,
          metric_value: Math.round(metric.value),
          page_url: metric.url,
          connection_type: metric.connection
        });
      }

      // Send to custom analytics endpoint
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metric)
      });
    } catch (error) {
      console.warn('Failed to send performance metric:', error);
    }
  }

  // Custom metric tracking
  trackCustomMetric(name: string, value: number, tags?: Record<string, string>) {
    this.recordMetric({
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
      ...tags
    });
  }

  // Track user interactions
  trackInteraction(type: string, target: string, duration?: number) {
    this.trackCustomMetric('user_interaction', duration || 0, {
      interaction_type: type,
      target_element: target
    });
  }

  // Track page visibility changes
  trackVisibilityChange(isVisible: boolean) {
    this.trackCustomMetric('visibility_change', isVisible ? 1 : 0);
  }

  // Track memory usage
  trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.trackCustomMetric('memory_used', memory.usedJSHeapSize);
      this.trackCustomMetric('memory_total', memory.totalJSHeapSize);
      this.trackCustomMetric('memory_limit', memory.jsHeapSizeLimit);
    }
  }

  // Get current metrics
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Get Core Web Vitals
  async getCoreWebVitals(): Promise<Partial<CoreWebVitals>> {
    return new Promise((resolve) => {
      const vitals: Partial<CoreWebVitals> = {};
      let resolved = false;

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(vitals);
        }
      }, 5000);

      // LCP
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            vitals.LCP = lastEntry.startTime;
            
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              resolve(vitals);
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (error) {
          console.warn('LCP observer not supported:', error);
        }
      }

      // FID
      if ('PerformanceObserver' in window) {
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              vitals.FID = entry.processingStart - entry.startTime;
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (error) {
          console.warn('FID observer not supported:', error);
        }
      }

      // CLS
      if ('PerformanceObserver' in window) {
        try {
          let clsValue = 0;
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            });
            vitals.CLS = clsValue;
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (error) {
          console.warn('CLS observer not supported:', error);
        }
      }
    });
  }

  // Cleanup
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
    this.isInitialized = false;
  }
}

// Singleton instance
export const performanceAnalytics = new PerformanceAnalytics();

// React hook for performance tracking
export function usePerformanceTracking() {
  useEffect(() => {
    performanceAnalytics.init();
    
    // Track memory usage periodically
    const memoryInterval = setInterval(() => {
      performanceAnalytics.trackMemoryUsage();
    }, 30000);

    // Track page visibility
    const handleVisibilityChange = () => {
      performanceAnalytics.trackVisibilityChange(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(memoryInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}

// Performance monitoring component
interface PerformanceMonitorProps {
  children: React.ReactNode;
  pageName: string;
}

export function PerformanceMonitor({ children, pageName }: PerformanceMonitorProps) {
  const startTime = useRef(performance.now());

  usePerformanceTracking();

  useEffect(() => {
    const endTime = performance.now();
    const loadTime = endTime - startTime.current;
    
    performanceAnalytics.trackCustomMetric('page_load_time', loadTime, {
      page_name: pageName
    });

    // Track Core Web Vitals
    performanceAnalytics.getCoreWebVitals().then((vitals) => {
      Object.entries(vitals).forEach(([key, value]) => {
        if (value !== undefined) {
          performanceAnalytics.trackCustomMetric(`core_web_vital_${key.toLowerCase()}`, value, {
            page_name: pageName
          });
        }
      });
    });
  }, [pageName]);

  return React.createElement(React.Fragment, null, children);
}

// Performance budget checker
export class PerformanceBudget {
  private budgets: Record<string, number> = {
    'page_load_time': 3000, // 3 seconds
    'first_contentful_paint': 1500, // 1.5 seconds
    'largest_contentful_paint': 2500, // 2.5 seconds
    'first_input_delay': 100, // 100ms
    'cumulative_layout_shift': 0.1, // 0.1
    'memory_used': 50 * 1024 * 1024, // 50MB
  };

  checkBudget(metric: PerformanceMetric): boolean {
    const budget = this.budgets[metric.name];
    if (budget === undefined) return true;
    
    const isWithinBudget = metric.value <= budget;
    
    if (!isWithinBudget) {
      console.warn(`Performance budget exceeded for ${metric.name}: ${metric.value} > ${budget}`);
      
      // Send alert to monitoring service
      this.sendBudgetAlert(metric, budget);
    }
    
    return isWithinBudget;
  }

  private async sendBudgetAlert(metric: PerformanceMetric, budget: number) {
    try {
      await fetch('/api/analytics/budget-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metric,
          budget,
          exceeded: true,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      console.warn('Failed to send budget alert:', error);
    }
  }

  setBudget(metricName: string, budget: number) {
    this.budgets[metricName] = budget;
  }

  getBudgets(): Record<string, number> {
    return { ...this.budgets };
  }
}

export const performanceBudget = new PerformanceBudget();
