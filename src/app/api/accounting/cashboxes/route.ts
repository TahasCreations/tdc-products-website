import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Kasa hesaplarını çek
    const { data, error } = await supabase!!
      .from('cashboxes')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Cashboxes GET error:', error);
    return NextResponse.json(
      { error: 'Kasa hesapları alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.name || !body.type || !body.account_id) {
      return NextResponse.json(
        { error: 'Ad, tür ve hesap kodu gerekli' },
        { status: 400 }
      );
    }

    // Yeni kasa ekle
    const { data, error } = await supabase!
      .from('cashboxes')
      .insert([{
        name: body.name,
        type: body.type,
        account_id: body.account_id,
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
    console.error('Cashboxes POST error:', error);
    return NextResponse.json(
      { error: 'Kasa hesabı eklenemedi' },
      { status: 500 }
    );
  }
}
