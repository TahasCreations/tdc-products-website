import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client could not be created' }, { status: 500 });
    }

    // Mock custom reports data
    const reports = [
      {
        id: '1',
        name: 'Günlük Satış Raporu',
        description: 'Günlük satış performansı ve trend analizi',
        type: 'ecommerce',
        queryConfig: {
          metrics: ['revenue', 'orders', 'conversion_rate'],
          dimensions: ['date', 'product_category'],
          filters: { date_range: 'last_30_days' }
        },
        filters: {
          dateRange: 'last_30_days',
          categories: ['all'],
          status: 'active'
        },
        visualizationConfig: {
          chartType: 'line',
          showTrends: true,
          showComparisons: true
        },
        scheduleConfig: {
          frequency: 'daily',
          time: '08:00',
          dayOfWeek: null,
          dayOfMonth: null
        },
        isPublic: true,
        isActive: true,
        createdBy: 'admin',
        lastGeneratedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        nextGenerationAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'Kullanıcı Davranış Analizi',
        description: 'Kullanıcı etkileşimleri ve davranış kalıpları',
        type: 'analytics',
        queryConfig: {
          metrics: ['page_views', 'session_duration', 'bounce_rate'],
          dimensions: ['page_path', 'user_segment'],
          filters: { user_type: 'all' }
        },
        filters: {
          dateRange: 'last_7_days',
          userSegments: ['all'],
          pageTypes: ['all']
        },
        visualizationConfig: {
          chartType: 'heatmap',
          showUserJourney: true,
          showFunnels: true
        },
        scheduleConfig: {
          frequency: 'weekly',
          time: '09:00',
          dayOfWeek: 'monday',
          dayOfMonth: null
        },
        isPublic: false,
        isActive: true,
        createdBy: 'admin',
        lastGeneratedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        nextGenerationAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        name: 'Performans Metrikleri',
        description: 'Web sitesi performans ve hız analizi',
        type: 'performance',
        queryConfig: {
          metrics: ['page_load_time', 'first_contentful_paint', 'core_web_vitals'],
          dimensions: ['page_url', 'device_type'],
          filters: { performance_threshold: 'slow' }
        },
        filters: {
          dateRange: 'last_24_hours',
          deviceTypes: ['all'],
          pageTypes: ['all']
        },
        visualizationConfig: {
          chartType: 'gauge',
          showThresholds: true,
          showAlerts: true
        },
        scheduleConfig: {
          frequency: 'daily',
          time: '06:00',
          dayOfWeek: null,
          dayOfMonth: null
        },
        isPublic: true,
        isActive: true,
        createdBy: 'admin',
        lastGeneratedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        nextGenerationAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        name: 'Müşteri Segmentasyonu',
        description: 'Müşteri grupları ve segment analizi',
        type: 'custom',
        queryConfig: {
          metrics: ['customer_count', 'lifetime_value', 'purchase_frequency'],
          dimensions: ['customer_segment', 'demographics'],
          filters: { segment_type: 'rfm' }
        },
        filters: {
          dateRange: 'last_90_days',
          segmentTypes: ['rfm', 'behavioral'],
          demographics: ['all']
        },
        visualizationConfig: {
          chartType: 'pie',
          showSegments: true,
          showComparisons: true
        },
        scheduleConfig: {
          frequency: 'monthly',
          time: '10:00',
          dayOfWeek: null,
          dayOfMonth: 1
        },
        isPublic: false,
        isActive: true,
        createdBy: 'admin',
        lastGeneratedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        nextGenerationAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        name: 'A/B Test Sonuçları',
        description: 'A/B test performansı ve istatistiksel analiz',
        type: 'analytics',
        queryConfig: {
          metrics: ['conversion_rate', 'revenue_per_user', 'statistical_significance'],
          dimensions: ['test_variant', 'test_name'],
          filters: { test_status: 'active' }
        },
        filters: {
          dateRange: 'last_14_days',
          testTypes: ['all'],
          variants: ['all']
        },
        visualizationConfig: {
          chartType: 'bar',
          showSignificance: true,
          showConfidence: true
        },
        scheduleConfig: {
          frequency: 'weekly',
          time: '11:00',
          dayOfWeek: 'friday',
          dayOfMonth: null
        },
        isPublic: true,
        isActive: false,
        createdBy: 'admin',
        lastGeneratedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        nextGenerationAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Custom reports error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock report creation
    const newReport = {
      id: Date.now().toString(),
      ...body,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      lastGeneratedAt: null,
      nextGenerationAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
