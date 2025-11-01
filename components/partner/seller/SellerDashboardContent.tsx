"use client";

import { motion } from 'framer-motion';
import {
  Package, ShoppingCart, DollarSign, TrendingUp, Users, Star,
  Eye, Heart, MessageSquare, Clock, AlertCircle, CheckCircle2,
  ArrowUp, ArrowDown, Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  products: number;
  orders: number;
  revenue: number;
  plan: string;
  storeName: string;
  rating: number;
}

interface SellerDashboardContentProps {
  data: DashboardData;
}

export default function SellerDashboardContent({ data }: SellerDashboardContentProps) {
  const kpiCards = [
    {
      label: 'Toplam Ürün',
      value: data.products,
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
    },
    {
      label: 'Toplam Sipariş',
      value: data.orders,
      change: '+18%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
    },
    {
      label: 'Toplam Gelir',
      value: `₺${data.revenue.toLocaleString('tr-TR')}`,
      change: '+24%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
    },
    {
      label: 'Mağaza Puanı',
      value: data.rating.toFixed(1),
      change: '+0.3',
      trend: 'up',
      icon: Star,
      color: 'from-yellow-600 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
    },
  ];

  const recentOrders = [
    { id: '1234', customer: 'Ahmet Yılmaz', amount: 299, status: 'Hazırlanıyor', time: '5 dk önce' },
    { id: '1235', customer: 'Ayşe Kaya', amount: 450, status: 'Kargoda', time: '1 saat önce' },
    { id: '1236', customer: 'Mehmet Demir', amount: 125, status: 'Teslim Edildi', time: '3 saat önce' },
  ];

  const lowStockProducts = [
    { name: 'Premium Kulaklık', stock: 3, sales: 45 },
    { name: 'Gaming Mouse', stock: 5, sales: 32 },
    { name: 'Mekanik Klavye', stock: 2, sales: 28 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
              Satıcı Paneli
            </h1>
            <p className="text-gray-600 mt-1">
              Hoş geldiniz, <span className="font-semibold text-indigo-600">{data.storeName}</span>!
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>{data.plan} Plan</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-gradient-to-br ${card.bgColor}`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-semibold ${
                  card.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  <span>{card.change}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-1">{card.label}</p>
              <p className="text-3xl font-black text-gray-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border-2 border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Son Siparişler</h2>
            <Link
              href="/partner/seller/orders"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Tümünü Gör →
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-900">#{order.id}</span>
                    <span className="text-gray-600">-</span>
                    <span className="text-gray-700">{order.customer}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{order.time}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-gray-900">₺{order.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'Teslim Edildi' ? 'bg-green-100 text-green-700' :
                    order.status === 'Kargoda' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border-2 border-gray-100 p-6"
        >
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Düşük Stok</h2>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((product, index) => (
              <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="font-semibold text-gray-900 mb-1">{product.name}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600 font-bold">
                    Stok: {product.stock} adet
                  </span>
                  <span className="text-gray-600">
                    {product.sales} satış
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/partner/seller/products/inventory"
            className="mt-4 w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Package className="w-4 h-4" />
            <span>Stok Yönetimi</span>
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Link
          href="/partner/seller/products/new"
          className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all group"
        >
          <Package className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-bold">Yeni Ürün Ekle</p>
          <p className="text-sm text-white/80">Ürün yükle</p>
        </Link>

        <Link
          href="/partner/seller/marketing/campaigns"
          className="p-6 bg-gradient-to-br from-pink-600 to-rose-600 text-white rounded-2xl hover:shadow-xl transition-all group"
        >
          <TrendingUp className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-bold">Kampanya Oluştur</p>
          <p className="text-sm text-white/80">Satışları artır</p>
        </Link>

        <Link
          href="/partner/seller/analytics"
          className="p-6 bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-2xl hover:shadow-xl transition-all group"
        >
          <Eye className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-bold">Analitik</p>
          <p className="text-sm text-white/80">Performansı gör</p>
        </Link>

        <Link
          href="/partner/seller/customers"
          className="p-6 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-2xl hover:shadow-xl transition-all group"
        >
          <Users className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
          <p className="font-bold">Müşteriler</p>
          <p className="text-sm text-white/80">CRM yönetimi</p>
        </Link>
      </motion.div>
    </div>
  );
}


