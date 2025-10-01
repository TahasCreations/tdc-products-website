'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function BankingPage() {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBank, setFilterBank] = useState('');

  const bankAccounts = [
    {
      id: '1',
      bankName: 'Türkiye İş Bankası',
      accountNumber: '1234-5678-9012-3456',
      accountName: 'TDC Products A.Ş. - Ana Hesap',
      currency: 'TRY',
      balance: 125000,
      availableBalance: 120000,
      blockedAmount: 5000,
      lastTransaction: '2024-01-20',
      status: 'ACTIVE',
      iban: 'TR12 0006 4000 0011 2345 6789 01'
    },
    {
      id: '2',
      bankName: 'Garanti BBVA',
      accountNumber: '9876-5432-1098-7654',
      accountName: 'TDC Products A.Ş. - Döviz Hesabı',
      currency: 'USD',
      balance: 25000,
      availableBalance: 25000,
      blockedAmount: 0,
      lastTransaction: '2024-01-18',
      status: 'ACTIVE',
      iban: 'TR33 0006 2000 0012 3456 7890 12'
    },
    {
      id: '3',
      bankName: 'Akbank',
      accountNumber: '5555-4444-3333-2222',
      accountName: 'TDC Products A.Ş. - Kredi Hesabı',
      currency: 'TRY',
      balance: -50000,
      availableBalance: 100000,
      blockedAmount: 0,
      lastTransaction: '2024-01-15',
      status: 'ACTIVE',
      iban: 'TR56 0004 1000 0012 3456 7890 13'
    },
    {
      id: '4',
      bankName: 'Yapı Kredi',
      accountNumber: '1111-2222-3333-4444',
      accountName: 'TDC Products A.Ş. - Yedek Hesap',
      currency: 'TRY',
      balance: 75000,
      availableBalance: 75000,
      blockedAmount: 0,
      lastTransaction: '2024-01-10',
      status: 'INACTIVE',
      iban: 'TR78 0006 7000 0012 3456 7890 14'
    }
  ];

  const recentTransactions = [
    {
      id: '1',
      date: '2024-01-20',
      description: 'Müşteri ödemesi - Ahmet Yılmaz',
      amount: 2500,
      type: 'CREDIT',
      balance: 125000,
      reference: 'PAY-2024-001'
    },
    {
      id: '2',
      date: '2024-01-19',
      description: 'Tedarikçi ödemesi - ABC Tedarik',
      amount: -5000,
      type: 'DEBIT',
      balance: 122500,
      reference: 'PAY-2024-002'
    },
    {
      id: '3',
      date: '2024-01-18',
      description: 'Döviz alımı',
      amount: -10000,
      type: 'DEBIT',
      balance: 127500,
      reference: 'FX-2024-001'
    },
    {
      id: '4',
      date: '2024-01-17',
      description: 'Müşteri ödemesi - Sarah Johnson',
      amount: 1500,
      type: 'CREDIT',
      balance: 137500,
      reference: 'PAY-2024-003'
    }
  ];

  const filteredAccounts = bankAccounts.filter(account => {
    const matchesSearch = account.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.accountNumber.includes(searchTerm) ||
                         account.accountName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBank = !filterBank || account.bankName === filterBank;
    return matchesSearch && matchesBank;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'BLOCKED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktif';
      case 'INACTIVE': return 'Pasif';
      case 'BLOCKED': return 'Bloklu';
      default: return 'Bilinmiyor';
    }
  };

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case 'TRY': return '₺';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currency;
    }
  };

  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);
  const totalAvailable = bankAccounts.reduce((sum, account) => sum + account.availableBalance, 0);

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Banka & Nakit Yönetimi</h1>
            <p className="text-gray-600 mt-1">Banka hesapları ve nakit akış takibi</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              + Yeni Hesap
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
                <span className="text-2xl">🏦</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Hesap</p>
                <p className="text-2xl font-bold text-gray-900">{bankAccounts.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Toplam Bakiye</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{totalBalance.toLocaleString('tr-TR')}
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
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kullanılabilir</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{totalAvailable.toLocaleString('tr-TR')}
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
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔒</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bloklu Tutar</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₺{bankAccounts.reduce((sum, account) => sum + account.blockedAmount, 0).toLocaleString('tr-TR')}
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
                placeholder="Hesap ara (banka, hesap no, IBAN)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterBank}
              onChange={(e) => setFilterBank(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Tüm Bankalar</option>
              {[...new Set(bankAccounts.map(account => account.bankName))].map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bank Accounts List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Banka Hesapları</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Banka & Hesap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IBAN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bakiye
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanılabilir
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bloklu
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
                {filteredAccounts.map((account, index) => (
                  <motion.tr
                    key={account.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedAccount(account)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{account.bankName}</div>
                        <div className="text-sm text-gray-500">{account.accountName}</div>
                        <div className="text-xs text-gray-400">{account.accountNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">{account.iban}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getCurrencySymbol(account.currency)}{account.balance.toLocaleString('tr-TR')}
                      </div>
                      <div className="text-xs text-gray-500">{account.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCurrencySymbol(account.currency)}{account.availableBalance.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${account.blockedAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {getCurrencySymbol(account.currency)}{account.blockedAmount.toLocaleString('tr-TR')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(account.status)}`}>
                        {getStatusText(account.status)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Account Details */}
        {selectedAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Hesap Detayları - {selectedAccount.bankName}
              </h3>
              <button
                onClick={() => setSelectedAccount(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Adı</label>
                <p className="text-gray-900">{selectedAccount.accountName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Numarası</label>
                <p className="text-gray-900 font-mono">{selectedAccount.accountNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                <p className="text-gray-900 font-mono">{selectedAccount.iban}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
                <p className="text-gray-900">{selectedAccount.currency}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Son İşlem</label>
                <p className="text-gray-900">{new Date(selectedAccount.lastTransaction).toLocaleDateString('tr-TR')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedAccount.status)}`}>
                  {getStatusText(selectedAccount.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Toplam Bakiye</h4>
                <p className="text-2xl font-bold text-blue-900">
                  {getCurrencySymbol(selectedAccount.currency)}{selectedAccount.balance.toLocaleString('tr-TR')}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 mb-1">Kullanılabilir</h4>
                <p className="text-2xl font-bold text-green-900">
                  {getCurrencySymbol(selectedAccount.currency)}{selectedAccount.availableBalance.toLocaleString('tr-TR')}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 mb-1">Bloklu Tutar</h4>
                <p className="text-2xl font-bold text-red-900">
                  {getCurrencySymbol(selectedAccount.currency)}{selectedAccount.blockedAmount.toLocaleString('tr-TR')}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Son İşlemler</h4>
              <div className="space-y-3">
                {recentTransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-xs text-gray-500">{transaction.reference} - {transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'CREDIT' ? '+' : '-'}₺{Math.abs(transaction.amount).toLocaleString('tr-TR')}
                      </p>
                      <p className="text-xs text-gray-500">Bakiye: ₺{transaction.balance.toLocaleString('tr-TR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Düzenle
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Para Transferi
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                İşlem Geçmişi
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Ekstre İndir
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ModernAdminLayout>
  );
}
