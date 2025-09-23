'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  BuildingLibraryIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  CurrencyDollarIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'business';
  currency: string;
  balance: number;
  isConnected: boolean;
  lastSync: string;
  syncStatus: 'success' | 'error' | 'pending';
  transactionsCount: number;
  pendingTransactions: number;
}

export default function BankIntegration() {
  const { user } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'accounts' | 'transactions' | 'reconciliation' | 'settings'>('accounts');

  // Mock data
  useEffect(() => {
    const mockBankAccounts: BankAccount[] = [
      {
        id: '1',
        bankName: 'Türkiye İş Bankası',
        accountNumber: '****1234',
        accountType: 'business',
        currency: 'TRY',
        balance: 125000,
        isConnected: true,
        lastSync: '2024-01-15T10:30:00Z',
        syncStatus: 'success',
        transactionsCount: 45,
        pendingTransactions: 3
      },
      {
        id: '2',
        bankName: 'Garanti BBVA',
        accountNumber: '****5678',
        accountType: 'checking',
        currency: 'TRY',
        balance: 75000,
        isConnected: true,
        lastSync: '2024-01-15T09:15:00Z',
        syncStatus: 'success',
        transactionsCount: 32,
        pendingTransactions: 1
      },
      {
        id: '3',
        bankName: 'Akbank',
        accountNumber: '****9012',
        accountType: 'savings',
        currency: 'USD',
        balance: 25000,
        isConnected: false,
        lastSync: '2024-01-10T14:20:00Z',
        syncStatus: 'error',
        transactionsCount: 0,
        pendingTransactions: 0
      }
    ];

    setBankAccounts(mockBankAccounts);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getAccountTypeName = (type: string) => {
    switch (type) {
      case 'checking': return 'Vadesiz';
      case 'savings': return 'Vadeli';
      case 'business': return 'Ticari';
      default: return 'Bilinmiyor';
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSyncStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Başarılı';
      case 'error': return 'Hata';
      case 'pending': return 'Bekliyor';
      default: return 'Bilinmiyor';
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircleIcon;
      case 'error': return XCircleIcon;
      case 'pending': return ClockIcon;
      default: return ClockIcon;
    }
  };

  const syncAccount = (accountId: string) => {
    setBankAccounts(accounts => 
      accounts.map(account => 
        account.id === accountId 
          ? { ...account, syncStatus: 'pending' }
          : account
      )
    );

    // Simulate sync
    setTimeout(() => {
      setBankAccounts(accounts => 
        accounts.map(account => 
          account.id === accountId 
            ? { 
                ...account, 
                syncStatus: 'success', 
                lastSync: new Date().toISOString(),
                transactionsCount: account.transactionsCount + Math.floor(Math.random() * 5)
              }
            : account
        )
      );
    }, 2000);
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Banka Entegrasyonu</h1>
                <p className="mt-2 text-gray-600">Otomatik mutabakat ve banka işlemleri</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
                  Tümünü Senkronize Et
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Banka Hesabı Ekle
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'accounts', name: 'Banka Hesapları', icon: BuildingLibraryIcon },
                { id: 'transactions', name: 'İşlemler', icon: DocumentTextIcon },
                { id: 'reconciliation', name: 'Mutabakat', icon: ChartBarIcon },
                { id: 'settings', name: 'Ayarlar', icon: BanknotesIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Accounts Tab */}
          {activeTab === 'accounts' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bankAccounts.map((account) => {
                  const SyncStatusIcon = getSyncStatusIcon(account.syncStatus);
                  
                  return (
                    <div key={account.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg mr-4">
                              <BuildingLibraryIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{account.bankName}</h3>
                              <p className="text-sm text-gray-600">{account.accountNumber}</p>
                              <p className="text-xs text-gray-500">{getAccountTypeName(account.accountType)}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getSyncStatusColor(account.syncStatus)}`}>
                            <SyncStatusIcon className="w-3 h-3 mr-1" />
                            {getSyncStatusText(account.syncStatus)}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Bakiye:</span>
                            <span className="text-lg font-semibold text-gray-900">
                              {formatCurrency(account.balance, account.currency)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">İşlem Sayısı:</span>
                            <span className="text-sm text-gray-900">{account.transactionsCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Bekleyen İşlem:</span>
                            <span className="text-sm text-gray-900">{account.pendingTransactions}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Son Senkronizasyon:</span>
                            <span className="text-sm text-gray-900">
                              {new Date(account.lastSync).toLocaleString('tr-TR')}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => syncAccount(account.id)}
                            disabled={account.syncStatus === 'pending'}
                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            {account.syncStatus === 'pending' ? (
                              <>
                                <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                                Senkronize Ediliyor...
                              </>
                            ) : (
                              <>
                                <ArrowPathIcon className="w-4 h-4 mr-2" />
                                Senkronize Et
                              </>
                            )}
                          </button>
                          <button className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== 'accounts' && (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <BanknotesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'transactions' && 'İşlemler'}
                {activeTab === 'reconciliation' && 'Mutabakat'}
                {activeTab === 'settings' && 'Ayarlar'}
              </h3>
              <p className="text-gray-600">Bu bölüm geliştiriliyor...</p>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}