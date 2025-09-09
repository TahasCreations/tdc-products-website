import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const getServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseKey);
};

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'categories':
        return await getCategories(supabase);
      case 'templates':
        return await getTemplates(supabase, searchParams);
      case 'widgets':
        return await getWidgets(supabase, searchParams);
      case 'dashboards':
        return await getDashboards(supabase);
      case 'executions':
        return await getExecutions(supabase, searchParams);
      case 'data-sources':
        return await getDataSources(supabase);
      case 'filters':
        return await getFilters(supabase, searchParams);
      case 'shares':
        return await getShares(supabase, searchParams);
      case 'subscriptions':
        return await getSubscriptions(supabase);
      case 'logs':
        return await getLogs(supabase, searchParams);
      case 'cache':
        return await getCache(supabase, searchParams);
      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create_category':
        return await createCategory(supabase, body);
      case 'update_category':
        return await updateCategory(supabase, body);
      case 'create_template':
        return await createTemplate(supabase, body);
      case 'update_template':
        return await updateTemplate(supabase, body);
      case 'create_widget':
        return await createWidget(supabase, body);
      case 'update_widget':
        return await updateWidget(supabase, body);
      case 'create_dashboard':
        return await createDashboard(supabase, body);
      case 'update_dashboard':
        return await updateDashboard(supabase, body);
      case 'execute_report':
        return await executeReport(supabase, body);
      case 'create_filter':
        return await createFilter(supabase, body);
      case 'update_filter':
        return await updateFilter(supabase, body);
      case 'create_share':
        return await createShare(supabase, body);
      case 'create_subscription':
        return await createSubscription(supabase, body);
      case 'update_subscription':
        return await updateSubscription(supabase, body);
      case 'export_report':
        return await exportReport(supabase, body);
      case 'preview_report':
        return await previewReport(supabase, body);
      case 'validate_query':
        return await validateQuery(supabase, body);
      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
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
      case 'delete_category':
        return await deleteCategory(supabase, id);
      case 'delete_template':
        return await deleteTemplate(supabase, id);
      case 'delete_widget':
        return await deleteWidget(supabase, id);
      case 'delete_dashboard':
        return await deleteDashboard(supabase, id);
      case 'delete_filter':
        return await deleteFilter(supabase, id);
      case 'delete_share':
        return await deleteShare(supabase, id);
      case 'delete_subscription':
        return await deleteSubscription(supabase, id);
      case 'clear_cache':
        return await clearCache(supabase, id);
      default:
        return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Kategoriler
async function getCategories(supabase: any) {
  const { data, error } = await supabase
    .from('report_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) throw error;
  return NextResponse.json({ data });
}

// Şablonlar
async function getTemplates(supabase: any, searchParams: URLSearchParams) {
  const categoryId = searchParams.get('category_id');
  const templateType = searchParams.get('template_type');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('report_templates')
    .select(`
      *,
      report_categories (
        name,
        icon,
        color
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  if (templateType) {
    query = query.eq('template_type', templateType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Widget'lar
async function getWidgets(supabase: any, searchParams: URLSearchParams) {
  const category = searchParams.get('category');
  const widgetType = searchParams.get('widget_type');

  let query = supabase
    .from('report_widgets')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (category) {
    query = query.eq('category', category);
  }

  if (widgetType) {
    query = query.eq('widget_type', widgetType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Dashboard'lar
async function getDashboards(supabase: any) {
  const { data, error } = await supabase
    .from('report_dashboards')
    .select(`
      *,
      dashboard_widgets (
        position_x,
        position_y,
        width,
        height,
        widget_config,
        report_widgets (
          name,
          widget_type,
          widget_config,
          data_query
        )
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return NextResponse.json({ data });
}

// Rapor çalıştırmaları
async function getExecutions(supabase: any, searchParams: URLSearchParams) {
  const templateId = searchParams.get('template_id');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '50');

  let query = supabase
    .from('report_executions')
    .select(`
      *,
      report_templates (
        name,
        template_type
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (templateId) {
    query = query.eq('template_id', templateId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Veri kaynakları
async function getDataSources(supabase: any) {
  const { data, error } = await supabase
    .from('report_data_sources')
    .select('*')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return NextResponse.json({ data });
}

// Filtreler
async function getFilters(supabase: any, searchParams: URLSearchParams) {
  const templateId = searchParams.get('template_id');

  let query = supabase
    .from('report_filters')
    .select('*')
    .order('sort_order');

  if (templateId) {
    query = query.eq('template_id', templateId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Paylaşımlar
async function getShares(supabase: any, searchParams: URLSearchParams) {
  const templateId = searchParams.get('template_id');
  const dashboardId = searchParams.get('dashboard_id');

  let query = supabase
    .from('report_shares')
    .select(`
      *,
      report_templates (
        name
      ),
      report_dashboards (
        name
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (templateId) {
    query = query.eq('template_id', templateId);
  }

  if (dashboardId) {
    query = query.eq('dashboard_id', dashboardId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Abonelikler
async function getSubscriptions(supabase: any) {
  const { data, error } = await supabase
    .from('report_subscriptions')
    .select(`
      *,
      report_templates (
        name
      ),
      report_dashboards (
        name
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return NextResponse.json({ data });
}

// Loglar
async function getLogs(supabase: any, searchParams: URLSearchParams) {
  const templateId = searchParams.get('template_id');
  const dashboardId = searchParams.get('dashboard_id');
  const logType = searchParams.get('log_type');
  const limit = parseInt(searchParams.get('limit') || '100');

  let query = supabase
    .from('report_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (templateId) {
    query = query.eq('template_id', templateId);
  }

  if (dashboardId) {
    query = query.eq('dashboard_id', dashboardId);
  }

  if (logType) {
    query = query.eq('log_type', logType);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Cache
async function getCache(supabase: any, searchParams: URLSearchParams) {
  const templateId = searchParams.get('template_id');
  const cacheKey = searchParams.get('cache_key');

  let query = supabase
    .from('report_cache')
    .select('*')
    .gt('expires_at', new Date().toISOString());

  if (templateId) {
    query = query.eq('template_id', templateId);
  }

  if (cacheKey) {
    query = query.eq('cache_key', cacheKey);
  }

  const { data, error } = await query;

  if (error) throw error;
  return NextResponse.json({ data });
}

// Kategori oluştur
async function createCategory(supabase: any, body: any) {
  const { name, description, icon, color, parent_id, sort_order } = body;

  const { data, error } = await supabase
    .from('report_categories')
    .insert({
      name,
      description,
      icon,
      color: color || '#6b7280',
      parent_id,
      sort_order: sort_order || 0
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Kategori güncelle
async function updateCategory(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('report_categories')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Şablon oluştur
async function createTemplate(supabase: any, body: any) {
  const { 
    name, 
    description, 
    category_id, 
    template_type, 
    data_source, 
    template_config, 
    layout_config, 
    filters_config, 
    export_formats,
    is_public 
  } = body;

  const { data, error } = await supabase
    .from('report_templates')
    .insert({
      name,
      description,
      category_id,
      template_type,
      data_source,
      template_config,
      layout_config,
      filters_config,
      export_formats: export_formats || ['pdf', 'excel', 'csv'],
      is_public: is_public || false
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
    .from('report_templates')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Widget oluştur
async function createWidget(supabase: any, body: any) {
  const { name, widget_type, category, widget_config, data_query, icon, description } = body;

  const { data, error } = await supabase
    .from('report_widgets')
    .insert({
      name,
      widget_type,
      category,
      widget_config,
      data_query,
      icon,
      description
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Widget güncelle
async function updateWidget(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('report_widgets')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Dashboard oluştur
async function createDashboard(supabase: any, body: any) {
  const { name, description, layout_config, widgets_config, refresh_interval, is_public } = body;

  const { data, error } = await supabase
    .from('report_dashboards')
    .insert({
      name,
      description,
      layout_config,
      widgets_config,
      refresh_interval: refresh_interval || 300,
      is_public: is_public || false
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Dashboard güncelle
async function updateDashboard(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('report_dashboards')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Rapor çalıştır
async function executeReport(supabase: any, body: any) {
  const { template_id, execution_name, parameters, filters } = body;

  // Rapor çalıştırma kaydı oluştur
  const { data: execution, error: executionError } = await supabase
    .from('report_executions')
    .insert({
      template_id,
      execution_name,
      parameters,
      filters,
      status: 'running'
    })
    .select()
    .single();

  if (executionError) throw executionError;

  // Mock rapor çalıştırma (gerçek implementasyonda background job olacak)
  setTimeout(async () => {
    const mockData = {
      total_records: Math.floor(Math.random() * 1000) + 100,
      execution_time: Math.floor(Math.random() * 5000) + 1000,
      data: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Kayıt ${i + 1}`,
        value: Math.floor(Math.random() * 10000),
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
      }))
    };

    await supabase
      .from('report_executions')
      .update({
        status: 'completed',
        result_data: mockData,
        execution_time: mockData.execution_time,
        completed_at: new Date().toISOString()
      })
      .eq('id', execution.id);
  }, 2000);

  return NextResponse.json({ data: execution });
}

// Filtre oluştur
async function createFilter(supabase: any, body: any) {
  const { template_id, filter_name, filter_type, field_name, filter_config, is_required, default_value, sort_order } = body;

  const { data, error } = await supabase
    .from('report_filters')
    .insert({
      template_id,
      filter_name,
      filter_type,
      field_name,
      filter_config,
      is_required: is_required || false,
      default_value,
      sort_order: sort_order || 0
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Filtre güncelle
async function updateFilter(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('report_filters')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Paylaşım oluştur
async function createShare(supabase: any, body: any) {
  const { template_id, dashboard_id, share_type, access_level, expires_at } = body;

  const shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const { data, error } = await supabase
    .from('report_shares')
    .insert({
      template_id,
      dashboard_id,
      share_type,
      share_token: shareToken,
      access_level: access_level || 'view',
      expires_at
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Abonelik oluştur
async function createSubscription(supabase: any, body: any) {
  const { 
    template_id, 
    dashboard_id, 
    subscription_type, 
    schedule_type, 
    schedule_config, 
    email_recipients, 
    export_format 
  } = body;

  // Sonraki çalıştırma zamanını hesapla
  const nextExecution = calculateNextExecution(schedule_type, schedule_config);

  const { data, error } = await supabase
    .from('report_subscriptions')
    .insert({
      template_id,
      dashboard_id,
      subscription_type,
      schedule_type,
      schedule_config,
      email_recipients,
      export_format: export_format || 'pdf',
      next_execution_at: nextExecution
    })
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Abonelik güncelle
async function updateSubscription(supabase: any, body: any) {
  const { id, ...updateData } = body;

  const { data, error } = await supabase
    .from('report_subscriptions')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return NextResponse.json({ data });
}

// Rapor dışa aktar
async function exportReport(supabase: any, body: any) {
  const { execution_id, format } = body;

  // Mock export işlemi
  const exportData = {
    file_path: `/exports/report_${execution_id}.${format}`,
    file_size: Math.floor(Math.random() * 1000000) + 50000,
    download_url: `/api/download/report/${execution_id}`,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };

  return NextResponse.json({ data: exportData });
}

// Rapor önizleme
async function previewReport(supabase: any, body: any) {
  const { template_id, parameters, filters } = body;

  // Mock önizleme verisi
  const previewData = {
    total_records: 25,
    sample_data: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Örnek Kayıt ${i + 1}`,
      value: Math.floor(Math.random() * 1000),
      date: new Date().toISOString()
    })),
    columns: ['ID', 'Ad', 'Değer', 'Tarih'],
    estimated_time: '2-3 saniye'
  };

  return NextResponse.json({ data: previewData });
}

// Sorgu doğrula
async function validateQuery(supabase: any, body: any) {
  const { query, data_source_id } = body;

  // Mock sorgu doğrulama
  const isValid = query.toLowerCase().includes('select') && !query.toLowerCase().includes('drop');

  return NextResponse.json({ 
    data: { 
      valid: isValid,
      message: isValid ? 'Sorgu geçerli' : 'Sorgu geçersiz - sadece SELECT sorgularına izin verilir'
    }
  });
}

// Kategori sil
async function deleteCategory(supabase: any, id: string) {
  const { error } = await supabase
    .from('report_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Kategori silindi' });
}

// Şablon sil
async function deleteTemplate(supabase: any, id: string) {
  const { error } = await supabase
    .from('report_templates')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Şablon silindi' });
}

// Widget sil
async function deleteWidget(supabase: any, id: string) {
  const { error } = await supabase
    .from('report_widgets')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Widget silindi' });
}

// Dashboard sil
async function deleteDashboard(supabase: any, id: string) {
  const { error } = await supabase
    .from('report_dashboards')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Dashboard silindi' });
}

// Filtre sil
async function deleteFilter(supabase: any, id: string) {
  const { error } = await supabase
    .from('report_filters')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Filtre silindi' });
}

// Paylaşım sil
async function deleteShare(supabase: any, id: string) {
  const { error } = await supabase
    .from('report_shares')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Paylaşım silindi' });
}

// Abonelik sil
async function deleteSubscription(supabase: any, id: string) {
  const { error } = await supabase
    .from('report_subscriptions')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Abonelik silindi' });
}

// Cache temizle
async function clearCache(supabase: any, id: string) {
  const { error } = await supabase
    .from('report_cache')
    .delete()
    .eq('template_id', id);

  if (error) throw error;
  return NextResponse.json({ message: 'Cache temizlendi' });
}

// Yardımcı fonksiyonlar
function calculateNextExecution(scheduleType: string, scheduleConfig: any): string {
  const now = new Date();
  
  switch (scheduleType) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  }
}