'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChartBarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
  ShieldCheckIcon,
  CloudIcon,
  BellIcon,
  EyeIcon,
  PlusIcon,
  ArrowRightIcon,
  SparklesIcon,
  FireIcon,
  StarIcon,
  CpuChipIcon,
  DevicePhoneMobileIcon,
  CodeBracketIcon,
  ChartBarIcon as PerformanceIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  monthlyGrowth: number;
  conversionRate: number;
  averageOrderValue: number;
  activeUsers: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'product' | 'customer' | 'payment' | 'blog';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
  bgColor: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - Gerçek API'den gelecek
  useEffect(() => {
    const mockStats: DashboardStats = {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      monthlyGrowth: 0,
      conversionRate: 0,
      averageOrderValue: 0,
      activeUsers: 0
    };

    const mockActivities: RecentActivity[] = [
      {
        id: '1',
        type: 'order',
        title: 'Yeni Sipariş',
        description: 'Henüz ürün eklenmemiş',
        timestamp: 'Az önce',
        status: 'info'
      },
      {
        id: '2',
        type: 'product',
        title: 'Ürün Ekleme',
        description: 'İlk ürününüzü ekleyin',
        timestamp: 'Az önce',
        status: 'info'
      }
    ];

    setTimeout(() => {
      setStats(mockStats);
      setRecentActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const quickActions: QuickAction[] = [
    {
      title: 'Ürün Ekle',
      description: 'Yeni ürün ekle ve katalogunu genişlet',
      icon: PlusIcon,
      href: '/admin/products',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Sipariş Yönetimi',
      description: 'Siparişleri takip et ve yönet',
      icon: ShoppingCartIcon,
      href: '/admin/orders',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Muhasebe',
      description: 'Eta Paraşüt entegrasyonu ile muhasebe',
      icon: CurrencyDollarIcon,
      href: '/admin/accounting',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Performans',
      description: 'Sistem performansı izleme ve optimizasyon',
      icon: PerformanceIcon,
      href: '/admin/performance',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'E-Ticaret',
      description: 'İkas tarzı e-ticaret modülü',
      icon: ShoppingCartIcon,
      href: '/admin/ecommerce',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Blog Editörü',
      description: 'Sürükle-bırak blog editörü',
      icon: DocumentTextIcon,
      href: '/admin/blogs',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      title: 'Ödeme Sistemi',
      description: 'Gelişmiş ödeme yönetimi',
      icon: CurrencyDollarIcon,
      href: '/admin/payments',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      success: 'text-green-600 bg-green-100',
      warning: 'text-yellow-600 bg-yellow-100',
      error: 'text-red-600 bg-red-100',
      info: 'text-blue-600 bg-blue-100'
    };
    return colors[status as keyof typeof colors] || colors.info;
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      order: ShoppingCartIcon,
      product: PlusIcon,
      customer: UsersIcon,
      payment: CurrencyDollarIcon,
      blog: DocumentTextIcon
    };
    return icons[type as keyof typeof icons] || DocumentTextIcon;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Sisteminizi yönetin ve kontrol edin</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <PlusIcon className="w-4 h-4 mr-2" />
                Hızlı Eylem
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <CogIcon className="w-4 h-4 mr-2" />
                Ayarlar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
                <p className="text-sm text-gray-500">Bu ay</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                <p className="text-sm text-gray-500">Bu ay</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Müşteriler</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalCustomers || 0}</p>
                <p className="text-sm text-gray-500">Aktif</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <UsersIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ürünler</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                <p className="text-sm text-gray-500">Katalogda</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <SparklesIcon className="w-6 h-6 text-blue-600 mr-2" />
            Hızlı Eylemler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group bg-white p-6 rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{action.description}</p>
                    <div className="flex items-center mt-3 text-blue-600 text-sm font-medium">
                      <span>Başla</span>
                      <ArrowRightIcon className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Advanced Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <SparklesIcon className="w-6 h-6 text-purple-600 mr-2" />
            Gelişmiş Modüller
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/admin/ai/advanced" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CpuChipIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Modülü</h3>
                  <p className="text-sm text-gray-600">Makine öğrenmesi ile akıllı iş zekası</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/mobile-app" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mobil Uygulama</h3>
                  <p className="text-sm text-gray-600">iOS ve Android uygulama yönetimi</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/api-docs" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CodeBracketIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">API Dokümantasyonu</h3>
                  <p className="text-sm text-gray-600">Geliştiriciler için API rehberi</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/security/advanced" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <ShieldCheckIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gelişmiş Güvenlik</h3>
                  <p className="text-sm text-gray-600">Kapsamlı güvenlik yönetimi</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/automation" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <CogIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Otomasyon</h3>
                  <p className="text-sm text-gray-600">Workflow ve iş süreci otomasyonu</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/analytics" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gelişmiş Analizler</h3>
                  <p className="text-sm text-gray-600">Detaylı veri analizi ve raporlama</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* E-Ticaret Modülü */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <ShoppingCartIcon className="w-6 h-6 text-orange-600 mr-2" />
                E-Ticaret Modülü
              </h3>
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-medium rounded-full">
                İkas Tarzı
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Profesyonel e-ticaret yönetimi ile ürünlerinizi satın, siparişleri takip edin ve müşteri deneyimini optimize edin.
            </p>
            <div className="space-y-3">
              <Link href="/admin/products" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">Ürün Yönetimi</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/admin/orders" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">Sipariş Yönetimi</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/admin/customers" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">Müşteri Yönetimi</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Muhasebe Modülü */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <CurrencyDollarIcon className="w-6 h-6 text-purple-600 mr-2" />
                Muhasebe Modülü
              </h3>
              <span className="px-3 py-1 bg-purple-100 text-purple-600 text-sm font-medium rounded-full">
                Eta Paraşüt
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Eta Paraşüt entegrasyonu ile profesyonel muhasebe yönetimi. Faturalar, raporlar ve finansal analizler.
            </p>
            <div className="space-y-3">
              <Link href="/admin/accounting/invoices" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">Fatura Yönetimi</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/admin/accounting/reports" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">Mali Raporlar</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/admin/accounting/earnings" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">E-Arşiv Entegrasyonu</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Blog Editörü */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <DocumentTextIcon className="w-6 h-6 text-pink-600 mr-2" />
                Blog Editörü
              </h3>
              <span className="px-3 py-1 bg-pink-100 text-pink-600 text-sm font-medium rounded-full">
                Drag & Drop
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Sürükle-bırak özelliği ile kolay blog yazımı. Görselleri sürükleyerek bırakın, otomatik optimize edilsin.
            </p>
            <div className="space-y-3">
              <Link href="/admin/blogs" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">Blog Yönetimi</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/admin/blogs/write" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">Yeni Blog Yazısı</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/admin/media" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">Medya Kütüphanesi</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Ödeme Sistemi */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <CurrencyDollarIcon className="w-6 h-6 text-indigo-600 mr-2" />
                Ödeme Sistemi
              </h3>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm font-medium rounded-full">
                Gelişmiş
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Çoklu ödeme yöntemleri, otomatik faturalama ve güvenli ödeme işlemleri ile kapsamlı ödeme yönetimi.
            </p>
            <div className="space-y-3">
              <Link href="/admin/payments" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">Ödeme Yöntemleri</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/admin/payments/transactions" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">İşlem Geçmişi</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/admin/payments/settings" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700">Ödeme Ayarları</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BellIcon className="w-6 h-6 text-blue-600 mr-2" />
            Son Aktiviteler
          </h2>
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BellIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz aktivite yok</h3>
                  <p className="text-gray-600">Sisteminizi kullanmaya başladığınızda aktiviteler burada görünecek.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className={`p-2 rounded-full ${getStatusColor(activity.status).split(' ')[1]}`}>
                          <Icon className={`w-4 h-4 ${getStatusColor(activity.status).split(' ')[0]}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}