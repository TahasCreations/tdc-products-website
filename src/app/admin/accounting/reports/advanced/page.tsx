'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  FunnelIcon,
  EyeIcon,
  PrinterIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface FinancialReport {
  id: string;
  name: string;
  type: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'aged_receivables' | 'profit_loss' | 'tax_report';
  period: string;
  status: 'generated' | 'generating' | 'error';
  generatedAt: string;
  fileSize: number;
  downloadCount: number;
}

interface ReportData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  grossProfit: number;
  operatingProfit: number;
  ebitda: number;
  currentAssets: number;
  fixedAssets: number;
  currentLiabilities: number;
  longTermLiabilities: number;
  equity: number;
  cashFlow: number;
  receivables: {
    current: number;
    overdue30: number;
    overdue60: number;
    overdue90: number;
    overdue90Plus: number;
  };
  payables: {
    current: number;
    overdue30: number;
    overdue60: number;
    overdue90: number;
    overdue90Plus: number;
  };
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }>;
}

export default function AdvancedReportsPage() {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock report data
    const mockReports: FinancialReport[] = [
      {
        id: '1',
        name: 'Gelir Tablosu - Ocak 2024',
        type: 'income_statement',
        period: '2024-01',
        status: 'generated',
        generatedAt: '2024-01-31T23:59:59Z',
        fileSize: 245760,
        downloadCount: 5
      },
      {
        id: '2',
        name: 'Bilanço - Aralık 2023',
        type: 'balance_sheet',
        period: '2023-12',
        status: 'generated',
        generatedAt: '2024-01-01T00:00:00Z',
        fileSize: 189440,
        downloadCount: 3
      },
      {
        id: '3',
        name: 'Nakit Akış Tablosu - Q4 2023',
        type: 'cash_flow',
        period: '2023-Q4',
        status: 'generated',
        generatedAt: '2024-01-15T10:30:00Z',
        fileSize: 156672,
        downloadCount: 2
      },
      {
        id: '4',
        name: 'Yaşlandırılmış Alacaklar - Ocak 2024',
        type: 'aged_receivables',
        period: '2024-01',
        status: 'generating',
        generatedAt: '',
        fileSize: 0,
        downloadCount: 0
      }
    ];

    const mockReportData: ReportData = {
      totalRevenue: 250000,
      totalExpenses: 180000,
      netProfit: 70000,
      grossProfit: 120000,
      operatingProfit: 85000,
      ebitda: 95000,
      currentAssets: 150000,
      fixedAssets: 200000,
      currentLiabilities: 80000,
      longTermLiabilities: 120000,
      equity: 150000,
      cashFlow: 45000,
      receivables: {
        current: 35000,
        overdue30: 15000,
        overdue60: 8000,
        overdue90: 5000,
        overdue90Plus: 2000
      },
      payables: {
        current: 25000,
        overdue30: 10000,
        overdue60: 5000,
        overdue90: 3000,
        overdue90Plus: 1000
      }
    };

    setTimeout(() => {
      setReports(mockReports);
      setReportData(mockReportData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      generated: 'bg-green-100 text-green-800',
      generating: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.generated;
  };

  const getStatusText = (status: string) => {
    const texts = {
      generated: 'Hazır',
      generating: 'Hazırlanıyor',
      error: 'Hata'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getTypeText = (type: string) => {
    const texts = {
      income_statement: 'Gelir Tablosu',
      balance_sheet: 'Bilanço',
      cash_flow: 'Nakit Akış Tablosu',
      aged_receivables: 'Yaşlandırılmış Alacaklar',
      profit_loss: 'Kar/Zarar Tablosu',
      tax_report: 'Vergi Raporu'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      income_statement: ArrowTrendingUpIcon,
      balance_sheet: ChartBarIcon,
      cash_flow: CurrencyDollarIcon,
      aged_receivables: UserGroupIcon,
      profit_loss: ChartBarIcon,
      tax_report: DocumentTextIcon
    };
    return icons[type as keyof typeof icons] || DocumentTextIcon;
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
              <h1 className="text-3xl font-bold text-gray-900">Mali Raporlar ve Analiz</h1>
              <p className="text-gray-600 mt-1">Kapsamlı finansal raporlar ve analiz araçları</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <CalendarIcon className="w-4 h-4 mr-2 inline" />
                Dönem Seç
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <DocumentTextIcon className="w-4 h-4 mr-2 inline" />
                Yeni Rapor
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData?.totalRevenue || 0)}</p>
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
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData?.totalExpenses || 0)}</p>
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
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData?.netProfit || 0)}</p>
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
                <p className="text-sm font-medium text-gray-600">Nakit Akış</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData?.cashFlow || 0)}</p>
                <p className="text-sm text-gray-500">Bu dönem</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Reports */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hızlı Raporlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Gelir Tablosu</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Gelir, gider ve kar/zarar analizi
              </p>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Rapor Oluştur
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ChartBarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Bilanço</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Varlık, borç ve özkaynak analizi
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Rapor Oluştur
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Nakit Akış</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Nakit giriş ve çıkış analizi
              </p>
              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Rapor Oluştur
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <UserGroupIcon className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Yaşlandırılmış Alacaklar</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Müşteri alacaklarının yaş analizi
              </p>
              <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Rapor Oluştur
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Vergi Raporu</h3>
              </div>
              <p className="text-gray-600 mb-4">
                KDV, stopaj ve diğer vergi raporları
              </p>
              <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Rapor Oluştur
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <ShoppingCartIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Satış Analizi</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Ürün ve müşteri bazlı satış analizi
              </p>
              <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Rapor Oluştur
              </button>
            </div>
          </div>
        </div>

        {/* Generated Reports */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Oluşturulan Raporlar</h2>
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6">
              <div className="space-y-4">
                {reports.map((report) => {
                  const Icon = getTypeIcon(report.type);
                  return (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Icon className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{report.name}</h4>
                            <p className="text-sm text-gray-600">{getTypeText(report.type)}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>Dönem: {report.period}</span>
                              <span>Boyut: {formatFileSize(report.fileSize)}</span>
                              <span>İndirme: {report.downloadCount}</span>
                              <span>Oluşturulma: {new Date(report.generatedAt).toLocaleDateString('tr-TR')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {getStatusText(report.status)}
                          </span>
                          <div className="flex space-x-1">
                            <button className="text-blue-600 hover:text-blue-700" title="Görüntüle">
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-700" title="İndir">
                              <ArrowDownTrayIcon className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-700" title="Yazdır">
                              <PrinterIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alacaklar Yaş Analizi</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Güncel</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(reportData?.receivables.current || 0)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">30 Gün Gecikmiş</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(reportData?.receivables.overdue30 || 0)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">60 Gün Gecikmiş</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(reportData?.receivables.overdue60 || 0)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">90+ Gün Gecikmiş</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(reportData?.receivables.overdue90Plus || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Finansal Durum</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dönen Varlıklar</span>
                <span className="text-sm font-medium">{formatCurrency(reportData?.currentAssets || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Duran Varlıklar</span>
                <span className="text-sm font-medium">{formatCurrency(reportData?.fixedAssets || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Kısa Vadeli Borçlar</span>
                <span className="text-sm font-medium">{formatCurrency(reportData?.currentLiabilities || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Uzun Vadeli Borçlar</span>
                <span className="text-sm font-medium">{formatCurrency(reportData?.longTermLiabilities || 0)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-900">Özkaynaklar</span>
                  <span className="text-sm font-bold text-green-600">{formatCurrency(reportData?.equity || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
