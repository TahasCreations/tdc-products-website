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
    if (!body.code || !body.name || !body.type) {
      return NextResponse.json(
        { error: 'Hesap kodu, adı ve tipi gerekli' },
        { status: 400 }
      );
    }

    // Hesap kodu benzersizlik kontrolü (kendi ID'si hariç)
    const { data: existingAccount } = await supabase!
      .from('accounts')
      .select('id')
      .eq('code', body.code)
      .neq('id', params.id)
      .single();

    if (existingAccount) {
      return NextResponse.json(
        { error: 'Bu hesap kodu zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Hesabı güncelle
    const { data, error } = await supabase!
      .from('accounts')
      .update({
        code: body.code,
        name: body.name,
        type: body.type,
        parent_id: body.parent_id || null,
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
    console.error('Account PUT error:', error);
    return NextResponse.json(
      { error: 'Hesap güncellenemedi' },
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

    // Hesabın alt hesapları var mı kontrol et
    const { data: childAccounts } = await supabase!
      .from('accounts')
      .select('id')
      .eq('parent_id', params.id);

    if (childAccounts && childAccounts.length > 0) {
      return NextResponse.json(
        { error: 'Bu hesabın alt hesapları var, önce onları silin' },
        { status: 400 }
      );
    }

    // Hesabı sil
    const { error } = await supabase!
      .from('accounts')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Hesap silindi' });

  } catch (error) {
    console.error('Account DELETE error:', error);
    return NextResponse.json(
      { error: 'Hesap silinemedi' },
      { status: 500 }
    );
  }
}
