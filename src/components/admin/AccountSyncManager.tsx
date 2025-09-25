'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon,
  CloudIcon,
  UserIcon,
  CreditCardIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

interface SyncAccount {
  id: string;
  name: string;
  type: 'payment' | 'inventory' | 'customer' | 'social' | 'analytics';
  provider: string;
  status: 'synced' | 'syncing' | 'error' | 'pending';
  lastSync: string;
  nextSync: string;
  recordsCount: number;
  errorMessage?: string;
  autoSync: boolean;
}

interface SyncStats {
  totalAccounts: number;
  syncedAccounts: number;
  errorAccounts: number;
  pendingAccounts: number;
  lastFullSync: string;
  nextScheduledSync: string;
}

const mockAccounts: SyncAccount[] = [
  {
    id: '1',
    name: 'Stripe Ödeme Hesabı',
    type: 'payment',
    provider: 'Stripe',
    status: 'synced',
    lastSync: '2024-01-15T10:30:00Z',
    nextSync: '2024-01-15T11:00:00Z',
    recordsCount: 1247,
    autoSync: true
  },
  {
    id: '2',
    name: 'PayPal Ödeme Hesabı',
    type: 'payment',
    provider: 'PayPal',
    status: 'synced',
    lastSync: '2024-01-15T10:25:00Z',
    nextSync: '2024-01-15T11:00:00Z',
    recordsCount: 892,
    autoSync: true
  },
  {
    id: '3',
    name: 'WooCommerce Envanter',
    type: 'inventory',
    provider: 'WooCommerce',
    status: 'syncing',
    lastSync: '2024-01-15T09:45:00Z',
    nextSync: '2024-01-15T11:00:00Z',
    recordsCount: 3456,
    autoSync: true
  },
  {
    id: '4',
    name: 'Mailchimp Müşteri Listesi',
    type: 'customer',
    provider: 'Mailchimp',
    status: 'error',
    lastSync: '2024-01-14T16:20:00Z',
    nextSync: '2024-01-15T11:00:00Z',
    recordsCount: 0,
    errorMessage: 'API anahtarı geçersiz',
    autoSync: false
  },
  {
    id: '5',
    name: 'Google Analytics',
    type: 'analytics',
    provider: 'Google',
    status: 'synced',
    lastSync: '2024-01-15T10:15:00Z',
    nextSync: '2024-01-15T11:00:00Z',
    recordsCount: 15678,
    autoSync: true
  },
  {
    id: '6',
    name: 'Instagram Business Hesabı',
    type: 'social',
    provider: 'Instagram',
    status: 'pending',
    lastSync: '2024-01-14T14:30:00Z',
    nextSync: '2024-01-15T11:00:00Z',
    recordsCount: 234,
    autoSync: true
  }
];

const mockStats: SyncStats = {
  totalAccounts: 6,
  syncedAccounts: 3,
  errorAccounts: 1,
  pendingAccounts: 2,
  lastFullSync: '2024-01-15T10:30:00Z',
  nextScheduledSync: '2024-01-15T11:00:00Z'
};

export default function AccountSyncManager() {
  const [accounts, setAccounts] = useState<SyncAccount[]>(mockAccounts);
  const [stats, setStats] = useState<SyncStats>(mockStats);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced':
        return 'bg-green-100 text-green-800';
      case 'syncing':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'synced':
        return 'Senkronize';
      case 'syncing':
        return 'Senkronize Ediliyor';
      case 'error':
        return 'Hata';
      case 'pending':
        return 'Beklemede';
      default:
        return 'Bilinmiyor';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCardIcon className="w-5 h-5" />;
      case 'inventory':
        return <ShoppingCartIcon className="w-5 h-5" />;
      case 'customer':
        return <UserIcon className="w-5 h-5" />;
      case 'social':
        return <CloudIcon className="w-5 h-5" />;
      case 'analytics':
        return <InformationCircleIcon className="w-5 h-5" />;
      default:
        return <CloudIcon className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'text-green-600 bg-green-100';
      case 'inventory':
        return 'text-blue-600 bg-blue-100';
      case 'customer':
        return 'text-purple-600 bg-purple-100';
      case 'social':
        return 'text-pink-600 bg-pink-100';
      case 'analytics':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSync = async (accountId: string) => {
    setSyncing(accountId);
    
    // Update account status to syncing
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, status: 'syncing' as const }
        : account
    ));
    
    // Simulate sync process
    setTimeout(() => {
      setAccounts(prev => prev.map(account => 
        account.id === accountId 
          ? { 
              ...account, 
              status: 'synced' as const,
              lastSync: new Date().toISOString(),
              recordsCount: account.recordsCount + Math.floor(Math.random() * 100),
              errorMessage: undefined
            }
          : account
      ));
      setSyncing(null);
    }, 3000);
  };

  const handleSyncAll = async () => {
    const accountsToSync = accounts.filter(account => 
      account.status !== 'syncing' && account.autoSync
    );
    
    for (const account of accountsToSync) {
      await handleSync(account.id);
    }
  };

  const handleToggleAutoSync = (accountId: string) => {
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, autoSync: !account.autoSync }
        : account
    ));
  };

  const handleRetryError = async (accountId: string) => {
    // Clear error and retry sync
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, status: 'pending' as const, errorMessage: undefined }
        : account
    ));
    
    await handleSync(accountId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Hesap Senkronizasyonu</h2>
            <p className="text-gray-600 mt-1">Tüm hesaplarınızı senkronize edin ve verilerinizi güncel tutun</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowLogs(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <InformationCircleIcon className="w-4 h-4" />
              <span>Senkronizasyon Logları</span>
            </button>
            <button
              onClick={handleSyncAll}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Tümünü Senkronize Et</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CloudIcon className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.totalAccounts}</p>
                <p className="text-sm text-blue-700">Toplam Hesap</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-green-900">{stats.syncedAccounts}</p>
                <p className="text-sm text-green-700">Senkronize</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ClockIcon className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-yellow-900">{stats.pendingAccounts}</p>
                <p className="text-sm text-yellow-700">Beklemede</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center">
              <XCircleIcon className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-red-900">{stats.errorAccounts}</p>
                <p className="text-sm text-red-700">Hata</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <ArrowPathIcon className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-bold text-purple-900">
                  {new Date(stats.nextScheduledSync).toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                <p className="text-xs text-purple-700">Sonraki Senkronizasyon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Listesi</h3>
        
        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(account.type)}`}>
                    {getTypeIcon(account.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{account.name}</h4>
                    <p className="text-sm text-gray-600">{account.provider}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(account.status)}`}>
                    {getStatusText(account.status)}
                  </span>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={account.autoSync}
                      onChange={() => handleToggleAutoSync(account.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Otomatik</span>
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Kayıt Sayısı</p>
                  <p className="text-lg font-semibold text-gray-900">{account.recordsCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Son Senkronizasyon</p>
                  <p className="text-sm text-gray-900">
                    {new Date(account.lastSync).toLocaleString('tr-TR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sonraki Senkronizasyon</p>
                  <p className="text-sm text-gray-900">
                    {new Date(account.nextSync).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
              
              {account.errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-red-700">{account.errorMessage}</p>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                {account.status === 'error' ? (
                  <button
                    onClick={() => handleRetryError(account.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>Tekrar Dene</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleSync(account.id)}
                    disabled={syncing === account.id || account.status === 'syncing'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {syncing === account.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Senkronize Ediliyor...</span>
                      </>
                    ) : (
                      <>
                        <ArrowPathIcon className="w-4 h-4" />
                        <span>Senkronize Et</span>
                      </>
                    )}
                  </button>
                )}
                
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Ayarlar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sync Logs Modal */}
      {showLogs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Senkronizasyon Logları</h2>
              <button
                onClick={() => setShowLogs(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {[
                  { time: '2024-01-15T10:30:00Z', account: 'Stripe Ödeme Hesabı', status: 'success', message: '1,247 kayıt başarıyla senkronize edildi' },
                  { time: '2024-01-15T10:25:00Z', account: 'PayPal Ödeme Hesabı', status: 'success', message: '892 kayıt başarıyla senkronize edildi' },
                  { time: '2024-01-15T09:45:00Z', account: 'WooCommerce Envanter', status: 'syncing', message: 'Senkronizasyon devam ediyor...' },
                  { time: '2024-01-14T16:20:00Z', account: 'Mailchimp Müşteri Listesi', status: 'error', message: 'API anahtarı geçersiz' },
                  { time: '2024-01-14T14:30:00Z', account: 'Instagram Business Hesabı', status: 'success', message: '234 kayıt başarıyla senkronize edildi' }
                ].map((log, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      log.status === 'success' ? 'bg-green-500' : 
                      log.status === 'error' ? 'bg-red-500' : 
                      'bg-blue-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{log.account}</p>
                      <p className="text-sm text-gray-600">{log.message}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(log.time).toLocaleString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
