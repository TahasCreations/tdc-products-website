import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Get inventory data
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        current_stock,
        min_stock,
        max_stock,
        category,
        supplier,
        unit_cost,
        selling_price,
        last_restocked,
        sales_data (
          quantity_sold,
          date
        )
      `);

    if (inventoryError) {
      throw inventoryError;
    }

    // AI Inventory Optimization Algorithm
    const optimization = await generateInventoryOptimization(inventoryData);

    return NextResponse.json(optimization);

  } catch (error) {
    console.error('Inventory optimization error:', error);
    return NextResponse.json(
      { error: 'Stok optimizasyonu oluşturulamadı' },
      { status: 500 }
    );
  }
}

async function generateInventoryOptimization(inventoryData: any[]) {
  const optimizations = [];
  
  for (const item of inventoryData) {
    const currentStock = item.current_stock || 0;
    const minStock = item.min_stock || 0;
    const maxStock = item.max_stock || 0;
    
    // Calculate demand based on sales data
    const salesData = item.sales_data || [];
    const totalSales = salesData.reduce((sum: number, sale: any) => sum + (sale.quantity_sold || 0), 0);
    const avgDailySales = totalSales / Math.max(salesData.length, 1);
    
    // Calculate turnover rate
    const turnoverRate = totalSales > 0 ? (totalSales / Math.max(currentStock, 1)) : 0;
    
    // Determine optimization recommendation
    let recommendation = 'maintain';
    let confidence = 70;
    let reasoning = '';
    
    if (currentStock <= minStock) {
      recommendation = 'reorder';
      confidence = 95;
      reasoning = `Stok seviyesi minimum seviyenin altında (${currentStock}/${minStock})`;
    } else if (currentStock > maxStock) {
      recommendation = 'reduce';
      confidence = 85;
      reasoning = `Stok seviyesi maksimum seviyenin üzerinde (${currentStock}/${maxStock})`;
    } else if (turnoverRate < 0.5) {
      recommendation = 'reduce';
      confidence = 80;
      reasoning = `Düşük devir hızı (${turnoverRate.toFixed(2)})`;
    } else if (avgDailySales > 0 && currentStock < avgDailySales * 7) {
      recommendation = 'reorder';
      confidence = 75;
      reasoning = `7 günlük satış tahmini için yetersiz stok`;
    }
    
    // Calculate recommended quantity
    let recommendedQuantity = 0;
    if (recommendation === 'reorder') {
      recommendedQuantity = Math.max(maxStock - currentStock, avgDailySales * 14);
    } else if (recommendation === 'reduce') {
      recommendedQuantity = Math.max(minStock, currentStock * 0.5);
    }
    
    optimizations.push({
      itemId: item.id,
      itemName: item.name,
      currentStock,
      minStock,
      maxStock,
      turnoverRate: Math.round(turnoverRate * 100) / 100,
      avgDailySales: Math.round(avgDailySales * 100) / 100,
      recommendation,
      recommendedQuantity: Math.round(recommendedQuantity),
      confidence,
      reasoning,
      impact: recommendation === 'reorder' ? 'high' : recommendation === 'reduce' ? 'medium' : 'low',
      urgency: currentStock <= minStock ? 'critical' : 
               currentStock > maxStock ? 'high' : 
               turnoverRate < 0.3 ? 'medium' : 'low'
    });
  }
  
  return {
    confidence: Math.round(optimizations.reduce((sum, opt) => sum + opt.confidence, 0) / optimizations.length),
    optimization: {
      itemsToReorder: optimizations.filter(opt => opt.recommendation === 'reorder'),
      itemsToReduce: optimizations.filter(opt => opt.recommendation === 'reduce'),
      itemsToMaintain: optimizations.filter(opt => opt.recommendation === 'maintain'),
      totalOptimizationValue: optimizations.reduce((sum, opt) => {
        if (opt.recommendation === 'reorder') {
          return sum + (opt.recommendedQuantity * (opt.itemName.includes('cost') ? 50 : 100));
        } else if (opt.recommendation === 'reduce') {
          return sum - (opt.currentStock * 0.1 * (opt.itemName.includes('cost') ? 50 : 100));
        }
        return sum;
      }, 0)
    },
    reasoning: `Toplam ${optimizations.length} ürün analiz edildi. ${optimizations.filter(opt => opt.recommendation === 'reorder').length} ürün için sipariş önerisi, ${optimizations.filter(opt => opt.recommendation === 'reduce').length} ürün için stok azaltma önerisi.`,
    recommendations: [
      'Düşük stoklu ürünler için acil sipariş verin',
      'Fazla stoklu ürünler için promosyon kampanyası düzenleyin',
      'Düşük devir hızına sahip ürünleri gözden geçirin',
      'Stok seviyelerini düzenli olarak güncelleyin'
    ]
  };
}
