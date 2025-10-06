"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit, Save, X, Camera, Shield, Package, Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
	const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

	useEffect(() => {
    fetchProfile();
  }, [session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!session?.user?.email) {
        setProfile(null);
        return;
      }

      // Gerçek kullanıcı verilerini kullan
      const userProfile: UserProfile = {
        id: session.user.id || '1',
        name: session.user.name || 'Kullanıcı',
        email: session.user.email,
        phone: '', // Kullanıcı henüz telefon eklememiş
        address: '', // Kullanıcı henüz adres eklememiş
        city: '', // Kullanıcı henüz şehir eklememiş
        postalCode: '', // Kullanıcı henüz posta kodu eklememiş
        avatar: session.user.image || undefined,
        role: 'USER', // Default role
        createdAt: new Date().toISOString()
      };
      
      setProfile(userProfile);
      setEditForm({
        name: userProfile.name,
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        city: userProfile.city || '',
        postalCode: userProfile.postalCode || ''
      });
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // TODO: Gerçek API endpoint'i oluşturulacak
      // await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editForm)
      // });
      
      // Şimdilik local state'i güncelle
      setProfile(prev => prev ? { ...prev, ...editForm } : null);
      setIsEditing(false);
      
      // Başarı mesajı
      alert('Profil bilgileri kaydedildi! (Demo modunda - gerçek API entegrasyonu eklenecek)');
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      alert('Profil güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: profile?.name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
      postalCode: profile?.postalCode || ''
    });
    setIsEditing(false);
  };

  if (loading) {
	return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135]"></div>
							</div>
    );
  }

  // Giriş yapmamış kullanıcılar için
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giriş Yapın</h2>
          <p className="text-gray-600 mb-6">Profil sayfanızı görüntülemek için giriş yapmanız gerekiyor.</p>
          <a
            href="/auth/signin"
            className="inline-flex items-center px-6 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-medium"
          >
            Giriş Yap
          </a>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Profil bilgileriniz yüklenemedi. Lütfen sayfayı yenileyin.</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-6 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-medium"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profilim</h1>
          <p className="text-gray-600">Kişisel bilgilerinizi yönetin</p>
          
          {/* Demo Mode Notice */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Demo Modunda Çalışıyor
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Bu profil sayfası demo modunda çalışmaktadır. Gerçek verileriniz Google hesabınızdan alınmaktadır. 
                    Ek bilgilerinizi düzenlemek için "Düzenle" butonunu kullanabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              {/* Avatar */}
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#CBA135] rounded-full flex items-center justify-center text-white hover:bg-[#B8941F] transition-colors">
                  <Camera className="w-4 h-4" />
										</button>
					</div>

              {/* User Info */}
              <h2 className="text-xl font-semibold text-gray-900 mb-1">{profile.name}</h2>
              <p className="text-gray-600 mb-2">{profile.email}</p>
              
              {/* Role Badge */}
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm mb-4">
                <Shield className="w-4 h-4" />
                {profile.role === 'USER' ? 'Müşteri' : 
                 profile.role === 'SELLER' ? 'Satıcı' :
                 profile.role === 'INFLUENCER' ? 'Influencer' : 'Admin'}
										</div>

              {/* Stats */}
              <div className="space-y-2 text-sm text-gray-600">
                <p>Üye olma tarihi: {new Date(profile.createdAt).toLocaleDateString('tr-TR')}</p>
									</div>

              {/* Edit Button */}
											<button
                onClick={() => setIsEditing(true)}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors"
											>
                <Edit className="w-4 h-4" />
                Düzenle
											</button>
										</div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Kişisel Bilgiler</h2>
                {isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Kaydediliyor...' : 'Kaydet'}
															</button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                      İptal
															</button>
									</div>
								)}
											</div>

              <div className="space-y-6">
                {/* Name */}
													<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                  {isEditing ? (
														<input
															type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{profile.name}</span>
												</div>
											)}
											</div>

                {/* Email */}
											<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{profile.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">E-posta adresi değiştirilemez</p>
											</div>

                {/* Phone */}
												<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  {isEditing ? (
													<input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-900">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{profile.phone || 'Henüz eklenmedi'}</span>
                      {!profile.phone && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          Düzenle butonuna tıklayarak ekleyin
                        </span>
                      )}
									</div>
								)}
										</div>

                {/* Address */}
													<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                  {isEditing ? (
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-start gap-2 text-gray-900">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <span>{profile.address || 'Henüz eklenmedi'}</span>
                      {!profile.address && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">
                          Düzenle butonuna tıklayarak ekleyin
                        </span>
                      )}
													</div>
                  )}
												</div>

                {/* City & Postal Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                    {isEditing ? (
														<input
															type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{profile.city || 'Henüz eklenmedi'}</span>
                        {!profile.city && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">
                            Düzenle
                          </span>
                        )}
                      </div>
													)}
												</div>

												<div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
                    {isEditing ? (
															<input
																type="text"
                        value={editForm.postalCode}
                        onChange={(e) => setEditForm(prev => ({ ...prev, postalCode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{profile.postalCode || 'Henüz eklenmedi'}</span>
                        {!profile.postalCode && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full ml-2">
                            Düzenle
                          </span>
                        )}
											</div>
										)}
									</div>
													</div>
												</div>
											</div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/orders"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#CBA135] hover:bg-[#CBA135]/5 transition-colors"
                >
                  <Package className="w-6 h-6 text-[#CBA135]" />
                  <div>
                    <h4 className="font-medium text-gray-900">Siparişlerim</h4>
                    <p className="text-sm text-gray-600">Sipariş geçmişi</p>
												</div>
                </a>

                <a
                  href="/wishlist"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#CBA135] hover:bg-[#CBA135]/5 transition-colors"
                >
                  <Heart className="w-6 h-6 text-[#CBA135]" />
                  <div>
                    <h4 className="font-medium text-gray-900">Favorilerim</h4>
                    <p className="text-sm text-gray-600">Beğendiğin ürünler</p>
													</div>
                </a>

                <a
                  href="/settings"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-[#CBA135] hover:bg-[#CBA135]/5 transition-colors"
                >
                  <Shield className="w-6 h-6 text-[#CBA135]" />
                  <div>
                    <h4 className="font-medium text-gray-900">Güvenlik</h4>
                    <p className="text-sm text-gray-600">Şifre ve güvenlik</p>
										</div>
                </a>
									</div>
            </motion.div>
          </motion.div>
				</div>
			</div>
		</div>
	);
}