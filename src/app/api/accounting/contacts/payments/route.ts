import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.contact_id || !body.amount || !body.payment_type) {
      return NextResponse.json(
        { error: 'Cari ID, tutar ve ödeme tipi gerekli' },
        { status: 400 }
      );
    }

    // Ödeme ekle
    const { data: payment, error: paymentError } = await supabase!
      .from('contact_payments')
      .insert([{
        contact_id: body.contact_id,
        amount: parseFloat(body.amount),
        currency_code: body.currency_code || 'TRY',
        payment_type: body.payment_type,
        payment_method: body.payment_method || 'CASH',
        description: body.description || '',
        reference: body.reference || '',
        payment_date: body.payment_date || new Date().toISOString().split('T')[0],
        company_id: '550e8400-e29b-41d4-a716-446655440000'
      }])
      .select()
      .single();

    if (paymentError) {
      throw paymentError;
    }

    // Cari hesap bakiyesini güncelle
    const { data: contact } = await supabase!
      .from('contacts')
      .select('balance')
      .eq('id', body.contact_id)
      .single();

    const currentBalance = contact?.balance || 0;
    const newBalance = body.payment_type === 'INCOMING' 
      ? currentBalance + parseFloat(body.amount)
      : currentBalance - parseFloat(body.amount);

    await supabase!
      .from('contacts')
      .update({ 
        balance: newBalance,
        last_transaction_date: new Date().toISOString()
      })
      .eq('id', body.contact_id);

    // Journal entry oluştur
    const journalEntry = {
      no: `PAY-${Date.now()}`,
      date: body.payment_date || new Date().toISOString().split('T')[0],
      description: `Ödeme: ${body.description || 'Cari ödeme'}`,
      reference: body.reference || '',
      company_id: '550e8400-e29b-41d4-a716-446655440000'
    };

    const { data: journal, error: journalError } = await supabase!
      .from('journal_entries')
      .insert([journalEntry])
      .select()
      .single();

    if (journalError) {
      throw journalError;
    }

    // Journal lines oluştur
    const journalLines = [];
    
    if (body.payment_type === 'INCOMING') {
      // Gelen ödeme: Cari hesap borç, Kasa hesabı alacak
      journalLines.push(
        {
          journal_id: journal.id,
          account_id: await getAccountId('120.01.001'), // Cari hesap
          debit: parseFloat(body.amount),
          credit: 0,
          description: `Gelen ödeme: ${body.description || ''}`
        },
        {
          journal_id: journal.id,
          account_id: await getAccountId('100.01.001'), // Kasa hesabı
          debit: 0,
          credit: parseFloat(body.amount),
          description: `Gelen ödeme: ${body.description || ''}`
        }
      );
    } else {
      // Giden ödeme: Kasa hesabı borç, Cari hesap alacak
      journalLines.push(
        {
          journal_id: journal.id,
          account_id: await getAccountId('100.01.001'), // Kasa hesabı
          debit: parseFloat(body.amount),
          credit: 0,
          description: `Giden ödeme: ${body.description || ''}`
        },
        {
          journal_id: journal.id,
          account_id: await getAccountId('120.01.001'), // Cari hesap
          debit: 0,
          credit: parseFloat(body.amount),
          description: `Giden ödeme: ${body.description || ''}`
        }
      );
    }

    const { error: linesError } = await supabase!
      .from('journal_lines')
      .insert(journalLines);

    if (linesError) {
      throw linesError;
    }

    return NextResponse.json({
      success: true,
      payment,
      journal,
      newBalance
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { error: 'Ödeme eklenemedi' },
      { status: 500 }
    );
  }
}

async function getAccountId(code: string): Promise<string> {
  const supabase = getServerSupabaseClient();
  const { data } = await supabase!
    .from('accounts')
    .select('id')
    .eq('code', code)
    .single();
  
  return data?.id || '550e8400-e29b-41d4-a716-446655440000';
}
