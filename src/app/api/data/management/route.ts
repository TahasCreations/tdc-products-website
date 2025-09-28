import { NextRequest, NextResponse } from 'next/server';
import { fileStorageManager } from '../../../../lib/file-storage-manager';

export const dynamic = 'force-dynamic';

// Veri yönetimi işlemleri
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create-backup':
        await fileStorageManager.createBackup(data.type || 'all');
        return NextResponse.json({
          success: true,
          message: 'Backup oluşturuldu'
        });

      case 'clear-demo':
        await fileStorageManager.clearDemoData();
        return NextResponse.json({
          success: true,
          message: 'Demo veriler temizlendi'
        });

      case 'clear-all':
        await fileStorageManager.clearAllData();
        return NextResponse.json({
          success: true,
          message: 'Tüm veriler temizlendi'
        });

      case 'export':
        const exportData = await fileStorageManager.exportData();
        return NextResponse.json({
          success: true,
          data: exportData,
          message: 'Veriler export edildi'
        });

      case 'import':
        if (!data.jsonData) {
          return NextResponse.json({
            success: false,
            error: 'Import verisi gerekli'
          }, { status: 400 });
        }
        
        const importResult = await fileStorageManager.importData(data.jsonData);
        return NextResponse.json({
          success: importResult,
          message: importResult ? 'Veriler başarıyla import edildi' : 'Import başarısız'
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Geçersiz işlem'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Data management error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Sunucu hatası'
    }, { status: 500 });
  }
}

// Veri durumu ve klasör bilgileri
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const info = searchParams.get('info');

    if (info === 'directories') {
      return NextResponse.json({
        success: true,
        data: {
          dataDirectory: fileStorageManager.getDataDirectory(),
          backupDirectory: fileStorageManager.getBackupDirectory(),
          structure: {
            data: [
              'products.json - Ürün verileri',
              'categories.json - Kategori verileri',
              'orders.json - Sipariş verileri'
            ],
            backups: [
              'products-TIMESTAMP.json - Ürün backup\'ları',
              'categories-TIMESTAMP.json - Kategori backup\'ları',
              'orders-TIMESTAMP.json - Sipariş backup\'ları'
            ]
          }
        }
      });
    }

    if (info === 'backups') {
      const backups = await fileStorageManager.getBackups();
      return NextResponse.json({
        success: true,
        data: backups
      });
    }

    // Genel bilgiler
    const products = await fileStorageManager.getProducts();
    const categories = await fileStorageManager.getCategories();
    const orders = await fileStorageManager.getOrders();

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalProducts: products.length,
          totalCategories: categories.length,
          totalOrders: orders.length,
          demoProducts: products.filter(p => p.isDemo).length,
          demoCategories: categories.filter(c => c.isDemo).length,
          demoOrders: orders.filter(o => o.isDemo).length
        },
        directories: {
          data: fileStorageManager.getDataDirectory(),
          backup: fileStorageManager.getBackupDirectory()
        }
      }
    });

  } catch (error) {
    console.error('Data info error:', error);
    return NextResponse.json({
      success: false,
      error: 'Veri bilgileri alınamadı'
    }, { status: 500 });
  }
}
