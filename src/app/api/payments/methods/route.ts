import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Simulated payment methods - in production, these would come from your payment providers
    const paymentMethods = [
      {
        id: 'credit-card',
        name: 'Kredi Kartı',
        type: 'card',
        icon: 'ri-bank-card-line',
        enabled: true,
        fees: {
          percentage: 2.9,
          fixed: 0.30
        },
        processingTime: 'Anında',
        supportedCurrencies: ['TRY', 'USD', 'EUR'],
        provider: 'iyzico',
        features: ['3D Secure', 'Taksit', 'Bonus Puan']
      },
      {
        id: 'bank-transfer',
        name: 'Banka Havalesi',
        type: 'bank',
        icon: 'ri-bank-line',
        enabled: true,
        fees: {
          percentage: 0,
          fixed: 0
        },
        processingTime: '1-2 İş Günü',
        supportedCurrencies: ['TRY'],
        provider: 'bank',
        features: ['Düşük Maliyet', 'Güvenli']
      },
      {
        id: 'bitcoin',
        name: 'Bitcoin',
        type: 'crypto',
        icon: 'ri-bit-coin-line',
        enabled: true,
        fees: {
          percentage: 1.5,
          fixed: 0
        },
        processingTime: '10-30 Dakika',
        supportedCurrencies: ['BTC'],
        provider: 'coinbase',
        features: ['Düşük Komisyon', 'Hızlı', 'Global']
      },
      {
        id: 'ethereum',
        name: 'Ethereum',
        type: 'crypto',
        icon: 'ri-ethereum-line',
        enabled: true,
        fees: {
          percentage: 1.5,
          fixed: 0
        },
        processingTime: '2-5 Dakika',
        supportedCurrencies: ['ETH'],
        provider: 'coinbase',
        features: ['Hızlı', 'Akıllı Sözleşmeler']
      },
      {
        id: 'mobile-payment',
        name: 'Mobil Ödeme',
        type: 'mobile',
        icon: 'ri-smartphone-line',
        enabled: true,
        fees: {
          percentage: 3.5,
          fixed: 0.50
        },
        processingTime: 'Anında',
        supportedCurrencies: ['TRY'],
        provider: 'papara',
        features: ['Kolay Kullanım', 'Hızlı']
      },
      {
        id: 'paypal',
        name: 'PayPal',
        type: 'digital_wallet',
        icon: 'ri-paypal-line',
        enabled: true,
        fees: {
          percentage: 3.4,
          fixed: 0.35
        },
        processingTime: 'Anında',
        supportedCurrencies: ['USD', 'EUR', 'TRY'],
        provider: 'paypal',
        features: ['Global', 'Güvenli', 'Kolay']
      },
      {
        id: 'apple-pay',
        name: 'Apple Pay',
        type: 'digital_wallet',
        icon: 'ri-apple-line',
        enabled: true,
        fees: {
          percentage: 2.9,
          fixed: 0.30
        },
        processingTime: 'Anında',
        supportedCurrencies: ['TRY', 'USD', 'EUR'],
        provider: 'apple',
        features: ['Touch ID', 'Face ID', 'Güvenli']
      },
      {
        id: 'google-pay',
        name: 'Google Pay',
        type: 'digital_wallet',
        icon: 'ri-google-line',
        enabled: true,
        fees: {
          percentage: 2.9,
          fixed: 0.30
        },
        processingTime: 'Anında',
        supportedCurrencies: ['TRY', 'USD', 'EUR'],
        provider: 'google',
        features: ['Fingerprint', 'PIN', 'Güvenli']
      },
      {
        id: 'klarna',
        name: 'Klarna',
        type: 'digital_wallet',
        icon: 'ri-bank-card-line',
        enabled: false, // Not available in Turkey yet
        fees: {
          percentage: 2.9,
          fixed: 0.30
        },
        processingTime: 'Anında',
        supportedCurrencies: ['EUR', 'USD'],
        provider: 'klarna',
        features: ['Taksit', 'Sonra Öde']
      }
    ];

    // Filter enabled methods and add real-time status
    const activeMethods = await Promise.all(paymentMethods.map(async method => ({
      ...method,
      status: await checkProviderStatus(method.provider),
      estimatedFee: calculateEstimatedFee(method.fees, 100) // Example for 100 TRY
    })));

    return NextResponse.json(activeMethods);

  } catch (error) {
    console.error('Payment methods error:', error);
    return NextResponse.json(
      { error: 'Ödeme yöntemleri yüklenemedi' },
      { status: 500 }
    );
  }
}

async function checkProviderStatus(provider: string): Promise<'active' | 'maintenance' | 'error'> {
  // Simulate provider status check
  const statuses: Record<string, 'active' | 'maintenance' | 'error'> = {
    'iyzico': 'active',
    'bank': 'active',
    'coinbase': 'active',
    'papara': 'active',
    'paypal': 'active',
    'apple': 'active',
    'google': 'active',
    'klarna': 'maintenance'
  };

  return statuses[provider] || 'error';
}

function calculateEstimatedFee(fees: { percentage: number; fixed: number }, amount: number): number {
  return (amount * fees.percentage / 100) + fees.fixed;
}
