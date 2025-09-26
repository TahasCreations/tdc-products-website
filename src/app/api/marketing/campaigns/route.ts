import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const channel = searchParams.get('channel') || '';

    let campaigns = [];

    if (supabase) {
      // Supabase'den pazarlama kampanyalarını çek
      let query = supabase
        .from('marketing_campaigns')
        .select(`
          id,
          name,
          description,
          status,
          channel,
          campaign_type,
          budget,
          start_date,
          end_date,
          target_audience,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      // Filtreler
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      if (status) {
        query = query.eq('status', status);
      }
      if (channel) {
        query = query.eq('channel', channel);
      }

      // Sayfalama
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase marketing campaigns error:', error);
        throw error;
      }

      campaigns = data?.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        description: campaign.description || '',
        status: campaign.status || 'draft',
        channel: campaign.channel || 'Diğer',
        campaign_type: campaign.campaign_type || 'Diğer',
        budget: campaign.budget || 0,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        target_audience: campaign.target_audience || '',
        created_at: campaign.created_at,
        updated_at: campaign.updated_at
      })) || [];

    } else {
      // Fallback: Mock data
      campaigns = [
        {
          id: '1',
          name: 'Yaz Kampanyası 2024',
          description: 'Yaz sezonu için özel kampanya',
          status: 'active',
          channel: 'Email',
          campaign_type: 'Email Marketing',
          budget: 10000,
          start_date: '2024-06-01T00:00:00Z',
          end_date: '2024-08-31T23:59:59Z',
          target_audience: '18-35 yaş arası müşteriler',
          created_at: '2024-05-15T10:00:00Z',
          updated_at: '2024-05-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Sosyal Medya Boost',
          description: 'Instagram ve Facebook reklamları',
          status: 'active',
          channel: 'Sosyal Medya',
          campaign_type: 'Sosyal Medya',
          budget: 5000,
          start_date: '2024-07-01T00:00:00Z',
          end_date: '2024-07-31T23:59:59Z',
          target_audience: 'Genç yetişkinler',
          created_at: '2024-06-20T10:00:00Z',
          updated_at: '2024-06-20T10:00:00Z'
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: campaigns,
      pagination: {
        page,
        limit,
        total: campaigns.length
      }
    });

  } catch (error) {
    console.error('Marketing campaigns error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch marketing campaigns',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...campaignData } = body;

    if (action === 'create') {
      if (supabase) {
        const { data, error } = await supabase
          .from('marketing_campaigns')
          .insert([{
            name: campaignData.name,
            description: campaignData.description || '',
            status: campaignData.status || 'draft',
            channel: campaignData.channel,
            campaign_type: campaignData.campaign_type,
            budget: parseFloat(campaignData.budget) || 0,
            start_date: campaignData.start_date,
            end_date: campaignData.end_date,
            target_audience: campaignData.target_audience || ''
          }])
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Marketing campaign created successfully',
          data
        });
      } else {
        // Fallback: Mock creation
        const newCampaign = {
          id: Date.now().toString(),
          ...campaignData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        return NextResponse.json({
          success: true,
          message: 'Marketing campaign created successfully (mock)',
          data: newCampaign
        });
      }
    }

    if (action === 'update' && id) {
      if (supabase) {
        const { data, error } = await supabase
          .from('marketing_campaigns')
          .update({
            name: campaignData.name,
            description: campaignData.description,
            status: campaignData.status,
            channel: campaignData.channel,
            campaign_type: campaignData.campaign_type,
            budget: parseFloat(campaignData.budget) || 0,
            start_date: campaignData.start_date,
            end_date: campaignData.end_date,
            target_audience: campaignData.target_audience,
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
          message: 'Marketing campaign updated successfully',
          data
        });
      } else {
        // Fallback: Mock update
        return NextResponse.json({
          success: true,
          message: 'Marketing campaign updated successfully (mock)',
          data: { id, ...campaignData }
        });
      }
    }

    if (action === 'delete' && id) {
      if (supabase) {
        const { error } = await supabase
          .from('marketing_campaigns')
          .delete()
          .eq('id', id);

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Marketing campaign deleted successfully'
        });
      } else {
        // Fallback: Mock delete
        return NextResponse.json({
          success: true,
          message: 'Marketing campaign deleted successfully (mock)'
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Marketing campaigns error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process marketing campaign request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
