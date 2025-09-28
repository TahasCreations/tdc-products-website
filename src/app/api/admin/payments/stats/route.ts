import { NextResponse } from 'next/server';
import { supabase } from '../../../../../../lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabase) {
      // Mock data fallback
      const mockStats = {
        totalPayments: 1247,
        totalAmount: 245678.50,
        successRate: 94.2,
        averageProcessingTime: 1250,
        methodBreakdown: {
          'credit_card': 856,
          'bank_transfer': 234,
          'crypto': 89,
          'mobile_payment': 68
        },
        dailyStats: [
          { date: '2024-01-20', count: 45, amount: 8923.50 },
          { date: '2024-01-19', count: 52, amount: 10234.75 },
          { date: '2024-01-18', count: 38, amount: 7654.25 },
          { date: '2024-01-17', count: 61, amount: 12345.80 },
          { date: '2024-01-16', count: 43, amount: 8765.40 },
          { date: '2024-01-15', count: 55, amount: 9876.30 },
          { date: '2024-01-14', count: 47, amount: 8345.20 }
        ]
      };

      return NextResponse.json({
        success: true,
        stats: mockStats
      });
    }

    // Supabase'den gerçek veri çek
    const { data: payments, error } = await supabase
      .from('advanced_payments')
      .select('*')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }

    // İstatistikleri hesapla
    const totalPayments = payments?.length || 0;
    const totalAmount = payments?.reduce((sum, payment) => sum + (payment.total_amount || 0), 0) || 0;
    const successfulPayments = payments?.filter(p => p.status === 'completed').length || 0;
    const successRate = totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0;
    const averageProcessingTime = payments?.reduce((sum, payment) => sum + (payment.processing_time || 0), 0) / totalPayments || 0;

    // Ödeme yöntemi dağılımı
    const methodBreakdown = payments?.reduce((acc, payment) => {
      acc[payment.payment_method] = (acc[payment.payment_method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Günlük istatistikler
    const dailyStats = payments?.reduce((acc, payment) => {
      const date = payment.created_at.split('T')[0];
      const existing = acc.find(d => d.date === date);
      if (existing) {
        existing.count += 1;
        existing.amount += payment.total_amount || 0;
      } else {
        acc.push({
          date,
          count: 1,
          amount: payment.total_amount || 0
        });
      }
      return acc;
    }, [] as Array<{ date: string; count: number; amount: number }>) || [];

    const stats = {
      totalPayments,
      totalAmount,
      successRate,
      averageProcessingTime,
      methodBreakdown,
      dailyStats: dailyStats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 7)
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Payment stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch payment statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
