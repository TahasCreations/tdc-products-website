'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const timeRanges = [
    { value: '7d', label: 'Son 7 Gün' },
    { value: '30d', label: 'Son 30 Gün' },
    { value: '90d', label: 'Son 90 Gün' },
    { value: '1y', label: 'Son 1 Yıl' }
  ];

  const metrics = [
    { value: 'revenue', label: 'Gelir' },
    { value: 'orders', label: 'Siparişler' },
    { value: 'customers', label: 'Müşteriler' },
    { value: 'products', label: 'Ürünler' }
  ];

  const analyticsData = {
    overview: {
      totalRevenue: 125678,
      totalOrders: 1234,
      totalCustomers: 567,
      averageOrderValue: 102,
      conversionRate: 3.2,
      revenueGrowth: 12.5,
      ordersGrowth: 8.3,
      customersGrowth: 15.2
    },
    chartData: [
      { date: '2024-10-01', revenue: 4200, orders: 45, customers: 12 },
      { date: '2024-10-02', revenue: 3800, orders: 38, customers: 10 },
      { date: '2024-10-03', revenue: 5200, orders: 52, customers: 15 },
      { date: '2024-10-04', revenue: 4600, orders: 46, customers: 13 },
      { date: '2024-10-05', revenue: 6100, orders: 61, customers: 18 },
      { date: '2024-10-06', revenue: 4800, orders: 48, customers: 14 },
      { date: '2024-10-07', revenue: 5500, orders: 55, customers: 16 }
    ],
    topProducts: [
      { name: 'Premium Dragon Figür', sales: 45, revenue: 13455 },
      { name: 'Anime Character Collection', sales: 38, revenue: 7562 },
      { name: 'Limited Edition Warrior', sales: 32, revenue: 12768 },
      { name: 'Cute Animal Figür', sales: 28, revenue: 4172 }
    ],
    topCategories: [
      { name: 'Fantasy', sales: 89, revenue: 26700 },
      { name: 'Anime', sales: 76, revenue: 15120 },
      { name: 'Action', sales: 54, revenue: 21546 },
      { name: 'Cute', sales: 43, revenue: 6407 }
    ],
    recentActivity: [
      { type: 'order', message: 'Yeni sipariş alındı', value: '#1234', time: '2 dakika önce' },
      { type: 'customer', message: 'Yeni müşteri kaydı', value: 'Ahmet Yılmaz', time: '15 dakika önce' },
      { type: 'product', message: 'Ürün stokta bitti', value: 'Premium Dragon Figür', time: '1 saat önce' },
      { type: 'revenue', message: 'Günlük hedef aşıldı', value: '₺5,200', time: '2 saat önce' }
    ]
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return '🛍️';
      case 'customer': return '👤';
      case 'product': return '📦';
      case 'revenue': return '💰';
      default: return '📊';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-green-100 text-green-800';
      case 'product': return 'bg-yellow-100 text-yellow-800';
      case 'revenue': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analitik Dashboard</h1>
            <p className="text-gray-600">Detaylı analiz ve raporlar</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {metrics.map(metric => (
                <option key={metric.value} value={metric.value}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">₺{analyticsData.overview.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-green-600">+{analyticsData.overview.revenueGrowth}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalOrders.toLocaleString()}</p>
                <p className="text-sm text-blue-600">+{analyticsData.overview.ordersGrowth}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">🛍️</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalCustomers}</p>
                <p className="text-sm text-purple-600">+{analyticsData.overview.customersGrowth}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">₺{analyticsData.overview.averageOrderValue}</p>
                <p className="text-sm text-orange-600">Dönüşüm: {analyticsData.overview.conversionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">📊</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gelir Trendi</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t"
                    style={{ height: `${(data.revenue / 6100) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(data.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-600">
              <span>₺{Math.min(...analyticsData.chartData.map(d => d.revenue)).toLocaleString()}</span>
              <span>₺{Math.max(...analyticsData.chartData.map(d => d.revenue)).toLocaleString()}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Trendi</h3>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t"
                    style={{ height: `${(data.orders / 61) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(data.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-600">
              <span>{Math.min(...analyticsData.chartData.map(d => d.orders))}</span>
              <span>{Math.max(...analyticsData.chartData.map(d => d.orders))}</span>
            </div>
          </motion.div>
        </div>

        {/* Top Products and Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürünler</h3>
            <div className="space-y-3">
              {analyticsData.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-indigo-600 text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} satış</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">₺{product.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">En Popüler Kategoriler</h3>
            <div className="space-y-3">
              {analyticsData.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600 text-sm">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.sales} satış</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">₺{category.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getActivityColor(activity.type)}`}>
                  <span className="text-sm">{getActivityIcon(activity.type)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.value} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
