'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function AnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [realTimeData, setRealTimeData] = useState({
    onlineUsers: 0,
    currentOrders: 0,
    revenue: 0,
    conversionRate: 0
  });
  const router = useRouter();

  useEffect(() => {
    const adminAuth = document.cookie.includes('adminAuth=true');
    if (adminAuth) {
      setIsAuthenticated(true);
      setIsLoading(false);
      
      // Simulate real-time data updates
      const interval = setInterval(() => {
        setRealTimeData(prev => ({
          onlineUsers: Math.floor(Math.random() * 50) + 20,
          currentOrders: Math.floor(Math.random() * 10) + 5,
          revenue: Math.floor(Math.random() * 5000) + 10000,
          conversionRate: Math.random() * 2 + 2
        }));
      }, 3000);

      return () => clearInterval(interval);
    } else {
      router.push('/admin');
    }
  }, [router]);

  const timeRanges = [
    { value: '7d', label: 'Son 7 Gün' },
    { value: '30d', label: 'Son 30 Gün' },
    { value: '90d', label: 'Son 90 Gün' },
    { value: '1y', label: 'Son 1 Yıl' }
  ];

  const metrics = [
    { value: 'revenue', label: 'Gelir', icon: '💰', color: 'green' },
    { value: 'orders', label: 'Siparişler', icon: '📦', color: 'blue' },
    { value: 'customers', label: 'Müşteriler', icon: '👥', color: 'purple' },
    { value: 'conversion', label: 'Dönüşüm', icon: '📈', color: 'orange' }
  ];

  const chartData = {
    revenue: [
      { date: '2024-10-24', value: 4200, orders: 45, customers: 12 },
      { date: '2024-10-25', value: 3800, orders: 38, customers: 10 },
      { date: '2024-10-26', value: 5200, orders: 52, customers: 15 },
      { date: '2024-10-27', value: 4600, orders: 46, customers: 13 },
      { date: '2024-10-28', value: 6100, orders: 61, customers: 18 },
      { date: '2024-10-29', value: 4800, orders: 48, customers: 14 },
      { date: '2024-10-30', value: 5500, orders: 55, customers: 16 }
    ],
    orders: [
      { date: '2024-10-24', value: 45, revenue: 4200, customers: 12 },
      { date: '2024-10-25', value: 38, revenue: 3800, customers: 10 },
      { date: '2024-10-26', value: 52, revenue: 5200, customers: 15 },
      { date: '2024-10-27', value: 46, revenue: 4600, customers: 13 },
      { date: '2024-10-28', value: 61, revenue: 6100, customers: 18 },
      { date: '2024-10-29', value: 48, revenue: 4800, customers: 14 },
      { date: '2024-10-30', value: 55, revenue: 5500, customers: 16 }
    ]
  };

  const topProducts = [
    { name: 'Premium Dragon Figür', sales: 45, revenue: 13455, growth: 12.5 },
    { name: 'Anime Character Collection', sales: 38, revenue: 7562, growth: 8.3 },
    { name: 'Limited Edition Warrior', sales: 32, revenue: 12768, growth: 15.2 },
    { name: 'Cute Animal Figür', sales: 28, revenue: 4172, growth: -2.1 }
  ];

  const recentActivity = [
    { type: 'order', user: 'Ahmet Yılmaz', action: 'Yeni sipariş oluşturdu', time: '2 dakika önce', amount: '₺2,499' },
    { type: 'user', user: 'Sarah Johnson', action: 'Hesap oluşturdu', time: '5 dakika önce', amount: '' },
    { type: 'payment', user: 'Mehmet Kaya', action: 'Ödeme tamamlandı', time: '8 dakika önce', amount: '₺1,299' },
    { type: 'review', user: 'Ayşe Demir', action: 'Ürün değerlendirmesi yaptı', time: '12 dakika önce', amount: '' }
  ];

  const getMetricColor = (metric: string) => {
    const metricObj = metrics.find(m => m.value === metric);
    return metricObj?.color || 'gray';
  };

  const getMetricIcon = (metric: string) => {
    const metricObj = metrics.find(m => m.value === metric);
    return metricObj?.icon || '📊';
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
            <h1 className="text-3xl font-bold text-gray-900">Gelişmiş Analitik</h1>
            <p className="text-gray-600 mt-1">Real-time veri analizi ve raporlama</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              📊 Rapor Oluştur
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              📤 Export
            </button>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online Kullanıcı</p>
                <p className="text-2xl font-bold text-green-600">{realTimeData.onlineUsers}</p>
                <p className="text-xs text-green-500 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  Canlı
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">👥</span>
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
                <p className="text-sm font-medium text-gray-600">Aktif Sipariş</p>
                <p className="text-2xl font-bold text-blue-600">{realTimeData.currentOrders}</p>
                <p className="text-xs text-blue-500 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></span>
                  İşleniyor
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📦</span>
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
                <p className="text-sm font-medium text-gray-600">Bugünkü Gelir</p>
                <p className="text-2xl font-bold text-purple-600">₺{realTimeData.revenue.toLocaleString()}</p>
                <p className="text-xs text-purple-500 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-1 animate-pulse"></span>
                  Güncelleniyor
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">💰</span>
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
                <p className="text-sm font-medium text-gray-600">Dönüşüm Oranı</p>
                <p className="text-2xl font-bold text-orange-600">%{realTimeData.conversionRate.toFixed(1)}</p>
                <p className="text-xs text-orange-500 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse"></span>
                  Real-time
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">📈</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Metric Selector */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analiz Metriği Seçin</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <button
                key={metric.value}
                onClick={() => setSelectedMetric(metric.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMetric === metric.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{metric.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{metric.label}</p>
                    <p className="text-sm text-gray-500">Detaylı analiz</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {metrics.find(m => m.value === selectedMetric)?.label} Trendi
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Son 7 gün</span>
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
            </div>
          </div>
          
          {/* Simple Chart Visualization */}
          <div className="h-64 flex items-end space-x-2">
            {chartData[selectedMetric as keyof typeof chartData]?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${(item.value / Math.max(...chartData[selectedMetric as keyof typeof chartData].map(d => d.value))) * 100}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex-1 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-lg relative group`}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.value}
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            {chartData[selectedMetric as keyof typeof chartData]?.map((item, index) => (
              <span key={index}>{new Date(item.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürünler</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} satış</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₺{product.revenue.toLocaleString()}</p>
                    <p className={`text-sm ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.growth > 0 ? '+' : ''}{product.growth}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'order' ? 'bg-blue-100' :
                    activity.type === 'user' ? 'bg-green-100' :
                    activity.type === 'payment' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <span className="text-sm">
                      {activity.type === 'order' ? '📦' :
                       activity.type === 'user' ? '👤' :
                       activity.type === 'payment' ? '💳' : '⭐'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{activity.time}</p>
                    {activity.amount && (
                      <p className="text-sm font-medium text-gray-900">{activity.amount}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </ModernAdminLayout>
  );
}
