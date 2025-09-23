'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import AdminProtection from '../../../../../components/AdminProtection';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ClockIcon,
  ChartBarIcon,
  BanknotesIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface BankAccount {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  currency: string;
  balance: number;
  availableBalance: number;
  isActive: boolean;
  lastSyncDate?: string;
  syncStatus: 'success' | 'error' | 'pending' | 'never';
  createdAt: string;
}

interface BankTransaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  amount: number;
  balance: number;
  type: 'credit' | 'debit';
  category: string;
  reference: string;
  isReconciled: boolean;
  matchedInvoiceId?: string;
  createdAt: string;
}

interface Reconciliation {
  id: string;
  accountId: string;
  statementDate: string;
  statementBalance: number;
  bookBalance: number;
  difference: number;
  status: 'pending' | 'completed' | 'discrepancy';
  transactions: BankTransaction[];
  createdAt: string;
}

interface BankSummary {
  totalAccounts: number;
  totalBalance: number;
  totalAvailableBalance: number;
  pendingTransactions: number;
  unreconciledTransactions: number;
  lastSyncDate: string;
  syncErrors: number;
}

export default function AdvancedBankIntegration() {
  const { user } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [reconciliations, setReconciliations] = useState<Reconciliation[]>([]);
  const [summary, setSummary] = useState<BankSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [accountFilter, setAccountFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReconciliationModal, setShowReconciliationModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);

  useEffect(() => {
    fetchBankData();
  }, []);

  const fetchBankData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounting/advanced?module=bank-accounts');
      
      if (response.ok) {
        const data = await response.json();
        setBankAccounts(data.data.accounts);
        setSummary(data.data.summary);
      }
    } catch (error) {
      console.error('Error fetching bank data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAccount = async (accountId: string) => {
    try {
      const response = await fetch('/api/accounting/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_bank_account',
          data: { accountId }
        })
      });

      if (response.ok) {
        await fetchBankData();
      }
    } catch (error) {
      console.error('Error syncing account:', error);
    }
  };

  const handleReconcileTransaction = async (transactionId: string, invoiceId: string) => {
    try {
      const response = await fetch('/api/accounting/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reconcile_transaction',
          data: { transactionId, invoiceId }
        })
      });

      if (response.ok) {
        await fetchBankData();
      }
    } catch (error) {
      console.error('Error reconciling transaction:', error);
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'never': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircleIcon;
      case 'error': return XCircleIcon;
      case 'pending': return ClockIcon;
      case 'never': return ExclamationTriangleIcon;
      default: return ExclamationTriangleIcon;
    }
  };

  const getTransactionTypeColor = (type: string) => {
    return type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAccount = accountFilter === 'all' || transaction.accountId === accountFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'reconciled' && transaction.isReconciled) ||
                         (statusFilter === 'unreconciled' && !transaction.isReconciled);
    
    return matchesSearch && matchesAccount && matchesType && matchesStatus;
  });

  if (!user) {
    return <AdminProtection><div>Loading...</div></AdminProtection>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gelişmiş Banka Entegrasyonu</h1>
              <p className="text-gray-600 mt-1">Banka hesaplarınızı senkronize edin ve mutabakat yapın</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Yeni Hesap
              </button>
              <button
                onClick={() => setShowReconciliationModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <ChartBarIcon className="w-4 h-4 mr-2" />
                Mutabakat
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Bakiye</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalBalance)}</p>
                  <p className="text-sm text-gray-500">Tüm hesaplar</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Kullanılabilir Bakiye</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalAvailableBalance)}</p>
                  <p className="text-sm text-gray-500">Harcanabilir tutar</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bekleyen İşlemler</p>
                  <p className="text-2xl font-bold text-yellow-600">{summary.pendingTransactions}</p>
                  <p className="text-sm text-gray-500">Mutabakat bekleyen</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Senkronizasyon</p>
                  <p className="text-2xl font-bold text-blue-600">{summary.totalAccounts - summary.syncErrors}</p>
                  <p className="text-sm text-gray-500">/{summary.totalAccounts} başarılı</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <ArrowPathIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bank Accounts */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Banka Hesapları</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bankAccounts.map((account) => {
                const SyncIcon = getSyncStatusIcon(account.syncStatus);
                return (
                  <div key={account.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <BuildingLibraryIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{account.name}</h4>
                          <p className="text-sm text-gray-500">{account.bankName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSyncAccount(account.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ArrowPathIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Hesap No:</span>
                        <span className="text-sm font-medium">{account.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">IBAN:</span>
                        <span className="text-sm font-medium">{account.iban}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Bakiye:</span>
                        <span className="text-sm font-bold text-gray-900">{formatCurrency(account.balance)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Kullanılabilir:</span>
                        <span className="text-sm font-bold text-green-600">{formatCurrency(account.availableBalance)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Senkronizasyon:</span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSyncStatusColor(account.syncStatus)}`}>
                          <SyncIcon className="w-3 h-3 mr-1" />
                          {account.syncStatus === 'success' ? 'Başarılı' :
                           account.syncStatus === 'error' ? 'Hata' :
                           account.syncStatus === 'pending' ? 'Bekliyor' : 'Hiç'}
                        </span>
                      </div>
                      {account.lastSyncDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Son Senkronizasyon:</span>
                          <span className="text-sm text-gray-500">{formatDateTime(account.lastSyncDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="İşlem ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hesap</label>
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Hesaplar</option>
                {bankAccounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tip</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Tipler</option>
                <option value="credit">Alacak</option>
                <option value="debit">Borç</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="reconciled">Mutabakat Yapılmış</option>
                <option value="unreconciled">Mutabakat Bekleyen</option>
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Banka İşlemleri</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">İşlemler yükleniyor...</p>
            </div>
          ) : (
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
                      Tutar
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referans
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mutabakat
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
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-500">{transaction.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-sm text-gray-500">Bakiye: {formatCurrency(transaction.balance)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                          {transaction.type === 'credit' ? 'Alacak' : 'Borç'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.isReconciled ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.isReconciled ? 'Yapılmış' : 'Bekliyor'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {!transaction.isReconciled && (
                            <button
                              onClick={() => handleReconcileTransaction(transaction.id, 'INV-001')}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}