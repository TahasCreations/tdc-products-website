import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Muhasebe istatistiklerini hesapla
    const stats = {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      pendingInvoices: 0,
      overdueInvoices: 0,
      monthlyGrowth: 0,
      quarterlyGrowth: 0
    };

    if (supabase) {
      // Gerçek verilerden hesapla
      const [invoicesResult, expensesResult] = await Promise.all([
        supabase.from('invoices').select('total_amount, status, due_date, created_at'),
        supabase.from('expenses').select('amount, created_at')
      ]);

      const invoices = invoicesResult.data || [];
      const expenses = expensesResult.data || [];

      // Toplam gelir (ödendi olarak işaretlenmiş faturalar)
      stats.totalRevenue = invoices
        .filter(invoice => invoice.status === 'paid')
        .reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);

      // Toplam gider
      stats.totalExpenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

      // Net kar
      stats.netProfit = stats.totalRevenue - stats.totalExpenses;

      // Bekleyen faturalar
      stats.pendingInvoices = invoices.filter(invoice => 
        invoice.status === 'sent' || invoice.status === 'draft'
      ).length;

      // Vadesi geçmiş faturalar
      const today = new Date();
      stats.overdueInvoices = invoices.filter(invoice => 
        invoice.status === 'sent' && 
        invoice.due_date && 
        new Date(invoice.due_date) < today
      ).length;

      // Aylık büyüme hesaplama
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const lastMonth = new Date(thisMonth);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const thisMonthRevenue = invoices
        .filter(invoice => 
          invoice.status === 'paid' && 
          new Date(invoice.created_at) >= thisMonth
        )
        .reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);

      const lastMonthRevenue = invoices
        .filter(invoice => 
          invoice.status === 'paid' && 
          new Date(invoice.created_at) >= lastMonth && 
          new Date(invoice.created_at) < thisMonth
        )
        .reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);

      stats.monthlyGrowth = lastMonthRevenue > 0 ? 
        ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

      // Çeyreklik büyüme hesaplama
      const thisQuarter = new Date();
      thisQuarter.setMonth(Math.floor(thisQuarter.getMonth() / 3) * 3, 1);
      const lastQuarter = new Date(thisQuarter);
      lastQuarter.setMonth(lastQuarter.getMonth() - 3);

      const thisQuarterRevenue = invoices
        .filter(invoice => 
          invoice.status === 'paid' && 
          new Date(invoice.created_at) >= thisQuarter
        )
        .reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);

      const lastQuarterRevenue = invoices
        .filter(invoice => 
          invoice.status === 'paid' && 
          new Date(invoice.created_at) >= lastQuarter && 
          new Date(invoice.created_at) < thisQuarter
        )
        .reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);

      stats.quarterlyGrowth = lastQuarterRevenue > 0 ? 
        ((thisQuarterRevenue - lastQuarterRevenue) / lastQuarterRevenue) * 100 : 0;

    } else {
      // Fallback: Mock data
      stats.totalRevenue = 125000;
      stats.totalExpenses = 75000;
      stats.netProfit = 50000;
      stats.pendingInvoices = 12;
      stats.overdueInvoices = 3;
      stats.monthlyGrowth = 8.5;
      stats.quarterlyGrowth = 15.2;
    }

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Accounting stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch accounting statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
