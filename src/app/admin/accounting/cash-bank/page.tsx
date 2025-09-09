'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminProtection from '../../../../components/AdminProtection';

interface Cashbox {
  id: string;
  name: string;
  type: 'CASH' | 'BANK';
  account_id: string;
  is_active: boolean;
  balance?: number;
}

interface CashTransaction {
  id: string;
  date: string;
  type: 'RECEIPT' | 'PAYMENT' | 'EXPENSE' | 'INTEREST' | 'COMMISSION';
  description: string;
  amount: number;
  reference: string;
  cashbox_id: string;
  contact_id?: string;
  status: 'PENDING' | 'POSTED';
}

interface BankAccount {
  id: string;
  name: string;
  bank_name: string;
  account_number: string;
  iban: string;
  currency: string;
  is_active: boolean;
  balance?: number;
}

export default function CashBankPage() {
  const [cashboxes, setCashboxes] = useState<Cashbox[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'cash' | 'bank' | 'transactions' | 'reports'>('cash');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCashbox, setSelectedCashbox] = useState<Cashbox | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Yeni kasa formu state'leri
  const [newCashbox, setNewCashbox] = useState({
    name: '',
    type: 'CASH' as 'CASH' | 'BANK',
    account_id: '',
    is_active: true
  });

  // Yeni işlem formu state'leri
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'RECEIPT' as 'RECEIPT' | 'PAYMENT' | 'EXPENSE' | 'INTEREST' | 'COMMISSION',
    description: '',
    amount: 0,
    reference: '',
    cashbox_id: '',
    contact_id: '',
    status: 'POSTED' as 'PENDING' | 'POSTED'
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCashboxes(),
        fetchBankAccounts(),
        fetchCashTransactions()
      ]);
    } catch (error) {
      console.error('Data fetch error:', error);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const fetchCashboxes = async () => {
    try {
      const response = await fetch('/api/accounting/cashboxes');
      if (!response.ok) throw new Error('Kasalar alınamadı');
      const data = await response.json();
      setCashboxes(data);
    } catch (error) {
      console.error('Cashboxes fetch error:', error);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const response = await fetch('/api/accounting/bank-accounts');
      if (!response.ok) throw new Error('Banka hesapları alınamadı');
      const data = await response.json();
      setBankAccounts(data);
    } catch (error) {
      console.error('Bank accounts fetch error:', error);
    }
  };

  const fetchCashTransactions = async () => {
    try {
      const response = await fetch('/api/accounting/cash-transactions');
      if (!response.ok) throw new Error('Kasa işlemleri alınamadı');
      const data = await response.json();
      setCashTransactions(data);
    } catch (error) {
      console.error('Cash transactions fetch error:', error);
    }
  };

  const handleAddCashbox = async () => {
    try {
      const response = await fetch('/api/accounting/cashboxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCashbox),
      });

      if (!response.ok) throw new Error('Kasa eklenemedi');

      await fetchCashboxes();
      setShowAddForm(false);
      setNewCashbox({
        name: '',
        type: 'CASH',
        account_id: '',
        is_active: true
      });
      setError('');
    } catch (error) {
      console.error('Add cashbox error:', error);
      setError('Kasa eklenirken hata oluştu');
    }
  };

  const handleAddTransaction = async () => {
    try {
      const response = await fetch('/api/accounting/cash-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) throw new Error('İşlem eklenemedi');

      await fetchCashTransactions();
      setNewTransaction({
        date: new Date().toISOString().split('T')[0],
        type: 'RECEIPT',
        description: '',
        amount: 0,
        reference: '',
        cashbox_id: '',
        contact_id: '',
        status: 'POSTED'
      });
      setError('');
    } catch (error) {
      console.error('Add transaction error:', error);
      setError('İşlem eklenirken hata oluştu');
    }
  };

  const filteredTransactions = cashTransactions.filter(transaction => {
    const matchesType = filterType === 'ALL' || transaction.type === filterType;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Kasa & Banka verileri yükleniyor...</p>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kasa & Banka Yönetimi</h1>
                <p className="mt-2 text-gray-600">Nakit ve banka işlemleri</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Yeni Kasa
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-exchange-line mr-2"></i>
                  Yeni İşlem
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('cash')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'cash'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-money-dollar-circle-line mr-2"></i>
                  Kasa
                </button>
                <button
                  onClick={() => setActiveTab('bank')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'bank'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-bank-line mr-2"></i>
                  Banka
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'transactions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-exchange-line mr-2"></i>
                  İşlemler
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'reports'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-file-chart-line mr-2"></i>
                  Raporlar
                </button>
              </nav>
            </div>
          </div>

          {/* Kasa Tab */}
          {activeTab === 'cash' && (
            <div className="space-y-6">
              {/* Kasa Özeti */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Toplam Kasa</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {cashboxes.filter(c => c.type === 'CASH').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <i className="ri-bank-line text-2xl text-blue-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Toplam Banka</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {bankAccounts.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <i className="ri-exchange-line text-2xl text-purple-600"></i>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Bugünkü İşlemler</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {cashTransactions.filter(t => 
                          new Date(t.date).toDateString() === new Date().toDateString()
                        ).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kasa Listesi */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-900">Kasa Hesapları</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kasa Adı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tür
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hesap Kodu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bakiye
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
                      {cashboxes.map((cashbox) => (
                        <tr key={cashbox.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {cashbox.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              cashbox.type === 'CASH' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {cashbox.type === 'CASH' ? 'Kasa' : 'Banka'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {cashbox.account_id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {(cashbox.balance || 0).toLocaleString('tr-TR')} TL
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              cashbox.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {cashbox.is_active ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedCashbox(cashbox)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Detay"
                              >
                                <i className="ri-eye-line"></i>
                              </button>
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Düzenle"
                              >
                                <i className="ri-edit-line"></i>
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
          )}

          {/* Banka Tab */}
          {activeTab === 'bank' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Banka Hesapları</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Banka Adı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hesap Adı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hesap No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IBAN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Para Birimi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bakiye
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bankAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {account.bank_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {account.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {account.account_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-mono">
                            {account.iban}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {account.currency}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {(account.balance || 0).toLocaleString('tr-TR')} {account.currency}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            account.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {account.is_active ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* İşlemler Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* Yeni İşlem Formu */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Yeni İşlem</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tarih *
                    </label>
                    <input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      İşlem Türü *
                    </label>
                    <select
                      value={newTransaction.type}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="RECEIPT">Tahsilat</option>
                      <option value="PAYMENT">Ödeme</option>
                      <option value="EXPENSE">Masraf</option>
                      <option value="INTEREST">Faiz</option>
                      <option value="COMMISSION">Komisyon</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Açıklama *
                    </label>
                    <input
                      type="text"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="İşlem açıklaması"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tutar *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kasa *
                    </label>
                    <select
                      value={newTransaction.cashbox_id}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, cashbox_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Kasa Seçin</option>
                      {cashboxes.map(cashbox => (
                        <option key={cashbox.id} value={cashbox.id}>
                          {cashbox.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referans
                    </label>
                    <input
                      type="text"
                      value={newTransaction.reference}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, reference: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Fiş no, belge no vb."
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end space-x-4">
                  <button
                    onClick={() => setNewTransaction({
                      date: new Date().toISOString().split('T')[0],
                      type: 'RECEIPT',
                      description: '',
                      amount: 0,
                      reference: '',
                      cashbox_id: '',
                      contact_id: '',
                      status: 'POSTED'
                    })}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Temizle
                  </button>
                  <button
                    onClick={handleAddTransaction}
                    disabled={!newTransaction.description || !newTransaction.amount || !newTransaction.cashbox_id}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </div>

              {/* İşlem Listesi */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Kasa İşlemleri</h2>
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        placeholder="Açıklama veya referans ile ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="ALL">Tüm Türler</option>
                        <option value="RECEIPT">Tahsilat</option>
                        <option value="PAYMENT">Ödeme</option>
                        <option value="EXPENSE">Masraf</option>
                        <option value="INTEREST">Faiz</option>
                        <option value="COMMISSION">Komisyon</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tür
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Açıklama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Referans
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kasa
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tutar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(transaction.date).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              transaction.type === 'RECEIPT' ? 'bg-green-100 text-green-800' :
                              transaction.type === 'PAYMENT' ? 'bg-red-100 text-red-800' :
                              transaction.type === 'EXPENSE' ? 'bg-orange-100 text-orange-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {transaction.type === 'RECEIPT' ? 'Tahsilat' :
                               transaction.type === 'PAYMENT' ? 'Ödeme' :
                               transaction.type === 'EXPENSE' ? 'Masraf' :
                               transaction.type === 'INTEREST' ? 'Faiz' : 'Komisyon'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {transaction.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {transaction.reference || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {cashboxes.find(c => c.id === transaction.cashbox_id)?.name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                            <span className={`font-semibold ${
                              transaction.type === 'RECEIPT' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'RECEIPT' ? '+' : '-'}
                              {transaction.amount.toLocaleString('tr-TR')} TL
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              transaction.status === 'POSTED' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {transaction.status === 'POSTED' ? 'Kayıtlı' : 'Beklemede'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Raporlar Tab */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kasa & Banka Raporları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Günlük Kasa Raporu</h3>
                  <p className="text-sm text-gray-600 mb-4">Günlük kasa giriş/çıkış özeti</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                    Raporu Görüntüle
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Aylık Banka Raporu</h3>
                  <p className="text-sm text-gray-600 mb-4">Aylık banka hesap hareketleri</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                    Raporu Görüntüle
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Nakit Akış Raporu</h3>
                  <p className="text-sm text-gray-600 mb-4">Dönemsel nakit akış analizi</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm">
                    Raporu Görüntüle
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Banka CSV İçe Aktarma</h3>
                  <p className="text-sm text-gray-600 mb-4">Banka ekstre dosyası yükle</p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                    Dosya Yükle
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Yeni Kasa Formu */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Yeni Kasa</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kasa Adı *
                    </label>
                    <input
                      type="text"
                      value={newCashbox.name}
                      onChange={(e) => setNewCashbox(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ana Kasa, Şube Kasa vb."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tür *
                    </label>
                    <select
                      value={newCashbox.type}
                      onChange={(e) => setNewCashbox(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="CASH">Kasa</option>
                      <option value="BANK">Banka</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hesap Kodu *
                    </label>
                    <input
                      type="text"
                      value={newCashbox.account_id}
                      onChange={(e) => setNewCashbox(prev => ({ ...prev, account_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100.01.001"
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end space-x-4">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleAddCashbox}
                    disabled={!newCashbox.name.trim() || !newCashbox.account_id.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hata Mesajı */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}
