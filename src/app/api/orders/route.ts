import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Siparişleri getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customer_id = searchParams.get('customer_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_sku,
          product_image,
          quantity,
          unit_price,
          total_price
        ),
        order_shipping (
          id,
          shipping_company,
          tracking_number,
          status,
          estimated_delivery_date,
          actual_delivery_date
        )
      `);

    // Durum filtresi
    if (status) {
      query = query.eq('status', status);
    }

    // Müşteri filtresi
    if (customer_id) {
      query = query.eq('customer_id', customer_id);
    }

    // Sıralama
    query = query.order(sort, { ascending: order === 'asc' });

    // Sayfalama
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: orders, error, count } = await query;

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Siparişler alınamadı' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Sipariş oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_city,
      customer_postal_code,
      payment_method,
      shipping_method,
      shipping_cost,
      tax_amount,
      discount_amount,
      subtotal,
      total_amount,
      currency_code,
      notes,
      items
    } = body;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Sipariş oluştur
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id,
        customer_name,
        customer_email,
        customer_phone,
        customer_address,
        customer_city,
        customer_postal_code,
        payment_method,
        shipping_method,
        shipping_cost,
        tax_amount,
        discount_amount,
        subtotal,
        total_amount,
        currency_code,
        notes
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Sipariş oluşturulamadı' 
      }, { status: 500 });
    }

    // Sipariş öğelerini ekle
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_sku: item.product_sku,
        product_image: item.product_image,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.quantity * item.unit_price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        // Sipariş oluşturuldu ama öğeler eklenemedi - siparişi sil
        await supabase.from('orders').delete().eq('id', order.id);
        return NextResponse.json({ 
          success: false, 
          error: 'Sipariş öğeleri eklenemedi' 
        }, { status: 500 });
      }
    }

    // Kargo bilgilerini ekle
    if (shipping_method && shipping_method !== 'pickup') {
      const { error: shippingError } = await supabase
        .from('order_shipping')
        .insert({
          order_id: order.id,
          shipping_address: customer_address,
          shipping_city: customer_city,
          shipping_postal_code: customer_postal_code,
          shipping_cost
        });

      if (shippingError) {
        // Hata logla ama siparişi iptal etme
        console.error('Shipping info error:', shippingError);
      }
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Sipariş güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Sipariş ID gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Sipariş güncellenemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Sipariş sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Sipariş ID gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Sipariş silinemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}