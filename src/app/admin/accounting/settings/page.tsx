'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminProtection from '../../../../components/AdminProtection';

interface TaxConfig {
  id: string;
  name: string;
  rate: number;
  type: 'KDV' | 'STOPAJ' | 'OTHER';
  is_active: boolean;
  created_at: string;
}

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  rate: number;
  is_base: boolean;
  is_active: boolean;
}

interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
}

interface EInvoiceConfig {
  id: string;
  company_name: string;
  tax_number: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
}

export default function SettingsPage() {
  const [taxConfigs, setTaxConfigs] = useState<TaxConfig[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);
  const [eInvoiceConfig, setEInvoiceConfig] = useState<EInvoiceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'tax' | 'currency' | 'system' | 'einvoice' | 'users'>('tax');
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [showCurrencyForm, setShowCurrencyForm] = useState(false);
  const [showSystemForm, setShowSystemForm] = useState(false);
  const [showEInvoiceForm, setShowEInvoiceForm] = useState(false);

  // Yeni vergi ayarı formu state'leri
  const [newTaxConfig, setNewTaxConfig] = useState({
    name: '',
    rate: 0,
    type: 'KDV' as 'KDV' | 'STOPAJ' | 'OTHER',
    is_active: true
  });

  // Yeni para birimi formu state'leri
  const [newCurrency, setNewCurrency] = useState({
    code: '',
    name: '',
    symbol: '',
    rate: 1,
    is_base: false,
    is_active: true
  });

  // Sistem ayarı formu state'leri
  const [newSystemSetting, setNewSystemSetting] = useState({
    key: '',
    value: '',
    description: '',
    category: 'GENERAL'
  });

  // E-fatura ayarları formu state'leri
  const [newEInvoiceConfig, setNewEInvoiceConfig] = useState({
    company_name: '',
    tax_number: '',
    address: '',
    phone: '',
    email: '',
    is_active: true
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchTaxConfigs(),
        fetchCurrencies(),
        fetchSystemSettings(),
        fetchEInvoiceConfig()
      ]);
    } catch (error) {
      console.error('Data fetch error:', error);
      setError('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchTaxConfigs = async () => {
    try {
      const response = await fetch('/api/accounting/tax-configs');
      if (!response.ok) throw new Error('Vergi ayarları alınamadı');
      const data = await response.json();
      setTaxConfigs(data);
    } catch (error) {
      console.error('Tax configs fetch error:', error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await fetch('/api/accounting/currencies');
      if (!response.ok) throw new Error('Para birimleri alınamadı');
      const data = await response.json();
      setCurrencies(data);
    } catch (error) {
      console.error('Currencies fetch error:', error);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const response = await fetch('/api/accounting/system-settings');
      if (!response.ok) throw new Error('Sistem ayarları alınamadı');
      const data = await response.json();
      setSystemSettings(data);
    } catch (error) {
      console.error('System settings fetch error:', error);
    }
  };

  const fetchEInvoiceConfig = async () => {
    try {
      const response = await fetch('/api/accounting/einvoice-config');
      if (!response.ok) throw new Error('E-fatura ayarları alınamadı');
      const data = await response.json();
      setEInvoiceConfig(data);
    } catch (error) {
      console.error('E-invoice config fetch error:', error);
    }
  };

  const handleAddTaxConfig = async () => {
    try {
      const response = await fetch('/api/accounting/tax-configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaxConfig),
      });

      if (!response.ok) throw new Error('Vergi ayarı eklenemedi');

      await fetchTaxConfigs();
      setShowTaxForm(false);
      setNewTaxConfig({
        name: '',
        rate: 0,
        type: 'KDV',
        is_active: true
      });
      setError('');
    } catch (error) {
      console.error('Add tax config error:', error);
      setError('Vergi ayarı eklenirken hata oluştu');
    }
  };

  const handleAddCurrency = async () => {
    try {
      const response = await fetch('/api/accounting/currencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCurrency),
      });

      if (!response.ok) throw new Error('Para birimi eklenemedi');

      await fetchCurrencies();
      setShowCurrencyForm(false);
      setNewCurrency({
        code: '',
        name: '',
        symbol: '',
        rate: 1,
        is_base: false,
        is_active: true
      });
      setError('');
    } catch (error) {
      console.error('Add currency error:', error);
      setError('Para birimi eklenirken hata oluştu');
    }
  };

  const handleAddSystemSetting = async () => {
    try {
      const response = await fetch('/api/accounting/system-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSystemSetting),
      });

      if (!response.ok) throw new Error('Sistem ayarı eklenemedi');

      await fetchSystemSettings();
      setShowSystemForm(false);
      setNewSystemSetting({
        key: '',
        value: '',
        description: '',
        category: 'GENERAL'
      });
      setError('');
    } catch (error) {
      console.error('Add system setting error:', error);
      setError('Sistem ayarı eklenirken hata oluştu');
    }
  };

  const handleSaveEInvoiceConfig = async () => {
    try {
      const response = await fetch('/api/accounting/einvoice-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEInvoiceConfig),
      });

      if (!response.ok) throw new Error('E-fatura ayarları kaydedilemedi');

      await fetchEInvoiceConfig();
      setShowEInvoiceForm(false);
      setError('');
    } catch (error) {
      console.error('Save e-invoice config error:', error);
      setError('E-fatura ayarları kaydedilirken hata oluştu');
    }
  };

  const handleDeleteTaxConfig = async (id: string) => {
    if (!confirm('Bu vergi ayarını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/accounting/tax-configs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Vergi ayarı silinemedi');

      await fetchTaxConfigs();
    } catch (error) {
      console.error('Delete tax config error:', error);
      setError('Vergi ayarı silinirken hata oluştu');
    }
  };

  const handleDeleteCurrency = async (id: string) => {
    if (!confirm('Bu para birimini silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/accounting/currencies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Para birimi silinemedi');

      await fetchCurrencies();
    } catch (error) {
      console.error('Delete currency error:', error);
      setError('Para birimi silinirken hata oluştu');
    }
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Ayarlar yükleniyor...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Muhasebe Ayarları</h1>
                <p className="mt-2 text-gray-600">Sistem konfigürasyonu ve genel ayarlar</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('tax')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tax'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-percent-line mr-2"></i>
                  Vergi Ayarları
                </button>
                <button
                  onClick={() => setActiveTab('currency')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'currency'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-money-dollar-circle-line mr-2"></i>
                  Para Birimleri
                </button>
                <button
                  onClick={() => setActiveTab('system')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'system'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-settings-3-line mr-2"></i>
                  Sistem Ayarları
                </button>
                <button
                  onClick={() => setActiveTab('einvoice')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'einvoice'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-file-text-line mr-2"></i>
                  E-Fatura
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className="ri-user-settings-line mr-2"></i>
                  Kullanıcı Ayarları
                </button>
              </nav>
            </div>
          </div>

          {/* Vergi Ayarları Tab */}
          {activeTab === 'tax' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Vergi Ayarları</h2>
                <button
                  onClick={() => setShowTaxForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Yeni Vergi Ayarı
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tür
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Oran
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
                      {taxConfigs.map((config) => (
                        <tr key={config.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {config.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              config.type === 'KDV' ? 'bg-blue-100 text-blue-800' :
                              config.type === 'STOPAJ' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {config.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              %{config.rate}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              config.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {config.is_active ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Düzenle"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteTaxConfig(config.id)}
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

          {/* Para Birimleri Tab */}
          {activeTab === 'currency' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Para Birimleri</h2>
                <button
                  onClick={() => setShowCurrencyForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Yeni Para Birimi
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kod
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sembol
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ana Para
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
                      {currencies.map((currency) => (
                        <tr key={currency.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {currency.code}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {currency.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {currency.symbol}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {currency.rate.toLocaleString('tr-TR')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              currency.is_base 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {currency.is_base ? 'Ana Para' : 'Döviz'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              currency.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {currency.is_active ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Düzenle"
                              >
                                <i className="ri-edit-line"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteCurrency(currency.id)}
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

          {/* Sistem Ayarları Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Sistem Ayarları</h2>
                <button
                  onClick={() => setShowSystemForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-add-line mr-2"></i>
                  Yeni Ayar
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Anahtar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Değer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Açıklama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {systemSettings.map((setting) => (
                        <tr key={setting.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {setting.key}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {setting.value}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {setting.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {setting.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Düzenle"
                              >
                                <i className="ri-edit-line"></i>
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

          {/* E-Fatura Tab */}
          {activeTab === 'einvoice' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">E-Fatura Ayarları</h2>
                <button
                  onClick={() => setShowEInvoiceForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <i className="ri-settings-line mr-2"></i>
                  Ayarları Düzenle
                </button>
              </div>

              {eInvoiceConfig ? (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Şirket Bilgileri</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Şirket Adı:</span>
                          <p className="text-sm text-gray-900">{eInvoiceConfig.company_name}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Vergi No:</span>
                          <p className="text-sm text-gray-900">{eInvoiceConfig.tax_number}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Adres:</span>
                          <p className="text-sm text-gray-900">{eInvoiceConfig.address}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Telefon:</span>
                          <p className="text-sm text-gray-900">{eInvoiceConfig.phone}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">E-posta:</span>
                          <p className="text-sm text-gray-900">{eInvoiceConfig.email}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Durum:</span>
                          <span className={`ml-2 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            eInvoiceConfig.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {eInvoiceConfig.is_active ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">E-Fatura Durumu</h3>
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <i className="ri-information-line text-blue-600 text-xl mr-3"></i>
                            <div>
                              <h4 className="text-sm font-medium text-blue-800">Entegrasyon Durumu</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                E-fatura entegrasyonu aktif durumda
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <i className="ri-check-line text-green-600 text-xl mr-3"></i>
                            <div>
                              <h4 className="text-sm font-medium text-green-800">Test Ortamı</h4>
                              <p className="text-sm text-green-700 mt-1">
                                Test ortamında çalışıyor
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="text-center">
                    <i className="ri-file-text-line text-4xl text-gray-400 mb-4"></i>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">E-Fatura Ayarları</h3>
                    <p className="text-gray-600 mb-4">
                      E-fatura entegrasyonu için şirket bilgilerinizi yapılandırın
                    </p>
                    <button
                      onClick={() => setShowEInvoiceForm(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Ayarları Yapılandır
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Kullanıcı Ayarları Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Kullanıcı Ayarları</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">RBAC Ayarları</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rol Tabanlı Erişim</span>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Aktif
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ana Admin Koruması</span>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Aktif
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Audit Log</span>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Aktif
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Güvenlik Ayarları</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Şifre Karmaşıklığı</span>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Orta
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Oturum Süresi</span>
                      <span className="text-sm text-gray-900">8 saat</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">MFA</span>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Pasif
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Yeni Vergi Ayarı Formu */}
          {showTaxForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Yeni Vergi Ayarı</h2>
                  <button
                    onClick={() => setShowTaxForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="ri-close-line text-xl"></i>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad *
                    </label>
                    <input
                      type="text"
                      value={newTaxConfig.name}
                      onChange={(e) => setNewTaxConfig(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="KDV %20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tür *
                    </label>
                    <select
                      value={newTaxConfig.type}
                      onChange={(e) => setNewTaxConfig(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="KDV">KDV</option>
                      <option value="STOPAJ">Stopaj</option>
                      <option value="OTHER">Diğer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Oran (%) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newTaxConfig.rate}
                      onChange={(e) => setNewTaxConfig(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="20.00"
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end space-x-4">
                  <button
                    onClick={() => setShowTaxForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleAddTaxConfig}
                    disabled={!newTaxConfig.name.trim() || newTaxConfig.rate <= 0}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hata Mesajı */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}
