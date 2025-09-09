import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    const companyId = searchParams.get('companyId') || '550e8400-e29b-41d4-a716-446655440000';

    // KDV özeti için fatura verilerini getir
    const { data: invoiceData, error: invoiceError } = await supabase!
      .from('invoices')
      .select('kdvsum, tax_amount, total_amount, date')
      .eq('company_id', companyId)
      .gte('date', startDate)
      .lte('date', endDate)
      .not('kdvsum', 'is', null);

    if (invoiceError) {
      throw invoiceError;
    }

    // KDV oranlarına göre grupla
    const kdvRates: { [key: string]: number } = {
      '1': 0,
      '10': 0,
      '20': 0
    };

    let totalKdv = 0;

    invoiceData?.forEach(invoice => {
      const kdvAmount = parseFloat(invoice.kdvsum) || 0;
      totalKdv += kdvAmount;

      // KDV oranını tahmin et (gerçek uygulamada fatura satırlarından alınmalı)
      if (kdvAmount > 0) {
        const baseAmount = parseFloat(invoice.total_amount) - kdvAmount;
        const estimatedRate = Math.round((kdvAmount / baseAmount) * 100);
        
        if (estimatedRate <= 1) {
          kdvRates['1'] += kdvAmount;
        } else if (estimatedRate <= 10) {
          kdvRates['10'] += kdvAmount;
        } else {
          kdvRates['20'] += kdvAmount;
        }
      }
    });

    // KDV hesaplarından da KDV toplamını al
    const { data: kdvAccountData, error: kdvAccountError } = await supabase!
      .from('journal_lines')
      .select(`
        debit,
        credit,
        accounts (
          code,
          name
        )
      `)
      .eq('accounts.code', '391') // KDV hesabı
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    if (!kdvAccountError && kdvAccountData) {
      const kdvAccountTotal = kdvAccountData.reduce((sum, line) => {
        return sum + (line.debit || 0) - (line.credit || 0);
      }, 0);
      
      if (kdvAccountTotal > 0) {
        totalKdv += kdvAccountTotal;
      }
    }

    const kdvSummary = {
      totalKdv,
      kdvRates,
      invoiceCount: invoiceData?.length || 0,
      period: {
        startDate,
        endDate
      }
    };

    return NextResponse.json(kdvSummary);

  } catch (error) {
    console.error('KDV Summary error:', error);
    return NextResponse.json(
      { error: 'KDV özeti oluşturulamadı' },
      { status: 500 }
    );
  }
}
