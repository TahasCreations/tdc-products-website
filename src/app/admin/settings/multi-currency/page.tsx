'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import AdminProtection from '../../../../components/AdminProtection';
import { 
  CurrencyDollarIcon,
  GlobeAltIcon,
  ArrowPathIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  BanknotesIcon,
  CalculatorIcon,
  CogIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  InformationCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  rate: number;
  isBase: boolean;
  isActive: boolean;
  lastUpdated: string;
  autoUpdate: boolean;
  precision: number;
  displayFormat: string;
  country: string;
  flag: string;
}

interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: string;
  source: string;
  change24h: number;
  change7d: number;
  change30d: number;
}

interface CurrencyConversion {
  id: string;
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  timestamp: string;
  user: string;
  purpose: string;
}

interface CurrencySettings {
  baseCurrency: string;
  autoUpdateRates: boolean;
  updateFrequency: 'hourly' | 'daily' | 'weekly';
  roundingMethod: 'round' | 'floor' | 'ceil';
  displayFormat: 'symbol' | 'code' | 'both';
  decimalPlaces: number;
  thousandsSeparator: string;
  decimalSeparator: string;
}

export default function MultiCurrency() {
  const { user } = useAuth();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [conversions, setConversions] = useState<CurrencyConversion[]>([]);
  const [settings, setSettings] = useState<CurrencySettings>({
    baseCurrency: 'TRY',
    autoUpdateRates: true,
    updateFrequency: 'daily',
    roundingMethod: 'round',
    displayFormat: 'both',
    decimalPlaces: 2,
    thousandsSeparator: '.',
    decimalSeparator: ','
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'currencies' | 'rates' | 'conversions' | 'settings' | 'analytics'>('currencies');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [conversionForm, setConversionForm] = useState({
    fromAmount: '',
    fromCurrency: 'TRY',
    toCurrency: 'USD'
  });

  // Mock data
  useEffect(() => {
    const mockCurrencies: Currency[] = [
      {
        id: '1',
        code: 'TRY',
        name: 'Türk Lirası',
        symbol: '₺',
        rate: 1.0,
        isBase: true,
        isActive: true,
        lastUpdated: '2024-01-15T10:30:00Z',
        autoUpdate: true,
        precision: 2,
        displayFormat: '₺1,234.56',
        country: 'Turkey',
        flag: '🇹🇷'
      },
      {
        id: '2',
        code: 'USD',
        name: 'Amerikan Doları',
        symbol: '$',
        rate: 0.034,
        isBase: false,
        isActive: true,
        lastUpdated: '2024-01-15T10:30:00Z',
        autoUpdate: true,
        precision: 2,
        displayFormat: '$1,234.56',
        country: 'United States',
        flag: '🇺🇸'
      },
      {
        id: '3',
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        rate: 0.031,
        isBase: false,
        isActive: true,
        lastUpdated: '2024-01-15T10:30:00Z',
        autoUpdate: true,
        precision: 2,
        displayFormat: '€1.234,56',
        country: 'European Union',
        flag: '🇪🇺'
      },
      {
        id: '4',
        code: 'GBP',
        name: 'İngiliz Sterlini',
        symbol: '£',
        rate: 0.027,
        isBase: false,
        isActive: true,
        lastUpdated: '2024-01-15T10:30:00Z',
        autoUpdate: true,
        precision: 2,
        displayFormat: '£1,234.56',
        country: 'United Kingdom',
        flag: '🇬🇧'
      },
      {
        id: '5',
        code: 'JPY',
        name: 'Japon Yeni',
        symbol: '¥',
        rate: 4.95,
        isBase: false,
        isActive: true,
        lastUpdated: '2024-01-15T10:30:00Z',
        autoUpdate: true,
        precision: 0,
        displayFormat: '¥1,234',
        country: 'Japan',
        flag: '🇯🇵'
      }
    ];

    const mockExchangeRates: ExchangeRate[] = [
      {
        id: '1',
        fromCurrency: 'TRY',
        toCurrency: 'USD',
        rate: 0.034,
        timestamp: '2024-01-15T10:30:00Z',
        source: 'Central Bank',
        change24h: 0.5,
        change7d: -1.2,
        change30d: 3.8
      },
      {
        id: '2',
        fromCurrency: 'TRY',
        toCurrency: 'EUR',
        rate: 0.031,
        timestamp: '2024-01-15T10:30:00Z',
        source: 'Central Bank',
        change24h: 0.3,
        change7d: -0.8,
        change30d: 2.1
      },
      {
        id: '3',
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        rate: 0.91,
        timestamp: '2024-01-15T10:30:00Z',
        source: 'ECB',
        change24h: -0.2,
        change7d: 0.5,
        change30d: -1.2
      }
    ];

    const mockConversions: CurrencyConversion[] = [
      {
        id: '1',
        fromAmount: 1000,
        fromCurrency: 'TRY',
        toAmount: 34.00,
        toCurrency: 'USD',
        rate: 0.034,
        timestamp: '2024-01-15T14:30:00Z',
        user: 'admin@example.com',
        purpose: 'Product pricing'
      },
      {
        id: '2',
        fromAmount: 500,
        fromCurrency: 'USD',
        toAmount: 14705.88,
        toCurrency: 'TRY',
        rate: 29.41,
        timestamp: '2024-01-15T13:45:00Z',
        user: 'admin@example.com',
        purpose: 'Invoice conversion'
      }
    ];

    setCurrencies(mockCurrencies);
    setExchangeRates(mockExchangeRates);
    setConversions(mockConversions);
    setLoading(false);
  }, []);

  const formatCurrency = (amount: number, currency: Currency) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.precision,
      maximumFractionDigits: currency.precision
    }).format(amount);
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 bg-green-100';
    if (change < 0) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return ArrowTrendingUpIcon;
    if (change < 0) return ArrowTrendingDownIcon;
    return ClockIcon;
  };

  const handleConversion = () => {
    const fromCurrency = currencies.find(c => c.code === conversionForm.fromCurrency);
    const toCurrency = currencies.find(c => c.code === conversionForm.toCurrency);
    
    if (fromCurrency && toCurrency && conversionForm.fromAmount) {
      const amount = parseFloat(conversionForm.fromAmount);
      const rate = toCurrency.rate / fromCurrency.rate;
      const convertedAmount = amount * rate;
      
      const newConversion: CurrencyConversion = {
        id: Date.now().toString(),
        fromAmount: amount,
        fromCurrency: conversionForm.fromCurrency,
        toAmount: convertedAmount,
        toCurrency: conversionForm.toCurrency,
        rate: rate,
        timestamp: new Date().toISOString(),
        user: user?.email || 'admin@example.com',
        purpose: 'Manual conversion'
      };
      
      setConversions(prev => [newConversion, ...prev]);
    }
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Çoklu Para Birimi</h1>
                <p className="mt-2 text-gray-600">Para birimi yönetimi ve döviz kurları</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Para Birimi Ekle
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
                  Kurları Güncelle
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'currencies', name: 'Para Birimleri', icon: CurrencyDollarIcon },
                { id: 'rates', name: 'Döviz Kurları', icon: ChartBarIcon },
                { id: 'conversions', name: 'Dönüşümler', icon: CalculatorIcon },
                { id: 'settings', name: 'Ayarlar', icon: CogIcon },
                { id: 'analytics', name: 'Analitik', icon: ChartBarIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Currencies Tab */}
          {activeTab === 'currencies' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currencies.map((currency) => (
                  <div key={currency.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{currency.flag}</span>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{currency.code}</h3>
                            <p className="text-sm text-gray-600">{currency.name}</p>
                            <p className="text-xs text-gray-500">{currency.country}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {currency.isBase && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              Ana Para
                            </span>
                          )}
                          <button
                            onClick={() => setSelectedCurrency(currency)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Kur:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {currency.isBase ? '1.00' : currency.rate.toFixed(4)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Sembol:</span>
                          <span className="text-sm font-medium text-gray-900">{currency.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Hassasiyet:</span>
                          <span className="text-sm font-medium text-gray-900">{currency.precision} ondalık</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Durum:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            currency.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                          }`}>
                            {currency.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Son Güncelleme:</span>
                          <span className="text-sm text-gray-900">
                            {new Date(currency.lastUpdated).toLocaleString('tr-TR')}
                          </span>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="text-xs text-gray-500">
                          Format: {currency.displayFormat}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exchange Rates Tab */}
          {activeTab === 'rates' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Döviz Kurları</h3>
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
                          24 Saat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          7 Gün
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          30 Gün
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kaynak
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Son Güncelleme
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {exchangeRates.map((rate) => {
                        const ChangeIcon = getChangeIcon(rate.change24h);
                        
                        return (
                          <tr key={rate.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {rate.fromCurrency} → {rate.toCurrency}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {rate.rate.toFixed(4)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getChangeColor(rate.change24h)}`}>
                                <ChangeIcon className="w-3 h-3 mr-1" />
                                {rate.change24h > 0 ? '+' : ''}{rate.change24h.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getChangeColor(rate.change7d)}`}>
                                <ChangeIcon className="w-3 h-3 mr-1" />
                                {rate.change7d > 0 ? '+' : ''}{rate.change7d.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getChangeColor(rate.change30d)}`}>
                                <ChangeIcon className="w-3 h-3 mr-1" />
                                {rate.change30d > 0 ? '+' : ''}{rate.change30d.toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {rate.source}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(rate.timestamp).toLocaleString('tr-TR')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Conversions Tab */}
          {activeTab === 'conversions' && (
            <div className="space-y-6">
              {/* Conversion Tool */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Para Birimi Dönüştürücü</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Miktar</label>
                    <input
                      type="number"
                      value={conversionForm.fromAmount}
                      onChange={(e) => setConversionForm(prev => ({ ...prev, fromAmount: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kaynak Para</label>
                    <select
                      value={conversionForm.fromCurrency}
                      onChange={(e) => setConversionForm(prev => ({ ...prev, fromCurrency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hedef Para</label>
                    <select
                      value={conversionForm.toCurrency}
                      onChange={(e) => setConversionForm(prev => ({ ...prev, toCurrency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleConversion}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Dönüştür
                    </button>
                  </div>
                </div>
              </div>

              {/* Conversion History */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Dönüşüm Geçmişi</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kaynak
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hedef
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amaç
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kullanıcı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {conversions.map((conversion) => (
                        <tr key={conversion.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {conversion.fromAmount.toLocaleString('tr-TR')} {conversion.fromCurrency}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {conversion.toAmount.toLocaleString('tr-TR')} {conversion.toCurrency}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {conversion.rate.toFixed(4)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {conversion.purpose}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {conversion.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(conversion.timestamp).toLocaleString('tr-TR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Para Birimi Ayarları</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ana Para Birimi</label>
                    <select
                      value={settings.baseCurrency}
                      onChange={(e) => setSettings(prev => ({ ...prev, baseCurrency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Güncelleme Sıklığı</label>
                    <select
                      value={settings.updateFrequency}
                      onChange={(e) => setSettings(prev => ({ ...prev, updateFrequency: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="hourly">Saatlik</option>
                      <option value="daily">Günlük</option>
                      <option value="weekly">Haftalık</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Yuvarlama Yöntemi</label>
                    <select
                      value={settings.roundingMethod}
                      onChange={(e) => setSettings(prev => ({ ...prev, roundingMethod: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="round">Normal Yuvarlama</option>
                      <option value="floor">Aşağı Yuvarlama</option>
                      <option value="ceil">Yukarı Yuvarlama</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Görüntüleme Formatı</label>
                    <select
                      value={settings.displayFormat}
                      onChange={(e) => setSettings(prev => ({ ...prev, displayFormat: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="symbol">Sadece Sembol</option>
                      <option value="code">Sadece Kod</option>
                      <option value="both">Sembol + Kod</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ondalık Basamak</label>
                    <input
                      type="number"
                      min="0"
                      max="4"
                      value={settings.decimalPlaces}
                      onChange={(e) => setSettings(prev => ({ ...prev, decimalPlaces: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Binlik Ayırıcı</label>
                    <input
                      type="text"
                      value={settings.thousandsSeparator}
                      onChange={(e) => setSettings(prev => ({ ...prev, thousandsSeparator: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center">
                  <input
                    type="checkbox"
                    id="autoUpdate"
                    checked={settings.autoUpdateRates}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoUpdateRates: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoUpdate" className="ml-2 block text-sm text-gray-900">
                    Döviz kurlarını otomatik güncelle
                  </label>
                </div>

                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Ayarları Kaydet
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Aktif Para Birimi</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {currencies.filter(c => c.isActive).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ArrowPathIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Toplam Dönüşüm</p>
                      <p className="text-2xl font-semibold text-gray-900">{conversions.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <ClockIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Son Güncelleme</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date().toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <ShieldCheckIcon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Güvenilirlik</p>
                      <p className="text-2xl font-semibold text-gray-900">%99.9</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">En Çok Kullanılan Dönüşümler</h3>
                  <div className="space-y-3">
                    {[
                      { from: 'TRY', to: 'USD', count: 1250, percentage: 45.2 },
                      { from: 'USD', to: 'TRY', count: 890, percentage: 32.1 },
                      { from: 'TRY', to: 'EUR', count: 420, percentage: 15.2 },
                      { from: 'EUR', to: 'TRY', count: 220, percentage: 7.5 }
                    ].map((conversion, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {conversion.from} → {conversion.to}
                          </p>
                          <p className="text-xs text-gray-500">{conversion.count} dönüşüm</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">%{conversion.percentage}</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${conversion.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Para Birimi Performansı</h3>
                  <div className="space-y-3">
                    {currencies.filter(c => !c.isBase).map((currency) => (
                      <div key={currency.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{currency.flag}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{currency.code}</p>
                            <p className="text-xs text-gray-500">{currency.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {currency.rate.toFixed(4)}
                          </p>
                          <p className="text-xs text-green-600">+2.1%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}
