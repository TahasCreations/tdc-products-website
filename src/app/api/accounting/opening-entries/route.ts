import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Açılış fişlerini çek
    const { data, error } = await supabase!!
      .from('journal_entries')
      .select('*')
      .eq('type', 'OPENING')
      .order('period_year', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Opening entries GET error:', error);
    return NextResponse.json(
      { error: 'Açılış fişleri alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.period_year || !body.description) {
      return NextResponse.json(
        { error: 'Yıl ve açıklama gerekli' },
        { status: 400 }
      );
    }

    // Açılış fişi oluştur
    const { data, error } = await supabase!
      .from('journal_entries')
      .insert([{
        date: `${body.period_year}-01-01`,
        description: body.description,
        reference: `AÇILIŞ-${body.period_year}`,
        type: 'OPENING',
        status: 'DRAFT',
        period_year: body.period_year,
        company_id: '550e8400-e29b-41d4-a716-446655440000' // Varsayılan şirket
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Opening entries POST error:', error);
    return NextResponse.json(
      { error: 'Açılış fişi oluşturulamadı' },
      { status: 500 }
    );
  }
}
