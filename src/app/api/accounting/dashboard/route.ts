import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Dashboard verilerini paralel olarak çek
    const [
      accountsResult,
      journalEntriesResult,
      invoicesResult,
      contactsResult,
      recentJournalEntriesResult,
      kdvResult
    ] = await Promise.all([
      // Toplam hesap sayısı
      supabase!!
        .from('accounts')
        .select('id', { count: 'exact' })
        .eq('is_active', true),
      
      // Toplam yevmiye fişi sayısı
      supabase!
        .from('journal_entries')
        .select('id', { count: 'exact' }),
      
      // Toplam fatura sayısı
      supabase!
        .from('invoices')
        .select('id', { count: 'exact' }),
      
      // Toplam cari hesap sayısı
      supabase!
        .from('contacts')
        .select('id', { count: 'exact' })
        .eq('is_active', true),
      
      // Son 5 yevmiye fişi
      supabase!
        .from('journal_entries')
        .select('id, no, description, date, status, total_debit, total_credit')
        .order('created_at', { ascending: false })
        .limit(5),
      
      // KDV özeti
      supabase!
        .from('invoices')
        .select('kdvsum')
        .not('kdvsum', 'is', null)
    ]);

    // Hata kontrolü
    if (accountsResult.error) throw accountsResult.error;
    if (journalEntriesResult.error) throw journalEntriesResult.error;
    if (invoicesResult.error) throw invoicesResult.error;
    if (contactsResult.error) throw contactsResult.error;
    if (recentJournalEntriesResult.error) throw recentJournalEntriesResult.error;
    if (kdvResult.error) throw kdvResult.error;

    // KDV hesaplama
    const totalKdv = kdvResult.data?.reduce((sum, invoice) => {
      return sum + (parseFloat(invoice.kdvsum) || 0);
    }, 0) || 0;

    // KDV oranları (örnek - gerçek uygulamada daha detaylı hesaplama yapılabilir)
    const kdvRates = {
      '1': totalKdv * 0.05, // %1 KDV
      '10': totalKdv * 0.5,  // %10 KDV
      '20': totalKdv * 0.45  // %20 KDV
    };

    const dashboardData = {
      totalAccounts: accountsResult.count || 0,
      totalJournalEntries: journalEntriesResult.count || 0,
      totalInvoices: invoicesResult.count || 0,
      totalContacts: contactsResult.count || 0,
      recentJournalEntries: recentJournalEntriesResult.data || [],
      kdvSummary: {
        totalKdv,
        kdvRates
      }
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Dashboard verileri alınamadı' },
      { status: 500 }
    );
  }
}