export const runtime = 'nodejs';
 
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  // URL formatını kontrol et
  if (supabaseUrl.includes('your_supabase_project_url') || 
      supabaseUrl === 'your_supabase_project_url/' ||
      supabaseUrl === 'your_supabase_project_url' ||
      !supabaseUrl.startsWith('https://')) {
    console.error('Supabase URL is not configured properly:', supabaseUrl);
    return null;
  }
  
  try {
    return createClient(supabaseUrl, supabaseServiceKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};

// Default admin credentials for offline mode
const DEFAULT_ADMINS = [
  {
    id: '1',
    email: 'bentahasarii@gmail.com',
    password: '35sandalye', // Demo şifre (ana admin)
    name: 'Benta Hasarı',
    is_main_admin: true,
    is_active: true,
    login_count: 25,
    last_login_at: '2024-01-15T10:30:00.000Z'
  },
  {
    id: '2',
    email: 'admin@tdc.com',
    password: 'admin123',
    name: 'TDC Admin',
    is_main_admin: false,
    is_active: true,
    login_count: 12,
    last_login_at: '2024-01-14T16:45:00.000Z'
  }
];

export async function POST(request: NextRequest) {
  let email: string | undefined;
  let password: string | undefined;
  try {
    // Gövdeyi güvenli şekilde oku ve parse et
    const contentType = request.headers.get('content-type') || '';
    const rawBody = await request.text();
    let body: any = {};
    if (contentType.includes('application/json')) {
      try {
        body = rawBody ? JSON.parse(rawBody) : {};
      } catch (e) {
        return NextResponse.json({ success: false, error: 'Geçersiz JSON', detail: rawBody?.slice(0, 200) }, { status: 400 });
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams(rawBody);
      body = Object.fromEntries(params.entries());
    } else {
      // Diğer içerik tipleri için basit anahtar=değer denemesi
      try {
        body = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        const params = new URLSearchParams(rawBody);
        body = Object.fromEntries(params.entries());
      }
    }

    email = (body?.email || '').toString();
    password = (body?.password || '').toString();

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'E-posta ve şifre gerekli' 
      }, { status: 400 });
    }

    // Geliştirme ortamı için env kontrollü geçiş
    const devAdminEmail = process.env.DEV_ADMIN_EMAIL;
    const devAdminPassword = process.env.DEV_ADMIN_PASSWORD;
    const devBypassEnabled = process.env.DEV_ADMIN_BYPASS === 'true';

    if (process.env.NODE_ENV !== 'production' && devBypassEnabled && devAdminEmail && devAdminPassword) {
      if (email === devAdminEmail && password === devAdminPassword) {
        const safeAdmin = {
          id: 'dev-override',
          email: devAdminEmail,
          name: 'Developer Admin',
          is_main_admin: true,
          is_active: true,
          login_count: 1,
          last_login_at: new Date().toISOString()
        };
        return NextResponse.json({ success: true, admin: safeAdmin, message: 'Geliştirici girişi (env) başarılı' });
      }
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      // Offline mode - hem default hem de localStorage'dan admin credentials ile giriş
      
      // Önce default admin'leri kontrol et
      const defaultAdmin = DEFAULT_ADMINS.find(admin => 
        admin.email === email && admin.password === password && admin.is_active
      );

      if (defaultAdmin) {
        const { password: _, ...safeAdmin } = defaultAdmin;
        return NextResponse.json({ 
          success: true,
          admin: {
            ...safeAdmin,
            last_login_at: new Date().toISOString(),
            login_count: defaultAdmin.login_count + 1
          },
          message: 'Default admin girişi başarılı'
        });
      }

      // Default admin değilse, localStorage'dan admin kullanıcıları kontrol et
      // Bu kısım client-side'da localStorage'dan alınacak
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz e-posta veya şifre. Lütfen admin panelinden kullanıcı eklediğinizden emin olun.' 
      }, { status: 401 });
    }

    // Admin kullanıcısını bul
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (fetchError || !adminUser) {
      // Supabase'de bulunamazsa, default admin fallback dene (dev/test kolaylığı)
      const defaultAdmin = DEFAULT_ADMINS.find(a => a.email === email && a.password === password && a.is_active);
      if (defaultAdmin) {
        const { password: _p, ...safeAdmin } = defaultAdmin;
        return NextResponse.json({
          success: true,
          admin: {
            ...safeAdmin,
            last_login_at: new Date().toISOString(),
            login_count: defaultAdmin.login_count + 1
          },
          message: 'Default admin (fallback) ile giriş başarılı'
        });
      }
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz e-posta veya şifre' 
      }, { status: 401 });
    }

    // Şifre hash'i yoksa (ör. seed edilmemiş DB), development'ta güvenli bypass sağla
    if (!adminUser.password_hash) {
      const canBypass = process.env.NODE_ENV !== 'production' && (
        (devBypassEnabled && devAdminEmail === email && devAdminPassword === password) ||
        (email === 'bentahasarii@gmail.com' && password === '35sandalye')
      );
      if (canBypass) {
        const { password_hash: _ph, ...safeAdminUser } = adminUser;
        return NextResponse.json({
          success: true,
          admin: {
            ...safeAdminUser,
            last_login_at: new Date().toISOString(),
            login_count: (adminUser.login_count || 0) + 1
          },
          message: 'Development bypass ile giriş başarılı'
        });
      }
      return NextResponse.json({ success: false, error: 'Geçersiz e-posta veya şifre' }, { status: 401 });
    }

    // Şifre kontrolü (dinamik import ile güvenli)
    let bcryptLib: any;
    try {
      bcryptLib = await import('bcrypt');
    } catch (e) {
      console.error('bcrypt import error:', e);
      return NextResponse.json({ success: false, error: 'Şifre doğrulama hatası' }, { status: 500 });
    }
    const isPasswordValid = await bcryptLib.compare(password, adminUser.password_hash);
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

  } catch (error: any) {
    console.error('Admin login API error:', error);
    // Son bir fallback olarak, default admin ile dene
    try {
      if (email && password) {
        const defaultAdmin = DEFAULT_ADMINS.find(a => a.email === email && a.password === password && a.is_active);
        if (defaultAdmin) {
          const { password: _p, ...safeAdmin } = defaultAdmin;
          return NextResponse.json({
            success: true,
            admin: {
              ...safeAdmin,
              last_login_at: new Date().toISOString(),
              login_count: defaultAdmin.login_count + 1
            },
            message: 'Default admin (catch-fallback) ile giriş başarılı'
          });
        }
      }
    } catch {}
    const detail = process.env.NODE_ENV !== 'production' ? String(error?.message || error) : undefined;
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası',
      detail
    }, { status: 500 });
  }
}
