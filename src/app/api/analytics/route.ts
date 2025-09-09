import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

// Analitik verileri getir
export const dynamic = 'force-dynamic';

// Server-side Supabase client
const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export async function GET(request: NextRequest) {
  try {
    // Supabase URL kontrolü
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Supabase konfigürasyonu eksik',
        data: {
          overview: {
            totalOrders: 0,
            totalRevenue: 0,
            totalCustomers: 0,
            averageOrderValue: 0
          },
          dailyOrders: [],
          topProducts: []
        }
      });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d, 1y
    const type = searchParams.get('type') || 'overview'; // overview, sales, products, customers

    const today = new Date();
    let startDate: Date;
    let endDate: Date = today;

    // Periyoda göre tarih aralığı belirle
    switch (period) {
      case '7d':
        startDate = subDays(today, 7);
        break;
      case '30d':
        startDate = subDays(today, 30);
        break;
      case '90d':
        startDate = subDays(today, 90);
        break;
      case '1y':
        startDate = subDays(today, 365);
        break;
      default:
        startDate = subDays(today, 7);
    }

    switch (type) {
      case 'overview':
        return await getOverviewAnalytics(startDate, endDate);
      case 'sales':
        return await getSalesAnalytics(startDate, endDate);
      case 'products':
        return await getProductAnalytics(startDate, endDate);
      case 'customers':
        return await getCustomerAnalytics(startDate, endDate);
      default:
        return await getOverviewAnalytics(startDate, endDate);
    }

  } catch (error) {
    console.error('Analitik API hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Genel bakış analitikleri
async function getOverviewAnalytics(startDate: Date, endDate: Date) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Veritabanı bağlantısı kurulamadı'
      }, { status: 500 });
    }
    
    // Toplam sipariş sayısı
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    // Toplam gelir
    const { data: revenueData } = await supabase
      .from('orders')
      .select('total_amount')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .eq('status', 'delivered');

    const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

    // Toplam müşteri sayısı
    const { data: usersData } = await supabase!.auth.admin.listUsers();
    const totalCustomers = usersData?.users?.length || 0;

    // Ortalama sipariş değeri
    const averageOrderValue = (totalOrders || 0) > 0 ? totalRevenue / (totalOrders || 1) : 0;

    // Günlük sipariş trendi
    const dailyOrders = await getDailyOrders(startDate, endDate);

    // En çok satan ürünler
    const topProducts = await getTopProducts(startDate, endDate);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalOrders: totalOrders || 0,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalCustomers: totalCustomers || 0,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100
        },
        dailyOrders,
        topProducts
      }
    });

  } catch (error) {
    console.error('Genel bakış analitik hatası:', error);
    throw error;
  }
}

// Satış analitikleri
async function getSalesAnalytics(startDate: Date, endDate: Date) {
  try {
    // Günlük satış trendi
    const dailySales = await getDailySales(startDate, endDate);

    // Haftalık satış trendi
    const weeklySales = await getWeeklySales(startDate, endDate);

    // Aylık satış trendi
    const monthlySales = await getMonthlySales(startDate, endDate);

    // Sipariş durumu dağılımı
    const orderStatusDistribution = await getOrderStatusDistribution(startDate, endDate);

    return NextResponse.json({
      success: true,
      data: {
        dailySales,
        weeklySales,
        monthlySales,
        orderStatusDistribution
      }
    });

  } catch (error) {
    console.error('Satış analitik hatası:', error);
    throw error;
  }
}

// Ürün analitikleri
async function getProductAnalytics(startDate: Date, endDate: Date) {
  try {
    // En çok satan ürünler
    const topProducts = await getTopProducts(startDate, endDate);

    // Kategori bazlı satışlar
    const categorySales = await getCategorySales(startDate, endDate);

    // Stok durumu
    const stockStatus = await getStockStatus();

    // Düşük stoklu ürünler
    const lowStockProducts = await getLowStockProducts();

    return NextResponse.json({
      success: true,
      data: {
        topProducts,
        categorySales,
        stockStatus,
        lowStockProducts
      }
    });

  } catch (error) {
    console.error('Ürün analitik hatası:', error);
    throw error;
  }
}

// Müşteri analitikleri
async function getCustomerAnalytics(startDate: Date, endDate: Date) {
  try {
    // Yeni müşteri kayıtları
    const newCustomers = await getNewCustomers(startDate, endDate);

    // Müşteri aktivite analizi
    const customerActivity = await getCustomerActivity(startDate, endDate);

    // En aktif müşteriler
    const topCustomers = await getTopCustomers(startDate, endDate);

    return NextResponse.json({
      success: true,
      data: {
        newCustomers,
        customerActivity,
        topCustomers
      }
    });

  } catch (error) {
    console.error('Müşteri analitik hatası:', error);
    throw error;
  }
}

// Yardımcı fonksiyonlar
async function getDailyOrders(startDate: Date, endDate: Date) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı kurulamadı'
    }, { status: 500 });
  }

  const { data } = await supabase
    .from('orders')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  const dailyCounts: { [key: string]: number } = {};
  
  data?.forEach(order => {
    const date = format(new Date(order.created_at), 'yyyy-MM-dd');
    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
  });

  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count
  }));
}

async function getDailySales(startDate: Date, endDate: Date) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı kurulamadı'
    }, { status: 500 });
  }

  const { data } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .eq('status', 'delivered');

  const dailySales: { [key: string]: number } = {};
  
  data?.forEach(order => {
    const date = format(new Date(order.created_at), 'yyyy-MM-dd');
    dailySales[date] = (dailySales[date] || 0) + order.total_amount;
  });

  return Object.entries(dailySales).map(([date, revenue]) => ({
    date,
    revenue: Math.round(revenue * 100) / 100
  }));
}

async function getWeeklySales(startDate: Date, endDate: Date) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı kurulamadı'
    }, { status: 500 });
  }

  const { data } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .eq('status', 'delivered');

  const weeklySales: { [key: string]: number } = {};
  
  data?.forEach(order => {
    const weekStart = startOfWeek(new Date(order.created_at));
    const weekKey = format(weekStart, 'yyyy-MM-dd');
    weeklySales[weekKey] = (weeklySales[weekKey] || 0) + order.total_amount;
  });

  return Object.entries(weeklySales).map(([week, revenue]) => ({
    week,
    revenue: Math.round(revenue * 100) / 100
  }));
}

async function getMonthlySales(startDate: Date, endDate: Date) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı kurulamadı'
    }, { status: 500 });
  }

  const { data } = await supabase
    .from('orders')
    .select('created_at, total_amount')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .eq('status', 'delivered');

  const monthlySales: { [key: string]: number } = {};
  
  data?.forEach(order => {
    const monthStart = startOfMonth(new Date(order.created_at));
    const monthKey = format(monthStart, 'yyyy-MM');
    monthlySales[monthKey] = (monthlySales[monthKey] || 0) + order.total_amount;
  });

  return Object.entries(monthlySales).map(([month, revenue]) => ({
    month,
    revenue: Math.round(revenue * 100) / 100
  }));
}

async function getOrderStatusDistribution(startDate: Date, endDate: Date) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı kurulamadı'
    }, { status: 500 });
  }

  const { data } = await supabase
    .from('orders')
    .select('status')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  const statusCounts: { [key: string]: number } = {};
  
  data?.forEach(order => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  });

  return Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count
  }));
}

async function getTopProducts(startDate: Date, endDate: Date) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı kurulamadı'
    }, { status: 500 });
  }

  const { data } = await supabase
    .from('orders')
    .select('items')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .eq('status', 'delivered');

  const productSales: { [key: string]: { title: string; quantity: number; revenue: number } } = {};
  
  data?.forEach(order => {
    order.items.forEach((item: any) => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = {
          title: item.title,
          quantity: 0,
          revenue: 0
        };
      }
      productSales[item.product_id].quantity += item.quantity;
      productSales[item.product_id].revenue += item.price * item.quantity;
    });
  });

  return Object.entries(productSales)
    .map(([id, data]) => ({
      id,
      title: data.title,
      quantity: data.quantity,
      revenue: Math.round(data.revenue * 100) / 100
    }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);
}

async function getCategorySales(startDate: Date, endDate: Date) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı kurulamadı'
    }, { status: 500 });
  }

  const { data } = await supabase
    .from('orders')
    .select('items')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .eq('status', 'delivered');

  const categorySales: { [key: string]: number } = {};
  
  data?.forEach(order => {
    order.items.forEach((item: any) => {
      // Ürün kategorisini al
      const category = item.category || 'Diğer';
      categorySales[category] = (categorySales[category] || 0) + (item.price * item.quantity);
    });
  });

  return Object.entries(categorySales).map(([category, revenue]) => ({
    category,
    revenue: Math.round(revenue * 100) / 100
  }));
}

async function getStockStatus() {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı kurulamadı'
    }, { status: 500 });
  }

  const { data } = await supabase
    .from('products')
    .select('stock');

  if (!data) return { inStock: 0, lowStock: 0, outOfStock: 0 };

  let inStock = 0, lowStock = 0, outOfStock = 0;

  data.forEach(product => {
    if (product.stock === 0) {
      outOfStock++;
    } else if (product.stock <= 5) {
      lowStock++;
    } else {
      inStock++;
    }
  });

  return { inStock, lowStock, outOfStock };
}

async function getLowStockProducts() {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı kurulamadı'
    }, { status: 500 });
  }

  const { data } = await supabase
    .from('products')
    .select('id, title, stock, price')
    .lte('stock', 5)
    .order('stock', { ascending: true })
    .limit(10);

  return data || [];
}

async function getNewCustomers(startDate: Date, endDate: Date) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı kurulamadı'
    }, { status: 500 });
  }
  
  const { data } = await supabase!.auth.admin.listUsers();
  
  const newCustomers = data.users.filter(user => {
    const createdAt = new Date(user.created_at);
    return createdAt >= startDate && createdAt <= endDate;
  });

  return newCustomers.length;
}

async function getCustomerActivity(startDate: Date, endDate: Date) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı kurulamadı'
    }, { status: 500 });
  }

  const { data } = await supabase
    .from('orders')
    .select('user_id, created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  const customerOrders: { [key: string]: number } = {};
  
  data?.forEach(order => {
    customerOrders[order.user_id] = (customerOrders[order.user_id] || 0) + 1;
  });

  const activityLevels = {
    active: 0,    // 3+ sipariş
    moderate: 0,  // 1-2 sipariş
    inactive: 0   // 0 sipariş
  };

  Object.values(customerOrders).forEach(orderCount => {
    if (orderCount >= 3) {
      activityLevels.active++;
    } else if (orderCount >= 1) {
      activityLevels.moderate++;
    }
  });

  return activityLevels;
}

async function getTopCustomers(startDate: Date, endDate: Date) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      success: false,
      error: 'Veritabanı bağlantısı kurulamadı'
    }, { status: 500 });
  }

  const { data } = await supabase
    .from('orders')
    .select('user_id, total_amount')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .eq('status', 'delivered');

  const customerSpending: { [key: string]: number } = {};
  
  data?.forEach(order => {
    customerSpending[order.user_id] = (customerSpending[order.user_id] || 0) + order.total_amount;
  });

  return Object.entries(customerSpending)
    .map(([userId, totalSpent]) => ({
      userId,
      totalSpent: Math.round(totalSpent * 100) / 100
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 10);
}
