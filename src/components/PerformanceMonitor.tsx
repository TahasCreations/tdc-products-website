'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  cacheHitRate: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Measure page load time
    const loadTime = performance.now();
    
    // Measure render time
    const renderStart = performance.now();
    
    // Simulate render completion
    setTimeout(() => {
      const renderTime = performance.now() - renderStart;
      
      // Get memory usage (if available)
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Calculate bundle size (approximate)
      const bundleSize = document.querySelectorAll('script').length * 50; // Rough estimate
      
      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        memoryUsage: Math.round(memoryUsage / 1024 / 1024), // Convert to MB
        bundleSize: bundleSize,
        cacheHitRate: Math.random() * 100 // Mock cache hit rate
      });
    }, 100);
  }, []);

  if (!metrics) return null;

  return (
    <>
      {/* Performance Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Performance Monitor"
      >
        <i className="ri-speed-line text-xl"></i>
      </button>

      {/* Performance Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Performance Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Load Time:</span>
              <span className={`text-sm font-medium ${
                metrics.loadTime < 1000 ? 'text-green-600' : 
                metrics.loadTime < 3000 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.loadTime}ms
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Render Time:</span>
              <span className={`text-sm font-medium ${
                metrics.renderTime < 100 ? 'text-green-600' : 
                metrics.renderTime < 500 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.renderTime}ms
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Memory Usage:</span>
              <span className={`text-sm font-medium ${
                metrics.memoryUsage < 50 ? 'text-green-600' : 
                metrics.memoryUsage < 100 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.memoryUsage}MB
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bundle Size:</span>
              <span className={`text-sm font-medium ${
                metrics.bundleSize < 1000 ? 'text-green-600' : 
                metrics.bundleSize < 2000 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.bundleSize}KB
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cache Hit Rate:</span>
              <span className={`text-sm font-medium ${
                metrics.cacheHitRate > 80 ? 'text-green-600' : 
                metrics.cacheHitRate > 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {metrics.cacheHitRate.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Performance Score: {
                metrics.loadTime < 1000 && metrics.renderTime < 100 && metrics.memoryUsage < 50 ? 'Excellent' :
                metrics.loadTime < 3000 && metrics.renderTime < 500 && metrics.memoryUsage < 100 ? 'Good' :
                'Needs Improvement'
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}
