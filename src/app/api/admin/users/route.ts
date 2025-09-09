import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Admin kullanıcılarını çek
    const { data, error } = await supabase!!
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Admin users GET error:', error);
    return NextResponse.json(
      { error: 'Admin kullanıcıları alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.email || !body.name || !body.role) {
      return NextResponse.json(
        { error: 'E-posta, ad ve rol gerekli' },
        { status: 400 }
      );
    }

    // E-posta zaten var mı kontrol et
    const { data: existingUser } = await supabase!
      .from('admin_users')
      .select('id')
      .eq('email', body.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Rol bazlı varsayılan yetkiler
    const defaultPermissions = {
      owner: ['all'],
      accountant: ['read', 'write', 'reports'],
      cashier: ['read', 'write'],
      auditor: ['read', 'reports'],
      viewer: ['read']
    };

    // Yeni admin kullanıcı ekle
    const { data, error } = await supabase!
      .from('admin_users')
      .insert([{
        email: body.email,
        name: body.name,
        role: body.role,
        permissions: body.permissions || defaultPermissions[body.role as keyof typeof defaultPermissions] || ['read'],
        is_main_admin: false,
        is_active: body.is_active !== undefined ? body.is_active : true,
        company_id: '550e8400-e29b-41d4-a716-446655440000', // Varsayılan şirket
        created_by: 'admin' // TODO: Gerçek kullanıcı bilgisi
      }])
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
        action: 'INSERT',
        table_name: 'admin_users',
        record_id: data.id,
        old_values: null,
        new_values: data,
        ip_address: request.ip || '127.0.0.1',
        user_agent: request.headers.get('user-agent') || 'Unknown',
        company_id: '550e8400-e29b-41d4-a716-446655440000'
      }]);

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Admin users POST error:', error);
    return NextResponse.json(
      { error: 'Admin kullanıcısı eklenemedi' },
      { status: 500 }
    );
  }
}
