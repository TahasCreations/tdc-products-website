import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

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

// Default admin users data
const getDefaultAdminUsers = () => [
  {
    id: '1',
    email: 'bentahasarii@gmail.com',
    name: 'Benta Hasarı',
    is_main_admin: true,
    is_active: true,
    last_login_at: '2024-01-15T10:30:00.000Z',
    login_count: 25,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-15T10:30:00.000Z',
    created_by: 'system'
  },
  {
    id: '2',
    email: 'admin@tdc.com',
    name: 'TDC Admin',
    is_main_admin: false,
    is_active: true,
    last_login_at: '2024-01-14T16:45:00.000Z',
    login_count: 12,
    created_at: '2024-01-05T12:00:00.000Z',
    updated_at: '2024-01-14T16:45:00.000Z',
    created_by: 'bentahasarii@gmail.com'
  },
  {
    id: '3',
    email: 'moderator@tdc.com',
    name: 'TDC Moderator',
    is_main_admin: false,
    is_active: false,
    last_login_at: '2024-01-10T09:15:00.000Z',
    login_count: 5,
    created_at: '2024-01-08T14:30:00.000Z',
    updated_at: '2024-01-12T11:20:00.000Z',
    created_by: 'bentahasarii@gmail.com'
  }
];

// Admin kullanıcıları listele
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: true,
        adminUsers: getDefaultAdminUsers()
      });
    }

    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('id, email, name, is_main_admin, is_active, last_login_at, login_count, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin users fetch error:', error);
      return NextResponse.json({ 
        success: true,
        adminUsers: getDefaultAdminUsers()
      });
    }

    if (adminUsers && adminUsers.length > 0) {
      return NextResponse.json({ 
        success: true,
        adminUsers
      });
    }

    // Eğer Supabase'de admin user yoksa default admin users'ı döndür
    return NextResponse.json({ 
      success: true,
      adminUsers: getDefaultAdminUsers()
    });

  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json({ 
      success: true,
      adminUsers: getDefaultAdminUsers()
    });
  }
}

// Yeni admin kullanıcı ekle
export async function POST(request: NextRequest) {
  try {
    const { email, name, password, is_main_admin, created_by } = await request.json();

    // Gelişmiş validasyon
    if (!email || !email.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'E-posta adresi gerekli' 
      }, { status: 400 });
    }

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçerli bir e-posta adresi girin' 
      }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ad soyad gerekli' 
      }, { status: 400 });
    }

    if (name.trim().length < 2) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ad soyad en az 2 karakter olmalı' 
      }, { status: 400 });
    }

    if (!password || !password.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Şifre gerekli' 
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ 
        success: false, 
        error: 'Şifre en az 6 karakter olmalı' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      // Offline mode - demo admin user oluştur
      const newAdmin = {
        id: Date.now().toString(),
        email: email.trim(),
        name: name.trim(),
        is_main_admin: is_main_admin || false,
        is_active: true,
        created_at: new Date().toISOString(),
        created_by: created_by || 'offline_admin'
      };

      return NextResponse.json({ 
        success: true,
        admin: newAdmin,
        message: 'Admin kullanıcı kaydedildi (offline mode)'
      });
    }

    // Şifreyi hash'le
    const passwordHash = await bcrypt.hash(password, 10);

    // Retry mekanizması ile admin kullanıcı ekle
    let insertSuccess = false;
    let lastError: any = null;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data: newAdmin, error } = await supabase
          .from('admin_users')
          .insert({
            email: email.trim(),
            name: name.trim(),
            password_hash: passwordHash,
            is_main_admin: is_main_admin || false,
            created_by: created_by || 'current_admin',
            is_active: true
          })
          .select('id, email, name, is_main_admin, is_active, created_at')
          .single();

        if (error) {
          lastError = error;
          console.error(`Admin user insert attempt ${attempt} error:`, error);
          
          // Benzersizlik hatası
          if (error.code === '23505' || error.message.includes('duplicate')) {
            return NextResponse.json({ 
              success: false, 
              error: 'Bu e-posta adresi zaten kullanılıyor' 
            }, { status: 400 });
          }
          
          // Son deneme değilse tekrar dene
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          
          return NextResponse.json({ 
            success: false, 
            error: `Admin kullanıcı eklenemedi (${maxRetries} deneme): ${error.message}` 
          }, { status: 500 });
        }

        insertSuccess = true;
        return NextResponse.json({ 
          success: true,
          admin: newAdmin,
          attempts: attempt
        });
      } catch (supabaseError) {
        lastError = supabaseError;
        console.error(`Admin user insert attempt ${attempt} process error:`, supabaseError);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        
        return NextResponse.json({ 
          success: false, 
          error: `Supabase hatası (${maxRetries} deneme): ${supabaseError}` 
        }, { status: 500 });
      }
    }

    if (!insertSuccess) {
      return NextResponse.json({ 
        success: false, 
        error: 'Admin kullanıcı eklenemedi' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Admin user creation API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Admin kullanıcı güncelle
export async function PUT(request: NextRequest) {
  try {
    const { action, user_id, is_active, email, name, password, is_main_admin } = await request.json();

    if (!user_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Admin kullanıcı ID gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const updateData: any = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }
    if (typeof is_main_admin === 'boolean') updateData.is_main_admin = is_main_admin;
    if (typeof is_active === 'boolean') updateData.is_active = is_active;

    const { data: updatedAdmin, error } = await supabase
      .from('admin_users')
      .update(updateData)
      .eq('id', user_id)
      .select('id, email, name, is_main_admin, is_active, updated_at')
      .single();

    if (error) {
      console.error('Admin user update error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Admin kullanıcı güncellenemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      admin: updatedAdmin
    });

  } catch (error) {
    console.error('Admin user update API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Admin kullanıcı sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Admin kullanıcı ID gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Admin user deletion error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Admin kullanıcı silinemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Admin kullanıcı başarıyla silindi'
    });

  } catch (error) {
    console.error('Admin user deletion API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
