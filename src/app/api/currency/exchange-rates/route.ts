import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Cache duration: 1 hour
const CACHE_DURATION = 60 * 60 * 1000;
let cachedRates: any = null;
let lastFetch: number = 0;

export async function GET(request: NextRequest) {
  try {
    const now = Date.now();
    
    // Check if we have cached rates and they're still fresh
    if (cachedRates && (now - lastFetch) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        rates: cachedRates,
        cached: true,
        lastUpdated: new Date(lastFetch).toISOString()
      });
    }

    // Try to fetch from external API
    try {
      // Using exchangerate-api.com (free tier)
      const response = await fetch(
        'https://api.exchangerate-api.com/v4/latest/TRY',
        {
          headers: {
            'User-Agent': 'TDC-Products/1.0'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        cachedRates = data.rates;
        lastFetch = now;

        return NextResponse.json({
          success: true,
          rates: cachedRates,
          cached: false,
          lastUpdated: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('External API error:', error);
    }

    // Fallback to mock rates if external API fails
    const mockRates = {
      'TRY': 1.0,
      'USD': 0.033,
      'EUR': 0.030,
      'GBP': 0.026,
      'JPY': 4.8,
      'CAD': 0.045,
      'AUD': 0.050,
      'CHF': 0.029,
      'CNY': 0.24,
      'RUB': 3.0,
      'DKK': 0.22,
      'NOK': 0.35,
      'SEK': 0.35,
      'PLN': 0.13,
      'CZK': 0.75,
      'HUF': 12.0,
      'BGN': 0.059,
      'RON': 0.15,
      'HRK': 0.23,
      'RSD': 3.5,
      'MKD': 1.8,
      'BAM': 0.059,
      'ALL': 3.6,
      'ISK': 4.5,
      'UAH': 1.2,
      'BYN': 0.11,
      'MDL': 0.59,
      'GEL': 0.088,
      'AMD': 13.0,
      'AZN': 0.056,
      'KZT': 15.0,
      'UZS': 380.0,
      'KGS': 2.9,
      'TJS': 0.36,
      'TMT': 0.12,
      'AFN': 2.4,
      'PKR': 9.2,
      'INR': 2.7,
      'BDT': 3.6,
      'LKR': 10.8,
      'NPR': 4.4,
      'BTN': 2.7,
      'MVR': 0.51,
      'IDR': 500.0,
      'MYR': 0.15,
      'SGD': 0.044,
      'THB': 1.2,
      'VND': 800.0,
      'LAK': 68.0,
      'KHR': 135.0,
      'MMK': 70.0,
      'BND': 0.044,
      'PHP': 1.8,
      'KRW': 44.0,
      'MOP': 0.27,
      'HKD': 0.26,
      'TWD': 1.0,
      'MNT': 115.0,
      'BRL': 0.16,
      'ARS': 28.0,
      'CLP': 30.0,
      'COP': 130.0,
      'PEN': 0.12,
      'UYU': 1.3,
      'VES': 1.2,
      'BOB': 0.23,
      'PYG': 240.0,
      'GYD': 6.9,
      'SRD': 1.0,
      'TTD': 0.22,
      'JMD': 5.1,
      'BBD': 0.067,
      'BZD': 0.067,
      'XCD': 0.089,
      'AWG': 0.059,
      'BMD': 0.033,
      'KYD': 0.027,
      'BSD': 0.033,
      'BHD': 0.012,
      'QAR': 0.12,
      'AED': 0.12,
      'SAR': 0.12,
      'OMR': 0.013,
      'KWD': 0.010,
      'JOD': 0.023,
      'LBP': 0.50,
      'ILS': 0.12,
      'EGP': 1.6,
      'LYD': 0.16,
      'TND': 0.10,
      'DZD': 4.5,
      'MAD': 0.33,
      'ZAR': 0.60,
      'NGN': 13.0,
      'GHS': 0.40,
      'KES': 4.2,
      'UGX': 120.0,
      'TZS': 80.0,
      'ETB': 1.8,
      'MAD': 0.33,
      'EGP': 1.6,
      'ZAR': 0.60,
      'NGN': 13.0,
      'GHS': 0.40,
      'KES': 4.2,
      'UGX': 120.0,
      'TZS': 80.0,
      'ETB': 1.8
    };

    cachedRates = mockRates;
    lastFetch = now;

    return NextResponse.json({
      success: true,
      rates: cachedRates,
      cached: false,
      fallback: true,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Exchange rates API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Döviz kurları alınamadı' 
    }, { status: 500 });
  }
}

// Manual refresh endpoint
export async function POST(request: NextRequest) {
  try {
    // Force refresh by clearing cache
    cachedRates = null;
    lastFetch = 0;
    
    // Fetch fresh rates
    const response = await GET(request);
    return response;
  } catch (error) {
    console.error('Manual refresh error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Döviz kurları yenilenemedi' 
    }, { status: 500 });
  }
}
