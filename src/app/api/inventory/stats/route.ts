import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Envanter istatistiklerini hesapla
    const stats = {
      totalItems: 0,
      lowStockItems: 0,
      outOfStockItems: 0,
      totalValue: 0,
      categoryStats: {
        'Elektronik': 0,
        'Giyim': 0,
        'Ev & Yaşam': 0,
        'Spor': 0,
        'Kitap': 0,
        'Diğer': 0
      },
      warehouseStats: {
        'Ana Depo': 0,
        'Şube 1': 0,
        'Şube 2': 0,
        'Online': 0
      }
    };

    if (supabase) {
      // Gerçek verilerden hesapla
      const [itemsResult, categoriesResult, warehousesResult] = await Promise.all([
        supabase.from('inventory_items').select('id, quantity, unit_cost, category_id, warehouse_id'),
        supabase.from('categories').select('id, name'),
        supabase.from('warehouses').select('id, name')
      ]);

      const items = itemsResult.data || [];
      const categories = categoriesResult.data || [];
      const warehouses = warehousesResult.data || [];

      // Toplam ürün sayısı
      stats.totalItems = items.length;

      // Düşük stok (10'dan az)
      stats.lowStockItems = items.filter(item => item.quantity < 10).length;

      // Stokta olmayan ürünler
      stats.outOfStockItems = items.filter(item => item.quantity === 0).length;

      // Toplam değer
      stats.totalValue = items.reduce((sum, item) => 
        sum + (item.quantity * (item.unit_cost || 0)), 0
      );

      // Kategori istatistikleri
      items.forEach(item => {
        const category = categories.find(cat => cat.id === item.category_id);
        if (category) {
          const catName = category.name;
          if (stats.categoryStats[catName as keyof typeof stats.categoryStats] !== undefined) {
            stats.categoryStats[catName as keyof typeof stats.categoryStats]++;
          } else {
            stats.categoryStats['Diğer']++;
          }
        }
      });

      // Depo istatistikleri
      items.forEach(item => {
        const warehouse = warehouses.find(wh => wh.id === item.warehouse_id);
        if (warehouse) {
          const whName = warehouse.name;
          if (stats.warehouseStats[whName as keyof typeof stats.warehouseStats] !== undefined) {
            stats.warehouseStats[whName as keyof typeof stats.warehouseStats]++;
          }
        }
      });

    } else {
      // Fallback: Mock data
      stats.totalItems = 1250;
      stats.lowStockItems = 45;
      stats.outOfStockItems = 12;
      stats.totalValue = 2500000;
      stats.categoryStats = {
        'Elektronik': 350,
        'Giyim': 280,
        'Ev & Yaşam': 200,
        'Spor': 150,
        'Kitap': 120,
        'Diğer': 150
      };
      stats.warehouseStats = {
        'Ana Depo': 800,
        'Şube 1': 250,
        'Şube 2': 150,
        'Online': 50
      };
    }

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Inventory stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch inventory statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
