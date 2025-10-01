'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function PriceSuggestionPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  const priceSuggestions = [
    {
      id: 'PS-001',
      productName: 'Premium Dragon Figür',
      category: 'Fantasy',
      currentPrice: 299,
      suggestedMin: 249,
      suggestedMax: 349,
      confidence: 92,
      factors: ['Rekabet analizi', 'Maliyet analizi', 'Pazar trendi'],
      competitorPrices: [279, 319, 289, 329],
      marketTrend: 'rising',
      recommendation: 'Fiyat artırımı öneriliyor'
    },
    {
      id: 'PS-002',
      productName: 'Anime Character Set',
      category: 'Anime',
      currentPrice: 199,
      suggestedMin: 179,
      suggestedMax: 229,
      confidence: 88,
      factors: ['Maliyet analizi', 'Satış hacmi', 'Müşteri segmenti'],
      competitorPrices: [189, 209, 199, 219],
      marketTrend: 'stable',
      recommendation: 'Mevcut fiyat uygun'
    },
    {
      id: 'PS-003',
      productName: 'Limited Edition Warrior',
      category: 'Action',
      currentPrice: 399,
      suggestedMin: 349,
      suggestedMax: 449,
      confidence: 95,
      factors: ['Sınırlı üretim', 'Koleksiyon değeri', 'Pazar talebi'],
      competitorPrices: [379, 429, 389, 419],
      marketTrend: 'rising',
      recommendation: 'Fiyat artırımı öneriliyor'
    }
  ];

  const categories = [
    { value: 'all', label: 'Tümü' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Anime', label: 'Anime' },
    { value: 'Action', label: 'Action' },
    { value: 'Cute', label: 'Cute' }
  ];

  const filteredSuggestions = priceSuggestions.filter(suggestion => {
    const matchesCategory = selectedCategory === 'all' || suggestion.category === selectedCategory;
    const matchesSearch = suggestion.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'rising': return 'text-green-600';
      case 'falling': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Fiyat Önerisi</h1>
            <p className="text-gray-600 mt-1">Yapay zeka destekli fiyat optimizasyonu</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isAnalyzing ? '🔄 Analiz Ediliyor...' : '🤖 Yeni Analiz'}
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
                <p className="text-sm font-medium text-gray-600">Toplam Analiz</p>
                <p className="text-2xl font-bold text-gray-900">{priceSuggestions.length}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 text-xl">💰</span>
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
                <p className="text-sm font-medium text-gray-600">Ortalama Güven</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(priceSuggestions.reduce((sum, s) => sum + s.confidence, 0) / priceSuggestions.length)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">🎯</span>
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
                <p className="text-sm font-medium text-gray-600">Yükselen Trend</p>
                <p className="text-2xl font-bold text-blue-600">
                  {priceSuggestions.filter(s => s.marketTrend === 'rising').length}
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
                <p className="text-sm font-medium text-gray-600">Potansiyel Artış</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₺{priceSuggestions.reduce((sum, s) => sum + (s.suggestedMax - s.currentPrice), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">💎</span>
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
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Price Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{suggestion.productName}</h3>
                  <p className="text-sm text-gray-500">{suggestion.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">₺{suggestion.currentPrice}</p>
                  <p className="text-sm text-gray-500">Mevcut Fiyat</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Price Range */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Önerilen Fiyat Aralığı</span>
                    <span className={`text-sm font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                      {suggestion.confidence}% Güven
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-red-600">₺{suggestion.suggestedMin}</p>
                      <p className="text-xs text-gray-500">Min</p>
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"></div>
                      <div 
                        className="absolute top-0 w-3 h-3 bg-indigo-600 rounded-full transform -translate-x-1/2"
                        style={{ left: `${((suggestion.currentPrice - suggestion.suggestedMin) / (suggestion.suggestedMax - suggestion.suggestedMin)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">₺{suggestion.suggestedMax}</p>
                      <p className="text-xs text-gray-500">Max</p>
                    </div>
                  </div>
                </div>

                {/* Market Trend */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pazar Trendi:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTrendIcon(suggestion.marketTrend)}</span>
                    <span className={`text-sm font-medium ${getTrendColor(suggestion.marketTrend)}`}>
                      {suggestion.marketTrend === 'rising' ? 'Yükseliyor' : 
                       suggestion.marketTrend === 'falling' ? 'Düşüyor' : 'Sabit'}
                    </span>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-indigo-900">{suggestion.recommendation}</p>
                </div>

                {/* Factors */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Analiz Faktörleri:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestion.factors.map((factor, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
                    ✅ Uygula
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                    📊 Detay
                  </button>
                  <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors">
                    💾 Kaydet
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ModernAdminLayout>
  );
}
