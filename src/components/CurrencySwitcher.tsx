'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CurrencyDollarIcon,
  ChevronDownIcon,
  CheckIcon,
  ArrowPathIcon
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

interface CurrencySwitcherProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'dropdown' | 'buttons' | 'select';
  onCurrencyChange?: (currency: Currency) => void;
}

export default function CurrencySwitcher({ 
  className = '', 
  showLabel = true,
  variant = 'dropdown',
  onCurrencyChange
}: CurrencySwitcherProps) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [currentCurrency, setCurrentCurrency] = useState<Currency | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const router = useRouter();

  const fetchCurrencies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/i18n/currencies');
      if (response.ok) {
        const data = await response.json();
        const activeCurrencies = data.filter((currency: Currency) => currency.is_active);
        setCurrencies(activeCurrencies);
        
        // Get user's preferred currency or default
        const userCurrency = await getUserPreferredCurrency();
        const defaultCurrency = activeCurrencies.find((c: Currency) => c.is_default) || activeCurrencies[0];
        setCurrentCurrency(userCurrency || defaultCurrency);
      }
    } catch (error) {
      console.error('Error fetching currencies:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  const getUserPreferredCurrency = async (): Promise<Currency | null> => {
    try {
      const response = await fetch('/api/i18n/user-preferences?type=currency');
      if (response.ok) {
        const data = await response.json();
        return data.currency;
      }
    } catch (error) {
      console.error('Error fetching user currency preference:', error);
    }
    return null;
  };

  const handleCurrencyChange = async (currency: Currency) => {
    try {
      setUpdating(true);
      
      // Save currency preference
      await fetch('/api/i18n/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          currency: currency.code,
          type: 'currency'
        })
      });

      setCurrentCurrency(currency);
      setIsOpen(false);
      
      // Notify parent component
      if (onCurrencyChange) {
        onCurrencyChange(currency);
      }

      // Update localStorage for immediate effect
      localStorage.setItem('preferred-currency', JSON.stringify(currency));
      
      // Refresh the page to apply currency changes
      router.refresh();
    } catch (error) {
      console.error('Error changing currency:', error);
    } finally {
      setUpdating(false);
    }
  };

  const updateExchangeRates = async () => {
    try {
      setUpdating(true);
      const response = await fetch('/api/i18n/currencies/update-rates', {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchCurrencies();
      }
    } catch (error) {
      console.error('Error updating exchange rates:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price: number, currency: Currency) => {
    const convertedPrice = price * currency.exchange_rate;
    
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.decimal_places,
      maximumFractionDigits: currency.decimal_places,
    }).format(convertedPrice);
  };

  if (loading || !currentCurrency) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <CurrencyDollarIcon className="w-5 h-5 text-gray-400 animate-pulse" />
        {showLabel && <span className="text-sm text-gray-400">Yükleniyor...</span>}
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">Para Birimi:</span>
        )}
        <div className="flex space-x-1">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleCurrencyChange(currency)}
              disabled={updating}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                currentCurrency.code === currency.code
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={`${currency.name} (${currency.exchange_rate.toFixed(6)})`}
            >
              {currency.symbol} {currency.code}
            </button>
          ))}
        </div>
        <button
          onClick={updateExchangeRates}
          disabled={updating}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Kurları Güncelle"
        >
          <ArrowPathIcon className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
        </button>
      </div>
    );
  }

  if (variant === 'select') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">Para Birimi:</span>
        )}
        <select
          value={currentCurrency.code}
          onChange={(e) => {
            const currency = currencies.find(c => c.code === e.target.value);
            if (currency) handleCurrencyChange(currency);
          }}
          disabled={updating}
          className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.name} ({currency.code})
            </option>
          ))}
        </select>
        <button
          onClick={updateExchangeRates}
          disabled={updating}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Kurları Güncelle"
        >
          <ArrowPathIcon className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
        </button>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={updating}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
      >
        <CurrencyDollarIcon className="w-4 h-4" />
        {showLabel && <span>Para Birimi:</span>}
        <span className="mr-1">{currentCurrency.symbol}</span>
        <span className="hidden sm:inline">{currentCurrency.code}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Para Birimi Seçin</h3>
                <button
                  onClick={updateExchangeRates}
                  disabled={updating}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Kurları Güncelle"
                >
                  <ArrowPathIcon className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            <div className="py-1 max-h-64 overflow-y-auto">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => handleCurrencyChange(currency)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left hover:bg-gray-100 ${
                    currentCurrency.code === currency.code ? 'bg-green-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-medium">{currency.symbol}</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {currency.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {currency.code} • 1 TRY = {currency.exchange_rate.toFixed(6)} {currency.code}
                      </div>
                    </div>
                  </div>
                  {currentCurrency.code === currency.code && (
                    <CheckIcon className="w-4 h-4 text-green-600" />
                  )}
                </button>
              ))}
            </div>
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500">
                Son güncelleme: {new Date(currentCurrency.last_updated).toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
