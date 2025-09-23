'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminProtection from '../../../../components/AdminProtection';
import { useErrorToast } from '../../../../hooks/useErrorToast';
import { apiWrapper } from '../../../../lib/api-wrapper';

interface EfaturaSettings {
  id?: string;
  company_id: string;
  test_mode: boolean;
  gib_username: string;
  gib_password: string;
  gib_endpoint: string;
  certificate_path?: string;
  certificate_password?: string;
}

interface EfaturaInvoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  status: {
    name: string;
    description: string;
  };
  invoices: {
    invoice_number: string;
    total_amount: number;
    contact_name: string;
  };
  sent_at?: string;
  delivered_at?: string;
  error_message?: string;
}

export default function EfaturaPage() {
  const [settings, setSettings] = useState<EfaturaSettings>({
    company_id: '550e8400-e29b-41d4-a716-446655440000',
    test_mode: true,
    gib_username: '',
    gib_password: '',
    gib_endpoint: 'https://efaturatest.izibiz.com.tr',
    certificate_path: '',
    certificate_password: ''
  });

  const [efaturaInvoices, setEfaturaInvoices] = useState<EfaturaInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const { handleAsyncOperation, showSuccess, showError } = useErrorToast();

  const fetchEfaturaData = useCallback(async () => {
    const result = await handleAsyncOperation(
      () => apiWrapper.get('/api/accounting/efatura?companyId=550e8400-e29b-41d4-a716-446655440000'),
      undefined,
      'E-Fatura verileri yüklenirken'
    );

    if (result && (result as any).data) {
      setSettings((result as any).data.settings || settings);
      setEfaturaInvoices((result as any).data.invoices || []);
    }
    setLoading(false);
  }, [handleAsyncOperation, settings]);

  useEffect(() => {
    fetchEfaturaData();
  }, [fetchEfaturaData]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/efatura', {
        action: 'save_settings',
        ...settings
      }),
      'E-Fatura ayarları kaydedildi',
      'E-Fatura ayarları kaydedilirken'
    );

    if (result && (result as any).data) {
      setSettings((result as any).data);
      setShowSettings(false);
    }
    setSaving(false);
  };

  const handleSendInvoice = async (invoiceId: string) => {
    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/efatura', {
        action: 'send_invoice',
        invoiceId,
        companyId: settings.company_id
      }),
      'E-Fatura gönderildi',
      'E-Fatura gönderilirken'
    );

    if (result && (result as any).data) {
      fetchEfaturaData();
    }
  };

  const handleCheckStatus = async (efaturaInvoiceId: string) => {
    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/efatura', {
        action: 'get_invoice_status',
        efaturaInvoiceId
      }),
      'Durum güncellendi',
      'Durum kontrol edilirken'
    );

    if (result && (result as any).data) {
      fetchEfaturaData();
    }
  };

  const handleDownloadPDF = async (efaturaInvoiceId: string) => {
    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/efatura', {
        action: 'download_pdf',
        efaturaInvoiceId
      }),
      'PDF indiriliyor',
      'PDF indirilirken'
    );

    if (result && (result as any).data) {
      // PDF'i indir
      const blob = new Blob([(result as any).data.pdfContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (result as any).data.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const handleCancelInvoice = async (efaturaInvoiceId: string) => {
    const reason = prompt('İptal nedeni:');
    if (!reason) return;

    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/efatura', {
        action: 'cancel_invoice',
        efaturaInvoiceId,
        reason
      }),
      'E-Fatura iptal edildi',
      'E-Fatura iptal edilirken'
    );

    if (result && (result as any).data) {
      fetchEfaturaData();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-orange-100 text-orange-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'ERROR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">E-Fatura verileri yükleniyor...</p>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">E-Fatura Yönetimi</h1>
                <p className="mt-2 text-gray-600">GİB E-Fatura entegrasyonu ve yönetimi</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {showSettings ? 'Ayarları Gizle' : 'Ayarlar'}
                </button>
                <button
                  onClick={fetchEfaturaData}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Yenile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* E-Fatura Ayarları */}
          {showSettings && (
            <div className="bg-white rounded-lg shadow-sm border mb-8">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">E-Fatura Ayarları</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test Modu
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.test_mode}
                          onChange={(e) => setSettings(prev => ({ ...prev, test_mode: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Test ortamını kullan</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GİB Endpoint
                      </label>
                      <input
                        type="url"
                        value={settings.gib_endpoint}
                        onChange={(e) => setSettings(prev => ({ ...prev, gib_endpoint: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://efaturatest.izibiz.com.tr"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GİB Kullanıcı Adı
                      </label>
                      <input
                        type="text"
                        value={settings.gib_username}
                        onChange={(e) => setSettings(prev => ({ ...prev, gib_username: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="GİB kullanıcı adınız"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GİB Şifre
                      </label>
                      <input
                        type="password"
                        value={settings.gib_password}
                        onChange={(e) => setSettings(prev => ({ ...prev, gib_password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="GİB şifreniz"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sertifika Yolu
                      </label>
                      <input
                        type="text"
                        value={settings.certificate_path || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, certificate_path: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="/path/to/certificate.p12"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sertifika Şifresi
                      </label>
                      <input
                        type="password"
                        value={settings.certificate_password || ''}
                        onChange={(e) => setSettings(prev => ({ ...prev, certificate_password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Sertifika şifresi"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* E-Fatura Faturaları */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">E-Fatura Faturaları</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fatura No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
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
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {efaturaInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoice_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(invoice.invoice_date).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.invoices?.contact_name || 'Bilinmiyor'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.invoices?.total_amount?.toLocaleString('tr-TR')} TL
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status.name)}`}>
                          {invoice.status.description}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {invoice.status.name === 'DRAFT' && (
                            <button
                              onClick={() => handleSendInvoice(invoice.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Gönder"
                            >
                              <i className="ri-send-plane-line"></i>
                            </button>
                          )}
                          <button
                            onClick={() => handleCheckStatus(invoice.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Durum Kontrol Et"
                          >
                            <i className="ri-refresh-line"></i>
                          </button>
                          {invoice.status.name === 'DELIVERED' && (
                            <button
                              onClick={() => handleDownloadPDF(invoice.id)}
                              className="text-purple-600 hover:text-purple-900"
                              title="PDF İndir"
                            >
                              <i className="ri-download-line"></i>
                            </button>
                          )}
                          {['SENT', 'DELIVERED'].includes(invoice.status.name) && (
                            <button
                              onClick={() => handleCancelInvoice(invoice.id)}
                              className="text-red-600 hover:text-red-900"
                              title="İptal Et"
                            >
                              <i className="ri-close-line"></i>
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
        </div>
      </div>
    </AdminProtection>
  );
}
