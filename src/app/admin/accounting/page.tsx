'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function AccountingDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedCurrency, setSelectedCurrency] = useState('TRY');

  const periods = [
    { value: 'current', label: 'Mevcut Dönem' },
    { value: 'last', label: 'Geçen Dönem' },
    { value: 'ytd', label: 'Yıldan Bugüne' },
    { value: 'custom', label: 'Özel Tarih' }
  ];

  const currencies = [
    { value: 'TRY', label: '₺ Türk Lirası' },
    { value: 'USD', label: '$ US Dollar' },
    { value: 'EUR', label: '€ Euro' }
  ];

  const accountingData = {
    overview: {
      totalAssets: 1250000,
      totalLiabilities: 450000,
      totalEquity: 800000,
      netIncome: 125000,
      cashFlow: 85000,
      accountsReceivable: 180000,
      accountsPayable: 95000,
      inventory: 320000
    },
    recentTransactions: [
      { id: 'TXN-001', type: 'Sales Invoice', amount: 15000, date: '2024-10-30', status: 'Posted' },
      { id: 'TXN-002', type: 'Purchase Invoice', amount: -8500, date: '2024-10-29', status: 'Pending' },
      { id: 'TXN-003', type: 'Bank Transfer', amount: 25000, date: '2024-10-28', status: 'Posted' },
      { id: 'TXN-004', type: 'Expense', amount: -3200, date: '2024-10-27', status: 'Posted' }
    ],
    topAccounts: [
      { name: 'Cash - Main Account', balance: 125000, type: 'Asset' },
      { name: 'Accounts Receivable', balance: 180000, type: 'Asset' },
      { name: 'Inventory', balance: 320000, type: 'Asset' },
      { name: 'Accounts Payable', balance: -95000, type: 'Liability' },
      { name: 'Sales Revenue', balance: 450000, type: 'Revenue' }
    ],
    alerts: [
      { type: 'warning', message: '3 adet fatura onay bekliyor', action: 'İncele' },
      { type: 'info', message: 'Aylık kapanış 2 gün kaldı', action: 'Hazırla' },
      { type: 'success', message: 'Banka mutabakatı tamamlandı', action: 'Görüntüle' }
    ]
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Asset': return 'text-green-600';
      case 'Liability': return 'text-red-600';
      case 'Revenue': return 'text-blue-600';
      case 'Expense': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Accounting Dashboard</h1>
            <p className="text-gray-600 mt-1">ETA-class muhasebe ve finans yönetimi</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {currencies.map(currency => (
                <option key={currency.value} value={currency.value}>
                  {currency.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Varlıklar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedCurrency === 'TRY' ? '₺' : selectedCurrency === 'USD' ? '$' : '€'}
                  {accountingData.overview.totalAssets.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">+5.2% bu ay</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Gelir</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedCurrency === 'TRY' ? '₺' : selectedCurrency === 'USD' ? '$' : '€'}
                  {accountingData.overview.netIncome.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600">+12.3% bu ay</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📈</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nakit Akışı</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedCurrency === 'TRY' ? '₺' : selectedCurrency === 'USD' ? '$' : '€'}
                  {accountingData.overview.cashFlow.toLocaleString()}
                </p>
                <p className="text-sm text-purple-600">+8.7% bu ay</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">💸</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alacaklar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedCurrency === 'TRY' ? '₺' : selectedCurrency === 'USD' ? '$' : '€'}
                  {accountingData.overview.accountsReceivable.toLocaleString()}
                </p>
                <p className="text-sm text-orange-600">-2.1% bu ay</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">📋</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uyarılar ve Bildirimler</h3>
          <div className="space-y-3">
            {accountingData.alerts.map((alert, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-current rounded-full mr-3"></div>
                  <span className="font-medium">{alert.message}</span>
                </div>
                <button className="text-sm font-medium hover:underline">
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Son İşlemler</h3>
            <div className="space-y-3">
              {accountingData.recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{transaction.type}</p>
                    <p className="text-sm text-gray-500">{transaction.id} • {transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}
                      {selectedCurrency === 'TRY' ? '₺' : selectedCurrency === 'USD' ? '$' : '€'}
                      {Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'Posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Accounts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ana Hesaplar</h3>
            <div className="space-y-3">
              {accountingData.topAccounts.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{account.name}</p>
                    <p className={`text-sm ${getAccountTypeColor(account.type)}`}>{account.type}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {account.balance >= 0 ? '+' : ''}
                      {selectedCurrency === 'TRY' ? '₺' : selectedCurrency === 'USD' ? '$' : '€'}
                      {Math.abs(account.balance).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-left">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">📝</span>
              </div>
              <p className="font-medium text-gray-900">Yevmiye Girişi</p>
              <p className="text-sm text-gray-600">Yeni kayıt</p>
            </button>
            
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">💰</span>
              </div>
              <p className="font-medium text-gray-900">Fatura Oluştur</p>
              <p className="text-sm text-gray-600">Satış faturası</p>
            </button>
            
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">📊</span>
              </div>
              <p className="font-medium text-gray-900">Rapor Oluştur</p>
              <p className="text-sm text-gray-600">Mali tablolar</p>
            </button>
            
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-white text-sm">🔒</span>
              </div>
              <p className="font-medium text-gray-900">Dönem Kapat</p>
              <p className="text-sm text-gray-600">Aylık kapanış</p>
            </button>
          </div>
        </motion.div>
      </div>
    </ModernAdminLayout>
  );
}
