'use client';

import { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '../lib/performance-monitor';
import { useAdvancedCache } from '../lib/advanced-cache';
import { useSecurity } from '../lib/security';

export default function PerformanceDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<any>({});
  
  const { getCoreWebVitals, getMemoryUsage, getMetrics } = usePerformanceMonitor();
  const { getStats } = useAdvancedCache();
  const { getSecurityStats } = useSecurity();

  useEffect(() => {
    const updateMetrics = () => {
      setMetrics({
        coreWebVitals: getCoreWebVitals(),
        memory: getMemoryUsage(),
        performance: getMetrics(),
        cache: getStats(),
        security: getSecurityStats()
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, [getCoreWebVitals, getMemoryUsage, getMetrics, getStats, getSecurityStats]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Performance Dashboard"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Performance Dashboard</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 text-sm">
        {/* Core Web Vitals */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Core Web Vitals</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>LCP:</span>
              <span className={metrics.coreWebVitals?.lcp && metrics.coreWebVitals.lcp < 2500 ? 'text-green-600' : 'text-red-600'}>
                {metrics.coreWebVitals?.lcp ? `${Math.round(metrics.coreWebVitals.lcp)}ms` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>FID:</span>
              <span className={metrics.coreWebVitals?.fid && metrics.coreWebVitals.fid < 100 ? 'text-green-600' : 'text-red-600'}>
                {metrics.coreWebVitals?.fid ? `${Math.round(metrics.coreWebVitals.fid)}ms` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>CLS:</span>
              <span className={metrics.coreWebVitals?.cls && metrics.coreWebVitals.cls < 0.1 ? 'text-green-600' : 'text-red-600'}>
                {metrics.coreWebVitals?.cls ? metrics.coreWebVitals.cls.toFixed(3) : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Memory</h4>
          <div className="flex justify-between">
            <span>Used:</span>
            <span className={metrics.memory && metrics.memory < 50 ? 'text-green-600' : 'text-orange-600'}>
              {metrics.memory}MB
            </span>
          </div>
        </div>

        {/* Cache Stats */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Cache</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Size:</span>
              <span>{metrics.cache?.size || 0}/{metrics.cache?.maxSize || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Hit Rate:</span>
              <span className={metrics.cache?.hitRate && metrics.cache.hitRate > 0.8 ? 'text-green-600' : 'text-orange-600'}>
                {metrics.cache?.hitRate ? `${Math.round(metrics.cache.hitRate * 100)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Security Stats */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Security</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Rate Limits:</span>
              <span>{metrics.security?.activeRateLimits || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Requests:</span>
              <span>{metrics.security?.totalRequests || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
