import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const sellerPlans = [
      {
        id: 'starter',
        name: 'Başlangıç',
        price: 0,
        currency: 'TRY',
        interval: 'month',
        features: [
          'Aylık 50 ürün yükleme hakkı',
          'Temel analitik raporlar',
          'E-posta destek',
          'Standart komisyon oranı (%8)',
          'Temel pazarlama araçları'
        ],
        limits: {
          maxProducts: 50,
          maxOrders: 100,
          maxStorage: '1GB',
          maxApiCalls: 1000
        },
        popular: false
      },
      {
        id: 'professional',
        name: 'Profesyonel',
        price: 299,
        currency: 'TRY',
        interval: 'month',
        features: [
          'Aylık 500 ürün yükleme hakkı',
          'Gelişmiş analitik raporlar',
          'Öncelikli destek',
          'Düşük komisyon oranı (%6)',
          'Gelişmiş pazarlama araçları',
          'Stok yönetimi',
          'Otomatik fiyat güncelleme',
          'Sosyal medya entegrasyonu'
        ],
        limits: {
          maxProducts: 500,
          maxOrders: 1000,
          maxStorage: '10GB',
          maxApiCalls: 10000
        },
        popular: true
      },
      {
        id: 'enterprise',
        name: 'Kurumsal',
        price: 799,
        currency: 'TRY',
        interval: 'month',
        features: [
          'Sınırsız ürün yükleme',
          'Özel analitik dashboard',
          '7/24 telefon destek',
          'En düşük komisyon oranı (%4)',
          'Tüm pazarlama araçları',
          'Gelişmiş stok yönetimi',
          'API erişimi',
          'Özel entegrasyonlar',
          'Özel hesap yöneticisi',
          'Özel fiyatlandırma'
        ],
        limits: {
          maxProducts: -1, // Unlimited
          maxOrders: -1,
          maxStorage: '100GB',
          maxApiCalls: 100000
        },
        popular: false
      }
    ];

    return NextResponse.json({
      success: true,
      data: sellerPlans
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch seller plans',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, sellerId, paymentMethod } = body;

    // Mock subscription creation
    const subscription = {
      id: `sub_${Date.now()}`,
      planId,
      sellerId,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to create subscription',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
