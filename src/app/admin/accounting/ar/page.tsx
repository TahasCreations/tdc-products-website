'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function AccountsReceivablePage() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const customers = [
    {
      id: '1',
      code: 'CUST-001',
      name: 'Ahmet Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 555 123 4567',
      totalDebt: 15000,
      currentDebt: 5000,
      overdueDebt: 2000,
      lastPayment: '2024-01-10',
      creditLimit: 25000,
      status: 'ACTIVE',
      invoices: 5
    },
    {
      id: '2',
      code: 'CUST-002',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 555 987 6543',
      totalDebt: 8500,
      currentDebt: 3500,
      overdueDebt: 0,
      lastPayment: '2024-01-15',
      creditLimit: 15000,
      status: 'ACTIVE',
      invoices: 3
    },
    {
      id: '3',
      code: 'CUST-003',
      name: 'Mehmet Kaya',
      email: 'mehmet@example.com',
      phone: '+90 555 456 7890',
      totalDebt: 25000,
      currentDebt: 8000,
      overdueDebt: 5000,
      lastPayment: '2023-12-20',
      creditLimit: 30000,
      status: 'BLOCKED',
      invoices: 8
    },
    {
      id: '4',
      code: 'CUST-004',
      name: 'Ayşe Demir',
      email: 'ayse@example.com',
      phone: '+90 555 321 0987',
      totalDebt: 12000,
      currentDebt: 2000,
      overdueDebt: 1000,
      lastPayment: '2024-01-05',
      creditLimit: 20000,
      status: 'WARNING',
      invoices: 4
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800';
      case 'BLOCKED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktif';
      case 'WARNING': return 'Uyarı';
      case 'BLOCKED': return 'Bloklu';
      default: return 'Bilinmiyor';
    }
  };

  const getRiskLevel = (overdueDebt: number, creditLimit: number) => {
    const ratio = overdueDebt / creditLimit;
    if (ratio > 0.3) return { level: 'Yüksek', color: 'text-red-600' };
    if (ratio > 0.1) return { level: 'Orta', color: 'text-yellow-600' };
    return { level: 'Düşük', color: 'text-green-600' };
  };

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Alacaklar Yönetimi</h1>
            <p className="text-gray-600 mt-1">Müşteri alacakları ve takip işlemleri</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              + Yeni Müşteri
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              📊 Rapor
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Alacak</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{customers.reduce((sum, c) => sum + c.totalDebt, 0).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vadesi Geçen</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{customers.reduce((sum, c) => sum + c.overdueDebt, 0).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bloklu Müşteri</p>
                <p className="text-2xl font-bold text-gray-900">
                  {customers.filter(c => c.status === 'BLOCKED').length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Müşteri ara (isim, e-posta, kod)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Tüm Durumlar</option>
              <option value="ACTIVE">Aktif</option>
              <option value="WARNING">Uyarı</option>
              <option value="BLOCKED">Bloklu</option>
            </select>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Müşteri Listesi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toplam Borç
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vadesi Geçen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer, index) => {
                  const risk = getRiskLevel(customer.overdueDebt, customer.creditLimit);
                  return (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">{customer.code}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺{customer.totalDebt.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${customer.overdueDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₺{customer.overdueDebt.toLocaleString('tr-TR')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${risk.color}`}>
                          {risk.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer.status)}`}>
                          {getStatusText(customer.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            👁️
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            💰
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            ✏️
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Details */}
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Müşteri Detayları - {selectedCustomer.name}
              </h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri Kodu</label>
                <p className="text-gray-900 font-mono">{selectedCustomer.code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <p className="text-gray-900">{selectedCustomer.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <p className="text-gray-900">{selectedCustomer.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kredi Limiti</label>
                <p className="text-gray-900">₺{selectedCustomer.creditLimit.toLocaleString('tr-TR')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Borç</label>
                <p className="text-gray-900 font-semibold">₺{selectedCustomer.totalDebt.toLocaleString('tr-TR')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Son Ödeme</label>
                <p className="text-gray-900">{new Date(selectedCustomer.lastPayment).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-1">Güncel Borç</h4>
                <p className="text-2xl font-bold text-green-900">₺{selectedCustomer.currentDebt.toLocaleString('tr-TR')}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 mb-1">Vadesi Geçen</h4>
                <p className="text-2xl font-bold text-red-900">₺{selectedCustomer.overdueDebt.toLocaleString('tr-TR')}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Fatura Sayısı</h4>
                <p className="text-2xl font-bold text-blue-900">{selectedCustomer.invoices}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Düzenle
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Ödeme Al
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Fatura Listesi
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                İletişim Geçmişi
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ModernAdminLayout>
  );
}
