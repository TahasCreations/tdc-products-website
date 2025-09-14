import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';
    const category = searchParams.get('category') || 'all';

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client could not be created' }, { status: 500 });
    }

    // Mock business intelligence data
    const metrics = [
      {
        id: '1',
        name: 'Toplam Gelir',
        category: 'revenue' as const,
        currentValue: 2345678,
        previousValue: 1987654,
        change: 357024,
        changePercentage: 17.9,
        trend: 'up' as const,
        benchmark: 2000000,
        benchmarkPercentage: 117.3,
        unit: 'currency',
        target: 2500000,
        targetAchievement: 93.8,
        status: 'good' as const
      },
      {
        id: '2',
        name: 'Dönüşüm Oranı',
        category: 'conversion' as const,
        currentValue: 3.2,
        previousValue: 2.8,
        change: 0.4,
        changePercentage: 14.3,
        trend: 'up' as const,
        benchmark: 2.5,
        benchmarkPercentage: 128.0,
        unit: 'percentage',
        target: 4.0,
        targetAchievement: 80.0,
        status: 'good' as const
      },
      {
        id: '3',
        name: 'Ortalama Sipariş Değeri',
        category: 'revenue' as const,
        currentValue: 189.50,
        previousValue: 175.20,
        change: 14.30,
        changePercentage: 8.2,
        trend: 'up' as const,
        benchmark: 150.00,
        benchmarkPercentage: 126.3,
        unit: 'currency',
        target: 200.00,
        targetAchievement: 94.8,
        status: 'good' as const
      },
      {
        id: '4',
        name: 'Müşteri Sadakat Oranı',
        category: 'retention' as const,
        currentValue: 78.5,
        previousValue: 75.2,
        change: 3.3,
        changePercentage: 4.4,
        trend: 'up' as const,
        benchmark: 70.0,
        benchmarkPercentage: 112.1,
        unit: 'percentage',
        target: 85.0,
        targetAchievement: 92.4,
        status: 'excellent' as const
      },
      {
        id: '5',
        name: 'Sayfa Görüntüleme Süresi',
        category: 'traffic' as const,
        currentValue: 145,
        previousValue: 132,
        change: 13,
        changePercentage: 9.8,
        trend: 'up' as const,
        benchmark: 120,
        benchmarkPercentage: 120.8,
        unit: 'number',
        target: 180,
        targetAchievement: 80.6,
        status: 'good' as const
      },
      {
        id: '6',
        name: 'Müşteri Memnuniyet Skoru',
        category: 'satisfaction' as const,
        currentValue: 4.6,
        previousValue: 4.4,
        change: 0.2,
        changePercentage: 4.5,
        trend: 'up' as const,
        benchmark: 4.0,
        benchmarkPercentage: 115.0,
        unit: 'number',
        target: 4.8,
        targetAchievement: 95.8,
        status: 'excellent' as const
      }
    ];

    // Filter metrics based on category
    const filteredMetrics = category === 'all' 
      ? metrics 
      : metrics.filter(m => m.category === category);

    // Mock KPI summary
    const kpiSummary = {
      totalRevenue: 2345678,
      totalOrders: 12345,
      totalUsers: 45678,
      conversionRate: 3.2,
      avgOrderValue: 189.50,
      customerLifetimeValue: 1250.00
    };

    // Mock performance trends
    const performanceTrends = [
      { date: '2024-01-01', revenue: 2100000, orders: 11000, users: 42000 },
      { date: '2024-01-02', revenue: 2150000, orders: 11200, users: 42500 },
      { date: '2024-01-03', revenue: 2200000, orders: 11400, users: 43000 },
      { date: '2024-01-04', revenue: 2250000, orders: 11600, users: 43500 },
      { date: '2024-01-05', revenue: 2300000, orders: 11800, users: 44000 },
      { date: '2024-01-06', revenue: 2320000, orders: 12000, users: 44500 },
      { date: '2024-01-07', revenue: 2345678, orders: 12345, users: 45678 }
    ];

    // Mock category performance
    const categoryPerformance = [
      { category: 'Anime', revenue: 1250000, orders: 6500, growth: 18.5 },
      { category: 'Gaming', revenue: 750000, orders: 3800, growth: 12.3 },
      { category: 'Film', revenue: 345678, orders: 2045, growth: 8.7 }
    ];

    // Mock business insights
    const insights = [
      {
        id: '1',
        title: 'Gelir Artış Trendi',
        description: 'Son 30 günde gelir %17.9 artış gösterdi. Bu trend devam ederse hedef aşılabilir.',
        impact: 'high' as const,
        category: 'revenue',
        recommendation: 'Stok seviyelerini artırın ve yeni ürün lansmanlarını hızlandırın.',
        actionRequired: true,
        priority: 'high' as const
      },
      {
        id: '2',
        title: 'Müşteri Sadakat İyileşmesi',
        description: 'Müşteri sadakat oranı %78.5\'e yükseldi. Hedef %85\'e yaklaşıyor.',
        impact: 'medium' as const,
        category: 'retention',
        recommendation: 'Sadakat programlarını güçlendirin ve kişiselleştirilmiş öneriler sunun.',
        actionRequired: false,
        priority: 'medium' as const
      },
      {
        id: '3',
        title: 'Dönüşüm Oranı Optimizasyonu',
        description: 'Dönüşüm oranı %3.2\'ye yükseldi ancak hedef %4.0\'a ulaşmak için daha fazla çalışma gerekiyor.',
        impact: 'high' as const,
        category: 'conversion',
        recommendation: 'Checkout sürecini optimize edin ve A/B testler yapın.',
        actionRequired: true,
        priority: 'urgent' as const
      },
      {
        id: '4',
        title: 'Müşteri Memnuniyet Artışı',
        description: 'Müşteri memnuniyet skoru 4.6\'ya yükseldi. Mükemmel seviyeye yaklaşıyor.',
        impact: 'medium' as const,
        category: 'satisfaction',
        recommendation: 'Mevcut kalite standartlarını koruyun ve müşteri geri bildirimlerini takip edin.',
        actionRequired: false,
        priority: 'low' as const
      }
    ];

    const biData = {
      metrics: filteredMetrics,
      insights,
      kpiSummary,
      performanceTrends,
      categoryPerformance
    };

    return NextResponse.json(biData);
  } catch (error) {
    console.error('Business Intelligence error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
