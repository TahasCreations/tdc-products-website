'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiWrapper } from '@/lib/api-wrapper';

interface EirsaliyeSettings {
  id: string;
  company_name: string;
  tax_number: string;
  tax_office: string;
  address: string;
  city: string;
  postal_code: string;
  phone?: string;
  email?: string;
  website?: string;
  gib_username: string;
  test_mode: boolean;
}

interface EirsaliyeIrsaliye {
  id: string;
  irsaliye_number: string;
  irsaliye_date: string;
  irsaliye_type: string;
  status: string;
  gib_status?: string;
  sender_title: string;
  receiver_title: string;
  total_amount: number;
  currency_code: string;
  net_amount: number;
  tax_amount: number;
  sent_at?: string;
  accepted_at?: string;
  rejected_at?: string;
  eirsaliye_items?: EirsaliyeItem[];
}

interface EirsaliyeItem {
  id: string;
  line_number: number;
  product_name: string;
  product_code?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  tax_rate: number;
  tax_amount: number;
  net_amount: number;
}

interface EirsaliyeTemplate {
  id: string;
  template_name: string;
  template_type: string;
  template_data: any;
  is_default: boolean;
  is_active: boolean;
}

export default function EirsaliyePage() {
  const [activeTab, setActiveTab] = useState('irsaliyes');
  const [settings, setSettings] = useState<EirsaliyeSettings | null>(null);
  const [irsaliyes, setIrsaliyes] = useState<EirsaliyeIrsaliye[]>([]);
  const [templates, setTemplates] = useState<EirsaliyeTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  // Form states
  const [showSettingsForm, setShowSettingsForm] = useState(false);
  const [showIrsaliyeForm, setShowIrsaliyeForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingIrsaliye, setEditingIrsaliye] = useState<EirsaliyeIrsaliye | null>(null);

  const [newSettings, setNewSettings] = useState({
    company_name: '',
    tax_number: '',
    tax_office: '',
    address: '',
    city: '',
    postal_code: '',
    phone: '',
    email: '',
    website: '',
    gib_username: '',
    gib_password: '',
    test_mode: true
  });

  const [newIrsaliye, setNewIrsaliye] = useState({
    irsaliye_number: '',
    irsaliye_date: '',
    irsaliye_type: 'satis',
    sender_vkn: '',
    sender_title: '',
    receiver_vkn: '',
    receiver_title: '',
    receiver_address: '',
    receiver_city: '',
    receiver_postal_code: '',
    receiver_phone: '',
    receiver_email: '',
    total_amount: '',
    currency_code: 'TRY',
    tax_amount: '',
    net_amount: '',
    notes: '',
    items: [] as any[]
  });

  const [newTemplate, setNewTemplate] = useState({
    template_name: '',
    template_type: 'default',
    template_data: {},
    is_default: false
  });

  const fetchSettings = useCallback(async () => {
    try {
      const result = await apiWrapper.get('/api/accounting/eirsaliye?action=settings');
      if (result && (result as any).data) {
        setSettings((result as any).data);
        setNewSettings({
          company_name: (result as any).data.company_name || '',
          tax_number: (result as any).data.tax_number || '',
          tax_office: (result as any).data.tax_office || '',
          address: (result as any).data.address || '',
          city: (result as any).data.city || '',
          postal_code: (result as any).data.postal_code || '',
          phone: (result as any).data.phone || '',
          email: (result as any).data.email || '',
          website: (result as any).data.website || '',
          gib_username: (result as any).data.gib_username || '',
          gib_password: '',
          test_mode: (result as any).data.test_mode || true
        });
      }
    } catch (error) {
      console.error('Ayarlar yüklenemedi:', error);
    }
  }, []);

  const fetchIrsaliyes = useCallback(async () => {
    try {
      const result = await apiWrapper.get('/api/accounting/eirsaliye?action=irsaliyes');
      if (result && (result as any).data) {
        setIrsaliyes((result as any).data);
      }
    } catch (error) {
      console.error('İrsaliye listesi yüklenemedi:', error);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const result = await apiWrapper.get('/api/accounting/eirsaliye?action=templates');
      if (result && (result as any).data) {
        setTemplates((result as any).data);
      }
    } catch (error) {
      console.error('Şablon listesi yüklenemedi:', error);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSettings(),
        fetchIrsaliyes(),
        fetchTemplates()
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchSettings, fetchIrsaliyes, fetchTemplates]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    try {
      const result = await apiWrapper.post('/api/accounting/eirsaliye', {
        action: 'save_settings',
        ...newSettings
      });

      if (result && (result as any).data) {
        await fetchSettings();
        setShowSettingsForm(false);
      }
    } catch (error) {
      console.error('Ayarlar kaydedilemedi:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleCreateIrsaliye = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    try {
      const result = await apiWrapper.post('/api/accounting/eirsaliye', {
        action: 'create_irsaliye',
        ...newIrsaliye,
        total_amount: parseFloat(newIrsaliye.total_amount),
        tax_amount: parseFloat(newIrsaliye.tax_amount),
        net_amount: parseFloat(newIrsaliye.net_amount)
      });

      if (result && (result as any).data) {
        await fetchIrsaliyes();
        setShowIrsaliyeForm(false);
        setNewIrsaliye({
          irsaliye_number: '',
          irsaliye_date: '',
          irsaliye_type: 'satis',
          sender_vkn: '',
          sender_title: '',
          receiver_vkn: '',
          receiver_title: '',
          receiver_address: '',
          receiver_city: '',
          receiver_postal_code: '',
          receiver_phone: '',
          receiver_email: '',
          total_amount: '',
          currency_code: 'TRY',
          tax_amount: '',
          net_amount: '',
          notes: '',
          items: []
        });
      }
    } catch (error) {
      console.error('İrsaliye oluşturulamadı:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiLoading(true);

    try {
      const result = await apiWrapper.post('/api/accounting/eirsaliye', {
        action: 'create_template',
        ...newTemplate
      });

      if (result && (result as any).data) {
        await fetchTemplates();
        setShowTemplateForm(false);
        setNewTemplate({
          template_name: '',
          template_type: 'default',
          template_data: {},
          is_default: false
        });
      }
    } catch (error) {
      console.error('Şablon oluşturulamadı:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleSendIrsaliye = async (irsaliyeId: string) => {
    setApiLoading(true);
    try {
      const result = await apiWrapper.post('/api/accounting/eirsaliye', {
        action: 'send_irsaliye',
        irsaliye_id: irsaliyeId
      });

      if (result && (result as any).data) {
        await fetchIrsaliyes();
      }
    } catch (error) {
      console.error('İrsaliye gönderilemedi:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const handleCheckStatus = async (irsaliyeId: string) => {
    setApiLoading(true);
    try {
      const result = await apiWrapper.post('/api/accounting/eirsaliye', {
        action: 'check_status',
        irsaliye_id: irsaliyeId
      });

      if (result && (result as any).data) {
        await fetchIrsaliyes();
      }
    } catch (error) {
      console.error('Durum kontrol edilemedi:', error);
    } finally {
      setApiLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'TRY') => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Taslak';
      case 'sent': return 'Gönderildi';
      case 'accepted': return 'Kabul Edildi';
      case 'rejected': return 'Reddedildi';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">E-İrsaliye Sistemi</h1>
          <p className="text-gray-600">GİB E-İrsaliye entegrasyonu ve irsaliye yönetimi</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowIrsaliyeForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            İrsaliye Oluştur
          </button>
          <button
            onClick={() => setShowSettingsForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <i className="ri-settings-line"></i>
            Ayarlar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'irsaliyes', label: 'İrsaliyeler', icon: 'ri-file-list-line' },
            { id: 'templates', label: 'Şablonlar', icon: 'ri-file-copy-line' },
            { id: 'settings', label: 'GİB Ayarları', icon: 'ri-settings-line' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* İrsaliyeler Tab */}
      {activeTab === 'irsaliyes' && (
        <div className="space-y-6">
          {/* İrsaliye Formu */}
          {showIrsaliyeForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingIrsaliye ? 'İrsaliye Düzenle' : 'Yeni İrsaliye'}
              </h3>
              <form onSubmit={handleCreateIrsaliye} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İrsaliye Numarası
                    </label>
                    <input
                      type="text"
                      value={newIrsaliye.irsaliye_number}
                      onChange={(e) => setNewIrsaliye({ ...newIrsaliye, irsaliye_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İrsaliye Tarihi
                    </label>
                    <input
                      type="date"
                      value={newIrsaliye.irsaliye_date}
                      onChange={(e) => setNewIrsaliye({ ...newIrsaliye, irsaliye_date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gönderen Unvan
                    </label>
                    <input
                      type="text"
                      value={newIrsaliye.sender_title}
                      onChange={(e) => setNewIrsaliye({ ...newIrsaliye, sender_title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gönderen VKN
                    </label>
                    <input
                      type="text"
                      value={newIrsaliye.sender_vkn}
                      onChange={(e) => setNewIrsaliye({ ...newIrsaliye, sender_vkn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alıcı Unvan
                    </label>
                    <input
                      type="text"
                      value={newIrsaliye.receiver_title}
                      onChange={(e) => setNewIrsaliye({ ...newIrsaliye, receiver_title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alıcı VKN
                    </label>
                    <input
                      type="text"
                      value={newIrsaliye.receiver_vkn}
                      onChange={(e) => setNewIrsaliye({ ...newIrsaliye, receiver_vkn: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Toplam Tutar
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newIrsaliye.total_amount}
                      onChange={(e) => setNewIrsaliye({ ...newIrsaliye, total_amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vergi Tutarı
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newIrsaliye.tax_amount}
                      onChange={(e) => setNewIrsaliye({ ...newIrsaliye, tax_amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Net Tutar
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newIrsaliye.net_amount}
                      onChange={(e) => setNewIrsaliye({ ...newIrsaliye, net_amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="ri-save-line"></i>
                    {apiLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowIrsaliyeForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* İrsaliye Listesi */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">E-İrsaliyeler</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İrsaliye
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alıcı
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
                  {irsaliyes.map((irsaliye) => (
                    <tr key={irsaliye.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {irsaliye.irsaliye_number}
                        </div>
                        <div className="text-sm text-gray-500">
                          {irsaliye.irsaliye_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(irsaliye.irsaliye_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {irsaliye.receiver_title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(irsaliye.total_amount, irsaliye.currency_code)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(irsaliye.status)}`}>
                          {getStatusText(irsaliye.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {irsaliye.status === 'draft' && (
                            <button
                              onClick={() => handleSendIrsaliye(irsaliye.id)}
                              disabled={apiLoading}
                              className="text-blue-600 hover:text-blue-900 disabled:text-gray-400"
                              title="Gönder"
                            >
                              <i className="ri-send-plane-line"></i>
                            </button>
                          )}
                          {irsaliye.status === 'sent' && (
                            <button
                              onClick={() => handleCheckStatus(irsaliye.id)}
                              disabled={apiLoading}
                              className="text-green-600 hover:text-green-900 disabled:text-gray-400"
                              title="Durum Kontrol"
                            >
                              <i className="ri-refresh-line"></i>
                            </button>
                          )}
                          <button
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Düzenle"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Sil"
                          >
                            <i className="ri-delete-bin-line"></i>
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
      )}

      {/* Şablonlar Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* Şablon Formu */}
          {showTemplateForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Şablon</h3>
              <form onSubmit={handleCreateTemplate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şablon Adı
                    </label>
                    <input
                      type="text"
                      value={newTemplate.template_name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, template_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şablon Tipi
                    </label>
                    <select
                      value={newTemplate.template_type}
                      onChange={(e) => setNewTemplate({ ...newTemplate, template_type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="default">Varsayılan</option>
                      <option value="customer">Müşteri</option>
                      <option value="product">Ürün</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newTemplate.is_default}
                      onChange={(e) => setNewTemplate({ ...newTemplate, is_default: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Varsayılan Şablon</span>
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="ri-save-line"></i>
                    {apiLoading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTemplateForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">İrsaliye Şablonları</h3>
            <button
              onClick={() => setShowTemplateForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <i className="ri-add-line"></i>
              Şablon Ekle
            </button>
          </div>

          {/* Şablon Listesi */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Şablon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
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
                  {templates.map((template) => (
                    <tr key={template.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <i className="ri-file-copy-line text-green-600"></i>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {template.template_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {template.template_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            template.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {template.is_active ? 'Aktif' : 'Pasif'}
                          </span>
                          {template.is_default && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Varsayılan
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Düzenle"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Sil"
                          >
                            <i className="ri-delete-bin-line"></i>
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
      )}

      {/* Ayarlar Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Ayarlar Formu */}
          {showSettingsForm && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">GİB E-İrsaliye Ayarları</h3>
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şirket Adı
                    </label>
                    <input
                      type="text"
                      value={newSettings.company_name}
                      onChange={(e) => setNewSettings({ ...newSettings, company_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vergi Numarası
                    </label>
                    <input
                      type="text"
                      value={newSettings.tax_number}
                      onChange={(e) => setNewSettings({ ...newSettings, tax_number: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vergi Dairesi
                    </label>
                    <input
                      type="text"
                      value={newSettings.tax_office}
                      onChange={(e) => setNewSettings({ ...newSettings, tax_office: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Şehir
                    </label>
                    <input
                      type="text"
                      value={newSettings.city}
                      onChange={(e) => setNewSettings({ ...newSettings, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adres
                  </label>
                  <textarea
                    value={newSettings.address}
                    onChange={(e) => setNewSettings({ ...newSettings, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GİB Kullanıcı Adı
                    </label>
                    <input
                      type="text"
                      value={newSettings.gib_username}
                      onChange={(e) => setNewSettings({ ...newSettings, gib_username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GİB Şifresi
                    </label>
                    <input
                      type="password"
                      value={newSettings.gib_password}
                      onChange={(e) => setNewSettings({ ...newSettings, gib_password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Şifre değiştirmek için yeni şifre girin"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newSettings.test_mode}
                      onChange={(e) => setNewSettings({ ...newSettings, test_mode: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Test Modu</span>
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={apiLoading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="ri-save-line"></i>
                    {apiLoading ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettingsForm(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Mevcut Ayarlar */}
          {settings && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Mevcut Ayarlar</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Şirket Bilgileri</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Şirket:</span> {settings.company_name}</p>
                      <p><span className="font-medium">Vergi No:</span> {settings.tax_number}</p>
                      <p><span className="font-medium">Vergi Dairesi:</span> {settings.tax_office}</p>
                      <p><span className="font-medium">Şehir:</span> {settings.city}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">GİB Bilgileri</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Kullanıcı:</span> {settings.gib_username}</p>
                      <p><span className="font-medium">Test Modu:</span> {settings.test_mode ? 'Açık' : 'Kapalı'}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => setShowSettingsForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <i className="ri-edit-line"></i>
                    Ayarları Düzenle
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
