import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../../lib/supabase-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];

    // Cari hesabın hareketlerini getir (faturalar ve yevmiye fişleri)
    const transactions: any[] = [];

    // Fatura hareketleri
    const { data: invoiceTransactions, error: invoiceError } = await supabase!
      .from('invoices')
      .select('id, invoice_number, date, type, total_amount, status')
      .eq('contact_id', params.id)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');

    if (invoiceError) {
      throw invoiceError;
    }

    // Fatura hareketlerini formatla
    invoiceTransactions?.forEach(invoice => {
      if (invoice.status === 'POSTED') {
        transactions.push({
          id: `inv-${invoice.id}`,
          date: invoice.date,
          type: invoice.type === 'SALE' ? 'Satış Faturası' : 
                invoice.type === 'PURCHASE' ? 'Alış Faturası' : 'İade Faturası',
          description: `${invoice.type === 'SALE' ? 'Satış' : 
                        invoice.type === 'PURCHASE' ? 'Alış' : 'İade'} faturası`,
          reference: invoice.invoice_number,
          debit: invoice.type === 'PURCHASE' ? invoice.total_amount : 0,
          credit: invoice.type === 'SALE' ? invoice.total_amount : 0,
          balance: 0 // Hesaplanacak
        });
      }
    });

    // Yevmiye fişi hareketleri (cari hesaplarla ilgili)
    const { data: journalTransactions, error: journalError } = await supabase!
      .from('journal_lines')
      .select(`
        id,
        debit,
        credit,
        description,
        created_at,
        journal_entries (
          no,
          date,
          description
        )
      `)
      .or(`account_id.eq.a1200000-0000-0000-0000-000000000001,account_id.eq.a3200000-0000-0000-0000-000000000001`)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at');

    if (journalError) {
      throw journalError;
    }

    // Yevmiye fişi hareketlerini formatla
    journalTransactions?.forEach(line => {
      transactions.push({
        id: `jrn-${line.id}`,
        date: (line as any).journal_entries?.date || line.created_at,
        type: 'Yevmiye Fişi',
        description: line.description || (line as any).journal_entries?.description || '',
        reference: (line as any).journal_entries?.no || '',
        debit: line.debit || 0,
        credit: line.credit || 0,
        balance: 0 // Hesaplanacak
      });
    });

    // Tarihe göre sırala
    transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Bakiye hesapla
    let runningBalance = 0;
    const formattedTransactions = transactions.map(transaction => {
      runningBalance += (transaction.debit || 0) - (transaction.credit || 0);
      return {
        ...transaction,
        balance: runningBalance
      };
    });

    return NextResponse.json(formattedTransactions);

  } catch (error) {
    console.error('Contact transactions error:', error);
    return NextResponse.json(
      { error: 'Cari hareketler alınamadı' },
      { status: 500 }
    );
  }
}
