import { NextResponse } from 'next/server';
import { localStorageManager } from '../../../../lib/local-storage-manager';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await localStorageManager.getStats();

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Ecommerce stats error:', error);
    return NextResponse.json({
      success: false,
      error: 'İstatistikler alınamadı'
    }, { status: 500 });
  }
}