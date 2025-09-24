import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'seller' or 'buyer'

    // Mock subscription data
    const subscriptions = {
      seller: {
        id: 'sub_seller_123',
        planId: 'professional',
        planName: 'Profesyonel',
        status: 'active',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-02-01T00:00:00Z',
        nextBillingDate: '2024-02-01T00:00:00Z',
        price: 299,
        currency: 'TRY',
        features: [
          'Aylık 500 ürün yükleme hakkı',
          'Gelişmiş analitik raporlar',
          'Öncelikli destek',
          'Düşük komisyon oranı (%6)'
        ],
        usage: {
          productsUploaded: 245,
          maxProducts: 500,
          ordersThisMonth: 156,
          maxOrders: 1000,
          storageUsed: '2.3GB',
          maxStorage: '10GB'
        }
      },
      buyer: {
        id: 'sub_buyer_456',
        planId: 'premium',
        planName: 'Premium',
        status: 'active',
        startDate: '2024-01-15T00:00:00Z',
        endDate: '2024-02-15T00:00:00Z',
        nextBillingDate: '2024-02-15T00:00:00Z',
        price: 49,
        currency: 'TRY',
        features: [
          'Ücretsiz kargo (100₺ üzeri)',
          'Özel indirimler ve kampanyalar',
          'Öncelikli müşteri hizmetleri',
          'Erken erişim yeni ürünlere'
        ],
        benefits: {
          freeShippingUsed: 8,
          exclusiveDealsUsed: 12,
          prioritySupportUsed: 3,
          earlyAccessUsed: 5
        }
      }
    };

    return NextResponse.json({
      success: true,
      data: subscriptions[type as keyof typeof subscriptions] || null
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch subscription',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, subscriptionId, newPlanId } = body;

    switch (action) {
      case 'upgrade':
        return NextResponse.json({
          success: true,
          message: 'Subscription upgraded successfully',
          data: {
            subscriptionId,
            newPlanId,
            upgradedAt: new Date().toISOString()
          }
        });

      case 'downgrade':
        return NextResponse.json({
          success: true,
          message: 'Subscription downgraded successfully',
          data: {
            subscriptionId,
            newPlanId,
            downgradedAt: new Date().toISOString()
          }
        });

      case 'cancel':
        return NextResponse.json({
          success: true,
          message: 'Subscription cancelled successfully',
          data: {
            subscriptionId,
            cancelledAt: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        });

      case 'pause':
        return NextResponse.json({
          success: true,
          message: 'Subscription paused successfully',
          data: {
            subscriptionId,
            pausedAt: new Date().toISOString(),
            resumeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        });

      case 'resume':
        return NextResponse.json({
          success: true,
          message: 'Subscription resumed successfully',
          data: {
            subscriptionId,
            resumedAt: new Date().toISOString()
          }
        });

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to manage subscription',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
