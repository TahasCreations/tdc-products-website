'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon,
  BellIcon,
  CogIcon,
  PlusIcon,
  MinusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface DashboardData {
  realTimeStats: {
    onlineUsers: number;
    currentSales: number;
    pendingOrders: number;
    lowStockItems: number;
  };
  salesData: Array<{
    date: string;
    sales: number;
    revenue: number;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  recentActivities: Array<{
    id: string;
    type: 'sale' | 'order' | 'user' | 'inventory' | 'alert';
    message: string;
    timestamp: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  alerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info' | 'success';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>;
}

export default function AdvancedDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    // Simüle edilmiş gelişmiş dashboard verisi
    const mockData: DashboardData = {
      realTimeStats: {
        onlineUsers: 127,
        currentSales: 2340,
        pendingOrders: 12,
        lowStockItems: 8
      },
      salesData: [
        { date: '2024-01-15', sales: 45, revenue: 12500 },
        { date: '2024-01-16', sales: 52, revenue: 14200 },
        { date: '2024-01-17', sales: 38, revenue: 9800 },
        { date: '2024-01-18', sales: 67, revenue: 18900 },
        { date: '2024-01-19', sales: 43, revenue: 11200 },
        { date: '2024-01-20', sales: 58, revenue: 15600 },
        { date: '2024-01-21', sales: 72, revenue: 19800 }
      ],
      topProducts: [
        { id: '1', name: 'iPhone 15 Pro', sales: 45, revenue: 2025000, trend: 'up' },
        { id: '2', name: 'Samsung Galaxy S24', sales: 38, revenue: 1330000, trend: 'up' },
        { id: '3', name: 'Nike Air Max', sales: 67, revenue: 167500, trend: 'down' },
        { id: '4', name: 'Adidas T-Shirt', sales: 89, revenue: 31150, trend: 'stable' },
        { id: '5', name: 'MacBook Pro', sales: 12, revenue: 1020000, trend: 'up' }
      ],
      recentActivities: [
        { id: '1', type: 'sale', message: 'Yeni satış: iPhone 15 Pro - ₺45,000', timestamp: '2 dakika önce', priority: 'high' },
        { id: '2', type: 'order', message: 'Yeni sipariş #1234 - Beklemede', timestamp: '5 dakika önce', priority: 'medium' },
        { id: '3', type: 'user', message: 'Yeni kullanıcı kaydı: Ahmet Yılmaz', timestamp: '8 dakika önce', priority: 'low' },
        { id: '4', type: 'inventory', message: 'Stok uyarısı: Nike Air Max (3 adet kaldı)', timestamp: '12 dakika önce', priority: 'high' },
        { id: '5', type: 'alert', message: 'Sistem güncellemesi tamamlandı', timestamp: '15 dakika önce', priority: 'low' }
      ],
      alerts: [
        { id: '1', type: 'warning', title: 'Düşük Stok', message: '5 ürünün stoku kritik seviyede', timestamp: '10 dakika önce', read: false },
        { id: '2', type: 'error', title: 'Ödeme Hatası', message: 'Sipariş #1234 ödeme işlemi başarısız', timestamp: '25 dakika önce', read: false },
        { id: '3', type: 'info', title: 'Yeni Müşteri', message: 'VIP müşteri kaydı yapıldı', timestamp: '1 saat önce', read: true },
        { id: '4', type: 'success', title: 'Kampanya Başarılı', message: 'Yaz kampanyası %150 hedefi aştı', timestamp: '2 saat önce', read: true }
      ]
    };

    setTimeout(() => {
      setDashboardData(mockData);
      setLoading(false);
      setNotifications(mockData.alerts.filter(alert => !alert.read).length);
    }, 1000);
  }, [selectedTimeRange]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <CurrencyDollarIcon className="h-4 w-4 text-green-500" />;
      case 'order': return <ShoppingCartIcon className="h-4 w-4 text-blue-500" />;
      case 'user': return <UsersIcon className="h-4 w-4 text-purple-500" />;
      case 'inventory': return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
      case 'alert': return <BellIcon className="h-4 w-4 text-gray-500" />;
      default: return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'info': return <BellIcon className="h-5 w-5 text-blue-500" />;
      case 'success': return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default: return <BellIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gelişmiş Dashboard</h1>
              <p className="text-gray-600">Gerçek zamanlı veriler ve akıllı analizler</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                  <BellIcon className="h-6 w-6" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <CogIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['1h', '24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range === '1h' ? 'Son 1 Saat' : 
                 range === '24h' ? 'Son 24 Saat' :
                 range === '7d' ? 'Son 7 Gün' : 'Son 30 Gün'}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online Kullanıcı</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData?.realTimeStats.onlineUsers}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  +12% son saatte
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Günlük Satış</p>
                <p className="text-3xl font-bold text-gray-900">₺{dashboardData?.realTimeStats.currentSales.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                  +8.2% dün
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bekleyen Sipariş</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData?.realTimeStats.pendingOrders}</p>
                <p className="text-sm text-yellow-600 flex items-center mt-1">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  Ortalama 15 dk
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <ShoppingCartIcon className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Düşük Stok</p>
                <p className="text-3xl font-bold text-gray-900">{dashboardData?.realTimeStats.lowStockItems}</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  Acil müdahale
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Satış Trendi</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">Gelir</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">Satış</button>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">İnteraktif grafik yükleniyor...</p>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Satan Ürünler</h3>
            <div className="space-y-4">
              {dashboardData?.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.sales} satış</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(product.trend)}
                    <span className="font-medium text-gray-900">₺{product.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Aktiviteler</h3>
            <div className="space-y-4">
              {dashboardData?.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    activity.priority === 'high' ? 'bg-red-500' :
                    activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800">Tümünü Gör</button>
            </div>
            <div className="space-y-4">
              {dashboardData?.alerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  alert.type === 'error' ? 'bg-red-50 border-red-400' :
                  alert.type === 'info' ? 'bg-blue-50 border-blue-400' :
                  'bg-green-50 border-green-400'
                } ${!alert.read ? 'ring-2 ring-opacity-50' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                    </div>
                    {!alert.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
