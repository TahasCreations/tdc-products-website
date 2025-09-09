import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as XLSX from 'xlsx';

const getServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseKey);
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Dosya bulunamadı' }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ success: false, error: 'Veri türü belirtilmedi' }, { status: 400 });
    }

    const supabase = getServerSupabaseClient();
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (!data || data.length === 0) {
      return NextResponse.json({ success: false, error: 'Excel dosyasında veri bulunamadı' }, { status: 400 });
    }

    let result;
    switch (type) {
      case 'accounts':
        result = await importAccounts(supabase, data);
        break;
      case 'contacts':
        result = await importContacts(supabase, data);
        break;
      case 'journal':
        result = await importJournalEntries(supabase, data);
        break;
      case 'invoices':
        result = await importInvoices(supabase, data);
        break;
      case 'stock':
        result = await importStockItems(supabase, data);
        break;
      default:
        return NextResponse.json({ success: false, error: 'Geçersiz veri türü' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `${data.length} kayıt başarıyla içe aktarıldı`,
      importedCount: result.importedCount,
      errors: result.errors
    });

  } catch (error: any) {
    console.error('Excel import error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Excel dosyası işlenirken hata oluştu' }, { status: 500 });
  }
}

async function importAccounts(supabase: any, data: any[]) {
  const errors: string[] = [];
  let importedCount = 0;

  for (const row of data) {
    try {
      const accountData = {
        code: row['Hesap Kodu'] || row['code'] || '',
        name: row['Hesap Adı'] || row['name'] || '',
        type: row['Hesap Türü'] || row['type'] || 'ACTIVE',
        parent_code: row['Üst Hesap Kodu'] || row['parent_code'] || null,
        is_active: row['Aktif'] !== undefined ? row['Aktif'] : true,
        description: row['Açıklama'] || row['description'] || ''
      };

      if (!accountData.code || !accountData.name) {
        errors.push(`Satır ${importedCount + 1}: Hesap kodu ve adı zorunludur`);
        continue;
      }

      const { error } = await supabase
        .from('chart_of_accounts')
        .upsert(accountData, { onConflict: 'code' });

      if (error) {
        errors.push(`Satır ${importedCount + 1}: ${error.message}`);
      } else {
        importedCount++;
      }
    } catch (error: any) {
      errors.push(`Satır ${importedCount + 1}: ${error.message}`);
    }
  }

  return { importedCount, errors };
}

async function importContacts(supabase: any, data: any[]) {
  const errors: string[] = [];
  let importedCount = 0;

  for (const row of data) {
    try {
      const contactData = {
        code: row['Cari Kodu'] || row['code'] || '',
        name: row['Cari Adı'] || row['name'] || '',
        type: row['Cari Türü'] || row['type'] || 'CUSTOMER',
        tax_number: row['Vergi No'] || row['tax_number'] || '',
        tax_office: row['Vergi Dairesi'] || row['tax_office'] || '',
        address: row['Adres'] || row['address'] || '',
        city: row['Şehir'] || row['city'] || '',
        phone: row['Telefon'] || row['phone'] || '',
        email: row['E-posta'] || row['email'] || '',
        is_active: row['Aktif'] !== undefined ? row['Aktif'] : true
      };

      if (!contactData.code || !contactData.name) {
        errors.push(`Satır ${importedCount + 1}: Cari kodu ve adı zorunludur`);
        continue;
      }

      const { error } = await supabase
        .from('contacts')
        .upsert(contactData, { onConflict: 'code' });

      if (error) {
        errors.push(`Satır ${importedCount + 1}: ${error.message}`);
      } else {
        importedCount++;
      }
    } catch (error: any) {
      errors.push(`Satır ${importedCount + 1}: ${error.message}`);
    }
  }

  return { importedCount, errors };
}

async function importJournalEntries(supabase: any, data: any[]) {
  const errors: string[] = [];
  let importedCount = 0;

  for (const row of data) {
    try {
      const entryData = {
        no: row['Fiş No'] || row['no'] || '',
        date: row['Tarih'] || row['date'] || new Date().toISOString().split('T')[0],
        description: row['Açıklama'] || row['description'] || '',
        status: row['Durum'] || row['status'] || 'DRAFT',
        total_debit: parseFloat(row['Toplam Borç'] || row['total_debit'] || '0'),
        total_credit: parseFloat(row['Toplam Alacak'] || row['total_credit'] || '0')
      };

      if (!entryData.no) {
        errors.push(`Satır ${importedCount + 1}: Fiş numarası zorunludur`);
        continue;
      }

      const { error } = await supabase
        .from('journal_entries')
        .upsert(entryData, { onConflict: 'no' });

      if (error) {
        errors.push(`Satır ${importedCount + 1}: ${error.message}`);
      } else {
        importedCount++;
      }
    } catch (error: any) {
      errors.push(`Satır ${importedCount + 1}: ${error.message}`);
    }
  }

  return { importedCount, errors };
}

async function importInvoices(supabase: any, data: any[]) {
  const errors: string[] = [];
  let importedCount = 0;

  for (const row of data) {
    try {
      const invoiceData = {
        invoice_number: row['Fatura No'] || row['invoice_number'] || '',
        customer_name: row['Müşteri Adı'] || row['customer_name'] || '',
        customer_email: row['Müşteri E-posta'] || row['customer_email'] || '',
        customer_address: row['Müşteri Adres'] || row['customer_address'] || '',
        customer_tax_number: row['Müşteri Vergi No'] || row['customer_tax_number'] || '',
        subtotal: parseFloat(row['Ara Toplam'] || row['subtotal'] || '0'),
        tax_rate: parseFloat(row['KDV Oranı'] || row['tax_rate'] || '20'),
        tax_amount: parseFloat(row['KDV Tutarı'] || row['tax_amount'] || '0'),
        total_amount: parseFloat(row['Toplam Tutar'] || row['total_amount'] || '0'),
        invoice_date: row['Fatura Tarihi'] || row['invoice_date'] || new Date().toISOString().split('T')[0],
        due_date: row['Vade Tarihi'] || row['due_date'] || '',
        status: row['Durum'] || row['status'] || 'DRAFT',
        notes: row['Notlar'] || row['notes'] || ''
      };

      if (!invoiceData.invoice_number || !invoiceData.customer_name) {
        errors.push(`Satır ${importedCount + 1}: Fatura numarası ve müşteri adı zorunludur`);
        continue;
      }

      const { error } = await supabase
        .from('invoices')
        .upsert(invoiceData, { onConflict: 'invoice_number' });

      if (error) {
        errors.push(`Satır ${importedCount + 1}: ${error.message}`);
      } else {
        importedCount++;
      }
    } catch (error: any) {
      errors.push(`Satır ${importedCount + 1}: ${error.message}`);
    }
  }

  return { importedCount, errors };
}

async function importStockItems(supabase: any, data: any[]) {
  const errors: string[] = [];
  let importedCount = 0;

  for (const row of data) {
    try {
      const stockData = {
        code: row['Stok Kodu'] || row['code'] || '',
        name: row['Stok Adı'] || row['name'] || '',
        description: row['Açıklama'] || row['description'] || '',
        unit: row['Birim'] || row['unit'] || 'ADET',
        purchase_price: parseFloat(row['Alış Fiyatı'] || row['purchase_price'] || '0'),
        sale_price: parseFloat(row['Satış Fiyatı'] || row['sale_price'] || '0'),
        stock_quantity: parseFloat(row['Stok Miktarı'] || row['stock_quantity'] || '0'),
        min_stock: parseFloat(row['Min Stok'] || row['min_stock'] || '0'),
        is_active: row['Aktif'] !== undefined ? row['Aktif'] : true
      };

      if (!stockData.code || !stockData.name) {
        errors.push(`Satır ${importedCount + 1}: Stok kodu ve adı zorunludur`);
        continue;
      }

      const { error } = await supabase
        .from('stock_items')
        .upsert(stockData, { onConflict: 'code' });

      if (error) {
        errors.push(`Satır ${importedCount + 1}: ${error.message}`);
      } else {
        importedCount++;
      }
    } catch (error: any) {
      errors.push(`Satır ${importedCount + 1}: ${error.message}`);
    }
  }

  return { importedCount, errors };
}
