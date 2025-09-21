'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CalendarIcon,
  CreditCardIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  number: string;
  type: 'invoice' | 'receipt' | 'credit_note' | 'debit_note';
  customer: {
    id: string;
    name: string;
    code: string;
    taxNumber: string;
  };
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'partially_paid';
  dueDate: string;
  createdDate: string;
  paymentDate: string | null;
  paymentMethod: string | null;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    taxRate: number;
  }>;
  notes: string;
  isEInvoice: boolean;
  eInvoiceStatus: 'pending' | 'sent' | 'accepted' | 'rejected' | null;
}

interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  overdueAmount: number;
  pendingAmount: number;
  thisMonthInvoices: number;
  thisMonthAmount: number;
  averagePaymentTime: number;
}

export default function AdvancedInvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    // Mock invoice data
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        number: 'FAT-2024-001',
        type: 'invoice',
        customer: {
          id: '1',
          name: 'ABC Teknoloji A.Ş.',
          code: 'CAR001',
          taxNumber: '1234567890'
        },
        amount: 10000,
        taxAmount: 1800,
        totalAmount: 11800,
        status: 'paid',
        dueDate: '2024-01-15',
        createdDate: '2024-01-01',
        paymentDate: '2024-01-10',
        paymentMethod: 'Banka Havalesi',
        items: [
          {
            id: '1',
            description: 'Web Tasarım Hizmeti',
            quantity: 1,
            unitPrice: 10000,
            totalPrice: 10000,
            taxRate: 18
          }
        ],
        notes: 'Proje teslim tarihi: 15 Şubat 2024',
        isEInvoice: true,
        eInvoiceStatus: 'accepted'
      },
      {
        id: '2',
        number: 'FAT-2024-002',
        type: 'invoice',
        customer: {
          id: '2',
          name: 'Mehmet Demir',
          code: 'CAR002',
          taxNumber: '9876543210'
        },
        amount: 5000,
        taxAmount: 900,
        totalAmount: 5900,
        status: 'overdue',
        dueDate: '2024-01-10',
        createdDate: '2023-12-20',
        paymentDate: null,
        paymentMethod: null,
        items: [
          {
            id: '2',
            description: 'Mobil Uygulama Geliştirme',
            quantity: 1,
            unitPrice: 5000,
            totalPrice: 5000,
            taxRate: 18
          }
        ],
        notes: 'Ödeme gecikmesi nedeniyle faiz uygulanacak',
        isEInvoice: false,
        eInvoiceStatus: null
      },
      {
        id: '3',
        number: 'FAT-2024-003',
        type: 'invoice',
        customer: {
          id: '3',
          name: 'XYZ İnşaat Ltd. Şti.',
          code: 'CAR003',
          taxNumber: '1122334455'
        },
        amount: 25000,
        taxAmount: 4500,
        totalAmount: 29500,
        status: 'sent',
        dueDate: '2024-02-15',
        createdDate: '2024-01-20',
        paymentDate: null,
        paymentMethod: null,
        items: [
          {
            id: '3',
            description: 'Sistem Entegrasyonu',
            quantity: 1,
            unitPrice: 20000,
            totalPrice: 20000,
            taxRate: 18
          },
          {
            id: '4',
            description: 'Eğitim Hizmeti',
            quantity: 1,
            unitPrice: 5000,
            totalPrice: 5000,
            taxRate: 18
          }
        ],
        notes: 'E-fatura olarak gönderilecek',
        isEInvoice: true,
        eInvoiceStatus: 'sent'
      }
    ];

    const mockStats: InvoiceStats = {
      totalInvoices: 3,
      totalAmount: 47200,
      paidAmount: 11800,
      overdueAmount: 5900,
      pendingAmount: 29500,
      thisMonthInvoices: 2,
      thisMonthAmount: 35300,
      averagePaymentTime: 12
    };

    setTimeout(() => {
      setInvoices(mockInvoices);
      setStats(mockStats);
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
      cancelled: 'bg-gray-100 text-gray-800',
      partially_paid: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getStatusText = (status: string) => {
    const texts = {
      draft: 'Taslak',
      sent: 'Gönderildi',
      paid: 'Ödendi',
      overdue: 'Vadesi Geçmiş',
      cancelled: 'İptal Edildi',
      partially_paid: 'Kısmen Ödendi'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getTypeText = (type: string) => {
    const texts = {
      invoice: 'Fatura',
      receipt: 'Makbuz',
      credit_note: 'İade Faturası',
      debit_note: 'Borç Dekontu'
    };
    return texts[type as keyof typeof texts] || type;
  };

  const getEInvoiceStatusColor = (status: string | null) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getEInvoiceStatusText = (status: string | null) => {
    if (!status) return 'E-Fatura Değil';
    const texts = {
      pending: 'Bekliyor',
      sent: 'Gönderildi',
      accepted: 'Kabul Edildi',
      rejected: 'Reddedildi'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    const matchesType = filterType === 'all' || invoice.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

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
              <h1 className="text-3xl font-bold text-gray-900">Gelişmiş Fatura Yönetimi</h1>
              <p className="text-gray-600 mt-1">Faturalar, makbuzlar ve e-fatura işlemleri</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <ArrowDownTrayIcon className="w-4 h-4 mr-2 inline" />
                Rapor İndir
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2 inline" />
                Yeni Fatura
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Fatura</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalInvoices}</p>
                <p className="text-sm text-gray-500">Adet</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Tutar</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.totalAmount || 0)}</p>
                <p className="text-sm text-gray-500">TL</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ödenen Tutar</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.paidAmount || 0)}</p>
                <p className="text-sm text-gray-500">TL</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vadesi Geçen</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats?.overdueAmount || 0)}</p>
                <p className="text-sm text-gray-500">TL</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Fatura ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="draft">Taslak</option>
              <option value="sent">Gönderildi</option>
              <option value="paid">Ödendi</option>
              <option value="overdue">Vadesi Geçmiş</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tüm Tipler</option>
              <option value="invoice">Fatura</option>
              <option value="receipt">Makbuz</option>
              <option value="credit_note">İade Faturası</option>
              <option value="debit_note">Borç Dekontu</option>
            </select>
            
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filtrele
            </button>
          </div>
        </div>

        {/* Invoice List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Faturalar ({filteredInvoices.length})</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fatura Bilgileri
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
                    E-Fatura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarihler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.number}</div>
                        <div className="text-sm text-gray-500">{getTypeText(invoice.type)}</div>
                        <div className="text-xs text-gray-400">
                          {invoice.items.length} kalem
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.customer.name}</div>
                        <div className="text-sm text-gray-500">{invoice.customer.code}</div>
                        <div className="text-xs text-gray-400">{invoice.customer.taxNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{formatCurrency(invoice.totalAmount)}</div>
                        <div className="text-xs text-gray-500">
                          Net: {formatCurrency(invoice.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          KDV: {formatCurrency(invoice.taxAmount)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusText(invoice.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {invoice.isEInvoice ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEInvoiceStatusColor(invoice.eInvoiceStatus)}`}>
                          {getEInvoiceStatusText(invoice.eInvoiceStatus)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          E-Fatura Değil
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                          Oluşturma: {new Date(invoice.createdDate).toLocaleDateString('tr-TR')}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                          Vade: {new Date(invoice.dueDate).toLocaleDateString('tr-TR')}
                        </div>
                        {invoice.paymentDate && (
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-4 w-4 text-green-400 mr-1" />
                            Ödeme: {new Date(invoice.paymentDate).toLocaleDateString('tr-TR')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Görüntüle"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Düzenle">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Yazdır">
                          <PrinterIcon className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Kopyala">
                          <DocumentDuplicateIcon className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" title="Sil">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
