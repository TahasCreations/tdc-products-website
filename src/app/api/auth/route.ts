import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AppErrorHandler, ErrorCodes, validateRequired, validateEmail } from '@/lib/error-handler';

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
  const result = await AppErrorHandler.withErrorHandling(async () => {
    const body = await request.json();
    const { action, email, password } = body;

    // Validation
    validateRequired(action, 'action');
    validateRequired(email, 'email');
    validateRequired(password, 'password');
    validateEmail(email);

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      throw new Error('Veritabanı bağlantısı kurulamadı');
    }

    if (action === 'login') {
      const { data, error } = await supabase!.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('E-posta veya şifre hatalı');
        }
        throw error;
      }

      return AppErrorHandler.createApiSuccessResponse({
        user: data.user,
        session: data.session
      });
    }

    if (action === 'logout') {
      const { error } = await supabase!.auth.signOut();

      if (error) {
        throw error;
      }

      return AppErrorHandler.createApiSuccessResponse(
        null,
        'Başarıyla çıkış yapıldı'
      );
    }

    if (action === 'register') {
      const { data, error } = await supabase!.auth.signUp({
        email,
        password
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('Bu e-posta adresi zaten kayıtlı');
        }
        throw error;
      }

      return AppErrorHandler.createApiSuccessResponse(
        { user: data.user },
        'Hesap oluşturuldu. Email doğrulaması gerekli.'
      );
    }

    throw new Error('Geçersiz işlem');
  }, 'Auth API');

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(result, { status: 400 });
  }
}

export async function GET() {
  const result = await AppErrorHandler.withErrorHandling(async () => {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      throw new Error('Veritabanı bağlantısı kurulamadı');
    }

    const { data: { user }, error } = await supabase!.auth.getUser();

    if (error) {
      throw error;
    }

    return AppErrorHandler.createApiSuccessResponse({ user });
  }, 'Auth GET API');

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(result, { status: 400 });
  }
}
