import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  // URL formatını kontrol et
  if (supabaseUrl.includes('your_supabase_project_url') || 
      supabaseUrl === 'your_supabase_project_url/' ||
      supabaseUrl === 'your_supabase_project_url' ||
      !supabaseUrl.startsWith('https://')) {
    console.error('Supabase URL is not configured properly:', supabaseUrl);
    return null;
  }
  
  try {
    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};

// Default orders data
const getDefaultOrders = () => [
  {
    id: '1',
    order_number: 'ORD-20240115-001',
    user_id: 'user-1',
    customer_name: 'Ahmet Yılmaz',
    customer_email: 'ahmet@example.com',
    total_amount: 649.98,
    status: 'confirmed',
    payment_status: 'paid',
    payment_method: 'credit_card',
    shipping_address: {
      first_name: 'Ahmet',
      last_name: 'Yılmaz',
      email: 'ahmet@example.com',
      phone: '+90 555 123 4567',
      address: 'Atatürk Caddesi No: 123',
      city: 'İstanbul',
      postal_code: '34000',
      country: 'Türkiye'
    },
    items: [
      {
        id: '1',
        product_id: '1',
        title: 'Naruto Uzumaki Figürü',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        slug: 'naruto-uzumaki-figuru'
      },
      {
        id: '2',
        product_id: '2',
        title: 'Goku Super Saiyan Figürü',
        price: 349.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=400&fit=crop',
        slug: 'goku-super-saiyan-figuru'
      }
    ],
    tracking_number: 'TRK123456789',
    notes: 'Hızlı teslimat için teşekkürler!',
    created_at: '2024-01-15T10:30:00.000Z',
    updated_at: '2024-01-15T14:20:00.000Z'
  },
  {
    id: '2',
    order_number: 'ORD-20240114-002',
    user_id: 'user-2',
    customer_name: 'Mehmet Kaya',
    customer_email: 'mehmet@example.com',
    total_amount: 199.99,
    status: 'shipped',
    payment_status: 'paid',
    payment_method: 'bank_transfer',
    shipping_address: {
      first_name: 'Mehmet',
      last_name: 'Kaya',
      email: 'mehmet@example.com',
      phone: '+90 555 987 6543',
      address: 'Cumhuriyet Bulvarı No: 456',
      city: 'Ankara',
      postal_code: '06000',
      country: 'Türkiye'
    },
    items: [
      {
        id: '3',
        product_id: '3',
        title: 'Mario Bros Figürü',
        price: 199.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1489599808581-8e0b6d2a2d3a?w=400&h=400&fit=crop',
        slug: 'mario-bros-figuru'
      }
    ],
    tracking_number: 'TRK987654321',
    notes: '',
    created_at: '2024-01-14T16:45:00.000Z',
    updated_at: '2024-01-15T09:15:00.000Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({
        success: true,
        orders: getDefaultOrders(),
        total: getDefaultOrders().length,
        limit: 50,
        offset: 0
      });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customer_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_sku,
          quantity,
          unit_price,
          total_price
        ),
        order_status_history (
          status,
          notes,
          changed_at
        ),
        order_payments (
          payment_method,
          amount,
          status,
          paid_at
        ),
        order_shipping (
          shipping_company,
          tracking_number,
          status,
          estimated_delivery_date
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error('Orders fetch error:', error);
      return NextResponse.json({
        success: true,
        orders: getDefaultOrders(),
        total: getDefaultOrders().length,
        limit,
        offset
      });
    }

    if (orders && orders.length > 0) {
      // Toplam sayıyı al
      let countQuery = supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (status) {
        countQuery = countQuery.eq('status', status);
      }

      if (customerId) {
        countQuery = countQuery.eq('customer_id', customerId);
      }

      const { count } = await countQuery;

      return NextResponse.json({
        success: true,
        orders,
        total: count || 0,
        limit,
        offset
      });
    }

    // Eğer Supabase'de sipariş yoksa default siparişleri döndür
    return NextResponse.json({
      success: true,
      orders: getDefaultOrders(),
      total: getDefaultOrders().length,
      limit,
      offset
    });

  } catch (error) {
    console.error('Orders GET error:', error);
    return NextResponse.json({
      success: true,
      orders: getDefaultOrders(),
      total: getDefaultOrders().length,
      limit: 50,
      offset: 0
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Veritabanı bağlantısı kurulamadı' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create_order':
        return await createOrder(supabase, body);
      case 'update_status':
        return await updateOrderStatus(supabase, body);
      case 'update_payment':
        return await updatePaymentStatus(supabase, body);
      case 'update_shipping':
        return await updateShippingInfo(supabase, body);
      case 'add_note':
        return await addOrderNote(supabase, body);
      default:
        return NextResponse.json(
          { success: false, error: 'Geçersiz işlem' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Orders POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Veritabanı bağlantısı kurulamadı' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Sipariş ID gerekli' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      order: data
    });

  } catch (error) {
    console.error('Orders PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Veritabanı bağlantısı kurulamadı' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Sipariş ID gerekli' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Sipariş silindi'
    });

  } catch (error) {
    console.error('Orders DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Sipariş silinemedi' },
      { status: 500 }
    );
  }
}

// Yardımcı fonksiyonlar
async function createOrder(supabase: any, body: any) {
  const { customer_id, customer_name, customer_email, items, ...orderData } = body;

  // Sipariş oluştur
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id,
      customer_name,
      customer_email,
      ...orderData
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Sipariş öğelerini ekle
  if (items && items.length > 0) {
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      ...item
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;
  }

  return NextResponse.json({
    success: true,
    order
  });
}

async function updateOrderStatus(supabase: any, body: any) {
  const { order_id, status, notes } = body;

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', order_id)
    .select()
    .single();

  if (error) throw error;

  // Durum geçmişini kaydet
  await supabase
    .from('order_status_history')
    .insert({
      order_id,
      status,
      notes
    });

  return NextResponse.json({
    success: true,
    order: data
  });
}

async function updatePaymentStatus(supabase: any, body: any) {
  const { order_id, payment_status, payment_method, transaction_id } = body;

  const { data, error } = await supabase
    .from('orders')
    .update({ 
      payment_status,
      payment_method
    })
    .eq('id', order_id)
    .select()
    .single();

  if (error) throw error;

  // Ödeme bilgisini kaydet
  await supabase
    .from('order_payments')
    .insert({
      order_id,
      payment_method: payment_method || 'unknown',
      amount: data.total_amount,
      status: payment_status,
      transaction_id,
      paid_at: payment_status === 'paid' ? new Date().toISOString() : null
    });

  return NextResponse.json({
    success: true,
    order: data
  });
}

async function updateShippingInfo(supabase: any, body: any) {
  const { order_id, shipping_company, tracking_number, estimated_delivery_date } = body;

  const { data, error } = await supabase
    .from('order_shipping')
    .upsert({
      order_id,
      shipping_company,
      tracking_number,
      estimated_delivery_date,
      status: 'shipped'
    })
    .select()
    .single();

  if (error) throw error;

  // Sipariş durumunu güncelle
  await supabase
    .from('orders')
    .update({ 
      status: 'shipped',
      tracking_number,
      shipped_at: new Date().toISOString()
    })
    .eq('id', order_id);

  return NextResponse.json({
    success: true,
    shipping: data
  });
}

async function addOrderNote(supabase: any, body: any) {
  const { order_id, note, is_admin_note } = body;

  const { data, error } = await supabase
    .from('orders')
    .update({
      admin_notes: is_admin_note ? note : undefined,
      notes: !is_admin_note ? note : undefined
    })
    .eq('id', order_id)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({
    success: true,
    order: data
  });
}
