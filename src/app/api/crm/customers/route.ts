import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const tier = searchParams.get('tier') || '';
    const status = searchParams.get('status') || '';

    let customers = [];

    if (supabase) {
      // Supabase'den müşterileri çek
      let query = supabase
        .from('customers')
        .select(`
          id,
          customer_code,
          first_name,
          last_name,
          email,
          phone,
          company_name,
          customer_type,
          customer_status,
          customer_tier,
          total_orders,
          total_spent,
          last_order_date,
          created_at,
          customer_tags(tags(id, name, color))
        `)
        .order('created_at', { ascending: false });

      // Filtreler
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`);
      }
      if (tier) {
        query = query.eq('customer_tier', tier);
      }
      if (status) {
        query = query.eq('customer_status', status);
      }

      // Sayfalama
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase customers error:', error);
        throw error;
      }

      customers = data?.map(customer => ({
        id: customer.id,
        customer_code: customer.customer_code,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        company_name: customer.company_name,
        customer_type: customer.customer_type,
        customer_status: customer.customer_status,
        customer_tier: customer.customer_tier,
        total_orders: customer.total_orders || 0,
        total_spent: customer.total_spent || 0,
        last_order_date: customer.last_order_date,
        created_at: customer.created_at,
        tags: customer.customer_tags?.map((ct: any) => ({
          tag: ct.tags
        })) || []
      })) || [];

    } else {
      // Fallback: Mock data
      customers = [
        {
          id: '1',
          customer_code: 'CUST-001',
          first_name: 'Ahmet',
          last_name: 'Yılmaz',
          email: 'ahmet@example.com',
          phone: '+90 555 123 4567',
          company_name: 'Yılmaz Ltd.',
          customer_type: 'Kurumsal',
          customer_status: 'active',
          customer_tier: 'Gold',
          total_orders: 15,
          total_spent: 25000,
          last_order_date: '2024-01-20T10:00:00Z',
          created_at: '2023-06-15T10:00:00Z',
          tags: [
            {
              tag: {
                id: '1',
                name: 'VIP',
                color: '#FFD700'
              }
            }
          ]
        },
        {
          id: '2',
          customer_code: 'CUST-002',
          first_name: 'Fatma',
          last_name: 'Demir',
          email: 'fatma@example.com',
          phone: '+90 555 987 6543',
          company_name: 'Demir A.Ş.',
          customer_type: 'Bireysel',
          customer_status: 'active',
          customer_tier: 'Silver',
          total_orders: 8,
          total_spent: 12000,
          last_order_date: '2024-01-18T10:00:00Z',
          created_at: '2023-08-20T10:00:00Z',
          tags: [
            {
              tag: {
                id: '2',
                name: 'Sadık Müşteri',
                color: '#32CD32'
              }
            }
          ]
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        page,
        limit,
        total: customers.length
      }
    });

  } catch (error) {
    console.error('CRM customers error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch customers',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...customerData } = body;

    if (action === 'create') {
      if (supabase) {
        const { data, error } = await supabase
          .from('customers')
          .insert([{
            customer_code: customerData.customer_code,
            first_name: customerData.first_name,
            last_name: customerData.last_name,
            email: customerData.email,
            phone: customerData.phone,
            company_name: customerData.company_name,
            customer_type: customerData.customer_type,
            customer_status: customerData.customer_status || 'active',
            customer_tier: customerData.customer_tier || 'Bronze'
          }])
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Customer created successfully',
          data
        });
      } else {
        // Fallback: Mock creation
        const newCustomer = {
          id: Date.now().toString(),
          ...customerData,
          created_at: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          message: 'Customer created successfully (mock)',
          data: newCustomer
        });
      }
    }

    if (action === 'update' && id) {
      if (supabase) {
        const { data, error } = await supabase
          .from('customers')
          .update({
            first_name: customerData.first_name,
            last_name: customerData.last_name,
            email: customerData.email,
            phone: customerData.phone,
            company_name: customerData.company_name,
            customer_type: customerData.customer_type,
            customer_status: customerData.customer_status,
            customer_tier: customerData.customer_tier,
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
          message: 'Customer updated successfully',
          data
        });
      } else {
        // Fallback: Mock update
        return NextResponse.json({
          success: true,
          message: 'Customer updated successfully (mock)',
          data: { id, ...customerData }
        });
      }
    }

    if (action === 'delete' && id) {
      if (supabase) {
        const { error } = await supabase
          .from('customers')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Customer deleted successfully'
        });
      } else {
        // Fallback: Mock delete
        return NextResponse.json({
          success: true,
          message: 'Customer deleted successfully (mock)'
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('CRM customers error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process customer request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}