'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const customers = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 555 123 4567',
      status: 'active',
      joinDate: '2024-01-15',
      totalOrders: 12,
      totalSpent: 3599,
      lastOrder: '2024-10-30',
      avatar: 'AY'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 555 987 6543',
      status: 'active',
      joinDate: '2024-02-20',
      totalOrders: 8,
      totalSpent: 2399,
      lastOrder: '2024-10-29',
      avatar: 'SJ'
    },
    {
      id: 3,
      name: 'Mehmet Kaya',
      email: 'mehmet@example.com',
      phone: '+90 555 456 7890',
      status: 'inactive',
      joinDate: '2024-03-10',
      totalOrders: 3,
      totalSpent: 899,
      lastOrder: '2024-09-15',
      avatar: 'MK'
    },
    {
      id: 4,
      name: 'Ayşe Demir',
      email: 'ayse@example.com',
      phone: '+90 555 321 0987',
      status: 'active',
      joinDate: '2024-04-05',
      totalOrders: 15,
      totalSpent: 4599,
      lastOrder: '2024-10-28',
      avatar: 'AD'
    },
    {
      id: 5,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 555 456 7890',
      status: 'banned',
      joinDate: '2024-01-30',
      totalOrders: 2,
      totalSpent: 399,
      lastOrder: '2024-08-20',
      avatar: 'JS'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tüm Durumlar' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Pasif' },
    { value: 'banned', label: 'Yasaklı' }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Pasif';
      case 'banned': return 'Yasaklı';
      default: return 'Bilinmiyor';
    }
  };

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Müşteri Yönetimi</h1>
            <p className="text-gray-600">Tüm müşterileri görüntüleyin ve yönetin</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-purple-600 text-xl">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">₺{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-orange-600 text-xl">📊</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Sipariş</p>
                <p className="text-2xl font-bold text-gray-900">₺{Math.round(averageOrderValue)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="İsim, e-posta veya telefon ara..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sırala</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="name">İsim</option>
                <option value="joinDate">Kayıt Tarihi</option>
                <option value="totalSpent">Toplam Harcama</option>
                <option value="totalOrders">Sipariş Sayısı</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Siparişler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toplam Harcama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Son Sipariş
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-indigo-600 font-medium text-sm">{customer.avatar}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">ID: #{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{customer.email}</div>
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                        {getStatusText(customer.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.totalOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₺{customer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.lastOrder}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Görüntüle
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Düzenle
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          {customer.status === 'banned' ? 'Yasağı Kaldır' : 'Yasakla'}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">En Aktif Müşteriler</h3>
            <div className="space-y-3">
              {customers
                .sort((a, b) => b.totalOrders - a.totalOrders)
                .slice(0, 5)
                .map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-indigo-600 font-medium text-xs">{customer.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.totalOrders} sipariş</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">₺{customer.totalSpent.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Müşteriler</h3>
            <div className="space-y-3">
              {customers
                .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
                .slice(0, 5)
                .map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 font-medium text-xs">{customer.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.joinDate}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                      {getStatusText(customer.status)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
