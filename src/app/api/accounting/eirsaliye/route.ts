import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseKey);
};
import { ApiWrapper } from '@/lib/api-wrapper';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'settings':
        return await getSettings(supabase);
      case 'statuses':
        return await getStatuses(supabase);
      case 'irsaliyes':
        return await getIrsaliyes(supabase, searchParams);
      case 'items':
        return await getItems(supabase, searchParams);
      case 'templates':
        return await getTemplates(supabase);
      case 'customer-integrations':
        return await getCustomerIntegrations(supabase);
      case 'batch-operations':
        return await getBatchOperations(supabase, searchParams);
      case 'reports':
        return await getReports(supabase, searchParams);
      case 'notifications':
        return await getNotifications(supabase);
      case 'queue':
        return await getQueue(supabase, searchParams);
      case 'logs':
        return await getLogs(supabase, searchParams);
      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('E-İrsaliye GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'save_settings':
        return await saveSettings(supabase, body);
      case 'create_irsaliye':
        return await createIrsaliye(supabase, body);
      case 'update_irsaliye':
        return await updateIrsaliye(supabase, body);
      case 'send_irsaliye':
        return await sendIrsaliye(supabase, body);
      case 'check_status':
        return await checkStatus(supabase, body);
      case 'download_pdf':
        return await downloadPdf(supabase, body);
      case 'cancel_irsaliye':
        return await cancelIrsaliye(supabase, body);
      case 'create_template':
        return await createTemplate(supabase, body);
      case 'update_template':
        return await updateTemplate(supabase, body);
      case 'create_customer_integration':
        return await createCustomerIntegration(supabase, body);
      case 'update_customer_integration':
        return await updateCustomerIntegration(supabase, body);
      case 'create_batch_operation':
        return await createBatchOperation(supabase, body);
      case 'process_batch':
        return await processBatch(supabase, body);
      case 'generate_report':
        return await generateReport(supabase, body);
      case 'queue_operation':
        return await queueOperation(supabase, body);
      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('E-İrsaliye POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }

    switch (action) {
      case 'delete_irsaliye':
        return await deleteIrsaliye(supabase, id);
      case 'delete_template':
        return await deleteTemplate(supabase, id);
      case 'delete_customer_integration':
        return await deleteCustomerIntegration(supabase, id);
      case 'delete_batch_operation':
        return await deleteBatchOperation(supabase, id);
      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('E-İrsaliye DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Ayarlar
async function getSettings(supabase: any) {
  const { data, error } = await supabase
    .from('eirsaliye_settings')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return NextResponse.json({ data });
}

// Durumlar
async function getStatuses(supabase: any) {
  const { data, error } = await supabase
    .from('eirsaliye_statuses')
    .select('*')
    .order('status_name');

  if (error) throw error;
  return NextResponse.json({ data });
}

// İrsaliyeler
async function getIrsaliyes(supabase: any, searchParams: URLSearchParams) {
  const status = searchParams.get('status');
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('eirsaliye_irsaliyes')
    .select(`
      *,
      eirsaliye_items (
        id,
        line_number,
        product_name,
        quantity,
        unit_price,
        total_price
      )
    `)
    .order('irsaliye_date', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  if (startDate) {
    query = query.gte('irsaliye_date', startDate);
  }

  if (endDate) {
    query = query.lte('irsaliye_date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Kalemler
async function getItems(supabase: any, searchParams: URLSearchParams) {
  const irsaliyeId = searchParams.get('irsaliye_id');

  if (!irsaliyeId) {
    return NextResponse.json({ error: 'İrsaliye ID gerekli' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('eirsaliye_items')
    .select('*')
    .eq('irsaliye_id', irsaliyeId)
    .order('line_number');

  if (error) throw error;
  return NextResponse.json({ data });
}

// Şablonlar
async function getTemplates(supabase: any) {
  const { data, error } = await supabase
    .from('eirsaliye_templates')
    .select('*')
    .eq('is_active', true)
    .order('template_name');

  if (error) throw error;
  return NextResponse.json({ data });
}

// Müşteri entegrasyonları
async function getCustomerIntegrations(supabase: any) {
  const { data, error } = await supabase
    .from('eirsaliye_customer_integrations')
    .select('*')
    .eq('is_active', true)
    .order('customer_title');

  if (error) throw error;
  return NextResponse.json({ data });
}

// Toplu işlemler
async function getBatchOperations(supabase: any, searchParams: URLSearchParams) {
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('eirsaliye_batch_operations')
    .select(`
      *,
      eirsaliye_batch_details (
        id,
        irsaliye_id,
        status,
        error_message
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Raporlar
async function getReports(supabase: any, searchParams: URLSearchParams) {
  const reportType = searchParams.get('report_type');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('eirsaliye_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (reportType) {
    query = query.eq('report_type', reportType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Bildirimler
async function getNotifications(supabase: any) {
  const { data, error } = await supabase
    .from('eirsaliye_notifications')
    .select(`
      *,
      eirsaliye_irsaliyes (
        irsaliye_number,
        irsaliye_date
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return NextResponse.json({ data });
}

// Kuyruk
async function getQueue(supabase: any, searchParams: URLSearchParams) {
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '100');

  let query = supabase
    .from('eirsaliye_queue')
    .select(`
      *,
      eirsaliye_irsaliyes (
        irsaliye_number,
        irsaliye_date
      )
    `)
    .order('priority', { ascending: true })
    .order('scheduled_at', { ascending: true })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Loglar
async function getLogs(supabase: any, searchParams: URLSearchParams) {
  const irsaliyeId = searchParams.get('irsaliye_id');
  const operationType = searchParams.get('operation_type');
  const limit = parseInt(searchParams.get('limit') || '100');

  let query = supabase
    .from('eirsaliye_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (irsaliyeId) {
    query = query.eq('irsaliye_id', irsaliyeId);
  }

  if (operationType) {
    query = query.eq('operation_type', operationType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Ayarları kaydet
async function saveSettings(supabase: any, body: any) {
  const { 
    company_name, 
    tax_number, 
    tax_office, 
    address, 
    city, 
    postal_code, 
    phone, 
    email, 
    website, 
    gib_username, 
    gib_password, 
    test_mode 
  } = body;

  // Mevcut ayarları kontrol et
  const { data: existingSettings } = await supabase
    .from('eirsaliye_settings')
    .select('id')
    .eq('is_active', true)
    .single();

  let data, error;

  if (existingSettings) {
    // Güncelle
    const result = await supabase
      .from('eirsaliye_settings')
      .update({
        company_name,
        tax_number,
        tax_office,
        address,
        city,
        postal_code,
        phone,
        email,
        website,
        gib_username,
        gib_password,
        test_mode: test_mode || true
      })
      .eq('id', existingSettings.id)
      .select()
      .single();
    
    data = result.data;
    error = result.error;
  } else {
    // Yeni oluştur
    const result = await supabase
      .from('eirsaliye_settings')
      .insert({
        company_name,
        tax_number,
        tax_office,
        address,
        city,
        postal_code,
        phone,
        email,
        website,
        gib_username,
        gib_password,
        test_mode: test_mode || true
      })
      .select()
      .single();
    
    data = result.data;
    error = result.error;
  }

  if (error) throw error;
  return NextResponse.json({ data });
}

// İrsaliye oluştur
async function createIrsaliye(supabase: any, body: any) {
  const { 
    irsaliye_number, 
    irsaliye_date, 
    irsaliye_type, 
    sender_vkn, 
    sender_title, 
    receiver_vkn, 
    receiver_title, 
    receiver_address, 
    receiver_city, 
    receiver_postal_code, 
    receiver_phone, 
    receiver_email, 
    total_amount, 
    currency_code, 
    tax_amount, 
    net_amount, 
    notes, 
    items 
  } = body;

  // İrsaliye oluştur
  const { data: irsaliye, error: irsaliyeError } = await supabase
    .from('eirsaliye_irsaliyes')
    .insert({
      irsaliye_number,
      irsaliye_date,
      irsaliye_type: irsaliye_type || 'satis',
      sender_vkn,
      sender_title,
      receiver_vkn,
      receiver_title,
      receiver_address,
      receiver_city,
      receiver_postal_code,
      receiver_phone,
      receiver_email,
      total_amount,
      currency_code: currency_code || 'TRY',
      tax_amount: tax_amount || 0,
      net_amount,
      notes
    })
    .select()
    .single();

  if (irsaliyeError) throw irsaliyeError;

  // Kalemleri ekle
  if (items && items.length > 0) {
    const itemsData = items.map((item: any, index: number) => ({
      irsaliye_id: irsaliye.id,
      line_number: index + 1,
      product_code: item.product_code,
      product_name: item.product_name,
      product_description: item.product_description,
      unit: item.unit,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      tax_rate: item.tax_rate || 18.00,
      tax_amount: item.tax_amount || 0,
      net_amount: item.net_amount,
      discount_rate: item.discount_rate || 0,
      discount_amount: item.discount_amount || 0
    }));

    const { error: itemsError } = await supabase
      .from('eirsaliye_items')
      .insert(itemsData);

    if (itemsError) throw itemsError;
  }

  return NextResponse.json({ data: irsaliye });
}

// İrsaliye güncelle
async function updateIrsaliye(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('eirsaliye_irsaliyes')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// İrsaliye gönder
async function sendIrsaliye(supabase: any, body: any) {
  const { irsaliye_id } = body;

  // Mock GİB gönderimi
  const mockResponse = {
    gib_uuid: `GIB-${Date.now()}`,
    gib_ettn: `ETTN-${Date.now()}`,
    status: 'GONDERILDI',
    sent_at: new Date().toISOString()
  };

  // İrsaliye durumunu güncelle
  const { data, error } = await supabase
    .from('eirsaliye_irsaliyes')
    .update({
      status: 'sent',
      gib_status: mockResponse.status,
      gib_uuid: mockResponse.gib_uuid,
      gib_ettn: mockResponse.gib_ettn,
      sent_at: mockResponse.sent_at
    })
    .eq('id', irsaliye_id)
    .select()
    .single();

  if (error) throw error;

  // Log kaydı
  await supabase
    .from('eirsaliye_logs')
    .insert({
      irsaliye_id,
      operation_type: 'send',
      status: 'success',
      request_data: { irsaliye_id },
      response_data: mockResponse,
      execution_time: 2500
    });

  return NextResponse.json({ data: { ...data, gib_response: mockResponse } });
}

// Durum kontrolü
async function checkStatus(supabase: any, body: any) {
  const { irsaliye_id } = body;

  // Mock durum kontrolü
  const mockStatuses = ['GONDERILDI', 'KABUL_EDILDI', 'REDDEDILDI', 'BEKLEMEDE'];
  const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];

  const { data, error } = await supabase
    .from('eirsaliye_irsaliyes')
    .update({
      gib_status: randomStatus,
      status: randomStatus === 'KABUL_EDILDI' ? 'accepted' : 
              randomStatus === 'REDDEDILDI' ? 'rejected' : 'sent'
    })
    .eq('id', irsaliye_id)
    .select()
    .single();

  if (error) throw error;

  // Log kaydı
  await supabase
    .from('eirsaliye_logs')
    .insert({
      irsaliye_id,
      operation_type: 'status_check',
      status: 'success',
      request_data: { irsaliye_id },
      response_data: { gib_status: randomStatus },
      execution_time: 1500
    });

  return NextResponse.json({ data: { ...data, current_status: randomStatus } });
}

// PDF indir
async function downloadPdf(supabase: any, body: any) {
  const { irsaliye_id } = body;

  // Mock PDF oluşturma
  const mockPdfData = {
    file_path: `/pdfs/irsaliye_${irsaliye_id}.pdf`,
    file_size: Math.floor(Math.random() * 500000) + 100000,
    download_url: `/api/download/irsaliye/${irsaliye_id}`,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  // Log kaydı
  await supabase
    .from('eirsaliye_logs')
    .insert({
      irsaliye_id,
      operation_type: 'download',
      status: 'success',
      request_data: { irsaliye_id },
      response_data: mockPdfData,
      execution_time: 3000
    });

  return NextResponse.json({ data: mockPdfData });
}

// İrsaliye iptal et
async function cancelIrsaliye(supabase: any, body: any) {
  const { irsaliye_id, reason } = body;

  const { data, error } = await supabase
    .from('eirsaliye_irsaliyes')
    .update({
      status: 'cancelled',
      gib_status: 'IPTAL_EDILDI',
      rejection_reason: reason
    })
    .eq('id', irsaliye_id)
    .select()
    .single();

  if (error) throw error;

  // Log kaydı
  await supabase
    .from('eirsaliye_logs')
    .insert({
      irsaliye_id,
      operation_type: 'cancel',
      status: 'success',
      request_data: { irsaliye_id, reason },
      response_data: { status: 'cancelled' },
      execution_time: 1000
    });

  return NextResponse.json({ data });
}

// Şablon oluştur
async function createTemplate(supabase: any, body: any) {
  const { template_name, template_type, template_data, is_default } = body;

  const { data, error } = await supabase
    .from('eirsaliye_templates')
    .insert({
      template_name,
      template_type,
      template_data,
      is_default: is_default || false
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Şablon güncelle
async function updateTemplate(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('eirsaliye_templates')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Müşteri entegrasyonu oluştur
async function createCustomerIntegration(supabase: any, body: any) {
  const { customer_id, customer_vkn, customer_title, integration_type, integration_config } = body;

  const { data, error } = await supabase
    .from('eirsaliye_customer_integrations')
    .insert({
      customer_id,
      customer_vkn,
      customer_title,
      integration_type,
      integration_config
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Müşteri entegrasyonu güncelle
async function updateCustomerIntegration(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('eirsaliye_customer_integrations')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Toplu işlem oluştur
async function createBatchOperation(supabase: any, body: any) {
  const { batch_name, operation_type, irsaliye_ids } = body;

  const { data, error } = await supabase
    .from('eirsaliye_batch_operations')
    .insert({
      batch_name,
      operation_type,
      total_count: irsaliye_ids.length
    })
    .select()
    .single();

  if (error) throw error;

  // Toplu işlem detaylarını oluştur
  const batchDetails = irsaliye_ids.map((irsaliyeId: string) => ({
    batch_id: data.id,
    irsaliye_id: irsaliyeId,
    status: 'pending'
  }));

  await supabase
    .from('eirsaliye_batch_details')
    .insert(batchDetails);

  return NextResponse.json({ data });
}

// Toplu işlem işle
async function processBatch(supabase: any, body: any) {
  const { batch_id } = body;

  // Mock toplu işlem
  const mockResult = {
    batch_id,
    success_count: Math.floor(Math.random() * 10) + 5,
    error_count: Math.floor(Math.random() * 3),
    status: 'completed'
  };

  const { data, error } = await supabase
    .from('eirsaliye_batch_operations')
    .update({
      status: 'completed',
      success_count: mockResult.success_count,
      error_count: mockResult.error_count,
      completed_at: new Date().toISOString()
    })
    .eq('id', batch_id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data: { ...data, result: mockResult } });
}

// Rapor oluştur
async function generateReport(supabase: any, body: any) {
  const { report_name, report_type, start_date, end_date } = body;

  // Mock rapor verisi
  const mockReportData = {
    total_irsaliyes: Math.floor(Math.random() * 100) + 50,
    total_amount: Math.floor(Math.random() * 1000000) + 500000,
    success_count: Math.floor(Math.random() * 80) + 40,
    error_count: Math.floor(Math.random() * 10) + 5
  };

  const { data, error } = await supabase
    .from('eirsaliye_reports')
    .insert({
      report_name,
      report_type,
      start_date,
      end_date,
      total_irsaliyes: mockReportData.total_irsaliyes,
      total_amount: mockReportData.total_amount,
      success_count: mockReportData.success_count,
      error_count: mockReportData.error_count,
      report_data: mockReportData,
      file_path: `/reports/eirsaliye_${Date.now()}.pdf`
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// İşlem kuyruğa ekle
async function queueOperation(supabase: any, body: any) {
  const { irsaliye_id, operation_type, priority } = body;

  const { data, error } = await supabase
    .from('eirsaliye_queue')
    .insert({
      irsaliye_id,
      operation_type,
      priority: priority || 5
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// İrsaliye sil
async function deleteIrsaliye(supabase: any, id: string) {
  const { error } = await supabase
    .from('eirsaliye_irsaliyes')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'İrsaliye silindi' });
}

// Şablon sil
async function deleteTemplate(supabase: any, id: string) {
  const { error } = await supabase
    .from('eirsaliye_templates')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Şablon silindi' });
}

// Müşteri entegrasyonu sil
async function deleteCustomerIntegration(supabase: any, id: string) {
  const { error } = await supabase
    .from('eirsaliye_customer_integrations')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Müşteri entegrasyonu silindi' });
}

// Toplu işlem sil
async function deleteBatchOperation(supabase: any, id: string) {
  const { error } = await supabase
    .from('eirsaliye_batch_operations')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Toplu işlem silindi' });
}
