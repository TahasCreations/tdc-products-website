import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const buyerPlans = [
      {
        id: 'free',
        name: 'Ücretsiz',
        price: 0,
        currency: 'TRY',
        interval: 'month',
        features: [
          'Temel arama ve filtreleme',
          'Standart teslimat süreleri',
          'Temel müşteri hizmetleri',
          'Ürün inceleme yazabilme',
          'Favori listesi'
        ],
        benefits: {
          freeShipping: false,
          exclusiveDeals: false,
          prioritySupport: false,
          earlyAccess: false
        },
        popular: false
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 49,
        currency: 'TRY',
        interval: 'month',
        features: [
          'Ücretsiz kargo (100₺ üzeri)',
          'Özel indirimler ve kampanyalar',
          'Öncelikli müşteri hizmetleri',
          'Erken erişim yeni ürünlere',
          'Gelişmiş arama filtreleri',
          'Sınırsız favori listesi',
          'Özel ürün önerileri',
          'Hızlı checkout'
        ],
        benefits: {
          freeShipping: true,
          exclusiveDeals: true,
          prioritySupport: true,
          earlyAccess: true
        },
        popular: true
      },
      {
        id: 'vip',
        name: 'VIP',
        price: 99,
        currency: 'TRY',
        interval: 'month',
        features: [
          'Tüm Premium özellikler',
          'Ücretsiz kargo (tüm siparişler)',
          'Özel VIP indirimler (%10 ek)',
          'Kişisel alışveriş danışmanı',
          'Özel ürün lansmanları',
          'Sınırsız iade hakkı',
          'Özel etkinlik davetleri',
          'Öncelikli stok bildirimleri'
        ],
        benefits: {
          freeShipping: true,
          exclusiveDeals: true,
          prioritySupport: true,
          earlyAccess: true,
          personalShopper: true,
          unlimitedReturns: true
        },
        popular: false
      }
    ];

    return NextResponse.json({
      success: true,
      data: buyerPlans
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch buyer plans',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
