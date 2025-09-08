'use client';

import { useState, useEffect, useRef } from 'react';
import AdminProtection from '../../../components/AdminProtection';
import InvoiceTemplate from '../../../components/InvoiceTemplate';
import { PageLoader } from '../../../components/LoadingSpinner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
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
      setMessage('Bağlantı hatası');
      setMessageType('error');
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
    return <PageLoader text="Faturalar yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fatura Yönetimi</h1>
            <p className="text-gray-600">Faturaları görüntüleyin, PDF oluşturun ve e-posta gönderin</p>
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

        {/* Invoices Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.customer_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowInvoiceModal(true);
                          fetchInvoiceItems(invoice.id);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Görüntüle
                      </button>
                      <button
                        onClick={() => generatePDF(invoice)}
                        className="text-red-600 hover:text-red-900"
                      >
                        PDF
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
                        className="text-green-600 hover:text-green-900"
                      >
                        E-posta
                      </button>
                      {invoice.status === 'draft' && (
                        <button
                          onClick={() => updateInvoiceStatus(invoice.id, 'sent')}
                          className="text-yellow-600 hover:text-yellow-900"
                        >
                          Gönder
                        </button>
                      )}
                      {invoice.status === 'sent' && (
                        <button
                          onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Ödendi
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                <InvoiceTemplate
                  ref={invoiceRef}
                  invoice={selectedInvoice}
                  items={invoiceItems}
                  companyInfo={companyInfo}
                />
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
