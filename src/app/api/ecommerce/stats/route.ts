import { NextResponse } from 'next/server';
import { hybridStorageManager } from '../../../../lib/hybrid-storage-manager';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await hybridStorageManager.getStats();

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