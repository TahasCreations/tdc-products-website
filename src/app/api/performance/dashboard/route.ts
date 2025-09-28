import { NextResponse } from 'next/server';
import { performanceMonitor } from '../../../../lib/performance-monitor';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = performanceMonitor.getStats();
    const slowOperations = performanceMonitor.getSlowOperations();
    const recentMetrics = performanceMonitor.getMetricsByType('database', 20);
    const apiMetrics = performanceMonitor.getMetricsByType('api', 20);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          averageResponseTime: Math.round(stats.averageResponseTime),
          totalRequests: stats.totalRequests,
          errorRate: Math.round(stats.errorRate * 100) / 100,
          uptime: process.uptime ? Math.round(process.uptime()) : 0,
        },
        performance: {
          slowestQueries: stats.slowestQueries.map(q => ({
            name: q.name,
            duration: Math.round(q.duration),
            timestamp: q.timestamp,
            metadata: q.metadata
          })),
          slowOperations: slowOperations.map(op => ({
            name: op.name,
            type: op.type,
            duration: Math.round(op.duration),
            timestamp: op.timestamp,
            metadata: op.metadata
          }))
        },
        metrics: {
          database: recentMetrics.map(m => ({
            name: m.name,
            duration: Math.round(m.duration),
            timestamp: m.timestamp,
            metadata: m.metadata
          })),
          api: apiMetrics.map(m => ({
            name: m.name,
            duration: Math.round(m.duration),
            timestamp: m.timestamp,
            metadata: m.metadata
          }))
        },
        recommendations: generateRecommendations(stats, slowOperations)
      }
    });

  } catch (error) {
    console.error('Performance dashboard error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch performance data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateRecommendations(stats: any, slowOperations: any[]) {
  const recommendations = [];

  // Response time recommendations
  if (stats.averageResponseTime > 1000) {
    recommendations.push({
      type: 'warning',
      title: 'Yüksek Ortalama Yanıt Süresi',
      description: `Ortalama yanıt süresi ${Math.round(stats.averageResponseTime)}ms. Bu değer 1000ms'den yüksek.`,
      action: 'Veritabanı sorgularını optimize edin ve caching mekanizmalarını kullanın.',
      priority: 'high'
    });
  }

  // Error rate recommendations
  if (stats.errorRate > 5) {
    recommendations.push({
      type: 'error',
      title: 'Yüksek Hata Oranı',
      description: `Hata oranı %${stats.errorRate.toFixed(2)}. Bu değer %5'ten yüksek.`,
      action: 'Hata loglarını inceleyin ve hata yönetimini iyileştirin.',
      priority: 'critical'
    });
  }

  // Slow operations recommendations
  if (slowOperations.length > 0) {
    const criticalSlowOps = slowOperations.filter(op => op.duration > 5000);
    if (criticalSlowOps.length > 0) {
      recommendations.push({
        type: 'error',
        title: 'Kritik Yavaş İşlemler',
        description: `${criticalSlowOps.length} işlem 5 saniyeden uzun sürüyor.`,
        action: 'Bu işlemleri optimize edin veya asenkron hale getirin.',
        priority: 'critical'
      });
    }
  }

  // Database optimization recommendations
  const dbOperations = slowOperations.filter(op => op.type === 'database');
  if (dbOperations.length > 3) {
    recommendations.push({
      type: 'warning',
      title: 'Veritabanı Optimizasyonu Gerekli',
      description: `${dbOperations.length} veritabanı sorgusu yavaş çalışıyor.`,
      action: 'İndeks ekleyin, sorguları optimize edin ve connection pooling kullanın.',
      priority: 'medium'
    });
  }

  // API optimization recommendations
  const apiOperations = slowOperations.filter(op => op.type === 'api');
  if (apiOperations.length > 2) {
    recommendations.push({
      type: 'info',
      title: 'API Performans İyileştirmesi',
      description: `${apiOperations.length} API endpoint\'i yavaş yanıt veriyor.`,
      action: 'API route\'larını optimize edin ve caching ekleyin.',
      priority: 'low'
    });
  }

  // General recommendations if no specific issues
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'success',
      title: 'Sistem Performansı İyi',
      description: 'Sistem performansı kabul edilebilir seviyelerde.',
      action: 'Performansı sürekli izleyin ve gerektiğinde optimizasyon yapın.',
      priority: 'low'
    });
  }

  return recommendations;
}
