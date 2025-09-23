'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CalculatorIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CogIcon,
  EyeIcon,
  DocumentChartBarIcon,
  CreditCardIcon,
  ReceiptRefundIcon,
  ChartPieIcon,
  TableCellsIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  cashFlow: number;
  accountsReceivable: number;
  accountsPayable: number;
  inventoryValue: number;
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
}

interface Company {
  id: string;
  name: string;
  taxNumber: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  fiscalYear: string;
  isActive: boolean;
}

interface RecentTransaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  description: string;
  amount: number;
  date: string;
  account: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

export default function AdvancedAccountingDashboard() {
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState<string>('1');
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'transactions' | 'settings'>('overview');

  // Mock data
  useEffect(() => {
    const mockFinancialSummary: FinancialSummary = {
      totalRevenue: 1250000,
      totalExpenses: 850000,
      netProfit: 400000,
      cashFlow: 150000,
      accountsReceivable: 75000,
      accountsPayable: 45000,
      inventoryValue: 200000,
      totalAssets: 800000,
      totalLiabilities: 300000,
      equity: 500000
    };

    const mockCompanies: Company[] = [
      {
        id: '1',
        name: 'TDC Products A.Ş.',
        taxNumber: '1234567890',
        address: 'İstanbul, Türkiye',
        phone: '+90 212 555 0123',
        email: 'info@tdcproducts.com',
        currency: 'TRY',
        fiscalYear: '2024',
        isActive: true
      },
      {
        id: '2',
        name: 'TDC International Ltd.',
        taxNumber: '9876543210',
        address: 'London, UK',
        phone: '+44 20 7946 0958',
        email: 'info@tdcinternational.com',
        currency: 'GBP',
        fiscalYear: '2024',
        isActive: true
      }
    ];

    const mockTransactions: RecentTransaction[] = [
      {
        id: '1',
        type: 'income',
        description: 'Satış - Ürün #12345',
        amount: 15000,
        date: '2024-01-15',
        account: '120.01 - Alıcılar',
        status: 'approved'
      },
      {
        id: '2',
        type: 'expense',
        description: 'Ofis Kiralama',
        amount: 5000,
        date: '2024-01-14',
        account: '770.01 - Kira Giderleri',
        status: 'pending'
      },
      {
        id: '3',
        type: 'transfer',
        description: 'Banka Transferi',
        amount: 25000,
        date: '2024-01-13',
        account: '102.01 - Banka Hesabı',
        status: 'approved'
      }
    ];

    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Vergi Ödeme Tarihi Yaklaşıyor',
        message: 'KDV beyannamesi için son tarih 3 gün kaldı',
        priority: 'high',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        type: 'info',
        title: 'Yeni Fatura Onayı Bekliyor',
        message: '5 adet fatura onayınızı bekliyor',
        priority: 'medium',
        createdAt: '2024-01-15'
      },
      {
        id: '3',
        type: 'success',
        title: 'Aylık Rapor Hazır',
        message: 'Ocak 2024 mali raporu hazırlandı',
        priority: 'low',
        createdAt: '2024-01-14'
      }
    ];

    setFinancialSummary(mockFinancialSummary);
    setCompanies(mockCompanies);
    setRecentTransactions(mockTransactions);
    setAlerts(mockAlerts);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error': return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      case 'info': return <EyeIcon className="w-5 h-5 text-blue-500" />;
      case 'success': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default: return <EyeIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
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
                <h1 className="text-3xl font-bold text-gray-900">Gelişmiş Muhasebe Dashboard</h1>
                <p className="mt-2 text-gray-600">Kapsamlı mali yönetim ve analiz</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <CogIcon className="w-5 h-5 inline mr-2" />
                  Ayarlar
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
                { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
                { id: 'reports', name: 'Raporlar', icon: DocumentChartBarIcon },
                { id: 'transactions', name: 'İşlemler', icon: DocumentTextIcon },
                { id: 'settings', name: 'Ayarlar', icon: CogIcon }
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

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Financial Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(financialSummary?.totalRevenue || 0)}
                      </p>
                    </div>
                    <ArrowTrendingUpIcon className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="mt-2 text-sm text-green-600">
                    +12.5% bu ay
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(financialSummary?.totalExpenses || 0)}
                      </p>
                    </div>
                    <ArrowTrendingDownIcon className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="mt-2 text-sm text-red-600">
                    +8.2% bu ay
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Net Kar</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(financialSummary?.netProfit || 0)}
                      </p>
                    </div>
                    <BanknotesIcon className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="mt-2 text-sm text-blue-600">
                    +15.3% bu ay
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Nakit Akış</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(financialSummary?.cashFlow || 0)}
                      </p>
                    </div>
                    <CurrencyDollarIcon className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="mt-2 text-sm text-purple-600">
                    +5.7% bu ay
                  </div>
                </div>
              </div>

              {/* Additional Financial Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Varlıklar</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam Varlıklar</span>
                      <span className="font-semibold">{formatCurrency(financialSummary?.totalAssets || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Alacaklar</span>
                      <span className="font-semibold">{formatCurrency(financialSummary?.accountsReceivable || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Stok Değeri</span>
                      <span className="font-semibold">{formatCurrency(financialSummary?.inventoryValue || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Borçlar</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam Borçlar</span>
                      <span className="font-semibold">{formatCurrency(financialSummary?.totalLiabilities || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Borçlar</span>
                      <span className="font-semibold">{formatCurrency(financialSummary?.accountsPayable || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Özkaynak</span>
                      <span className="font-semibold text-green-600">{formatCurrency(financialSummary?.equity || 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
                  <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
                      <DocumentTextIcon className="w-4 h-4 mr-2" />
                      Yeni Fatura
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
                      <ReceiptRefundIcon className="w-4 h-4 mr-2" />
                      Gider Kaydı
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
                      <CreditCardIcon className="w-4 h-4 mr-2" />
                      Ödeme Kaydı
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center">
                      <DocumentChartBarIcon className="w-4 h-4 mr-2" />
                      Rapor Oluştur
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Transactions and Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Son İşlemler</h3>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-xs text-gray-500">{transaction.account}</p>
                          <p className="text-xs text-gray-400">{transaction.date}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${
                            transaction.type === 'income' ? 'text-green-600' : 
                            transaction.type === 'expense' ? 'text-red-600' : 'text-blue-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status === 'approved' ? 'Onaylandı' : 
                             transaction.status === 'pending' ? 'Bekliyor' : 'Reddedildi'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Uyarılar ve Bildirimler</h3>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                          <p className="text-xs text-gray-600">{alert.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{alert.createdAt}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          alert.priority === 'high' ? 'bg-red-100 text-red-800' :
                          alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {alert.priority === 'high' ? 'Yüksek' : 
                           alert.priority === 'medium' ? 'Orta' : 'Düşük'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mali Raporlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Gelir Tablosu', icon: ChartBarIcon, description: 'Gelir ve gider analizi' },
                    { name: 'Bilanço', icon: TableCellsIcon, description: 'Varlık ve borç durumu' },
                    { name: 'Nakit Akış Tablosu', icon: CurrencyDollarIcon, description: 'Nakit hareketleri' },
                    { name: 'Kar-Zarar Analizi', icon: ChartPieIcon, description: 'Detaylı kar-zarar' },
                    { name: 'Vergi Raporları', icon: DocumentTextIcon, description: 'Vergi beyannameleri' },
                    { name: 'Bordro Raporları', icon: UserGroupIcon, description: 'Personel bordroları' }
                  ].map((report, index) => (
                    <button
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                    >
                      <report.icon className="w-8 h-8 text-blue-600 mb-2" />
                      <h4 className="font-medium text-gray-900">{report.name}</h4>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">İşlem Yönetimi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Fatura Oluştur', icon: DocumentTextIcon, color: 'bg-blue-500' },
                    { name: 'Gider Kaydı', icon: ReceiptRefundIcon, color: 'bg-red-500' },
                    { name: 'Ödeme Kaydı', icon: CreditCardIcon, color: 'bg-green-500' },
                    { name: 'Transfer', icon: ArrowTrendingUpIcon, color: 'bg-purple-500' }
                  ].map((action, index) => (
                    <button
                      key={index}
                      className={`p-4 ${action.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
                    >
                      <action.icon className="w-8 h-8 mb-2" />
                      <h4 className="font-medium">{action.name}</h4>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Muhasebe Ayarları</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Genel Ayarlar</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mali Yıl</label>
                        <input type="text" defaultValue="2024" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Para Birimi</label>
                        <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                          <option>TRY - Türk Lirası</option>
                          <option>USD - Amerikan Doları</option>
                          <option>EUR - Euro</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Entegrasyonlar</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">E-Fatura Entegrasyonu</span>
                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Aktif</button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Banka Entegrasyonu</span>
                        <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Aktif</button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Bordro Entegrasyonu</span>
                        <button className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Pasif</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}

