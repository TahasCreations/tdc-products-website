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

// Admin kullanıcıları listele
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { data: adminUsers, error } = await supabase
      .from('admin_users')
      .select('id, email, name, is_main_admin, is_active, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin users fetch error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Admin kullanıcıları alınamadı' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      adminUsers: adminUsers || []
    });

  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Yeni admin kullanıcı ekle
export async function POST(request: NextRequest) {
  try {
    const { email, name, password, isMainAdmin, createdBy } = await request.json();

    if (!email || !name || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'E-posta, isim ve şifre gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Şifreyi hash'le
    const passwordHash = await bcrypt.hash(password, 10);

    // Admin kullanıcı ekle
    const { data: newAdmin, error } = await supabase
      .from('admin_users')
      .insert({
        email,
        name,
        password_hash: passwordHash,
        is_main_admin: isMainAdmin || false,
        created_by: createdBy,
        is_active: true
      })
      .select('id, email, name, is_main_admin, is_active, created_at')
      .single();

    if (error) {
      console.error('Admin user creation error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Admin kullanıcı oluşturulamadı' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      admin: newAdmin
    });

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
    const { id, email, name, password, isMainAdmin, isActive } = await request.json();

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

    const updateData: any = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }
    if (typeof isMainAdmin === 'boolean') updateData.is_main_admin = isMainAdmin;
    if (typeof isActive === 'boolean') updateData.is_active = isActive;

    const { data: updatedAdmin, error } = await supabase
      .from('admin_users')
      .update(updateData)
      .eq('id', id)
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
