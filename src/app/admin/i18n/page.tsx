'use client';

import { useState, useEffect } from 'react';
import AdminProtection from '../../../components/AdminProtection';
import {
  GlobeAltIcon,
  CurrencyDollarIcon,
  LanguageIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  is_active: boolean;
  is_default: boolean;
  exchange_rate: number;
  last_updated: string;
}

interface Language {
  id: number;
  code: string;
  name: string;
  native_name: string;
  is_active: boolean;
  is_default: boolean;
  is_rtl: boolean;
  flag_emoji: string;
}

interface Translation {
  id: number;
  key_name: string;
  namespace: string;
  language_id: number;
  translation_text: string;
  is_approved: boolean;
}

export default function I18nManagementPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [currenciesRes, languagesRes, translationsRes] = await Promise.all([
        fetch('/api/admin/i18n/currencies'),
        fetch('/api/admin/i18n/languages'),
        fetch('/api/admin/i18n/translations')
      ]);

      if (currenciesRes.ok) {
        const currenciesData = await currenciesRes.json();
        setCurrencies(currenciesData);
      }

      if (languagesRes.ok) {
        const languagesData = await languagesRes.json();
        setLanguages(languagesData);
      }

      if (translationsRes.ok) {
        const translationsData = await translationsRes.json();
        setTranslations(translationsData);
      }
    } catch (error) {
      console.error('Error fetching i18n data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencySubmit = async (currencyData: any) => {
    try {
      const url = editingItem ? `/api/admin/i18n/currencies/${editingItem.id}` : '/api/admin/i18n/currencies';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currencyData)
      });

      if (response.ok) {
        await fetchData();
        setShowCurrencyModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving currency:', error);
    }
  };

  const handleLanguageSubmit = async (languageData: any) => {
    try {
      const url = editingItem ? `/api/admin/i18n/languages/${editingItem.id}` : '/api/admin/i18n/languages';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(languageData)
      });

      if (response.ok) {
        await fetchData();
        setShowLanguageModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const handleTranslationSubmit = async (translationData: any) => {
    try {
      const url = editingItem ? `/api/admin/i18n/translations/${editingItem.id}` : '/api/admin/i18n/translations';
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(translationData)
      });

      if (response.ok) {
        await fetchData();
        setShowTranslationModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/i18n/${type}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
    { id: 'currencies', name: 'Para Birimleri', icon: CurrencyDollarIcon },
    { id: 'languages', name: 'Diller', icon: LanguageIcon },
    { id: 'translations', name: 'Çeviriler', icon: DocumentTextIcon },
    { id: 'settings', name: 'Ayarlar', icon: CogIcon }
  ];

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Çoklu Dil ve Para Birimi Yönetimi</h1>
                <p className="mt-2 text-gray-600">
                  Diller, para birimleri ve çevirileri yönetin
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{languages.filter(l => l.is_active).length}</span> aktif dil
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{currencies.filter(c => c.is_active).length}</span> aktif para birimi
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow">
            {activeTab === 'overview' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Genel Bakış</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <LanguageIcon className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Toplam Dil</p>
                        <p className="text-2xl font-bold text-blue-900">{languages.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Toplam Para Birimi</p>
                        <p className="text-2xl font-bold text-green-900">{currencies.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Toplam Çeviri</p>
                        <p className="text-2xl font-bold text-purple-900">{translations.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <CheckIcon className="w-8 h-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-orange-600">Onaylanmış Çeviri</p>
                        <p className="text-2xl font-bold text-orange-900">
                          {translations.filter(t => t.is_approved).length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Aktif Diller</h3>
                    <div className="space-y-2">
                      {languages.filter(l => l.is_active).map((language) => (
                        <div key={language.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{language.flag_emoji}</span>
                            <div>
                              <p className="font-medium text-gray-900">{language.native_name}</p>
                              <p className="text-sm text-gray-500">{language.name}</p>
                            </div>
                          </div>
                          {language.is_default && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              Varsayılan
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Aktif Para Birimleri</h3>
                    <div className="space-y-2">
                      {currencies.filter(c => c.is_active).map((currency) => (
                        <div key={currency.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg font-medium">{currency.symbol}</span>
                            <div>
                              <p className="font-medium text-gray-900">{currency.name}</p>
                              <p className="text-sm text-gray-500">{currency.code}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {currency.exchange_rate.toFixed(6)}
                            </p>
                            {currency.is_default && (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                Varsayılan
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'currencies' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Para Birimleri</h2>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setShowCurrencyModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Yeni Para Birimi
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Para Birimi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Son Güncelleme
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currencies.map((currency) => (
                        <tr key={currency.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-lg font-medium mr-3">{currency.symbol}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{currency.name}</div>
                                <div className="text-sm text-gray-500">{currency.code}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {currency.exchange_rate.toFixed(6)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                currency.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {currency.is_active ? 'Aktif' : 'Pasif'}
                              </span>
                              {currency.is_default && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Varsayılan
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(currency.last_updated).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setEditingItem(currency);
                                  setShowCurrencyModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('currencies', currency.id)}
                                className="text-red-600 hover:text-red-900"
                              >
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
            )}

            {activeTab === 'languages' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Diller</h2>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setShowLanguageModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Yeni Dil
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dil
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kod
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Yön
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {languages.map((language) => (
                        <tr key={language.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{language.flag_emoji}</span>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{language.native_name}</div>
                                <div className="text-sm text-gray-500">{language.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {language.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                language.is_active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {language.is_active ? 'Aktif' : 'Pasif'}
                              </span>
                              {language.is_default && (
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Varsayılan
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {language.is_rtl ? 'Sağdan Sola' : 'Soldan Sağa'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setEditingItem(language);
                                  setShowLanguageModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('languages', language.id)}
                                className="text-red-600 hover:text-red-900"
                              >
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
            )}

            {activeTab === 'translations' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Çeviriler</h2>
                  <button
                    onClick={() => {
                      setEditingItem(null);
                      setShowTranslationModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Yeni Çeviri
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Anahtar
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Namespace
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dil
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Çeviri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {translations.map((translation) => (
                        <tr key={translation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {translation.key_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {translation.namespace}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {languages.find(l => l.id === translation.language_id)?.native_name || 'Bilinmiyor'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {translation.translation_text}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              translation.is_approved 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {translation.is_approved ? 'Onaylandı' : 'Beklemede'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setEditingItem(translation);
                                  setShowTranslationModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete('translations', translation.id)}
                                className="text-red-600 hover:text-red-900"
                              >
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
            )}

            {activeTab === 'settings' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Ayarlar</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Otomatik Kur Güncelleme</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Para birimi kurlarını otomatik olarak güncelle
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Çeviri Onayı</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Yeni çevirileri otomatik olarak onayla
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Varsayılan Dil Algılama</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Kullanıcının tarayıcı dilini otomatik algıla
                        </p>
                      </div>
                      <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminProtection>
  );
}
