import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'E-posta ve şifre gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Admin kullanıcısını bul
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (fetchError || !adminUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz e-posta veya şifre' 
      }, { status: 401 });
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash);
    if (!isPasswordValid) {
      // Başarısız giriş denemesini kaydet
      await supabase
        .from('admin_users')
        .update({ 
          failed_login_attempts: adminUser.failed_login_attempts + 1,
          locked_until: adminUser.failed_login_attempts >= 4 ? 
            new Date(Date.now() + 30 * 60 * 1000).toISOString() : null // 30 dakika kilitle
        })
        .eq('id', adminUser.id);

      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz e-posta veya şifre' 
      }, { status: 401 });
    }

    // Hesap kilitli mi kontrol et
    if (adminUser.locked_until && new Date(adminUser.locked_until) > new Date()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Hesap geçici olarak kilitlendi. Lütfen daha sonra tekrar deneyin.' 
      }, { status: 423 });
    }

    // Başarılı giriş - son giriş bilgilerini güncelle
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    '127.0.0.1';

    const { error: updateError } = await supabase
      .from('admin_users')
      .update({
        last_login_at: new Date().toISOString(),
        last_login_ip: clientIP,
        login_count: adminUser.login_count + 1,
        failed_login_attempts: 0, // Başarılı girişte sıfırla
        locked_until: null // Kilidi kaldır
      })
      .eq('id', adminUser.id);

    if (updateError) {
      console.error('Admin login update error:', updateError);
    }

    // Aktivite logu kaydet
    await supabase
      .from('admin_activity_logs')
      .insert({
        admin_user_id: adminUser.id,
        action: 'LOGIN',
        ip_address: clientIP,
        user_agent: request.headers.get('user-agent'),
        details: { 
          login_method: 'password',
          success: true 
        }
      });

    // Güvenli admin bilgilerini döndür (şifre hash'i hariç)
    const { password_hash, ...safeAdminUser } = adminUser;

    return NextResponse.json({ 
      success: true,
      admin: {
        ...safeAdminUser,
        last_login_at: new Date().toISOString(),
        login_count: adminUser.login_count + 1
      }
    });

  } catch (error) {
    console.error('Admin login API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
