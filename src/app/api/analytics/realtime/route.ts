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

    // Real-time analytics data
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get real-time metrics
    const { data: recentEvents, error: eventsError } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', oneHourAgo.toISOString())
      .order('created_at', { ascending: false });

    if (eventsError) {
      console.error('Analytics events error:', eventsError);
    }

    // Get e-commerce metrics
    const { data: ecommerceMetrics, error: ecommerceError } = await supabase
      .from('ecommerce_metrics')
      .select('*')
      .gte('created_at', oneDayAgo.toISOString());

    if (ecommerceError) {
      console.error('E-commerce metrics error:', ecommerceError);
    }

    // Calculate metrics
    const totalViews = recentEvents?.filter(e => e.event_type === 'page_view').length || 0;
    const totalUsers = new Set(recentEvents?.map(e => e.user_id).filter(Boolean)).size;
    const totalSessions = new Set(recentEvents?.map(e => e.session_id)).size;
    const totalRevenue = ecommerceMetrics?.reduce((sum, m) => sum + (m.revenue || 0), 0) || 0;

    // Calculate changes (mock data for now)
    const metrics = [
      {
        id: 'views',
        name: 'Sayfa Görüntülemeleri',
        value: totalViews,
        change: 12.5,
        changeType: 'increase' as const,
        format: 'number' as const,
        icon: 'EyeIcon',
        color: 'bg-blue-500'
      },
      {
        id: 'users',
        name: 'Aktif Kullanıcılar',
        value: totalUsers,
        change: 8.3,
        changeType: 'increase' as const,
        format: 'number' as const,
        icon: 'UserGroupIcon',
        color: 'bg-green-500'
      },
      {
        id: 'sessions',
        name: 'Oturumlar',
        value: totalSessions,
        change: 15.2,
        changeType: 'increase' as const,
        format: 'number' as const,
        icon: 'ClockIcon',
        color: 'bg-purple-500'
      },
      {
        id: 'revenue',
        name: 'Gelir',
        value: totalRevenue,
        change: 18.7,
        changeType: 'increase' as const,
        format: 'currency' as const,
        icon: 'CurrencyDollarIcon',
        color: 'bg-yellow-500'
      }
    ];

    // Mock chart data
    const chartData = {
      labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
      datasets: [
        {
          label: 'Sayfa Görüntülemeleri',
          data: [120, 95, 80, 65, 70, 85, 110, 140, 160, 180, 200, 220],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true
        },
        {
          label: 'Aktif Kullanıcılar',
          data: [80, 70, 60, 50, 55, 65, 85, 100, 120, 140, 150, 160],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true
        }
      ]
    };

    // Mock recent activity
    const recentActivity = [
      {
        id: '1',
        type: 'purchase',
        description: 'Yeni sipariş alındı - Naruto Figürü',
        timestamp: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
        user: 'Kullanıcı #1234'
      },
      {
        id: '2',
        type: 'page_view',
        description: 'Ana sayfa görüntülendi',
        timestamp: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
        user: 'Kullanıcı #5678'
      },
      {
        id: '3',
        type: 'add_to_cart',
        description: 'Ürün sepete eklendi - Goku Figürü',
        timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        user: 'Kullanıcı #9012'
      },
      {
        id: '4',
        type: 'search',
        description: 'Arama yapıldı - "anime figür"',
        timestamp: new Date(now.getTime() - 20 * 60 * 1000).toISOString(),
        user: 'Kullanıcı #3456'
      },
      {
        id: '5',
        type: 'registration',
        description: 'Yeni kullanıcı kaydı',
        timestamp: new Date(now.getTime() - 25 * 60 * 1000).toISOString(),
        user: 'Kullanıcı #7890'
      }
    ];

    // Mock top pages
    const topPages = [
      { page: '/', views: 1234, change: 12.5 },
      { page: '/products', views: 987, change: 8.3 },
      { page: '/products/naruto-figuru', views: 654, change: 15.2 },
      { page: '/about', views: 432, change: -2.1 },
      { page: '/contact', views: 321, change: 5.7 }
    ];

    // Mock top products
    const topProducts = [
      { product: 'Naruto Uzumaki Figürü', sales: 45, revenue: 13499.55 },
      { product: 'Goku Super Saiyan Figürü', sales: 38, revenue: 13299.62 },
      { product: 'Mario Bros Figürü', sales: 42, revenue: 8399.58 },
      { product: 'Iron Man Mark 85 Figürü', sales: 25, revenue: 11249.75 }
    ];

    const realTimeData = {
      metrics,
      chartData,
      recentActivity,
      topPages,
      topProducts
    };

    return NextResponse.json(realTimeData);
  } catch (error) {
    console.error('Real-time analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
