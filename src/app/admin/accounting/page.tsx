'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CurrencyDollarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  DocumentDuplicateIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  UserGroupIcon,
  UsersIcon,
  BuildingOfficeIcon,
  TableCellsIcon,
  CogIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  number: string;
  customer: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  createdDate: string;
  type: 'invoice' | 'receipt' | 'credit_note';
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingInvoices: number;
  overdueInvoices: number;
  monthlyGrowth: number;
  quarterlyGrowth: number;
}

interface EtaIntegration {
  isConnected: boolean;
  lastSync: string;
  syncStatus: 'success' | 'error' | 'pending';
  invoicesSynced: number;
  customersSynced: number;
}

export default function AccountingPage() {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [etaIntegration, setEtaIntegration] = useState<EtaIntegration | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');

  useEffect(() => {
    // Mock data - Gerçek API'den gelecek
    const mockSummary: FinancialSummary = {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      pendingInvoices: 0,
      overdueInvoices: 0,
      monthlyGrowth: 0,
      quarterlyGrowth: 0
    };

    const mockInvoices: Invoice[] = [];

    const mockEtaIntegration: EtaIntegration = {
      isConnected: false,
      lastSync: '',
      syncStatus: 'pending',
      invoicesSynced: 0,
      customersSynced: 0
    };

    setTimeout(() => {
      setSummary(mockSummary);
      setInvoices(mockInvoices);
      setEtaIntegration(mockEtaIntegration);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusText = (status: string) => {
    const texts = {
      draft: 'Taslak',
      sent: 'Gönderildi',
      paid: 'Ödendi',
      overdue: 'Vadesi Geçmiş',
      cancelled: 'İptal Edildi'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getTypeText = (type: string) => {
    const texts = {
      invoice: 'Fatura',
      receipt: 'Makbuz',
      credit_note: 'İade Faturası'
    };
    return texts[type as keyof typeof texts] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
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
              <h1 className="text-3xl font-bold text-gray-900">Muhasebe Modülü</h1>
              <p className="text-gray-600 mt-1">Profesyonel muhasebe yönetimi</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ArrowDownTrayIcon className="w-4 h-4 mr-2 inline" />
                Rapor İndir
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="w-4 h-4 mr-2 inline" />
                Yeni Fatura
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Eta Integration Status */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <DocumentTextIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Muhasebe Entegrasyonu</h3>
                  <p className="text-gray-600">
                    {etaIntegration?.isConnected 
                      ? 'Muhasebe sistemi ile bağlantı kuruldu' 
                      : 'Muhasebe entegrasyonu kurulmadı'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {etaIntegration?.isConnected ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">Bağlı</span>
                  </div>
                ) : (
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Entegrasyon Kur
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary?.totalRevenue || 0)}</p>
                <p className="text-sm text-gray-500">Bu dönem</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary?.totalExpenses || 0)}</p>
                <p className="text-sm text-gray-500">Bu dönem</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Kar</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary?.netProfit || 0)}</p>
                <p className="text-sm text-gray-500">Bu dönem</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ChartBarIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bekleyen Faturalar</p>
                <p className="text-2xl font-bold text-gray-900">{summary?.pendingInvoices || 0}</p>
                <p className="text-sm text-gray-500">Ödeme bekliyor</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hızlı Eylemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/accounting/advanced-dashboard" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gelişmiş Dashboard</h3>
                  <p className="text-sm text-gray-600">Kapsamlı mali yönetim</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/accounting/companies" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BuildingOfficeIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Çoklu Şirket</h3>
                  <p className="text-sm text-gray-600">Şirket yönetimi</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/accounting/chart-of-accounts" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TableCellsIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hesap Planı</h3>
                  <p className="text-sm text-gray-600">Muhasebe hesap planı</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/accounting/customers" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Cari Hesaplar</h3>
                  <p className="text-sm text-gray-600">Müşteri ve tedarikçi</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Additional Modules */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ek Muhasebe Modülleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/accounting/financial-reports" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <DocumentChartBarIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Finansal Raporlar</h3>
                  <p className="text-sm text-gray-600">Gelir tablosu, bilanço, nakit akış</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/accounting/tax-management" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <DocumentTextIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Vergi Yönetimi</h3>
                  <p className="text-sm text-gray-600">KDV, stopaj ve vergi beyannameleri</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/accounting/invoices/advanced" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ReceiptPercentIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">E-Arşiv & E-Fatura</h3>
                  <p className="text-sm text-gray-600">Elektronik belge yönetimi</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/accounting/payroll" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <UsersIcon className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Bordro Yönetimi</h3>
                  <p className="text-sm text-gray-600">Personel maaş ve ödemeleri</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/accounting/bank-integration/advanced" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <BanknotesIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Banka Entegrasyonu</h3>
                  <p className="text-sm text-gray-600">Otomatik mutabakat sistemi</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/accounting/reports/advanced" className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Mali Raporlar</h3>
                  <p className="text-sm text-gray-600">Kapsamlı finansal analizler</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Son Faturalar</h3>
              <Link href="/admin/accounting/invoices" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Tümünü Gör
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {invoices.length === 0 ? (
              <div className="text-center py-12">
                <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz fatura yok</h3>
                <p className="text-gray-600 mb-6">İlk faturanızı oluşturmak için aşağıdaki butona tıklayın</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <PlusIcon className="w-5 h-5 mr-2 inline" />
                  İlk Faturayı Oluştur
                </button>
              </div>
            ) : (
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
                        Durum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vade Tarihi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                          <div className="text-sm text-gray-500">{getTypeText(invoice.type)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(invoice.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            {getStatusText(invoice.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <PrinterIcon className="w-4 h-4" />
                            </button>
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
    </div>
  );
}