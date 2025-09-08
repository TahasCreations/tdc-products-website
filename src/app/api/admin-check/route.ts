import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'E-posta adresi gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Admin kullanıcıları tablosunda kontrol et
    const { data, error } = await supabase
      .from('admin_users')
      .select('email, is_active')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Admin check error:', error);
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'Admin kontrolü yapılamadı' 
      }, { status: 500 });
    }

    const isAdmin = !!data;

    return NextResponse.json({ 
      isAdmin,
      email: email
    });

  } catch (error) {
    console.error('Admin check API error:', error);
    return NextResponse.json({ 
      isAdmin: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
