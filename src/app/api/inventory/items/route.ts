import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const warehouse = searchParams.get('warehouse') || '';
    const lowStock = searchParams.get('lowStock') === 'true';

    let items = [];

    if (supabase) {
      // Supabase'den envanter ürünlerini çek
      let query = supabase
        .from('inventory_items')
        .select(`
          id,
          sku,
          name,
          description,
          quantity,
          unit_cost,
          selling_price,
          category_id,
          warehouse_id,
          min_stock_level,
          max_stock_level,
          status,
          created_at,
          updated_at,
          categories!inner(name),
          warehouses!inner(name)
        `)
        .order('created_at', { ascending: false });

      // Filtreler
      if (search) {
        query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%,description.ilike.%${search}%`);
      }
      if (category) {
        query = query.eq('category_id', category);
      }
      if (warehouse) {
        query = query.eq('warehouse_id', warehouse);
      }
      if (lowStock) {
        query = query.lt('quantity', 10);
      }

      // Sayfalama
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase inventory items error:', error);
        throw error;
      }

      items = data?.map(item => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        description: item.description || '',
        quantity: item.quantity || 0,
        unit_cost: item.unit_cost || 0,
        selling_price: item.selling_price || 0,
        category: (item.categories as any)?.name || 'Kategori Yok',
        warehouse: (item.warehouses as any)?.name || 'Depo Yok',
        min_stock_level: item.min_stock_level || 0,
        max_stock_level: item.max_stock_level || 0,
        status: item.status || 'active',
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || [];

    } else {
      // Fallback: Mock data
      items = [
        {
          id: '1',
          sku: 'INV-001',
          name: '3D Yazıcı FDM',
          description: 'Yüksek kaliteli FDM 3D yazıcı',
          quantity: 15,
          unit_cost: 2000,
          selling_price: 2500,
          category: 'Elektronik',
          warehouse: 'Ana Depo',
          min_stock_level: 5,
          max_stock_level: 50,
          status: 'active',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          sku: 'INV-002',
          name: '3D Yazıcı SLA',
          description: 'Profesyonel SLA 3D yazıcı',
          quantity: 8,
          unit_cost: 3000,
          selling_price: 3500,
          category: 'Elektronik',
          warehouse: 'Ana Depo',
          min_stock_level: 3,
          max_stock_level: 30,
          status: 'active',
          created_at: '2024-01-20T10:00:00Z',
          updated_at: '2024-01-20T10:00:00Z'
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total: items.length
      }
    });

  } catch (error) {
    console.error('Inventory items error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch inventory items',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...itemData } = body;

    if (action === 'create') {
      if (supabase) {
        const { data, error } = await supabase
          .from('inventory_items')
          .insert([{
            sku: itemData.sku,
            name: itemData.name,
            description: itemData.description || '',
            quantity: parseInt(itemData.quantity) || 0,
            unit_cost: parseFloat(itemData.unit_cost) || 0,
            selling_price: parseFloat(itemData.selling_price) || 0,
            category_id: itemData.category_id,
            warehouse_id: itemData.warehouse_id,
            min_stock_level: parseInt(itemData.min_stock_level) || 0,
            max_stock_level: parseInt(itemData.max_stock_level) || 0,
            status: itemData.status || 'active'
          }])
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Inventory item created successfully',
          data
        });
      } else {
        // Fallback: Mock creation
        const newItem = {
          id: Date.now().toString(),
          ...itemData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          message: 'Inventory item created successfully (mock)',
          data: newItem
        });
      }
    }

    if (action === 'update' && id) {
      if (supabase) {
        const { data, error } = await supabase
          .from('inventory_items')
          .update({
            name: itemData.name,
            description: itemData.description,
            quantity: parseInt(itemData.quantity) || 0,
            unit_cost: parseFloat(itemData.unit_cost) || 0,
            selling_price: parseFloat(itemData.selling_price) || 0,
            category_id: itemData.category_id,
            warehouse_id: itemData.warehouse_id,
            min_stock_level: parseInt(itemData.min_stock_level) || 0,
            max_stock_level: parseInt(itemData.max_stock_level) || 0,
            status: itemData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Inventory item updated successfully',
          data
        });
      } else {
        // Fallback: Mock update
        return NextResponse.json({
          success: true,
          message: 'Inventory item updated successfully (mock)',
          data: { id, ...itemData }
        });
      }
    }

    if (action === 'delete' && id) {
      if (supabase) {
        const { error } = await supabase
          .from('inventory_items')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Inventory item deleted successfully'
        });
      } else {
        // Fallback: Mock delete
        return NextResponse.json({
          success: true,
          message: 'Inventory item deleted successfully (mock)'
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Inventory items error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process inventory item request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}