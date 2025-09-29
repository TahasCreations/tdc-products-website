'use client';

import { useState } from 'react';
import { enhancedPluginRegistry } from '../../src/lib/plugin-system/registry-enhanced';

interface PriceCalculation {
  basePrice: number;
  calculatedPrice: number;
  currency: string;
  includeTax: boolean;
  taxRate: number;
  markup: number;
}

export default function PricingPage() {
  const [basePrice, setBasePrice] = useState(100);
  const [currency, setCurrency] = useState('TRY');
  const [includeTax, setIncludeTax] = useState(true);
  const [taxRate, setTaxRate] = useState(0.18);
  const [markup, setMarkup] = useState(1.2);
  const [calculatedPrice, setCalculatedPrice] = useState<PriceCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pluginStatus, setPluginStatus] = useState<{
    loaded: boolean;
    enabled: boolean;
  }>({ loaded: false, enabled: false });

  const calculatePrice = async () => {
    try {
      setLoading(true);
      setError(null);

      const registry = await enhancedPluginRegistry;
      
      // Plugin durumunu kontrol et
      const status = registry.getStatus('pricing-plugin');
      setPluginStatus({
        loaded: status.loaded,
        enabled: status.enabled
      });

      if (status.loaded && status.enabled) {
        const pricingPlugin = registry.get('pricing-plugin');
        
        if (pricingPlugin) {
          const api = pricingPlugin.getPublicAPI();
          const price = await api.getPrice({
            basePrice,
            currency,
            includeTax,
            taxRate,
            markup
          });
          
          setCalculatedPrice({
            basePrice,
            calculatedPrice: price,
            currency,
            includeTax,
            taxRate,
            markup
          });
        }
      } else {
        setError('Pricing plugin yüklü veya etkin değil');
      }
    } catch (error) {
      console.error('Failed to calculate price:', error);
      setError('Fiyat hesaplanırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fiyat Hesaplayıcı</h1>
          <p className="text-gray-600">
            Pricing plugin ile dinamik fiyat hesaplamaları
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            pluginStatus.loaded ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            Plugin: {pluginStatus.loaded ? 'Yüklü' : 'Yüklenmemiş'}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            pluginStatus.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            Durum: {pluginStatus.enabled ? 'Aktif' : 'Pasif'}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hesaplama Formu */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Fiyat Parametreleri</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temel Fiyat
              </label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Para Birimi
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="TRY">TRY - Türk Lirası</option>
                <option value="USD">USD - Amerikan Doları</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kar Marjı (Markup)
              </label>
              <input
                type="number"
                step="0.1"
                value={markup}
                onChange={(e) => setMarkup(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1.2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Örnek: 1.2 = %20 kar marjı
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeTax"
                checked={includeTax}
                onChange={(e) => setIncludeTax(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeTax" className="ml-2 block text-sm text-gray-700">
                Vergi dahil
              </label>
            </div>

            {includeTax && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vergi Oranı (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={taxRate * 100}
                  onChange={(e) => setTaxRate(Number(e.target.value) / 100)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="18"
                />
              </div>
            )}

            <button
              onClick={calculatePrice}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Hesaplanıyor...
                </div>
              ) : (
                'Fiyat Hesapla'
              )}
            </button>
          </div>
        </div>

        {/* Sonuç Paneli */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Hesaplama Sonucu</h2>
          
          {calculatedPrice ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {calculatedPrice.calculatedPrice.toFixed(2)} {calculatedPrice.currency}
                  </div>
                  <p className="text-gray-600">Hesaplanan Fiyat</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Temel Fiyat:</span>
                  <span className="font-medium">{calculatedPrice.basePrice} {calculatedPrice.currency}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kar Marjı:</span>
                  <span className="font-medium">{((calculatedPrice.markup - 1) * 100).toFixed(1)}%</span>
                </div>
                
                {calculatedPrice.includeTax && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vergi Oranı:</span>
                    <span className="font-medium">{(calculatedPrice.taxRate * 100).toFixed(1)}%</span>
                  </div>
                )}
                
                <hr className="my-3" />
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam:</span>
                  <span className="font-medium">{(calculatedPrice.basePrice * calculatedPrice.markup).toFixed(2)} {calculatedPrice.currency}</span>
                </div>
                
                {calculatedPrice.includeTax && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vergi:</span>
                    <span className="font-medium">{(calculatedPrice.basePrice * calculatedPrice.markup * calculatedPrice.taxRate).toFixed(2)} {calculatedPrice.currency}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💰</div>
              <p className="text-gray-600">
                Fiyat hesaplamak için parametreleri girin ve "Fiyat Hesapla" butonuna tıklayın.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Plugin Bilgileri */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Pricing Plugin Özellikleri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">Desteklenen Özellikler:</h4>
            <ul className="space-y-1">
              <li>• Dinamik fiyat hesaplama</li>
              <li>• Çoklu para birimi desteği</li>
              <li>• Kar marjı hesaplama</li>
              <li>• Vergi hesaplama</li>
              <li>• Gerçek zamanlı güncellemeler</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">API Endpoints:</h4>
            <ul className="space-y-1">
              <li>• <code>getPrice()</code> - Fiyat hesaplama</li>
              <li>• <code>getCurrencyRates()</code> - Döviz kurları</li>
              <li>• <code>validatePrice()</code> - Fiyat doğrulama</li>
              <li>• <code>getTaxRates()</code> - Vergi oranları</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
