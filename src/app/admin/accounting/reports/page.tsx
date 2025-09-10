'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminProtection from '../../../../components/AdminProtection';

interface ReportData {
  trialBalance: any[];
  ledger: any[];
  journal: any[];
  accountStatement: any[];
  kdvSummary: any;
  periodSummary: any;
}

interface ReportFilters {
  startDate: string;
  endDate: string;
  period: string;
  accountId: string;
  companyId: string;
}

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const [activeReport, setActiveReport] = useState<string>('trial-balance');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    period: new Date().toISOString().substring(0, 7),
    accountId: '',
    companyId: '550e8400-e29b-41d4-a716-446655440000'
  });

  // URL parametresinden aktif raporu al
  useEffect(() => {
    const reportParam = searchParams.get('report');
    if (reportParam) {
      setActiveReport(reportParam);
    }
  }, [searchParams]);

  const reportTypes = [
    {
      id: 'trial-balance',
      name: 'Mizan',
      description: 'Hesap bakiyeleri raporu',
      icon: 'ri-scales-line',
      color: 'blue'
    },
    {
      id: 'ledger',
      name: 'Kebir Defteri',
      description: 'Hesap hareketleri raporu',
      icon: 'ri-book-open-line',
      color: 'green'
    },
    {
      id: 'journal',
      name: 'Yevmiye Defteri',
      description: 'Fiş listesi raporu',
      icon: 'ri-file-list-line',
      color: 'purple'
    },
    {
      id: 'account-statement',
      name: 'Hesap Ekstresi',
      description: 'Belirli hesap detayları',
      icon: 'ri-file-text-line',
      color: 'orange'
    },
    {
      id: 'kdv-summary',
      name: 'KDV Özeti',
      description: 'KDV hesaplamaları',
      icon: 'ri-calculator-line',
      color: 'red'
    },
    {
      id: 'period-summary',
      name: 'Dönem Raporu',
      description: 'Dönemsel özet rapor',
      icon: 'ri-calendar-line',
      color: 'teal'
    }
  ];

  const fetchReportData = async (reportType: string) => {
    try {
      setLoading(true);
      setError('');

      const queryParams = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        period: filters.period,
        companyId: filters.companyId
      });

      if (filters.accountId) {
        queryParams.append('accountId', filters.accountId);
      }

      const response = await fetch(`/api/accounting/reports/${reportType}?${queryParams}`);
      if (!response.ok) {
        throw new Error('Rapor verileri alınamadı');
      }

      const data = await response.json();
      setReportData(prev => ({ ...prev, [reportType]: data } as ReportData));
    } catch (error) {
      console.error('Report fetch error:', error);
      setError('Rapor verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleReportChange = (reportType: string) => {
    setActiveReport(reportType);
    if (!reportData?.[reportType as keyof ReportData]) {
      fetchReportData(reportType);
    }
  };

  const handleFilterChange = (field: keyof ReportFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateReport = () => {
    fetchReportData(activeReport);
  };

  const handleExportExcel = async () => {
    try {
      const queryParams = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        period: filters.period,
        companyId: filters.companyId,
        format: 'excel'
      });

      if (filters.accountId) {
        queryParams.append('accountId', filters.accountId);
      }

      const response = await fetch(`/api/accounting/reports/${activeReport}/export?${queryParams}`);
      if (!response.ok) {
        throw new Error('Excel export başarısız');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportTypes.find(r => r.id === activeReport)?.name}-${filters.period}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Excel export error:', error);
      setError('Excel export başarısız');
    }
  };

  const handleExportPDF = async () => {
    try {
      const queryParams = new URLSearchParams({
        startDate: filters.startDate,
        endDate: filters.endDate,
        period: filters.period,
        companyId: filters.companyId,
        format: 'pdf'
      });

      if (filters.accountId) {
        queryParams.append('accountId', filters.accountId);
      }

      const response = await fetch(`/api/accounting/reports/${activeReport}/export?${queryParams}`);
      if (!response.ok) {
        throw new Error('PDF export başarısız');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportTypes.find(r => r.id === activeReport)?.name}-${filters.period}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('PDF export error:', error);
      setError('PDF export başarısız');
    }
  };

  const renderTrialBalance = () => {
    const data = reportData?.trialBalance || [];
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hesap Kodu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hesap Adı
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borç Bakiyesi
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alacak Bakiyesi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.debit_balance?.toLocaleString('tr-TR') || '0.00'} TL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.credit_balance?.toLocaleString('tr-TR') || '0.00'} TL
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderLedger = () => {
    const data = reportData?.ledger || [];
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiş No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Açıklama
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borç
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alacak
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bakiye
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(row.date).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.journal_no}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.debit?.toLocaleString('tr-TR') || '0.00'} TL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.credit?.toLocaleString('tr-TR') || '0.00'} TL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.balance?.toLocaleString('tr-TR') || '0.00'} TL
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderJournal = () => {
    const data = reportData?.journal || [];
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiş No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Açıklama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hesap
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borç
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alacak
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(row.date).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.journal_no}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.account_code} - {row.account_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.debit?.toLocaleString('tr-TR') || '0.00'} TL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.credit?.toLocaleString('tr-TR') || '0.00'} TL
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAccountStatement = () => {
    const data = reportData?.accountStatement || [];
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiş No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Açıklama
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borç
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alacak
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bakiye
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(row.date).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.journal_no}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {row.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.debit?.toLocaleString('tr-TR') || '0.00'} TL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.credit?.toLocaleString('tr-TR') || '0.00'} TL
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.balance?.toLocaleString('tr-TR') || '0.00'} TL
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderKdvSummary = () => {
    const data = reportData?.kdvSummary || {};
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">KDV Oranları</h3>
          <div className="space-y-3">
            {Object.entries(data.kdvRates || {}).map(([rate, amount]) => (
              <div key={rate} className="flex justify-between items-center">
                <span className="text-gray-600">%{rate} KDV</span>
                <span className="font-semibold text-gray-900">
                  {(amount as number)?.toLocaleString('tr-TR') || '0.00'} TL
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Toplam KDV</h3>
          <div className="text-3xl font-bold text-blue-600">
            {data.totalKdv?.toLocaleString('tr-TR') || '0.00'} TL
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dönem</h3>
          <div className="text-lg text-gray-600">
            {filters.period}
          </div>
        </div>
      </div>
    );
  };

  const renderPeriodSummary = () => {
    const data = reportData?.periodSummary || {};
    return (
      <div className="space-y-6">
        {/* Dönem Bilgileri */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dönem Bilgileri</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Başlangıç:</span>
                <span className="font-medium">{data.period?.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bitiş:</span>
                <span className="font-medium">{data.period?.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Süre:</span>
                <span className="font-medium">{data.period?.duration} gün</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hesap Özeti</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Hesap:</span>
                <span className="font-medium">{data.accounts?.total || 0}</span>
              </div>
              {Object.entries(data.accounts?.byType || {}).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span className="text-gray-600">{type}:</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cari Hesaplar</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Cari:</span>
                <span className="font-medium">{data.contacts?.total || 0}</span>
              </div>
              {Object.entries(data.contacts?.byType || {}).map(([type, count]) => (
                <div key={type} className="flex justify-between">
                  <span className="text-gray-600">{type}:</span>
                  <span className="font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Finansal Özet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Yevmiye Defteri</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Fiş:</span>
                <span className="font-medium">{data.journal?.totalEntries || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Borç:</span>
                <span className="font-medium text-red-600">
                  {data.journal?.totalDebit?.toLocaleString('tr-TR') || '0.00'} TL
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Alacak:</span>
                <span className="font-medium text-green-600">
                  {data.journal?.totalCredit?.toLocaleString('tr-TR') || '0.00'} TL
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600 font-semibold">Bakiye:</span>
                <span className={`font-bold ${(data.journal?.balance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.journal?.balance?.toLocaleString('tr-TR') || '0.00'} TL
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fatura Özeti</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Fatura:</span>
                <span className="font-medium">{data.invoices?.totalCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam Tutar:</span>
                <span className="font-medium">
                  {data.invoices?.totalAmount?.toLocaleString('tr-TR') || '0.00'} TL
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Toplam KDV:</span>
                <span className="font-medium text-blue-600">
                  {data.invoices?.totalKdv?.toLocaleString('tr-TR') || '0.00'} TL
                </span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600 font-semibold">Net Tutar:</span>
                <span className="font-bold text-gray-900">
                  {data.invoices?.netAmount?.toLocaleString('tr-TR') || '0.00'} TL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (activeReport) {
      case 'trial-balance':
        return renderTrialBalance();
      case 'ledger':
        return renderLedger();
      case 'journal':
        return renderJournal();
      case 'account-statement':
        return renderAccountStatement();
      case 'kdv-summary':
        return renderKdvSummary();
      case 'period-summary':
        return renderPeriodSummary();
      default:
        return <div className="text-center py-8 text-gray-500">Rapor seçin</div>;
    }
  };

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Muhasebe Raporları</h1>
                <p className="mt-2 text-gray-600">Mizan, kebir, yevmiye ve diğer muhasebe raporları</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Rapor Türleri */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Rapor Türleri</h2>
                <div className="space-y-2">
                  {reportTypes.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => handleReportChange(report.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeReport === report.id
                          ? `bg-${report.color}-100 text-${report.color}-800 border border-${report.color}-200`
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center">
                        <i className={`${report.icon} text-lg mr-3`}></i>
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm opacity-75">{report.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Rapor İçeriği */}
            <div className="lg:col-span-3">
              {/* Filtreler */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rapor Filtreleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => handleFilterChange('startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => handleFilterChange('endDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dönem
                    </label>
                    <input
                      type="month"
                      value={filters.period}
                      onChange={(e) => handleFilterChange('period', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleGenerateReport}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {loading ? 'Yükleniyor...' : 'Rapor Oluştur'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Export Butonları */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {reportTypes.find(r => r.id === activeReport)?.name} Raporu
                  </h3>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleExportExcel}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <i className="ri-file-excel-line mr-2"></i>
                      Excel
                    </button>
                    <button
                      onClick={handleExportPDF}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                    >
                      <i className="ri-file-pdf-line mr-2"></i>
                      PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Rapor İçeriği */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Rapor yükleniyor...</p>
                    </div>
                  ) : (
                    renderReportContent()
                  )}
                </div>
              </div>

              {/* Hata Mesajı */}
              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}
