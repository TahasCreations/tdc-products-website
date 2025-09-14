'use client';

import { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  CreditCardIcon,
  ChartBarIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import AdminProtection from '../../../components/AdminProtection';

interface FinanceData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingPayments: number;
  monthlyRevenue: Array<{
    month: string;
    amount: number;
  }>;
  expenseCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  recentTransactions: Array<{
  id: string;
    type: 'income' | 'expense';
  description: string;
  amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
}

export default function FinancePage() {
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    // Simüle edilmiş finans verisi
    const mockData: FinanceData = {
      totalRevenue: 125680,
      totalExpenses: 45680,
      netProfit: 80000,
      pendingPayments: 12340,
      monthlyRevenue: [
        { month: 'Ocak', amount: 45000 },
        { month: 'Şubat', amount: 52000 },
        { month: 'Mart', amount: 48000 },
        { month: 'Nisan', amount: 61000 },
        { month: 'Mayıs', amount: 55000 },
        { month: 'Haziran', amount: 68000 }
      ],
      expenseCategories: [
        { category: 'Ürün Maliyeti', amount: 25000, percentage: 55 },
        { category: 'Pazarlama', amount: 8000, percentage: 17 },
        { category: 'Operasyon', amount: 6000, percentage: 13 },
        { category: 'Teknoloji', amount: 4000, percentage: 9 },
        { category: 'Diğer', amount: 2680, percentage: 6 }
      ],
      recentTransactions: [
        { id: '1', type: 'income', description: 'Online Satış - Premium Laptop', amount: 15000, date: '2024-01-15', status: 'completed' },
        { id: '2', type: 'expense', description: 'Google Ads Kampanyası', amount: 2500, date: '2024-01-14', status: 'completed' },
        { id: '3', type: 'income', description: 'Toplu Sipariş - Kurumsal Müşteri', amount: 25000, date: '2024-01-13', status: 'pending' },
        { id: '4', type: 'expense', description: 'Sunucu Hosting Ücreti', amount: 800, date: '2024-01-12', status: 'completed' },
        { id: '5', type: 'income', description: 'Online Satış - Wireless Headphones', amount: 3200, date: '2024-01-11', status: 'completed' },
        { id: '6', type: 'expense', description: 'Kargo Ücreti', amount: 1200, date: '2024-01-10', status: 'completed' }
      ]
    };

    setTimeout(() => {
      setFinanceData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
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
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finans Yönetimi</h1>
          <p className="text-gray-600">Gelir, gider ve kârlılık analizlerinizi takip edin</p>
            </div>

        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['7d', '30d', '90d', '1y'].map((period) => (
                <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {period === '7d' ? 'Son 7 Gün' : 
                 period === '30d' ? 'Son 30 Gün' :
                 period === '90d' ? 'Son 90 Gün' : 'Son 1 Yıl'}
                </button>
            ))}
          </div>
            </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">₺{financeData?.totalRevenue.toLocaleString()}</p>
                      </div>
                    </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">+18.2%</span>
            </div>
                  </div>

          <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <BanknotesIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                <p className="text-2xl font-bold text-gray-900">₺{financeData?.totalExpenses.toLocaleString()}</p>
                      </div>
                    </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-600 ml-1">+5.1%</span>
            </div>
                  </div>

          <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Net Kâr</p>
                <p className="text-2xl font-bold text-gray-900">₺{financeData?.netProfit.toLocaleString()}</p>
                      </div>
                    </div>
            <div className="mt-4 flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">+25.3%</span>
            </div>
                  </div>

          <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CreditCardIcon className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bekleyen Ödemeler</p>
                <p className="text-2xl font-bold text-gray-900">₺{financeData?.pendingPayments.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-yellow-600">3 ödeme</span>
                      </div>
                    </div>
                  </div>

        {/* Monthly Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aylık Gelir Trendi</h3>
            <div className="space-y-4">
              {financeData?.monthlyRevenue.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                      {index + 1}
                </div>
                    <span className="ml-3 font-medium text-gray-900">{month.month}</span>
                          </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(month.amount / 70000) * 100}%` }}
                      ></div>
                          </div>
                    <span className="font-medium text-gray-900">₺{month.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gider Kategorileri</h3>
            <div className="space-y-4">
              {financeData?.expenseCategories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                      <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-blue-500' :
                      index === 2 ? 'bg-green-500' :
                      index === 3 ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="font-medium text-gray-900">{category.category}</span>
                        </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">₺{category.amount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{category.percentage}%</div>
                        </div>
                      </div>
              ))}
                  </div>
                </div>
              </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Son İşlemler</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <DocumentTextIcon className="h-4 w-4 inline mr-2" />
              Rapor İndir
                      </button>
                    </div>
          
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlem
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
                    Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                {financeData?.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'income' 
                                ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'income' ? 'Gelir' : 'Gider'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description}
                          </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₺{transaction.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'completed' ? 'Tamamlandı' :
                         transaction.status === 'pending' ? 'Beklemede' : 'Başarısız'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
        </div>
      </div>
    </AdminProtection>
  );
}