'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  AlertCircle,
  Star,
  Eye,
  ArrowUpRight,
  Calendar,
  Clock,
} from 'lucide-react';

interface SellerDashboardProps {
  data: {
    seller: {
      id: string;
      storeName: string;
      storeSlug: string;
      description: string | null;
      logoUrl: string | null;
      rating: number;
      totalSales: number;
      status: string;
    };
    subscription: any;
    stats: {
      totalRevenue: number;
      thisMonthRevenue: number;
      revenueChange: number;
      totalOrders: number;
      thisMonthOrders: number;
      ordersChange: number;
      pendingOrders: number;
      completedOrders: number;
      totalProducts: number;
      lowStockProducts: number;
      avgRating: number;
    };
    recentOrders: Array<{
      id: string;
      orderNumber: string;
      total: number;
      status: string;
      createdAt: string;
    }>;
    recentProducts: Array<{
      id: string;
      title: string;
      price: number;
      stock: number;
      rating: number;
      reviewCount: number;
      createdAt: Date;
    }>;
  };
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const statusLabels: Record<string, string> = {
  pending: 'Beklemede',
  paid: 'Ödendi',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal',
  refunded: 'İade',
};

export default function SellerDashboard({ data }: SellerDashboardProps) {
  const { seller, subscription, stats, recentOrders, recentProducts } = data;

  const kpiCards = [
    {
      title: 'Bu Ay Gelir',
      value: `₺${stats.thisMonthRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Bu Ay Sipariş',
      value: stats.thisMonthOrders.toString(),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Bekleyen Sipariş',
      value: stats.pendingOrders.toString(),
      change: 0,
      icon: Clock,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-50',
      alert: stats.pendingOrders > 0,
    },
    {
      title: 'Toplam Ürün',
      value: stats.totalProducts.toString(),
      change: 0,
      icon: Package,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Hoş geldiniz, {seller.storeName}! 👋
          </h1>
          <p className="text-white/90 mb-6">
            Mağazanızın performansını takip edin ve işinizi büyütün
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${seller.storeSlug}`}
              target="_blank"
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-white/90 transition-all inline-flex items-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>Mağazayı Görüntüle</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/seller/products/new"
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all"
            >
              Yeni Ürün Ekle
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Subscription Alert */}
      {subscription && subscription.plan === 'FREE' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">
              Ücretsiz Plan Kullanıyorsunuz
            </h3>
            <p className="text-sm text-amber-800 mb-3">
              Premium özelliklere erişmek ve daha fazla satış yapmak için planınızı yükseltin
            </p>
            <Link
              href="/seller/billing"
              className="inline-block px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              Planları İncele
            </Link>
          </div>
        </motion.div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 bg-gradient-to-br ${card.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
              </div>
              {card.change !== 0 && (
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  card.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.change > 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{Math.abs(card.change).toFixed(1)}%</span>
                </div>
              )}
              {card.alert && (
                <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockProducts > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 mb-1">
              Düşük Stok Uyarısı
            </h3>
            <p className="text-sm text-red-800 mb-3">
              {stats.lowStockProducts} ürününüzün stoğu 10'un altında. Stok eklemek için ürün yönetimi sayfasına gidin.
            </p>
            <Link
              href="/seller/products/inventory"
              className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Stok Yönetimi
            </Link>
          </div>
        </motion.div>
      )}

      {/* Recent Orders & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Son Siparişler</h2>
              <Link
                href="/seller/orders"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Tümünü Gör
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/seller/orders/${order.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      #{order.orderNumber}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₺{order.total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                Henüz sipariş yok
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Son Eklenen Ürünler</h2>
              <Link
                href="/seller/products"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Tümünü Gör
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/seller/products/${product.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 flex-1 line-clamp-1">
                      {product.title}
                    </h3>
                    <span className="font-bold text-gray-900 ml-4">
                      ₺{product.price.toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className={`${product.stock < 10 ? 'text-red-600' : 'text-gray-600'}`}>
                        Stok: {product.stock}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({product.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                Henüz ürün eklenmemiş
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-6">Genel İstatistikler</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Toplam Gelir</p>
            <p className="text-2xl font-bold text-gray-900">
              ₺{stats.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Toplam Sipariş</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Tamamlanan</p>
            <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Ortalama Puan</p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</p>
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

