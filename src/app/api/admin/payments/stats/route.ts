import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  successRate: number;
  averageProcessingTime: number;
  methodBreakdown: Record<string, number>;
  dailyStats: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  fraudStats: {
    totalFraudAttempts: number;
    fraudRate: number;
    blockedPayments: number;
  };
  installmentStats: {
    totalInstallmentPayments: number;
    averageInstallments: number;
    totalInterestEarned: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30d';
    
    // Tarih aralığını hesapla
    const endDate = new Date();
    const startDate = new Date();
    
    switch (dateRange) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Temel istatistikler
    const { data: basicStats, error: basicError } = await supabase
      .from('advanced_payments')
      .select('amount, total_amount, status, payment_method, processing_time, created_at, installment_data')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (basicError) {
      console.error('Basic stats error:', basicError);
      return NextResponse.json({ error: 'Failed to fetch basic stats' }, { status: 500 });
    }

    // İstatistikleri hesapla
    const totalPayments = basicStats.length;
    const totalAmount = basicStats.reduce((sum, payment) => sum + payment.total_amount, 0);
    const successfulPayments = basicStats.filter(p => p.status === 'completed').length;
    const successRate = totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0;
    
    const processingTimes = basicStats
      .filter(p => p.processing_time)
      .map(p => p.processing_time);
    const averageProcessingTime = processingTimes.length > 0 
      ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length 
      : 0;

    // Ödeme yöntemi dağılımı
    const methodBreakdown: Record<string, number> = {};
    basicStats.forEach(payment => {
      methodBreakdown[payment.payment_method] = (methodBreakdown[payment.payment_method] || 0) + 1;
    });

    // Günlük istatistikler
    const dailyStatsMap: Record<string, { count: number; amount: number }> = {};
    basicStats.forEach(payment => {
      const date = new Date(payment.created_at).toISOString().split('T')[0];
      if (!dailyStatsMap[date]) {
        dailyStatsMap[date] = { count: 0, amount: 0 };
      }
      dailyStatsMap[date].count += 1;
      dailyStatsMap[date].amount += payment.total_amount;
    });

    const dailyStats = Object.entries(dailyStatsMap)
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Fraud istatistikleri
    const { data: fraudStats, error: fraudError } = await supabase
      .from('fraud_detection_logs')
      .select('risk_score, action_taken')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const totalFraudAttempts = fraudStats?.length || 0;
    const fraudRate = totalPayments > 0 ? (totalFraudAttempts / totalPayments) * 100 : 0;
    const blockedPayments = fraudStats?.filter(f => f.action_taken === 'rejected').length || 0;

    // Taksit istatistikleri
    const installmentPayments = basicStats.filter(p => p.installment_data);
    const totalInstallmentPayments = installmentPayments.length;
    
    const totalInstallments = installmentPayments.reduce((sum, payment) => {
      const installments = payment.installment_data?.installments || 1;
      return sum + installments;
    }, 0);
    
    const averageInstallments = totalInstallmentPayments > 0 
      ? totalInstallments / totalInstallmentPayments 
      : 0;

    const totalInterestEarned = installmentPayments.reduce((sum, payment) => {
      const interestRate = payment.installment_data?.interestRate || 0;
      const amount = payment.amount;
      return sum + (amount * interestRate);
    }, 0);

    // Komisyon istatistikleri
    const totalFees = basicStats.reduce((sum, payment) => sum + ((payment as any).fees || 0), 0);
    const averageFee = totalPayments > 0 ? totalFees / totalPayments : 0;

    // Saatlik dağılım
    const hourlyStats: Record<number, number> = {};
    basicStats.forEach(payment => {
      const hour = new Date(payment.created_at).getHours();
      hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
    });

    // Haftalık dağılım
    const weeklyStats: Record<string, number> = {};
    basicStats.forEach(payment => {
      const date = new Date(payment.created_at);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      weeklyStats[weekKey] = (weeklyStats[weekKey] || 0) + 1;
    });

    // Ödeme yöntemi başarı oranları
    const methodSuccessRates: Record<string, number> = {};
    Object.keys(methodBreakdown).forEach(method => {
      const methodPayments = basicStats.filter(p => p.payment_method === method);
      const methodSuccessful = methodPayments.filter(p => p.status === 'completed').length;
      methodSuccessRates[method] = methodPayments.length > 0 
        ? (methodSuccessful / methodPayments.length) * 100 
        : 0;
    });

    // Ortalama ödeme tutarları
    const methodAverageAmounts: Record<string, number> = {};
    Object.keys(methodBreakdown).forEach(method => {
      const methodPayments = basicStats.filter(p => p.payment_method === method);
      const totalMethodAmount = methodPayments.reduce((sum, p) => sum + p.total_amount, 0);
      methodAverageAmounts[method] = methodPayments.length > 0 
        ? totalMethodAmount / methodPayments.length 
        : 0;
    });

    const stats: PaymentStats = {
      totalPayments,
      totalAmount,
      successRate,
      averageProcessingTime,
      methodBreakdown,
      dailyStats,
      fraudStats: {
        totalFraudAttempts,
        fraudRate,
        blockedPayments
      },
      installmentStats: {
        totalInstallmentPayments,
        averageInstallments,
        totalInterestEarned
      }
    };

    // Ek istatistikler
    const extendedStats = {
      ...stats,
      totalFees,
      averageFee,
      hourlyStats,
      weeklyStats,
      methodSuccessRates,
      methodAverageAmounts,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    };

    return NextResponse.json({ 
      success: true, 
      stats: extendedStats 
    });

  } catch (error) {
    console.error('Payment stats error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch payment statistics' 
    }, { status: 500 });
  }
}

// Real-time istatistikler için WebSocket endpoint
export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const body = await request.json();
    const { type, filters } = body;

    switch (type) {
      case 'realtime':
        // Son 1 saatteki ödemeler
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        const { data: recentPayments, error: recentError } = await supabase
          .from('advanced_payments')
          .select('*')
          .gte('created_at', oneHourAgo.toISOString())
          .order('created_at', { ascending: false });

        if (recentError) {
          return NextResponse.json({ error: recentError.message }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          realtimeStats: {
            recentPayments: recentPayments.length,
            recentAmount: recentPayments.reduce((sum, p) => sum + p.total_amount, 0),
            lastPayment: recentPayments[0] || null,
            hourlyTrend: recentPayments.length
          }
        });

      case 'alerts':
        // Ödeme uyarıları
        const { data: failedPayments, error: failedError } = await supabase
          .from('advanced_payments')
          .select('*')
          .eq('status', 'failed')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        const { data: fraudAlerts, error: fraudError } = await supabase
          .from('fraud_detection_logs')
          .select('*')
          .eq('action_taken', 'rejected')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

        return NextResponse.json({
          success: true,
          alerts: {
            failedPayments: failedPayments?.length || 0,
            fraudAlerts: fraudAlerts?.length || 0,
            highRiskPayments: fraudAlerts?.filter(f => f.risk_score > 0.8).length || 0
          }
        });

      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }

  } catch (error) {
    console.error('Real-time stats error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch real-time statistics' 
    }, { status: 500 });
  }
}
