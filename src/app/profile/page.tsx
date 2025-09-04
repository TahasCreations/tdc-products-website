'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '../../components/Toast';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, updateProfile, signOut } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // Mevcut profil bilgilerini yükle
    if (user.user_metadata) {
      setProfileData({
        first_name: user.user_metadata.first_name || '',
        last_name: user.user_metadata.last_name || '',
        phone: user.user_metadata.phone || '',
        address: user.user_metadata.address || '',
        city: user.user_metadata.city || '',
        postal_code: user.user_metadata.postal_code || ''
      });
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await updateProfile({
        data: profileData
      });

      if (error) {
        addToast({
          type: 'error',
          title: 'Hata',
          message: error.message,
          duration: 5000
        });
      } else {
        addToast({
          type: 'success',
          title: 'Başarılı',
          message: 'Profil bilgileriniz güncellendi!',
          duration: 3000
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

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    addToast({
      type: 'success',
      title: 'Çıkış yapıldı',
      message: 'Başarıyla çıkış yaptınız'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profilim</h1>
              <p className="text-gray-600 mt-2">Hesap bilgilerinizi yönetin</p>
            </div>
            <Link
              href="/"
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>

          {/* Kullanıcı Bilgileri */}
          <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl shadow-lg">
              {user.user_metadata?.first_name ? 
                user.user_metadata.first_name.charAt(0).toUpperCase() : 
                user.email?.charAt(0).toUpperCase()
              }
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.user_metadata?.first_name && user.user_metadata?.last_name ? 
                  `${user.user_metadata.first_name} ${user.user_metadata.last_name}` : 
                  user.user_metadata?.full_name || 'Kullanıcı'
                }
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-600">Çevrimiçi</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Panel - Profil Formu */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Profil Bilgileri</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad *
                    </label>
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Adınız"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Soyad *
                    </label>
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Soyadınız"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+90 5XX XXX XX XX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adres
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Adres bilgileriniz"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Şehir
                    </label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Şehir"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posta Kodu
                    </label>
                    <input
                      type="text"
                      value={profileData.postal_code}
                      onChange={(e) => setProfileData(prev => ({ ...prev, postal_code: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Posta kodu"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    {loading ? 'Güncelleniyor...' : 'Profili Güncelle'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sağ Panel - Hızlı Erişim */}
          <div className="space-y-6">
            {/* Hesap Durumu */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Durumu</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">E-posta Doğrulama</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.email_confirmed_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.email_confirmed_at ? 'Doğrulandı' : 'Bekliyor'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Kayıt Tarihi</span>
                  <span className="text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Son Giriş</span>
                  <span className="text-sm text-gray-900">
                    {new Date(user.last_sign_in_at || user.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>

            {/* Hızlı Erişim */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Erişim</h3>
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i className="ri-shopping-bag-line text-blue-500"></i>
                  <span className="text-sm text-gray-700">Siparişlerim</span>
                </Link>
                
                <Link
                  href="/wishlist"
                  className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i className="ri-heart-line text-red-500"></i>
                  <span className="text-sm text-gray-700">Favorilerim</span>
                </Link>
                
                <Link
                  href="/blog/write"
                  className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <i className="ri-edit-line text-purple-500"></i>
                  <span className="text-sm text-gray-700">Blog Yaz</span>
                </Link>
              </div>
            </div>

            {/* Güvenlik */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Güvenlik</h3>
              <div className="space-y-3">
                <button className="w-full text-left flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <i className="ri-lock-line text-green-500"></i>
                  <span className="text-sm text-gray-700">Şifre Değiştir</span>
                </button>
                
                <button className="w-full text-left flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <i className="ri-shield-line text-blue-500"></i>
                  <span className="text-sm text-gray-700">İki Faktörlü Doğrulama</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

