'use client';

import { useState, useEffect } from 'react';
import { 
  CurrencyDollarIcon, 
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  flag: string;
}

interface CurrencyConverterProps {
  amount: number;
  fromCurrency?: string;
  toCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
  showSelector?: boolean;
  className?: string;
}

const defaultCurrencies: Currency[] = [
  { code: 'TRY', name: 'Türk Lirası', symbol: '₺', rate: 1, flag: '🇹🇷' },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.033, flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.030, flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.026, flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 4.8, flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 0.045, flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 0.050, flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.029, flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 0.24, flag: '🇨🇳' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', rate: 3.0, flag: '🇷🇺' }
];

export default function CurrencyConverter({
  amount,
  fromCurrency = 'TRY',
  toCurrency = 'USD',
  onCurrencyChange,
  showSelector = true,
  className = ''
}: CurrencyConverterProps) {
  const [currencies, setCurrencies] = useState<Currency[]>(defaultCurrencies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    setLoading(true);
    setError(null);

    try {
      // Gerçek döviz kuru API'si (örnek: exchangerate-api.com)
      const response = await fetch('/api/currency/exchange-rates');
      const data = await response.json();

      if (data.success && data.rates) {
        const updatedCurrencies = defaultCurrencies.map(currency => ({
          ...currency,
          rate: data.rates[currency.code] || currency.rate
        }));
        setCurrencies(updatedCurrencies);
        setLastUpdated(new Date());
      } else {
        // Fallback: Mock rates
        setCurrencies(defaultCurrencies);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Döviz kuru hatası:', error);
      setError('Döviz kurları yüklenemedi');
      setCurrencies(defaultCurrencies);
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = (amount: number, from: string, to: string): number => {
    const fromCurrency = currencies.find(c => c.code === from);
    const toCurrency = currencies.find(c => c.code === to);

    if (!fromCurrency || !toCurrency) return amount;

    // TRY'den diğer para birimlerine dönüştürme
    if (from === 'TRY') {
      return amount * toCurrency.rate;
    }

    // Diğer para birimlerinden TRY'ye dönüştürme
    if (to === 'TRY') {
      return amount / fromCurrency.rate;
    }

    // İki farklı para birimi arasında dönüştürme
    const tryAmount = amount / fromCurrency.rate;
    return tryAmount * toCurrency.rate;
  };

  const formatCurrency = (amount: number, currencyCode: string): string => {
    const currency = currencies.find(c => c.code === currencyCode);
    if (!currency) return amount.toString();

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return formatter.format(amount);
  };

  const convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
  const fromCurrencyData = currencies.find(c => c.code === fromCurrency);
  const toCurrencyData = currencies.find(c => c.code === toCurrency);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <ArrowPathIcon className="w-5 h-5 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Döviz kurları yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2" />
        <span className="text-red-600">{error}</span>
        <button
          onClick={fetchExchangeRates}
          className="ml-2 text-blue-600 hover:text-blue-800"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Currency Display */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CurrencyDollarIcon className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Para Birimi Dönüştürücü</span>
          </div>
          <button
            onClick={fetchExchangeRates}
            disabled={loading}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Kurları Yenile"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-3">
          {/* From Currency */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {fromCurrencyData && (
                <>
                  <span className="text-lg">{fromCurrencyData.flag}</span>
                  <span className="font-medium text-gray-700">{fromCurrencyData.code}</span>
                </>
              )}
            </div>
            <div className="flex-1 text-right">
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(amount, fromCurrency)}
              </span>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">→</span>
            </div>
          </div>

          {/* To Currency */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {toCurrencyData && (
                <>
                  <span className="text-lg">{toCurrencyData.flag}</span>
                  <span className="font-medium text-gray-700">{toCurrencyData.code}</span>
                </>
              )}
            </div>
            <div className="flex-1 text-right">
              <span className="text-lg font-semibold text-blue-600">
                {formatCurrency(convertedAmount, toCurrency)}
              </span>
            </div>
          </div>
        </div>

        {lastUpdated && (
          <div className="mt-3 text-xs text-gray-500 text-center">
            Son güncelleme: {lastUpdated.toLocaleString('tr-TR')}
          </div>
        )}
      </div>

      {/* Currency Selector */}
      {showSelector && onCurrencyChange && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-3">Para Birimi Seçin</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => onCurrencyChange(currency.code)}
                className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${
                  toCurrency === currency.code
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{currency.flag}</span>
                <div className="text-left">
                  <div className="font-medium text-sm">{currency.code}</div>
                  <div className="text-xs text-gray-500">{currency.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
