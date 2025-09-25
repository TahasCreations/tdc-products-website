import { NextRequest, NextResponse } from 'next/server';

// Optimized API route with minimal dependencies
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'health':
        return NextResponse.json({ 
          status: 'ok', 
          timestamp: new Date().toISOString() 
        });

      case 'stats':
        return NextResponse.json({
          success: true,
          stats: {
            totalRevenue: 0,
            totalOrders: 0,
            totalProducts: 0,
            totalCustomers: 0,
            conversionRate: 0,
            averageOrderValue: 0,
            monthlyGrowth: 0,
            topSellingCategory: 'Henüz kategori yok'
          }
        });

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Geçersiz işlem' 
        }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
