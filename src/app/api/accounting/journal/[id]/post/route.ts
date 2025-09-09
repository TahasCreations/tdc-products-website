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

    if (entry.status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Sadece taslak fişler kaydedilebilir' },
        { status: 400 }
      );
    }

    // Borç ve alacak toplamlarını kontrol et
    if (entry.total_debit !== entry.total_credit) {
      return NextResponse.json(
        { error: 'Fiş dengeli değil, kaydedilemez' },
        { status: 400 }
      );
    }

    // Fişi kaydet (POSTED durumuna getir)
    const { data, error: updateError } = await supabase!
      .from('journal_entries')
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

    return NextResponse.json({
      message: 'Fiş başarıyla kaydedildi',
      entry: data
    });

  } catch (error) {
    console.error('Journal POST error:', error);
    return NextResponse.json(
      { error: 'Fiş kaydedilemedi' },
      { status: 500 }
    );
  }
}
