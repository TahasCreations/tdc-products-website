'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import AdminProtection from '../../../../../components/AdminProtection';
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  DocumentDuplicateIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  customerTaxNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  type: 'invoice' | 'receipt' | 'credit_note' | 'debit_note' | 'proforma';
  currency: string;
  dueDate: string;
  createdDate: string;
  sentDate?: string;
  paidDate?: string;
  paymentMethod?: string;
  eInvoiceStatus?: 'pending' | 'sent' | 'accepted' | 'rejected';
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  productId?: string;
  category?: string;
}

interface InvoiceSummary {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  draftCount: number;
  sentCount: number;
  paidCount: number;
  overdueCount: number;
}

export default function AdvancedInvoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [summary, setSummary] = useState<InvoiceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounting/advanced?module=invoices');
      
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.data.invoices);
        setSummary(data.data.summary);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (invoiceData: any) => {
    try {
      const response = await fetch('/api/accounting/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_invoice',
          data: invoiceData
        })
      });

      if (response.ok) {
        await fetchInvoices();
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      const response = await fetch('/api/accounting/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_invoice',
          data: { invoiceId }
        })
      });

      if (response.ok) {
        await fetchInvoices();
      }
    } catch (error) {
      console.error('Error sending invoice:', error);
    }
  };

  const handleMarkPaid = async (invoiceId: string, paymentMethod: string) => {
    try {
      const response = await fetch('/api/accounting/advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_paid',
          data: { invoiceId, paymentMethod }
        })
      });

      if (response.ok) {
        await fetchInvoices();
      }
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'refunded': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return ClockIcon;
      case 'sent': return DocumentTextIcon;
      case 'paid': return CheckCircleIcon;
      case 'overdue': return ExclamationTriangleIcon;
      case 'cancelled': return XCircleIcon;
      case 'refunded': return ArrowTrendingDownIcon;
      default: return ClockIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'invoice': return 'bg-blue-100 text-blue-800';
      case 'receipt': return 'bg-green-100 text-green-800';
      case 'credit_note': return 'bg-yellow-100 text-yellow-800';
      case 'debit_note': return 'bg-red-100 text-red-800';
      case 'proforma': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesType = typeFilter === 'all' || invoice.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Gelişmiş Fatura Yönetimi</h1>
              <p className="text-gray-600 mt-1">Faturalarınızı oluşturun, gönderin ve takip edin</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Yeni Fatura
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
                  <p className="text-sm font-medium text-gray-600">Toplam Tutar</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalAmount)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ödenen</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.paidAmount)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(summary.pendingAmount)}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vadesi Geçen</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.overdueAmount)}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Fatura no veya müşteri ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
                <option value="sent">Gönderildi</option>
                <option value="paid">Ödendi</option>
                <option value="overdue">Vadesi Geçen</option>
                <option value="cancelled">İptal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tip</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tüm Tipler</option>
                <option value="invoice">Fatura</option>
                <option value="receipt">Fiş</option>
                <option value="credit_note">İade Faturası</option>
                <option value="debit_note">Borç Dekontu</option>
                <option value="proforma">Proforma</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Faturalar</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Faturalar yükleniyor...</p>
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
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vade Tarihi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      E-Fatura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => {
                    const StatusIcon = getStatusIcon(invoice.status);
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                          <div className="text-sm text-gray-500">{formatDate(invoice.createdDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{invoice.customerName}</div>
                          <div className="text-sm text-gray-500">{invoice.customerTaxNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(invoice.total)}</div>
                          <div className="text-sm text-gray-500">{invoice.currency}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {invoice.status === 'draft' ? 'Taslak' :
                             invoice.status === 'sent' ? 'Gönderildi' :
                             invoice.status === 'paid' ? 'Ödendi' :
                             invoice.status === 'overdue' ? 'Vadesi Geçen' :
                             invoice.status === 'cancelled' ? 'İptal' : 'İade'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(invoice.type)}`}>
                            {invoice.type === 'invoice' ? 'Fatura' :
                             invoice.type === 'receipt' ? 'Fiş' :
                             invoice.type === 'credit_note' ? 'İade Faturası' :
                             invoice.type === 'debit_note' ? 'Borç Dekontu' : 'Proforma'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {invoice.eInvoiceStatus && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invoice.eInvoiceStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                              invoice.eInvoiceStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              invoice.eInvoiceStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {invoice.eInvoiceStatus === 'accepted' ? 'Kabul Edildi' :
                               invoice.eInvoiceStatus === 'pending' ? 'Bekliyor' :
                               invoice.eInvoiceStatus === 'rejected' ? 'Reddedildi' : 'Gönderildi'}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <PrinterIcon className="w-4 h-4" />
                            </button>
                            {invoice.status === 'draft' && (
                              <button
                                onClick={() => handleSendInvoice(invoice.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <DocumentTextIcon className="w-4 h-4" />
                              </button>
                            )}
                            {invoice.status === 'sent' && (
                              <button
                                onClick={() => handleMarkPaid(invoice.id, 'Bank Transfer')}
                                className="text-green-600 hover:text-green-900"
                              >
                                <CheckCircleIcon className="w-4 h-4" />
                              </button>
                            )}
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