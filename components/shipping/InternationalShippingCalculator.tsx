'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Package, DollarSign, AlertCircle, Truck } from 'lucide-react';
import { useInternationalShipping } from '@/lib/shipping/international-shipping';
import type { ShippingRate, CustomsInfo } from '@/lib/shipping/international-shipping';

interface InternationalShippingCalculatorProps {
  productValue: number;
  productWeight: number;
  productCategory: string;
}

export default function InternationalShippingCalculator({
  productValue,
  productWeight,
  productCategory
}: InternationalShippingCalculatorProps) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [customsInfo, setCustomsInfo] = useState<CustomsInfo | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const shipping = useInternationalShipping();

  const countries = shipping.getSupportedCountries();

  const handleCalculate = async () => {
    if (!selectedCountry) return;

    setIsCalculating(true);

    try {
      const [rates, customs] = await Promise.all([
        shipping.getShippingRates(selectedCountry, productWeight, productValue),
        shipping.calculateCustoms(selectedCountry, productValue, productCategory)
      ]);

      setShippingRates(rates);
      setCustomsInfo(customs);
    } catch (error) {
      console.error('Shipping calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Globe className="w-8 h-8 text-indigo-600" />
        <div>
          <h3 className="text-xl font-bold text-gray-900">🌍 Uluslararası Kargo</h3>
          <p className="text-sm text-gray-600">150+ ülkeye gönderim</p>
        </div>
      </div>

      {/* Country Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gönderim Ülkesi
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none"
        >
          <option value="">Ülke seçin...</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Calculate Button */}
      <button
        onClick={handleCalculate}
        disabled={!selectedCountry || isCalculating}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
      >
        {isCalculating ? '⏳ Hesaplanıyor...' : '📊 Kargo Ücretini Hesapla'}
      </button>

      {/* Results */}
      {shippingRates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Shipping Options */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">📦 Kargo Seçenekleri</h4>
            <div className="space-y-3">
              {shippingRates.map((rate, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-bold text-gray-900">{rate.carrier}</div>
                      <div className="text-sm text-gray-600">{rate.serviceName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">
                        {rate.price.toLocaleString('tr-TR')} {rate.currency}
                      </div>
                      <div className="text-xs text-gray-600">{rate.estimatedDays}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    {rate.trackingAvailable && (
                      <div className="flex items-center space-x-1">
                        <Truck className="w-3 h-3" />
                        <span>Takip edilebilir</span>
                      </div>
                    )}
                    {rate.insuranceIncluded && (
                      <div className="flex items-center space-x-1">
                        <Package className="w-3 h-3" />
                        <span>Sigortalı</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customs & Duties */}
          {customsInfo && customsInfo.isRequired && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
              <div className="flex items-start space-x-3 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">⚠️ Gümrük & Vergi</h4>
                  <p className="text-sm text-gray-600">
                    Uluslararası gönderimler için ek ücretler uygulanabilir
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Gümrük Vergisi (%{customsInfo.dutyRate}):</span>
                  <span className="font-semibold text-gray-900">
                    {customsInfo.estimatedDuty.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">KDV (%{customsInfo.taxRate}):</span>
                  <span className="font-semibold text-gray-900">
                    {customsInfo.estimatedTax.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
                <div className="border-t-2 border-yellow-300 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Toplam Ek Ücret:</span>
                    <span className="font-bold text-yellow-600">
                      {customsInfo.totalCustomsFees.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-3">
                * Gümrük ücretleri tahminidir ve ülkenize göre değişebilir
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

