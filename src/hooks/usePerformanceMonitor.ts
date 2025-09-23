import { useEffect, useRef, useState, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  totalBlockingTime: number;
  speedIndex: number;
  timeToInteractive: number;
}

interface PerformanceObserver {
  observe: (entry: PerformanceObserverInit) => void;
  disconnect: () => void;
}

export function usePerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const observerRef = useRef<PerformanceObserver | null>(null);

  const startMonitoring = useCallback(() => {
    if (typeof window === 'undefined') return;

    const performanceMetrics: Partial<PerformanceMetrics> = {};

    // Monitor Navigation Timing
    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          performanceMetrics.loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
          performanceMetrics.timeToInteractive = navEntry.domInteractive - navEntry.fetchStart;
        }
      });
    });

    // Monitor Paint Timing
    const paintObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          performanceMetrics.firstContentfulPaint = entry.startTime;
        }
      });
    });

    // Monitor Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      performanceMetrics.largestContentfulPaint = lastEntry.startTime;
    });

    // Monitor First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        performanceMetrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
      });
    });

    // Monitor Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      });
      performanceMetrics.cumulativeLayoutShift = clsValue;
    });

    // Monitor Long Tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      let totalBlockingTime = 0;
      entries.forEach((entry) => {
        if (entry.duration > 50) {
          totalBlockingTime += entry.duration - 50;
        }
      });
      performanceMetrics.totalBlockingTime = totalBlockingTime;
    });

    // Start observing
    try {
      navigationObserver.observe({ type: 'navigation', buffered: true });
      paintObserver.observe({ type: 'paint', buffered: true });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      fidObserver.observe({ type: 'first-input', buffered: true });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      longTaskObserver.observe({ type: 'longtask', buffered: true });

      // Calculate Speed Index (simplified)
      setTimeout(() => {
        const speedIndex = calculateSpeedIndex();
        performanceMetrics.speedIndex = speedIndex;
        
        setMetrics(performanceMetrics as PerformanceMetrics);
      }, 2000);

    } catch (error) {
      console.warn('Performance monitoring not fully supported:', error);
    }
  }, []);

  useEffect(() => {
    // Check if Performance Observer is supported
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      setIsSupported(true);
      startMonitoring();
    }

    return () => {
      const currentObserver = observerRef.current;
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [startMonitoring]);

  const calculateSpeedIndex = (): number => {
    // Simplified Speed Index calculation
    // In a real implementation, this would analyze visual completeness over time
    return Math.random() * 2000 + 1000; // Mock value
  };

  const getPerformanceScore = (): number => {
    if (!metrics) return 0;

    let score = 100;

    // FCP scoring (0-100)
    if (metrics.firstContentfulPaint > 3000) score -= 30;
    else if (metrics.firstContentfulPaint > 1800) score -= 20;
    else if (metrics.firstContentfulPaint > 1000) score -= 10;

    // LCP scoring (0-100)
    if (metrics.largestContentfulPaint > 4000) score -= 30;
    else if (metrics.largestContentfulPaint > 2500) score -= 20;
    else if (metrics.largestContentfulPaint > 1200) score -= 10;

    // FID scoring (0-100)
    if (metrics.firstInputDelay > 300) score -= 30;
    else if (metrics.firstInputDelay > 100) score -= 20;
    else if (metrics.firstInputDelay > 50) score -= 10;

    // CLS scoring (0-100)
    if (metrics.cumulativeLayoutShift > 0.25) score -= 30;
    else if (metrics.cumulativeLayoutShift > 0.1) score -= 20;
    else if (metrics.cumulativeLayoutShift > 0.05) score -= 10;

    return Math.max(0, Math.min(100, score));
  };

  const getPerformanceGrade = (): string => {
    const score = getPerformanceScore();
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getPerformanceColor = (): string => {
    const score = getPerformanceScore();
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-yellow-600 bg-yellow-100';
    if (score >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getRecommendations = (): string[] => {
    if (!metrics) return [];

    const recommendations: string[] = [];

    if (metrics.firstContentfulPaint > 1800) {
      recommendations.push('First Contentful Paint yavaş - CSS optimizasyonu yapın');
    }

    if (metrics.largestContentfulPaint > 2500) {
      recommendations.push('Largest Contentful Paint yavaş - Görsel optimizasyonu yapın');
    }

    if (metrics.firstInputDelay > 100) {
      recommendations.push('First Input Delay yüksek - JavaScript optimizasyonu yapın');
    }

    if (metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('Cumulative Layout Shift yüksek - Layout stabilitesini artırın');
    }

    if (metrics.totalBlockingTime > 200) {
      recommendations.push('Total Blocking Time yüksek - Uzun görevleri bölün');
    }

    if (metrics.loadTime > 3000) {
      recommendations.push('Sayfa yükleme süresi yavaş - Genel performans optimizasyonu yapın');
    }

    return recommendations;
  };

  return {
    metrics,
    isSupported,
    getPerformanceScore,
    getPerformanceGrade,
    getPerformanceColor,
    getRecommendations
  };
}

// Hook for monitoring specific performance events
export function usePerformanceEvent(eventName: string, callback: (entry: PerformanceEntry) => void) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(callback);
    });

    try {
      observer.observe({ entryTypes: [eventName] });
    } catch (error) {
      console.warn(`Performance event ${eventName} not supported:`, error);
    }

    return () => observer.disconnect();
  }, [eventName, callback]);
}

// Hook for measuring custom performance marks
export function usePerformanceMark() {
  const mark = (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(name);
    }
  };

  const measure = (name: string, startMark: string, endMark?: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        if (endMark) {
          performance.measure(name, startMark, endMark);
        } else {
          performance.measure(name, startMark);
        }
        return performance.getEntriesByName(name)[0]?.duration || 0;
      } catch (error) {
        console.warn('Performance measure failed:', error);
        return 0;
      }
    }
    return 0;
  };

  const getMark = (name: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      return performance.getEntriesByName(name)[0];
    }
    return null;
  };

  const clearMarks = (name?: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      if (name) {
        performance.clearMarks(name);
      } else {
        performance.clearMarks();
      }
    }
  };

  return { mark, measure, getMark, clearMarks };
}
