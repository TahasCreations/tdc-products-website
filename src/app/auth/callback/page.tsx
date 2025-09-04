'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase environment variables are missing');
        router.push('/auth?error=configuration');
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/auth?error=callback_error');
          return;
        }

        if (data.session) {
          // Başarılı giriş
          router.push('/?success=login');
        } else {
          // Session bulunamadı
          router.push('/auth?error=no_session');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        router.push('/auth?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg mb-4">
          <i className="ri-loader-4-line text-white text-2xl animate-spin"></i>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Giriş yapılıyor...
        </h2>
        <p className="text-gray-600">
          Lütfen bekleyin, Google hesabınızla giriş yapılıyor.
        </p>
      </div>
    </div>
  );
}
