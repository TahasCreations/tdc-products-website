import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // E-ticaret istatistiklerini hesapla
    const stats = {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalCustomers: 0,
      conversionRate: 0,
      averageOrderValue: 0,
      monthlyGrowth: 0,
      topSellingCategory: 'Elektronik'
    };

    if (supabase) {
      // Gerçek verilerden hesapla
      const [productsResult, ordersResult, customersResult] = await Promise.all([
        supabase.from('products').select('id, price, category_id, created_at'),
        supabase.from('orders').select('id, total_amount, created_at, status'),
        supabase.from('customers').select('id, created_at')
      ]);

      // Ürün sayısı
      stats.totalProducts = productsResult.data?.length || 0;

      // Sipariş sayısı ve toplam gelir
      const orders = ordersResult.data || [];
      stats.totalOrders = orders.length;
      stats.totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      // Müşteri sayısı
      stats.totalCustomers = customersResult.data?.length || 0;

      // Ortalama sipariş değeri
      stats.averageOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

      // Dönüşüm oranı (basit hesaplama)
      stats.conversionRate = stats.totalCustomers > 0 ? (stats.totalOrders / stats.totalCustomers) * 100 : 0;

      // Aylık büyüme (basit hesaplama)
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const lastMonth = new Date(thisMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const thisMonthOrders = orders.filter(order => 
        new Date(order.created_at) >= thisMonth
      );
      const lastMonthOrders = orders.filter(order => 
        new Date(order.created_at) >= lastMonth && new Date(order.created_at) < thisMonth
      );

      const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      stats.monthlyGrowth = lastMonthRevenue > 0 ? 
        ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    } else {
      // Fallback: Mock data
      stats.totalRevenue = 125000;
      stats.totalOrders = 342;
      stats.totalProducts = 156;
      stats.totalCustomers = 89;
      stats.conversionRate = 3.8;
      stats.averageOrderValue = 365.50;
      stats.monthlyGrowth = 12.5;
    }

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('E-commerce stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch e-commerce statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
