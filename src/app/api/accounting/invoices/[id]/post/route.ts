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

    if (invoice.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Sadece taslak faturalar kaydedilebilir' },
        { status: 400 }
      );
    }

    // Faturayı kaydet (POSTED durumuna getir)
    const { data: updatedInvoice, error: updateError } = await supabase!
      .from('invoices')
      .update({
        status: 'POSTED',
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Otomatik muhasebe fişi oluştur
    await createJournalEntryFromInvoice(updatedInvoice, supabase);

    return NextResponse.json({
      message: 'Fatura başarıyla kaydedildi ve muhasebe fişi oluşturuldu',
      invoice: updatedInvoice
    });

  } catch (error) {
    console.error('Invoice POST error:', error);
    return NextResponse.json(
      { error: 'Fatura kaydedilemedi' },
      { status: 500 }
    );
  }
}

async function createJournalEntryFromInvoice(invoice: any, supabase: any) {
  try {
    // Yevmiye fişi oluştur
    const journalEntryNo = `FAT-${invoice.invoice_number}`;
    
    const { data: journalEntry, error: journalError } = await supabase
      .from('journal_entries')
      .insert([{
        no: journalEntryNo,
        description: `${invoice.type === 'SALE' ? 'Satış' : 'Alış'} faturası: ${invoice.invoice_number}`,
        date: invoice.date,
        period: invoice.date.substring(0, 7),
        status: 'POSTED',
        total_debit: invoice.total_amount,
        total_credit: invoice.total_amount,
        company_id: invoice.company_id,
        created_by: '550e8400-e29b-41d4-a716-446655440000'
      }])
      .select()
      .single();

    if (journalError) {
      throw journalError;
    }

    // Fiş satırlarını oluştur
    const journalLines = [];

    if (invoice.type === 'SALE') {
      // Satış faturası için fiş satırları
      // Alıcılar hesabı (borç)
      journalLines.push({
        journal_entry_id: journalEntry.id,
        account_id: 'a1200000-0000-0000-0000-000000000001', // Alıcılar
        debit: invoice.total_amount,
        credit: 0,
        description: `Satış faturası: ${invoice.invoice_number}`,
        currency: 'TRY',
        fx_rate: 1.0000,
        amount_base: invoice.total_amount
      });

      // Yurtiçi satışlar hesabı (alacak)
      journalLines.push({
        journal_entry_id: journalEntry.id,
        account_id: 'a6010000-0000-0000-0000-000000000001', // Yurtiçi satışlar
        debit: 0,
        credit: invoice.subtotal,
        description: `Satış faturası: ${invoice.invoice_number}`,
        currency: 'TRY',
        fx_rate: 1.0000,
        amount_base: invoice.subtotal
      });

      // KDV hesabı (alacak)
      if (invoice.kdvsum > 0) {
        journalLines.push({
          journal_entry_id: journalEntry.id,
          account_id: 'a3910000-0000-0000-0000-000000000001', // Hesaplanan KDV
          debit: 0,
          credit: invoice.kdvsum,
          description: `KDV: ${invoice.invoice_number}`,
          currency: 'TRY',
          fx_rate: 1.0000,
          amount_base: invoice.kdvsum
        });
      }
    } else if (invoice.type === 'PURCHASE') {
      // Alış faturası için fiş satırları
      // Satıcılar hesabı (alacak)
      journalLines.push({
        journal_entry_id: journalEntry.id,
        account_id: 'a3200000-0000-0000-0000-000000000001', // Satıcılar
        debit: 0,
        credit: invoice.total_amount,
        description: `Alış faturası: ${invoice.invoice_number}`,
        currency: 'TRY',
        fx_rate: 1.0000,
        amount_base: invoice.total_amount
      });

      // Genel yönetim giderleri hesabı (borç)
      journalLines.push({
        journal_entry_id: journalEntry.id,
        account_id: 'a7800000-0000-0000-0000-000000000001', // Genel yönetim giderleri
        debit: invoice.subtotal,
        credit: 0,
        description: `Alış faturası: ${invoice.invoice_number}`,
        currency: 'TRY',
        fx_rate: 1.0000,
        amount_base: invoice.subtotal
      });

      // KDV hesabı (borç)
      if (invoice.kdvsum > 0) {
        journalLines.push({
          journal_entry_id: journalEntry.id,
          account_id: 'a1910000-0000-0000-0000-000000000001', // İndirilecek KDV
          debit: invoice.kdvsum,
          credit: 0,
          description: `İndirilecek KDV: ${invoice.invoice_number}`,
          currency: 'TRY',
          fx_rate: 1.0000,
          amount_base: invoice.kdvsum
        });
      }
    }

    // Fiş satırlarını kaydet
    const { error: linesError } = await supabase
      .from('journal_lines')
      .insert(journalLines);

    if (linesError) {
      // Yevmiye fişini sil
      await supabase!.from('journal_entries').delete().eq('id', journalEntry.id);
      throw linesError;
    }

  } catch (error) {
    console.error('Journal entry creation error:', error);
    throw error;
  }
}
