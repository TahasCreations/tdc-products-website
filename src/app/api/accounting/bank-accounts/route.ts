import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Banka hesaplarını çek
    const { data, error } = await supabase!
      .from('bank_accounts')
      .select('*')
      .eq('is_active', true)
      .order('bank_name');

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Bank accounts GET error:', error);
    return NextResponse.json(
      { error: 'Banka hesapları alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.name || !body.bank_name || !body.account_number) {
      return NextResponse.json(
        { error: 'Hesap adı, banka adı ve hesap numarası gerekli' },
        { status: 400 }
      );
    }

    // Yeni banka hesabı ekle
    const { data, error } = await supabase!
      .from('bank_accounts')
      .insert([{
        name: body.name,
        bank_name: body.bank_name,
        account_number: body.account_number,
        iban: body.iban || null,
        currency: body.currency || 'TRY',
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
    console.error('Bank accounts POST error:', error);
    return NextResponse.json(
      { error: 'Banka hesabı eklenemedi' },
      { status: 500 }
    );
  }
}
