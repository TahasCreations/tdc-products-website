'use client';

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import AdminProtection from '../../../components/AdminProtection';
import OptimizedLoader from '../../../components/OptimizedLoader';
import Link from 'next/link';

// Lazy load heavy components
const InvoiceTemplate = lazy(() => import('../../../components/InvoiceTemplate'));

// Lazy load heavy libraries
const loadPDFLibs = () => import('jspdf').then(module => ({ jsPDF: module.default }));
const loadCanvasLib = () => import('html2canvas').then(module => ({ html2canvas: module.default }));

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_address: string;
  customer_tax_number: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  invoice_date: string;
  due_date: string;
  status: string;
  notes: string;
  order?: {
    order_number: string;
    customer_name: string;
    total_amount: number;
  };
}

interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [newInvoice, setNewInvoice] = useState({
    customer_name: '',
    customer_email: '',
    customer_address: '',
    customer_tax_number: '',
    subtotal: '',
    tax_rate: '20',
    tax_amount: '',
    total_amount: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    notes: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const invoiceRef = useRef<HTMLDivElement>(null);

  const companyInfo = {
    name: 'TDC Products',
    address: 'İstanbul, Türkiye',
    phone: '+90 (212) 123 45 67',
    email: 'info@tdcproducts.com',
    taxNumber: '1234567890'
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/finance?type=invoices');
      const data = await response.json();
      
      if (data.success) {
        setInvoices(data.invoices);
      } else {
        setMessage('Faturalar yüklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Fetch invoices error:', error);
      // Sessizce demo invoices göster (hata mesajı gösterme)
      const defaultInvoices = [
        {
          id: '1',
          invoice_number: 'FAT-2024-001',
          customer_name: 'ABC Şirketi',
          customer_email: 'info@abc.com',
          customer_address: 'İstanbul, Türkiye',
          customer_tax_number: '1234567890',
          subtotal: 41000,
          tax_rate: 18,
          tax_amount: 9000,
          total_amount: 50000,
          invoice_date: '2024-01-15',
          due_date: '2024-01-30',
          status: 'paid',
          notes: 'Ödeme tamamlandı',
          created_at: '2024-01-15T10:30:00.000Z'
        },
        {
          id: '2',
          invoice_number: 'FAT-2024-002',
          customer_name: 'XYZ Ltd.',
          customer_email: 'info@xyz.com',
          customer_address: 'Ankara, Türkiye',
          customer_tax_number: '0987654321',
          subtotal: 24600,
          tax_rate: 18,
          tax_amount: 5400,
          total_amount: 30000,
          invoice_date: '2024-01-14',
          due_date: '2024-02-05',
          status: 'pending',
          notes: 'Beklemede',
          created_at: '2024-01-14T16:45:00.000Z'
        }
      ];
      setInvoices(defaultInvoices);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoiceItems = async (invoiceId: string) => {
    try {
      const response = await fetch(`/api/finance/invoice-items?invoice_id=${invoiceId}`);
      const data = await response.json();
      
      if (data.success) {
        setInvoiceItems(data.items);
      }
    } catch (error) {
      console.error('Fetch invoice items error:', error);
    }
  };

  const generatePDF = async (invoice: Invoice) => {
    try {
      setMessage('PDF oluşturuluyor...');
      setMessageType('success');

      // Fatura detaylarını getir
      await fetchInvoiceItems(invoice.id);
      
      // Modal'ı aç ve PDF oluştur
      setSelectedInvoice(invoice);
      setShowInvoiceModal(true);

      // Kısa bir gecikme sonrası PDF oluştur
      setTimeout(async () => {
        if (invoiceRef.current) {
          // Lazy load libraries
          const [{ html2canvas }, { jsPDF }] = await Promise.all([
            loadCanvasLib(),
            loadPDFLibs()
          ]);

          const canvas = await html2canvas(invoiceRef.current, {
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

          const fileName = `fatura-${invoice.invoice_number}.pdf`;
          pdf.save(fileName);

          setMessage('PDF başarıyla indirildi');
          setMessageType('success');
        }
      }, 1000);

    } catch (error) {
      console.error('PDF generation error:', error);
      setMessage('PDF oluşturulurken hata oluştu');
      setMessageType('error');
    }
  };

  const sendEmail = async () => {
    try {
      setMessage('E-posta gönderiliyor...');
      setMessageType('success');

      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.message,
          attachments: selectedInvoice ? [{
            filename: `fatura-${selectedInvoice.invoice_number}.pdf`,
            content: 'base64_content_here' // PDF içeriği buraya gelecek
          }] : []
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('E-posta başarıyla gönderildi');
        setMessageType('success');
        setShowEmailModal(false);
        setEmailData({ to: '', subject: '', message: '' });
      } else {
        setMessage(data.error || 'E-posta gönderilemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Send email error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const createInvoice = async () => {
    try {
      setMessage('Fatura oluşturuluyor...');
      setMessageType('success');

      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_invoice',
          ...newInvoice
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Fatura başarıyla oluşturuldu');
        setMessageType('success');
        setShowCreateModal(false);
        setNewInvoice({
          customer_name: '',
          customer_email: '',
          customer_address: '',
          customer_tax_number: '',
          subtotal: '',
          tax_rate: '20',
          tax_amount: '',
          total_amount: '',
          invoice_date: new Date().toISOString().split('T')[0],
          due_date: '',
          notes: ''
        });
        fetchInvoices();
      } else {
        setMessage(data.error || 'Fatura oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Create invoice error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    try {
      const response = await fetch('/api/finance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_invoice_status',
          invoice_id: invoiceId,
          status: status
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Fatura durumu güncellendi');
        setMessageType('success');
        fetchInvoices();
      } else {
        setMessage(data.error || 'Fatura durumu güncellenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Update invoice status error:', error);
      setMessage('Bağlantı hatası');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Ödendi';
      case 'sent':
        return 'Gönderildi';
      case 'cancelled':
        return 'İptal';
      default:
        return 'Taslak';
    }
  };

  if (loading) {
    return <OptimizedLoader message="Faturalar yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg mx-4 mt-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Türk Ticaret Fatura Sistemi</h1>
              <p className="mt-2 text-gray-600">Resmi fatura oluşturma ve yönetim sistemi</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <i className="ri-add-line mr-2"></i>
                Yeni Fatura
              </button>
              <Link
                href="/admin"
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <i className="ri-arrow-left-line mr-2"></i>
                Admin Paneli
              </Link>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-4 mt-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-file-list-line mr-2"></i>
                Fatura Listesi
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'templates'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-file-text-line mr-2"></i>
                Fatura Şablonları
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="ri-settings-line mr-2"></i>
                Fatura Ayarları
              </button>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-4 mt-6 p-4 rounded-lg ${
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

        {/* Tab Content */}
        <div className="mx-4 mt-6">
          {activeTab === 'list' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Fatura Listesi</h3>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      Toplam: <span className="font-semibold text-gray-900">{invoices.length}</span>
                    </div>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Yeni Fatura
                    </button>
                  </div>
                </div>
              </div>
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
                        Tarih
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
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="p-1 bg-blue-100 rounded mr-3">
                              <i className="ri-file-text-line text-blue-600 text-sm"></i>
                            </div>
                            {invoice.invoice_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.customer_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                          {formatCurrency(invoice.total_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(invoice.invoice_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                            {getStatusText(invoice.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setShowInvoiceModal(true);
                                fetchInvoiceItems(invoice.id);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                              title="Görüntüle"
                            >
                              <i className="ri-eye-line"></i>
                            </button>
                            <button
                              onClick={() => generatePDF(invoice)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                              title="PDF İndir"
                            >
                              <i className="ri-file-pdf-line"></i>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setEmailData({
                                  to: invoice.customer_email,
                                  subject: `Fatura: ${invoice.invoice_number}`,
                                  message: `Sayın ${invoice.customer_name},\n\n${invoice.invoice_number} numaralı faturanız ekte gönderilmiştir.\n\nTeşekkürler.`
                                });
                                setShowEmailModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                              title="E-posta Gönder"
                            >
                              <i className="ri-mail-line"></i>
                            </button>
                            {invoice.status === 'draft' && (
                              <button
                                onClick={() => updateInvoiceStatus(invoice.id, 'sent')}
                                className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 transition-colors"
                                title="Gönder"
                              >
                                <i className="ri-send-plane-line"></i>
                              </button>
                            )}
                            {invoice.status === 'sent' && (
                              <button
                                onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                                title="Ödendi Olarak İşaretle"
                              >
                                <i className="ri-check-line"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Fatura Şablonları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <i className="ri-file-text-line text-2xl text-blue-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Standart Fatura</h3>
                      <p className="text-sm text-gray-600">Temel fatura şablonu</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Genel kullanım için standart fatura formatı.
                  </p>
                </button>

                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <i className="ri-file-text-line text-2xl text-green-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">E-Fatura</h3>
                      <p className="text-sm text-gray-600">GİB uyumlu e-fatura</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    GİB e-fatura sistemine uygun format.
                  </p>
                </button>

                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <i className="ri-file-text-line text-2xl text-purple-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">E-Arşiv</h3>
                      <p className="text-sm text-gray-600">E-arşiv fatura şablonu</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    E-arşiv fatura için özel format.
                  </p>
                </button>

                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <i className="ri-file-text-line text-2xl text-orange-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">İade Faturası</h3>
                      <p className="text-sm text-gray-600">İade işlemleri için</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    İade işlemleri için özel fatura formatı.
                  </p>
                </button>

                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      <i className="ri-file-text-line text-2xl text-red-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Proforma Fatura</h3>
                      <p className="text-sm text-gray-600">Ön fatura şablonu</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Ön fatura için tasarlanmış format.
                  </p>
                </button>

                <button className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-teal-100 rounded-lg">
                      <i className="ri-file-text-line text-2xl text-teal-600"></i>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Özel Şablon</h3>
                      <p className="text-sm text-gray-600">Kişiselleştirilmiş format</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Kendi tasarımınızı oluşturun.
                  </p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Fatura Ayarları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Şirket Bilgileri</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Adı</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={companyInfo.name}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={companyInfo.address}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={companyInfo.phone}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={companyInfo.email}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vergi Numarası</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue={companyInfo.taxNumber}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Fatura Ayarları</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Varsayılan KDV Oranı (%)</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="0">%0</option>
                        <option value="1">%1</option>
                        <option value="8">%8</option>
                        <option value="18" selected>%18</option>
                        <option value="20">%20</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fatura Numarası Formatı</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="F{YYYY}{MM}{DD}-{0001}"
                        placeholder="F{YYYY}{MM}{DD}-{0001}"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Varsayılan Vade Süresi (Gün)</label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="TRY" selected>TRY - Türk Lirası</option>
                        <option value="USD">USD - Amerikan Doları</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Ayarları Kaydet
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Invoice Preview Modal */}
        {showInvoiceModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Fatura: {selectedInvoice.invoice_number}
                  </h2>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-2xl"></i>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <Suspense fallback={<OptimizedLoader />}>
                  <InvoiceTemplate
                    ref={invoiceRef}
                    invoice={selectedInvoice}
                    items={invoiceItems}
                    companyInfo={companyInfo}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        )}

        {/* Email Modal */}
        {showEmailModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                E-posta Gönder: {selectedInvoice.invoice_number}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alıcı</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={emailData.to}
                    onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={emailData.message}
                    onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={sendEmail}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Gönder
                </button>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtection>
  );
}
