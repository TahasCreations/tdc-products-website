'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function JournalsPage() {
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [showNewJournal, setShowNewJournal] = useState(false);

  const journals = [
    {
      id: '1',
      number: 'YEV-2024-001',
      date: '2024-01-15',
      description: 'Satış işlemi kaydı',
      type: 'SALES',
      status: 'POSTED',
      totalDebit: 1180,
      totalCredit: 1180,
      entries: 2,
      createdBy: 'Admin User'
    },
    {
      id: '2',
      number: 'YEV-2024-002',
      date: '2024-01-15',
      description: 'Alış işlemi kaydı',
      type: 'PURCHASE',
      status: 'DRAFT',
      totalDebit: 590,
      totalCredit: 590,
      entries: 2,
      createdBy: 'Admin User'
    },
    {
      id: '3',
      number: 'YEV-2024-003',
      date: '2024-01-16',
      description: 'Banka işlemi kaydı',
      type: 'BANK',
      status: 'POSTED',
      totalDebit: 5000,
      totalCredit: 5000,
      entries: 2,
      createdBy: 'Admin User'
    },
    {
      id: '4',
      number: 'YEV-2024-004',
      date: '2024-01-16',
      description: 'Kasa işlemi kaydı',
      type: 'CASH',
      status: 'REVIEW',
      totalDebit: 1000,
      totalCredit: 1000,
      entries: 2,
      createdBy: 'Admin User'
    }
  ];

  const journalEntries = [
    { id: '1', account: '120.01 - Alıcılar', description: 'Müşteri borcu', debit: 1180, credit: 0 },
    { id: '2', account: '500.01 - Satış Geliri', description: 'Satış geliri', debit: 0, credit: 1000 },
    { id: '3', account: '191.01 - KDV Hesapları', description: 'KDV', debit: 0, credit: 180 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'POSTED': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'REVIEW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'POSTED': return 'Kayıtlı';
      case 'DRAFT': return 'Taslak';
      case 'REVIEW': return 'İnceleme';
      default: return 'Bilinmiyor';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SALES': return 'text-green-600 bg-green-50';
      case 'PURCHASE': return 'text-blue-600 bg-blue-50';
      case 'BANK': return 'text-purple-600 bg-purple-50';
      case 'CASH': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'SALES': return 'Satış';
      case 'PURCHASE': return 'Alış';
      case 'BANK': return 'Banka';
      case 'CASH': return 'Kasa';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Yevmiye Defteri</h1>
            <p className="text-gray-600 mt-1">Muhasebe kayıtları ve yevmiye işlemleri</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button 
              onClick={() => setShowNewJournal(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              + Yeni Kayıt
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
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Kayıt</p>
                <p className="text-2xl font-bold text-gray-900">{journals.length}</p>
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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kayıtlı</p>
                <p className="text-2xl font-bold text-gray-900">
                  {journals.filter(j => j.status === 'POSTED').length}
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
                <span className="text-2xl">📋</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taslak</p>
                <p className="text-2xl font-bold text-gray-900">
                  {journals.filter(j => j.status === 'DRAFT').length}
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
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Tutar</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{journals.reduce((sum, j) => sum + j.totalDebit, 0).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Journals List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Yevmiye Kayıtları</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kayıt No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Açıklama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tür
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {journals.map((journal, index) => (
                  <motion.tr
                    key={journal.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedJournal(journal)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {journal.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(journal.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {journal.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(journal.type)}`}>
                        {getTypeText(journal.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(journal.status)}`}>
                        {getStatusText(journal.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₺{journal.totalDebit.toLocaleString('tr-TR')}
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

        {/* Journal Details */}
        {selectedJournal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Kayıt Detayları - {selectedJournal.number}
              </h3>
              <button
                onClick={() => setSelectedJournal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <p className="text-gray-900">{selectedJournal.description}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                <p className="text-gray-900">{new Date(selectedJournal.date).toLocaleDateString('tr-TR')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tür</label>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(selectedJournal.type)}`}>
                  {getTypeText(selectedJournal.type)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedJournal.status)}`}>
                  {getStatusText(selectedJournal.status)}
                </span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Yevmiye Kayıtları</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hesap</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Borç</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Alacak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {journalEntries.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{entry.account}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{entry.description}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          {entry.debit > 0 ? `₺${entry.debit.toLocaleString('tr-TR')}` : '-'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          {entry.credit > 0 ? `₺${entry.credit.toLocaleString('tr-TR')}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-sm font-medium text-gray-900">Toplam</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                        ₺{journalEntries.reduce((sum, e) => sum + e.debit, 0).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                        ₺{journalEntries.reduce((sum, e) => sum + e.credit, 0).toLocaleString('tr-TR')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Düzenle
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Yazdır
              </button>
              {selectedJournal.status === 'DRAFT' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Kaydet
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </ModernAdminLayout>
  );
}
