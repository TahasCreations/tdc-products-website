import { NextRequest, NextResponse } from 'next/server';
import { hybridStorageManager } from '../../../../lib/hybrid-storage-manager';

export const dynamic = 'force-dynamic';

// Hibrit sync yönetimi
export async function GET(request: NextRequest) {
  try {
    const syncStatus = hybridStorageManager.getSyncStatus();
    const stats = await hybridStorageManager.getStats();

    return NextResponse.json({
      success: true,
      data: {
        syncStatus,
        stats: {
          totalProducts: stats.totalProducts,
          totalOrders: stats.totalOrders,
          totalCustomers: stats.totalCustomers,
          totalRevenue: stats.totalRevenue,
          isHybrid: stats.isHybrid
        },
        capabilities: {
          localStorage: true,
          cloudStorage: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          autoSync: true,
          manualSync: true,
          backup: true
        }
      }
    });

  } catch (error) {
    console.error('Sync status error:', error);
    return NextResponse.json({
      success: false,
      error: 'Sync durumu alınamadı'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'force-sync':
        const syncResult = await hybridStorageManager.forceSync();
        return NextResponse.json({
          success: syncResult.success,
          message: syncResult.message,
          syncStatus: hybridStorageManager.getSyncStatus()
        });

      case 'clear-sync-errors':
        const syncStatus = hybridStorageManager.getSyncStatus();
        syncStatus.syncErrors = [];
        return NextResponse.json({
          success: true,
          message: 'Sync hataları temizlendi',
          syncStatus
        });

      case 'get-sync-status':
        return NextResponse.json({
          success: true,
          syncStatus: hybridStorageManager.getSyncStatus()
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Geçersiz sync işlemi'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Sync operation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Sync işlemi başarısız'
    }, { status: 500 });
  }
}
