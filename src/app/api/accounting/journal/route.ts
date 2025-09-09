import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Yevmiye fişlerini ve satırlarını çek
    const { data: entries, error: entriesError } = await supabase!
      .from('journal_entries')
      .select(`
        *,
        journal_lines (
          id,
          account_id,
          debit,
          credit,
          description,
          accounts (
            code,
            name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (entriesError) {
      throw entriesError;
    }

    // Veriyi düzenle
    const formattedEntries = entries?.map(entry => ({
      ...entry,
      lines: entry.journal_lines?.map((line: any) => ({
        id: line.id,
        account_id: line.account_id,
        account_code: line.accounts?.code,
        account_name: line.accounts?.name,
        debit: line.debit,
        credit: line.credit,
        description: line.description
      })) || []
    })) || [];

    return NextResponse.json(formattedEntries);

  } catch (error) {
    console.error('Journal GET error:', error);
    return NextResponse.json(
      { error: 'Yevmiye fişleri alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.no || !body.description || !body.date || !body.period) {
      return NextResponse.json(
        { error: 'Fiş no, açıklama, tarih ve dönem gerekli' },
        { status: 400 }
      );
    }

    if (!body.lines || body.lines.length === 0) {
      return NextResponse.json(
        { error: 'En az bir fiş satırı gerekli' },
        { status: 400 }
      );
    }

    // Borç ve alacak toplamlarını kontrol et
    if (body.total_debit !== body.total_credit) {
      return NextResponse.json(
        { error: 'Borç ve alacak toplamları eşit olmalıdır' },
        { status: 400 }
      );
    }

    // Fiş no benzersizlik kontrolü
    const { data: existingEntry } = await supabase!
      .from('journal_entries')
      .select('id')
      .eq('no', body.no)
      .single();

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Bu fiş numarası zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Yevmiye fişini oluştur
    const { data: entry, error: entryError } = await supabase!
      .from('journal_entries')
      .insert([{
        no: body.no,
        description: body.description,
        date: body.date,
        period: body.period,
        status: body.status || 'DRAFT',
        total_debit: body.total_debit,
        total_credit: body.total_credit,
        company_id: '550e8400-e29b-41d4-a716-446655440000', // Varsayılan şirket
        created_by: '550e8400-e29b-41d4-a716-446655440000' // Varsayılan kullanıcı
      }])
      .select()
      .single();

    if (entryError) {
      throw entryError;
    }

    // Fiş satırlarını oluştur
    const linesData = body.lines.map((line: any) => ({
      journal_entry_id: entry.id,
      account_id: line.account_id,
      debit: line.debit || 0,
      credit: line.credit || 0,
      description: line.description || '',
      currency: 'TRY',
      fx_rate: 1.0000,
      amount_base: line.debit || line.credit || 0
    }));

    const { error: linesError } = await supabase!
      .from('journal_lines')
      .insert(linesData);

    if (linesError) {
      // Fişi sil
      await supabase!.from('journal_entries').delete().eq('id', entry.id);
      throw linesError;
    }

    return NextResponse.json(entry, { status: 201 });

  } catch (error) {
    console.error('Journal POST error:', error);
    return NextResponse.json(
      { error: 'Yevmiye fişi oluşturulamadı' },
      { status: 500 }
    );
  }
}
