import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../../lib/supabase-client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabaseClient();

    // Faturanın mevcut durumunu kontrol et
    const { data: invoice, error: invoiceError } = await supabase!
      .from('invoices')
      .select('*')
      .eq('id', params.id)
      .single();

    if (invoiceError) {
      throw invoiceError;
    }

    if (!invoice) {
      return NextResponse.json(
        { error: 'Fatura bulunamadı' },
        { status: 404 }
      );
    }

    if (invoice.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Fatura zaten iptal edilmiş' },
        { status: 400 }
      );
    }

    // Faturayı iptal et
    const { data: updatedInvoice, error: updateError } = await supabase!
      .from('invoices')
      .update({
        status: 'CANCELLED',
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Eğer fatura kayıtlıysa, ters kayıt fişi oluştur
    if (invoice.status === 'POSTED') {
      await createReverseJournalEntry(invoice, supabase);
    }

    return NextResponse.json({
      message: 'Fatura başarıyla iptal edildi',
      invoice: updatedInvoice
    });

  } catch (error) {
    console.error('Invoice CANCEL error:', error);
    return NextResponse.json(
      { error: 'Fatura iptal edilemedi' },
      { status: 500 }
    );
  }
}

async function createReverseJournalEntry(invoice: any, supabase: any) {
  try {
    // Ters kayıt yevmiye fişi oluştur
    const reverseJournalEntryNo = `IPT-${invoice.invoice_number}`;
    
    const { data: reverseJournalEntry, error: reverseJournalError } = await supabase
      .from('journal_entries')
      .insert([{
        no: reverseJournalEntryNo,
        description: `İptal edilen ${invoice.type === 'SALE' ? 'satış' : 'alış'} faturası: ${invoice.invoice_number}`,
        date: new Date().toISOString().split('T')[0],
        period: new Date().toISOString().substring(0, 7),
        status: 'POSTED',
        total_debit: invoice.total_amount,
        total_credit: invoice.total_amount,
        company_id: invoice.company_id,
        created_by: '550e8400-e29b-41d4-a716-446655440000'
      }])
      .select()
      .single();

    if (reverseJournalError) {
      throw reverseJournalError;
    }

    // Ters kayıt fiş satırlarını oluştur
    const reverseJournalLines = [];

    if (invoice.type === 'SALE') {
      // Satış faturası iptali için ters kayıt
      // Alıcılar hesabı (alacak) - ters
      reverseJournalLines.push({
        journal_entry_id: reverseJournalEntry.id,
        account_id: 'a1200000-0000-0000-0000-000000000001', // Alıcılar
        debit: 0,
        credit: invoice.total_amount,
        description: `İptal edilen satış faturası: ${invoice.invoice_number}`,
        currency: 'TRY',
        fx_rate: 1.0000,
        amount_base: invoice.total_amount
      });

      // Yurtiçi satışlar hesabı (borç) - ters
      reverseJournalLines.push({
        journal_entry_id: reverseJournalEntry.id,
        account_id: 'a6010000-0000-0000-0000-000000000001', // Yurtiçi satışlar
        debit: invoice.subtotal,
        credit: 0,
        description: `İptal edilen satış faturası: ${invoice.invoice_number}`,
        currency: 'TRY',
        fx_rate: 1.0000,
        amount_base: invoice.subtotal
      });

      // KDV hesabı (borç) - ters
      if (invoice.kdvsum > 0) {
        reverseJournalLines.push({
          journal_entry_id: reverseJournalEntry.id,
          account_id: 'a3910000-0000-0000-0000-000000000001', // Hesaplanan KDV
          debit: invoice.kdvsum,
          credit: 0,
          description: `İptal edilen KDV: ${invoice.invoice_number}`,
          currency: 'TRY',
          fx_rate: 1.0000,
          amount_base: invoice.kdvsum
        });
      }
    } else if (invoice.type === 'PURCHASE') {
      // Alış faturası iptali için ters kayıt
      // Satıcılar hesabı (borç) - ters
      reverseJournalLines.push({
        journal_entry_id: reverseJournalEntry.id,
        account_id: 'a3200000-0000-0000-0000-000000000001', // Satıcılar
        debit: invoice.total_amount,
        credit: 0,
        description: `İptal edilen alış faturası: ${invoice.invoice_number}`,
        currency: 'TRY',
        fx_rate: 1.0000,
        amount_base: invoice.total_amount
      });

      // Genel yönetim giderleri hesabı (alacak) - ters
      reverseJournalLines.push({
        journal_entry_id: reverseJournalEntry.id,
        account_id: 'a7800000-0000-0000-0000-000000000001', // Genel yönetim giderleri
        debit: 0,
        credit: invoice.subtotal,
        description: `İptal edilen alış faturası: ${invoice.invoice_number}`,
        currency: 'TRY',
        fx_rate: 1.0000,
        amount_base: invoice.subtotal
      });

      // KDV hesabı (alacak) - ters
      if (invoice.kdvsum > 0) {
        reverseJournalLines.push({
          journal_entry_id: reverseJournalEntry.id,
          account_id: 'a1910000-0000-0000-0000-000000000001', // İndirilecek KDV
          debit: 0,
          credit: invoice.kdvsum,
          description: `İptal edilen indirilecek KDV: ${invoice.invoice_number}`,
          currency: 'TRY',
          fx_rate: 1.0000,
          amount_base: invoice.kdvsum
        });
      }
    }

    // Ters kayıt fiş satırlarını kaydet
    const { error: reverseLinesError } = await supabase
      .from('journal_lines')
      .insert(reverseJournalLines);

    if (reverseLinesError) {
      // Ters kayıt yevmiye fişini sil
      await supabase!.from('journal_entries').delete().eq('id', reverseJournalEntry.id);
      throw reverseLinesError;
    }

  } catch (error) {
    console.error('Reverse journal entry creation error:', error);
    throw error;
  }
}
