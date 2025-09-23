'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminProtection from '../../../../components/AdminProtection';
import { useErrorToast } from '../../../../hooks/useErrorToast';
import { apiWrapper } from '../../../../lib/api-wrapper';

interface CurrencyRate {
  id: string;
  currency_code: string;
  currency_name: string;
  buy_rate: number;
  sell_rate: number;
  effective_buy_rate: number;
  effective_sell_rate: number;
  rate_date: string;
  source: string;
  is_active: boolean;
}

interface CurrencySettings {
  id?: string;
  company_id: string;
  auto_update_enabled: boolean;
  update_frequency: string;
  last_update?: string;
}

interface CurrencyAlert {
  id: string;
  currency_code: string;
  alert_type: string;
  target_rate: number;
  is_active: boolean;
  notification_email?: string;
  last_triggered?: string;
}

interface CurrencyHolding {
  id: string;
  currency_code: string;
  amount: number;
  equivalent_try: number;
  last_updated: string;
}

export default function CurrencyPage() {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [settings, setSettings] = useState<CurrencySettings>({
    company_id: '550e8400-e29b-41d4-a716-446655440000',
    auto_update_enabled: true,
    update_frequency: 'DAILY'
  });
  const [alerts, setAlerts] = useState<CurrencyAlert[]>([]);
  const [holdings, setHoldings] = useState<CurrencyHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [converterData, setConverterData] = useState({
    fromCurrency: 'USD',
    toCurrency: 'TRY',
    amount: 100,
    result: 0
  });

  const { handleAsyncOperation, showSuccess, showError } = useErrorToast();

  const fetchCurrencyData = useCallback(async () => {
    const [ratesResult, settingsResult, alertsResult, holdingsResult] = await Promise.all([
      handleAsyncOperation(
        () => apiWrapper.get('/api/accounting/currency?companyId=550e8400-e29b-41d4-a716-446655440000&action=list'),
        undefined,
        'Döviz kurları yüklenirken'
      ),
      handleAsyncOperation(
        () => apiWrapper.get('/api/accounting/currency?companyId=550e8400-e29b-41d4-a716-446655440000&action=settings'),
        undefined,
        'Döviz ayarları yüklenirken'
      ),
      handleAsyncOperation(
        () => apiWrapper.get('/api/accounting/currency?companyId=550e8400-e29b-41d4-a716-446655440000&action=alerts'),
        undefined,
        'Döviz alarmları yüklenirken'
      ),
      handleAsyncOperation(
        () => apiWrapper.get('/api/accounting/currency?companyId=550e8400-e29b-41d4-a716-446655440000&action=holdings'),
        undefined,
        'Döviz varlıkları yüklenirken'
      )
    ]);

    if (ratesResult && (ratesResult as any).data) {
      setRates((ratesResult as any).data);
    }
    if (settingsResult && (settingsResult as any).data) {
      setSettings((settingsResult as any).data || settings);
    }
    if (alertsResult && (alertsResult as any).data) {
      setAlerts((alertsResult as any).data);
    }
    if (holdingsResult && (holdingsResult as any).data) {
      setHoldings((holdingsResult as any).data);
    }
    setLoading(false);
  }, [handleAsyncOperation, settings]);

  useEffect(() => {
    fetchCurrencyData();
  }, [fetchCurrencyData]);

  const handleUpdateRates = async () => {
    setUpdating(true);
    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/currency', {
        action: 'update_rates',
        companyId: settings.company_id
      }),
      'Döviz kurları güncellendi',
      'Döviz kurları güncellenirken'
    );

    if (result && (result as any).data) {
      fetchCurrencyData();
    }
    setUpdating(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/currency', {
        action: 'save_settings',
        companyId: settings.company_id,
        autoUpdateEnabled: settings.auto_update_enabled,
        updateFrequency: settings.update_frequency
      }),
      'Döviz kuru ayarları kaydedildi',
      'Ayarlar kaydedilirken'
    );

    if (result && (result as any).data) {
      setSettings((result as any).data);
      setShowSettings(false);
    }
  };

  const handleConvertCurrency = async () => {
    const result = await handleAsyncOperation(
      () => apiWrapper.post('/api/accounting/currency', {
        action: 'convert',
        companyId: settings.company_id,
        fromCurrency: converterData.fromCurrency,
        toCurrency: converterData.toCurrency,
        amount: converterData.amount
      }),
      undefined,
      'Döviz çevirimi yapılırken'
    );

    if (result && (result as any).data) {
      setConverterData(prev => ({
        ...prev,
        result: (result as any).data.convertedAmount
      }));
    }
  };

  const getCurrencyFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      'USD': '🇺🇸',
      'EUR': '🇪🇺',
      'GBP': '🇬🇧',
      'JPY': '🇯🇵',
      'CHF': '🇨🇭',
      'TRY': '🇹🇷'
    };
    return flags[code] || '💱';
  };

  const formatRate = (rate: number) => {
    return rate.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Döviz kurları yükleniyor...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Döviz Kuru Yönetimi</h1>
                <p className="mt-2 text-gray-600">TCMB döviz kurları ve çoklu döviz işlemleri</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowConverter(!showConverter)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {showConverter ? 'Çeviriciyi Gizle' : 'Döviz Çevirici'}
                </button>
                <button
                  onClick={() => setShowAlerts(!showAlerts)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {showAlerts ? 'Alarmları Gizle' : 'Kur Alarmları'}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {showSettings ? 'Ayarları Gizle' : 'Ayarlar'}
                </button>
                <button
                  onClick={handleUpdateRates}
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {updating ? 'Güncelleniyor...' : 'Kurları Güncelle'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Döviz Çevirici */}
          {showConverter && (
            <div className="bg-white rounded-lg shadow-sm border mb-8">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Döviz Çevirici</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Miktar
                    </label>
                    <input
                      type="number"
                      value={converterData.amount}
                      onChange={(e) => setConverterData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kaynak Döviz
                    </label>
                    <select
                      value={converterData.fromCurrency}
                      onChange={(e) => setConverterData(prev => ({ ...prev, fromCurrency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="TRY">🇹🇷 TRY</option>
                      <option value="USD">🇺🇸 USD</option>
                      <option value="EUR">🇪🇺 EUR</option>
                      <option value="GBP">🇬🇧 GBP</option>
                      <option value="JPY">🇯🇵 JPY</option>
                      <option value="CHF">🇨🇭 CHF</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hedef Döviz
                    </label>
                    <select
                      value={converterData.toCurrency}
                      onChange={(e) => setConverterData(prev => ({ ...prev, toCurrency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="TRY">🇹🇷 TRY</option>
                      <option value="USD">🇺🇸 USD</option>
                      <option value="EUR">🇪🇺 EUR</option>
                      <option value="GBP">🇬🇧 GBP</option>
                      <option value="JPY">🇯🇵 JPY</option>
                      <option value="CHF">🇨🇭 CHF</option>
                    </select>
                  </div>
                  <div>
                    <button
                      onClick={handleConvertCurrency}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Çevir
                    </button>
                  </div>
                </div>
                {converterData.result > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-blue-600 mb-2">Çevrim Sonucu</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {converterData.amount} {converterData.fromCurrency} = {converterData.result.toLocaleString('tr-TR')} {converterData.toCurrency}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Döviz Kuru Ayarları */}
          {showSettings && (
            <div className="bg-white rounded-lg shadow-sm border mb-8">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Döviz Kuru Ayarları</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Otomatik Güncelleme
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.auto_update_enabled}
                          onChange={(e) => setSettings(prev => ({ ...prev, auto_update_enabled: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-600">TCMB&apos;den otomatik kur güncelleme</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Güncelleme Sıklığı
                      </label>
                      <select
                        value={settings.update_frequency}
                        onChange={(e) => setSettings(prev => ({ ...prev, update_frequency: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="MANUAL">Manuel</option>
                        <option value="HOURLY">Saatlik</option>
                        <option value="DAILY">Günlük</option>
                      </select>
                    </div>
                  </div>

                  {settings.last_update && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Son Güncelleme:</strong> {new Date(settings.last_update).toLocaleString('tr-TR')}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Ayarları Kaydet
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Şirket Döviz Varlıkları */}
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Şirket Döviz Varlıkları</h2>
              <p className="text-sm text-gray-600">Şirketin sahip olduğu döviz miktarları ve TRY karşılıkları</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {holdings.map((holding) => (
                  <div key={holding.id} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{getCurrencyFlag(holding.currency_code)}</span>
                          <span className="text-lg font-semibold text-gray-900">{holding.currency_code}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {holding.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {holding.currency_code}
                        </p>
                        <p className="text-lg font-bold text-blue-600 mt-2">
                          {holding.equivalent_try.toLocaleString('tr-TR')} TL
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Son güncelleme
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(holding.last_updated).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {holdings.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <i className="ri-wallet-line text-4xl mb-4"></i>
                    <p>Henüz döviz varlığı bulunmuyor</p>
                  </div>
                )}
              </div>
              
              {/* Toplam Varlık Özeti */}
              {holdings.length > 0 && (
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Toplam Döviz Varlığı</h3>
                      <p className="text-sm text-gray-600">Tüm dövizlerin TRY karşılığı</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {holdings.reduce((sum, h) => sum + h.equivalent_try, 0).toLocaleString('tr-TR')} TL
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Döviz Kurları */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Güncel Döviz Kurları</h2>
                <p className="text-sm text-gray-600">TCMB&apos;den güncel döviz kurları</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Döviz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alış
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Satış
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efektif Alış
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Efektif Satış
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kaynak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rates.map((rate) => (
                    <tr key={rate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getCurrencyFlag(rate.currency_code)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{rate.currency_code}</div>
                            <div className="text-sm text-gray-500">{rate.currency_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatRate(rate.buy_rate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatRate(rate.sell_rate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatRate(rate.effective_buy_rate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatRate(rate.effective_sell_rate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          rate.source === 'TCMB' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {rate.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(rate.rate_date).toLocaleDateString('tr-TR')}
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
