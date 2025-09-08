import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Stok verilerini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    if (type === 'dashboard') {
      // Dashboard için stok özeti
      const { data: inventory, error: inventoryError } = await supabase
        .from('inventory')
        .select(`
          *,
          product:product_id (
            name,
            sku,
            price
          )
        `);

      if (inventoryError) {
        console.error('Inventory fetch error:', inventoryError);
        return NextResponse.json({ 
          success: false, 
          error: 'Stok verileri alınamadı' 
        }, { status: 500 });
      }

      // Stok uyarıları
      const { data: alerts, error: alertsError } = await supabase
        .from('stock_alerts')
        .select(`
          *,
          product:product_id (
            name,
            sku
          )
        `)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (alertsError) {
        console.error('Alerts fetch error:', alertsError);
      }

      // İstatistikler
      const totalProducts = inventory?.length || 0;
      const lowStockCount = inventory?.filter(item => item.current_stock <= item.minimum_stock).length || 0;
      const outOfStockCount = inventory?.filter(item => item.current_stock <= 0).length || 0;
      const totalStockValue = inventory?.reduce((sum, item) => {
        return sum + (item.current_stock * (item.cost_price || 0));
      }, 0) || 0;

      return NextResponse.json({
        success: true,
        data: {
          totalProducts,
          lowStockCount,
          outOfStockCount,
          totalStockValue,
          inventory: inventory || [],
          alerts: alerts || []
        }
      });
    }

    if (type === 'products') {
      // Ürünleri getir
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Products fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Ürünler alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        products: products || []
      });
    }

    if (type === 'suppliers') {
      // Tedarikçileri getir
      const { data: suppliers, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Suppliers fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Tedarikçiler alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        suppliers: suppliers || []
      });
    }

    if (type === 'stock_movements') {
      // Stok hareketlerini getir
      const { data: movements, error } = await supabase
        .from('stock_movements')
        .select(`
          *,
          product:product_id (
            name,
            sku
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Stock movements fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Stok hareketleri alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        movements: movements || []
      });
    }

    if (type === 'purchase_orders') {
      // Satın alma siparişlerini getir
      const { data: orders, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          supplier:supplier_id (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Purchase orders fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Satın alma siparişleri alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        orders: orders || []
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz tip parametresi' 
    }, { status: 400 });

  } catch (error) {
    console.error('Inventory API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Stok işlemleri
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    if (action === 'add_stock') {
      const {
        product_id,
        quantity,
        reason,
        location,
        cost_per_unit,
        created_by
      } = data;

      // Mevcut stok miktarını al
      const { data: currentInventory, error: inventoryError } = await supabase
        .from('inventory')
        .select('current_stock')
        .eq('product_id', product_id)
        .single();

      if (inventoryError) {
        console.error('Get current stock error:', inventoryError);
        return NextResponse.json({ 
          success: false, 
          error: 'Mevcut stok bilgisi alınamadı' 
        }, { status: 500 });
      }

      const previousStock = currentInventory.current_stock;
      const newStock = previousStock + quantity;

      // Stok hareketi kaydet
      const { data: movement, error: movementError } = await supabase
        .from('stock_movements')
        .insert({
          product_id,
          movement_type: 'in',
          quantity,
          previous_stock: previousStock,
          new_stock: newStock,
          reference_type: 'adjustment',
          reason,
          location_to: location,
          cost_per_unit,
          total_cost: quantity * (cost_per_unit || 0),
          created_by
        })
        .select()
        .single();

      if (movementError) {
        console.error('Add stock movement error:', movementError);
        return NextResponse.json({ 
          success: false, 
          error: 'Stok hareketi kaydedilemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        movement
      });
    }

    if (action === 'remove_stock') {
      const {
        product_id,
        quantity,
        reason,
        location,
        created_by
      } = data;

      // Mevcut stok miktarını al
      const { data: currentInventory, error: inventoryError } = await supabase
        .from('inventory')
        .select('current_stock')
        .eq('product_id', product_id)
        .single();

      if (inventoryError) {
        console.error('Get current stock error:', inventoryError);
        return NextResponse.json({ 
          success: false, 
          error: 'Mevcut stok bilgisi alınamadı' 
        }, { status: 500 });
      }

      if (currentInventory.current_stock < quantity) {
        return NextResponse.json({ 
          success: false, 
          error: 'Yetersiz stok miktarı' 
        }, { status: 400 });
      }

      const previousStock = currentInventory.current_stock;
      const newStock = previousStock - quantity;

      // Stok hareketi kaydet
      const { data: movement, error: movementError } = await supabase
        .from('stock_movements')
        .insert({
          product_id,
          movement_type: 'out',
          quantity,
          previous_stock: previousStock,
          new_stock: newStock,
          reference_type: 'adjustment',
          reason,
          location_from: location,
          created_by
        })
        .select()
        .single();

      if (movementError) {
        console.error('Remove stock movement error:', movementError);
        return NextResponse.json({ 
          success: false, 
          error: 'Stok hareketi kaydedilemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        movement
      });
    }

    if (action === 'create_purchase_order') {
      const {
        supplier_id,
        order_date,
        expected_delivery_date,
        items,
        notes,
        created_by
      } = data;

      // Sipariş numarası oluştur
      const orderNumber = `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

      // Toplam tutarları hesapla
      let subtotal = 0;
      items.forEach((item: any) => {
        subtotal += item.quantity * item.unit_cost;
      });
      const taxAmount = subtotal * 0.20; // %20 KDV
      const totalAmount = subtotal + taxAmount;

      // Satın alma siparişi oluştur
      const { data: purchaseOrder, error: orderError } = await supabase
        .from('purchase_orders')
        .insert({
          order_number: orderNumber,
          supplier_id,
          order_date,
          expected_delivery_date,
          subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          notes,
          created_by
        })
        .select()
        .single();

      if (orderError) {
        console.error('Create purchase order error:', orderError);
        return NextResponse.json({ 
          success: false, 
          error: 'Satın alma siparişi oluşturulamadı' 
        }, { status: 500 });
      }

      // Sipariş detaylarını ekle
      const orderItems = items.map((item: any) => ({
        purchase_order_id: purchaseOrder.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_cost: item.unit_cost,
        total_cost: item.quantity * item.unit_cost
      }));

      const { error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Create purchase order items error:', itemsError);
        return NextResponse.json({ 
          success: false, 
          error: 'Sipariş detayları eklenemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        purchaseOrder
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz işlem' 
    }, { status: 400 });

  } catch (error) {
    console.error('Inventory POST API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
