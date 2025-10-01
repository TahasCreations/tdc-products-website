'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';
// Icons replaced with emojis

export default function ModernDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const router = useRouter();

  useEffect(() => {
    // Check admin authentication
    const adminAuth = document.cookie.includes('adminAuth=true');
    if (adminAuth) {
      setIsAuthenticated(true);
      // Simulate loading
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/admin');
    }
  }, [router]);

  const stats = [
    {
      title: 'Toplam Gelir',
      value: '₺2,847,392',
      change: '+12.5%',
      trend: 'up',
      icon: '💰',
      color: 'green',
      description: 'Bu ay'
    },
    {
      title: 'Toplam Sipariş',
      value: '1,847',
      change: '+8.2%',
      trend: 'up',
      icon: '🛒',
      color: 'blue',
      description: 'Bu ay'
    },
    {
      title: 'Aktif Kullanıcı',
      value: '12,847',
      change: '+15.3%',
      trend: 'up',
      icon: '👥',
      color: 'purple',
      description: 'Son 30 gün'
    },
    {
      title: 'Ürün Sayısı',
      value: '2,847',
      change: '+3.1%',
      trend: 'up',
      icon: '📦',
      color: 'orange',
      description: 'Toplam'
    },
    {
      title: 'Sayfa Görüntüleme',
      value: '847,392',
      change: '+22.1%',
      trend: 'up',
      icon: '👁️',
      color: 'indigo',
      description: 'Bu ay'
    },
    {
      title: 'Dönüşüm Oranı',
      value: '3.2%',
      change: '-0.5%',
      trend: 'down',
      icon: '📊',
      color: 'red',
      description: 'Bu ay'
    }
  ];

  const recentOrders = [
    { id: '#TDC-2024-001', customer: 'Ahmet Yılmaz', amount: '₺2,499', status: 'completed', date: '2 saat önce', product: 'Premium Figür Seti' },
    { id: '#TDC-2024-002', customer: 'Sarah Johnson', amount: '₺1,299', status: 'shipping', date: '4 saat önce', product: 'Anime Koleksiyonu' },
    { id: '#TDC-2024-003', customer: 'Mehmet Kaya', amount: '₺3,999', status: 'pending', date: '6 saat önce', product: 'Özel Tasarım Figür' },
    { id: '#TDC-2024-004', customer: 'Ayşe Demir', amount: '₺899', status: 'completed', date: '8 saat önce', product: 'Mini Figür Seti' },
    { id: '#TDC-2024-005', customer: 'John Smith', amount: '₺1,599', status: 'processing', date: '12 saat önce', product: 'Limited Edition' }
  ];

  const topProducts = [
    { name: 'Premium Figür Seti', sales: 247, revenue: '₺617,500', growth: '+15%', image: '🎭' },
    { name: 'Anime Koleksiyonu', sales: 189, revenue: '₺245,700', growth: '+8%', image: '🎌' },
    { name: 'Özel Tasarım Figür', sales: 156, revenue: '₺624,000', growth: '+22%', image: '🎨' },
    { name: 'Mini Figür Seti', sales: 298, revenue: '₺268,200', growth: '+5%', image: '🧸' },
    { name: 'Limited Edition', sales: 89, revenue: '₺142,400', growth: '+31%', image: '💎' }
  ];

  const quickActions = [
    { title: 'Yeni Ürün Ekle', description: 'Koleksiyona yeni figür ekle', icon: '➕', color: 'blue', href: '/admin/products/new' },
    { title: 'Sipariş İncele', description: 'Bekleyen siparişleri kontrol et', icon: '📦', color: 'green', href: '/admin/commerce/orders' },
    { title: 'Rapor Oluştur', description: 'Detaylı analiz raporu', icon: '📊', color: 'purple', href: '/admin/reports' },
    { title: 'Kampanya Başlat', description: 'Yeni pazarlama kampanyası', icon: '🎯', color: 'orange', href: '/admin/marketing/campaigns' },
    { title: 'AI Analizi', description: 'KDV ve kâr optimizasyonu', icon: '🤖', color: 'pink', href: '/admin/accounting/ai-assistant' },
    { title: 'Sistem Ayarları', description: 'Genel sistem konfigürasyonu', icon: '⚙️', color: 'gray', href: '/admin/settings' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'shipping': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'shipping': return 'Kargoda';
      case 'processing': return 'İşleniyor';
      case 'pending': return 'Beklemede';
      default: return 'Bilinmiyor';
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to /admin
  }

  if (isLoading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Dashboard yükleniyor...</p>
          </div>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">TDC Products yönetim paneline hoş geldiniz</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="7d">Son 7 gün</option>
              <option value="30d">Son 30 gün</option>
              <option value="90d">Son 90 gün</option>
              <option value="1y">Son 1 yıl</option>
            </select>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <span>🔄</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-xl flex items-center justify-center`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {stat.trend === 'up' ? (
                    <span className="text-green-500">↗</span>
                  ) : (
                    <span className="text-red-500">↘</span>
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Son Siparişler</h2>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                Tümünü Gör
              </button>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-coral-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                      <p className="text-xs text-gray-500">{order.product}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{order.amount}</p>
                      <p className="text-sm text-gray-500">{order.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">En Çok Satan Ürünler</h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl">{product.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} satış</p>
                    <p className="text-sm font-semibold text-gray-900">{product.revenue}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      product.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.growth}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Hızlı İşlemler</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 bg-${action.color}-50 rounded-xl hover:bg-${action.color}-100 transition-all duration-300 text-left group`}
              >
                <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-${action.color}-200 transition-colors`}>
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Sistem Durumu</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-xl">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Web Sitesi</p>
                <p className="text-sm text-gray-600">Çevrimiçi</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-xl">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Veritabanı</p>
                <p className="text-sm text-gray-600">Çevrimiçi</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-xl">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">API Servisleri</p>
                <p className="text-sm text-gray-600">Çevrimiçi</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-yellow-50 rounded-xl">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">E-posta</p>
                <p className="text-sm text-gray-600">Bakımda</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </ModernAdminLayout>
  );
}