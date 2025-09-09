import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Dönem kilitlerini çek
    const { data, error } = await supabase!!
      .from('period_locks')
      .select('*')
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Period locks GET error:', error);
    return NextResponse.json(
      { error: 'Dönem kilitleri alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.period_year || !body.period_month) {
      return NextResponse.json(
        { error: 'Yıl ve ay gerekli' },
        { status: 400 }
      );
    }

    // Aynı dönem için kilit var mı kontrol et
    const { data: existingLock } = await supabase!
      .from('period_locks')
      .select('id')
      .eq('period_year', body.period_year)
      .eq('period_month', body.period_month)
      .single();

    if (existingLock) {
      return NextResponse.json(
        { error: 'Bu dönem zaten kilitli' },
        { status: 400 }
      );
    }

    // Yeni dönem kilidi oluştur
    const { data, error } = await supabase!
      .from('period_locks')
      .insert([{
        period_year: body.period_year,
        period_month: body.period_month,
        is_locked: true,
        locked_at: new Date().toISOString(),
        locked_by: 'admin', // TODO: Gerçek kullanıcı bilgisi
        company_id: '550e8400-e29b-41d4-a716-446655440000' // Varsayılan şirket
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Period locks POST error:', error);
    return NextResponse.json(
      { error: 'Dönem kilitlenemedi' },
      { status: 500 }
    );
  }
}
