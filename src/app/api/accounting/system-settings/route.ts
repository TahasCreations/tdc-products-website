import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Sistem ayarlarını çek
    const { data, error } = await supabase!!
      .from('system_settings')
      .select('*')
      .order('category')
      .order('key');

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('System settings GET error:', error);
    return NextResponse.json(
      { error: 'Sistem ayarları alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.key || !body.value) {
      return NextResponse.json(
        { error: 'Anahtar ve değer gerekli' },
        { status: 400 }
      );
    }

    // Aynı anahtar var mı kontrol et
    const { data: existingSetting } = await supabase!
      .from('system_settings')
      .select('id')
      .eq('key', body.key)
      .single();

    if (existingSetting) {
      return NextResponse.json(
        { error: 'Bu anahtar zaten mevcut' },
        { status: 400 }
      );
    }

    // Yeni sistem ayarı ekle
    const { data, error } = await supabase!
      .from('system_settings')
      .insert([{
        key: body.key,
        value: body.value,
        description: body.description || null,
        category: body.category || 'GENERAL',
        company_id: '550e8400-e29b-41d4-a716-446655440000' // Varsayılan şirket
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('System settings POST error:', error);
    return NextResponse.json(
      { error: 'Sistem ayarı eklenemedi' },
      { status: 500 }
    );
  }
}
