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
      case 'banks':
        return await getBanks(supabase);
      case 'integrations':
        return await getIntegrations(supabase);
      case 'accounts':
        return await getBankAccounts(supabase);
      case 'transactions':
        return await getTransactions(supabase, searchParams);
      case 'transfers':
        return await getTransfers(supabase, searchParams);
      case 'credit-cards':
        return await getCreditCardTransactions(supabase, searchParams);
      case 'notifications':
        return await getNotifications(supabase);
      case 'templates':
        return await getTemplates(supabase);
      case 'logs':
        return await getIntegrationLogs(supabase, searchParams);
      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('Bank integration GET error:', error);
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
      case 'create_integration':
        return await createIntegration(supabase, body);
      case 'update_integration':
        return await updateIntegration(supabase, body);
      case 'create_account':
        return await createBankAccount(supabase, body);
      case 'update_account':
        return await updateBankAccount(supabase, body);
      case 'create_transfer':
        return await createTransfer(supabase, body);
      case 'create_template':
        return await createTemplate(supabase, body);
      case 'update_template':
        return await updateTemplate(supabase, body);
      case 'sync_account':
        return await syncAccount(supabase, body);
      case 'test_connection':
        return await testConnection(supabase, body);
      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('Bank integration POST error:', error);
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
      case 'delete_integration':
        return await deleteIntegration(supabase, id);
      case 'delete_account':
        return await deleteBankAccount(supabase, id);
      case 'delete_template':
        return await deleteTemplate(supabase, id);
      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('Bank integration DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Banka listesi
async function getBanks(supabase: any) {
  const { data, error } = await supabase
    .from('banks')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return NextResponse.json({ data });
}

// Entegrasyon listesi
async function getIntegrations(supabase: any) {
  const { data, error } = await supabase
    .from('bank_integrations')
    .select(`
      *,
      banks (
        name,
        code,
        logo_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return NextResponse.json({ data });
}

// Banka hesapları
async function getBankAccounts(supabase: any) {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select(`
      *,
      banks (
        name,
        code,
        logo_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return NextResponse.json({ data });
}

// İşlem geçmişi
async function getTransactions(supabase: any, searchParams: URLSearchParams) {
  const accountId = searchParams.get('account_id');
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('bank_transactions')
    .select(`
      *,
      bank_accounts (
        account_name,
        account_number,
        banks (
          name,
          code
        )
      )
    `)
    .order('transaction_date', { ascending: false })
    .limit(limit);

  if (accountId) {
    query = query.eq('bank_account_id', accountId);
  }

  if (startDate) {
    query = query.gte('transaction_date', startDate);
  }

  if (endDate) {
    query = query.lte('transaction_date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Transfer işlemleri
async function getTransfers(supabase: any, searchParams: URLSearchParams) {
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('bank_transfers')
    .select(`
      *,
      bank_accounts (
        account_name,
        account_number,
        banks (
          name,
          code
        )
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

// Kredi kartı işlemleri
async function getCreditCardTransactions(supabase: any, searchParams: URLSearchParams) {
  const startDate = searchParams.get('start_date');
  const endDate = searchParams.get('end_date');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('credit_card_transactions')
    .select('*')
    .order('transaction_date', { ascending: false })
    .limit(limit);

  if (startDate) {
    query = query.gte('transaction_date', startDate);
  }

  if (endDate) {
    query = query.lte('transaction_date', endDate);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Bildirimler
async function getNotifications(supabase: any) {
  const { data, error } = await supabase
    .from('bank_notifications')
    .select(`
      *,
      bank_accounts (
        account_name,
        banks (
          name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return NextResponse.json({ data });
}

// Şablonlar
async function getTemplates(supabase: any) {
  const { data, error } = await supabase
    .from('bank_templates')
    .select(`
      *,
      banks (
        name,
        code
      )
    `)
    .eq('is_active', true)
    .order('template_name');

  if (error) throw error;
  return NextResponse.json({ data });
}

// Entegrasyon logları
async function getIntegrationLogs(supabase: any, searchParams: URLSearchParams) {
  const integrationId = searchParams.get('integration_id');
  const limit = parseInt(searchParams.get('limit') || '100');

  let query = supabase
    .from('bank_integration_logs')
    .select(`
      *,
      bank_integrations (
        banks (
          name,
          code
        )
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (integrationId) {
    query = query.eq('bank_integration_id', integrationId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Entegrasyon oluştur
async function createIntegration(supabase: any, body: any) {
  const { bank_id, integration_type, api_endpoint, api_key, api_secret, username, password, is_test_mode } = body;

  const { data, error } = await supabase
    .from('bank_integrations')
    .insert({
      bank_id,
      integration_type,
      api_endpoint,
      api_key,
      api_secret,
      username,
      password,
      is_test_mode: is_test_mode || true
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Entegrasyon güncelle
async function updateIntegration(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('bank_integrations')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Banka hesabı oluştur
async function createBankAccount(supabase: any, body: any) {
  const { bank_id, account_name, account_number, iban, currency_code, account_type } = body;

  const { data, error } = await supabase
    .from('bank_accounts')
    .insert({
      bank_id,
      account_name,
      account_number,
      iban,
      currency_code: currency_code || 'TRY',
      account_type: account_type || 'checking'
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Banka hesabı güncelle
async function updateBankAccount(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('bank_accounts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Transfer oluştur
async function createTransfer(supabase: any, body: any) {
  const { from_account_id, to_bank_code, to_account_number, to_iban, to_name, amount, currency_code, description, transfer_type } = body;

  const { data, error } = await supabase
    .from('bank_transfers')
    .insert({
      from_account_id,
      to_bank_code,
      to_account_number,
      to_iban,
      to_name,
      amount,
      currency_code: currency_code || 'TRY',
      description,
      transfer_type: transfer_type || 'eft'
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Şablon oluştur
async function createTemplate(supabase: any, body: any) {
  const { bank_id, template_name, template_type, template_data } = body;

  const { data, error } = await supabase
    .from('bank_templates')
    .insert({
      bank_id,
      template_name,
      template_type,
      template_data
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
    .from('bank_templates')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Hesap senkronizasyonu
async function syncAccount(supabase: any, body: any) {
  const { account_id } = body;

  // Bu fonksiyon gerçek banka API'si ile entegre edilecek
  // Şimdilik mock data döndürüyoruz
  
  const { data, error } = await supabase
    .from('bank_accounts')
    .update({ 
      last_balance_update: new Date().toISOString(),
      balance: Math.random() * 100000 // Mock balance
    })
    .eq('id', account_id)
    .select()
    .single();

  if (error) throw error;

  // Log kaydı
  await supabase
    .from('bank_integration_logs')
    .insert({
      bank_integration_id: data.bank_id,
      operation_type: 'sync',
      status: 'success',
      request_data: { account_id },
      response_data: { balance: data.balance },
      execution_time: 1500
    });

  return NextResponse.json({ data });
}

// Bağlantı testi
async function testConnection(supabase: any, body: any) {
  const { integration_id } = body;

  // Mock bağlantı testi
  const isConnected = Math.random() > 0.3; // %70 başarı oranı

  // Log kaydı
  await supabase
    .from('bank_integration_logs')
    .insert({
      bank_integration_id: integration_id,
      operation_type: 'test_connection',
      status: isConnected ? 'success' : 'error',
      request_data: { integration_id },
      response_data: { connected: isConnected },
      execution_time: 2000
    });

  return NextResponse.json({ 
    data: { 
      connected: isConnected,
      message: isConnected ? 'Bağlantı başarılı' : 'Bağlantı başarısız'
    }
  });
}

// Entegrasyon sil
async function deleteIntegration(supabase: any, id: string) {
  const { error } = await supabase
    .from('bank_integrations')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Entegrasyon silindi' });
}

// Banka hesabı sil
async function deleteBankAccount(supabase: any, id: string) {
  const { error } = await supabase
    .from('bank_accounts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Banka hesabı silindi' });
}

// Şablon sil
async function deleteTemplate(supabase: any, id: string) {
  const { error } = await supabase
    .from('bank_templates')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Şablon silindi' });
}
