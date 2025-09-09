import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Para birimlerini çek
    const { data, error } = await supabase!!
      .from('currencies')
      .select('*')
      .eq('is_active', true)
      .order('is_base', { ascending: false })
      .order('code');

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Currencies GET error:', error);
    return NextResponse.json(
      { error: 'Para birimleri alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.code || !body.name || !body.symbol) {
      return NextResponse.json(
        { error: 'Kod, ad ve sembol gerekli' },
        { status: 400 }
      );
    }

    // Ana para birimi kontrolü
    if (body.is_base) {
      const { data: existingBase } = await supabase!
        .from('currencies')
        .select('id')
        .eq('is_base', true)
        .eq('is_active', true)
        .single();

      if (existingBase) {
        return NextResponse.json(
          { error: 'Zaten bir ana para birimi var' },
          { status: 400 }
        );
      }
    }

    // Yeni para birimi ekle
    const { data, error } = await supabase!
      .from('currencies')
      .insert([{
        code: body.code,
        name: body.name,
        symbol: body.symbol,
        rate: body.rate || 1,
        is_base: body.is_base || false,
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
    console.error('Currencies POST error:', error);
    return NextResponse.json(
      { error: 'Para birimi eklenemedi' },
      { status: 500 }
    );
  }
}
