'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import AdminProtection from '../../../components/AdminProtection';
import OptimizedLoader from '../../../components/OptimizedLoader';

// Lazy load heavy components
const FinanceCharts = lazy(() => import('../../../components/FinanceCharts'));

// Lazy load heavy libraries
const loadPDFLibs = () => import('jspdf').then(module => ({ jsPDF: module.default }));
const loadCanvasLib = () => import('html2canvas').then(module => ({ html2canvas: module.default }));
const loadXLSXLib = () => import('xlsx').then(module => ({ XLSX: module }));

interface FinanceData {
  totalRevenue: number;
  totalExpenses: number;
  totalOrders: number;
  netProfit: number;
  profitMargin: number;
  expensesByCategory: Record<string, number>;
  period: {
    month: string;
    year: string;
    startDate: string;
    endDate: string;
  };
}

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface Expense {
  id: string;
  expense_number: string;
  category: string;
  subcategory: string;
  description: string;
  amount: number;
  expense_date: string;
  supplier_name: string;
  status: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  total_amount: number;
  invoice_date: string;
  status: string;
}

export default function AdminReportsPage() {
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState({
    startMonth: new Date().getMonth() + 1,
    startYear: new Date().getFullYear(),
    endMonth: new Date().getMonth() + 1,
    endYear: new Date().getFullYear()
  });
  const [reportType, setReportType] = useState<'monthly' | 'yearly' | 'custom'>('monthly');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod, reportType]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Ana finansal verileri getir
      const dashboardResponse = await fetch('/api/finance?type=dashboard');
      const dashboardData = await dashboardResponse.json();
      
      if (dashboardData.success) {
        setFinanceData(dashboardData.data);
      }

      // Aylık trend verilerini getir (son 12 ay)
      const monthlyResponse = await fetch('/api/finance?type=monthly_trend');
      const monthlyData = await monthlyResponse.json();
      
      if (monthlyData.success) {
        setMonthlyData(monthlyData.data);
      }

      // Detaylı verileri getir
      const [expensesResponse, invoicesResponse] = await Promise.all([
        fetch('/api/finance?type=expenses'),
        fetch('/api/finance?type=invoices')
      ]);

      const [expensesData, invoicesData] = await Promise.all([
        expensesResponse.json(),
        invoicesResponse.json()
      ]);

      if (expensesData.success) {
        setExpenses(expensesData.expenses);
      }

      if (invoicesData.success) {
        setInvoices(invoicesData.invoices);
      }

    } catch (error) {
      console.error('Fetch report data error:', error);
      setMessage('Rapor verileri yüklenemedi');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const generatePDFReport = async () => {
    try {
      setMessage('PDF raporu oluşturuluyor...');
      setMessageType('success');

      const element = document.getElementById('report-content');
      if (!element) return;

      // Lazy load libraries
      const [{ html2canvas }, { jsPDF }] = await Promise.all([
        loadCanvasLib(),
        loadPDFLibs()
      ]);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `finans-raporu-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      setMessage('PDF raporu başarıyla indirildi');
      setMessageType('success');
    } catch (error) {
      console.error('PDF generation error:', error);
      setMessage('PDF oluşturulurken hata oluştu');
      setMessageType('error');
    }
  };

  const generateExcelReport = async () => {
    try {
      setMessage('Excel raporu oluşturuluyor...');
      setMessageType('success');

      // Lazy load XLSX library
      const { XLSX } = await loadXLSXLib();

      const workbook = XLSX.utils.book_new();

      // Finansal Özet
      const summaryData = [
        ['Finansal Özet Raporu'],
        [''],
        ['Dönem', `${selectedPeriod.startMonth}/${selectedPeriod.startYear} - ${selectedPeriod.endMonth}/${selectedPeriod.endYear}`],
        [''],
        ['Toplam Gelir', financeData?.totalRevenue || 0],
        ['Faturasız Satışlar', financeData?.totalOrders || 0],
        ['Toplam Gider', financeData?.totalExpenses || 0],
        ['Net Kar', financeData?.netProfit || 0],
        ['Kar Marjı (%)', financeData?.profitMargin || 0],
        [''],
        ['Gider Kategorileri'],
        ['Kategori', 'Tutar']
      ];

      Object.entries(financeData?.expensesByCategory || {}).forEach(([category, amount]) => {
        summaryData.push([category, amount]);
      });

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Finansal Özet');

      // Giderler
      const expensesData = [
        ['Gider No', 'Kategori', 'Alt Kategori', 'Açıklama', 'Tutar', 'Tarih', 'Tedarikçi', 'Durum']
      ];

      expenses.forEach(expense => {
        expensesData.push([
          expense.expense_number,
          expense.category,
          expense.subcategory,
          expense.description,
          expense.amount.toString(),
          expense.expense_date,
          expense.supplier_name,
          expense.status
        ]);
      });

      const expensesSheet = XLSX.utils.aoa_to_sheet(expensesData);
      XLSX.utils.book_append_sheet(workbook, expensesSheet, 'Giderler');

      // Faturalar
      const invoicesData = [
        ['Fatura No', 'Müşteri', 'Tutar', 'Tarih', 'Durum']
      ];

      invoices.forEach(invoice => {
        invoicesData.push([
          invoice.invoice_number,
          invoice.customer_name,
          invoice.total_amount.toString(),
          invoice.invoice_date,
          invoice.status
        ]);
      });

      const invoicesSheet = XLSX.utils.aoa_to_sheet(invoicesData);
      XLSX.utils.book_append_sheet(workbook, invoicesSheet, 'Faturalar');

      const fileName = `finans-raporu-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      setMessage('Excel raporu başarıyla indirildi');
      setMessageType('success');
    } catch (error) {
      console.error('Excel generation error:', error);
      setMessage('Excel oluşturulurken hata oluştu');
      setMessageType('error');
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

  if (loading) {
    return <OptimizedLoader message="Rapor verileri yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Finansal Raporlar</h1>
            <p className="text-gray-600">Detaylı finansal analiz ve raporlar</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={generatePDFReport}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <i className="ri-file-pdf-line"></i>
              <span>PDF İndir</span>
            </button>
            <button
              onClick={generateExcelReport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <i className="ri-file-excel-line"></i>
              <span>Excel İndir</span>
            </button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
            <button
              onClick={() => setMessage('')}
              className="float-right text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Period Selection */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rapor Dönemi</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Ayı</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPeriod.startMonth}
                onChange={(e) => setSelectedPeriod({...selectedPeriod, startMonth: parseInt(e.target.value)})}
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1}. Ay</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Yılı</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPeriod.startYear}
                onChange={(e) => setSelectedPeriod({...selectedPeriod, startYear: parseInt(e.target.value)})}
              >
                {Array.from({length: 5}, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Ayı</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPeriod.endMonth}
                onChange={(e) => setSelectedPeriod({...selectedPeriod, endMonth: parseInt(e.target.value)})}
              >
                {Array.from({length: 12}, (_, i) => (
                  <option key={i+1} value={i+1}>{i+1}. Ay</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Yılı</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPeriod.endYear}
                onChange={(e) => setSelectedPeriod({...selectedPeriod, endYear: parseInt(e.target.value)})}
              >
                {Array.from({length: 5}, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div id="report-content" className="space-y-6">
          {financeData && (
            <Suspense fallback={<OptimizedLoader />}>
              <FinanceCharts 
                financeData={financeData} 
                monthlyData={monthlyData}
              />
            </Suspense>
          )}

          {/* Detailed Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Expenses */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Giderler</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gider No</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.slice(0, 5).map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          {expense.expense_number}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {expense.category}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {formatDate(expense.expense_date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Faturalar</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fatura No</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.slice(0, 5).map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          {invoice.invoice_number}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {invoice.customer_name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {formatCurrency(invoice.total_amount)}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            invoice.status === 'paid' 
                              ? 'bg-green-100 text-green-800'
                              : invoice.status === 'sent'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {invoice.status === 'paid' ? 'Ödendi' : 
                             invoice.status === 'sent' ? 'Gönderildi' : 'Taslak'}
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
      </div>
    </AdminProtection>
  );
}
