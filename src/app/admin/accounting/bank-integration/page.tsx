'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminProtection from '../../../../components/AdminProtection';
import { ApiWrapper } from '@/lib/api-wrapper';

interface Bank {
  id: string;
  name: string;
  code: string;
  logo_url?: string;
  website_url?: string;
  support_phone?: string;
  support_email?: string;
}

interface BankIntegration {
  id: string;
  bank_id: string;
  integration_type: string;
  api_endpoint?: string;
  is_test_mode: boolean;
  is_active: boolean;
  last_sync_at?: string;
  banks: Bank;
}

interface BankAccount {
  id: string;
  bank_id: string;
  account_name: string;
  account_number: string;
  iban: string;
  currency_code: string;
  account_type: string;
  balance: number;
  available_balance: number;
  is_active: boolean;
  banks: Bank;
}

interface BankTransaction {
  id: string;
  bank_account_id: string;
  transaction_date: string;
  amount: number;
  currency_code: string;
  transaction_type: string;
  description?: string;
  balance_after: number;
  bank_accounts: BankAccount;
}

interface BankTransfer {
  id: string;
  from_account_id: string;
  to_name: string;
  to_iban: string;
  amount: number;
  currency_code: string;
  description?: string;
  transfer_type: string;
  status: string;
  created_at: string;
  bank_accounts: BankAccount;
}

export default function BankIntegrationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [banks, setBanks] = useState<Bank[]>([]);
  const [integrations, setIntegrations] = useState<BankIntegration[]>([]);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [transfers, setTransfers] = useState<BankTransfer[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  // Form states
  const [showIntegrationForm, setShowIntegrationForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<BankIntegration | null>(null);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

  const [newIntegration, setNewIntegration] = useState({
    bank_id: '',
    integration_type: 'api',
    api_endpoint: '',
    api_key: '',
    api_secret: '',
    username: '',
    password: '',
    is_test_mode: true
  });

  const [newAccount, setNewAccount] = useState({
    bank_id: '',
    account_name: '',
    account_number: '',
    iban: '',
    currency_code: 'TRY',
    account_type: 'checking'
  });

  const [newTransfer, setNewTransfer] = useState({
    from_account_id: '',
    to_bank_code: '',
    to_account_number: '',
    to_iban: '',
    to_name: '',
    amount: '',
    currency_code: 'TRY',
    description: '',
    transfer_type: 'eft'
  });

  const fetchBanks = useCallback(async () => {
    try {
      const result = await ApiWrapper.get('/api/accounting/bank-integration?action=banks');
      if (result && (result as any).data) {
        setBanks((result as any).data);
      }
    } catch (error) {
      console.error('Banka listesi yüklenemedi:', error);
    }
  }, []);

  const fetchIntegrations = useCallback(async () => {
    try {
      const result = await ApiWrapper.get('/api/accounting/bank-integration?action=integrations');
      if (result && (result as any).data) {
        setIntegrations((result as any).data);
      }
    } catch (error) {
      console.error('Entegrasyon listesi yüklenemedi:', error);
    }
  }, []);

  const fetchAccounts = useCallback(async () => {
    try {
      const result = await ApiWrapper.get('/api/accounting/bank-integration?action=accounts');
      if (result && (result as any).data) {
        setAccounts((result as any).data);
      }
    } catch (error) {
      console.error('Hesap listesi yüklenemedi:', error);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      const result = await ApiWrapper.get('/api/accounting/bank-integration?action=transactions&limit=50');
      if (result && (result as any).data) {
        setTransactions((result as any).data);
      }
    } catch (error) {
      console.error('İşlem listesi yüklenemedi:', error);
    }
  }, []);

  const fetchTransfers = useCallback(async () => {
    try {
      const result = await ApiWrapper.get('/api/accounting/bank-integration?action=transfers&limit=50');
      if (result && (result as any).data) {
        setTransfers((result as any).data);
      }
    } catch (error) {
      console.error('Transfer listesi yüklenemedi:', error);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchBanks(),
        fetchIntegrations(),
        fetchAccounts(),
        fetchTransactions(),
        fetchTransfers()
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchBanks, fetchIntegrations, fetchAccounts, fetchTransactions, fetchTransfers]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleCreateIntegration = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    try {
      const result = await ApiWrapper.post('/api/accounting/bank-integration', {
        action: 'create_integration',
        ...newIntegration
      });

      if (result && (result as any).data) {
        await fetchIntegrations();
        setShowIntegrationForm(false);
        setNewIntegration({
          bank_id: '',
          integration_type: 'api',
          api_endpoint: '',
          api_key: '',
          api_secret: '',
          username: '',
          password: '',
          is_test_mode: true
        });
      }
    } catch (error) {
      console.error('Entegrasyon oluşturulamadı:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    try {
      const result = await ApiWrapper.post('/api/accounting/bank-integration', {
        action: 'create_account',
        ...newAccount
      });

      if (result && (result as any).data) {
        await fetchAccounts();
        setShowAccountForm(false);
        setNewAccount({
          bank_id: '',
          account_name: '',
          account_number: '',
          iban: '',
          currency_code: 'TRY',
          account_type: 'checking'
        });
      }
    } catch (error) {
      console.error('Hesap oluşturulamadı:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    try {
      const result = await ApiWrapper.post('/api/accounting/bank-integration', {
        action: 'create_transfer',
        ...newTransfer,
        amount: parseFloat(newTransfer.amount)
      });

      if (result && (result as any).data) {
        await fetchTransfers();
        setShowTransferForm(false);
        setNewTransfer({
          from_account_id: '',
          to_bank_code: '',
          to_account_number: '',
          to_iban: '',
          to_name: '',
          amount: '',
          currency_code: 'TRY',
          description: '',
          transfer_type: 'eft'
        });
      }
    } catch (error) {
      console.error('Transfer oluşturulamadı:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleTestConnection = async (integrationId: string) => {
    setApiLoading(true);
    try {
      const result = await ApiWrapper.post('/api/accounting/bank-integration', {
        action: 'test_connection',
        integration_id: integrationId
      });

      if (result && (result as any).data) {
        alert((result as any).data.message);
        await fetchIntegrations();
      }
    } catch (error) {
      console.error('Bağlantı testi başarısız:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleSyncAccount = async (accountId: string) => {
    setApiLoading(true);
    try {
      const result = await ApiWrapper.post('/api/accounting/bank-integration', {
        action: 'sync_account',
        account_id: accountId
      });

      if (result && (result as any).data) {
        await fetchAccounts();
        await fetchTransactions();
      }
    } catch (error) {
      console.error('Hesap senkronizasyonu başarısız:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Statistics calculations
  const statistics = useMemo(() => {
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    const activeIntegrations = integrations.filter(i => i.is_active).length;
    const activeAccounts = accounts.filter(a => a.is_active).length;
    const totalTransactions = transactions.length;
    const totalTransfers = transfers.length;
    const pendingTransfers = transfers.filter(t => t.status === 'processing').length;
    const completedTransfers = transfers.filter(t => t.status === 'completed').length;
    
    const monthlyTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.transaction_date);
      const now = new Date();
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear();
    });

    const monthlyIncome = monthlyTransactions
      .filter(t => t.transaction_type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthlyExpense = monthlyTransactions
      .filter(t => t.transaction_type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance,
      activeIntegrations,
      activeAccounts,
      totalTransactions,
      totalTransfers,
      pendingTransfers,
      completedTransfers,
      monthlyIncome,
      monthlyExpense,
      monthlyTransactions: monthlyTransactions.length
    };
  }, [accounts, integrations, transactions, transfers]);

  if (loading) {
    return (
      <AdminProtection>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Banka Entegrasyonları</h1>
              <p className="text-blue-100 text-lg">Halkbank, İş Bankası ve diğer bankalarla entegrasyon yönetimi</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/admin/accounting"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <i className="ri-arrow-left-line"></i>
                Muhasebe
              </Link>
              <button
                onClick={() => setShowIntegrationForm(true)}
                className="bg-white hover:bg-gray-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <i className="ri-add-line"></i>
                Entegrasyon Ekle
              </button>
              <button
                onClick={() => setShowAccountForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <i className="ri-bank-line"></i>
                Hesap Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
                { id: 'integrations', label: 'Entegrasyonlar', icon: 'ri-plug-line' },
                { id: 'accounts', label: 'Hesaplar', icon: 'ri-bank-line' },
                { id: 'transactions', label: 'İşlemler', icon: 'ri-exchange-line' },
                { id: 'transfers', label: 'Transferler', icon: 'ri-send-plane-line' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={tab.icon}></i>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="p-6 space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Toplam Bakiye</p>
                      <p className="text-2xl font-bold">{formatCurrency(statistics.totalBalance)}</p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3">
                      <i className="ri-wallet-3-line text-2xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Aktif Entegrasyonlar</p>
                      <p className="text-2xl font-bold">{statistics.activeIntegrations}</p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3">
                      <i className="ri-plug-line text-2xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Aktif Hesaplar</p>
                      <p className="text-2xl font-bold">{statistics.activeAccounts}</p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3">
                      <i className="ri-bank-line text-2xl"></i>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Bu Ay İşlem</p>
                      <p className="text-2xl font-bold">{statistics.monthlyTransactions}</p>
                    </div>
                    <div className="bg-white/20 rounded-full p-3">
                      <i className="ri-exchange-line text-2xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="ri-line-chart-line text-blue-600"></i>
                    Bu Ay Gelir-Gider Özeti
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500 rounded-full p-2">
                          <i className="ri-arrow-up-line text-white"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Toplam Gelir</p>
                          <p className="text-lg font-semibold text-green-600">{formatCurrency(statistics.monthlyIncome)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-500 rounded-full p-2">
                          <i className="ri-arrow-down-line text-white"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Toplam Gider</p>
                          <p className="text-lg font-semibold text-red-600">{formatCurrency(statistics.monthlyExpense)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500 rounded-full p-2">
                          <i className="ri-calculator-line text-white"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Net Kar/Zarar</p>
                          <p className={`text-lg font-semibold ${statistics.monthlyIncome - statistics.monthlyExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(statistics.monthlyIncome - statistics.monthlyExpense)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="ri-send-plane-line text-blue-600"></i>
                    Transfer Durumu
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500 rounded-full p-2">
                          <i className="ri-check-line text-white"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Tamamlanan Transferler</p>
                          <p className="text-lg font-semibold text-green-600">{statistics.completedTransfers}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-yellow-500 rounded-full p-2">
                          <i className="ri-time-line text-white"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Bekleyen Transferler</p>
                          <p className="text-lg font-semibold text-yellow-600">{statistics.pendingTransfers}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500 rounded-full p-2">
                          <i className="ri-file-list-line text-white"></i>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Toplam Transfer</p>
                          <p className="text-lg font-semibold text-blue-600">{statistics.totalTransfers}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="ri-history-line text-blue-600"></i>
                  Son Aktiviteler
                </h3>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-2 ${transaction.transaction_type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                          <i className={`ri-${transaction.transaction_type === 'credit' ? 'arrow-up' : 'arrow-down'}-line ${transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}></i>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.description || 'İşlem'}</p>
                          <p className="text-xs text-gray-500">{transaction.bank_accounts.account_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.transaction_type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency_code)}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.transaction_date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content can be implemented similarly */}
          {activeTab === 'integrations' && (
            <div className="p-6">
              <p className="text-gray-600">Entegrasyonlar sekmesi içeriği yakında eklenecek.</p>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="p-6">
              <p className="text-gray-600">Hesaplar sekmesi içeriği yakında eklenecek.</p>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="p-6">
              <p className="text-gray-600">İşlemler sekmesi içeriği yakında eklenecek.</p>
            </div>
          )}

          {activeTab === 'transfers' && (
            <div className="p-6">
              <p className="text-gray-600">Transferler sekmesi içeriği yakında eklenecek.</p>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}