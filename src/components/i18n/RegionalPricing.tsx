'use client';

import { useState, useEffect } from 'react';
import { 
  MapPinIcon, 
  CurrencyDollarIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Region {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  flag: string;
  taxRate: number;
  shippingCost: number;
  priceMultiplier: number;
  isAvailable: boolean;
}

interface RegionalPricingProps {
  basePrice: number;
  productId?: string;
  onPriceChange?: (region: string, price: number) => void;
  showTax?: boolean;
  showShipping?: boolean;
  className?: string;
}

const regions: Region[] = [
  {
    code: 'TR',
    name: 'Türkiye',
    currency: 'TRY',
    currencySymbol: '₺',
    flag: '🇹🇷',
    taxRate: 0.20, // KDV
    shippingCost: 0,
    priceMultiplier: 1.0,
    isAvailable: true
  },
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    flag: '🇺🇸',
    taxRate: 0.08, // Ortalama satış vergisi
    shippingCost: 15,
    priceMultiplier: 0.033,
    isAvailable: true
  },
  {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇩🇪',
    taxRate: 0.19, // KDV
    shippingCost: 25,
    priceMultiplier: 0.030,
    isAvailable: true
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    currencySymbol: '£',
    flag: '🇬🇧',
    taxRate: 0.20, // VAT
    shippingCost: 20,
    priceMultiplier: 0.026,
    isAvailable: true
  },
  {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    currencySymbol: '€',
    flag: '🇫🇷',
    taxRate: 0.20, // TVA
    shippingCost: 25,
    priceMultiplier: 0.030,
    isAvailable: true
  },
  {
    code: 'JP',
    name: 'Japan',
    currency: 'JPY',
    currencySymbol: '¥',
    flag: '🇯🇵',
    taxRate: 0.10, // Tüketim vergisi
    shippingCost: 30,
    priceMultiplier: 4.8,
    isAvailable: true
  },
  {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    currencySymbol: 'C$',
    flag: '🇨🇦',
    taxRate: 0.13, // Ortalama HST
    shippingCost: 18,
    priceMultiplier: 0.045,
    isAvailable: true
  },
  {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    currencySymbol: 'A$',
    flag: '🇦🇺',
    taxRate: 0.10, // GST
    shippingCost: 35,
    priceMultiplier: 0.050,
    isAvailable: true
  },
  {
    code: 'RU',
    name: 'Russia',
    currency: 'RUB',
    currencySymbol: '₽',
    flag: '🇷🇺',
    taxRate: 0.20, // НДС
    shippingCost: 40,
    priceMultiplier: 3.0,
    isAvailable: false // Örnek: Rusya'ya satış yok
  },
  {
    code: 'CN',
    name: 'China',
    currency: 'CNY',
    currencySymbol: '¥',
    flag: '🇨🇳',
    taxRate: 0.13, // VAT
    shippingCost: 20,
    priceMultiplier: 0.24,
    isAvailable: true
  }
];

export default function RegionalPricing({
  basePrice,
  productId,
  onPriceChange,
  showTax = true,
  showShipping = true,
  className = ''
}: RegionalPricingProps) {
  const [selectedRegion, setSelectedRegion] = useState('TR');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/currency/exchange-rates');
      const data = await response.json();
      
      if (data.success && data.rates) {
        setExchangeRates(data.rates);
      }
    } catch (error) {
      console.error('Döviz kuru hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRegionalPrice = (region: Region) => {
    let price = basePrice * region.priceMultiplier;
    
    // Döviz kuru varsa kullan
    if (exchangeRates[region.currency]) {
      price = basePrice * exchangeRates[region.currency];
    }
    
    return price;
  };

  const calculateTotalPrice = (region: Region) => {
    const baseRegionalPrice = calculateRegionalPrice(region);
    const tax = showTax ? baseRegionalPrice * region.taxRate : 0;
    const shipping = showShipping ? region.shippingCost : 0;
    
    return baseRegionalPrice + tax + shipping;
  };

  const formatPrice = (price: number, currency: string, symbol: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formatter.format(price);
  };

  const selectedRegionData = regions.find(r => r.code === selectedRegion);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
        <span className="text-gray-600">Fiyatlar hesaplanıyor...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Region Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <GlobeAltIcon className="w-5 h-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">Bölgesel Fiyatlandırma</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {regions.map((region) => (
            <button
              key={region.code}
              onClick={() => setSelectedRegion(region.code)}
              disabled={!region.isAvailable}
              className={`p-3 rounded-lg border transition-colors text-left ${
                selectedRegion === region.code
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : region.isAvailable
                  ? 'border-gray-200 hover:bg-gray-50'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{region.flag}</span>
                <span className="font-medium text-sm">{region.code}</span>
                {!region.isAvailable && (
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="text-xs text-gray-500">{region.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      {selectedRegionData && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <MapPinIcon className="w-5 h-5 text-gray-600" />
            <h4 className="font-medium text-gray-900">
              {selectedRegionData.name} Fiyat Detayı
            </h4>
          </div>

          <div className="space-y-3">
            {/* Base Price */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Temel Fiyat:</span>
              <span className="font-medium">
                {formatPrice(
                  calculateRegionalPrice(selectedRegionData),
                  selectedRegionData.currency,
                  selectedRegionData.currencySymbol
                )}
              </span>
            </div>

            {/* Tax */}
            {showTax && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Vergi (%{(selectedRegionData.taxRate * 100).toFixed(0)}):
                </span>
                <span className="font-medium">
                  {formatPrice(
                    calculateRegionalPrice(selectedRegionData) * selectedRegionData.taxRate,
                    selectedRegionData.currency,
                    selectedRegionData.currencySymbol
                  )}
                </span>
              </div>
            )}

            {/* Shipping */}
            {showShipping && selectedRegionData.shippingCost > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Kargo:</span>
                <span className="font-medium">
                  {formatPrice(
                    selectedRegionData.shippingCost,
                    selectedRegionData.currency,
                    selectedRegionData.currencySymbol
                  )}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Toplam:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(
                    calculateTotalPrice(selectedRegionData),
                    selectedRegionData.currency,
                    selectedRegionData.currencySymbol
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4">
            <button
              onClick={() => {
                if (onPriceChange) {
                  onPriceChange(selectedRegion, calculateTotalPrice(selectedRegionData));
                }
              }}
              disabled={!selectedRegionData.isAvailable}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                selectedRegionData.isAvailable
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedRegionData.isAvailable ? (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Bu Fiyatı Kullan</span>
                </div>
              ) : (
                'Bu Bölgeye Satış Yok'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Regional Availability Info */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <GlobeAltIcon className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Bölgesel Satış Bilgisi</h4>
            <p className="text-sm text-blue-800">
              Fiyatlar yerel vergiler ve kargo maliyetleri dahil olarak hesaplanmıştır. 
              Bazı bölgelerde satış yapılmamaktadır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
