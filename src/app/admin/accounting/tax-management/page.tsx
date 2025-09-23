'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  DocumentTextIcon,
  CalculatorIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BanknotesIcon,
  ReceiptRefundIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface TaxReport {
  id: string;
  type: 'kdv' | 'stopaj' | 'damga' | 'gelir' | 'kurumlar';
  name: string;
  period: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'submitted' | 'paid' | 'overdue';
  description: string;
  lastUpdated: string;
}

interface TaxCalculation {
  kdv: {
    input: number;
    output: number;
    payable: number;
  };
  stopaj: {
    income: number;
    rate: number;
    amount: number;
  };
  damga: {
    documents: number;
    rate: number;
    amount: number;
  };
  total: number;
}

export default function TaxManagement() {
  const { user } = useAuth();
  const [taxReports, setTaxReports] = useState<TaxReport[]>([]);
  const [taxCalculation, setTaxCalculation] = useState<TaxCalculation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'calculations' | 'payments'>('overview');

  // Mock data
  useEffect(() => {
    const mockTaxReports: TaxReport[] = [
      {
        id: '1',
        type: 'kdv',
        name: 'KDV Beyannamesi',
        period: '2024-01',
        dueDate: '2024-02-26',
        amount: 125000,
        status: 'pending',
        description: 'Ocak 2024 KDV beyannamesi',
        lastUpdated: '2024-01-15'
      },
      {
        id: '2',
        type: 'stopaj',
        name: 'Stopaj Beyannamesi',
        period: '2024-01',
        dueDate: '2024-02-26',
        amount: 45000,
        status: 'pending',
        description: 'Ocak 2024 stopaj beyannamesi',
        lastUpdated: '2024-01-15'
      },
      {
        id: '3',
        type: 'damga',
        name: 'Damga Vergisi',
        period: '2024-01',
        dueDate: '2024-02-26',
        amount: 8500,
        status: 'pending',
        description: 'Ocak 2024 damga vergisi',
        lastUpdated: '2024-01-15'
      },
      {
        id: '4',
        type: 'gelir',
        name: 'Gelir Vergisi',
        period: '2023',
        dueDate: '2024-03-31',
        amount: 85000,
        status: 'submitted',
        description: '2023 yılı gelir vergisi',
        lastUpdated: '2024-01-10'
      },
      {
        id: '5',
        type: 'kurumlar',
        name: 'Kurumlar Vergisi',
        period: '2023',
        dueDate: '2024-04-30',
        amount: 150000,
        status: 'paid',
        description: '2023 yılı kurumlar vergisi',
        lastUpdated: '2024-01-05'
      }
    ];

    const mockTaxCalculation: TaxCalculation = {
      kdv: {
        input: 85000,
        output: 125000,
        payable: 40000
      },
      stopaj: {
        income: 500000,
        rate: 0.15,
        amount: 75000
      },
      damga: {
        documents: 25,
        rate: 0.00948,
        amount: 8500
      },
      total: 123500
    };

    setTaxReports(mockTaxReports);
    setTaxCalculation(mockTaxCalculation);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getTaxTypeIcon = (type: string) => {
    switch (type) {
      case 'kdv': return CalculatorIcon;
      case 'stopaj': return ReceiptRefundIcon;
      case 'damga': return DocumentTextIcon;
      case 'gelir': return ChartBarIcon;
      case 'kurumlar': return BanknotesIcon;
      default: return DocumentTextIcon;
    }
  };

  const getTaxTypeName = (type: string) => {
    switch (type) {
      case 'kdv': return 'KDV';
      case 'stopaj': return 'Stopaj';
      case 'damga': return 'Damga Vergisi';
      case 'gelir': return 'Gelir Vergisi';
      case 'kurumlar': return 'Kurumlar Vergisi';
      default: return 'Vergi';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'submitted': return 'text-blue-600 bg-blue-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Bekliyor';
      case 'submitted': return 'Beyan Edildi';
      case 'paid': return 'Ödendi';
      case 'overdue': return 'Vadesi Geçmiş';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return ClockIcon;
      case 'submitted': return CheckCircleIcon;
      case 'paid': return CheckCircleIcon;
      case 'overdue': return ExclamationTriangleIcon;
      default: return ClockIcon;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
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
                <h1 className="text-3xl font-bold text-gray-900">Vergi Yönetimi</h1>
                <p className="mt-2 text-gray-600">Vergi hesaplama, beyan ve ödeme yönetimi</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                  <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                  Rapor İndir
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <CalculatorIcon className="w-5 h-5 mr-2" />
                  Vergi Hesapla
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
                { id: 'reports', name: 'Vergi Beyannameleri', icon: DocumentTextIcon },
                { id: 'calculations', name: 'Vergi Hesaplamaları', icon: CalculatorIcon },
                { id: 'payments', name: 'Ödemeler', icon: BanknotesIcon }
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
              {/* Tax Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Toplam Vergi Borcu</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(taxCalculation?.total || 0)}
                      </p>
                    </div>
                    <CurrencyDollarIcon className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="mt-2 text-sm text-red-600">
                    Bu dönem
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">KDV Borcu</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatCurrency(taxCalculation?.kdv.payable || 0)}
                      </p>
                    </div>
                    <CalculatorIcon className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="mt-2 text-sm text-orange-600">
                    KDV Beyannamesi
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Stopaj Borcu</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(taxCalculation?.stopaj.amount || 0)}
                      </p>
                    </div>
                    <ReceiptRefundIcon className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="mt-2 text-sm text-blue-600">
                    Stopaj Beyannamesi
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Damga Vergisi</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(taxCalculation?.damga.amount || 0)}
                      </p>
                    </div>
                    <DocumentTextIcon className="w-8 h-8 text-purple-500" />
                  </div>
                  <div className="mt-2 text-sm text-purple-600">
                    Damga Vergisi
                  </div>
                </div>
              </div>

              {/* Upcoming Deadlines */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Yaklaşan Vade Tarihleri</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {taxReports
                      .filter(report => report.status === 'pending')
                      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                      .slice(0, 5)
                      .map((report) => {
                        const StatusIcon = getStatusIcon(report.status);
                        const isOverdueReport = isOverdue(report.dueDate);
                        
                        return (
                          <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <StatusIcon className={`w-5 h-5 mr-3 ${isOverdueReport ? 'text-red-500' : 'text-yellow-500'}`} />
                              <div>
                                <h4 className="font-medium text-gray-900">{report.name}</h4>
                                <p className="text-sm text-gray-600">{report.description}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-medium ${isOverdueReport ? 'text-red-600' : 'text-gray-900'}`}>
                                {formatCurrency(report.amount)}
                              </p>
                              <p className={`text-xs ${isOverdueReport ? 'text-red-500' : 'text-gray-500'}`}>
                                Vade: {new Date(report.dueDate).toLocaleDateString('tr-TR')}
                                {isOverdueReport && ' (Vadesi Geçmiş)'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Vergi Beyannameleri</h3>
                    <div className="flex items-center space-x-3">
                      <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="2024-01">Ocak 2024</option>
                        <option value="2023-12">Aralık 2023</option>
                        <option value="2023-11">Kasım 2023</option>
                      </select>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Yeni Beyanname
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vergi Türü
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dönem
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tutar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vade Tarihi
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
                      {taxReports.map((report) => {
                        const IconComponent = getTaxTypeIcon(report.type);
                        const isOverdueReport = isOverdue(report.dueDate);
                        
                        return (
                          <tr key={report.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <IconComponent className="w-5 h-5 text-gray-400 mr-3" />
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{report.name}</div>
                                  <div className="text-sm text-gray-500">{getTaxTypeName(report.type)}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {report.period}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(report.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className={isOverdueReport ? 'text-red-600 font-medium' : ''}>
                                {new Date(report.dueDate).toLocaleDateString('tr-TR')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                {getStatusText(report.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button className="text-blue-600 hover:text-blue-900">
                                  <EyeIcon className="w-4 h-4" />
                                </button>
                                <button className="text-gray-600 hover:text-gray-900">
                                  <PencilIcon className="w-4 h-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-900">
                                  <DocumentArrowDownIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Calculations Tab */}
          {activeTab === 'calculations' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Vergi Hesaplamaları</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* KDV Calculation */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <CalculatorIcon className="w-5 h-5 mr-2 text-orange-500" />
                      KDV Hesaplaması
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">KDV Girişi:</span>
                        <span className="text-sm font-medium">{formatCurrency(taxCalculation?.kdv.input || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">KDV Çıkışı:</span>
                        <span className="text-sm font-medium">{formatCurrency(taxCalculation?.kdv.output || 0)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-medium text-gray-900">Ödenecek KDV:</span>
                        <span className="text-sm font-bold text-orange-600">{formatCurrency(taxCalculation?.kdv.payable || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stopaj Calculation */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <ReceiptRefundIcon className="w-5 h-5 mr-2 text-blue-500" />
                      Stopaj Hesaplaması
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Gelir:</span>
                        <span className="text-sm font-medium">{formatCurrency(taxCalculation?.stopaj.income || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stopaj Oranı:</span>
                        <span className="text-sm font-medium">%{(taxCalculation?.stopaj.rate || 0) * 100}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-medium text-gray-900">Stopaj Tutarı:</span>
                        <span className="text-sm font-bold text-blue-600">{formatCurrency(taxCalculation?.stopaj.amount || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Damga Vergisi Calculation */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <DocumentTextIcon className="w-5 h-5 mr-2 text-purple-500" />
                      Damga Vergisi Hesaplaması
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Belge Sayısı:</span>
                        <span className="text-sm font-medium">{taxCalculation?.damga.documents || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Damga Oranı:</span>
                        <span className="text-sm font-medium">%{((taxCalculation?.damga.rate || 0) * 100).toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-medium text-gray-900">Damga Vergisi:</span>
                        <span className="text-sm font-bold text-purple-600">{formatCurrency(taxCalculation?.damga.amount || 0)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Calculation */}
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                      <CurrencyDollarIcon className="w-5 h-5 mr-2 text-red-500" />
                      Toplam Vergi Borcu
                    </h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">
                        {formatCurrency(taxCalculation?.total || 0)}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Bu dönem ödenecek toplam vergi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Vergi Ödemeleri</h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-12">
                    <BanknotesIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ödeme Geçmişi</h3>
                    <p className="text-gray-600 mb-6">Vergi ödeme geçmişiniz burada görüntülenecek</p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      Yeni Ödeme Yap
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

