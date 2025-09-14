'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '../../components/Toast';
import { useErrorToast } from '../../hooks/useErrorToast';
import { ApiWrapper } from '../../lib/api-wrapper';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const { handleAsyncOperation, showError } = useErrorToast();

  // Form değiştiğinde hataları temizle
  useEffect(() => {
    setErrors({});
  }, [isLogin, email, password, confirmPassword, firstName, lastName]);

  // Validasyon
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!email.trim()) {
      newErrors.email = 'E-posta adresi gerekli';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!password) {
      newErrors.password = 'Şifre gerekli';
    } else if (password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalı';
    }

    if (!isLogin) {
      if (!firstName.trim()) {
        newErrors.firstName = 'Ad gerekli';
      }
      if (!lastName.trim()) {
        newErrors.lastName = 'Soyad gerekli';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Şifreler eşleşmiyor';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          addToast({
            type: 'error',
            title: 'Giriş Hatası',
            message: error.message === 'Invalid login credentials' 
              ? 'E-posta veya şifre hatalı' 
              : error.message,
            duration: 5000
          });
        } else {
          addToast({
            type: 'success',
            title: 'Başarılı',
            message: 'Başarıyla giriş yaptınız!',
            duration: 3000
          });
          router.push('/');
        }
      } else {
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`
        });
        if (error) {
          addToast({
            type: 'error',
            title: 'Kayıt Hatası',
            message: error.message === 'User already registered' 
              ? 'Bu e-posta adresi zaten kayıtlı' 
              : error.message,
            duration: 5000
          });
        } else {
          addToast({
            type: 'success',
            title: 'Başarılı',
            message: 'Kayıt başarılı! E-posta adresinizi kontrol edin.',
            duration: 5000
          });
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setConfirmPassword('');
          setFirstName('');
          setLastName('');
        }
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Hata',
        message: 'Beklenmeyen bir hata oluştu.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setErrors({ email: 'E-posta adresi gerekli' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Geçerli bir e-posta adresi girin' });
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);

    if (error) {
      addToast({
        type: 'error',
        title: 'Hata',
        message: error.message,
        duration: 5000
      });
    } else {
      setResetEmailSent(true);
      addToast({
        type: 'success',
        title: 'Başarılı',
        message: 'Şifre sıfırlama e-postası gönderildi.',
        duration: 5000
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        addToast({
          type: 'error',
          title: 'Google Giriş Hatası',
          message: error.message,
          duration: 5000
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Hata',
        message: 'Beklenmeyen bir hata oluştu.',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    addToast({
      type: 'info',
      title: 'Yakında',
      message: `${provider} ile giriş yakında eklenecek!`,
      duration: 3000
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo ve Başlık */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
            <i className="ri-user-line text-white text-2xl"></i>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? (
              <>
                Hesabınız yok mu?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                >
                  Kayıt olun
                </button>
              </>
            ) : (
              <>
                Zaten hesabınız var mı?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                >
                  Giriş yapın
                </button>
              </>
            )}
          </p>
        </div>

        {/* Sosyal Medya Girişi */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="ri-google-fill text-red-500 text-xl mr-3"></i>
            <span className="text-gray-700 font-medium">
              {loading ? 'Yönlendiriliyor...' : 'Google ile devam et'}
            </span>
          </button>
          
          <button
            onClick={() => handleSocialLogin('Facebook')}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <i className="ri-facebook-fill text-blue-600 text-xl mr-3"></i>
            <span className="text-gray-700 font-medium">Facebook ile devam et</span>
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gradient-to-r from-blue-50 via-white to-purple-50 text-gray-500">
              veya
            </span>
          </div>
        </div>

        {/* Ana Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    Ad *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required={!isLogin}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Adınız"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Soyad *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required={!isLogin}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Soyadınız"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta Adresi *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="ornek@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 block w-full px-3 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Şifreniz"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <i className={`text-gray-400 hover:text-gray-600 ${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Şifre Tekrarı *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required={!isLogin}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`mt-1 block w-full px-3 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Şifrenizi tekrar girin"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <i className={`text-gray-400 hover:text-gray-600 ${showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}`}></i>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                >
                  Şifrenizi mi unuttunuz?
                </button>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  {isLogin ? 'Giriş yapılıyor...' : 'Kayıt olunuyor...'}
                </div>
              ) : (
                <div className="flex items-center">
                  <i className="ri-login-box-line mr-2"></i>
                  {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                </div>
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="font-medium text-gray-600 hover:text-gray-500 transition-colors"
            >
              <i className="ri-arrow-left-line mr-1"></i>
              Ana Sayfaya Dön
            </Link>
          </div>
        </form>

        {/* Şifre Sıfırlama Bildirimi */}
        {resetEmailSent && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <i className="ri-check-line text-green-400 text-lg"></i>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  Şifre sıfırlama e-postası gönderildi. E-posta kutunuzu kontrol edin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Güvenlik Bilgileri */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <i className="ri-shield-check-line text-blue-500 text-lg mt-0.5 mr-3"></i>
            <div>
              <h4 className="text-sm font-medium text-blue-900">Güvenlik</h4>
              <p className="text-xs text-blue-700 mt-1">
                Bilgileriniz SSL ile şifrelenir ve güvenle saklanır. 
                {!isLogin && ' Kayıt olduktan sonra e-posta adresinizi doğrulamanız gerekir.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
