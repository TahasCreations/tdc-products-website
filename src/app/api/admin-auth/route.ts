import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSupabaseClient } from '../../../lib/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'E-posta ve şifre gerekli' 
      }, { status: 400 });
    }

    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Admin kullanıcıyı kontrol et
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (adminError || !adminUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz admin kullanıcı' 
      }, { status: 401 });
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, adminUser.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz şifre' 
      }, { status: 401 });
    }

    // Admin kullanıcı bilgilerini döndür (şifre hash'i hariç)
    const { password_hash, ...adminData } = adminUser;

    return NextResponse.json({ 
      success: true,
      admin: adminData
    });

  } catch (error) {
    console.error('Admin auth API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
