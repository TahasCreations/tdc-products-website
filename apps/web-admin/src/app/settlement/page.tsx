'use client';

import React, { useState, useEffect } from 'react';

interface SettlementRun {
  id: string;
  runType: string;
  status: string;
  periodStart: string;
  periodEnd: string;
  totalSellers: number;
  totalOrders: number;
  totalGrossAmount: number;
  totalCommission: number;
  totalTax: number;
  totalNetAmount: number;
  createdAt: string;
  completedAt?: string;
}

interface SellerBalance {
  id: string;
  sellerId: string;
  grossAmount: number;
  commissionAmount: number;
  taxAmount: number;
  netAmount: number;
  status: string;
  createdAt: string;
  seller?: {
    businessName: string;
    sellerType: string;
  };
}

interface SettlementSummary {
  totalRuns: number;
  completedRuns: number;
  failedRuns: number;
  totalSettledAmount: number;
  totalPayoutAmount: number;
  pendingRuns: number;
}

export default function SettlementPage() {
  const [settlementRuns, setSettlementRuns] = useState<SettlementRun[]>([]);
  const [sellerBalances, setSellerBalances] = useState<SellerBalance[]>([]);
  const [summary, setSummary] = useState<SettlementSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'runs' | 'balances' | 'summary'>('runs');
  const [selectedRun, setSelectedRun] = useState<string | null>(null);

  // Mock data for development
  useEffect(() => {
    const mockSettlementRuns: SettlementRun[] = [
      {
        id: '1',
        runType: 'SCHEDULED',
        status: 'COMPLETED',
        periodStart: '2024-01-01T00:00:00Z',
        periodEnd: '2024-01-31T23:59:59Z',
        totalSellers: 15,
        totalOrders: 245,
        totalGrossAmount: 125000,
        totalCommission: 8750,
        totalTax: 1575,
        totalNetAmount: 114675,
        createdAt: '2024-02-01T02:00:00Z',
        completedAt: '2024-02-01T02:15:00Z'
      },
      {
        id: '2',
        runType: 'MANUAL',
        status: 'PROCESSING',
        periodStart: '2024-02-01T00:00:00Z',
        periodEnd: '2024-02-15T23:59:59Z',
        totalSellers: 0,
        totalOrders: 0,
        totalGrossAmount: 0,
        totalCommission: 0,
        totalTax: 0,
        totalNetAmount: 0,
        createdAt: '2024-02-16T10:30:00Z'
      }
    ];

    const mockSellerBalances: SellerBalance[] = [
      {
        id: '1',
        sellerId: 'seller-1',
        grossAmount: 5000,
        commissionAmount: 350,
        taxAmount: 63,
        netAmount: 4587,
        status: 'SETTLED',
        createdAt: '2024-01-15T10:00:00Z',
        seller: {
          businessName: 'Samsung Store',
          sellerType: 'TYPE_A'
        }
      },
      {
        id: '2',
        sellerId: 'seller-2',
        grossAmount: 3000,
        commissionAmount: 300,
        taxAmount: 54,
        netAmount: 2646,
        status: 'PENDING',
        createdAt: '2024-01-20T14:30:00Z',
        seller: {
          businessName: 'Nike Outlet',
          sellerType: 'TYPE_B'
        }
      }
    ];

    const mockSummary: SettlementSummary = {
      totalRuns: 12,
      completedRuns: 10,
      failedRuns: 1,
      totalSettledAmount: 1250000,
      totalPayoutAmount: 1200000,
      pendingRuns: 1
    };

    setSettlementRuns(mockSettlementRuns);
    setSellerBalances(mockSellerBalances);
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

  const getRunTypeText = (runType: string) => {
    switch (runType) {
      case 'SCHEDULED': return 'Zamanlanmış';
      case 'MANUAL': return 'Manuel';
      case 'ORDER_TRIGGERED': return 'Sipariş Tetikli';
      default: return runType;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settlement Yönetimi</h1>
        <p className="text-gray-600">Komisyon hesaplamaları ve ödeme işlemlerini yönetin</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Settlement</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.totalRuns}</p>
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
                <p className="text-sm font-medium text-gray-600">Tamamlanan</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.completedRuns}</p>
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
                <p className="text-2xl font-semibold text-gray-900">{summary.pendingRuns}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Tutar</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(summary.totalSettledAmount)}</p>
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
              onClick={() => setActiveTab('runs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'runs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settlement Runs
            </button>
            <button
              onClick={() => setActiveTab('balances')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'balances'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Seller Balances
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'summary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Özet
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Settlement Runs Tab */}
          {activeTab === 'runs' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Settlement Runs</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Yeni Settlement
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tip
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dönem
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Satıcılar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Siparişler
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net Tutar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarih
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {settlementRuns.map((run) => (
                      <tr key={run.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {run.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getRunTypeText(run.runType)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(run.status)}`}>
                            {getStatusText(run.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(run.periodStart)} - {formatDate(run.periodEnd)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {run.totalSellers}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {run.totalOrders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(run.totalNetAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(run.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Seller Balances Tab */}
          {activeTab === 'balances' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Seller Balances</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Tüm Durumlar</option>
                    <option value="PENDING">Bekliyor</option>
                    <option value="SETTLED">Hesaplandı</option>
                    <option value="PAID">Ödendi</option>
                  </select>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Toplu Settlement
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Satıcı
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tip
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
                    {sellerBalances.map((balance) => (
                      <tr key={balance.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {balance.seller?.businessName || 'Unknown'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {balance.seller?.sellerType === 'TYPE_A' ? 'Şirket' : 'Bireysel'}
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

          {/* Summary Tab */}
          {activeTab === 'summary' && summary && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Settlement Özeti</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Genel İstatistikler</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam Settlement Run:</span>
                      <span className="font-medium">{summary.totalRuns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tamamlanan:</span>
                      <span className="font-medium text-green-600">{summary.completedRuns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Başarısız:</span>
                      <span className="font-medium text-red-600">{summary.failedRuns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bekleyen:</span>
                      <span className="font-medium text-yellow-600">{summary.pendingRuns}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Finansal Özet</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam Hesaplanan:</span>
                      <span className="font-medium">{formatCurrency(summary.totalSettledAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Toplam Ödenen:</span>
                      <span className="font-medium text-green-600">{formatCurrency(summary.totalPayoutAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bekleyen Ödeme:</span>
                      <span className="font-medium text-yellow-600">
                        {formatCurrency(summary.totalSettledAmount - summary.totalPayoutAmount)}
                      </span>
                    </div>
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

