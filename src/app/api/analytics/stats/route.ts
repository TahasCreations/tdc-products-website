import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Analitik istatistiklerini hesapla
    const stats = {
      totalVisitors: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      bounceRate: 0,
      averageSessionDuration: 0,
      conversionRate: 0,
      topPages: [
        { page: '/', views: 0 },
        { page: '/products', views: 0 },
        { page: '/about', views: 0 },
        { page: '/contact', views: 0 }
      ],
      trafficSources: {
        'Direct': 0,
        'Google': 0,
        'Facebook': 0,
        'Instagram': 0,
        'LinkedIn': 0,
        'Email': 0,
        'Diğer': 0
      },
      deviceStats: {
        'Desktop': 0,
        'Mobile': 0,
        'Tablet': 0
      },
      countryStats: {
        'Türkiye': 0,
        'Almanya': 0,
        'Fransa': 0,
        'İngiltere': 0,
        'Diğer': 0
      }
    };

    if (supabase) {
      // Gerçek verilerden hesapla
      const [sessionsResult, pageViewsResult] = await Promise.all([
        supabase.from('analytics_sessions').select('id, visitor_id, duration, source, device, country, created_at'),
        supabase.from('analytics_page_views').select('id, page, session_id, created_at')
      ]);

      const sessions = sessionsResult.data || [];
      const pageViews = pageViewsResult.data || [];

      // Ziyaretçi istatistikleri
      stats.totalVisitors = sessions.length;
      stats.uniqueVisitors = new Set(sessions.map(s => s.visitor_id)).size;
      stats.pageViews = pageViews.length;

      // Bounce rate (1 sayfa görüntüleyen oturumlar)
      const singlePageSessions = sessions.filter(session => {
        const sessionPageViews = pageViews.filter(pv => pv.session_id === session.id);
        return sessionPageViews.length === 1;
      }).length;
      stats.bounceRate = sessions.length > 0 ? (singlePageSessions / sessions.length) * 100 : 0;

      // Ortalama oturum süresi
      const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
      stats.averageSessionDuration = sessions.length > 0 ? totalDuration / sessions.length : 0;

      // Dönüşüm oranı (basit hesaplama)
      const conversions = sessions.filter(session => session.duration > 300).length; // 5 dakikadan uzun oturumlar
      stats.conversionRate = sessions.length > 0 ? (conversions / sessions.length) * 100 : 0;

      // En popüler sayfalar
      const pageViewCounts = pageViews.reduce((acc, pv) => {
        acc[pv.page] = (acc[pv.page] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      stats.topPages = Object.entries(pageViewCounts)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 4);

      // Trafik kaynakları
      sessions.forEach(session => {
        const source = session.source || 'Diğer';
        if (stats.trafficSources[source as keyof typeof stats.trafficSources] !== undefined) {
          stats.trafficSources[source as keyof typeof stats.trafficSources]++;
        } else {
          stats.trafficSources['Diğer']++;
        }
      });

      // Cihaz istatistikleri
      sessions.forEach(session => {
        const device = session.device || 'Desktop';
        if (stats.deviceStats[device as keyof typeof stats.deviceStats] !== undefined) {
          stats.deviceStats[device as keyof typeof stats.deviceStats]++;
        }
      });

      // Ülke istatistikleri
      sessions.forEach(session => {
        const country = session.country || 'Diğer';
        if (stats.countryStats[country as keyof typeof stats.countryStats] !== undefined) {
          stats.countryStats[country as keyof typeof stats.countryStats]++;
        } else {
          stats.countryStats['Diğer']++;
        }
      });

    } else {
      // Fallback: Mock data
      stats.totalVisitors = 15420;
      stats.uniqueVisitors = 12350;
      stats.pageViews = 45680;
      stats.bounceRate = 35.2;
      stats.averageSessionDuration = 180; // 3 dakika
      stats.conversionRate = 2.8;
      stats.topPages = [
        { page: '/', views: 12500 },
        { page: '/products', views: 8900 },
        { page: '/about', views: 3200 },
        { page: '/contact', views: 1800 }
      ];
      stats.trafficSources = {
        'Direct': 4500,
        'Google': 3800,
        'Facebook': 2200,
        'Instagram': 1800,
        'LinkedIn': 900,
        'Email': 1200,
        'Diğer': 1020
      };
      stats.deviceStats = {
        'Desktop': 8500,
        'Mobile': 6200,
        'Tablet': 720
      };
      stats.countryStats = {
        'Türkiye': 12000,
        'Almanya': 1500,
        'Fransa': 800,
        'İngiltere': 600,
        'Diğer': 520
      };
    }

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Analytics stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch analytics statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
