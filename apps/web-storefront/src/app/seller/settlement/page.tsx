'use client';

import React, { useState, useEffect } from 'react';

interface SellerBalance {
  id: string;
  grossAmount: number;
  commissionAmount: number;
  taxAmount: number;
  netAmount: number;
  status: string;
  createdAt: string;
  order?: {
    id: string;
    orderNumber: string;
  };
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
  description?: string;
}

interface BalanceSummary {
  totalBalances: number;
  totalGrossAmount: number;
  totalCommissionAmount: number;
  totalTaxAmount: number;
  totalNetAmount: number;
  pendingAmount: number;
  settledAmount: number;
  paidAmount: number;
}

export default function SellerSettlementPage() {
  const [balances, setBalances] = useState<SellerBalance[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [summary, setSummary] = useState<BalanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'balances' | 'payouts' | 'summary'>('balances');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Mock data for development
  useEffect(() => {
    const mockBalances: SellerBalance[] = [
      {
        id: '1',
        grossAmount: 5000,
        commissionAmount: 350,
        taxAmount: 63,
        netAmount: 4587,
        status: 'PAID',
        createdAt: '2024-01-15T10:00:00Z',
        order: {
          id: 'order-1',
          orderNumber: 'ORD-2024-001'
        }
      },
      {
        id: '2',
        grossAmount: 3000,
        commissionAmount: 300,
        taxAmount: 54,
        netAmount: 2646,
        status: 'SETTLED',
        createdAt: '2024-01-20T14:30:00Z',
        order: {
          id: 'order-2',
          orderNumber: 'ORD-2024-002'
        }
      },
      {
        id: '3',
        grossAmount: 2500,
        commissionAmount: 250,
        taxAmount: 45,
        netAmount: 2205,
        status: 'PENDING',
        createdAt: '2024-01-25T09:15:00Z',
        order: {
          id: 'order-3',
          orderNumber: 'ORD-2024-003'
        }
      }
    ];

    const mockPayouts: Payout[] = [
      {
        id: '1',
        amount: 4587,
        status: 'COMPLETED',
        paymentMethod: 'BANK_TRANSFER',
        createdAt: '2024-01-16T10:00:00Z',
        completedAt: '2024-01-16T14:30:00Z',
        description: 'Samsung Store - 4587₺ (1 sipariş, 15.01.2024 - 15.01.2024)'
      },
      {
        id: '2',
        amount: 2646,
        status: 'PROCESSING',
        paymentMethod: 'BANK_TRANSFER',
        createdAt: '2024-01-21T10:00:00Z',
        description: 'Nike Outlet - 2646₺ (1 sipariş, 20.01.2024 - 20.01.2024)'
      }
    ];

    const mockSummary: BalanceSummary = {
      totalBalances: 3,
      totalGrossAmount: 10500,
      totalCommissionAmount: 900,
      totalTaxAmount: 162,
      totalNetAmount: 9438,
      pendingAmount: 2205,
      settledAmount: 2646,
      paidAmount: 4587
    };

    setBalances(mockBalances);
    setPayouts(mockPayouts);
    setSummary(mockSummary);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SETTLED': return 'bg-green-100 text-green-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Tamamlandı';
      case 'PROCESSING': return 'İşleniyor';
      case 'FAILED': return 'Başarısız';
      case 'PENDING': return 'Bekliyor';
      case 'SETTLED': return 'Hesaplandı';
      case 'PAID': return 'Ödendi';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'BANK_TRANSFER': return 'Banka Havalesi';
      case 'PAYPAL': return 'PayPal';
      case 'STRIPE': return 'Stripe';
      case 'WISE': return 'Wise';
      case 'CASH': return 'Nakit';
      default: return method;
    }
  };

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

  const filteredBalances = balances.filter(balance => 
    !statusFilter || balance.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settlement & Ödemeler</h1>
        <p className="text-gray-600">Komisyon hesaplamalarınızı ve ödeme durumlarınızı görüntüleyin</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.totalNetAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ödenen</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.paidAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.pendingAmount)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.totalBalances}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('balances')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'balances'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Balance Geçmişi
            </button>
            <button
              onClick={() => setActiveTab('payouts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payouts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ödemeler
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Detaylı Özet
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Balances Tab */}
          {activeTab === 'balances' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Balance Geçmişi</h3>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tüm Durumlar</option>
                  <option value="PENDING">Bekliyor</option>
                  <option value="SETTLED">Hesaplandı</option>
                  <option value="PAID">Ödendi</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sipariş
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brüt Tutar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Komisyon
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        KDV
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net Tutar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBalances.map((balance) => (
                      <tr key={balance.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {balance.order?.orderNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(balance.grossAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(balance.commissionAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(balance.taxAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(balance.netAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(balance.status)}`}>
                            {getStatusText(balance.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(balance.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payouts Tab */}
          {activeTab === 'payouts' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ödeme Geçmişi</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tutar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ödeme Yöntemi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Oluşturulma
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tamamlanma
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payout.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(payout.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getPaymentMethodText(payout.paymentMethod)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payout.status)}`}>
                            {getStatusText(payout.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payout.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payout.completedAt ? formatDate(payout.completedAt) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === 'summary' && summary && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Detaylı Finansal Özet</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Gelir Dağılımı</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam Brüt Gelir:</span>
                      <span className="font-medium">{formatCurrency(summary.totalGrossAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam Komisyon:</span>
                      <span className="font-medium text-red-600">-{formatCurrency(summary.totalCommissionAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam KDV:</span>
                      <span className="font-medium text-red-600">-{formatCurrency(summary.totalTaxAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-medium">Net Gelir:</span>
                      <span className="font-bold text-green-600">{formatCurrency(summary.totalNetAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Ödeme Durumu</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ödenen Tutar:</span>
                      <span className="font-medium text-green-600">{formatCurrency(summary.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hesaplanan (Bekliyor):</span>
                      <span className="font-medium text-yellow-600">{formatCurrency(summary.settledAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">İşlenmemiş:</span>
                      <span className="font-medium text-orange-600">{formatCurrency(summary.pendingAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-900 font-medium">Toplam Bekleyen:</span>
                      <span className="font-bold text-yellow-600">
                        {formatCurrency(summary.settledAmount + summary.pendingAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-6">
                <h4 className="text-lg font-medium text-blue-900 mb-2">Komisyon Oranları</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Şirket Satıcısı (TYPE_A)</h5>
                    <p className="text-sm text-gray-600">Komisyon: %7 + KDV (%18)</p>
                    <p className="text-sm text-gray-600">Toplam: %8.26</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Bireysel Satıcı (TYPE_B)</h5>
                    <p className="text-sm text-gray-600">Komisyon: %10 + KDV (%18)</p>
                    <p className="text-sm text-gray-600">Toplam: %11.8</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

