'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon,
  StarIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function BecomeSellerPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: '',
    website: '',
    description: '',
    experience: '',
    products: '',
    monthlyVolume: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form gönderimi burada yapılacak
    console.log('Satıcı başvurusu:', formData);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const benefits = [
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Global Erişim",
      description: "Dünya çapında milyonlarca müşteriye ulaşın"
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Detaylı Analitikler",
      description: "Satış performansınızı takip edin ve optimize edin"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Güvenli Ödeme",
      description: "Güvenli ödeme sistemi ile güvenle satış yapın"
    },
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: "Kargo Desteği",
      description: "Entegre kargo sistemi ile kolay teslimat"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Müşteri Desteği",
      description: "7/24 müşteri hizmetleri desteği"
    },
    {
      icon: <CurrencyDollarIcon className="w-8 h-8" />,
      title: "Rekabetçi Komisyon",
      description: "Piyasadaki en düşük komisyon oranları"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              TDC Market'te Satıcı Olun
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Dünya çapında milyonlarca müşteriye ulaşın ve işinizi büyütün
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Hemen Başvur
              </button>
              <Link 
                href="/seller-dashboard" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Satıcı Paneli
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden TDC Market?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TDC Market ile işinizi büyütmenin avantajlarını keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-blue-600 mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">10M+</div>
              <div className="text-gray-300">Aktif Müşteri</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">50K+</div>
              <div className="text-gray-300">Doğrulanmış Satıcı</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">100M+</div>
              <div className="text-gray-300">Ürün Çeşidi</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">190+</div>
              <div className="text-gray-300">Ülke</div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Satıcı Başvuru Formu
              </h2>
              <p className="text-gray-600">
                TDC Market'te satıcı olmak için aşağıdaki formu doldurun
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İşletme Adı *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="İşletme adınızı girin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İletişim Kişisi *
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    required
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Adınız ve soyadınız"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+90 555 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İşletme Türü *
                  </label>
                  <select
                    name="businessType"
                    required
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seçiniz</option>
                    <option value="individual">Bireysel</option>
                    <option value="company">Şirket</option>
                    <option value="cooperative">Kooperatif</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.ornek.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  İşletme Açıklaması *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="İşletmeniz hakkında kısa bir açıklama yazın"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-ticaret Deneyimi
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seçiniz</option>
                    <option value="beginner">Yeni Başlayan</option>
                    <option value="intermediate">Orta Seviye</option>
                    <option value="advanced">İleri Seviye</option>
                    <option value="expert">Uzman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aylık Satış Hacmi
                  </label>
                  <select
                    name="monthlyVolume"
                    value={formData.monthlyVolume}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seçiniz</option>
                    <option value="0-1000">0 - 1.000 TL</option>
                    <option value="1000-5000">1.000 - 5.000 TL</option>
                    <option value="5000-10000">5.000 - 10.000 TL</option>
                    <option value="10000+">10.000+ TL</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Satacağınız Ürün Kategorileri *
                </label>
                <textarea
                  name="products"
                  required
                  rows={3}
                  value={formData.products}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Satacağınız ürün kategorilerini yazın (örn: Elektronik, Giyim, Ev & Yaşam)"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Kullanım Şartları
                  </Link> ve{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Gizlilik Politikası
                  </Link>'nı okudum ve kabul ediyorum.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Başvuruyu Gönder
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4">
            <div className="text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Başvurunuz Alındı!
              </h3>
              <p className="text-gray-600 mb-6">
                Başvurunuz başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
