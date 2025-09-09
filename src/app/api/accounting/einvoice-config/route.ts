import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // E-fatura ayarlarını çek
    const { data, error } = await supabase!!
      .from('einvoice_configs')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('E-invoice config GET error:', error);
    return NextResponse.json(
      { error: 'E-fatura ayarları alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.company_name || !body.tax_number) {
      return NextResponse.json(
        { error: 'Şirket adı ve vergi numarası gerekli' },
        { status: 400 }
      );
    }

    // Mevcut e-fatura ayarını kontrol et
    const { data: existingConfig } = await supabase!
      .from('einvoice_configs')
      .select('id')
      .eq('is_active', true)
      .single();

    let data, error;

    if (existingConfig) {
      // Mevcut ayarı güncelle
      const result = await supabase!
        .from('einvoice_configs')
        .update({
          company_name: body.company_name,
          tax_number: body.tax_number,
          address: body.address || null,
          phone: body.phone || null,
          email: body.email || null,
          is_active: body.is_active !== undefined ? body.is_active : true,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingConfig.id)
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    } else {
      // Yeni e-fatura ayarı ekle
      const result = await supabase!
        .from('einvoice_configs')
        .insert([{
          company_name: body.company_name,
          tax_number: body.tax_number,
          address: body.address || null,
          phone: body.phone || null,
          email: body.email || null,
          is_active: body.is_active !== undefined ? body.is_active : true,
          company_id: '550e8400-e29b-41d4-a716-446655440000' // Varsayılan şirket
        }])
        .select()
        .single();
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('E-invoice config POST error:', error);
    return NextResponse.json(
      { error: 'E-fatura ayarları kaydedilemedi' },
      { status: 500 }
    );
  }
}
