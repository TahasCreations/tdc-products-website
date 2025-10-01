'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function AIPredictions() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [predictions, setPredictions] = useState({
    sales: {
      current: 125000,
      predicted: 142000,
      confidence: 87,
      trend: 'up'
    },
    inventory: {
      current: 2500,
      predicted: 1800,
      confidence: 92,
      trend: 'down'
    },
    revenue: {
      current: 285000,
      predicted: 325000,
      confidence: 84,
      trend: 'up'
    }
  });
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

  const predictionData = [
    {
      category: 'Satış Tahmini',
      icon: '📈',
      current: '₺125,000',
      predicted: '₺142,000',
      change: '+13.6%',
      confidence: 87,
      color: 'green',
      details: [
        { period: 'Hafta 1', value: '₺32,000', confidence: 92 },
        { period: 'Hafta 2', value: '₺35,000', confidence: 88 },
        { period: 'Hafta 3', value: '₺38,000', confidence: 85 },
        { period: 'Hafta 4', value: '₺37,000', confidence: 83 }
      ]
    },
    {
      category: 'Envanter Tahmini',
      icon: '📦',
      current: '2,500 ürün',
      predicted: '1,800 ürün',
      change: '-28%',
      confidence: 92,
      color: 'orange',
      details: [
        { period: 'Hafta 1', value: '2,200 ürün', confidence: 95 },
        { period: 'Hafta 2', value: '2,000 ürün', confidence: 93 },
        { period: 'Hafta 3', value: '1,900 ürün', confidence: 91 },
        { period: 'Hafta 4', value: '1,800 ürün', confidence: 89 }
      ]
    },
    {
      category: 'Gelir Tahmini',
      icon: '💰',
      current: '₺285,000',
      predicted: '₺325,000',
      change: '+14.0%',
      confidence: 84,
      color: 'blue',
      details: [
        { period: 'Hafta 1', value: '₺78,000', confidence: 88 },
        { period: 'Hafta 2', value: '₺82,000', confidence: 86 },
        { period: 'Hafta 3', value: '₺85,000', confidence: 84 },
        { period: 'Hafta 4', value: '₺80,000', confidence: 82 }
      ]
    }
  ];

  const aiInsights = [
    {
      title: 'Yüksek Talep Beklenen Ürünler',
      type: 'success',
      icon: '🚀',
      description: 'Dragon Figür serisi önümüzdeki 30 günde %45 artış gösterecek',
      action: 'Stok artır',
      confidence: 89
    },
    {
      title: 'Düşük Performans Uyarısı',
      type: 'warning',
      icon: '⚠️',
      description: 'Anime Koleksiyonu satışları %15 düşüş trendinde',
      action: 'Fiyat gözden geçir',
      confidence: 76
    },
    {
      title: 'Sezonsal Fırsat',
      type: 'info',
      icon: '🎯',
      description: 'Yılbaşı döneminde özel üretim ürünlerde %60 artış bekleniyor',
      action: 'Kampanya planla',
      confidence: 94
    }
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
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
          <p className="text-gray-600">AI tahminleri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Tahminleri</h1>
            <p className="text-gray-600 mt-1">Makine öğrenmesi ile gelecek tahminleri</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="7d">Son 7 gün</option>
              <option value="30d">Son 30 gün</option>
              <option value="90d">Son 90 gün</option>
            </select>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              🔄 Yenile
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              📊 Detaylı Rapor
            </button>
          </div>
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`p-6 rounded-xl border-2 ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{insight.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      {insight.action} →
                    </button>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                      %{insight.confidence} güven
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Prediction Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {predictionData.map((prediction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{prediction.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900">{prediction.category}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(prediction.confidence)}`}>
                  %{prediction.confidence} güven
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mevcut</span>
                  <span className="font-medium text-gray-900">{prediction.current}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tahmin</span>
                  <span className="font-bold text-gray-900">{prediction.predicted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Değişim</span>
                  <span className={`font-bold ${
                    prediction.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {prediction.change}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Haftalık Detay</h4>
                <div className="space-y-2">
                  {prediction.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{detail.period}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{detail.value}</span>
                        <span className={`px-2 py-1 rounded text-xs ${getConfidenceColor(detail.confidence)}`}>
                          %{detail.confidence}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Model Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Model Durumu</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">🤖</div>
              <h4 className="font-medium text-gray-900">Model Aktif</h4>
              <p className="text-sm text-gray-600">Son güncelleme: 2 saat önce</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium text-gray-900">Doğruluk Oranı</h4>
              <p className="text-sm text-gray-600">%87.3</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-medium text-gray-900">İşlem Süresi</h4>
              <p className="text-sm text-gray-600">1.2 saniye</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl mb-2">🔄</div>
              <h4 className="font-medium text-gray-900">Son Eğitim</h4>
              <p className="text-sm text-gray-600">3 gün önce</p>
            </div>
          </div>
        </motion.div>
      </div>
    </ModernAdminLayout>
  );
}
