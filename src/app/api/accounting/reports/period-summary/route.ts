import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    const companyId = searchParams.get('companyId') || '550e8400-e29b-41d4-a716-446655440000';

    // Dönem özeti için çeşitli verileri topla
    const [
      { data: accounts, error: accountsError },
      { data: journalEntries, error: journalError },
      { data: invoices, error: invoicesError },
      { data: contacts, error: contactsError }
    ] = await Promise.all([
      // Hesap sayıları
      supabase!
        .from('accounts')
        .select('type')
        .eq('company_id', companyId),
      
      // Fiş sayıları
      supabase!
        .from('journal_entries')
        .select('id, total_debit, total_credit')
        .eq('company_id', companyId)
        .gte('date', startDate)
        .lte('date', endDate),
      
      // Fatura sayıları
      supabase!
        .from('invoices')
        .select('id, total_amount, kdvsum')
        .eq('company_id', companyId)
        .gte('date', startDate)
        .lte('date', endDate),
      
      // Cari hesap sayıları
      supabase!
        .from('contacts')
        .select('type')
        .eq('company_id', companyId)
    ]);

    if (accountsError || journalError || invoicesError || contactsError) {
      throw new Error('Veri alınırken hata oluştu');
    }

    // Hesap türlerine göre grupla
    const accountTypes = accounts?.reduce((acc: any, account: any) => {
      acc[account.type] = (acc[account.type] || 0) + 1;
      return acc;
    }, {}) || {};

    // Cari hesap türlerine göre grupla
    const contactTypes = contacts?.reduce((acc: any, contact: any) => {
      acc[contact.type] = (acc[contact.type] || 0) + 1;
      return acc;
    }, {}) || {};

    // Toplam borç ve alacak
    const totalDebit = journalEntries?.reduce((sum, entry) => sum + (entry.total_debit || 0), 0) || 0;
    const totalCredit = journalEntries?.reduce((sum, entry) => sum + (entry.total_credit || 0), 0) || 0;

    // Toplam fatura tutarı
    const totalInvoiceAmount = invoices?.reduce((sum, invoice) => sum + (parseFloat(invoice.total_amount) || 0), 0) || 0;
    const totalKdvAmount = invoices?.reduce((sum, invoice) => sum + (parseFloat(invoice.kdvsum) || 0), 0) || 0;

    const periodSummary = {
      period: {
        startDate,
        endDate,
        duration: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
      },
      accounts: {
        total: accounts?.length || 0,
        byType: accountTypes
      },
      journal: {
        totalEntries: journalEntries?.length || 0,
        totalDebit,
        totalCredit,
        balance: totalDebit - totalCredit
      },
      invoices: {
        totalCount: invoices?.length || 0,
        totalAmount: totalInvoiceAmount,
        totalKdv: totalKdvAmount,
        netAmount: totalInvoiceAmount - totalKdvAmount
      },
      contacts: {
        total: contacts?.length || 0,
        byType: contactTypes
      },
      summary: {
        totalTransactions: journalEntries?.length || 0,
        totalInvoices: invoices?.length || 0,
        totalContacts: contacts?.length || 0,
        totalAccounts: accounts?.length || 0
      }
    };

    return NextResponse.json(periodSummary);

  } catch (error) {
    console.error('Period Summary error:', error);
    return NextResponse.json(
      { error: 'Dönem özeti oluşturulamadı' },
      { status: 500 }
    );
  }
}
