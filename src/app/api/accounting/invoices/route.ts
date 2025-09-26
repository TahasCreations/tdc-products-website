import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    let invoices = [];

    if (supabase) {
      // Supabase'den faturaları çek
      let query = supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          customer_name,
          customer_email,
          total_amount,
          status,
          due_date,
          created_at,
          invoice_type
        `)
        .order('created_at', { ascending: false });

      // Filtreler
      if (status) {
        query = query.eq('status', status);
      }
      if (search) {
        query = query.or(`invoice_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`);
      }

      // Sayfalama
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase invoices error:', error);
        throw error;
      }

      invoices = data?.map(invoice => ({
        id: invoice.id,
        number: invoice.invoice_number,
        customer: invoice.customer_name || invoice.customer_email || 'Bilinmeyen Müşteri',
        amount: invoice.total_amount || 0,
        status: invoice.status || 'draft',
        dueDate: invoice.due_date,
        createdDate: invoice.created_at,
        type: invoice.invoice_type || 'invoice'
      })) || [];

    } else {
      // Fallback: Mock data
      invoices = [
        {
          id: '1',
          number: 'INV-2024-001',
          customer: 'Ahmet Yılmaz',
          amount: 2500,
          status: 'paid',
          dueDate: '2024-02-15T10:00:00Z',
          createdDate: '2024-01-15T10:00:00Z',
          type: 'invoice'
        },
        {
          id: '2',
          number: 'INV-2024-002',
          customer: 'Fatma Demir',
          amount: 1800,
          status: 'sent',
          dueDate: '2024-02-20T10:00:00Z',
          createdDate: '2024-01-20T10:00:00Z',
          type: 'invoice'
        },
        {
          id: '3',
          number: 'INV-2024-003',
          customer: 'Mehmet Kaya',
          amount: 3200,
          status: 'overdue',
          dueDate: '2024-01-10T10:00:00Z',
          createdDate: '2024-01-05T10:00:00Z',
          type: 'invoice'
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: invoices,
      pagination: {
        page,
        limit,
        total: invoices.length
      }
    });

  } catch (error) {
    console.error('Accounting invoices error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch invoices',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...invoiceData } = body;

    if (action === 'create') {
      if (supabase) {
        const { data, error } = await supabase
          .from('invoices')
          .insert([{
            invoice_number: invoiceData.invoice_number,
            customer_name: invoiceData.customer_name,
            customer_email: invoiceData.customer_email,
            total_amount: parseFloat(invoiceData.total_amount),
            status: invoiceData.status || 'draft',
            due_date: invoiceData.due_date,
            invoice_type: invoiceData.type || 'invoice'
          }])
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Invoice created successfully',
          data
        });
      } else {
        // Fallback: Mock creation
        const newInvoice = {
          id: Date.now().toString(),
          ...invoiceData,
          createdDate: new Date().toISOString(),
          created_at: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          message: 'Invoice created successfully (mock)',
          data: newInvoice
        });
      }
    }

    if (action === 'update' && id) {
      if (supabase) {
        const { data, error } = await supabase
          .from('invoices')
          .update({
            customer_name: invoiceData.customer_name,
            customer_email: invoiceData.customer_email,
            total_amount: parseFloat(invoiceData.total_amount),
            status: invoiceData.status,
            due_date: invoiceData.due_date,
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
          message: 'Invoice updated successfully',
          data
        });
      } else {
        // Fallback: Mock update
        return NextResponse.json({
          success: true,
          message: 'Invoice updated successfully (mock)',
          data: { id, ...invoiceData }
        });
      }
    }

    if (action === 'delete' && id) {
      if (supabase) {
        const { error } = await supabase
          .from('invoices')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Invoice deleted successfully'
        });
      } else {
        // Fallback: Mock delete
        return NextResponse.json({
          success: true,
          message: 'Invoice deleted successfully (mock)'
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Accounting invoices error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process invoice request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
