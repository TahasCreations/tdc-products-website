'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  DocumentChartBarIcon,
  ChartBarIcon,
  TableCellsIcon,
  DocumentArrowDownIcon,
  PrinterIcon,
  EyeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

interface Report {
  id: string;
  name: string;
  type: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'trial_balance' | 'aged_receivables' | 'tax_report';
  description: string;
  lastGenerated: string;
  status: 'ready' | 'generating' | 'error';
  fileSize: string;
  format: 'pdf' | 'excel' | 'csv';
}

interface FinancialData {
  period: string;
  revenue: number;
  expenses: number;
  netIncome: number;
  totalAssets: number;
  totalLiabilities: number;
  equity: number;
  cashFlow: number;
}

export default function FinancialReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data
  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: '1',
        name: 'Gelir Tablosu',
        type: 'income_statement',
        description: 'Gelir ve gider analizi',
        lastGenerated: '2024-01-15',
        status: 'ready',
        fileSize: '2.3 MB',
        format: 'pdf'
      },
      {
        id: '2',
        name: 'Bilanço',
        type: 'balance_sheet',
        description: 'Varlık ve borç durumu',
        lastGenerated: '2024-01-15',
        status: 'ready',
        fileSize: '1.8 MB',
        format: 'pdf'
      },
      {
        id: '3',
        name: 'Nakit Akış Tablosu',
        type: 'cash_flow',
        description: 'Nakit hareketleri',
        lastGenerated: '2024-01-14',
        status: 'ready',
        fileSize: '1.5 MB',
        format: 'excel'
      },
      {
        id: '4',
        name: 'Mizan',
        type: 'trial_balance',
        description: 'Hesap bakiyeleri',
        lastGenerated: '2024-01-15',
        status: 'ready',
        fileSize: '3.2 MB',
        format: 'excel'
      },
      {
        id: '5',
        name: 'Yaşlandırılmış Alacaklar',
        type: 'aged_receivables',
        description: 'Alacak yaşlandırma analizi',
        lastGenerated: '2024-01-13',
        status: 'ready',
        fileSize: '1.1 MB',
        format: 'pdf'
      },
      {
        id: '6',
        name: 'Vergi Raporu',
        type: 'tax_report',
        description: 'KDV ve vergi beyannameleri',
        lastGenerated: '2024-01-12',
        status: 'ready',
        fileSize: '2.7 MB',
        format: 'pdf'
      }
    ];

    const mockFinancialData: FinancialData = {
      period: '2024-01',
      revenue: 1250000,
      expenses: 850000,
      netIncome: 400000,
      totalAssets: 800000,
      totalLiabilities: 300000,
      equity: 500000,
      cashFlow: 150000
    };

    setReports(mockReports);
    setFinancialData(mockFinancialData);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'income_statement': return ChartBarIcon;
      case 'balance_sheet': return TableCellsIcon;
      case 'cash_flow': return BanknotesIcon;
      case 'trial_balance': return DocumentTextIcon;
      case 'aged_receivables': return ChartPieIcon;
      case 'tax_report': return DocumentChartBarIcon;
      default: return DocumentChartBarIcon;
    }
  };

  const getReportTypeName = (type: string) => {
    switch (type) {
      case 'income_statement': return 'Gelir Tablosu';
      case 'balance_sheet': return 'Bilanço';
      case 'cash_flow': return 'Nakit Akış';
      case 'trial_balance': return 'Mizan';
      case 'aged_receivables': return 'Alacak Analizi';
      case 'tax_report': return 'Vergi Raporu';
      default: return 'Rapor';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100';
      case 'generating': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Hazır';
      case 'generating': return 'Oluşturuluyor';
      case 'error': return 'Hata';
      default: return 'Bilinmiyor';
    }
  };

  const generateReport = (reportId: string) => {
    setReports(reports.map(report => 
      report.id === reportId 
        ? { ...report, status: 'generating' }
        : report
    ));

    // Simulate report generation
    setTimeout(() => {
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, status: 'ready', lastGenerated: new Date().toISOString().split('T')[0] }
          : report
      ));
    }, 3000);
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
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
                <h1 className="text-3xl font-bold text-gray-900">Finansal Raporlar</h1>
                <p className="mt-2 text-gray-600">Kapsamlı mali raporlama sistemi</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <FunnelIcon className="w-5 h-5 mr-2" />
                  Filtreler
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
                  Toplu İndir
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          {showFilters && (
            <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dönem</label>
                  <input
                    type="month"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rapor Türü</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="all">Tümü</option>
                    <option value="income_statement">Gelir Tablosu</option>
                    <option value="balance_sheet">Bilanço</option>
                    <option value="cash_flow">Nakit Akış</option>
                    <option value="trial_balance">Mizan</option>
                    <option value="aged_receivables">Alacak Analizi</option>
                    <option value="tax_report">Vergi Raporu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="all">Tümü</option>
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Filtrele
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(financialData?.revenue || 0)}
                  </p>
                </div>
                <ArrowTrendingUpIcon className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(financialData?.expenses || 0)}
                  </p>
                </div>
                <ArrowTrendingDownIcon className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Kar</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(financialData?.netIncome || 0)}
                  </p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nakit Akış</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(financialData?.cashFlow || 0)}
                  </p>
                </div>
                <BanknotesIcon className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => {
              const IconComponent = getReportIcon(report.type);
              return (
                <div key={report.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg mr-4">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                          <p className="text-sm text-gray-600">{report.description}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Son Oluşturulma:</span>
                        <span className="text-gray-900">{report.lastGenerated}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Dosya Boyutu:</span>
                        <span className="text-gray-900">{report.fileSize}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Format:</span>
                        <span className="text-gray-900 uppercase">{report.format}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => generateReport(report.id)}
                        disabled={report.status === 'generating'}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {report.status === 'generating' ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Oluşturuluyor...
                          </>
                        ) : (
                          <>
                            <DocumentChartBarIcon className="w-4 h-4 mr-2" />
                            Oluştur
                          </>
                        )}
                      </button>
                      <button className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <DocumentArrowDownIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <DocumentChartBarIcon className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-medium text-gray-900">Tüm Raporları Oluştur</h4>
                <p className="text-sm text-gray-600">Tüm raporları toplu olarak oluştur</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left">
                <DocumentArrowDownIcon className="w-8 h-8 text-green-600 mb-2" />
                <h4 className="font-medium text-gray-900">Raporları İndir</h4>
                <p className="text-sm text-gray-600">Hazır raporları ZIP olarak indir</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
                <PrinterIcon className="w-8 h-8 text-purple-600 mb-2" />
                <h4 className="font-medium text-gray-900">Yazdır</h4>
                <p className="text-sm text-gray-600">Raporları yazıcıya gönder</p>
              </button>
              
              <button className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors text-left">
                <CalendarIcon className="w-8 h-8 text-orange-600 mb-2" />
                <h4 className="font-medium text-gray-900">Zamanlanmış Raporlar</h4>
                <p className="text-sm text-gray-600">Otomatik rapor oluşturma</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}

