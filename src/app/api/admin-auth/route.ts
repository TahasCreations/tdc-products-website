import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { getServerSupabaseClient } from '../../../lib/supabase-client';

export async function POST(request: NextRequest) {
  try {
    console.log('Admin auth API called');
    
    // Basit test için önce hardcoded kontrol
    const { email, password } = await request.json();
    console.log('Email:', email, 'Password:', password);

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'E-posta ve şifre gerekli' 
      }, { status: 400 });
    }

    // Test için basit kontrol
    if (email === 'bentahasarii@gmail.com' && password === '35sandalye') {
      return NextResponse.json({ 
        success: true,
        admin: {
          id: 'test-admin-id',
          email: 'bentahasarii@gmail.com',
          name: 'Benta Hasarı',
          is_main_admin: true,
          is_active: true
        }
      });
    }

    // Supabase kontrolü
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      console.error('Supabase client is null');
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }
    console.log('Supabase client created successfully');

    // Admin kullanıcıyı kontrol et
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (adminError) {
      console.error('Admin user query error:', adminError);
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı hatası: ' + adminError.message 
      }, { status: 500 });
    }
    
    if (!adminUser) {
      console.log('Admin user not found for email:', email);
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz admin kullanıcı' 
      }, { status: 401 });
    }
    
    console.log('Admin user found:', adminUser.email);

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
      error: 'Sunucu hatası: ' + error.message 
    }, { status: 500 });
  }
}
