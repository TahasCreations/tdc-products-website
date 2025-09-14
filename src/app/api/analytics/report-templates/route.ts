import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    // Mock report templates data
    const templates = [
      {
        id: '1',
        name: 'Satış Performans Raporu',
        description: 'Günlük, haftalık ve aylık satış performans analizi',
        category: 'ecommerce',
        queryConfig: {
          metrics: ['revenue', 'orders', 'avg_order_value', 'conversion_rate'],
          dimensions: ['date', 'product_category', 'customer_segment'],
          filters: { date_range: 'custom', status: 'completed' }
        },
        visualizationConfig: {
          chartType: 'line',
          showTrends: true,
          showComparisons: true,
          showDrillDown: true
        },
        icon: 'ChartBarIcon'
      },
      {
        id: '2',
        name: 'Kullanıcı Etkileşim Raporu',
        description: 'Kullanıcı davranışları ve sayfa performansı',
        category: 'analytics',
        queryConfig: {
          metrics: ['page_views', 'session_duration', 'bounce_rate', 'exit_rate'],
          dimensions: ['page_path', 'user_type', 'device_type'],
          filters: { user_segment: 'all', page_type: 'all' }
        },
        visualizationConfig: {
          chartType: 'heatmap',
          showUserJourney: true,
          showFunnels: true,
          showSegments: true
        },
        icon: 'UserGroupIcon'
      },
      {
        id: '3',
        name: 'Performans İzleme Raporu',
        description: 'Web sitesi hız ve performans metrikleri',
        category: 'performance',
        queryConfig: {
          metrics: ['page_load_time', 'first_contentful_paint', 'largest_contentful_paint', 'core_web_vitals'],
          dimensions: ['page_url', 'device_type', 'connection_type'],
          filters: { performance_threshold: 'all', device_type: 'all' }
        },
        visualizationConfig: {
          chartType: 'gauge',
          showThresholds: true,
          showAlerts: true,
          showTrends: true
        },
        icon: 'ClockIcon'
      },
      {
        id: '4',
        name: 'Müşteri Analizi Raporu',
        description: 'Müşteri segmentasyonu ve yaşam döngüsü analizi',
        category: 'custom',
        queryConfig: {
          metrics: ['customer_count', 'lifetime_value', 'purchase_frequency', 'churn_rate'],
          dimensions: ['customer_segment', 'demographics', 'acquisition_channel'],
          filters: { segment_type: 'all', time_period: 'custom' }
        },
        visualizationConfig: {
          chartType: 'pie',
          showSegments: true,
          showComparisons: true,
          showTrends: true
        },
        icon: 'ChartPieIcon'
      },
      {
        id: '5',
        name: 'Pazarlama Kampanya Raporu',
        description: 'Pazarlama kampanyalarının performans analizi',
        category: 'analytics',
        queryConfig: {
          metrics: ['campaign_revenue', 'roi', 'click_through_rate', 'conversion_rate'],
          dimensions: ['campaign_name', 'channel', 'audience_segment'],
          filters: { campaign_status: 'active', channel: 'all' }
        },
        visualizationConfig: {
          chartType: 'bar',
          showROI: true,
          showAttribution: true,
          showComparisons: true
        },
        icon: 'TrendingUpIcon'
      },
      {
        id: '6',
        name: 'Envanter Yönetim Raporu',
        description: 'Stok seviyeleri ve ürün performansı',
        category: 'ecommerce',
        queryConfig: {
          metrics: ['stock_level', 'sales_velocity', 'turnover_rate', 'reorder_point'],
          dimensions: ['product_category', 'supplier', 'warehouse'],
          filters: { stock_status: 'all', category: 'all' }
        },
        visualizationConfig: {
          chartType: 'table',
          showAlerts: true,
          showTrends: true,
          showForecasts: true
        },
        icon: 'ShoppingCartIcon'
      },
      {
        id: '7',
        name: 'Finansal Performans Raporu',
        description: 'Gelir, maliyet ve karlılık analizi',
        category: 'custom',
        queryConfig: {
          metrics: ['revenue', 'cost_of_goods', 'gross_profit', 'net_profit_margin'],
          dimensions: ['product_category', 'sales_channel', 'time_period'],
          filters: { time_period: 'custom', category: 'all' }
        },
        visualizationConfig: {
          chartType: 'line',
          showProfitability: true,
          showMargins: true,
          showForecasts: true
        },
        icon: 'CurrencyDollarIcon'
      },
      {
        id: '8',
        name: 'Müşteri Hizmetleri Raporu',
        description: 'Destek talepleri ve müşteri memnuniyeti',
        category: 'custom',
        queryConfig: {
          metrics: ['ticket_count', 'resolution_time', 'satisfaction_score', 'first_contact_resolution'],
          dimensions: ['ticket_category', 'priority', 'agent'],
          filters: { ticket_status: 'all', priority: 'all' }
        },
        visualizationConfig: {
          chartType: 'bar',
          showSLA: true,
          showSatisfaction: true,
          showTrends: true
        },
        icon: 'ChatBubbleLeftRightIcon'
      }
    ];

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Report templates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
