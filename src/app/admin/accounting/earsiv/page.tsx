'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminProtection from '../../../../components/AdminProtection';
import { useErrorToast } from '../../../../hooks/useErrorToast';
import { apiWrapper } from '../../../../lib/api-wrapper';

interface EarsivSettings {
  id?: string;
  company_id: string;
  test_mode: boolean;
  gib_username: string;
  gib_password: string;
  gib_endpoint: string;
  certificate_path?: string;
  certificate_password?: string;
  auto_send_enabled: boolean;
  email_notifications: boolean;
}

interface EarsivInvoice {
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
  archived_at?: string;
  error_message?: string;
}

interface EarsivTemplate {
  id: string;
  name: string;
  description: string;
  template_type: string;
  is_active: boolean;
}

interface BatchOperation {
  id: string;
  batch_name: string;
  total_invoices: number;
  processed_invoices: number;
  successful_invoices: number;
  failed_invoices: number;
  status: string;
  started_at?: string;
  completed_at?: string;
}

export default function EarsivPage() {
  const [settings, setSettings] = useState<EarsivSettings>({
    company_id: '550e8400-e29b-41d4-a716-446655440000',
    test_mode: true,
    gib_username: '',
    gib_password: '',
    gib_endpoint: 'https://earsivtest.izibiz.com.tr',
    certificate_path: '',
    certificate_password: '',
    auto_send_enabled: false,
    email_notifications: true
  });

  const [earsivInvoices, setEarsivInvoices] = useState<EarsivInvoice[]>([]);
  const [templates, setTemplates] = useState<EarsivTemplate[]>([]);
  const [batchOperations, setBatchOperations] = useState<BatchOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBatchOperations, setShowBatchOperations] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const { handleAsyncOperation, showSuccess, showError } = useErrorToast();

  const fetchEarsivData = useCallback(async () => {
    const [invoicesResult, settingsResult, templatesResult, batchResult] = await Promise.all([
      handleAsyncOperation(
        () => apiWrapper.get('/api/accounting/earsiv?companyId=550e8400-e29b-41d4-a716-446655440000&action=list'),
        undefined,
        'E-Arşiv faturaları yüklenirken'
      ),
      handleAsyncOperation(
        () => apiWrapper.get('/api/accounting/earsiv?companyId=550e8400-e29b-41d4-a716-446655440000&action=settings'),
        undefined,
        'E-Arşiv ayarları yüklenirken'
      ),
      handleAsyncOperation(
        () => apiWrapper.get('/api/accounting/earsiv?companyId=550e8400-e29b-41d4-a716-446655440000&action=templates'),
        undefined,
        'E-Arşiv şablonları yüklenirken'
      ),
      handleAsyncOperation(
        () => apiWrapper.get('/api/accounting/earsiv?companyId=550e8400-e29b-41d4-a716-446655440000&action=batch_operations'),
        undefined,
        'Toplu işlemler yüklenirken'
      )
    ]);

    if (invoicesResult && (invoicesResult as any).data) {
      setEarsivInvoices((invoicesResult as any).data);
    }
    if (settingsResult && (settingsResult as any).data) {
      setSettings((settingsResult as any).data || settings);
    }
    if (templatesResult && (templatesResult as any).data) {
      setTemplates((templatesResult as any).data);
    }
    if (batchResult && (batchResult as any).data) {
      setBatchOperations((batchResult as any).data);
    }
    setLoading(false);
  }, [handleAsyncOperation, settings]);

  useEffect(() => {
    fetchEarsivData();
  }, [fetchEarsivData]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/earsiv', {
        action: 'save_settings',
        ...settings
      }),
      'E-Arşiv ayarları kaydedildi',
      'E-Arşiv ayarları kaydedilirken'
    );

    if (result && (result as any).data) {
      setSettings((result as any).data);
      setShowSettings(false);
    }
    setSaving(false);
  };

  const handleSendInvoice = async (invoiceId: string) => {
    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/earsiv', {
        action: 'send_invoice',
        invoiceId,
        companyId: settings.company_id
      }),
      'E-Arşiv fatura gönderildi',
      'E-Arşiv fatura gönderilirken'
    );

    if (result && (result as any).data) {
      fetchEarsivData();
    }
  };

  const handleCheckStatus = async (earsivInvoiceId: string) => {
    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/earsiv', {
        action: 'get_invoice_status',
        earsivInvoiceId
      }),
      'Durum güncellendi',
      'Durum kontrol edilirken'
    );

    if (result && (result as any).data) {
      fetchEarsivData();
    }
  };

  const handleDownloadPDF = async (earsivInvoiceId: string) => {
    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/earsiv', {
        action: 'download_pdf',
        earsivInvoiceId
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

  const handleCancelInvoice = async (earsivInvoiceId: string) => {
    const reason = prompt('İptal nedeni:');
    if (!reason) return;

    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/earsiv', {
        action: 'cancel_invoice',
        earsivInvoiceId,
        reason
      }),
      'E-Arşiv fatura iptal edildi',
      'E-Arşiv fatura iptal edilirken'
    );

    if (result && (result as any).data) {
      fetchEarsivData();
    }
  };

  const handleArchiveInvoice = async (earsivInvoiceId: string) => {
    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/earsiv', {
        action: 'archive_invoice',
        earsivInvoiceId
      }),
      'E-Arşiv fatura arşivlendi',
      'E-Arşiv fatura arşivlenirken'
    );

    if (result && (result as any).data) {
      fetchEarsivData();
    }
  };

  const handleBatchSend = async () => {
    if (selectedInvoices.length === 0) {
      showError('Lütfen en az bir fatura seçin');
      return;
    }

    const batchName = prompt('Toplu işlem adı:') || `Toplu İşlem ${new Date().toLocaleString('tr-TR')}`;

    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/earsiv', {
        action: 'batch_send',
        companyId: settings.company_id,
        invoiceIds: selectedInvoices,
        batchName
      }),
      'Toplu E-Arşiv işlemi başlatıldı',
      'Toplu işlem başlatılırken'
    );

    if (result && (result as any).data) {
      setSelectedInvoices([]);
      fetchEarsivData();
    }
  };

  const handleSelectInvoice = (invoiceId: string) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
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
      case 'ARCHIVED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatchStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-100 text-gray-800';
      case 'PROCESSING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">E-Arşiv verileri yükleniyor...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">E-Arşiv Fatura Yönetimi</h1>
                <p className="mt-2 text-gray-600">GİB E-Arşiv entegrasyonu ve yönetimi</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowBatchOperations(!showBatchOperations)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {showBatchOperations ? 'Toplu İşlemleri Gizle' : 'Toplu İşlemler'}
                </button>
                <button
                  onClick={() => setShowTemplates(!showTemplates)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {showTemplates ? 'Şablonları Gizle' : 'Şablonlar'}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {showSettings ? 'Ayarları Gizle' : 'Ayarlar'}
                </button>
                <button
                  onClick={fetchEarsivData}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Yenile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* E-Arşiv Ayarları */}
          {showSettings && (
            <div className="bg-white rounded-lg shadow-sm border mb-8">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">E-Arşiv Ayarları</h2>
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
                        placeholder="https://earsivtest.izibiz.com.tr"
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
                        Otomatik Gönderim
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.auto_send_enabled}
                          onChange={(e) => setSettings(prev => ({ ...prev, auto_send_enabled: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">Faturaları otomatik gönder</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta Bildirimleri
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.email_notifications}
                          onChange={(e) => setSettings(prev => ({ ...prev, email_notifications: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">E-posta bildirimleri gönder</span>
                      </div>
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

          {/* Toplu İşlemler */}
          {showBatchOperations && (
            <div className="bg-white rounded-lg shadow-sm border mb-8">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Toplu İşlemler</h2>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <button
                    onClick={handleBatchSend}
                    disabled={selectedInvoices.length === 0}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Seçili Faturaları Gönder ({selectedInvoices.length})
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toplu İşlem Adı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toplam
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlenen
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Başarılı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Başarısız
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {batchOperations.map((operation) => (
                        <tr key={operation.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {operation.batch_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {operation.total_invoices}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {operation.processed_invoices}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {operation.successful_invoices}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {operation.failed_invoices}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getBatchStatusColor(operation.status)}`}>
                              {operation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {operation.started_at ? new Date(operation.started_at).toLocaleDateString('tr-TR') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* E-Arşiv Faturaları */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">E-Arşiv Faturaları</h2>
              <p className="text-sm text-gray-600">GİB E-Arşiv entegrasyonu</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInvoices(earsivInvoices.map(inv => inv.id));
                          } else {
                            setSelectedInvoices([]);
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
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
                  {earsivInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={() => handleSelectInvoice(invoice.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
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
                            <>
                              <button
                                onClick={() => handleDownloadPDF(invoice.id)}
                                className="text-purple-600 hover:text-purple-900"
                                title="PDF İndir"
                              >
                                <i className="ri-download-line"></i>
                              </button>
                              <button
                                onClick={() => handleArchiveInvoice(invoice.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Arşivle"
                              >
                                <i className="ri-archive-line"></i>
                              </button>
                            </>
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
