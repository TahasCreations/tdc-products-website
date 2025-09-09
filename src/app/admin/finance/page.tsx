'use client';

import { useState, useEffect } from 'react';
import AdminProtection from '../../../components/AdminProtection';
import OptimizedLoader from '../../../components/OptimizedLoader';
import Link from 'next/link';

interface FinanceData {
  totalRevenue: number;
  totalExpenses: number;
  totalOrders: number;
  netProfit: number;
  profitMargin: number;
  expensesByCategory: Record<string, number>;
  period: {
    month: string;
    year: string;
    startDate: string;
    endDate: string;
  };
}

interface Expense {
  id: string;
  expense_number: string;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
  expense_date: string;
  payment_method: string;
  supplier_name: string;
  status: string;
  created_at: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  total_amount: number;
  invoice_date: string;
  status: string;
  order?: {
    order_number: string;
    customer_name: string;
    total_amount: number;
  };
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  payment_status: string;
  created_at: string;
}

export default function AdminFinancePage() {
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'invoices' | 'orders'>('dashboard');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [newExpense, setNewExpense] = useState({
    category: '',
    subcategory: '',
    description: '',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    payment_method: 'banka',
    payment_reference: '',
    supplier_name: '',
    supplier_tax_number: '',
    is_recurring: false,
    recurring_frequency: 'monthly'
  });

  const [newInvoice, setNewInvoice] = useState({
    customer_name: '',
    customer_email: '',
    customer_address: '',
    customer_tax_number: '',
    subtotal: '',
    tax_rate: '20',
    tax_amount: '',
    total_amount: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    notes: ''
  });

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      
      // Dashboard verilerini getir
      const dashboardResponse = await fetch('/api/finance?type=dashboard');
      const dashboardData = await dashboardResponse.json();
      
      if (dashboardData.success) {
        setFinanceData(dashboardData.data);
      }

      // Giderleri getir
      const expensesResponse = await fetch('/api/finance?type=expenses');
      const expensesData = await expensesResponse.json();
      
      if (expensesData.success) {
        setExpenses(expensesData.expenses);
      }

      // Faturaları getir
      const invoicesResponse = await fetch('/api/finance?type=invoices');
      const invoicesData = await invoicesResponse.json();
      
      if (invoicesData.success) {
        setInvoices(invoicesData.invoices);
      }

      // Siparişleri getir
      const ordersResponse = await fetch('/api/finance?type=orders');
      const ordersData = await ordersResponse.json();
      
      if (ordersData.success) {
        setOrders(ordersData.orders);
      }

    } catch (error) {
      console.error('Fetch finance data error:', error);
      setMessage('Veriler yüklenemedi');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'add_expense',
          ...newExpense,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Gider başarıyla eklendi');
        setMessageType('success');
        setNewExpense({
          category: '',
          subcategory: '',
          description: '',
          amount: '',
          expense_date: new Date().toISOString().split('T')[0],
          payment_method: 'banka',
          payment_reference: '',
          supplier_name: '',
          supplier_tax_number: '',
          is_recurring: false,
          recurring_frequency: 'monthly'
        });
        setShowAddExpense(false);
        fetchFinanceData();
      } else {
        setMessage(data.error || 'Gider eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add expense error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_invoice',
          order_id: selectedOrder?.id,
          ...newInvoice,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Fatura başarıyla oluşturuldu');
        setMessageType('success');
        setNewInvoice({
          customer_name: '',
          customer_email: '',
          customer_address: '',
          customer_tax_number: '',
          subtotal: '',
          tax_rate: '20',
          tax_amount: '',
          total_amount: '',
          invoice_date: new Date().toISOString().split('T')[0],
          due_date: '',
          notes: ''
        });
        setShowCreateInvoice(false);
        setSelectedOrder(null);
        fetchFinanceData();
      } else {
        setMessage(data.error || 'Fatura oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Create invoice error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
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

  const getCategoryName = (category: string) => {
    const categoryNames: Record<string, string> = {
      'vergi': 'Vergiler',
      'maas': 'Maaşlar',
      'sgk': 'SGK Primleri',
      'kira': 'Kira',
      'elektrik': 'Elektrik',
      'su': 'Su',
      'internet': 'İnternet',
      'diger': 'Diğer'
    };
    return categoryNames[category] || category;
  };

  if (loading) {
    return <OptimizedLoader message="Finansal veriler yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Finans Yönetimi</h1>
                <p className="text-gray-600 mt-2">Gelir, gider ve kar analizi - Gelişmiş finansal raporlama</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddExpense(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Gider Ekle
                </button>
                <button
                  onClick={() => setShowCreateInvoice(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <i className="ri-file-text-line mr-2"></i>
                  Fatura Kes
                </button>
                <Link
                  href="/admin"
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <i className="ri-arrow-left-line mr-2"></i>
                  Admin Paneli
                </Link>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
              <button
                onClick={() => setMessage('')}
                className="float-right text-lg font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'dashboard'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-dashboard-line mr-2"></i>
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('expenses')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'expenses'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-money-dollar-box-line mr-2"></i>
                  Giderler ({expenses.length})
                </button>
                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'invoices'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-file-text-line mr-2"></i>
                  Faturalar ({invoices.length})
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-shopping-cart-line mr-2"></i>
                  Siparişler ({orders.length})
                </button>
              </nav>
            </div>

          <div className="p-6">
            {activeTab === 'dashboard' && financeData && (
              <div className="space-y-6">
                {/* Finansal Özet */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <i className="ri-money-dollar-circle-line text-2xl text-green-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(financeData.totalRevenue)}
                        </p>
                        <p className="text-xs text-green-600">Bu ay</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <i className="ri-money-dollar-box-line text-2xl text-red-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(financeData.totalExpenses)}
                        </p>
                        <p className="text-xs text-red-600">Bu ay</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <i className="ri-shopping-cart-line text-2xl text-blue-600"></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Faturasız Satış</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {formatCurrency(financeData.totalOrders)}
                        </p>
                        <p className="text-xs text-blue-600">Bu ay</p>
                      </div>
                    </div>
                  </div>

                  <div className={`bg-white rounded-2xl shadow-lg p-6 ${financeData.netProfit >= 0 ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${financeData.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                        <i className={`text-2xl ${financeData.netProfit >= 0 ? 'ri-trending-up-line text-green-600' : 'ri-trending-down-line text-red-600'}`}></i>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Net Kar</p>
                        <p className={`text-2xl font-semibold ${financeData.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(financeData.netProfit)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Kar Marjı: %{financeData.profitMargin}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gider Kategorileri */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Gider Kategorileri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(financeData.expensesByCategory).map(([category, amount]) => (
                      <div key={category} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{getCategoryName(category)}</p>
                            <p className="text-xl font-semibold text-gray-900">{formatCurrency(amount)}</p>
                          </div>
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <i className="ri-folder-line text-gray-600"></i>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hızlı İşlemler */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Hızlı İşlemler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setShowAddExpense(true)}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <i className="ri-add-line text-green-600"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Gider Ekle</p>
                          <p className="text-sm text-gray-600">Yeni gider kaydı oluştur</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setShowCreateInvoice(true)}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <i className="ri-file-text-line text-blue-600"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Fatura Kes</p>
                          <p className="text-sm text-gray-600">Yeni fatura oluştur</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setActiveTab('expenses')}
                      className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left"
                    >
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                          <i className="ri-bar-chart-line text-purple-600"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Raporlar</p>
                          <p className="text-sm text-gray-600">Detaylı finansal raporlar</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'expenses' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Giderler</h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        Toplam: <span className="font-semibold text-red-600">{formatCurrency(financeData?.totalExpenses || 0)}</span>
                      </div>
                      <button
                        onClick={() => setShowAddExpense(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <i className="ri-add-line mr-2"></i>
                        Yeni Gider
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gider No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Açıklama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tutar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tedarikçi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {expenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              <div className="p-1 bg-red-100 rounded mr-3">
                                <i className="ri-subtract-line text-red-600 text-sm"></i>
                              </div>
                              {expense.expense_number}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {getCategoryName(expense.category)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {expense.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                            -{formatCurrency(expense.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(expense.expense_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {expense.supplier_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => console.log('Delete expense:', expense.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Gideri sil"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Faturalar</h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        Toplam: <span className="font-semibold text-green-600">{formatCurrency(financeData?.totalRevenue || 0)}</span>
                      </div>
                      <button
                        onClick={() => setShowCreateInvoice(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <i className="ri-file-text-line mr-2"></i>
                        Yeni Fatura
                      </button>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fatura No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Müşteri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tutar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
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
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              <div className="p-1 bg-green-100 rounded mr-3">
                                <i className="ri-file-text-line text-green-600 text-sm"></i>
                              </div>
                              {invoice.invoice_number}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {invoice.customer_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            +{formatCurrency(invoice.total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(invoice.invoice_date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              invoice.status === 'paid' 
                                ? 'bg-green-100 text-green-800'
                                : invoice.status === 'sent'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {invoice.status === 'paid' ? 'Ödendi' : 
                               invoice.status === 'sent' ? 'Gönderildi' : 'Taslak'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => console.log('Delete invoice:', invoice.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Faturayı sil"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Siparişler</h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        Toplam: <span className="font-semibold text-blue-600">{formatCurrency(financeData.totalOrders)}</span>
                      </div>
                      <Link
                        href="/admin/orders"
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <i className="ri-shopping-cart-line mr-2"></i>
                        Sipariş Yönetimi
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sipariş No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Müşteri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tutar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ödeme
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              <div className="p-1 bg-orange-100 rounded mr-3">
                                <i className="ri-shopping-cart-line text-orange-600 text-sm"></i>
                              </div>
                              {order.order_number}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.customer_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.payment_status === 'paid' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {order.payment_status === 'paid' ? 'Ödendi' : 'Ödenmedi'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {order.payment_status === 'paid' && (
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setNewInvoice({
                                    customer_name: order.customer_name,
                                    customer_email: '',
                                    customer_address: '',
                                    customer_tax_number: '',
                                    subtotal: (order.total_amount / 1.2).toFixed(2),
                                    tax_rate: '20',
                                    tax_amount: (order.total_amount * 0.2 / 1.2).toFixed(2),
                                    total_amount: order.total_amount.toFixed(2),
                                    invoice_date: new Date().toISOString().split('T')[0],
                                    due_date: '',
                                    notes: `Sipariş: ${order.order_number}`
                                  });
                                  setShowCreateInvoice(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                title="Fatura kes"
                              >
                                <i className="ri-file-text-line"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddExpense && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yeni Gider Ekle</h2>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    >
                      <option value="">Kategori seçin</option>
                      <option value="vergi">Vergiler</option>
                      <option value="maas">Maaşlar</option>
                      <option value="sgk">SGK Primleri</option>
                      <option value="kira">Kira</option>
                      <option value="elektrik">Elektrik</option>
                      <option value="su">Su</option>
                      <option value="internet">İnternet</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Kategori</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newExpense.subcategory}
                      onChange={(e) => setNewExpense({ ...newExpense, subcategory: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tutar</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newExpense.expense_date}
                      onChange={(e) => setNewExpense({ ...newExpense, expense_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ödeme Yöntemi</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newExpense.payment_method}
                      onChange={(e) => setNewExpense({ ...newExpense, payment_method: e.target.value })}
                    >
                      <option value="banka">Banka</option>
                      <option value="nakit">Nakit</option>
                      <option value="kredi_karti">Kredi Kartı</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tedarikçi</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newExpense.supplier_name}
                      onChange={(e) => setNewExpense({ ...newExpense, supplier_name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Gider Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Invoice Modal */}
        {showCreateInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Fatura Oluştur</h2>
              <form onSubmit={handleCreateInvoice} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri Adı</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newInvoice.customer_name}
                      onChange={(e) => setNewInvoice({ ...newInvoice, customer_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newInvoice.customer_email}
                      onChange={(e) => setNewInvoice({ ...newInvoice, customer_email: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newInvoice.customer_address}
                      onChange={(e) => setNewInvoice({ ...newInvoice, customer_address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Numarası</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newInvoice.customer_tax_number}
                      onChange={(e) => setNewInvoice({ ...newInvoice, customer_tax_number: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Hariç Tutar</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newInvoice.subtotal}
                      onChange={(e) => {
                        const subtotal = parseFloat(e.target.value) || 0;
                        const taxRate = parseFloat(newInvoice.tax_rate) / 100;
                        const taxAmount = subtotal * taxRate;
                        const total = subtotal + taxAmount;
                        setNewInvoice({
                          ...newInvoice,
                          subtotal: e.target.value,
                          tax_amount: taxAmount.toFixed(2),
                          total_amount: total.toFixed(2)
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">KDV Oranı (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newInvoice.tax_rate}
                      onChange={(e) => {
                        const taxRate = parseFloat(e.target.value) || 0;
                        const subtotal = parseFloat(newInvoice.subtotal) || 0;
                        const taxAmount = subtotal * (taxRate / 100);
                        const total = subtotal + taxAmount;
                        setNewInvoice({
                          ...newInvoice,
                          tax_rate: e.target.value,
                          tax_amount: taxAmount.toFixed(2),
                          total_amount: total.toFixed(2)
                        });
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">KDV Tutarı</label>
                    <input
                      type="number"
                      step="0.01"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      value={newInvoice.tax_amount}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Tutar</label>
                    <input
                      type="number"
                      step="0.01"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      value={newInvoice.total_amount}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fatura Tarihi</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newInvoice.invoice_date}
                      onChange={(e) => setNewInvoice({ ...newInvoice, invoice_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vade Tarihi</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newInvoice.due_date}
                      onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newInvoice.notes}
                      onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Fatura Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateInvoice(false);
                      setSelectedOrder(null);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </AdminProtection>
  );
}
