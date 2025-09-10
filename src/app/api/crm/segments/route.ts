import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock customer segments data
    const segments = [
      {
        id: '1',
        name: 'VIP',
        description: 'En değerli müşteriler - yüksek harcama ve sadakat',
        criteria: { minSpent: 30000, minOrders: 20, loyalty: 'high' },
        customerCount: 15,
        averageValue: 45000,
        growthRate: 12.5,
        color: '#DC2626'
      },
      {
        id: '2',
        name: 'Premium',
        description: 'Yüksek değerli müşteriler - düzenli alışveriş yapanlar',
        criteria: { minSpent: 15000, minOrders: 10, loyalty: 'medium' },
        customerCount: 45,
        averageValue: 25000,
        growthRate: 8.2,
        color: '#EA580C'
      },
      {
        id: '3',
        name: 'Standard',
        description: 'Orta değerli müşteriler - ortalama alışveriş yapanlar',
        criteria: { minSpent: 5000, minOrders: 5, loyalty: 'medium' },
        customerCount: 120,
        averageValue: 12000,
        growthRate: 5.8,
        color: '#059669'
      },
      {
        id: '4',
        name: 'Basic',
        description: 'Düşük değerli müşteriler - az alışveriş yapanlar',
        criteria: { minSpent: 1000, minOrders: 1, loyalty: 'low' },
        customerCount: 200,
        averageValue: 3500,
        growthRate: 2.1,
        color: '#6B7280'
      },
      {
        id: '5',
        name: 'At Risk',
        description: 'Risk altındaki müşteriler - uzun süre alışveriş yapmayanlar',
        criteria: { lastOrderDays: 60, churnRisk: 'high' },
        customerCount: 35,
        averageValue: 8000,
        growthRate: -15.2,
        color: '#F59E0B'
      },
      {
        id: '6',
        name: 'New',
        description: 'Yeni müşteriler - son 30 gün içinde kayıt olanlar',
        criteria: { registrationDays: 30, maxOrders: 3 },
        customerCount: 85,
        averageValue: 2500,
        growthRate: 25.8,
        color: '#8B5CF6'
      }
    ];

    return NextResponse.json(segments);

  } catch (error) {
    console.error('CRM segments error:', error);
    return NextResponse.json(
      { error: 'Müşteri segmentleri alınamadı' },
      { status: 500 }
    );
  }
}
