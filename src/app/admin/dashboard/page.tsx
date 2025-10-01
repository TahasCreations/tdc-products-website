'use client';

import { motion } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboard() {

  const stats = [
    { title: 'Toplam Sipariş', value: '1,234', change: '+12%', color: 'indigo' },
    { title: 'Toplam Gelir', value: '₺45,678', change: '+8%', color: 'green' },
    { title: 'Aktif Kullanıcı', value: '567', change: '+15%', color: 'blue' },
    { title: 'Ürün Sayısı', value: '89', change: '+3%', color: 'purple' }
  ];

  const recentOrders = [
    { id: '#1234', customer: 'Ahmet Yılmaz', amount: '₺299', status: 'Tamamlandı', date: '2024-10-30' },
    { id: '#1235', customer: 'Sarah Johnson', amount: '₺199', status: 'Kargoda', date: '2024-10-29' },
    { id: '#1236', customer: 'Mehmet Kaya', amount: '₺399', status: 'Beklemede', date: '2024-10-28' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <div className={`w-6 h-6 bg-${stat.color}-500 rounded`}></div>
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium text-${stat.color}-600`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">geçen aya göre</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Son Siparişler</h2>
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{order.amount}</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Tamamlandı' ? 'bg-green-100 text-green-800' :
                    order.status === 'Kargoda' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-left">
                <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm">+</span>
                </div>
                <p className="font-medium text-gray-900">Yeni Ürün</p>
                <p className="text-sm text-gray-600">Ürün ekle</p>
              </button>
              
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm">📊</span>
                </div>
                <p className="font-medium text-gray-900">Raporlar</p>
                <p className="text-sm text-gray-600">Analiz görüntüle</p>
              </button>
              
              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm">👥</span>
                </div>
                <p className="font-medium text-gray-900">Kullanıcılar</p>
                <p className="text-sm text-gray-600">Kullanıcı yönetimi</p>
              </button>
              
              <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-white text-sm">⚙️</span>
                </div>
                <p className="font-medium text-gray-900">Ayarlar</p>
                <p className="text-sm text-gray-600">Sistem ayarları</p>
              </button>
            </div>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sistem Durumu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Web Sitesi</p>
                <p className="text-sm text-gray-600">Çevrimiçi</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Veritabanı</p>
                <p className="text-sm text-gray-600">Çevrimiçi</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">E-posta</p>
                <p className="text-sm text-gray-600">Bakımda</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
