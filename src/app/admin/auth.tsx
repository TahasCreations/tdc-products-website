'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Auth işlemi başlatılıyor...');

      if (isSignUp) {
        console.log('Kayıt işlemi başlatılıyor...');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        console.log('Kayıt sonucu:', { data, error });
        
        if (error) throw error;
        
        if (data.user && data.session) {
          setError('Kayıt başarılı! Giriş yapıldı.');
          onLogin();
        } else {
          setError('Kayıt başarılı! E-posta adresinizi kontrol edin.');
        }
      } else {
        console.log('Giriş işlemi başlatılıyor...');
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        console.log('Giriş sonucu:', { data, error });
        
        if (error) throw error;
        
        if (data.user && data.session) {
          setError('Giriş başarılı!');
          onLogin();
        } else {
          throw new Error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        }
      }
    } catch (error: any) {
      console.error('Auth hatası:', error);
      
      // Hata mesajını daha kullanıcı dostu hale getir
      let errorMessage = error.message;
      
      if (error.message.includes('fetch')) {
        errorMessage = 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.';
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Geçersiz e-posta veya şifre.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'E-posta adresiniz henüz onaylanmamış. Lütfen e-postanızı kontrol edin.';
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'Bu e-posta adresi zaten kayıtlı.';
      } else if (error.message.includes('environment variables')) {
        errorMessage = 'Supabase yapılandırması eksik. Lütfen environment variables\'ları kontrol edin.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Girişi</h1>
            <p className="text-gray-600">TDC Products Yönetim Paneli</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Şifreniz"
              />
            </div>

            {error && (
              <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                error.includes('başarılı') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <i className={`${error.includes('başarılı') ? 'ri-check-line text-green-500' : 'ri-error-warning-line text-red-500'}`}></i>
                <span className={error.includes('başarılı') ? 'text-green-700' : 'text-red-700'}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  İşleniyor...
                </div>
              ) : (
                isSignUp ? 'Kayıt Ol' : 'Giriş Yap'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-orange-600 hover:text-orange-700 text-sm"
            >
              {isSignUp ? 'Zaten hesabın var mı? Giriş yap' : 'Hesabın yok mu? Kayıt ol'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-semibold mb-2">Demo Hesap:</p>
            <p className="text-sm text-blue-700">E-posta: <strong>admin@tdc.com</strong></p>
            <p className="text-sm text-blue-700">Şifre: <strong>admin123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
