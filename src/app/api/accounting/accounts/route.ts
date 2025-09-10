import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Tüm hesapları çek
    const { data, error } = await supabase!
      .from('accounts')
      .select('*')
      .order('code');

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Accounts GET error:', error);
    return NextResponse.json(
      { error: 'Hesaplar alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.code || !body.name || !body.type) {
      return NextResponse.json(
        { error: 'Hesap kodu, adı ve tipi gerekli' },
        { status: 400 }
      );
    }

    // Hesap kodu benzersizlik kontrolü
    const { data: existingAccount } = await supabase!
      .from('accounts')
      .select('id')
      .eq('code', body.code)
      .single();

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Bu hesap kodu zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Yeni hesap ekle
    const { data, error } = await supabase!
      .from('accounts')
      .insert([{
        code: body.code,
        name: body.name,
        type: body.type,
        parent_id: body.parent_id || null,
        currency_code: body.currency_code || 'TRY',
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
    console.error('Accounts POST error:', error);
    return NextResponse.json(
      { error: 'Hesap eklenemedi' },
      { status: 500 }
    );
  }
}