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
      // TODO: API endpoint'i oluşturulacak
      // const response = await fetch('/api/profile');
      // const data = await response.json();
      
      // Mock data for now
      const mockProfile: UserProfile = {
        id: '1',
        name: 'Ahmet Yılmaz',
		email: 'ahmet@example.com',
        phone: '+90 555 123 4567',
        address: 'Atatürk Mahallesi, 123. Sokak No:45',
				city: 'İstanbul',
        postalCode: '34000',
        avatar: '/avatars/default.jpg',
        role: 'USER',
        createdAt: '2024-01-15T10:30:00Z'
      };
      
      setProfile(mockProfile);
      setEditForm({
        name: mockProfile.name,
        phone: mockProfile.phone || '',
        address: mockProfile.address || '',
        city: mockProfile.city || '',
        postalCode: mockProfile.postalCode || ''
      });
    } catch (error) {
      console.error('Profil yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // TODO: API endpoint'i oluşturulacak
      // await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editForm)
      // });
      
      // Mock save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(prev => prev ? { ...prev, ...editForm } : null);
		setIsEditing(false);
      alert('Profil başarıyla güncellendi!');
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profil Bulunamadı</h2>
          <p className="text-gray-600">Profil bilgileriniz yüklenemedi.</p>
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
                      <span>{profile.phone || 'Belirtilmemiş'}</span>
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
                      <span>{profile.address || 'Belirtilmemiş'}</span>
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
                        <span>{profile.city || 'Belirtilmemiş'}</span>
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
                        <span>{profile.postalCode || 'Belirtilmemiş'}</span>
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