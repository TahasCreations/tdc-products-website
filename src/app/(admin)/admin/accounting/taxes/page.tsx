'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function TaxesPage() {
  const [selectedTax, setSelectedTax] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const taxCodes = [
    {
      id: '1',
      code: 'KDV-18',
      name: 'Katma Değer Vergisi %18',
      rate: 18,
      type: 'VAT',
      description: 'Genel KDV oranı',
      isActive: true,
      effectiveDate: '2024-01-01',
      totalAmount: 45000
    },
    {
      id: '2',
      code: 'KDV-8',
      name: 'Katma Değer Vergisi %8',
      rate: 8,
      type: 'VAT',
      description: 'Temel gıda ve ilaç KDV oranı',
      isActive: true,
      effectiveDate: '2024-01-01',
      totalAmount: 12000
    },
    {
      id: '3',
      code: 'KDV-1',
      name: 'Katma Değer Vergisi %1',
      rate: 1,
      type: 'VAT',
      description: 'Ekmek ve unlu mamuller KDV oranı',
      isActive: true,
      effectiveDate: '2024-01-01',
      totalAmount: 500
    },
    {
      id: '4',
      code: 'GELIR-15',
      name: 'Gelir Vergisi %15',
      rate: 15,
      type: 'INCOME_TAX',
      description: 'Düşük gelir dilimi',
      isActive: true,
      effectiveDate: '2024-01-01',
      totalAmount: 25000
    },
    {
      id: '5',
      code: 'GELIR-20',
      name: 'Gelir Vergisi %20',
      rate: 20,
      type: 'INCOME_TAX',
      description: 'Orta gelir dilimi',
      isActive: true,
      effectiveDate: '2024-01-01',
      totalAmount: 35000
    },
    {
      id: '6',
      code: 'GELIR-27',
      name: 'Gelir Vergisi %27',
      rate: 27,
      type: 'INCOME_TAX',
      description: 'Yüksek gelir dilimi',
      isActive: true,
      effectiveDate: '2024-01-01',
      totalAmount: 15000
    },
    {
      id: '7',
      code: 'KURUMLAR-20',
      name: 'Kurumlar Vergisi %20',
      rate: 20,
      type: 'CORPORATE_TAX',
      description: 'Kurumlar vergisi oranı',
      isActive: true,
      effectiveDate: '2024-01-01',
      totalAmount: 80000
    },
    {
      id: '8',
      code: 'STOPAJ-20',
      name: 'Stopaj %20',
      rate: 20,
      type: 'WITHHOLDING',
      description: 'Hizmet alımları stopaj oranı',
      isActive: true,
      effectiveDate: '2024-01-01',
      totalAmount: 5000
    }
  ];

  const taxReturns = [
    {
      id: '1',
      period: '2024-01',
      type: 'KDV',
      dueDate: '2024-02-26',
      status: 'SUBMITTED',
      amount: 45000,
      submittedDate: '2024-02-20'
    },
    {
      id: '2',
      period: '2024-01',
      type: 'GELIR',
      dueDate: '2024-03-31',
      status: 'PENDING',
      amount: 75000,
      submittedDate: null
    },
    {
      id: '3',
      period: '2023-12',
      type: 'KDV',
      dueDate: '2024-01-26',
      status: 'SUBMITTED',
      amount: 42000,
      submittedDate: '2024-01-25'
    },
    {
      id: '4',
      period: '2023-12',
      type: 'KURUMLAR',
      dueDate: '2024-04-30',
      status: 'DRAFT',
      amount: 80000,
      submittedDate: null
    }
  ];

  const filteredTaxCodes = taxCodes.filter(tax => {
    const matchesSearch = tax.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tax.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tax.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || tax.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'VAT': return 'text-blue-600 bg-blue-50';
      case 'INCOME_TAX': return 'text-green-600 bg-green-50';
      case 'CORPORATE_TAX': return 'text-purple-600 bg-purple-50';
      case 'WITHHOLDING': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'VAT': return 'KDV';
      case 'INCOME_TAX': return 'Gelir Vergisi';
      case 'CORPORATE_TAX': return 'Kurumlar Vergisi';
      case 'WITHHOLDING': return 'Stopaj';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'Beyan Edildi';
      case 'PENDING': return 'Beklemede';
      case 'DRAFT': return 'Taslak';
      case 'OVERDUE': return 'Gecikmiş';
      default: return 'Bilinmiyor';
    }
  };

  const totalVAT = taxCodes.filter(t => t.type === 'VAT').reduce((sum, t) => sum + t.totalAmount, 0);
  const totalIncomeTax = taxCodes.filter(t => t.type === 'INCOME_TAX').reduce((sum, t) => sum + t.totalAmount, 0);
  const totalCorporateTax = taxCodes.filter(t => t.type === 'CORPORATE_TAX').reduce((sum, t) => sum + t.totalAmount, 0);

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vergi Yönetimi</h1>
            <p className="text-gray-600 mt-1">Vergi kodları, oranları ve beyannameler</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              + Yeni Vergi Kodu
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
                <span className="text-2xl">🧾</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam KDV</p>
                <p className="text-2xl font-bold text-gray-900">₺{totalVAT.toLocaleString('tr-TR')}</p>
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
                <span className="text-2xl">👤</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gelir Vergisi</p>
                <p className="text-2xl font-bold text-gray-900">₺{totalIncomeTax.toLocaleString('tr-TR')}</p>
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
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kurumlar Vergisi</p>
                <p className="text-2xl font-bold text-gray-900">₺{totalCorporateTax.toLocaleString('tr-TR')}</p>
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
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Beyanname</p>
                <p className="text-2xl font-bold text-gray-900">{taxReturns.length}</p>
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
                placeholder="Vergi kodu ara (isim, kod, açıklama)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Tüm Vergi Türleri</option>
              <option value="VAT">KDV</option>
              <option value="INCOME_TAX">Gelir Vergisi</option>
              <option value="CORPORATE_TAX">Kurumlar Vergisi</option>
              <option value="WITHHOLDING">Stopaj</option>
            </select>
          </div>
        </div>

        {/* Tax Codes List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Vergi Kodları</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kod
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Açıklama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Oran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tür
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Toplam Tutar
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
                {filteredTaxCodes.map((tax, index) => (
                  <motion.tr
                    key={tax.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedTax(tax)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tax.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{tax.name}</div>
                      <div className="text-sm text-gray-500">{tax.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">%{tax.rate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(tax.type)}`}>
                        {getTypeText(tax.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₺{tax.totalAmount.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${tax.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {tax.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          👁️
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          ✏️
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax Returns */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Vergi Beyannameleri</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dönem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tür
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vade Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beyan Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {taxReturns.map((returnItem, index) => (
                  <motion.tr
                    key={returnItem.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {returnItem.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {returnItem.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(returnItem.dueDate).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₺{returnItem.amount.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(returnItem.status)}`}>
                        {getStatusText(returnItem.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {returnItem.submittedDate ? new Date(returnItem.submittedDate).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          👁️
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          📤
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          ✏️
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tax Details */}
        {selectedTax && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Vergi Kodu Detayları - {selectedTax.code}
              </h3>
              <button
                onClick={() => setSelectedTax(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Kodu</label>
                <p className="text-gray-900 font-mono">{selectedTax.code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Oranı</label>
                <p className="text-gray-900 text-2xl font-bold">%{selectedTax.rate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Türü</label>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(selectedTax.type)}`}>
                  {getTypeText(selectedTax.type)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${selectedTax.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {selectedTax.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Yürürlük Tarihi</label>
                <p className="text-gray-900">{new Date(selectedTax.effectiveDate).toLocaleDateString('tr-TR')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Tutar</label>
                <p className="text-gray-900 font-semibold text-xl">₺{selectedTax.totalAmount.toLocaleString('tr-TR')}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
              <p className="text-gray-900">{selectedTax.description}</p>
            </div>

            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Düzenle
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Kullanım Raporu
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Geçmiş İşlemler
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ModernAdminLayout>
  );
}
