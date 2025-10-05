'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function AccountsPayablePage() {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const vendors = [
    {
      id: '1',
      code: 'VEND-001',
      name: 'ABC Tedarik A.Ş.',
      email: 'info@abctedarik.com',
      phone: '+90 212 555 0123',
      totalDebt: 25000,
      currentDebt: 15000,
      overdueDebt: 5000,
      lastPayment: '2024-01-12',
      paymentTerms: '30 gün',
      status: 'ACTIVE',
      invoices: 8
    },
    {
      id: '2',
      code: 'VEND-002',
      name: 'XYZ Malzeme Ltd.',
      email: 'contact@xyzm.com',
      phone: '+90 216 555 0456',
      totalDebt: 18000,
      currentDebt: 8000,
      overdueDebt: 0,
      lastPayment: '2024-01-18',
      paymentTerms: '15 gün',
      status: 'ACTIVE',
      invoices: 5
    },
    {
      id: '3',
      code: 'VEND-003',
      name: 'DEF Hizmetler A.Ş.',
      email: 'billing@defhizmet.com',
      phone: '+90 312 555 0789',
      totalDebt: 35000,
      currentDebt: 20000,
      overdueDebt: 10000,
      lastPayment: '2023-12-15',
      paymentTerms: '45 gün',
      status: 'WARNING',
      invoices: 12
    },
    {
      id: '4',
      code: 'VEND-004',
      name: 'GHI Lojistik Ltd.',
      email: 'accounts@ghilojistik.com',
      phone: '+90 232 555 0321',
      totalDebt: 12000,
      currentDebt: 3000,
      overdueDebt: 2000,
      lastPayment: '2024-01-08',
      paymentTerms: '20 gün',
      status: 'ACTIVE',
      invoices: 6
    }
  ];

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || vendor.status === filterStatus;
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

  const getPaymentPriority = (overdueDebt: number, totalDebt: number) => {
    const ratio = overdueDebt / totalDebt;
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
            <h1 className="text-3xl font-bold text-gray-900">Borçlar Yönetimi</h1>
            <p className="text-gray-600 mt-1">Tedarikçi borçları ve ödeme takibi</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              + Yeni Tedarikçi
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
                <span className="text-2xl">🏢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Tedarikçi</p>
                <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
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
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Borç</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{vendors.reduce((sum, v) => sum + v.totalDebt, 0).toLocaleString('tr-TR')}
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
                  ₺{vendors.reduce((sum, v) => sum + v.overdueDebt, 0).toLocaleString('tr-TR')}
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
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Güncel Borç</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{vendors.reduce((sum, v) => sum + v.currentDebt, 0).toLocaleString('tr-TR')}
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
                placeholder="Tedarikçi ara (isim, e-posta, kod)..."
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

        {/* Vendors List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Tedarikçi Listesi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tedarikçi
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
                    Ödeme Önceliği
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
                {filteredVendors.map((vendor, index) => {
                  const priority = getPaymentPriority(vendor.overdueDebt, vendor.totalDebt);
                  return (
                    <motion.tr
                      key={vendor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedVendor(vendor)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.code}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{vendor.email}</div>
                          <div className="text-sm text-gray-500">{vendor.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₺{vendor.totalDebt.toLocaleString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${vendor.overdueDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₺{vendor.overdueDebt.toLocaleString('tr-TR')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${priority.color}`}>
                          {priority.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vendor.status)}`}>
                          {getStatusText(vendor.status)}
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

        {/* Vendor Details */}
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Tedarikçi Detayları - {selectedVendor.name}
              </h3>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tedarikçi Kodu</label>
                <p className="text-gray-900 font-mono">{selectedVendor.code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <p className="text-gray-900">{selectedVendor.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <p className="text-gray-900">{selectedVendor.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Koşulları</label>
                <p className="text-gray-900">{selectedVendor.paymentTerms}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Borç</label>
                <p className="text-gray-900 font-semibold">₺{selectedVendor.totalDebt.toLocaleString('tr-TR')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Son Ödeme</label>
                <p className="text-gray-900">{new Date(selectedVendor.lastPayment).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-1">Güncel Borç</h4>
                <p className="text-2xl font-bold text-green-900">₺{selectedVendor.currentDebt.toLocaleString('tr-TR')}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 mb-1">Vadesi Geçen</h4>
                <p className="text-2xl font-bold text-red-900">₺{selectedVendor.overdueDebt.toLocaleString('tr-TR')}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Fatura Sayısı</h4>
                <p className="text-2xl font-bold text-blue-900">{selectedVendor.invoices}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Düzenle
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Ödeme Yap
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Fatura Listesi
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Ödeme Geçmişi
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ModernAdminLayout>
  );
}
