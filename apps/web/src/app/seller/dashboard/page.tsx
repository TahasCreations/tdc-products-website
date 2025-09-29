'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSellerAuth } from '../../hooks/useSellerAuth.js';
import { 
  ChartBarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
  BellIcon,
  EyeIcon,
  PlusIcon,
  ArrowRightIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  BuildingStorefrontIcon,
  TagIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface SellerStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  averageRating: number;
  totalReviews: number;
  pendingOrders: number;
  monthlyGrowth: number;
  conversionRate: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  productName: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
}

interface RecentReview {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Notification {
  id: string;
  type: 'order' | 'review' | 'payment' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  date: string;
}

function SellerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const { seller, isAuthenticated, logout } = useSellerAuth();
  
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/seller/login');
      return;
    }

    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalRevenue: 45670.50,
        totalOrders: 234,
        totalProducts: 45,
        averageRating: 4.7,
        totalReviews: 189,
        pendingOrders: 12,
        monthlyGrowth: 23.5,
        conversionRate: 8.2
      });

      setRecentOrders([
        {
          id: 'ORD-001',
          customerName: 'Ahmet Yılmaz',
          productName: 'Wireless Bluetooth Kulaklık',
          amount: 299.99,
          status: 'pending',
          orderDate: '2024-01-15T10:30:00Z'
        },
        {
          id: 'ORD-002',
          customerName: 'Fatma Demir',
          productName: 'Akıllı Saat',
          amount: 899.99,
          status: 'confirmed',
          orderDate: '2024-01-15T09:15:00Z'
        },
        {
          id: 'ORD-003',
          customerName: 'Mehmet Kaya',
          productName: 'Gaming Mouse',
          amount: 149.99,
          status: 'shipped',
          orderDate: '2024-01-14T16:45:00Z'
        }
      ]);

      setRecentReviews([
        {
          id: 'REV-001',
          customerName: 'Ayşe Özkan',
          productName: 'Wireless Bluetooth Kulaklık',
          rating: 5,
          comment: 'Çok kaliteli ürün, hızlı kargo. Teşekkürler!',
          date: '2024-01-15T14:20:00Z'
        },
        {
          id: 'REV-002',
          customerName: 'Ali Çelik',
          productName: 'Gaming Mouse',
          rating: 4,
          comment: 'İyi ürün, biraz küçük geldi ama kaliteli.',
          date: '2024-01-14T11:30:00Z'
        }
      ]);

      setNotifications([
        {
          id: 'NOT-001',
          type: 'order',
          title: 'Yeni Sipariş',
          message: 'ORD-001 numaralı sipariş alındı',
          isRead: false,
          date: '2024-01-15T10:35:00Z'
        },
        {
          id: 'NOT-002',
          type: 'review',
          title: 'Yeni Değerlendirme',
          message: 'Wireless Bluetooth Kulaklık için 5 yıldız değerlendirme',
          isRead: false,
          date: '2024-01-15T14:25:00Z'
        },
        {
          id: 'NOT-003',
          type: 'payment',
          title: 'Ödeme Alındı',
          message: 'ORD-003 numaralı sipariş için ödeme alındı',
          isRead: true,
          date: '2024-01-14T17:00:00Z'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, [isAuthenticated, router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return ClockIcon;
      case 'confirmed': return CheckCircleIcon;
      case 'shipped': return TruckIcon;
      case 'delivered': return CheckCircleIcon;
      case 'cancelled': return XCircleIcon;
      default: return ClockIcon;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return ShoppingCartIcon;
      case 'review': return StarIcon;
      case 'payment': return CreditCardIcon;
      case 'system': return CogIcon;
      default: return BellIcon;
    }
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
              <h1 className="text-3xl font-bold text-gray-900">
                {seller?.storeName} Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Hoş geldiniz, {seller?.firstName} {seller?.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                <BuildingStorefrontIcon className="w-4 h-4 mr-2" />
                Mağazayı Görüntüle
              </Link>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <PlusIcon className="w-4 h-4 mr-2" />
                Ürün Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Status Banner */}
        {status === 'pending' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-yellow-800">Başvurunuz İnceleniyor</h3>
                <p className="text-yellow-700">Satıcı başvurunuz doğrulama aşamasında. Genellikle 2-3 iş günü içinde sonuçlanır.</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
                <p className="text-sm text-green-600">+{stats?.monthlyGrowth}% bu ay</p>
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
                <p className="text-sm text-blue-600">{stats?.pendingOrders} bekleyen</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCartIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Ürün</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
                <p className="text-sm text-gray-500">Katalogda</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TagIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Puan</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900">{stats?.averageRating || 0}</p>
                  <StarIcon className="w-5 h-5 text-yellow-400 ml-1" />
                </div>
                <p className="text-sm text-gray-500">{stats?.totalReviews} değerlendirme</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <StarIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
                { id: 'orders', name: 'Siparişler', icon: ShoppingCartIcon },
                { id: 'products', name: 'Ürünler', icon: TagIcon },
                { id: 'reviews', name: 'Değerlendirmeler', icon: StarIcon },
                { id: 'analytics', name: 'Analitik', icon: ChartBarIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Son Siparişler</h3>
                    <Link href="/seller/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Tümünü Gör
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentOrders.map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      return (
                        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <StatusIcon className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{order.id}</p>
                              <p className="text-sm text-gray-600">{order.customerName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{formatCurrency(order.amount)}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Reviews */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Son Değerlendirmeler</h3>
                    <Link href="/seller/reviews" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Tümünü Gör
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {recentReviews.map((review) => (
                      <div key={review.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{review.customerName}</p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                        </div>
                        <p className="text-sm text-gray-600">{review.productName}</p>
                        <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Sipariş Yönetimi</h3>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Yeni Siparişleri Getir
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Filtrele
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sipariş
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Müşteri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ürün
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tutar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map((order) => {
                        const StatusIcon = getStatusIcon(order.status);
                        return (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <StatusIcon className="w-5 h-5 text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900">{order.id}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.customerName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {order.productName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(order.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(order.orderDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-blue-600 hover:text-blue-900">Detay</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other tabs content would go here */}
            {activeTab !== 'overview' && activeTab !== 'orders' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChartBarIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'products' && 'Ürün Yönetimi'}
                  {activeTab === 'reviews' && 'Değerlendirmeler'}
                  {activeTab === 'analytics' && 'Analitik'}
                </h3>
                <p className="text-gray-600">Bu bölüm yakında aktif olacak.</p>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <div key={notification.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                    notification.isRead ? 'bg-gray-50' : 'bg-blue-50'
                  }`}>
                    <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${
                          notification.isRead ? 'text-gray-900' : 'text-blue-900'
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(notification.date)}</p>
                      </div>
                      <p className={`text-sm ${
                        notification.isRead ? 'text-gray-600' : 'text-blue-700'
                      }`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellerDashboard() {
  return (
    <Suspense fallback={
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
    }>
      <SellerDashboardContent />
    </Suspense>
  );
}
