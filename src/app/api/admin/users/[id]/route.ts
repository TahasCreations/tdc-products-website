import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Eski kullanıcı bilgilerini al
    const { data: oldUser } = await supabase!
      .from('admin_users')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!oldUser) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Ana admin kontrolü
    if (oldUser.is_main_admin && body.role !== 'owner') {
      return NextResponse.json(
        { error: 'Ana admin kullanıcısının rolü değiştirilemez' },
        { status: 400 }
      );
    }

    // Kullanıcıyı güncelle
    const { data, error } = await supabase!
      .from('admin_users')
      .update({
        name: body.name,
        role: body.role,
        permissions: body.permissions,
        is_active: body.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Audit log kaydet
    await supabase!
      .from('audit_logs')
      .insert([{
        user_id: 'admin', // TODO: Gerçek kullanıcı bilgisi
        user_email: 'admin@system.com',
        action: 'UPDATE',
        table_name: 'admin_users',
        record_id: params.id,
        old_values: oldUser,
        new_values: data,
        ip_address: request.ip || '127.0.0.1',
        user_agent: request.headers.get('user-agent') || 'Unknown',
        company_id: '550e8400-e29b-41d4-a716-446655440000'
      }]);

    return NextResponse.json(data);

  } catch (error) {
    console.error('Admin user PUT error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı güncellenemedi' },
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

    // Kullanıcı bilgilerini al
    const { data: user } = await supabase!
      .from('admin_users')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Ana admin kontrolü
    if (user.is_main_admin) {
      return NextResponse.json(
        { error: 'Ana admin kullanıcısı silinemez' },
        { status: 400 }
      );
    }

    // Kullanıcıyı sil
    const { error } = await supabase!
      .from('admin_users')
      .delete()
      .eq('id', params.id);

    if (error) {
      throw error;
    }

    // Audit log kaydet
    await supabase!
      .from('audit_logs')
      .insert([{
        user_id: 'admin', // TODO: Gerçek kullanıcı bilgisi
        user_email: 'admin@system.com',
        action: 'DELETE',
        table_name: 'admin_users',
        record_id: params.id,
        old_values: user,
        new_values: null,
        ip_address: request.ip || '127.0.0.1',
        user_agent: request.headers.get('user-agent') || 'Unknown',
        company_id: '550e8400-e29b-41d4-a716-446655440000'
      }]);

    return NextResponse.json({ message: 'Kullanıcı silindi' });

  } catch (error) {
    console.error('Admin user DELETE error:', error);
    return NextResponse.json(
      { error: 'Kullanıcı silinemedi' },
      { status: 500 }
    );
  }
}
