import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Güvenlik ayarlarını çek
    const { data, error } = await supabase!
      .from('system_settings')
      .select('*')
      .like('key', 'security_%');

    if (error) {
      throw error;
    }

    // Ayarları obje formatına çevir
    const settings = data?.reduce((acc: any, setting: any) => {
      const key = setting.key.replace('security_', '');
      acc[key] = setting.value;
      return acc;
    }, {}) || {};

    return NextResponse.json(settings);

  } catch (error) {
    console.error('Security settings GET error:', error);
    return NextResponse.json(
      { error: 'Güvenlik ayarları alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Güvenlik ayarlarını kaydet
    const settings = [
      { key: 'security_password_min_length', value: body.password_min_length?.toString() || '8' },
      { key: 'security_password_require_uppercase', value: body.password_require_uppercase?.toString() || 'true' },
      { key: 'security_password_require_lowercase', value: body.password_require_lowercase?.toString() || 'true' },
      { key: 'security_password_require_numbers', value: body.password_require_numbers?.toString() || 'true' },
      { key: 'security_password_require_symbols', value: body.password_require_symbols?.toString() || 'false' },
      { key: 'security_session_timeout', value: body.session_timeout?.toString() || '480' },
      { key: 'security_max_login_attempts', value: body.max_login_attempts?.toString() || '5' },
      { key: 'security_lockout_duration', value: body.lockout_duration?.toString() || '30' },
      { key: 'security_mfa_enabled', value: body.mfa_enabled?.toString() || 'false' },
      { key: 'security_audit_log_retention', value: body.audit_log_retention?.toString() || '365' }
    ];

    // Ayarları güncelle veya ekle
    for (const setting of settings) {
      const { data: existingSetting } = await supabase!
        .from('system_settings')
        .select('id')
        .eq('key', setting.key)
        .single();

      if (existingSetting) {
        // Güncelle
        await supabase!!
          .from('system_settings')
          .update({
            value: setting.value,
            updated_at: new Date().toISOString()
          })
          .eq('key', setting.key);
      } else {
        // Ekle
        await supabase!!
          .from('system_settings')
          .insert([{
            key: setting.key,
            value: setting.value,
            description: `Güvenlik ayarı: ${setting.key}`,
            category: 'SECURITY',
            company_id: '550e8400-e29b-41d4-a716-446655440000'
          }]);
      }
    }

    // Audit log kaydet
    await supabase!
      .from('audit_logs')
      .insert([{
        user_id: 'admin', // TODO: Gerçek kullanıcı bilgisi
        user_email: 'admin@system.com',
        action: 'UPDATE',
        table_name: 'system_settings',
        record_id: 'security_settings',
        old_values: null,
        new_values: body,
        ip_address: request.ip || '127.0.0.1',
        user_agent: request.headers.get('user-agent') || 'Unknown',
        company_id: '550e8400-e29b-41d4-a716-446655440000'
      }]);

    return NextResponse.json({ message: 'Güvenlik ayarları kaydedildi' });

  } catch (error) {
    console.error('Security settings POST error:', error);
    return NextResponse.json(
      { error: 'Güvenlik ayarları kaydedilemedi' },
      { status: 500 }
    );
  }
}
