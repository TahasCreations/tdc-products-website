"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Check,
  TrendingUp,
  ArrowUpDown
} from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export const CurrencySwitcher: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [isOpen, setIsOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isMounted, setIsMounted] = useState(false); // Hydration fix

  const currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  ];

  // Hydration fix
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return; // Guard clause for SSR
    
    // Load saved currency preference
    const saved = localStorage.getItem('preferred-currency');
    if (saved) {
      setSelectedCurrency(saved);
    } else {
      // Auto-detect based on location
      detectCurrency();
    }
  }, [isMounted]);

  const detectCurrency = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const currencyMap: Record<string, string> = {
        'US': 'USD',
        'GB': 'GBP',
        'TR': 'TRY',
        'JP': 'JPY',
        'EU': 'EUR',
        'CA': 'CAD',
        'AU': 'AUD',
        'CH': 'CHF',
        'CN': 'CNY',
        'IN': 'INR',
      };
      
      const detected = currencyMap[data.country_code] || 'USD';
      setSelectedCurrency(detected);
    } catch (error) {
      console.error('Failed to detect currency:', error);
    }
  };

  const handleCurrencyChange = (code: string) => {
    setSelectedCurrency(code);
    localStorage.setItem('preferred-currency', code);
    setIsOpen(false);
    
    // Trigger price update across the site
    window.dispatchEvent(new CustomEvent('currency-changed', { detail: code }));
  };

  const selected = currencies.find(c => c.code === selectedCurrency);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{selected?.symbol}</span>
        <span className="text-sm text-gray-600">{selected?.code}</span>
        <ArrowUpDown className="w-4 h-4 text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Para Birimi Seç</h3>
                </div>
                <p className="text-xs text-gray-600 mt-1">Fiyatlar otomatik güncellenir</p>
              </div>

              {/* Currency List */}
              <div className="max-h-80 overflow-y-auto">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencyChange(currency.code)}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      selectedCurrency === currency.code ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        {currency.symbol}
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-gray-900">{currency.name}</div>
                        <div className="text-xs text-gray-500">{currency.code}</div>
                      </div>
                    </div>
                    {selectedCurrency === currency.code && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>Döviz kurları günlük güncellenir</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

