import { NextRequest, NextResponse } from 'next/server';
import { fileStorageManager } from '../../../../lib/file-storage-manager';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    let orders = await fileStorageManager.getOrders();

    // Durum filtresi
    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    // En yeni siparişler önce
    orders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Limit uygula
    const limitedOrders = orders.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: limitedOrders
    });

  } catch (error) {
    console.error('Ecommerce orders error:', error);
    return NextResponse.json({
      success: false,
      error: 'Siparişler alınamadı'
    }, { status: 500 });
  }
}