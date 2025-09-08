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

// Finansal verileri getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const currentDate = new Date();
    const currentMonth = month || (currentDate.getMonth() + 1).toString();
    const currentYear = year || currentDate.getFullYear().toString();

    if (type === 'dashboard') {
      // Dashboard için genel finansal veriler
      const startDate = `${currentYear}-${currentMonth.padStart(2, '0')}-01`;
      const endDate = new Date(parseInt(currentYear), parseInt(currentMonth), 0).toISOString().split('T')[0];

      // Gelirler (faturalı satışlar)
      const { data: revenues, error: revenuesError } = await supabase
        .from('revenues')
        .select('amount, tax_amount, net_amount')
        .gte('revenue_date', startDate)
        .lte('revenue_date', endDate)
        .eq('status', 'received');

      if (revenuesError) {
        console.error('Revenues fetch error:', revenuesError);
      }

      // Giderler
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('amount, category')
        .gte('expense_date', startDate)
        .lte('expense_date', endDate)
        .eq('status', 'paid');

      if (expensesError) {
        console.error('Expenses fetch error:', expensesError);
      }

      // Faturasız satışlar (orders tablosundan)
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .eq('payment_status', 'paid');

      if (ordersError) {
        console.error('Orders fetch error:', ordersError);
      }

      // Hesaplamalar
      const totalRevenue = (revenues || []).reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0);
      const totalExpenses = (expenses || []).reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
      const totalOrders = (orders || []).reduce((sum, o) => sum + parseFloat(o.total_amount.toString()), 0);
      
      const netProfit = totalRevenue + totalOrders - totalExpenses;
      const profitMargin = totalRevenue + totalOrders > 0 ? (netProfit / (totalRevenue + totalOrders)) * 100 : 0;

      // Kategori bazında giderler
      const expensesByCategory = (expenses || []).reduce((acc, expense) => {
        const category = expense.category;
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount.toString());
        return acc;
      }, {} as Record<string, number>);

      return NextResponse.json({
        success: true,
        data: {
          totalRevenue,
          totalExpenses,
          totalOrders,
          netProfit,
          profitMargin: Math.round(profitMargin * 100) / 100,
          expensesByCategory,
          period: {
            month: currentMonth,
            year: currentYear,
            startDate,
            endDate
          }
        }
      });
    }

    if (type === 'expenses') {
      // Giderleri getir
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (error) {
        console.error('Expenses fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Giderler alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        expenses: expenses || []
      });
    }

    if (type === 'invoices') {
      // Faturaları getir
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select(`
          *,
          order:order_id (
            order_number,
            customer_name,
            total_amount
          )
        `)
        .order('invoice_date', { ascending: false });

      if (error) {
        console.error('Invoices fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Faturalar alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        invoices: invoices || []
      });
    }

    if (type === 'orders') {
      // Siparişleri getir
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Siparişler alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        orders: orders || []
      });
    }

    if (type === 'monthly_trend') {
      // Son 12 aylık trend verilerini getir
      const monthlyData = [];
      const currentDate = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const startDate = date.toISOString().split('T')[0];
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
        
        const monthName = date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });

        // O ayın gelirleri
        const { data: revenues } = await supabase
          .from('revenues')
          .select('amount')
          .gte('revenue_date', startDate)
          .lte('revenue_date', endDate)
          .eq('status', 'received');

        // O ayın giderleri
        const { data: expenses } = await supabase
          .from('expenses')
          .select('amount')
          .gte('expense_date', startDate)
          .lte('expense_date', endDate)
          .eq('status', 'paid');

        // O ayın faturasız satışları
        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', startDate)
          .lte('created_at', endDate)
          .eq('payment_status', 'paid');

        const revenue = (revenues || []).reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0);
        const expense = (expenses || []).reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
        const orderAmount = (orders || []).reduce((sum, o) => sum + parseFloat(o.total_amount.toString()), 0);
        const profit = revenue + orderAmount - expense;

        monthlyData.push({
          month: monthName,
          revenue: revenue + orderAmount,
          expenses: expense,
          profit: profit
        });
      }

      return NextResponse.json({
        success: true,
        data: monthlyData
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz tip parametresi' 
    }, { status: 400 });

  } catch (error) {
    console.error('Finance API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Yeni gider ekle
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

    if (action === 'add_expense') {
      const {
        category,
        subcategory,
        description,
        amount,
        expense_date,
        payment_method,
        payment_reference,
        supplier_name,
        supplier_tax_number,
        is_recurring,
        recurring_frequency
      } = data;

      // Gider numarası oluştur
      const expenseNumber = `EXP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      const { data: newExpense, error } = await supabase
        .from('expenses')
        .insert({
          expense_number: expenseNumber,
          category,
          subcategory,
          description,
          amount: parseFloat(amount),
          expense_date,
          payment_method,
          payment_reference,
          supplier_name,
          supplier_tax_number,
          is_recurring: is_recurring || false,
          recurring_frequency,
          created_by: data.created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Add expense error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Gider eklenemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        expense: newExpense
      });
    }

    if (action === 'create_invoice') {
      const {
        order_id,
        customer_name,
        customer_email,
        customer_address,
        customer_tax_number,
        subtotal,
        tax_rate,
        tax_amount,
        total_amount,
        invoice_date,
        due_date,
        notes,
        created_by
      } = data;

      // Fatura numarası oluştur
      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

      const { data: newInvoice, error } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          order_id,
          customer_name,
          customer_email,
          customer_address,
          customer_tax_number,
          subtotal: parseFloat(subtotal),
          tax_rate: parseFloat(tax_rate),
          tax_amount: parseFloat(tax_amount),
          total_amount: parseFloat(total_amount),
          invoice_date,
          due_date,
          notes,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create invoice error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Fatura oluşturulamadı' 
        }, { status: 500 });
      }

      // Gelir kaydı oluştur
      const revenueNumber = `REV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      await supabase
        .from('revenues')
        .insert({
          revenue_number: revenueNumber,
          invoice_id: newInvoice.id,
          order_id,
          customer_name,
          description: `Fatura: ${invoiceNumber}`,
          amount: parseFloat(total_amount),
          tax_amount: parseFloat(tax_amount),
          net_amount: parseFloat(subtotal),
          revenue_date: invoice_date,
          created_by
        });

      return NextResponse.json({
        success: true,
        invoice: newInvoice
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz işlem' 
    }, { status: 400 });

  } catch (error) {
    console.error('Finance POST API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Fatura durumu güncelle
export async function PUT(request: NextRequest) {
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

    if (action === 'update_invoice_status') {
      const { invoice_id, status } = data;

      const { data: updatedInvoice, error } = await supabase
        .from('invoices')
        .update({ 
          status: status,
          payment_date: status === 'paid' ? new Date().toISOString().split('T')[0] : null
        })
        .eq('id', invoice_id)
        .select()
        .single();

      if (error) {
        console.error('Update invoice status error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Fatura durumu güncellenemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        invoice: updatedInvoice
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz işlem' 
    }, { status: 400 });

  } catch (error) {
    console.error('Finance PUT API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
