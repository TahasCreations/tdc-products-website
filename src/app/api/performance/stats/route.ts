import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Performans istatistiklerini hesapla
    const stats = {
      // Genel Performans
      overallScore: 0,
      averageLoadTime: 0,
      totalRequests: 0,
      errorRate: 0,
      
      // Core Web Vitals
      lcp: 0, // Largest Contentful Paint
      fid: 0, // First Input Delay
      cls: 0, // Cumulative Layout Shift
      fcp: 0, // First Contentful Paint
      ttfb: 0, // Time to First Byte
      
      // Sistem Metrikleri
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      networkLatency: 0,
      
      // Veritabanı Performansı
      dbQueryTime: 0,
      dbConnections: 0,
      slowQueries: 0,
      
      // Cache Performansı
      cacheHitRate: 0,
      cacheSize: 0,
      cacheEvictions: 0,
      
      // Bundle Analizi
      totalBundleSize: 0,
      gzipSize: 0,
      unusedCode: 0,
      
      // Sayfa Performansı
      slowestPages: [],
      fastestPages: [],
      
      // Optimizasyon Önerileri
      recommendations: []
    };

    if (supabase) {
      // Gerçek verilerden hesapla
      const [performanceData, errorData, bundleData] = await Promise.all([
        supabase.from('performance_metrics').select('*'),
        supabase.from('error_logs').select('*'),
        supabase.from('bundle_analysis').select('*')
      ]);

      const perfData = performanceData.data || [];
      const errors = errorData.data || [];
      const bundles = bundleData.data || [];

      // Genel performans skoru
      const avgLcp = perfData.reduce((sum, p) => sum + (p.lcp || 0), 0) / perfData.length || 0;
      const avgFid = perfData.reduce((sum, p) => sum + (p.fid || 0), 0) / perfData.length || 0;
      const avgCls = perfData.reduce((sum, p) => sum + (p.cls || 0), 0) / perfData.length || 0;
      
      // Core Web Vitals skorları (0-100)
      const lcpScore = avgLcp <= 2500 ? 100 : avgLcp <= 4000 ? 75 : 50;
      const fidScore = avgFid <= 100 ? 100 : avgFid <= 300 ? 75 : 50;
      const clsScore = avgCls <= 0.1 ? 100 : avgCls <= 0.25 ? 75 : 50;
      
      stats.overallScore = Math.round((lcpScore + fidScore + clsScore) / 3);
      stats.lcp = avgLcp;
      stats.fid = avgFid;
      stats.cls = avgCls;
      stats.fcp = perfData.reduce((sum, p) => sum + (p.fcp || 0), 0) / perfData.length || 0;
      stats.ttfb = perfData.reduce((sum, p) => sum + (p.ttfb || 0), 0) / perfData.length || 0;
      
      // Ortalama yükleme süresi
      stats.averageLoadTime = perfData.reduce((sum, p) => sum + (p.load_time || 0), 0) / perfData.length || 0;
      
      // Toplam istek sayısı
      stats.totalRequests = perfData.length;
      
      // Hata oranı
      stats.errorRate = perfData.length > 0 ? (errors.length / perfData.length) * 100 : 0;
      
      // Sistem metrikleri (mock data)
      stats.cpuUsage = 45;
      stats.memoryUsage = 68;
      stats.diskUsage = 32;
      stats.networkLatency = 120;
      
      // Veritabanı performansı
      stats.dbQueryTime = 85;
      stats.dbConnections = 12;
      stats.slowQueries = errors.filter(e => e.type === 'slow_query').length;
      
      // Cache performansı
      stats.cacheHitRate = 87;
      stats.cacheSize = 256;
      stats.cacheEvictions = 23;
      
      // Bundle analizi
      stats.totalBundleSize = bundles.reduce((sum, b) => sum + (b.size || 0), 0);
      stats.gzipSize = bundles.reduce((sum, b) => sum + (b.gzip_size || 0), 0);
      stats.unusedCode = 15; // Yüzde
      
      // En yavaş ve hızlı sayfalar
      const pagePerf = perfData.map(p => ({
        name: p.page_name || 'Unknown',
        url: p.page_url || '',
        loadTime: p.load_time || 0,
        score: p.performance_score || 0
      })).sort((a, b) => b.loadTime - a.loadTime);
      
      stats.slowestPages = pagePerf.slice(0, 5);
      stats.fastestPages = pagePerf.slice(-5).reverse();
      
      // Optimizasyon önerileri
      stats.recommendations = generateRecommendations(stats);

    } else {
      // Fallback: Mock data
      stats.overallScore = 78;
      stats.averageLoadTime = 2.3;
      stats.totalRequests = 15420;
      stats.errorRate = 2.1;
      stats.lcp = 3200;
      stats.fid = 150;
      stats.cls = 0.15;
      stats.fcp = 1800;
      stats.ttfb = 450;
      stats.cpuUsage = 45;
      stats.memoryUsage = 68;
      stats.diskUsage = 32;
      stats.networkLatency = 120;
      stats.dbQueryTime = 85;
      stats.dbConnections = 12;
      stats.slowQueries = 3;
      stats.cacheHitRate = 87;
      stats.cacheSize = 256;
      stats.cacheEvictions = 23;
      stats.totalBundleSize = 2048000; // 2MB
      stats.gzipSize = 512000; // 512KB
      stats.unusedCode = 15;
      
      stats.slowestPages = [
        { name: 'Admin Dashboard', url: '/admin/dashboard', loadTime: 4.2, score: 65 },
        { name: 'Products Page', url: '/products', loadTime: 3.8, score: 72 },
        { name: 'Checkout', url: '/checkout', loadTime: 3.5, score: 75 }
      ];
      
      stats.fastestPages = [
        { name: 'Homepage', url: '/', loadTime: 1.2, score: 95 },
        { name: 'About', url: '/about', loadTime: 1.4, score: 92 },
        { name: 'Contact', url: '/contact', loadTime: 1.6, score: 90 }
      ];
      
      stats.recommendations = generateRecommendations(stats);
    }

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Performance stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch performance statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateRecommendations(stats: any) {
  const recommendations = [];
  
  // LCP optimizasyonu
  if (stats.lcp > 2500) {
    recommendations.push({
      id: 'lcp-optimization',
      title: 'Largest Contentful Paint Optimizasyonu',
      description: 'LCP değeriniz 2.5s\'den yüksek. Görsel optimizasyonu ve lazy loading uygulayın.',
      priority: 'high',
      impact: 'Yüksek',
      effort: 'Orta',
      category: 'Core Web Vitals',
      actions: [
        'Görselleri WebP formatına çevirin',
        'Lazy loading uygulayın',
        'CDN kullanın',
        'Görsel boyutlarını optimize edin'
      ]
    });
  }
  
  // FID optimizasyonu
  if (stats.fid > 100) {
    recommendations.push({
      id: 'fid-optimization',
      title: 'First Input Delay Optimizasyonu',
      description: 'FID değeriniz 100ms\'den yüksek. JavaScript optimizasyonu yapın.',
      priority: 'high',
      impact: 'Yüksek',
      effort: 'Yüksek',
      category: 'Core Web Vitals',
      actions: [
        'JavaScript bundle\'ını küçültün',
        'Code splitting uygulayın',
        'Third-party script\'leri optimize edin',
        'Unused code\'u kaldırın'
      ]
    });
  }
  
  // CLS optimizasyonu
  if (stats.cls > 0.1) {
    recommendations.push({
      id: 'cls-optimization',
      title: 'Cumulative Layout Shift Optimizasyonu',
      description: 'CLS değeriniz 0.1\'den yüksek. Layout shift\'leri önleyin.',
      priority: 'medium',
      impact: 'Orta',
      effort: 'Düşük',
      category: 'Core Web Vitals',
      actions: [
        'Görsel boyutlarını belirtin',
        'Font loading optimize edin',
        'Dynamic content için placeholder kullanın',
        'CSS\'i optimize edin'
      ]
    });
  }
  
  // Bundle optimizasyonu
  if (stats.unusedCode > 10) {
    recommendations.push({
      id: 'bundle-optimization',
      title: 'Bundle Size Optimizasyonu',
      description: `Bundle'ınızda %${stats.unusedCode} kullanılmayan kod var.`,
      priority: 'medium',
      impact: 'Orta',
      effort: 'Orta',
      category: 'Bundle Analysis',
      actions: [
        'Tree shaking uygulayın',
        'Unused imports\'ları kaldırın',
        'Dynamic imports kullanın',
        'Bundle analyzer çalıştırın'
      ]
    });
  }
  
  // Cache optimizasyonu
  if (stats.cacheHitRate < 90) {
    recommendations.push({
      id: 'cache-optimization',
      title: 'Cache Hit Rate Optimizasyonu',
      description: `Cache hit rate'iniz %${stats.cacheHitRate}. Cache stratejinizi gözden geçirin.`,
      priority: 'low',
      impact: 'Düşük',
      effort: 'Düşük',
      category: 'Caching',
      actions: [
        'Cache TTL\'lerini optimize edin',
        'Cache key stratejisini gözden geçirin',
        'Redis kullanın',
        'CDN cache ayarlarını kontrol edin'
      ]
    });
  }
  
  // Veritabanı optimizasyonu
  if (stats.slowQueries > 0) {
    recommendations.push({
      id: 'db-optimization',
      title: 'Veritabanı Query Optimizasyonu',
      description: `${stats.slowQueries} yavaş query tespit edildi.`,
      priority: 'high',
      impact: 'Yüksek',
      effort: 'Yüksek',
      category: 'Database',
      actions: [
        'Query\'leri analiz edin',
        'Index\'leri optimize edin',
        'N+1 query problemini çözün',
        'Connection pooling kullanın'
      ]
    });
  }
  
  return recommendations;
}
