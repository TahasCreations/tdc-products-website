import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../../lib/supabase-client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabaseClient();

    // Fişin mevcut durumunu kontrol et
    const { data: entry, error: entryError } = await supabase!
      .from('journal_entries')
      .select('*')
      .eq('id', params.id)
      .single();

    if (entryError) {
      throw entryError;
    }

    if (!entry) {
      return NextResponse.json(
        { error: 'Yevmiye fişi bulunamadı' },
        { status: 404 }
      );
    }

    if (entry.status !== 'POSTED') {
      return NextResponse.json(
        { error: 'Sadece kayıtlı fişler ters kayıt edilebilir' },
        { status: 400 }
      );
    }

    // Ters kayıt fişi oluştur
    const reverseEntryNo = `TR-${entry.no}`;
    
    const { data: reverseEntry, error: reverseError } = await supabase!
      .from('journal_entries')
      .insert([{
        no: reverseEntryNo,
        description: `Ters kayıt: ${entry.description}`,
        date: new Date().toISOString().split('T')[0],
        period: entry.period,
        status: 'REVERSED',
        total_debit: entry.total_credit, // Ters çevir
        total_credit: entry.total_debit, // Ters çevir
        company_id: entry.company_id,
        created_by: '550e8400-e29b-41d4-a716-446655440000' // Varsayılan kullanıcı
      }])
      .select()
      .single();

    if (reverseError) {
      throw reverseError;
    }

    // Orijinal fişin satırlarını al
    const { data: originalLines, error: linesError } = await supabase!
      .from('journal_lines')
      .select('*')
      .eq('journal_entry_id', params.id);

    if (linesError) {
      throw linesError;
    }

    // Ters kayıt satırlarını oluştur
    const reverseLinesData = originalLines?.map(line => ({
      journal_entry_id: reverseEntry.id,
      account_id: line.account_id,
      debit: line.credit, // Ters çevir
      credit: line.debit, // Ters çevir
      description: `Ters kayıt: ${line.description}`,
      currency: line.currency,
      fx_rate: line.fx_rate,
      amount_base: line.credit || line.debit || 0
    })) || [];

    const { error: reverseLinesError } = await supabase!
      .from('journal_lines')
      .insert(reverseLinesData);

    if (reverseLinesError) {
      // Ters kayıt fişini sil
      await supabase!.from('journal_entries').delete().eq('id', reverseEntry.id);
      throw reverseLinesError;
    }

    // Orijinal fişi REVERSED durumuna getir
    const { error: updateError } = await supabase!
      .from('journal_entries')
      .update({
        status: 'REVERSED',
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      message: 'Fiş başarıyla ters kayıt edildi',
      reverseEntry: reverseEntry
    });

  } catch (error) {
    console.error('Journal REVERSE error:', error);
    return NextResponse.json(
      { error: 'Fiş ters kayıt edilemedi' },
      { status: 500 }
    );
  }
}
