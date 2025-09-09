import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    const metric = searchParams.get('metric') || 'revenue';

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
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
        success: false, 
        error: 'Analitik veriler alınamadı' 
      }, { status: 500 });
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
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}