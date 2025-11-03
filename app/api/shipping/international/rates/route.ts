import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Get international shipping rates
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { countryCode, weight, value } = body;

    if (!countryCode || !weight || !value) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production: Call shipping carriers API (DHL, FedEx, UPS, etc.)
    // For now, generate mock rates
    const rates = generateShippingRates(countryCode, weight, value);

    return NextResponse.json({
      success: true,
      rates
    });

  } catch (error) {
    console.error('International shipping rates error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate rates' },
      { status: 500 }
    );
  }
}

function generateShippingRates(countryCode: string, weight: number, value: number) {
  // Zone-based pricing
  const zones: Record<string, number> = {
    'TR': 0,
    'DE': 150, 'FR': 150, 'GB': 180, 'IT': 160, 'ES': 160, 'NL': 150, // EU
    'US': 250, 'CA': 270, // North America
    'SA': 200, 'AE': 180, 'QA': 190, // Middle East
    'CN': 220, 'JP': 240, 'KR': 230, 'SG': 210 // Asia
  };

  const basePrice = zones[countryCode] || 200;
  const weightFee = weight * 20; // 20₺ per kg

  return [
    {
      carrier: 'DHL Express',
      serviceName: 'Express Worldwide',
      estimatedDays: '3-5 iş günü',
      price: Math.round(basePrice + weightFee + 100),
      currency: 'TRY',
      trackingAvailable: true,
      insuranceIncluded: true
    },
    {
      carrier: 'FedEx',
      serviceName: 'International Priority',
      estimatedDays: '4-6 iş günü',
      price: Math.round(basePrice + weightFee + 80),
      currency: 'TRY',
      trackingAvailable: true,
      insuranceIncluded: true
    },
    {
      carrier: 'UPS',
      serviceName: 'Worldwide Saver',
      estimatedDays: '5-7 iş günü',
      price: Math.round(basePrice + weightFee + 50),
      currency: 'TRY',
      trackingAvailable: true,
      insuranceIncluded: false
    },
    {
      carrier: 'PTT',
      serviceName: 'Uluslararası Ekonomik',
      estimatedDays: '10-15 iş günü',
      price: Math.round(basePrice + weightFee),
      currency: 'TRY',
      trackingAvailable: true,
      insuranceIncluded: false
    }
  ];
}

