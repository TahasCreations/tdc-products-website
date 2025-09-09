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
    const action = searchParams.get('action') || 'list';

    switch (action) {
      case 'list':
        return await getEarsivInvoices(companyId, supabase);
      case 'settings':
        return await getEarsivSettings(companyId, supabase);
      case 'templates':
        return await getEarsivTemplates(companyId, supabase);
      case 'batch_operations':
        return await getBatchOperations(companyId, supabase);
      case 'reports':
        return await getEarsivReports(companyId, searchParams, supabase);
      default:
        throw new Error('Geçersiz işlem');
    }

  }, 'E-Arşiv GET API');

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
        return await saveEarsivSettings(data, supabase);
      
      case 'send_invoice':
        return await sendEarsivInvoice(data, supabase);
      
      case 'get_invoice_status':
        return await getEarsivInvoiceStatus(data, supabase);
      
      case 'download_pdf':
        return await downloadEarsivPDF(data, supabase);
      
      case 'cancel_invoice':
        return await cancelEarsivInvoice(data, supabase);
      
      case 'archive_invoice':
        return await archiveEarsivInvoice(data, supabase);
      
      case 'batch_send':
        return await batchSendEarsivInvoices(data, supabase);
      
      case 'create_template':
        return await createEarsivTemplate(data, supabase);
      
      case 'update_template':
        return await updateEarsivTemplate(data, supabase);
      
      case 'delete_template':
        return await deleteEarsivTemplate(data, supabase);
      
      default:
        throw new Error('Geçersiz işlem');
    }

  }, 'E-Arşiv POST API');

  if (result.success) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(result, { status: 400 });
  }
}

async function getEarsivInvoices(companyId: string, supabase: any) {
  const { data: earsivInvoices, error } = await supabase!
    .from('earsiv_invoices')
    .select(`
      *,
      earsiv_statuses (name, description),
      invoices (invoice_number, total_amount, contact_name)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(earsivInvoices || []);
}

async function getEarsivSettings(companyId: string, supabase: any) {
  const { data: settings, error } = await supabase!
    .from('earsiv_settings')
    .select('*')
    .eq('company_id', companyId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(settings || null);
}

async function getEarsivTemplates(companyId: string, supabase: any) {
  const { data: templates, error } = await supabase!
    .from('earsiv_templates')
    .select('*')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('name');

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(templates || []);
}

async function getBatchOperations(companyId: string, supabase: any) {
  const { data: batchOperations, error } = await supabase!
    .from('earsiv_batch_operations')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(batchOperations || []);
}

async function getEarsivReports(companyId: string, searchParams: URLSearchParams, supabase: any) {
  const reportType = searchParams.get('reportType') || 'MONTHLY';
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let query = supabase!
    .from('earsiv_reports')
    .select('*')
    .eq('company_id', companyId)
    .eq('report_type', reportType)
    .order('report_date', { ascending: false });

  if (startDate) {
    query = query.gte('report_date', startDate);
  }

  if (endDate) {
    query = query.lte('report_date', endDate);
  }

  const { data: reports, error } = await query;

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(reports || []);
}

async function saveEarsivSettings(data: any, supabase: any) {
  const { companyId, testMode, gibUsername, gibPassword, gibEndpoint, certificatePath, certificatePassword, autoSendEnabled, emailNotifications } = data;

  const { data: existingSettings } = await supabase
    .from('earsiv_settings')
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
    certificate_password: certificatePassword,
    auto_send_enabled: autoSendEnabled,
    email_notifications: emailNotifications
  };

  let result;
  if (existingSettings) {
    result = await supabase
      .from('earsiv_settings')
      .update(settingsData)
      .eq('id', existingSettings.id)
      .select()
      .single();
  } else {
    result = await supabase
      .from('earsiv_settings')
      .insert([settingsData])
      .select()
      .single();
  }

  if (result.error) {
    throw result.error;
  }

  return AppErrorHandler.createApiSuccessResponse(result.data, 'E-Arşiv ayarları kaydedildi');
}

async function sendEarsivInvoice(data: any, supabase: any) {
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

  // E-Arşiv XML oluştur
  const xmlContent = generateEarsivXML(invoice);

  // E-Arşiv kaydı oluştur
  const { data: earsivInvoice, error: earsivError } = await supabase
    .from('earsiv_invoices')
    .insert([{
      company_id: companyId,
      invoice_id: invoiceId,
      invoice_number: invoice.invoice_number,
      invoice_date: invoice.invoice_date,
      status_id: (await supabase.from('earsiv_statuses').select('id').eq('name', 'DRAFT').single()).data?.id,
      xml_content: xmlContent
    }])
    .select()
    .single();

  if (earsivError) {
    throw earsivError;
  }

  // GİB'e gönder (simüle edilmiş)
  const sendResult = await sendToGIBEarsiv(earsivInvoice, supabase);

  return AppErrorHandler.createApiSuccessResponse({
    earsivInvoice,
    sendResult
  }, 'E-Arşiv fatura gönderildi');
}

async function getEarsivInvoiceStatus(data: any, supabase: any) {
  const { earsivInvoiceId } = data;

  // GİB'den durum sorgula (simüle edilmiş)
  const status = await queryGIBEarsivStatus(earsivInvoiceId);

  // Durumu güncelle
  const { data: updatedInvoice, error: updateError } = await supabase
    .from('earsiv_invoices')
    .update({
      status_id: (await supabase.from('earsiv_statuses').select('id').eq('name', status).single()).data?.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', earsivInvoiceId)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return AppErrorHandler.createApiSuccessResponse(updatedInvoice, 'Durum güncellendi');
}

async function downloadEarsivPDF(data: any, supabase: any) {
  const { earsivInvoiceId } = data;

  // E-Arşiv PDF'ini getir
  const { data: earsivInvoice, error: invoiceError } = await supabase
    .from('earsiv_invoices')
    .select('pdf_content, invoice_number')
    .eq('id', earsivInvoiceId)
    .single();

  if (invoiceError) {
    throw invoiceError;
  }

  if (!earsivInvoice.pdf_content) {
    throw new Error('PDF bulunamadı');
  }

  return AppErrorHandler.createApiSuccessResponse({
    pdfContent: earsivInvoice.pdf_content,
    fileName: `earsiv_${earsivInvoice.invoice_number}.pdf`
  }, 'PDF hazır');
}

async function cancelEarsivInvoice(data: any, supabase: any) {
  const { earsivInvoiceId, reason } = data;

  // GİB'e iptal isteği gönder (simüle edilmiş)
  const cancelResult = await cancelInGIBEarsiv(earsivInvoiceId, reason);

  // Durumu güncelle
  const { data: updatedInvoice, error: updateError } = await supabase
    .from('earsiv_invoices')
    .update({
      status_id: (await supabase.from('earsiv_statuses').select('id').eq('name', 'CANCELLED').single()).data?.id,
      error_message: reason,
      updated_at: new Date().toISOString()
    })
    .eq('id', earsivInvoiceId)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return AppErrorHandler.createApiSuccessResponse(updatedInvoice, 'E-Arşiv fatura iptal edildi');
}

async function archiveEarsivInvoice(data: any, supabase: any) {
  const { earsivInvoiceId } = data;

  // Arşivleme işlemi (simüle edilmiş)
  const archiveResult = await archiveInGIBEarsiv(earsivInvoiceId);

  // Durumu güncelle
  const { data: updatedInvoice, error: updateError } = await supabase
    .from('earsiv_invoices')
    .update({
      status_id: (await supabase.from('earsiv_statuses').select('id').eq('name', 'ARCHIVED').single()).data?.id,
      archived_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', earsivInvoiceId)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  return AppErrorHandler.createApiSuccessResponse(updatedInvoice, 'E-Arşiv fatura arşivlendi');
}

async function batchSendEarsivInvoices(data: any, supabase: any) {
  const { companyId, invoiceIds, batchName } = data;

  // Toplu işlem kaydı oluştur
  const { data: batchOperation, error: batchError } = await supabase
    .from('earsiv_batch_operations')
    .insert([{
      company_id: companyId,
      batch_name: batchName || `Toplu İşlem ${new Date().toLocaleString('tr-TR')}`,
      total_invoices: invoiceIds.length,
      status: 'PROCESSING',
      started_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (batchError) {
    throw batchError;
  }

  // Her fatura için E-Arşiv kaydı oluştur
  const batchDetails = [];
  for (const invoiceId of invoiceIds) {
    const { data: invoice } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (invoice) {
      const xmlContent = generateEarsivXML(invoice);
      
      const { data: earsivInvoice } = await supabase
        .from('earsiv_invoices')
        .insert([{
          company_id: companyId,
          invoice_id: invoiceId,
          invoice_number: invoice.invoice_number,
          invoice_date: invoice.invoice_date,
          status_id: (await supabase.from('earsiv_statuses').select('id').eq('name', 'DRAFT').single()).data?.id,
          xml_content: xmlContent
        }])
        .select()
        .single();

      if (earsivInvoice) {
        batchDetails.push({
          batch_id: batchOperation.id,
          earsiv_invoice_id: earsivInvoice.id,
          status: 'PENDING'
        });
      }
    }
  }

  // Toplu işlem detaylarını kaydet
  if (batchDetails.length > 0) {
    await supabase
      .from('earsiv_batch_details')
      .insert(batchDetails);
  }

  // Toplu işlemi tamamla
  await supabase
    .from('earsiv_batch_operations')
    .update({
      processed_invoices: batchDetails.length,
      status: 'COMPLETED',
      completed_at: new Date().toISOString()
    })
    .eq('id', batchOperation.id);

  return AppErrorHandler.createApiSuccessResponse(batchOperation, 'Toplu E-Arşiv işlemi başlatıldı');
}

async function createEarsivTemplate(data: any, supabase: any) {
  const { companyId, name, description, templateType, xmlTemplate } = data;

  const { data: template, error } = await supabase
    .from('earsiv_templates')
    .insert([{
      company_id: companyId,
      name,
      description,
      template_type: templateType,
      xml_template: xmlTemplate,
      is_active: true
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(template, 'E-Arşiv şablonu oluşturuldu');
}

async function updateEarsivTemplate(data: any, supabase: any) {
  const { templateId, name, description, templateType, xmlTemplate, isActive } = data;

  const { data: template, error } = await supabase
    .from('earsiv_templates')
    .update({
      name,
      description,
      template_type: templateType,
      xml_template: xmlTemplate,
      is_active: isActive
    })
    .eq('id', templateId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(template, 'E-Arşiv şablonu güncellendi');
}

async function deleteEarsivTemplate(data: any, supabase: any) {
  const { templateId } = data;

  const { error } = await supabase
    .from('earsiv_templates')
    .delete()
    .eq('id', templateId);

  if (error) {
    throw error;
  }

  return AppErrorHandler.createApiSuccessResponse(null, 'E-Arşiv şablonu silindi');
}

// Yardımcı fonksiyonlar
function generateEarsivXML(invoice: any): string {
  // E-Arşiv XML şablonu oluştur
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<ArchiveInvoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:ArchiveInvoice-2" 
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
</ArchiveInvoice>`;

  return xml;
}

async function sendToGIBEarsiv(earsivInvoice: any, supabase: any) {
  // GİB'e gönderim simülasyonu
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 saniye bekle

  // Log kaydet
  await supabase
    .from('earsiv_logs')
    .insert([{
      company_id: earsivInvoice.company_id,
      earsiv_invoice_id: earsivInvoice.id,
      action: 'SEND',
      request_data: { invoiceId: earsivInvoice.invoice_id },
      response_data: { status: 'SENT', gibUuid: 'GIB-ARSIV-' + Date.now() },
      status_code: 200
    }]);

  return {
    status: 'SENT',
    gibUuid: 'GIB-ARSIV-' + Date.now(),
    message: 'E-Arşiv fatura başarıyla gönderildi'
  };
}

async function queryGIBEarsivStatus(earsivInvoiceId: string) {
  // GİB durum sorgulama simülasyonu
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
  
  const statuses = ['SENT', 'DELIVERED', 'REJECTED'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

async function cancelInGIBEarsiv(earsivInvoiceId: string, reason: string) {
  // GİB iptal simülasyonu
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 saniye bekle
  
  return {
    status: 'CANCELLED',
    message: 'E-Arşiv fatura başarıyla iptal edildi',
    reason: reason
  };
}

async function archiveInGIBEarsiv(earsivInvoiceId: string) {
  // GİB arşivleme simülasyonu
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
  
  return {
    status: 'ARCHIVED',
    message: 'E-Arşiv fatura başarıyla arşivlendi'
  };
}
