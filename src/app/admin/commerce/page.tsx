'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import TDCMarketAdminLayout from '@/components/admin/TDCMarketAdminLayout';

export default function CommerceOpsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const timeframes = [
    { value: 'today', label: 'Bugün' },
    { value: 'week', label: 'Bu Hafta' },
    { value: 'month', label: 'Bu Ay' },
    { value: 'quarter', label: 'Bu Çeyrek' }
  ];

  const statuses = [
    { value: 'all', label: 'Tüm Durumlar' },
    { value: 'pending', label: 'Beklemede' },
    { value: 'processing', label: 'İşleniyor' },
    { value: 'shipped', label: 'Kargoda' },
    { value: 'delivered', label: 'Teslim Edildi' },
    { value: 'returned', label: 'İade Edildi' }
  ];

  const commerceData = {
    overview: {
      totalOrders: 1234,
      totalRevenue: 125678,
      activeSellers: 89,
      pendingSettlements: 12,
      avgOrderValue: 102,
      conversionRate: 3.2,
      returnRate: 2.1,
      fulfillmentTime: 2.5
    },
    recentOrders: [
      { id: 'ORD-001', customer: 'Ahmet Yılmaz', seller: 'Premium Figürs', amount: 299, status: 'shipped', date: '2024-10-30', items: 2 },
      { id: 'ORD-002', customer: 'Sarah Johnson', seller: 'Anime World', amount: 199, status: 'processing', date: '2024-10-29', items: 1 },
      { id: 'ORD-003', customer: 'Mehmet Kaya', seller: 'Action Figures Co', amount: 399, status: 'delivered', date: '2024-10-28', items: 3 },
      { id: 'ORD-004', customer: 'Ayşe Demir', seller: 'Cute Collectibles', amount: 149, status: 'returned', date: '2024-10-27', items: 1 }
    ],
    topSellers: [
      { name: 'Premium Figürs', orders: 156, revenue: 45600, commission: 3192, rating: 4.8 },
      { name: 'Anime World', orders: 134, revenue: 38900, commission: 2723, rating: 4.7 },
      { name: 'Action Figures Co', orders: 98, revenue: 32100, commission: 2247, rating: 4.9 },
      { name: 'Cute Collectibles', orders: 87, revenue: 28900, commission: 2023, rating: 4.6 }
    ],
    riskAlerts: [
      { type: 'high', message: 'Yeni hesap + yüksek sepet tutarı', order: 'ORD-005', riskScore: 85 },
      { type: 'medium', message: 'Çoklu adres değişikliği', order: 'ORD-006', riskScore: 65 },
      { type: 'low', message: 'Yüksek iade oranı', seller: 'Suspicious Store', riskScore: 45 }
    ],
    shippingStats: [
      { carrier: 'Aras Kargo', orders: 456, avgDelivery: 2.1, successRate: 98.5 },
      { carrier: 'Yurtiçi Kargo', orders: 234, avgDelivery: 2.3, successRate: 97.2 },
      { carrier: 'MNG Kargo', orders: 189, avgDelivery: 1.8, successRate: 99.1 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'returned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede';
      case 'processing': return 'İşleniyor';
      case 'shipped': return 'Kargoda';
      case 'delivered': return 'Teslim Edildi';
      case 'returned': return 'İade Edildi';
      default: return 'Bilinmiyor';
    }
  };

  const getRiskColor = (type: string) => {
    switch (type) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <TDCMarketAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Commerce Operations</h1>
            <p className="text-gray-600 mt-1">Pazar yeri operasyonları ve sipariş yönetimi</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-4">
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
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
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
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{commerceData.overview.totalOrders.toLocaleString()}</p>
                <p className="text-sm text-green-600">+12.3% bu ay</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📦</span>
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
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">₺{commerceData.overview.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+8.7% bu ay</p>
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
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Satıcı</p>
                <p className="text-2xl font-bold text-gray-900">{commerceData.overview.activeSellers}</p>
                <p className="text-sm text-blue-600">+5.2% bu ay</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">🏪</span>
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
                <p className="text-sm font-medium text-gray-600">Bekleyen Ödeme</p>
                <p className="text-2xl font-bold text-gray-900">{commerceData.overview.pendingSettlements}</p>
                <p className="text-sm text-orange-600">₺45,600 toplam</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">💸</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Risk Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Uyarıları</h3>
          <div className="space-y-3">
            {commerceData.riskAlerts.map((alert, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${getRiskColor(alert.type)}`}>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-current rounded-full mr-3"></div>
                  <div>
                    <span className="font-medium">{alert.message}</span>
                    <span className="text-sm ml-2">
                      {alert.order ? `Sipariş: ${alert.order}` : `Satıcı: ${alert.seller}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Risk: {alert.riskScore}%</span>
                  <button className="text-sm font-medium hover:underline">İncele</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Siparişler</h3>
            <div className="space-y-3">
              {commerceData.recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer} • {order.seller}</p>
                    <p className="text-xs text-gray-400">{order.items} ürün • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₺{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Sellers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">En Başarılı Satıcılar</h3>
            <div className="space-y-3">
              {commerceData.topSellers.map((seller, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{seller.name}</p>
                    <p className="text-sm text-gray-500">{seller.orders} sipariş • ⭐ {seller.rating}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₺{seller.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Komisyon: ₺{seller.commission.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Shipping Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kargo Performansı</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {commerceData.shippingStats.map((stat, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{stat.carrier}</h4>
                  <span className="text-sm text-gray-500">{stat.orders} sipariş</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ort. Teslimat:</span>
                    <span className="font-medium">{stat.avgDelivery} gün</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Başarı Oranı:</span>
                    <span className="font-medium text-green-600">{stat.successRate}%</span>
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
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-left">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">📦</span>
              </div>
              <p className="font-medium text-gray-900">Sipariş İncele</p>
              <p className="text-sm text-gray-600">Detaylı analiz</p>
            </button>
            
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">🚚</span>
              </div>
              <p className="font-medium text-gray-900">Kargo Etiketi</p>
              <p className="text-sm text-gray-600">Etiket oluştur</p>
            </button>
            
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">💸</span>
              </div>
              <p className="font-medium text-gray-900">Ödeme Çalıştır</p>
              <p className="text-sm text-gray-600">Settlement</p>
            </button>
            
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">🛡️</span>
              </div>
              <p className="font-medium text-gray-900">Risk Analizi</p>
              <p className="text-sm text-gray-600">Fraud kontrolü</p>
            </button>
          </div>
        </motion.div>
      </div>
    </TDCMarketAdminLayout>
  );
}
