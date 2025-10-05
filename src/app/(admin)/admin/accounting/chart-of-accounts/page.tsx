'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import ModernAdminLayout from '@/components/admin/ModernAdminLayout';

export default function ChartOfAccountsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);

  const accounts = [
    { id: '1', code: '100', name: 'DÖNEN VARLIKLAR', type: 'ASSET', level: 1, parent: null, balance: 1250000 },
    { id: '2', code: '101', name: 'HAZIR DEĞERLER', type: 'ASSET', level: 2, parent: '1', balance: 250000 },
    { id: '3', code: '101.01', name: 'Kasa', type: 'ASSET', level: 3, parent: '2', balance: 50000 },
    { id: '4', code: '101.02', name: 'Alınan Çekler', type: 'ASSET', level: 3, parent: '2', balance: 200000 },
    { id: '5', code: '102', name: 'MENKUL KIYMETLER', type: 'ASSET', level: 2, parent: '1', balance: 300000 },
    { id: '6', code: '120', name: 'TİCARİ ALACAKLAR', type: 'ASSET', level: 2, parent: '1', balance: 400000 },
    { id: '7', code: '120.01', name: 'Alıcılar', type: 'ASSET', level: 3, parent: '6', balance: 350000 },
    { id: '8', code: '120.02', name: 'Alacak Senetleri', type: 'ASSET', level: 3, parent: '6', balance: 50000 },
    { id: '9', code: '200', name: 'DURAN VARLIKLAR', type: 'ASSET', level: 1, parent: null, balance: 800000 },
    { id: '10', code: '250', name: 'MADDİ DURAN VARLIKLAR', type: 'ASSET', level: 2, parent: '9', balance: 600000 },
    { id: '11', code: '300', name: 'KISA VADELİ BORÇLAR', type: 'LIABILITY', level: 1, parent: null, balance: 300000 },
    { id: '12', code: '320', name: 'TİCARİ BORÇLAR', type: 'LIABILITY', level: 2, parent: '11', balance: 200000 },
    { id: '13', code: '400', name: 'ÖZKAYNAKLAR', type: 'EQUITY', level: 1, parent: null, balance: 1750000 },
    { id: '14', code: '500', name: 'GELİRLER', type: 'REVENUE', level: 1, parent: null, balance: 5000000 },
    { id: '15', code: '600', name: 'GİDERLER', type: 'EXPENSE', level: 1, parent: null, balance: 4000000 },
  ];

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.code.includes(searchTerm)
  );

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'ASSET': return 'text-green-600 bg-green-50';
      case 'LIABILITY': return 'text-red-600 bg-red-50';
      case 'EQUITY': return 'text-blue-600 bg-blue-50';
      case 'REVENUE': return 'text-purple-600 bg-purple-50';
      case 'EXPENSE': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAccountTypeText = (type: string) => {
    switch (type) {
      case 'ASSET': return 'Varlık';
      case 'LIABILITY': return 'Borç';
      case 'EQUITY': return 'Özkaynak';
      case 'REVENUE': return 'Gelir';
      case 'EXPENSE': return 'Gider';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hesap Planı</h1>
            <p className="text-gray-600 mt-1">Muhasebe hesap yapısı ve hiyerarşisi</p>
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

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Hesap ara (kod veya isim)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">Tüm Hesaplar</option>
              <option value="ASSET">Varlıklar</option>
              <option value="LIABILITY">Borçlar</option>
              <option value="EQUITY">Özkaynaklar</option>
              <option value="REVENUE">Gelirler</option>
              <option value="EXPENSE">Giderler</option>
            </select>
          </div>
        </div>

        {/* Accounts Tree */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Hesap Hiyerarşisi</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredAccounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedAccount?.id === account.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                }`}
                onClick={() => setSelectedAccount(account)}
                style={{ paddingLeft: `${account.level * 20 + 16}px` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-sm text-gray-500">{account.code}</span>
                    <span className="font-medium text-gray-900">{account.name}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccountTypeColor(account.type)}`}>
                      {getAccountTypeText(account.type)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold text-gray-900">
                      ₺{account.balance.toLocaleString('tr-TR')}
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                        ✏️
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Account Details */}
        {selectedAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Detayları</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Kodu</label>
                <p className="text-gray-900 font-mono">{selectedAccount.code}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Adı</label>
                <p className="text-gray-900">{selectedAccount.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hesap Türü</label>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getAccountTypeColor(selectedAccount.type)}`}>
                  {getAccountTypeText(selectedAccount.type)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bakiye</label>
                <p className="text-gray-900 font-semibold">₺{selectedAccount.balance.toLocaleString('tr-TR')}</p>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Düzenle
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                İşlem Geçmişi
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Alt Hesap Ekle
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </ModernAdminLayout>
  );
}
