import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    const cashboxId = searchParams.get('cashboxId');

    // Kasa işlemlerini çek
    let query = supabase!
      .from('cash_txns')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (cashboxId) {
      query = query.eq('cashbox_id', cashboxId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Cash transactions GET error:', error);
    return NextResponse.json(
      { error: 'Kasa işlemleri alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.date || !body.type || !body.description || !body.amount || !body.cashbox_id) {
      return NextResponse.json(
        { error: 'Tarih, tür, açıklama, tutar ve kasa gerekli' },
        { status: 400 }
      );
    }

    // Yeni kasa işlemi ekle
    const { data, error } = await supabase!
      .from('cash_txns')
      .insert([{
        date: body.date,
        type: body.type,
        description: body.description,
        amount: body.amount,
        reference: body.reference || null,
        cashbox_id: body.cashbox_id,
        contact_id: body.contact_id || null,
        status: body.status || 'POSTED',
        company_id: '550e8400-e29b-41d4-a716-446655440000' // Varsayılan şirket
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Eğer işlem kayıtlı ise, otomatik yevmiye fişi oluştur
    if (body.status === 'POSTED') {
      await createJournalEntryForCashTransaction(data, supabase);
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Cash transactions POST error:', error);
    return NextResponse.json(
      { error: 'Kasa işlemi eklenemedi' },
      { status: 500 }
    );
  }
}

// Kasa işlemi için otomatik yevmiye fişi oluştur
async function createJournalEntryForCashTransaction(transaction: any, supabase: any) {
  try {
    // Kasa hesabını bul
    const { data: cashbox } = await supabase
      .from('cashboxes')
      .select('account_id')
      .eq('id', transaction.cashbox_id)
      .single();

    if (!cashbox) return;

    // Yevmiye fişi oluştur
    const { data: journalEntry } = await supabase
      .from('journal_entries')
      .insert([{
        date: transaction.date,
        description: `Kasa İşlemi: ${transaction.description}`,
        reference: transaction.reference || `CASH-${transaction.id}`,
        status: 'POSTED',
        company_id: '550e8400-e29b-41d4-a716-446655440000'
      }])
      .select()
      .single();

    if (!journalEntry) return;

    // Yevmiye fişi satırları oluştur
    const lines = [];

    if (transaction.type === 'RECEIPT') {
      // Tahsilat: Kasa Borç, Gelir Hesabı Alacak
      lines.push({
        account_id: cashbox.account_id,
        debit: transaction.amount,
        credit: 0,
        description: transaction.description,
        journal_entry_id: journalEntry.id
      });
      lines.push({
        account_id: 'a6000000-0000-0000-0000-000000000001', // Gelir hesabı
        debit: 0,
        credit: transaction.amount,
        description: transaction.description,
        journal_entry_id: journalEntry.id
      });
    } else if (transaction.type === 'PAYMENT') {
      // Ödeme: Gider Hesabı Borç, Kasa Alacak
      lines.push({
        account_id: 'a7000000-0000-0000-0000-000000000001', // Gider hesabı
        debit: transaction.amount,
        credit: 0,
        description: transaction.description,
        journal_entry_id: journalEntry.id
      });
      lines.push({
        account_id: cashbox.account_id,
        debit: 0,
        credit: transaction.amount,
        description: transaction.description,
        journal_entry_id: journalEntry.id
      });
    } else {
      // Diğer işlemler: Kasa Borç/Alacak, İlgili Hesap Alacak/Borç
      const isDebit = ['EXPENSE', 'INTEREST', 'COMMISSION'].includes(transaction.type);
      lines.push({
        account_id: cashbox.account_id,
        debit: isDebit ? 0 : transaction.amount,
        credit: isDebit ? transaction.amount : 0,
        description: transaction.description,
        journal_entry_id: journalEntry.id
      });
      lines.push({
        account_id: isDebit ? 'a7000000-0000-0000-0000-000000000001' : 'a6000000-0000-0000-0000-000000000001',
        debit: isDebit ? transaction.amount : 0,
        credit: isDebit ? 0 : transaction.amount,
        description: transaction.description,
        journal_entry_id: journalEntry.id
      });
    }

    // Yevmiye fişi satırlarını ekle
    await supabase
      .from('journal_lines')
      .insert(lines);

  } catch (error) {
    console.error('Journal entry creation error:', error);
  }
}
