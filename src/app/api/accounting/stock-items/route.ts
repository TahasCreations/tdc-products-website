import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Stok kalemlerini çek
    const { data, error } = await supabase!!
      .from('stock_items')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Stock items GET error:', error);
    return NextResponse.json(
      { error: 'Stok kalemleri alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.code || !body.name || !body.unit) {
      return NextResponse.json(
        { error: 'Kod, ad ve birim gerekli' },
        { status: 400 }
      );
    }

    // Yeni stok kartı ekle
    const { data, error } = await supabase!
      .from('stock_items')
      .insert([{
        code: body.code,
        name: body.name,
        description: body.description || null,
        unit: body.unit,
        category: body.category || null,
        min_stock: body.min_stock || 0,
        max_stock: body.max_stock || 0,
        current_stock: 0,
        avg_cost: 0,
        last_cost: 0,
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
    console.error('Stock items POST error:', error);
    return NextResponse.json(
      { error: 'Stok kartı eklenemedi' },
      { status: 500 }
    );
  }
}
