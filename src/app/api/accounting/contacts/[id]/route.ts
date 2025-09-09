import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Cari hesabı güncelle
    const { data, error } = await supabase!!
      .from('contacts')
      .update({
        name: body.name,
        tax_number: body.tax_number || null,
        type: body.type,
        address: body.address || null,
        phone: body.phone || null,
        email: body.email || null,
        is_active: body.is_active !== undefined ? body.is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Contact PUT error:', error);
    return NextResponse.json(
      { error: 'Cari hesap güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabaseClient();

    // Cari hesabın faturaları var mı kontrol et
    const { data: invoices } = await supabase!
      .from('invoices')
      .select('id')
      .eq('contact_id', params.id)
      .limit(1);

    if (invoices && invoices.length > 0) {
      return NextResponse.json(
        { error: 'Bu cari hesabın faturaları var, silinemez' },
        { status: 400 }
      );
    }

    // Cari hesabı sil
    const { error } = await supabase!
      .from('contacts')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Cari hesap silindi' });

  } catch (error) {
    console.error('Contact DELETE error:', error);
    return NextResponse.json(
      { error: 'Cari hesap silinemedi' },
      { status: 500 }
    );
  }
}
