import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Kullanıcıları getir (admin için)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    let query = supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    // Arama filtresi
    if (search) {
      query = query.or(`email.ilike.%${search}%, first_name.ilike.%${search}%, last_name.ilike.%${search}%`);
    }

    // Sayfalama
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: users, error, count } = await query;

    if (error) {
      console.error('Users fetch error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Kullanıcılar alınamadı' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      users: users || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Kullanıcı profilini güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, updates } = body;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { data: updatedUser, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update user error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Kullanıcı güncellenemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser
    });

  } catch (error) {
    console.error('Users PUT API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Kullanıcıyı sil (admin için)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kullanıcı ID gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Auth kullanıcısını sil (bu da user_profiles'ı otomatik siler)
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Delete user error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Kullanıcı silinemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Kullanıcı başarıyla silindi'
    });

  } catch (error) {
    console.error('Users DELETE API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
