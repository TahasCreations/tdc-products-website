'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import TDCMarketAdminLayout from '@/components/admin/TDCMarketAdminLayout';

export default function MarketingDashboard() {
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('roi');

  const campaigns = [
    { value: 'all', label: 'Tüm Kampanyalar' },
    { value: 'active', label: 'Aktif Kampanyalar' },
    { value: 'draft', label: 'Taslaklar' },
    { value: 'completed', label: 'Tamamlanan' }
  ];

  const metrics = [
    { value: 'roi', label: 'ROI' },
    { value: 'ctr', label: 'CTR' },
    { value: 'conversion', label: 'Dönüşüm' },
    { value: 'revenue', label: 'Gelir' }
  ];

  const marketingData = {
    overview: {
      totalCampaigns: 24,
      activeCampaigns: 8,
      totalSpent: 45600,
      totalRevenue: 125600,
      roi: 175.4,
      avgCtr: 3.2,
      conversionRate: 2.8,
      emailSubscribers: 12500
    },
    recentCampaigns: [
      { id: 'CAMP-001', name: 'Black Friday Sale', type: 'Promotion', status: 'active', spent: 5000, revenue: 15000, roi: 200, ctr: 4.2 },
      { id: 'CAMP-002', name: 'New Product Launch', type: 'Email', status: 'active', spent: 1200, revenue: 8500, roi: 608, ctr: 2.8 },
      { id: 'CAMP-003', name: 'Retargeting Ads', type: 'Ads', status: 'completed', spent: 3200, revenue: 9800, roi: 206, ctr: 3.5 },
      { id: 'CAMP-004', name: 'Holiday Campaign', type: 'Promotion', status: 'draft', spent: 0, revenue: 0, roi: 0, ctr: 0 }
    ],
    topPromotions: [
      { name: '20% Off Electronics', usage: 1250, revenue: 45600, conversion: 12.5 },
      { name: 'Free Shipping Over 200₺', usage: 890, revenue: 32100, conversion: 8.9 },
      { name: 'Buy 2 Get 1 Free', usage: 567, revenue: 28900, conversion: 15.2 },
      { name: 'First Order 15% Off', usage: 234, revenue: 12300, conversion: 18.7 }
    ],
    customerSegments: [
      { name: 'VIP Customers', size: 1250, avgOrderValue: 450, lastActivity: '2024-10-30' },
      { name: 'Frequent Buyers', size: 3200, avgOrderValue: 280, lastActivity: '2024-10-29' },
      { name: 'New Customers', size: 890, avgOrderValue: 150, lastActivity: '2024-10-28' },
      { name: 'At Risk', size: 456, avgOrderValue: 320, lastActivity: '2024-09-15' }
    ],
    abTests: [
      { name: 'Homepage Hero Banner', variant: 'A vs B', status: 'running', participants: 12500, winner: 'B', improvement: 12.5 },
      { name: 'Checkout Flow', variant: 'Single vs Multi-step', status: 'completed', participants: 8900, winner: 'Single', improvement: 8.3 },
      { name: 'Email Subject Lines', variant: 'Personal vs Generic', status: 'running', participants: 5600, winner: 'TBD', improvement: 0 }
    ],
    socialMedia: [
      { platform: 'Instagram', followers: 45600, engagement: 4.2, reach: 125000 },
      { platform: 'Facebook', followers: 32100, engagement: 3.8, reach: 89000 },
      { platform: 'Twitter', followers: 18900, engagement: 2.9, reach: 45000 },
      { platform: 'TikTok', followers: 23400, engagement: 6.1, reach: 156000 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'completed': return 'Tamamlandı';
      case 'draft': return 'Taslak';
      case 'paused': return 'Duraklatıldı';
      default: return 'Bilinmiyor';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Promotion': return '🎯';
      case 'Email': return '📧';
      case 'Ads': return '📺';
      case 'Social': return '📱';
      default: return '📊';
    }
  };

  return (
    <TDCMarketAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Marketing Dashboard</h1>
            <p className="text-gray-600 mt-1">Promosyon, reklam, CRM ve A/B testleri</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {campaigns.map(campaign => (
                <option key={campaign.value} value={campaign.value}>
                  {campaign.label}
                </option>
              ))}
            </select>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {metrics.map(metric => (
                <option key={metric.value} value={metric.value}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam ROI</p>
                <p className="text-2xl font-bold text-gray-900">{marketingData.overview.roi}%</p>
                <p className="text-sm text-green-600">+15.2% bu ay</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">📈</span>
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
                <p className="text-sm font-medium text-gray-600">Toplam Harcama</p>
                <p className="text-2xl font-bold text-gray-900">₺{marketingData.overview.totalSpent.toLocaleString()}</p>
                <p className="text-sm text-blue-600">+8.7% bu ay</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">💰</span>
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
                <p className="text-sm font-medium text-gray-600">Dönüşüm Oranı</p>
                <p className="text-2xl font-bold text-gray-900">{marketingData.overview.conversionRate}%</p>
                <p className="text-sm text-purple-600">+2.1% bu ay</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">🎯</span>
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
                <p className="text-sm font-medium text-gray-600">E-posta Aboneleri</p>
                <p className="text-2xl font-bold text-gray-900">{marketingData.overview.emailSubscribers.toLocaleString()}</p>
                <p className="text-sm text-orange-600">+5.2% bu ay</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">📧</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Campaigns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Kampanyalar</h3>
          <div className="space-y-3">
            {marketingData.recentCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">{getTypeIcon(campaign.type)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{campaign.name}</p>
                    <p className="text-sm text-gray-500">{campaign.type} • {campaign.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Harcama</p>
                    <p className="font-medium">₺{campaign.spent.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Gelir</p>
                    <p className="font-medium">₺{campaign.revenue.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">ROI</p>
                    <p className="font-medium text-green-600">{campaign.roi}%</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                    {getStatusText(campaign.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Promotions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">En Başarılı Promosyonlar</h3>
            <div className="space-y-3">
              {marketingData.topPromotions.map((promo, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{promo.name}</p>
                    <p className="text-sm text-gray-500">{promo.usage} kullanım</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₺{promo.revenue.toLocaleString()}</p>
                    <p className="text-sm text-green-600">{promo.conversion}% dönüşüm</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Customer Segments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Müşteri Segmentleri</h3>
            <div className="space-y-3">
              {marketingData.customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{segment.name}</p>
                    <p className="text-sm text-gray-500">{segment.size.toLocaleString()} müşteri</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₺{segment.avgOrderValue}</p>
                    <p className="text-sm text-gray-500">Ort. sipariş</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* A/B Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">A/B Testleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {marketingData.abTests.map((test, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{test.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    test.status === 'running' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {test.status === 'running' ? 'Devam Ediyor' : 'Tamamlandı'}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Varyant:</span>
                    <span className="font-medium">{test.variant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Katılımcı:</span>
                    <span className="font-medium">{test.participants.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kazanan:</span>
                    <span className="font-medium text-green-600">{test.winner}</span>
                  </div>
                  {test.improvement > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">İyileşme:</span>
                      <span className="font-medium text-green-600">+{test.improvement}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Social Media Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sosyal Medya Performansı</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {marketingData.socialMedia.map((platform, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{platform.platform}</h4>
                  <span className="text-2xl">📱</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Takipçi:</span>
                    <span className="font-medium">{platform.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Etkileşim:</span>
                    <span className="font-medium">{platform.engagement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Erişim:</span>
                    <span className="font-medium">{platform.reach.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-left">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">🎯</span>
              </div>
              <p className="font-medium text-gray-900">Kampanya Oluştur</p>
              <p className="text-sm text-gray-600">Yeni promosyon</p>
            </button>
            
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">📧</span>
              </div>
              <p className="font-medium text-gray-900">E-posta Gönder</p>
              <p className="text-sm text-gray-600">Toplu e-posta</p>
            </button>
            
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">🧪</span>
              </div>
              <p className="font-medium text-gray-900">A/B Test Başlat</p>
              <p className="text-sm text-gray-600">Yeni deney</p>
            </button>
            
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">📊</span>
              </div>
              <p className="font-medium text-gray-900">Rapor Oluştur</p>
              <p className="text-sm text-gray-600">Analitik rapor</p>
            </button>
          </div>
        </motion.div>
      </div>
    </TDCMarketAdminLayout>
  );
}
