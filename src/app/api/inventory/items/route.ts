import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Get inventory items
    const { data: items, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        category,
        current_stock,
        min_stock,
        max_stock,
        unit_cost,
        selling_price,
        supplier,
        location,
        warehouse,
        last_restocked,
        status
      `)
      .order('name');

    if (error) {
      throw error;
    }

    // Add calculated fields
    const itemsWithCalculations = items.map(item => ({
      ...item,
      reorderPoint: item.min_stock,
      demandForecast: Math.floor(Math.random() * 100) + 10, // Mock data
      turnoverRate: Math.random() * 5, // Mock data
      abcCategory: getABCCategory(item.current_stock, item.selling_price),
      status: item.current_stock <= item.min_stock ? 'low' : 
              item.current_stock > item.max_stock ? 'overstocked' : 'normal'
    }));

    return NextResponse.json(itemsWithCalculations);

  } catch (error) {
    console.error('Inventory items error:', error);
    return NextResponse.json(
      { error: 'Stok verileri alınamadı' },
      { status: 500 }
    );
  }
}

function getABCCategory(stock: number, price: number) {
  const value = stock * price;
  if (value > 10000) return 'A';
  if (value > 5000) return 'B';
  return 'C';
}
