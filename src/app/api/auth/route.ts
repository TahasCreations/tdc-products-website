import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Server-side Supabase client
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
    const body = await request.json();
    const { action, email, password } = body;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    if (action === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return NextResponse.json({ 
          success: false, 
          error: error.message 
        }, { status: 400 });
      }

      return NextResponse.json({ 
        success: true, 
        user: data.user,
        session: data.session
      });
    }

    if (action === 'logout') {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return NextResponse.json({ 
          success: false, 
          error: error.message 
        }, { status: 400 });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Başarıyla çıkış yapıldı' 
      });
    }

    if (action === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        return NextResponse.json({ 
          success: false, 
          error: error.message 
        }, { status: 400 });
      }

      return NextResponse.json({ 
        success: true, 
        user: data.user,
        message: 'Hesap oluşturuldu. Email doğrulaması gerekli.' 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz işlem' 
    }, { status: 400 });

  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      user: user 
    });

  } catch (error) {
    console.error('Auth GET error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
