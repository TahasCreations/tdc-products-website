'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function KeywordExplorerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  const keywordData = [
    {
      keyword: 'anime figür',
      searchVolume: 12000,
      competition: 'Yüksek',
      difficulty: 85,
      cpc: 2.5,
      trend: 'rising',
      relatedKeywords: ['anime karakter', 'manga figür', 'japon figür'],
      topProducts: ['Naruto Figür', 'One Piece Figür', 'Dragon Ball Figür']
    },
    {
      keyword: 'koleksiyon figür',
      searchVolume: 8500,
      competition: 'Orta',
      difficulty: 65,
      cpc: 1.8,
      trend: 'stable',
      relatedKeywords: ['koleksiyon heykel', 'limited edition', 'özel figür'],
      topProducts: ['Premium Figür Seti', 'Limited Edition', 'Özel Üretim']
    },
    {
      keyword: 'oyuncak figür',
      searchVolume: 15000,
      competition: 'Düşük',
      difficulty: 45,
      cpc: 1.2,
      trend: 'falling',
      relatedKeywords: ['çocuk oyuncak', 'oyun figürü', 'eğitici oyuncak'],
      topProducts: ['Eğitici Figür', 'Çocuk Figür', 'Oyun Seti']
    },
    {
      keyword: 'premium figür',
      searchVolume: 3200,
      competition: 'Yüksek',
      difficulty: 90,
      cpc: 3.2,
      trend: 'rising',
      relatedKeywords: ['kaliteli figür', 'profesyonel figür', 'sanat figürü'],
      topProducts: ['Sanat Figürü', 'Profesyonel Figür', 'Kaliteli Figür']
    }
  ];

  const categories = [
    { value: 'all', label: 'Tümü' },
    { value: 'anime', label: 'Anime' },
    { value: 'koleksiyon', label: 'Koleksiyon' },
    { value: 'oyuncak', label: 'Oyuncak' },
    { value: 'premium', label: 'Premium' }
  ];

  const filteredKeywords = keywordData.filter(keyword => {
    const matchesSearch = keyword.keyword.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      keyword.keyword.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
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

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'Yüksek': return 'text-red-600';
      case 'Orta': return 'text-yellow-600';
      case 'Düşük': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate API call
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Keyword Explorer</h1>
            <p className="text-gray-600 mt-1">Anahtar kelime analizi ve pazar zekası</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              📊 Rapor Oluştur
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              📈 Trend Analizi
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Anahtar Kelime Analizi</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Anahtar kelime girin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
            </div>
            <div className="flex space-x-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAnalyzing ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analiz Ediliyor...
                  </div>
                ) : (
                  '🔍 Analiz Et'
                )}
              </button>
            </div>
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
                <p className="text-sm font-medium text-gray-600">Toplam Arama</p>
                <p className="text-2xl font-bold text-gray-900">
                  {keywordData.reduce((sum, k) => sum + k.searchVolume, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 text-xl">🔍</span>
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
                <p className="text-sm font-medium text-gray-600">Ortalama CPC</p>
                <p className="text-2xl font-bold text-green-600">
                  ₺{(keywordData.reduce((sum, k) => sum + k.cpc, 0) / keywordData.length).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
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
                  {keywordData.filter(k => k.trend === 'rising').length}
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
                <p className="text-sm font-medium text-gray-600">Düşük Rekabet</p>
                <p className="text-2xl font-bold text-purple-600">
                  {keywordData.filter(k => k.competition === 'Düşük').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">🎯</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Keywords Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Anahtar Kelime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arama Hacmi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rekabet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zorluk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPC
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredKeywords.map((keyword, index) => (
                  <motion.tr
                    key={keyword.keyword}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{keyword.keyword}</div>
                        <div className="text-sm text-gray-500">
                          {keyword.relatedKeywords.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {keyword.searchVolume.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getCompetitionColor(keyword.competition)}`}>
                        {keyword.competition}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${keyword.difficulty}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{keyword.difficulty}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₺{keyword.cpc}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-1">{getTrendIcon(keyword.trend)}</span>
                        <span className={`text-sm font-medium ${getTrendColor(keyword.trend)}`}>
                          {keyword.trend === 'rising' ? 'Yükseliyor' : 
                           keyword.trend === 'falling' ? 'Düşüyor' : 'Sabit'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          📊 Detay
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          ➕ Ekle
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          📈 Analiz
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ModernAdminLayout>
  );
}
