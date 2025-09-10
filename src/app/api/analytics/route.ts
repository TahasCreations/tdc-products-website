import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  // URL formatını kontrol et
  if (supabaseUrl.includes('your_supabase_project_url') || 
      supabaseUrl === 'your_supabase_project_url/' ||
      supabaseUrl === 'your_supabase_project_url' ||
      !supabaseUrl.startsWith('https://')) {
    console.error('Supabase URL is not configured properly:', supabaseUrl);
    return null;
  }
  
  try {
    return createClient(supabaseUrl, supabaseServiceKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};

// Default analytics data for offline mode
const getDefaultAnalyticsData = () => {
  const totalUsers = 1250;
  const totalOrders = 890;
  const totalRevenue = 125000;
  const totalProducts = 45;

  return {
    totalUsers,
    totalOrders,
    totalRevenue,
    totalProducts,
    monthlyRevenue: [
      { month: 'Oca 2024', revenue: 8500 },
      { month: 'Şub 2024', revenue: 9200 },
      { month: 'Mar 2024', revenue: 10800 },
      { month: 'Nis 2024', revenue: 11500 },
      { month: 'May 2024', revenue: 13200 },
      { month: 'Haz 2024', revenue: 12800 },
      { month: 'Tem 2024', revenue: 14200 },
      { month: 'Ağu 2024', revenue: 13800 },
      { month: 'Eyl 2024', revenue: 15200 },
      { month: 'Eki 2024', revenue: 16800 },
      { month: 'Kas 2024', revenue: 17500 },
      { month: 'Ara 2024', revenue: 18900 }
    ],
    topProducts: [
      { name: 'Naruto Uzumaki Figürü', sales: 150, revenue: 45000 },
      { name: 'Goku Super Saiyan Figürü', sales: 120, revenue: 42000 },
      { name: 'Mario Bros Figürü', sales: 100, revenue: 20000 },
      { name: 'Pikachu Figürü', sales: 80, revenue: 16000 },
      { name: 'Sonic Figürü', sales: 60, revenue: 12000 }
    ],
    userGrowth: [
      { month: 'Oca 2024', users: 85 },
      { month: 'Şub 2024', users: 92 },
      { month: 'Mar 2024', users: 108 },
      { month: 'Nis 2024', users: 115 },
      { month: 'May 2024', users: 132 },
      { month: 'Haz 2024', users: 128 },
      { month: 'Tem 2024', users: 142 },
      { month: 'Ağu 2024', users: 138 },
      { month: 'Eyl 2024', users: 152 },
      { month: 'Eki 2024', users: 168 },
      { month: 'Kas 2024', users: 175 },
      { month: 'Ara 2024', users: 189 }
    ],
    orderStatusDistribution: [
      { status: 'Tamamlandı', count: 623 },
      { status: 'Beklemede', count: 134 },
      { status: 'İptal Edildi', count: 89 },
      { status: 'İade Edildi', count: 44 }
    ],
    revenueByCategory: [
      { category: 'Anime', revenue: 50000 },
      { category: 'Gaming', revenue: 37500 },
      { category: 'Film', revenue: 25000 },
      { category: 'Çizgi Film', revenue: 12500 }
    ],
    averageOrderValue: 140.45,
    conversionRate: 71.2,
    bounceRate: 28.5,
    pageViews: 5625,
    uniqueVisitors: 1250,
    sessionDuration: 4.2,
    topPages: [
      { page: 'Ana Sayfa', views: 1688 },
      { page: 'Ürünler', views: 1406 },
      { page: 'Ürün Detay', views: 1125 },
      { page: 'Sepet', views: 844 },
      { page: 'Blog', views: 562 }
    ],
    trafficSources: [
      { source: 'Google', visitors: 500, percentage: 40 },
      { source: 'Direkt', visitors: 313, percentage: 25 },
      { source: 'Sosyal Medya', visitors: 250, percentage: 20 },
      { source: 'E-posta', visitors: 125, percentage: 10 },
      { source: 'Diğer', visitors: 62, percentage: 5 }
    ],
    deviceTypes: [
      { device: 'Mobil', percentage: 65 },
      { device: 'Desktop', percentage: 30 },
      { device: 'Tablet', percentage: 5 }
    ],
    geographicData: [
      { country: 'Türkiye', visitors: 1000 },
      { country: 'Almanya', visitors: 125 },
      { country: 'Fransa', visitors: 63 },
      { country: 'İngiltere', visitors: 38 },
      { country: 'Diğer', visitors: 24 }
    ]
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    const metric = searchParams.get('metric') || 'revenue';

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        data: getDefaultAnalyticsData(),
        message: 'Demo analytics data (offline mode)'
      });
    }

    // Tarih aralığını hesapla
    const now = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Temel istatistikler
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, created_at');

    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at');

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price');

    if (usersError || ordersError || productsError) {
      console.error('Analytics fetch error:', { usersError, ordersError, productsError });
      return NextResponse.json({
        success: true,
        data: getDefaultAnalyticsData(),
        message: 'Demo analytics data (fallback mode)'
      });
    }

    // Toplam değerler
    const totalUsers = users?.length || 0;
    const totalOrders = orders?.length || 0;
    const totalProducts = products?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

    // Aylık gelir trendi (son 12 ay)
    const monthlyRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthOrders = orders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= monthStart && orderDate <= monthEnd;
      }) || [];

      const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      
      monthlyRevenue.push({
        month: date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue
      });
    }

    // En çok satan ürünler (örnek veri)
    const topProducts = [
      { name: 'Ürün A', sales: 150, revenue: 15000 },
      { name: 'Ürün B', sales: 120, revenue: 12000 },
      { name: 'Ürün C', sales: 100, revenue: 10000 },
      { name: 'Ürün D', sales: 80, revenue: 8000 },
      { name: 'Ürün E', sales: 60, revenue: 6000 }
    ];

    // Kullanıcı büyümesi (son 12 ay)
    const userGrowth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthUsers = users?.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate >= monthStart && userDate <= monthEnd;
      }) || [];

      userGrowth.push({
        month: date.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
        users: monthUsers.length
      });
    }

    // Sipariş durumu dağılımı
    const orderStatusDistribution = [
      { status: 'Tamamlandı', count: Math.floor(totalOrders * 0.7) },
      { status: 'Beklemede', count: Math.floor(totalOrders * 0.15) },
      { status: 'İptal Edildi', count: Math.floor(totalOrders * 0.1) },
      { status: 'İade Edildi', count: Math.floor(totalOrders * 0.05) }
    ];

    // Kategoriye göre gelir (örnek veri)
    const revenueByCategory = [
      { category: 'Elektronik', revenue: totalRevenue * 0.4 },
      { category: 'Giyim', revenue: totalRevenue * 0.3 },
      { category: 'Ev & Yaşam', revenue: totalRevenue * 0.2 },
      { category: 'Spor', revenue: totalRevenue * 0.1 }
    ];

    // Performans metrikleri
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;
    const bounceRate = 35.2; // Örnek değer
    const pageViews = totalUsers * 4.5; // Örnek değer
    const uniqueVisitors = totalUsers;
    const sessionDuration = 3.2; // dakika

    // En çok görüntülenen sayfalar (örnek veri)
    const topPages = [
      { page: 'Ana Sayfa', views: Math.floor(pageViews * 0.3) },
      { page: 'Ürünler', views: Math.floor(pageViews * 0.25) },
      { page: 'Ürün Detay', views: Math.floor(pageViews * 0.2) },
      { page: 'Sepet', views: Math.floor(pageViews * 0.15) },
      { page: 'Hakkımızda', views: Math.floor(pageViews * 0.1) }
    ];

    // Trafik kaynakları (örnek veri)
    const trafficSources = [
      { source: 'Google', visitors: Math.floor(uniqueVisitors * 0.4), percentage: 40 },
      { source: 'Direkt', visitors: Math.floor(uniqueVisitors * 0.25), percentage: 25 },
      { source: 'Sosyal Medya', visitors: Math.floor(uniqueVisitors * 0.2), percentage: 20 },
      { source: 'E-posta', visitors: Math.floor(uniqueVisitors * 0.1), percentage: 10 },
      { source: 'Diğer', visitors: Math.floor(uniqueVisitors * 0.05), percentage: 5 }
    ];

    // Cihaz türleri (örnek veri)
    const deviceTypes = [
      { device: 'Mobil', percentage: 65 },
      { device: 'Desktop', percentage: 30 },
      { device: 'Tablet', percentage: 5 }
    ];

    // Coğrafi dağılım (örnek veri)
    const geographicData = [
      { country: 'Türkiye', visitors: Math.floor(uniqueVisitors * 0.8) },
      { country: 'Almanya', visitors: Math.floor(uniqueVisitors * 0.1) },
      { country: 'Fransa', visitors: Math.floor(uniqueVisitors * 0.05) },
      { country: 'İngiltere', visitors: Math.floor(uniqueVisitors * 0.03) },
      { country: 'Diğer', visitors: Math.floor(uniqueVisitors * 0.02) }
    ];

    const analyticsData = {
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
      monthlyRevenue,
      topProducts,
      userGrowth,
      orderStatusDistribution,
      revenueByCategory,
      averageOrderValue,
      conversionRate,
      bounceRate,
      pageViews,
      uniqueVisitors,
      sessionDuration,
      topPages,
      trafficSources,
      deviceTypes,
      geographicData
    };

    return NextResponse.json({
      success: true,
      data: analyticsData
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({
      success: true,
      data: getDefaultAnalyticsData(),
      message: 'Demo analytics data (error fallback)'
    });
  }
}