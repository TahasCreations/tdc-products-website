import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Vergi ayarlarını çek
    const { data, error } = await supabase!!
      .from('tax_configs')
      .select('*')
      .eq('is_active', true)
      .order('type')
      .order('rate');

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Tax configs GET error:', error);
    return NextResponse.json(
      { error: 'Vergi ayarları alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.name || !body.type || body.rate === undefined) {
      return NextResponse.json(
        { error: 'Ad, tür ve oran gerekli' },
        { status: 400 }
      );
    }

    // Yeni vergi ayarı ekle
    const { data, error } = await supabase!
      .from('tax_configs')
      .insert([{
        name: body.name,
        type: body.type,
        rate: body.rate,
        is_active: body.is_active !== undefined ? body.is_active : true,
        company_id: '550e8400-e29b-41d4-a716-446655440000' // Varsayılan şirket
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Tax configs POST error:', error);
    return NextResponse.json(
      { error: 'Vergi ayarı eklenemedi' },
      { status: 500 }
    );
  }
}
