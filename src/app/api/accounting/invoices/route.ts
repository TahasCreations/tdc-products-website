import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Faturaları ve satırlarını çek
    const { data: invoices, error: invoicesError } = await supabase!
      .from('invoices')
      .select(`
        *,
        invoice_lines (
          id,
          description,
          quantity,
          unit_price,
          kdv_rate,
          kdv_amount,
          withhold_rate,
          withhold_amount,
          total_line,
          stock_id
        )
      `)
      .order('created_at', { ascending: false });

    if (invoicesError) {
      throw invoicesError;
    }

    // Veriyi düzenle
    const formattedInvoices = invoices?.map(invoice => ({
      ...invoice,
      lines: invoice.invoice_lines || []
    })) || [];

    return NextResponse.json(formattedInvoices);

  } catch (error) {
    console.error('Invoices GET error:', error);
    return NextResponse.json(
      { error: 'Faturalar alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();

    // Gerekli alanları kontrol et
    if (!body.invoice_number || !body.customer_name || !body.date || !body.due_date) {
      return NextResponse.json(
        { error: 'Fatura no, müşteri adı, tarih ve vade tarihi gerekli' },
        { status: 400 }
      );
    }

    if (!body.lines || body.lines.length === 0) {
      return NextResponse.json(
        { error: 'En az bir fatura satırı gerekli' },
        { status: 400 }
      );
    }

    // Fatura no benzersizlik kontrolü
    const { data: existingInvoice } = await supabase!
      .from('invoices')
      .select('id')
      .eq('invoice_number', body.invoice_number)
      .single();

    if (existingInvoice) {
      return NextResponse.json(
        { error: 'Bu fatura numarası zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Faturayı oluştur
    const { data: invoice, error: invoiceError } = await supabase!
      .from('invoices')
      .insert([{
        invoice_number: body.invoice_number,
        customer_name: body.customer_name,
        date: body.date,
        due_date: body.due_date,
        type: body.type || 'SALE',
        status: body.status || 'DRAFT',
        subtotal: body.subtotal || 0,
        tax_amount: body.tax_amount || 0,
        total_amount: body.total_amount || 0,
        kdvsum: body.kdvsum || 0,
        withhold_sum: body.withhold_sum || 0,
        contact_id: body.contact_id || null,
        company_id: '550e8400-e29b-41d4-a716-446655440000' // Varsayılan şirket
      }])
      .select()
      .single();

    if (invoiceError) {
      throw invoiceError;
    }

    // Fatura satırlarını oluştur
    const linesData = body.lines.map((line: any) => ({
      invoice_id: invoice.id,
      description: line.description || '',
      quantity: line.quantity || 0,
      unit_price: line.unit_price || 0,
      kdv_rate: line.kdv_rate || 0,
      kdv_amount: line.kdv_amount || 0,
      withhold_rate: line.withhold_rate || 0,
      withhold_amount: line.withhold_amount || 0,
      total_line: line.total_line || 0,
      stock_id: line.stock_id || null
    }));

    const { error: linesError } = await supabase!
      .from('invoice_lines')
      .insert(linesData);

    if (linesError) {
      // Faturayı sil
      await supabase!.from('invoices').delete().eq('id', invoice.id);
      throw linesError;
    }

    return NextResponse.json(invoice, { status: 201 });

  } catch (error) {
    console.error('Invoices POST error:', error);
    return NextResponse.json(
      { error: 'Fatura oluşturulamadı' },
      { status: 500 }
    );
  }
}
