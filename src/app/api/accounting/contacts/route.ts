import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Cari hesapları çek
    const { data, error } = await supabase!!
      .from('contacts')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Contacts GET error:', error);
    return NextResponse.json(
      { error: 'Cari hesaplar alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: 'Ad ve tür gerekli' },
        { status: 400 }
      );
    }

    // Yeni cari hesap ekle
    const { data, error } = await supabase!
      .from('contacts')
      .insert([{
        name: body.name,
        tax_number: body.tax_number || null,
        type: body.type,
        address: body.address || null,
        phone: body.phone || null,
        email: body.email || null,
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
    console.error('Contacts POST error:', error);
    return NextResponse.json(
      { error: 'Cari hesap eklenemedi' },
      { status: 500 }
    );
  }
}
