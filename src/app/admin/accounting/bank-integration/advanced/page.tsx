'use client';

import { useState, useEffect } from 'react';
import { 
  BuildingOfficeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  CogIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  accountType: 'checking' | 'savings' | 'business';
  currency: string;
  balance: number;
  availableBalance: number;
  isActive: boolean;
  lastSync: string;
  syncStatus: 'success' | 'error' | 'pending' | 'disabled';
}

interface BankTransaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  reference: string;
  balance: number;
  isMatched: boolean;
  matchedInvoiceId: string | null;
  category: string;
}

interface ReconciliationData {
  bankBalance: number;
  bookBalance: number;
  difference: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  outstandingChecks: number;
  lastReconciliation: string;
  status: 'balanced' | 'unbalanced' | 'pending';
}

export default function AdvancedBankIntegrationPage() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [reconciliationData, setReconciliationData] = useState<ReconciliationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [showReconciliation, setShowReconciliation] = useState(false);

  useEffect(() => {
    // Mock bank data
    const mockBankAccounts: BankAccount[] = [
      {
        id: '1',
        bankName: 'Türkiye İş Bankası',
        accountNumber: '1234567890',
        accountName: 'TDC Products A.Ş.',
        accountType: 'business',
        currency: 'TRY',
        balance: 125000,
        availableBalance: 120000,
        isActive: true,
        lastSync: '2024-01-20T10:30:00Z',
        syncStatus: 'success'
      },
      {
        id: '2',
        bankName: 'Garanti BBVA',
        accountNumber: '9876543210',
        accountName: 'TDC Products A.Ş.',
        accountType: 'checking',
        currency: 'TRY',
        balance: 75000,
        availableBalance: 75000,
        isActive: true,
        lastSync: '2024-01-20T09:15:00Z',
        syncStatus: 'success'
      },
      {
        id: '3',
        bankName: 'Akbank',
        accountNumber: '5555666677',
        accountName: 'TDC Products A.Ş.',
        accountType: 'savings',
        currency: 'USD',
        balance: 15000,
        availableBalance: 15000,
        isActive: false,
        lastSync: '2024-01-15T14:20:00Z',
        syncStatus: 'error'
      }
    ];

    const mockTransactions: BankTransaction[] = [
      {
        id: '1',
        accountId: '1',
        date: '2024-01-20',
        description: 'Müşteri Ödemesi - ABC Teknoloji',
        amount: 11800,
        type: 'credit',
        reference: 'REF001',
        balance: 125000,
        isMatched: true,
        matchedInvoiceId: 'INV-001',
        category: 'Müşteri Ödemesi'
      },
      {
        id: '2',
        accountId: '1',
        date: '2024-01-19',
        description: 'Tedarikçi Ödemesi - XYZ Ltd.',
        amount: 5000,
        type: 'debit',
        reference: 'REF002',
        balance: 113200,
        isMatched: true,
        matchedInvoiceId: 'INV-002',
        category: 'Tedarikçi Ödemesi'
      },
      {
        id: '3',
        accountId: '1',
        date: '2024-01-18',
        description: 'Banka Komisyonu',
        amount: 25,
        type: 'debit',
        reference: 'REF003',
        balance: 118200,
        isMatched: false,
        matchedInvoiceId: null,
        category: 'Banka Masrafı'
      },
      {
        id: '4',
        accountId: '2',
        date: '2024-01-17',
        description: 'Müşteri Ödemesi - Mehmet Demir',
        amount: 5900,
        type: 'credit',
        reference: 'REF004',
        balance: 75000,
        isMatched: false,
        matchedInvoiceId: null,
        category: 'Müşteri Ödemesi'
      }
    ];

    const mockReconciliationData: ReconciliationData = {
      bankBalance: 125000,
      bookBalance: 124975,
      difference: 25,
      pendingDeposits: 0,
      pendingWithdrawals: 0,
      outstandingChecks: 0,
      lastReconciliation: '2024-01-15T16:00:00Z',
      status: 'unbalanced'
    };

    setTimeout(() => {
      setBankAccounts(mockBankAccounts);
      setTransactions(mockTransactions);
      setReconciliationData(mockReconciliationData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getSyncStatusColor = (status: string) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      disabled: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.disabled;
  };

  const getSyncStatusText = (status: string) => {
    const texts = {
      success: 'Başarılı',
      error: 'Hata',
      pending: 'Bekliyor',
      disabled: 'Devre Dışı'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getSyncStatusIcon = (status: string) => {
    const icons = {
      success: CheckCircleIcon,
      error: XCircleIcon,
      pending: ClockIcon,
      disabled: XCircleIcon
    };
    return icons[status as keyof typeof icons] || XCircleIcon;
  };

  const getReconciliationStatusColor = (status: string) => {
    const colors = {
      balanced: 'bg-green-100 text-green-800',
      unbalanced: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getReconciliationStatusText = (status: string) => {
    const texts = {
      balanced: 'Dengeli',
      unbalanced: 'Dengesiz',
      pending: 'Bekliyor'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const filteredTransactions = selectedAccount === 'all' 
    ? transactions 
    : transactions.filter(t => t.accountId === selectedAccount);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Banka Entegrasyonu ve Mutabakat</h1>
              <p className="text-gray-600 mt-1">Otomatik banka veri senkronizasyonu ve mutabakat işlemleri</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <CogIcon className="w-4 h-4 mr-2 inline" />
                Ayarlar
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="w-4 h-4 mr-2 inline" />
                Yeni Hesap
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Bank Accounts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Banka Hesapları</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bankAccounts.map((account) => {
              const StatusIcon = getSyncStatusIcon(account.syncStatus);
              return (
                <div key={account.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{account.bankName}</h3>
                        <p className="text-sm text-gray-600">{account.accountNumber}</p>
                        <p className="text-xs text-gray-500">{account.accountName}</p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${account.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bakiye:</span>
                      <span className="font-medium">{formatCurrency(account.balance, account.currency)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Kullanılabilir:</span>
                      <span className="font-medium">{formatCurrency(account.availableBalance, account.currency)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Son Senkronizasyon:</span>
                      <span className="text-xs text-gray-500">
                        {new Date(account.lastSync).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSyncStatusColor(account.syncStatus)}`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {getSyncStatusText(account.syncStatus)}
                    </span>
                    <div className="flex space-x-1">
                      <button className="text-blue-600 hover:text-blue-700" title="Senkronize Et">
                        <ArrowPathIcon className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700" title="Ayarlar">
                        <CogIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reconciliation Status */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mutabakat Durumu</h2>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatCurrency(reconciliationData?.bankBalance || 0)}
                </div>
                <div className="text-sm text-gray-600">Banka Bakiyesi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {formatCurrency(reconciliationData?.bookBalance || 0)}
                </div>
                <div className="text-sm text-gray-600">Defter Bakiyesi</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 ${
                  (reconciliationData?.difference || 0) === 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(reconciliationData?.difference || 0)}
                </div>
                <div className="text-sm text-gray-600">Fark</div>
              </div>
              <div className="text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getReconciliationStatusColor(reconciliationData?.status || 'pending')}`}>
                  {getReconciliationStatusText(reconciliationData?.status || 'pending')}
                </span>
                <div className="text-sm text-gray-600 mt-2">Durum</div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <button 
                onClick={() => setShowReconciliation(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ShieldCheckIcon className="w-5 h-5 mr-2 inline" />
                Mutabakat Yap
              </button>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Banka İşlemleri</h2>
            <div className="flex items-center space-x-4">
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Hesaplar</option>
                {bankAccounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.bankName} - {account.accountNumber}
                  </option>
                ))}
              </select>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <ArrowPathIcon className="w-4 h-4 mr-2 inline" />
                Yenile
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Açıklama
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referans
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tutar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bakiye
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eşleşme
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`font-medium ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(transaction.balance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.isMatched ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            Eşleşti
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            Bekliyor
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900" title="Görüntüle">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-700" title="Eşleştir">
                            <CreditCardIcon className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-700" title="Kategori Değiştir">
                            <CogIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
