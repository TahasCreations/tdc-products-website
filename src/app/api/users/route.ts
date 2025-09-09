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

    // Filtreler
    const provider = searchParams.get('provider') || 'all';
    const status = searchParams.get('status') || 'all';
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    let query = supabase
      .from('users')
      .select(`
        *,
        orders:orders(count),
        order_totals:orders(sum:total_amount)
      `);

    // Arama filtresi
    if (search) {
      query = query.or(`email.ilike.%${search}%, first_name.ilike.%${search}%, last_name.ilike.%${search}%, phone.ilike.%${search}%`);
    }

    // Provider filtresi
    if (provider !== 'all') {
      query = query.eq('provider', provider);
    }

    // Status filtresi
    if (status !== 'all') {
      query = query.eq('is_active', status === 'active');
    }

    // Sıralama
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data: users, error } = await query;

    if (error) {
      console.error('Users fetch error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Kullanıcılar alınamadı' 
      }, { status: 500 });
    }

    // İstatistikleri hesapla
    const { data: allUsers, error: statsError } = await supabase
      .from('users')
      .select('id, provider, is_active, newsletter_subscription, created_at');

    if (statsError) {
      console.error('Stats fetch error:', statsError);
    }

    const stats = {
      totalUsers: allUsers?.length || 0,
      activeUsers: allUsers?.filter(u => u.is_active).length || 0,
      googleUsers: allUsers?.filter(u => u.provider === 'google').length || 0,
      emailUsers: allUsers?.filter(u => u.provider === 'email').length || 0,
      newsletterSubscribers: allUsers?.filter(u => u.newsletter_subscription).length || 0,
      newUsersThisMonth: allUsers?.filter(u => {
        const userDate = new Date(u.created_at);
        const monthStart = new Date();
        monthStart.setDate(1);
        return userDate >= monthStart;
      }).length || 0,
      averageOrdersPerUser: 0,
      topSpenders: []
    };

    // Top spenders için ayrı sorgu
    const { data: topSpenders, error: topSpendersError } = await supabase
      .from('users')
      .select(`
        id, first_name, last_name, email,
        orders:orders(sum:total_amount)
      `)
      .order('orders.sum', { ascending: false })
      .limit(5);

    if (!topSpendersError && topSpenders) {
      stats.topSpenders = topSpenders.map(user => ({
        ...user,
        total_spent: user.orders?.[0]?.sum || 0,
        total_orders: user.orders?.length || 0
      }));
    }

    return NextResponse.json({
      success: true,
      users: users || [],
      stats
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
    const { error } = await supabase!.auth.admin.deleteUser(userId);

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
