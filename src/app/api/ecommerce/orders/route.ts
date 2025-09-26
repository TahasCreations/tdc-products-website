import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    let orders = [];

    if (supabase) {
      // Supabase'den siparişleri çek
      let query = supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_email,
          customer_name,
          total_amount,
          status,
          payment_status,
          shipping_status,
          created_at,
          order_items(count)
        `)
        .order('created_at', { ascending: false });

      // Filtreler
      if (status) {
        query = query.eq('status', status);
      }
      if (search) {
        query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
      }

      // Sayfalama
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase orders error:', error);
        throw error;
      }

      orders = data?.map(order => ({
        id: order.id,
        order_number: order.order_number,
        customer: order.customer_name || order.customer_email || 'Bilinmeyen Müşteri',
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        total: order.total_amount || 0,
        total_amount: order.total_amount || 0,
        status: order.status || 'pending',
        payment_status: order.payment_status || 'pending',
        items: order.order_items?.[0]?.count || 0,
        createdAt: order.created_at,
        created_at: order.created_at,
        paymentMethod: order.payment_status || 'Bilinmiyor',
        payment_method: order.payment_status || 'Bilinmiyor'
      })) || [];

    } else {
      // Fallback: Mock data
      orders = [
        {
          id: '1',
          order_number: 'ORD-2024-001',
          customer: 'Ahmet Yılmaz',
          customer_name: 'Ahmet Yılmaz',
          customer_email: 'ahmet@example.com',
          total: 2500,
          total_amount: 2500,
          status: 'processing',
          payment_status: 'paid',
          items: 2,
          createdAt: '2024-01-15T10:00:00Z',
          created_at: '2024-01-15T10:00:00Z',
          paymentMethod: 'Kredi Kartı',
          payment_method: 'Kredi Kartı'
        },
        {
          id: '2',
          order_number: 'ORD-2024-002',
          customer: 'Fatma Demir',
          customer_name: 'Fatma Demir',
          customer_email: 'fatma@example.com',
          total: 1800,
          total_amount: 1800,
          status: 'shipped',
          payment_status: 'paid',
          items: 1,
          createdAt: '2024-01-20T10:00:00Z',
          created_at: '2024-01-20T10:00:00Z',
          paymentMethod: 'Banka Havalesi',
          payment_method: 'Banka Havalesi'
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total: orders.length
      }
    });

  } catch (error) {
    console.error('E-commerce orders error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch orders',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...orderData } = body;

    if (action === 'update' && id) {
      if (supabase) {
        const { data, error } = await supabase
          .from('orders')
          .update({
            status: orderData.status,
            payment_status: orderData.payment_status,
            shipping_status: orderData.shipping_status,
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
          message: 'Order updated successfully',
          data
        });
      } else {
        // Fallback: Mock update
        return NextResponse.json({
          success: true,
          message: 'Order updated successfully (mock)',
          data: { id, ...orderData }
        });
      }
    }

    if (action === 'delete' && id) {
      if (supabase) {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Order deleted successfully'
        });
      } else {
        // Fallback: Mock delete
        return NextResponse.json({
          success: true,
          message: 'Order deleted successfully (mock)'
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('E-commerce orders error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process order request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
