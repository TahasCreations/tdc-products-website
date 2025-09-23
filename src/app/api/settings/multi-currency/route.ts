import { NextRequest, NextResponse } from 'next/server';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
  lastUpdated: string;
  isActive: boolean;
  isDefault: boolean;
  decimalPlaces: number;
  position: 'before' | 'after';
}

interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  timestamp: string;
  source: string;
  isLive: boolean;
}

interface CurrencyConversion {
  id: string;
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  timestamp: string;
  fee: number;
}

// Mock currency data with real exchange rates (simulated)
const mockCurrencies: Currency[] = [
  {
    code: 'TRY',
    name: 'Türk Lirası',
    symbol: '₺',
    rate: 1.0,
    lastUpdated: '2024-01-15T10:30:00Z',
    isActive: true,
    isDefault: true,
    decimalPlaces: 2,
    position: 'after'
  },
  {
    code: 'USD',
    name: 'Amerikan Doları',
    symbol: '$',
    rate: 0.033,
    lastUpdated: '2024-01-15T10:30:00Z',
    isActive: true,
    isDefault: false,
    decimalPlaces: 2,
    position: 'before'
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rate: 0.030,
    lastUpdated: '2024-01-15T10:30:00Z',
    isActive: true,
    isDefault: false,
    decimalPlaces: 2,
    position: 'before'
  },
  {
    code: 'GBP',
    name: 'İngiliz Sterlini',
    symbol: '£',
    rate: 0.026,
    lastUpdated: '2024-01-15T10:30:00Z',
    isActive: true,
    isDefault: false,
    decimalPlaces: 2,
    position: 'before'
  },
  {
    code: 'JPY',
    name: 'Japon Yeni',
    symbol: '¥',
    rate: 4.85,
    lastUpdated: '2024-01-15T10:30:00Z',
    isActive: true,
    isDefault: false,
    decimalPlaces: 0,
    position: 'before'
  },
  {
    code: 'CNY',
    name: 'Çin Yuanı',
    symbol: '¥',
    rate: 0.24,
    lastUpdated: '2024-01-15T10:30:00Z',
    isActive: false,
    isDefault: false,
    decimalPlaces: 2,
    position: 'before'
  }
];

const mockExchangeRates: ExchangeRate[] = [
  {
    id: '1',
    fromCurrency: 'TRY',
    toCurrency: 'USD',
    rate: 0.033,
    timestamp: '2024-01-15T10:30:00Z',
    source: 'Central Bank of Turkey',
    isLive: true
  },
  {
    id: '2',
    fromCurrency: 'TRY',
    toCurrency: 'EUR',
    rate: 0.030,
    timestamp: '2024-01-15T10:30:00Z',
    source: 'European Central Bank',
    isLive: true
  },
  {
    id: '3',
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    rate: 0.91,
    timestamp: '2024-01-15T10:30:00Z',
    source: 'Federal Reserve',
    isLive: true
  }
];

const mockConversions: CurrencyConversion[] = [
  {
    id: '1',
    fromAmount: 1000,
    fromCurrency: 'TRY',
    toAmount: 33.00,
    toCurrency: 'USD',
    rate: 0.033,
    timestamp: '2024-01-15T10:30:00Z',
    fee: 0.50
  },
  {
    id: '2',
    fromAmount: 500,
    fromCurrency: 'USD',
    toAmount: 15151.52,
    toCurrency: 'TRY',
    rate: 30.30,
    timestamp: '2024-01-15T09:15:00Z',
    fee: 1.00
  }
];

// Simulate real-time exchange rate updates
function updateExchangeRates() {
  const now = new Date().toISOString();
  
  // Simulate rate fluctuations
  mockCurrencies.forEach(currency => {
    if (currency.code !== 'TRY') {
      const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
      currency.rate = Math.max(0.001, currency.rate + fluctuation);
      currency.lastUpdated = now;
    }
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const currency = searchParams.get('currency');
    const includeRates = searchParams.get('includeRates') === 'true';

    // Update rates for real-time simulation
    updateExchangeRates();

    switch (action) {
      case 'currencies':
        let currencies = mockCurrencies;
        
        if (currency) {
          currencies = currencies.filter(c => c.code === currency);
        }

        return NextResponse.json({
          success: true,
          data: {
            currencies,
            lastUpdated: new Date().toISOString(),
            totalActive: currencies.filter(c => c.isActive).length
          }
        });

      case 'rates':
        return NextResponse.json({
          success: true,
          data: {
            rates: mockExchangeRates,
            lastUpdated: new Date().toISOString()
          }
        });

      case 'conversions':
        return NextResponse.json({
          success: true,
          data: {
            conversions: mockConversions.slice(0, 10),
            total: mockConversions.length
          }
        });

      default:
        const response: any = {
          success: true,
          data: {
            currencies: mockCurrencies,
            lastUpdated: new Date().toISOString()
          }
        };

        if (includeRates) {
          response.data.rates = mockExchangeRates;
        }

        return NextResponse.json(response);
    }

  } catch (error) {
    console.error('Multi-Currency API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Para birimi verileri alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, currencyData, conversionData } = body;

    switch (action) {
      case 'add_currency':
        const newCurrency: Currency = {
          code: currencyData.code,
          name: currencyData.name,
          symbol: currencyData.symbol,
          rate: currencyData.rate || 1.0,
          lastUpdated: new Date().toISOString(),
          isActive: true,
          isDefault: false,
          decimalPlaces: currencyData.decimalPlaces || 2,
          position: currencyData.position || 'after'
        };

        // Check if currency already exists
        const existingCurrency = mockCurrencies.find(c => c.code === newCurrency.code);
        if (existingCurrency) {
          return NextResponse.json(
            { success: false, error: 'Bu para birimi zaten mevcut' },
            { status: 400 }
          );
        }

        mockCurrencies.push(newCurrency);

        return NextResponse.json({
          success: true,
          data: newCurrency,
          message: 'Para birimi başarıyla eklendi'
        });

      case 'update_rates':
        const { rates } = currencyData;
        
        rates.forEach((rate: any) => {
          const currency = mockCurrencies.find(c => c.code === rate.code);
          if (currency) {
            currency.rate = rate.rate;
            currency.lastUpdated = new Date().toISOString();
          }
        });

        return NextResponse.json({
          success: true,
          message: 'Döviz kurları başarıyla güncellendi',
          data: {
            updated: rates.length,
            timestamp: new Date().toISOString()
          }
        });

      case 'convert':
        const { fromAmount, fromCurrency, toCurrency } = conversionData;
        
        const fromCurr = mockCurrencies.find(c => c.code === fromCurrency);
        const toCurr = mockCurrencies.find(c => c.code === toCurrency);

        if (!fromCurr || !toCurr) {
          return NextResponse.json(
            { success: false, error: 'Geçersiz para birimi' },
            { status: 400 }
          );
        }

        // Convert to base currency (TRY) first, then to target currency
        const baseAmount = fromCurrency === 'TRY' ? fromAmount : fromAmount / fromCurr.rate;
        const convertedAmount = toCurrency === 'TRY' ? baseAmount : baseAmount * toCurr.rate;
        
        const conversion: CurrencyConversion = {
          id: Date.now().toString(),
          fromAmount,
          fromCurrency,
          toAmount: Math.round(convertedAmount * 100) / 100,
          toCurrency,
          rate: toCurr.rate / fromCurr.rate,
          timestamp: new Date().toISOString(),
          fee: 0.5 // Simulate conversion fee
        };

        mockConversions.unshift(conversion);

        return NextResponse.json({
          success: true,
          data: conversion,
          message: 'Dönüşüm başarıyla yapıldı'
        });

      case 'toggle_currency':
        const { currencyCode, isActive } = currencyData;
        const currency = mockCurrencies.find(c => c.code === currencyCode);
        
        if (currency) {
          currency.isActive = isActive;
          currency.lastUpdated = new Date().toISOString();
        }

        return NextResponse.json({
          success: true,
          message: `Para birimi ${isActive ? 'aktif' : 'pasif'} hale getirildi`
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Geçersiz işlem' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Multi-Currency Action Error:', error);
    return NextResponse.json(
      { success: false, error: 'İşlem sırasında hata oluştu' },
      { status: 500 }
    );
  }
}
