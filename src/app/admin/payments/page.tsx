'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  CurrencyDollarIcon,
  DevicePhoneMobileIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import AdminProtection from '../../../components/AdminProtection';

interface Payment {
  id: string;
  transaction_id: string;
  payment_method: string;
  amount: number;
  total_amount: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  status: string;
  fees: number;
  processing_time: number;
  created_at: string;
  installment_data?: any;
  provider_response?: any;
}

interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  successRate: number;
  averageProcessingTime: number;
  methodBreakdown: Record<string, number>;
  dailyStats: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [filter, setFilter] = useState({
    status: 'all',
    method: 'all',
    dateRange: '7d'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      
      // Demo veriler - gerçek API'den veri gelene kadar
      const demoPayments: Payment[] = [
        {
          id: '1',
          transaction_id: 'TXN-001-2024',
          payment_method: 'credit_card',
          amount: 1250.00,
          total_amount: 1250.00,
          currency: 'TRY',
          customer_name: 'Ahmet Yılmaz',
          customer_email: 'ahmet@example.com',
          status: 'completed',
          fees: 37.50,
          processing_time: 2.3,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          provider_response: { status: 'approved', code: '00' }
        },
        {
          id: '2',
          transaction_id: 'TXN-002-2024',
          payment_method: 'bank_transfer',
          amount: 2500.00,
          total_amount: 2500.00,
          currency: 'TRY',
          customer_name: 'Fatma Demir',
          customer_email: 'fatma@example.com',
          status: 'pending',
          fees: 0,
          processing_time: 0,
          created_at: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: '3',
          transaction_id: 'TXN-003-2024',
          payment_method: 'mobile_payment',
          amount: 750.00,
          total_amount: 750.00,
          currency: 'TRY',
          customer_name: 'Mehmet Kaya',
          customer_email: 'mehmet@example.com',
          status: 'failed',
          fees: 22.50,
          processing_time: 1.8,
          created_at: new Date(Date.now() - 259200000).toISOString(),
          provider_response: { status: 'declined', code: '05' }
        },
        {
          id: '4',
          transaction_id: 'TXN-004-2024',
          payment_method: 'credit_card',
          amount: 3200.00,
          total_amount: 3200.00,
          currency: 'TRY',
          customer_name: 'Ayşe Özkan',
          customer_email: 'ayse@example.com',
          status: 'completed',
          fees: 96.00,
          processing_time: 1.5,
          created_at: new Date(Date.now() - 345600000).toISOString(),
          provider_response: { status: 'approved', code: '00' }
        }
      ];

      setPayments(demoPayments);

      // Gerçek API'yi de dene
      try {
        const response = await fetch(`/api/payments/advanced/process?${new URLSearchParams({
          ...filter,
          search: searchTerm
        })}`);
        const data = await response.json();
        if (data.payments && data.payments.length > 0) {
          setPayments(data.payments);
        }
      } catch (apiError) {
        console.log('API not available, using demo data');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, searchTerm]);

  const fetchStats = useCallback(async () => {
    try {
      // Demo stats - gerçek API'den veri gelene kadar
      const demoStats: PaymentStats = {
        totalPayments: 1247,
        totalAmount: 1250000,
        successRate: 94.5,
        averageProcessingTime: 2.1,
        methodBreakdown: {
          'credit_card': 65,
          'bank_transfer': 20,
          'mobile_payment': 12,
          'crypto': 3
        },
        dailyStats: [
          { date: '2024-01-01', count: 45, amount: 45000 },
          { date: '2024-01-02', count: 52, amount: 52000 },
          { date: '2024-01-03', count: 38, amount: 38000 },
          { date: '2024-01-04', count: 61, amount: 61000 },
          { date: '2024-01-05', count: 47, amount: 47000 },
          { date: '2024-01-06', count: 43, amount: 43000 },
          { date: '2024-01-07', count: 55, amount: 55000 }
        ]
      };

      setStats(demoStats);

      // Gerçek API'yi de dene
      try {
        const response = await fetch('/api/admin/payments/stats');
        const data = await response.json();
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (apiError) {
        console.log('Stats API not available, using demo data');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    // Admin authentication check
    const checkAdminAuth = () => {
      try {
        const storedAdmin = localStorage.getItem('admin_user');
        if (!storedAdmin) {
          router.push('/admin/login');
          return false;
        }
        return true;
      } catch (error) {
        console.error('Admin auth check error:', error);
        router.push('/admin/login');
        return false;
      }
    };

    if (checkAdminAuth()) {
      fetchPayments();
      fetchStats();
    }
  }, [router, filter, fetchPayments, fetchStats]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <CreditCardIcon className="w-5 h-5" />;
      case 'bank_transfer': return <BanknotesIcon className="w-5 h-5" />;
      case 'crypto': return <CurrencyDollarIcon className="w-5 h-5" />;
      case 'mobile_payment': return <DevicePhoneMobileIcon className="w-5 h-5" />;
      default: return <CreditCardIcon className="w-5 h-5" />;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Kredi Kartı';
      case 'bank_transfer': return 'Banka Havalesi';
      case 'crypto': return 'Kripto Para';
      case 'mobile_payment': return 'Mobil Ödeme';
      default: return method;
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter.status !== 'all' && payment.status !== filter.status) return false;
    if (filter.method !== 'all' && payment.payment_method !== filter.method) return false;
    if (searchTerm && !payment.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !payment.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gelişmiş Ödeme Yönetimi</h1>
          <p className="text-gray-600 mt-2">Tüm ödemeleri yönetin, analiz edin ve izleyin</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Ödeme</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPayments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BanknotesIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Toplam Tutar</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Başarı Oranı</p>
                  <p className="text-2xl font-bold text-gray-900">%{stats.successRate.toFixed(1)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ClockIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ort. İşlem Süresi</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageProcessingTime}ms</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tümü</option>
                <option value="completed">Tamamlandı</option>
                <option value="pending">Beklemede</option>
                <option value="processing">İşleniyor</option>
                <option value="failed">Başarısız</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Yöntemi</label>
              <select
                value={filter.method}
                onChange={(e) => setFilter({ ...filter, method: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tümü</option>
                <option value="credit_card">Kredi Kartı</option>
                <option value="bank_transfer">Banka Havalesi</option>
                <option value="crypto">Kripto Para</option>
                <option value="mobile_payment">Mobil Ödeme</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tarih Aralığı</label>
              <select
                value={filter.dateRange}
                onChange={(e) => setFilter({ ...filter, dateRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1d">Son 1 Gün</option>
                <option value="7d">Son 7 Gün</option>
                <option value="30d">Son 30 Gün</option>
                <option value="90d">Son 90 Gün</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <input
                type="text"
                placeholder="Müşteri adı, email veya işlem ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Ödeme Listesi</h3>
            <p className="text-sm text-gray-600">{filteredPayments.length} ödeme bulundu</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ödeme Yöntemi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tutar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.transaction_id}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {payment.id.slice(0, 8)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.customer_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.customer_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-gray-600 mr-2">
                          {getMethodIcon(payment.payment_method)}
                        </div>
                        <div className="text-sm text-gray-900">
                          {getMethodName(payment.payment_method)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.total_amount)}
                        </div>
                        {payment.installment_data && (
                          <div className="text-sm text-gray-500">
                            {payment.installment_data.installments} taksit
                          </div>
                        )}
                        {payment.fees > 0 && (
                          <div className="text-sm text-orange-600">
                            +{formatCurrency(payment.fees)} komisyon
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedPayment(payment)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => fetchPayments()}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Detail Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Ödeme Detayları</h3>
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Kapat</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">İşlem ID</label>
                      <p className="text-sm text-gray-900">{selectedPayment.transaction_id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Durum</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPayment.status)}`}>
                        {selectedPayment.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Müşteri</label>
                      <p className="text-sm text-gray-900">{selectedPayment.customer_name}</p>
                      <p className="text-sm text-gray-500">{selectedPayment.customer_email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ödeme Yöntemi</label>
                      <div className="flex items-center">
                        <div className="text-gray-600 mr-2">
                          {getMethodIcon(selectedPayment.payment_method)}
                        </div>
                        <p className="text-sm text-gray-900">{getMethodName(selectedPayment.payment_method)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tutar</label>
                      <p className="text-sm text-gray-900">{formatCurrency(selectedPayment.total_amount)}</p>
                      {selectedPayment.fees > 0 && (
                        <p className="text-sm text-orange-600">Komisyon: {formatCurrency(selectedPayment.fees)}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">İşlem Süresi</label>
                      <p className="text-sm text-gray-900">{selectedPayment.processing_time}ms</p>
                    </div>
                  </div>

                  {selectedPayment.installment_data && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Taksit Bilgileri</label>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-900">
                          {selectedPayment.installment_data.installments} taksit
                        </p>
                        <p className="text-sm text-gray-600">
                          Aylık: {formatCurrency(selectedPayment.installment_data.monthlyPayment)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Faiz Oranı: %{selectedPayment.installment_data.interestRate}
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tarih</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedPayment.created_at)}</p>
                  </div>

                  {selectedPayment.provider_response && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sağlayıcı Yanıtı</label>
                      <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md overflow-auto">
                        {JSON.stringify(selectedPayment.provider_response, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedPayment(null)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Kapat
                  </button>
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
