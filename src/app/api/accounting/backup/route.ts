import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();
    const year = body.year || new Date().getFullYear();

    // Yedekleme verilerini çek
    const backupData = await createBackupData(year, supabase);

    // ZIP dosyası oluştur (basit JSON formatında)
    const backupContent = JSON.stringify(backupData, null, 2);

    return new NextResponse(backupContent, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="muhasebe-yedek-${year}.json"`
      }
    });

  } catch (error) {
    console.error('Backup error:', error);
    return NextResponse.json(
      { error: 'Yedekleme oluşturulamadı' },
      { status: 500 }
    );
  }
}

async function createBackupData(year: number, supabase: any) {
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;

  // Tüm muhasebe verilerini çek
  const [
    { data: companies },
    { data: accounts },
    { data: journalEntries },
    { data: journalLines },
    { data: contacts },
    { data: invoices },
    { data: invoiceLines },
    { data: stockItems },
    { data: inventoryTxns },
    { data: cashboxes },
    { data: cashTxns },
    { data: bankAccounts },
    { data: bankTxns },
    { data: taxConfigs },
    { data: periodLocks },
    { data: auditLogs }
  ] = await Promise.all([
    supabase.from('companies').select('*'),
    supabase.from('accounts').select('*'),
    supabase.from('journal_entries').select('*').gte('date', startDate).lte('date', endDate),
    supabase.from('journal_lines').select('*').gte('created_at', startDate).lte('created_at', endDate),
    supabase.from('contacts').select('*'),
    supabase.from('invoices').select('*').gte('date', startDate).lte('date', endDate),
    supabase.from('invoice_lines').select('*').gte('created_at', startDate).lte('created_at', endDate),
    supabase.from('stock_items').select('*'),
    supabase.from('inventory_txns').select('*').gte('date', startDate).lte('date', endDate),
    supabase.from('cashboxes').select('*'),
    supabase.from('cash_txns').select('*').gte('date', startDate).lte('date', endDate),
    supabase.from('bank_accounts').select('*'),
    supabase.from('bank_txns').select('*').gte('date', startDate).lte('date', endDate),
    supabase.from('tax_configs').select('*'),
    supabase.from('period_locks').select('*').eq('period_year', year),
    supabase.from('audit_logs').select('*').gte('created_at', startDate).lte('created_at', endDate)
  ]);

  return {
    backupInfo: {
      year,
      created_at: new Date().toISOString(),
      version: '1.0',
      description: `${year} yılı muhasebe verileri yedeklemesi`
    },
    data: {
      companies: companies || [],
      accounts: accounts || [],
      journalEntries: journalEntries || [],
      journalLines: journalLines || [],
      contacts: contacts || [],
      invoices: invoices || [],
      invoiceLines: invoiceLines || [],
      stockItems: stockItems || [],
      inventoryTxns: inventoryTxns || [],
      cashboxes: cashboxes || [],
      cashTxns: cashTxns || [],
      bankAccounts: bankAccounts || [],
      bankTxns: bankTxns || [],
      taxConfigs: taxConfigs || [],
      periodLocks: periodLocks || [],
      auditLogs: auditLogs || []
    },
    statistics: {
      totalCompanies: companies?.length || 0,
      totalAccounts: accounts?.length || 0,
      totalJournalEntries: journalEntries?.length || 0,
      totalJournalLines: journalLines?.length || 0,
      totalContacts: contacts?.length || 0,
      totalInvoices: invoices?.length || 0,
      totalInvoiceLines: invoiceLines?.length || 0,
      totalStockItems: stockItems?.length || 0,
      totalInventoryTxns: inventoryTxns?.length || 0,
      totalCashboxes: cashboxes?.length || 0,
      totalCashTxns: cashTxns?.length || 0,
      totalBankAccounts: bankAccounts?.length || 0,
      totalBankTxns: bankTxns?.length || 0,
      totalTaxConfigs: taxConfigs?.length || 0,
      totalPeriodLocks: periodLocks?.length || 0,
      totalAuditLogs: auditLogs?.length || 0
    }
  };
}
