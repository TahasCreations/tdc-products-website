'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Giriş yapılıyor...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase environment variables are missing');
        setStatus('Yapılandırma hatası');
        setTimeout(() => router.push('/auth?error=configuration'), 2000);
        return;
      }

      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      try {
        setStatus('Session kontrol ediliyor...');
        
        // URL'den hash fragment'ı al
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          // Token'ları session'a set et
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error('Session set error:', error);
            setStatus('Session hatası');
            setTimeout(() => router.push('/auth?error=session_error'), 2000);
            return;
          }
          
          if (data.session) {
            setStatus('Başarıyla giriş yapıldı!');
            setTimeout(() => router.push('/?success=login'), 1000);
            return;
          }
        }
        
        // Fallback: mevcut session'ı kontrol et
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('Giriş hatası');
          setTimeout(() => router.push('/auth?error=callback_error'), 2000);
          return;
        }

        if (data.session) {
          setStatus('Başarıyla giriş yapıldı!');
          setTimeout(() => router.push('/?success=login'), 1000);
        } else {
          setStatus('Session bulunamadı');
          setTimeout(() => router.push('/auth?error=no_session'), 2000);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setStatus('Beklenmeyen hata');
        setTimeout(() => router.push('/auth?error=unexpected'), 2000);
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
          {status}
        </h2>
        <p className="text-gray-600">
          Lütfen bekleyin, hesabınızla giriş yapılıyor.
        </p>
      </div>
    </div>
  );
}
