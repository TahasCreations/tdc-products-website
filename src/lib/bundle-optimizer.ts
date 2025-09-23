// Bundle Optimization Utilities
import React from 'react';

interface BundleAnalysis {
  name: string;
  size: number;
  gzipSize: number;
  chunks: number;
  dependencies: string[];
  duplicateDependencies: string[];
  unusedDependencies: string[];
  optimizationScore: number;
}

interface OptimizationRecommendation {
  type: 'code-splitting' | 'tree-shaking' | 'lazy-loading' | 'compression' | 'duplicate-removal';
  priority: 'high' | 'medium' | 'low';
  description: string;
  potentialSavings: number; // in KB
  implementation: string;
}

class BundleOptimizer {
  private bundles: Map<string, BundleAnalysis> = new Map();
  private recommendations: OptimizationRecommendation[] = [];

  analyzeBundle(name: string, bundleData: any): BundleAnalysis {
    const analysis: BundleAnalysis = {
      name,
      size: bundleData.size || 0,
      gzipSize: bundleData.gzipSize || 0,
      chunks: bundleData.chunks?.length || 0,
      dependencies: bundleData.dependencies || [],
      duplicateDependencies: this.findDuplicateDependencies(bundleData.dependencies || []),
      unusedDependencies: this.findUnusedDependencies(bundleData.dependencies || []),
      optimizationScore: 0
    };

    analysis.optimizationScore = this.calculateOptimizationScore(analysis);
    this.bundles.set(name, analysis);
    
    return analysis;
  }

  private findDuplicateDependencies(dependencies: string[]): string[] {
    const seen = new Set<string>();
    const duplicates: string[] = [];

    dependencies.forEach(dep => {
      if (seen.has(dep)) {
        duplicates.push(dep);
      } else {
        seen.add(dep);
      }
    });

    return duplicates;
  }

  private findUnusedDependencies(dependencies: string[]): string[] {
    // This would need actual code analysis to determine truly unused dependencies
    // For now, return a mock list
    return dependencies.filter(dep => 
      dep.includes('unused') || 
      dep.includes('test') || 
      dep.includes('dev')
    );
  }

  private calculateOptimizationScore(analysis: BundleAnalysis): number {
    let score = 100;

    // Penalize large bundle size
    if (analysis.size > 500) score -= 20;
    else if (analysis.size > 200) score -= 10;

    // Penalize low compression ratio
    const compressionRatio = analysis.gzipSize / analysis.size;
    if (compressionRatio > 0.5) score -= 15;
    else if (compressionRatio > 0.3) score -= 10;

    // Penalize many chunks (potential over-splitting)
    if (analysis.chunks > 20) score -= 10;
    else if (analysis.chunks > 10) score -= 5;

    // Penalize duplicate dependencies
    score -= analysis.duplicateDependencies.length * 5;

    // Penalize unused dependencies
    score -= analysis.unusedDependencies.length * 3;

    return Math.max(0, Math.min(100, score));
  }

  generateRecommendations(): OptimizationRecommendation[] {
    this.recommendations = [];

    this.bundles.forEach((bundle, name) => {
      // Code splitting recommendations
      if (bundle.size > 200) {
        this.recommendations.push({
          type: 'code-splitting',
          priority: 'high',
          description: `${name} bundle çok büyük (${bundle.size}KB). Kod bölme uygulayın.`,
          potentialSavings: bundle.size * 0.3,
          implementation: 'React.lazy() ve dynamic imports kullanın'
        });
      }

      // Tree shaking recommendations
      if (bundle.unusedDependencies.length > 0) {
        this.recommendations.push({
          type: 'tree-shaking',
          priority: 'medium',
          description: `${bundle.unusedDependencies.length} kullanılmayan bağımlılık bulundu.`,
          potentialSavings: bundle.unusedDependencies.length * 10,
          implementation: 'ES6 imports kullanın ve webpack tree shaking aktif edin'
        });
      }

      // Duplicate removal recommendations
      if (bundle.duplicateDependencies.length > 0) {
        this.recommendations.push({
          type: 'duplicate-removal',
          priority: 'high',
          description: `${bundle.duplicateDependencies.length} tekrarlanan bağımlılık bulundu.`,
          potentialSavings: bundle.duplicateDependencies.length * 15,
          implementation: 'webpack deduplication ve alias kullanın'
        });
      }

      // Compression recommendations
      const compressionRatio = bundle.gzipSize / bundle.size;
      if (compressionRatio > 0.4) {
        this.recommendations.push({
          type: 'compression',
          priority: 'medium',
          description: `Düşük sıkıştırma oranı (${(compressionRatio * 100).toFixed(1)}%).`,
          potentialSavings: bundle.size * 0.2,
          implementation: 'Brotli compression ve minification iyileştirin'
        });
      }
    });

    return this.recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  getOptimizationReport(): {
    bundles: BundleAnalysis[];
    recommendations: OptimizationRecommendation[];
    totalSavings: number;
    averageScore: number;
  } {
    const bundles = Array.from(this.bundles.values());
    const recommendations = this.generateRecommendations();
    const totalSavings = recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0);
    const averageScore = bundles.reduce((sum, bundle) => sum + bundle.optimizationScore, 0) / bundles.length;

    return {
      bundles,
      recommendations,
      totalSavings,
      averageScore: Math.round(averageScore)
    };
  }
}

// Lazy Loading Utilities
export const lazyLoadComponent = (importFunc: () => Promise<any>, fallback?: React.ComponentType) => {
  return React.lazy(importFunc);
};

export const dynamicImport = async (modulePath: string) => {
  try {
    const importedModule = await import(modulePath);
    return importedModule.default || importedModule;
  } catch (error) {
    console.error(`Failed to load module ${modulePath}:`, error);
    return null;
  }
};

// Preloading Utilities
export const preloadResource = (href: string, as: string) => {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }
};

export const preloadModule = (modulePath: string) => {
  preloadResource(modulePath, 'script');
};

// Tree Shaking Utilities
export const treeShake = (imports: string[]) => {
  return imports.filter(imp => {
    // Remove test files
    if (imp.includes('.test.') || imp.includes('.spec.')) return false;
    // Remove dev dependencies
    if (imp.includes('dev') || imp.includes('development')) return false;
    // Remove unused patterns
    if (imp.includes('unused') || imp.includes('deprecated')) return false;
    return true;
  });
};

// Image Optimization Utilities
export const optimizeImage = (src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
}) => {
  const { width, height, quality = 75, format = 'webp' } = options;
  
  // This would integrate with your image optimization service
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  params.set('q', quality.toString());
  params.set('f', format);
  
  return `${src}?${params.toString()}`;
};

// Bundle splitting strategies
export const createBundleSplitter = () => {
  return {
    // Split by route
    splitByRoute: (routes: string[]) => {
      return routes.map(route => ({
        name: route,
        test: new RegExp(`[\\/]${route}[\\/]`),
        chunks: 'all',
        priority: 20
      }));
    },

    // Split by vendor
    splitByVendor: (vendors: string[]) => {
      return vendors.map(vendor => ({
        name: vendor,
        test: new RegExp(`[\\/]node_modules[\\/]${vendor}[\\/]`),
        chunks: 'all',
        priority: 10
      }));
    },

    // Split by size
    splitBySize: (maxSize: number) => {
      return {
        maxSize,
        minSize: 20000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000
      };
    }
  };
};

// Performance monitoring for bundles
export const monitorBundlePerformance = () => {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === 'resource') {
        const resource = entry as PerformanceResourceTiming;
        if (resource.name.includes('.js') || resource.name.includes('.css')) {
          console.log(`Bundle loaded: ${resource.name} (${resource.transferSize} bytes)`);
        }
      }
    });
  });

  observer.observe({ entryTypes: ['resource'] });
};

// Export the main optimizer class
export const bundleOptimizer = new BundleOptimizer();

export default BundleOptimizer;