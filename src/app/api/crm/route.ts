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

// CRM verilerini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const customerId = searchParams.get('customer_id');

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    if (type === 'dashboard') {
      // CRM Dashboard verileri
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id, customer_status, customer_tier, total_spent, created_at');

      if (customersError) {
        console.error('Customers fetch error:', customersError);
        return NextResponse.json({ 
          success: false, 
          error: 'Müşteri verileri alınamadı' 
        }, { status: 500 });
      }

      // İstatistikler
      const totalCustomers = customers?.length || 0;
      const activeCustomers = customers?.filter(c => c.customer_status === 'active').length || 0;
      const vipCustomers = customers?.filter(c => c.customer_tier === 'platinum').length || 0;
      const totalRevenue = customers?.reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0;

      // Son 30 gün içinde kayıt olan müşteriler
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newCustomers = customers?.filter(c => 
        new Date(c.created_at) >= thirtyDaysAgo
      ).length || 0;

      // Müşteri tier dağılımı
      const tierDistribution = customers?.reduce((acc, customer) => {
        const tier = customer.customer_tier || 'bronze';
        acc[tier] = (acc[tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return NextResponse.json({
        success: true,
        data: {
          totalCustomers,
          activeCustomers,
          vipCustomers,
          newCustomers,
          totalRevenue,
          tierDistribution
        }
      });
    }

    if (type === 'customers') {
      // Müşterileri getir
      const { data: customers, error } = await supabase
        .from('customers')
        .select(`
          *,
          tags:customer_tag_relations(
            tag:customer_tags(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Customers fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Müşteriler alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        customers: customers || []
      });
    }

    if (type === 'customer_detail' && customerId) {
      // Tek müşteri detayı
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select(`
          *,
          tags:customer_tag_relations(
            tag:customer_tags(*)
          )
        `)
        .eq('id', customerId)
        .single();

      if (customerError) {
        console.error('Customer detail fetch error:', customerError);
        return NextResponse.json({ 
          success: false, 
          error: 'Müşteri detayları alınamadı' 
        }, { status: 500 });
      }

      // Müşteri iletişim geçmişi
      const { data: communications, error: commError } = await supabase
        .from('customer_communications')
        .select('*')
        .eq('customer_id', customerId)
        .order('communication_date', { ascending: false });

      if (commError) {
        console.error('Communications fetch error:', commError);
      }

      // Müşteri görevleri
      const { data: tasks, error: tasksError } = await supabase
        .from('customer_tasks')
        .select('*')
        .eq('customer_id', customerId)
        .order('due_date', { ascending: true });

      if (tasksError) {
        console.error('Tasks fetch error:', tasksError);
      }

      // Müşteri fırsatları
      const { data: opportunities, error: oppError } = await supabase
        .from('customer_opportunities')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (oppError) {
        console.error('Opportunities fetch error:', oppError);
      }

      return NextResponse.json({
        success: true,
        customer,
        communications: communications || [],
        tasks: tasks || [],
        opportunities: opportunities || []
      });
    }

    if (type === 'tags') {
      // Etiketleri getir
      const { data: tags, error } = await supabase
        .from('customer_tags')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Tags fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Etiketler alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        tags: tags || []
      });
    }

    if (type === 'segments') {
      // Segmentleri getir
      const { data: segments, error } = await supabase
        .from('customer_segments')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        console.error('Segments fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Segmentler alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        segments: segments || []
      });
    }

    if (type === 'campaigns') {
      // Kampanyaları getir
      const { data: campaigns, error } = await supabase
        .from('customer_campaigns')
        .select(`
          *,
          segment:target_segment_id(
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Campaigns fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Kampanyalar alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        campaigns: campaigns || []
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz tip parametresi' 
    }, { status: 400 });

  } catch (error) {
    console.error('CRM API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// CRM işlemleri
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

    if (action === 'create_customer') {
      const {
        first_name,
        last_name,
        email,
        phone,
        company_name,
        customer_type,
        customer_tier,
        notes,
        tags,
        created_by
      } = data;

      // Müşteri kodu oluştur
      const customerCode = `CUST-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert({
          customer_code: customerCode,
          first_name,
          last_name,
          email,
          phone,
          company_name,
          customer_type: customer_type || 'individual',
          customer_tier: customer_tier || 'bronze',
          notes,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create customer error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Müşteri oluşturulamadı' 
        }, { status: 500 });
      }

      // Etiketleri ekle
      if (tags && tags.length > 0) {
        const tagRelations = tags.map((tagId: string) => ({
          customer_id: newCustomer.id,
          tag_id: tagId
        }));

        await supabase
          .from('customer_tag_relations')
          .insert(tagRelations);
      }

      return NextResponse.json({
        success: true,
        customer: newCustomer
      });
    }

    if (action === 'add_communication') {
      const {
        customer_id,
        communication_type,
        direction,
        subject,
        content,
        duration_minutes,
        outcome,
        follow_up_date,
        follow_up_notes,
        is_important,
        created_by
      } = data;

      const { data: newCommunication, error } = await supabase
        .from('customer_communications')
        .insert({
          customer_id,
          communication_type,
          direction,
          subject,
          content,
          duration_minutes,
          outcome,
          follow_up_date,
          follow_up_notes,
          is_important: is_important || false,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Add communication error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'İletişim kaydı eklenemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        communication: newCommunication
      });
    }

    if (action === 'create_task') {
      const {
        customer_id,
        title,
        description,
        task_type,
        priority,
        due_date,
        assigned_to,
        created_by
      } = data;

      const { data: newTask, error } = await supabase
        .from('customer_tasks')
        .insert({
          customer_id,
          title,
          description,
          task_type: task_type || 'follow_up',
          priority: priority || 'medium',
          due_date,
          assigned_to,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create task error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Görev oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        task: newTask
      });
    }

    if (action === 'create_opportunity') {
      const {
        customer_id,
        title,
        description,
        stage,
        probability,
        expected_value,
        expected_close_date,
        source,
        competitor,
        notes,
        assigned_to,
        created_by
      } = data;

      const { data: newOpportunity, error } = await supabase
        .from('customer_opportunities')
        .insert({
          customer_id,
          title,
          description,
          stage: stage || 'lead',
          probability: probability || 0,
          expected_value,
          expected_close_date,
          source,
          competitor,
          notes,
          assigned_to,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create opportunity error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Fırsat oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        opportunity: newOpportunity
      });
    }

    if (action === 'create_campaign') {
      const {
        name,
        description,
        campaign_type,
        target_segment_id,
        start_date,
        end_date,
        created_by
      } = data;

      const { data: newCampaign, error } = await supabase
        .from('customer_campaigns')
        .insert({
          name,
          description,
          campaign_type,
          target_segment_id,
          start_date,
          end_date,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create campaign error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Kampanya oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        campaign: newCampaign
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz işlem' 
    }, { status: 400 });

  } catch (error) {
    console.error('CRM POST API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// CRM güncelleme işlemleri
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

    if (action === 'update_customer') {
      const { customer_id, ...updateData } = data;

      const { data: updatedCustomer, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', customer_id)
        .select()
        .single();

      if (error) {
        console.error('Update customer error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Müşteri güncellenemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        customer: updatedCustomer
      });
    }

    if (action === 'update_task_status') {
      const { task_id, status, completed_date } = data;

      const updateData: any = { status };
      if (status === 'completed' && completed_date) {
        updateData.completed_date = completed_date;
      }

      const { data: updatedTask, error } = await supabase
        .from('customer_tasks')
        .update(updateData)
        .eq('id', task_id)
        .select()
        .single();

      if (error) {
        console.error('Update task status error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Görev durumu güncellenemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        task: updatedTask
      });
    }

    if (action === 'update_opportunity_stage') {
      const { opportunity_id, stage, actual_close_date } = data;

      const updateData: any = { stage };
      if (stage === 'closed_won' || stage === 'closed_lost') {
        updateData.actual_close_date = actual_close_date || new Date().toISOString().split('T')[0];
      }

      const { data: updatedOpportunity, error } = await supabase
        .from('customer_opportunities')
        .update(updateData)
        .eq('id', opportunity_id)
        .select()
        .single();

      if (error) {
        console.error('Update opportunity stage error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Fırsat durumu güncellenemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        opportunity: updatedOpportunity
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz işlem' 
    }, { status: 400 });

  } catch (error) {
    console.error('CRM PUT API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
