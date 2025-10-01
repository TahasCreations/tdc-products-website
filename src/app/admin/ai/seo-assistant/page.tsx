'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function SEOAssistantPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
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

  const seoData = [
    {
      id: 'SEO-001',
      productName: 'Premium Dragon Figür',
      currentTitle: 'Dragon Figür',
      suggestedTitle: 'Premium Dragon Figür - El Yapımı Koleksiyon Figürü',
      currentDescription: 'Güzel dragon figürü',
      suggestedDescription: 'El yapımı premium dragon figürü. Yüksek kalite reçine malzeme, detaylı işçilik. Koleksiyoncular için özel tasarım.',
      qualityScore: 45,
      suggestedScore: 92,
      keywords: ['dragon figür', 'koleksiyon', 'el yapımı', 'premium'],
      improvements: ['Başlık uzatılmalı', 'Açıklama detaylandırılmalı', 'Anahtar kelimeler eklenmeli'],
      status: 'needs_improvement'
    },
    {
      id: 'SEO-002',
      productName: 'Anime Character Set',
      currentTitle: 'Anime Figür Seti',
      suggestedTitle: 'Anime Karakter Figür Seti - 5 Adet Premium Koleksiyon',
      currentDescription: 'Anime karakterleri',
      suggestedDescription: '5 farklı anime karakterinden oluşan premium figür seti. Yüksek detaylı işçilik, koleksiyon değeri yüksek.',
      qualityScore: 38,
      suggestedScore: 88,
      keywords: ['anime figür', 'karakter seti', 'koleksiyon', 'premium'],
      improvements: ['Başlık spesifik olmalı', 'Açıklama uzatılmalı', 'Karakter isimleri eklenmeli'],
      status: 'needs_improvement'
    },
    {
      id: 'SEO-003',
      productName: 'Limited Edition Warrior',
      currentTitle: 'Limited Edition Warrior - El Yapımı Savaşçı Figürü',
      suggestedTitle: 'Limited Edition Warrior - El Yapımı Savaşçı Figürü',
      currentDescription: 'Sınırlı sayıda üretilen savaşçı figürü. El yapımı, yüksek kalite.',
      suggestedDescription: 'Sınırlı sayıda üretilen savaşçı figürü. El yapımı, yüksek kalite.',
      qualityScore: 85,
      suggestedScore: 90,
      keywords: ['savaşçı figür', 'sınırlı üretim', 'el yapımı', 'koleksiyon'],
      improvements: ['Küçük iyileştirmeler'],
      status: 'good'
    }
  ];

  const types = [
    { value: 'all', label: 'Tümü' },
    { value: 'needs_improvement', label: 'İyileştirme Gerekli' },
    { value: 'good', label: 'İyi' },
    { value: 'excellent', label: 'Mükemmel' }
  ];

  const filteredData = seoData.filter(item => {
    const matchesType = selectedType === 'all' || item.status === selectedType;
    const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'needs_improvement': return 'bg-red-100 text-red-800';
      case 'good': return 'bg-yellow-100 text-yellow-800';
      case 'excellent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'needs_improvement': return 'İyileştirme Gerekli';
      case 'good': return 'İyi';
      case 'excellent': return 'Mükemmel';
      default: return 'Bilinmiyor';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
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
            <h1 className="text-3xl font-bold text-gray-900">AI SEO Asistanı</h1>
            <p className="text-gray-600 mt-1">Ürün SEO optimizasyonu ve içerik iyileştirme</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isAnalyzing ? '🔄 Analiz Ediliyor...' : '🤖 SEO Analizi'}
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
                <p className="text-2xl font-bold text-gray-900">{seoData.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Ortalama Skor</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(seoData.reduce((sum, s) => sum + s.qualityScore, 0) / seoData.length)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📊</span>
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
                <p className="text-sm font-medium text-gray-600">İyileştirme Gerekli</p>
                <p className="text-2xl font-bold text-red-600">
                  {seoData.filter(s => s.status === 'needs_improvement').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠️</span>
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
                <p className="text-sm font-medium text-gray-600">Mükemmel</p>
                <p className="text-2xl font-bold text-green-600">
                  {seoData.filter(s => s.status === 'excellent').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">✅</span>
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
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SEO Analysis Cards */}
        <div className="space-y-6">
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{item.productName}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Mevcut Skor:</span>
                      <span className={`text-lg font-bold ${getScoreColor(item.qualityScore)}`}>
                        {item.qualityScore}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Önerilen:</span>
                      <span className="text-lg font-bold text-green-600">
                        {item.suggestedScore}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current vs Suggested */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Mevcut Başlık</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{item.currentTitle}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Önerilen Başlık</h4>
                    <p className="text-sm text-gray-900 bg-green-50 p-3 rounded-lg border border-green-200">{item.suggestedTitle}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Mevcut Açıklama</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{item.currentDescription}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Önerilen Açıklama</h4>
                    <p className="text-sm text-gray-900 bg-green-50 p-3 rounded-lg border border-green-200">{item.suggestedDescription}</p>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Anahtar Kelimeler</h4>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((keyword, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Improvements */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">İyileştirme Önerileri</h4>
                <ul className="space-y-2">
                  {item.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  ✅ Önerileri Uygula
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  💾 Kaydet
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  📊 Detaylı Analiz
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                  🔄 Yeniden Analiz
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ModernAdminLayout>
  );
}
