'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import TDCMarketAdminLayout from '@/components/admin/TDCMarketAdminLayout';

export default function AILabDashboard() {
  const [selectedAnalysis, setSelectedAnalysis] = useState('keywords');
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');

  const analyses = [
    { value: 'keywords', label: 'Keyword Analizi' },
    { value: 'pricing', label: 'Fiyat Önerileri' },
    { value: 'seo', label: 'SEO Asistanı' },
    { value: 'vision', label: 'Görsel Kalite' },
    { value: 'trends', label: 'Trend Analizi' },
    { value: 'predictions', label: 'Tahminler' }
  ];

  const timeframes = [
    { value: '7d', label: 'Son 7 Gün' },
    { value: '30d', label: 'Son 30 Gün' },
    { value: '90d', label: 'Son 90 Gün' },
    { value: '1y', label: 'Son 1 Yıl' }
  ];

  const aiData = {
    overview: {
      totalAnalyses: 1247,
      activeInsights: 89,
      avgAccuracy: 87.3,
      timeSaved: 156,
      costSaved: 12500,
      recommendations: 234,
      automatedTasks: 45,
      aiScore: 92.1
    },
    keywordInsights: [
      { keyword: 'anime figür', searchVolume: 12500, competition: 'Medium', trend: 'up', opportunity: 8.5, cpc: 2.3 },
      { keyword: 'premium koleksiyon', searchVolume: 8900, competition: 'Low', trend: 'up', opportunity: 9.2, cpc: 1.8 },
      { keyword: 'limited edition', searchVolume: 15600, competition: 'High', trend: 'stable', opportunity: 6.8, cpc: 3.2 },
      { keyword: 'el yapımı figür', searchVolume: 6700, competition: 'Low', trend: 'up', opportunity: 9.5, cpc: 1.5 }
    ],
    priceRecommendations: [
      { product: 'Dragon Figür Premium', currentPrice: 299, recommendedPrice: 329, confidence: 87, expectedSales: 15, revenueImpact: 450 },
      { product: 'Anime Character Set', currentPrice: 199, recommendedPrice: 179, confidence: 92, expectedSales: 28, revenueImpact: 560 },
      { product: 'Limited Warrior', currentPrice: 399, recommendedPrice: 449, confidence: 78, expectedSales: 8, revenueImpact: 400 },
      { product: 'Cute Animal Figür', currentPrice: 149, recommendedPrice: 159, confidence: 85, expectedSales: 22, revenueImpact: 220 }
    ],
    seoSuggestions: [
      { product: 'Premium Dragon Figür', currentTitle: 'Dragon Figür', suggestedTitle: 'El Yapımı Premium Dragon Figür - Koleksiyonluk', score: 92, impact: 'High' },
      { product: 'Anime Collection', currentTitle: 'Anime Figürler', suggestedTitle: 'Otantik Anime Karakter Figürleri - Sınırlı Seri', score: 88, impact: 'Medium' },
      { product: 'Action Figures', currentTitle: 'Aksiyon Figürleri', suggestedTitle: 'Profesyonel Aksiyon Figürleri - Detaylı Tasarım', score: 85, impact: 'Medium' }
    ],
    visionAnalysis: [
      { image: 'product-001.jpg', quality: 92, background: 88, composition: 95, duplicate: false, suggestions: ['Arka plan iyileştir', 'Işık ayarı'] },
      { image: 'product-002.jpg', quality: 78, background: 65, composition: 82, duplicate: true, suggestions: ['Yüksek çözünürlük', 'Benzer görsel tespit edildi'] },
      { image: 'product-003.jpg', quality: 96, background: 94, composition: 98, duplicate: false, suggestions: ['Mükemmel kalite'] },
      { image: 'product-004.jpg', quality: 71, background: 58, composition: 75, duplicate: false, suggestions: ['Görsel iyileştirme gerekli', 'Kompozisyon düzenle'] }
    ],
    trendAnalysis: [
      { category: 'Anime Figürler', trend: 'up', growth: 25.3, seasonality: 'High', peakMonths: ['Dec', 'Jan', 'Feb'] },
      { category: 'Fantasy Figürler', trend: 'stable', growth: 8.7, seasonality: 'Medium', peakMonths: ['Oct', 'Nov'] },
      { category: 'Action Figürler', trend: 'down', growth: -5.2, seasonality: 'Low', peakMonths: ['Mar', 'Apr'] },
      { category: 'Cute Figürler', trend: 'up', growth: 18.9, seasonality: 'High', peakMonths: ['Feb', 'Mar', 'Apr'] }
    ],
    predictions: [
      { metric: 'Stok Bitme Tahmini', product: 'Dragon Figür', currentStock: 45, predictedDays: 12, confidence: 89 },
      { metric: 'Satış Tahmini', product: 'Anime Set', nextMonth: 156, confidence: 85 },
      { metric: 'Trend Yükselişi', keyword: 'premium figür', expectedGrowth: 35, confidence: 92 },
      { metric: 'Fiyat Optimizasyonu', category: 'Fantasy', optimalRange: '250-350₺', confidence: 87 }
    ],
    automationTasks: [
      { task: 'Fiyat Güncelleme', status: 'completed', lastRun: '2024-10-30 14:30', nextRun: '2024-10-31 14:30', success: 95 },
      { task: 'SEO Optimizasyonu', status: 'running', lastRun: '2024-10-30 15:00', nextRun: '2024-10-30 16:00', success: 87 },
      { task: 'Görsel Analizi', status: 'scheduled', lastRun: '2024-10-29 20:00', nextRun: '2024-10-30 20:00', success: 92 },
      { task: 'Trend Raporu', status: 'completed', lastRun: '2024-10-30 09:00', nextRun: '2024-10-31 09:00', success: 89 }
    ]
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <TDCMarketAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Lab</h1>
            <p className="text-gray-600 mt-1">Marmelad-benzeri keyword & pazar zekası</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <select
              value={selectedAnalysis}
              onChange={(e) => setSelectedAnalysis(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {analyses.map(analysis => (
                <option key={analysis.value} value={analysis.value}>
                  {analysis.label}
                </option>
              ))}
            </select>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {timeframes.map(timeframe => (
                <option key={timeframe.value} value={timeframe.value}>
                  {timeframe.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Skoru</p>
                <p className="text-2xl font-bold text-gray-900">{aiData.overview.aiScore}%</p>
                <p className="text-sm text-green-600">+5.2% bu ay</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🤖</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Doğruluk</p>
                <p className="text-2xl font-bold text-gray-900">{aiData.overview.avgAccuracy}%</p>
                <p className="text-sm text-blue-600">+2.1% bu ay</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🎯</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Zaman Tasarrufu</p>
                <p className="text-2xl font-bold text-gray-900">{aiData.overview.timeSaved}h</p>
                <p className="text-sm text-purple-600">Bu ay</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">⏰</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maliyet Tasarrufu</p>
                <p className="text-2xl font-bold text-gray-900">₺{aiData.overview.costSaved.toLocaleString()}</p>
                <p className="text-sm text-green-600">Bu ay</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Keyword Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Keyword Analizi (Marmelad-style)</h3>
          <div className="space-y-3">
            {aiData.keywordInsights.map((keyword, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">{getTrendIcon(keyword.trend)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{keyword.keyword}</p>
                    <p className="text-sm text-gray-500">Arama hacmi: {keyword.searchVolume.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Rekabet</p>
                    <p className={`font-medium ${getCompetitionColor(keyword.competition)}`}>{keyword.competition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Fırsat</p>
                    <p className="font-medium text-green-600">{keyword.opportunity}/10</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">CPC</p>
                    <p className="font-medium">₺{keyword.cpc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Recommendations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Fiyat Önerileri</h3>
            <div className="space-y-3">
              {aiData.priceRecommendations.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{rec.product}</p>
                    <p className="text-sm text-gray-500">Mevcut: ₺{rec.currentPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₺{rec.recommendedPrice}</p>
                    <p className="text-sm text-green-600">%{rec.confidence} güven</p>
                    <p className="text-xs text-gray-500">+₺{rec.revenueImpact} etki</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SEO Suggestions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI SEO Önerileri</h3>
            <div className="space-y-3">
              {aiData.seoSuggestions.map((seo, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-2">{seo.product}</p>
                  <p className="text-sm text-gray-600 mb-1">Mevcut: {seo.currentTitle}</p>
                  <p className="text-sm text-green-600 mb-1">Önerilen: {seo.suggestedTitle}</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Skor: {seo.score}/100</span>
                    <span className={`${getImpactColor(seo.impact)}`}>{seo.impact} Etki</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Vision Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Görsel Kalite Analizi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiData.visionAnalysis.map((vision, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{vision.image}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    vision.duplicate ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {vision.duplicate ? 'Duplicate' : 'Unique'}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kalite:</span>
                    <span className="font-medium">{vision.quality}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Arka Plan:</span>
                    <span className="font-medium">{vision.background}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kompozisyon:</span>
                    <span className="font-medium">{vision.composition}/100</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Öneriler:</p>
                    <p className="text-xs text-gray-600">{vision.suggestions.join(', ')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trend Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Analizi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiData.trendAnalysis.map((trend, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{trend.category}</h4>
                  <span className="text-2xl">{getTrendIcon(trend.trend)}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Büyüme:</span>
                    <span className={`font-medium ${getTrendColor(trend.trend)}`}>
                      {trend.growth > 0 ? '+' : ''}{trend.growth}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mevsimsellik:</span>
                    <span className="font-medium">{trend.seasonality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zirve Aylar:</span>
                    <span className="font-medium">{trend.peakMonths.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Tahminleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {aiData.predictions.map((prediction, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{prediction.metric}</h4>
                  <span className="text-2xl">🔮</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ürün:</span>
                    <span className="font-medium">{prediction.product}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tahmin:</span>
                    <span className="font-medium">{prediction.nextMonth || prediction.predictedDays || prediction.expectedGrowth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Güven:</span>
                    <span className="font-medium text-green-600">%{prediction.confidence}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Automation Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Otomatik Görevler</h3>
          <div className="space-y-3">
            {aiData.automationTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">⚡</span>
                  <div>
                    <p className="font-medium text-gray-900">{task.task}</p>
                    <p className="text-sm text-gray-500">Son çalışma: {task.lastRun}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Başarı</p>
                    <p className="font-medium text-green-600">%{task.success}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Sonraki</p>
                    <p className="font-medium">{task.nextRun}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'running' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status === 'completed' ? 'Tamamlandı' :
                     task.status === 'running' ? 'Çalışıyor' : 'Zamanlandı'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-left">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">🔍</span>
              </div>
              <p className="font-medium text-gray-900">Keyword Analizi</p>
              <p className="text-sm text-gray-600">Yeni analiz başlat</p>
            </button>
            
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">💰</span>
              </div>
              <p className="font-medium text-gray-900">Fiyat Optimizasyonu</p>
              <p className="text-sm text-gray-600">AI önerileri al</p>
            </button>
            
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">🖼️</span>
              </div>
              <p className="font-medium text-gray-900">Görsel Analizi</p>
              <p className="text-sm text-gray-600">Kalite kontrolü</p>
            </button>
            
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">📊</span>
              </div>
              <p className="font-medium text-gray-900">Trend Raporu</p>
              <p className="text-sm text-gray-600">Pazar analizi</p>
            </button>
          </div>
        </motion.div>
      </div>
    </TDCMarketAdminLayout>
  );
}
