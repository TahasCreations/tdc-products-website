'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import AdminProtection from '../../../../../components/AdminProtection';
import { 
  ChartBarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  DocumentChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartPieIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';

interface FinancialReport {
  id: string;
  name: string;
  type: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'aged_receivables' | 'tax_report' | 'custom';
  period: string;
  status: 'draft' | 'generated' | 'approved' | 'archived';
  generatedDate: string;
  generatedBy: string;
  data: any;
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalAssets: number;
    totalLiabilities: number;
    equity: number;
  };
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  isDefault: boolean;
  createdAt: string;
}

interface ReportSummary {
  totalReports: number;
  generatedThisMonth: number;
  pendingApproval: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
}

export default function AdvancedReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('current_month');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounting/advanced?module=reports');
      
      if (response.ok) {
        const data = await response.json();
        setReports(data.data.reports);
        setTemplates(data.data.templates);
        setSummary(data.data.summary);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (templateId: string, period: string) => {
    try {
      const response = await fetch('/api/accounting/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_report',
          data: { templateId, period }
        })
      });

      if (response.ok) {
        await fetchReports();
      }
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleViewReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/accounting/advanced?module=reports&reportId=${reportId}`);
      
      if (response.ok) {
        const data = await response.json();
        setReportData(data.data);
        setSelectedReport(reports.find(r => r.id === reportId) || null);
      }
    } catch (error) {
      console.error('Error viewing report:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'generated': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income_statement': return ChartBarIcon;
      case 'balance_sheet': return DocumentChartBarIcon;
      case 'cash_flow': return BanknotesIcon;
      case 'aged_receivables': return UserGroupIcon;
      case 'tax_report': return BuildingOfficeIcon;
      default: return DocumentTextIcon;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'income_statement': return 'Gelir Tablosu';
      case 'balance_sheet': return 'Bilanço';
      case 'cash_flow': return 'Nakit Akışı';
      case 'aged_receivables': return 'Yaşlandırılmış Alacaklar';
      case 'tax_report': return 'Vergi Raporu';
      default: return 'Özel Rapor';
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getTypeName(report.type).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (!user) {
    return <AdminProtection><div>Loading...</div></AdminProtection>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gelişmiş Mali Raporlar</h1>
              <p className="text-gray-600 mt-1">Detaylı finansal analiz ve raporlama</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <DocumentTextIcon className="w-4 h-4 mr-2" />
                Yeni Rapor
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalRevenue)}</p>
                  <p className="text-sm text-green-600">Bu dönem</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Gider</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalExpenses)}</p>
                  <p className="text-sm text-red-600">Bu dönem</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <ArrowTrendingDownIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Kar</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.netProfit)}</p>
                  <p className="text-sm text-blue-600">%{summary.profitMargin.toFixed(1)} kar marjı</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Raporlar</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalReports}</p>
                  <p className="text-sm text-gray-500">+{summary.generatedThisMonth} bu ay</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DocumentChartBarIcon className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Report Templates */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Hızlı Rapor Şablonları</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => {
                const TypeIcon = getTypeIcon(template.type);
                return (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg mr-3">
                        <TypeIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-500">{template.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{getTypeName(template.type)}</span>
                      <button
                        onClick={() => handleGenerateReport(template.id, periodFilter)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Oluştur
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rapor ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tip</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Tipler</option>
                <option value="income_statement">Gelir Tablosu</option>
                <option value="balance_sheet">Bilanço</option>
                <option value="cash_flow">Nakit Akışı</option>
                <option value="aged_receivables">Yaşlandırılmış Alacaklar</option>
                <option value="tax_report">Vergi Raporu</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="draft">Taslak</option>
                <option value="generated">Oluşturuldu</option>
                <option value="approved">Onaylandı</option>
                <option value="archived">Arşivlendi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dönem</label>
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="current_month">Bu Ay</option>
                <option value="last_month">Geçen Ay</option>
                <option value="current_quarter">Bu Çeyrek</option>
                <option value="last_quarter">Geçen Çeyrek</option>
                <option value="current_year">Bu Yıl</option>
                <option value="last_year">Geçen Yıl</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Mali Raporlar</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Raporlar yükleniyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rapor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dönem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oluşturulma
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Özet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => {
                    const TypeIcon = getTypeIcon(report.type);
                    return (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <TypeIcon className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{report.name}</div>
                              <div className="text-sm text-gray-500">{report.generatedBy}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{getTypeName(report.type)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {report.period}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status === 'draft' ? 'Taslak' :
                             report.status === 'generated' ? 'Oluşturuldu' :
                             report.status === 'approved' ? 'Onaylandı' : 'Arşivlendi'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(report.generatedDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>Gelir: {formatCurrency(report.summary.totalRevenue)}</div>
                            <div>Gider: {formatCurrency(report.summary.totalExpenses)}</div>
                            <div className="font-medium">Net: {formatCurrency(report.summary.netProfit)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewReport(report.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <ArrowDownTrayIcon className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <PrinterIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}