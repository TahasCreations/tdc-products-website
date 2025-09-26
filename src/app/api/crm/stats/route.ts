import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // CRM istatistiklerini hesapla
    const stats = {
      totalCustomers: 0,
      activeCustomers: 0,
      vipCustomers: 0,
      newCustomers: 0,
      totalRevenue: 0,
      tierDistribution: {
        'Bronze': 0,
        'Silver': 0,
        'Gold': 0,
        'Platinum': 0
      }
    };

    if (supabase) {
      // Gerçek verilerden hesapla
      const [customersResult, ordersResult] = await Promise.all([
        supabase.from('customers').select('id, customer_tier, created_at, customer_status'),
        supabase.from('orders').select('total_amount, customer_id, created_at')
      ]);

      const customers = customersResult.data || [];
      const orders = ordersResult.data || [];

      // Müşteri istatistikleri
      stats.totalCustomers = customers.length;
      stats.activeCustomers = customers.filter(c => c.customer_status === 'active').length;
      stats.vipCustomers = customers.filter(c => c.customer_tier === 'Platinum').length;

      // Son 30 gün içindeki yeni müşteriler
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      stats.newCustomers = customers.filter(c => 
        new Date(c.created_at) >= thirtyDaysAgo
      ).length;

      // Toplam gelir
      stats.totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      // Tier dağılımı
      customers.forEach(customer => {
        const tier = customer.customer_tier || 'Bronze';
        if (stats.tierDistribution[tier as keyof typeof stats.tierDistribution] !== undefined) {
          stats.tierDistribution[tier as keyof typeof stats.tierDistribution]++;
        }
      });

    } else {
      // Fallback: Mock data
      stats.totalCustomers = 89;
      stats.activeCustomers = 67;
      stats.vipCustomers = 12;
      stats.newCustomers = 8;
      stats.totalRevenue = 125000;
      stats.tierDistribution = {
        'Bronze': 45,
        'Silver': 28,
        'Gold': 12,
        'Platinum': 4
      };
    }

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('CRM stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch CRM statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
