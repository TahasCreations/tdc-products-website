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
  
  // URL formatını kontrol et
  if (supabaseUrl.includes('your_supabase_project_url') || 
      supabaseUrl === 'your_supabase_project_url/' ||
      supabaseUrl === 'your_supabase_project_url' ||
      !supabaseUrl.startsWith('https://')) {
    console.error('Supabase URL is not configured properly:', supabaseUrl);
    return null;
  }
  
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};

// Default demo users for offline mode
const DEMO_USERS = [
  {
    id: 'demo-user-1',
    email: 'demo@tdc.com',
    password: 'demo123',
    name: 'Demo User',
    avatar_url: null,
    created_at: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'demo-user-2', 
    email: 'test@tdc.com',
    password: 'test123',
    name: 'Test User',
    avatar_url: null,
    created_at: '2024-01-01T00:00:00.000Z'
  }
];

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
      // Offline mode authentication
      if (action === 'login') {
        const user = DEMO_USERS.find(u => u.email === email && u.password === password);
        if (user) {
          const { password: _, ...safeUser } = user;
          return AppErrorHandler.createApiSuccessResponse({
            user: safeUser,
            session: { access_token: 'demo-token', user: safeUser }
          }, 'Demo mode girişi başarılı');
        } else {
          throw new Error('E-posta veya şifre hatalı (demo mode)');
        }
      }
      
      if (action === 'register') {
        // Demo mode'da yeni kullanıcı oluştur
        const newUser = {
          id: `demo-user-${Date.now()}`,
          email: email,
          password: password,
          name: email.split('@')[0],
          avatar_url: null,
          created_at: new Date().toISOString()
        };
        
        const { password: _, ...safeUser } = newUser;
        return AppErrorHandler.createApiSuccessResponse(
          { user: safeUser },
          'Demo hesap oluşturuldu'
        );
      }
      
      if (action === 'logout') {
        return AppErrorHandler.createApiSuccessResponse(
          null,
          'Demo mode çıkışı başarılı'
        );
      }
      
      throw new Error('Demo mode - Geçersiz işlem');
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
