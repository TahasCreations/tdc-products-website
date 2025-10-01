'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function PromotionsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const adminAuth = document.cookie.includes('adminAuth=true');
    if (adminAuth) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      router.push('/admin');
    }
  }, [router]);

  const promotions = [
    {
      id: 'PROMO-001',
      name: 'Yılbaşı İndirimi',
      type: 'percentage',
      value: 20,
      code: 'YILBASI20',
      status: 'active',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      usage: 45,
      limit: 100,
      minAmount: 500
    },
    {
      id: 'PROMO-002',
      name: 'Ücretsiz Kargo',
      type: 'free_shipping',
      value: 0,
      code: 'KARGO',
      status: 'active',
      startDate: '2024-11-01',
      endDate: '2024-12-31',
      usage: 23,
      limit: 50,
      minAmount: 200
    },
    {
      id: 'PROMO-003',
      name: 'Sabit İndirim',
      type: 'fixed',
      value: 100,
      code: '100TL',
      status: 'expired',
      startDate: '2024-10-01',
      endDate: '2024-10-31',
      usage: 15,
      limit: 30,
      minAmount: 1000
    },
    {
      id: 'PROMO-004',
      name: 'VIP Müşteri İndirimi',
      type: 'percentage',
      value: 15,
      code: 'VIP15',
      status: 'scheduled',
      startDate: '2024-12-15',
      endDate: '2024-12-25',
      usage: 0,
      limit: 20,
      minAmount: 1000
    }
  ];

  const typeOptions = [
    { value: 'all', label: 'Tümü', count: promotions.length },
    { value: 'percentage', label: 'Yüzde İndirim', count: promotions.filter(p => p.type === 'percentage').length },
    { value: 'fixed', label: 'Sabit İndirim', count: promotions.filter(p => p.type === 'fixed').length },
    { value: 'free_shipping', label: 'Ücretsiz Kargo', count: promotions.filter(p => p.type === 'free_shipping').length }
  ];

  const filteredPromotions = promotions.filter(promo => {
    const matchesType = selectedType === 'all' || promo.type === selectedType;
    const matchesSearch = promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         promo.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'expired': return 'Süresi Doldu';
      case 'scheduled': return 'Zamanlanmış';
      case 'paused': return 'Duraklatıldı';
      default: return 'Bilinmiyor';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'percentage': return 'Yüzde İndirim';
      case 'fixed': return 'Sabit İndirim';
      case 'free_shipping': return 'Ücretsiz Kargo';
      default: return 'Bilinmiyor';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Promosyon Yönetimi</h1>
            <p className="text-gray-600 mt-1">İndirim kuralları ve kampanya yönetimi</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              ➕ Yeni Promosyon
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              📊 Rapor
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Promosyon</p>
                <p className="text-2xl font-bold text-gray-900">{promotions.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 text-xl">🎯</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Promosyon</p>
                <p className="text-2xl font-bold text-green-600">
                  {promotions.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanım</p>
                <p className="text-2xl font-bold text-blue-600">
                  {promotions.reduce((sum, p) => sum + p.usage, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📈</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Zamanlanmış</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {promotions.filter(p => p.status === 'scheduled').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-xl">⏰</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Promosyon ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              {typeOptions.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedType === type.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label} ({type.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{promo.name}</h3>
                  <p className="text-sm text-gray-500">{promo.code}</p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(promo.status)}`}>
                  {getStatusText(promo.status)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tip:</span>
                  <span className="text-sm font-medium text-gray-900">{getTypeText(promo.type)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Değer:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {promo.type === 'percentage' ? `%${promo.value}` : 
                     promo.type === 'fixed' ? `₺${promo.value}` : 
                     'Ücretsiz'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Min. Tutar:</span>
                  <span className="text-sm font-medium text-gray-900">₺{promo.minAmount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Kullanım:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {promo.usage}/{promo.limit}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${(promo.usage / promo.limit) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(promo.startDate).toLocaleDateString('tr-TR')}</span>
                  <span>{new Date(promo.endDate).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors">
                  ✏️ Düzenle
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  📊 Detay
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ModernAdminLayout>
  );
}
