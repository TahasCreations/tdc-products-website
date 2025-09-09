import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';
import { AppErrorHandler } from '../../../../lib/error-handler';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const result = await AppErrorHandler.withErrorHandling(async () => {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      throw new Error('Veritabanı bağlantısı kurulamadı');
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') || '550e8400-e29b-41d4-a716-446655440000';

    // E-Fatura ayarlarını getir
    const { data: settings, error: settingsError } = await supabase!
      .from('efatura_settings')
      .select('*')
      .eq('company_id', companyId)
      .single();

    if (settingsError && settingsError.code !== 'PGRST116') {
      throw settingsError;
    }

    // E-Fatura faturalarını getir
    const { data: efaturaInvoices, error: invoicesError } = await supabase!
      .from('efatura_invoices')
      .select(`
        *,
        efatura_statuses (name, description),
        invoices (invoice_number, total_amount, contact_name)
      `)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (invoicesError) {
      throw invoicesError;
    }

    return AppErrorHandler.createApiSuccessResponse({
      settings: settings || null,
      invoices: efaturaInvoices || []
    });

  }, 'E-Fatura GET API');

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(result, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const result = await AppErrorHandler.withErrorHandling(async () => {
    const body = await request.json();
    const { action, ...data } = body;

    const supabase = getServerSupabaseClient();
    if (!supabase) {
      throw new Error('Veritabanı bağlantısı kurulamadı');
    }

    switch (action) {
      case 'save_settings':
        return await saveEfaturaSettings(data, supabase);
      
      case 'send_invoice':
        return await sendEfaturaInvoice(data, supabase);
      
      case 'get_invoice_status':
        return await getEfaturaInvoiceStatus(data, supabase);
      
      case 'download_pdf':
        return await downloadEfaturaPDF(data, supabase);
      
      case 'cancel_invoice':
        return await cancelEfaturaInvoice(data, supabase);
      
      default:
        throw new Error('Geçersiz işlem');
    }

  }, 'E-Fatura POST API');

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(result, { status: 400 });
  }
}

async function saveEfaturaSettings(data: any, supabase: any) {
  const { companyId, testMode, gibUsername, gibPassword, gibEndpoint, certificatePath, certificatePassword } = data;

  // Mevcut ayarları kontrol et
  const { data: existingSettings } = await supabase
    .from('efatura_settings')
    .select('id')
    .eq('company_id', companyId)
    .single();

  const settingsData = {
    company_id: companyId,
    test_mode: testMode,
    gib_username: gibUsername,
    gib_password: gibPassword,
    gib_endpoint: gibEndpoint,
    certificate_path: certificatePath,
    certificate_password: certificatePassword
  };

  let result;
  if (existingSettings) {
    // Güncelle
    result = await supabase
      .from('efatura_settings')
      .update(settingsData)
      .eq('id', existingSettings.id)
      .select()
      .single();
  } else {
    // Yeni oluştur
    result = await supabase
      .from('efatura_settings')
      .insert([settingsData])
      .select()
      .single();
  }

  if (result.error) {
    throw result.error;
  }

  return AppErrorHandler.createApiSuccessResponse(result.data, 'E-Fatura ayarları kaydedildi');
}

async function sendEfaturaInvoice(data: any, supabase: any) {
  const { invoiceId, companyId } = data;

  // Fatura bilgilerini getir
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select(`
      *,
      invoice_lines (*),
      contacts (*)
    `)
    .eq('id', invoiceId)
    .single();

  if (invoiceError) {
    throw invoiceError;
  }

  // E-Fatura XML oluştur
  const xmlContent = generateEfaturaXML(invoice);

  // E-Fatura kaydı oluştur
  const { data: efaturaInvoice, error: efaturaError } = await supabase
    .from('efatura_invoices')
    .insert([{
      company_id: companyId,
      invoice_id: invoiceId,
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date,
      status_id: (await supabase.from('efatura_statuses').select('id').eq('name', 'DRAFT').single()).data?.id,
      xml_content: xmlContent
    }])
    .select()
    .single();

  if (efaturaError) {
    throw efaturaError;
  }

  // GİB'e gönder (simüle edilmiş)
  const sendResult = await sendToGIB(efaturaInvoice, supabase);

  return AppErrorHandler.createApiSuccessResponse({
    efaturaInvoice,
    sendResult
  }, 'E-Fatura gönderildi');

}

async function getEfaturaInvoiceStatus(data: any, supabase: any) {
  const { efaturaInvoiceId } = data;

  // GİB'den durum sorgula (simüle edilmiş)
  const status = await queryGIBStatus(efaturaInvoiceId);

  // Durumu güncelle
  const { data: updatedInvoice, error: updateError } = await supabase
    .from('efatura_invoices')
    .update({
      status_id: (await supabase.from('efatura_statuses').select('id').eq('name', status).single()).data?.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', efaturaInvoiceId)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return AppErrorHandler.createApiSuccessResponse(updatedInvoice, 'Durum güncellendi');
}

async function downloadEfaturaPDF(data: any, supabase: any) {
  const { efaturaInvoiceId } = data;

  // E-Fatura PDF'ini getir
  const { data: efaturaInvoice, error: invoiceError } = await supabase
    .from('efatura_invoices')
    .select('pdf_content, invoice_number')
    .eq('id', efaturaInvoiceId)
    .single();

  if (invoiceError) {
    throw invoiceError;
  }

  if (!efaturaInvoice.pdf_content) {
    throw new Error('PDF bulunamadı');
  }

  return AppErrorHandler.createApiSuccessResponse({
    pdfContent: efaturaInvoice.pdf_content,
    fileName: `efatura_${efaturaInvoice.invoice_number}.pdf`
  }, 'PDF hazır');

}

async function cancelEfaturaInvoice(data: any, supabase: any) {
  const { efaturaInvoiceId, reason } = data;

  // GİB'e iptal isteği gönder (simüle edilmiş)
  const cancelResult = await cancelInGIB(efaturaInvoiceId, reason);

  // Durumu güncelle
  const { data: updatedInvoice, error: updateError } = await supabase
    .from('efatura_invoices')
    .update({
      status_id: (await supabase.from('efatura_statuses').select('id').eq('name', 'CANCELLED').single()).data?.id,
      error_message: reason,
      updated_at: new Date().toISOString()
    })
    .eq('id', efaturaInvoiceId)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return AppErrorHandler.createApiSuccessResponse(updatedInvoice, 'E-Fatura iptal edildi');
}

// Yardımcı fonksiyonlar
function generateEfaturaXML(invoice: any): string {
  // E-Fatura XML şablonu oluştur
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" 
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" 
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:ID>${invoice.invoice_number}</cbc:ID>
  <cbc:IssueDate>${invoice.invoice_date}</cbc:IssueDate>
  <cbc:InvoiceTypeCode>SATIS</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>TRY</cbc:DocumentCurrencyCode>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>TDC Products</cbc:Name>
      </cac:PartyName>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyName>
        <cbc:Name>${invoice.contacts?.name || 'Müşteri'}</cbc:Name>
      </cac:PartyName>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="TRY">${invoice.total_tax || 0}</cbc:TaxAmount>
  </cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="TRY">${invoice.total_amount || 0}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="TRY">${(invoice.total_amount || 0) - (invoice.total_tax || 0)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="TRY">${invoice.total_amount || 0}</cbc:TaxInclusiveAmount>
    <cbc:PayableAmount currencyID="TRY">${invoice.total_amount || 0}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
</Invoice>`;

  return xml;
}

async function sendToGIB(efaturaInvoice: any, supabase: any) {
  // GİB'e gönderim simülasyonu
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekle

  // Log kaydet
  await supabase
    .from('efatura_logs')
    .insert([{
      company_id: efaturaInvoice.company_id,
      efatura_invoice_id: efaturaInvoice.id,
      action: 'SEND',
      request_data: { invoiceId: efaturaInvoice.invoice_id },
      response_data: { status: 'SENT', gibUuid: 'GIB-' + Date.now() },
      status_code: 200
    }]);

  return {
    status: 'SENT',
    gibUuid: 'GIB-' + Date.now(),
    message: 'E-Fatura başarıyla gönderildi'
  };
}

async function queryGIBStatus(efaturaInvoiceId: string) {
  // GİB durum sorgulama simülasyonu
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
  
  const statuses = ['SENT', 'DELIVERED', 'REJECTED'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

async function cancelInGIB(efaturaInvoiceId: string, reason: string) {
  // GİB iptal simülasyonu
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 saniye bekle
  
  return {
    status: 'CANCELLED',
    message: 'E-Fatura başarıyla iptal edildi',
    reason: reason
  };
}
