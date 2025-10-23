"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, TrendingUp, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // TODO: API endpoint'i oluşturulacak
      // const response = await fetch('/api/admin/dashboard/stats');
      // const data = await response.json();
      
      // Demo veriler temizlendi for now
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
      
      setStats(mockStats);
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Toplam Kullanıcı',
      value: stats.totalUsers.toLocaleString(),
      icon: <Users className="w-8 h-8" />,
      color: 'blue',
      change: '+12%'
    },
    {
      title: 'Toplam Ürün',
      value: stats.totalProducts.toLocaleString(),
      icon: <ShoppingBag className="w-8 h-8" />,
      color: 'green',
      change: '+8%'
    },
    {
      title: 'Toplam Sipariş',
      value: stats.totalOrders.toLocaleString(),
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'purple',
      change: '+15%'
    },
    {
      title: 'Toplam Gelir',
      value: `₺${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'yellow',
      change: '+22%'
    }
  ];

  const applicationCards = [
    {
      title: 'Bekleyen Başvurular',
      value: stats.pendingApplications,
      icon: <Clock className="w-6 h-6" />,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Onaylanan Başvurular',
      value: stats.approvedApplications,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    {
      title: 'Reddedilen Başvurular',
      value: stats.rejectedApplications,
      icon: <XCircle className="w-6 h-6" />,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CBA135]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">TDC Market yönetim paneline hoş geldiniz</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-sm text-green-600 mt-1">{card.change}</p>
                </div>
                <div className={`text-${card.color}-500`}>
                  {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Applications Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {applicationCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + 0.1 * index }}
              className={`${card.bgColor} ${card.borderColor} border rounded-lg p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${card.textColor} mb-1`}>{card.title}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
                <div className={card.textColor}>
                  {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/partners"
              className="flex items-center justify-center px-4 py-3 bg-[#CBA135] text-white rounded-lg hover:bg-[#B8941F] transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              Başvuruları Yönet
            </a>
            <a
              href="/admin/products"
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Ürünleri Yönet
            </a>
            <a
              href="/admin/orders"
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Siparişleri Yönet
            </a>
            <a
              href="/admin/users"
              className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              Kullanıcıları Yönet
            </a>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Son Aktiviteler</h2>
          <div className="space-y-4">
            {[
              { action: 'Yeni satıcı başvurusu', user: 'Ahmet Yılmaz', time: '2 saat önce', type: 'seller' },
              { action: 'Influencer başvurusu onaylandı', user: 'Ayşe Demir', time: '4 saat önce', type: 'influencer' },
              { action: 'Yeni ürün eklendi', user: 'Mehmet Kaya', time: '6 saat önce', type: 'product' },
              { action: 'Sipariş tamamlandı', user: 'Fatma Öz', time: '8 saat önce', type: 'order' }
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + 0.1 * index }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'seller' ? 'bg-blue-500' :
                    activity.type === 'influencer' ? 'bg-purple-500' :
                    activity.type === 'product' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.user}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}