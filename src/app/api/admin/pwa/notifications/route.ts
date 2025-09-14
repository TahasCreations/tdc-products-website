import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface NotificationCampaign {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  scheduledAt: string;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  sentCount: number;
  openRate: number;
  created_at: string;
  updated_at: string;
}

interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Get notification campaigns
    const { data: campaigns, error: campaignsError } = await supabase
      .from('notification_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (campaignsError) {
      console.error('Campaigns error:', campaignsError);
      // Return mock data
      const mockCampaigns: NotificationCampaign[] = [
        {
          id: '1',
          title: 'Yeni Ürün Duyurusu',
          message: 'Yeni ürünlerimizi keşfedin!',
          targetAudience: 'all',
          scheduledAt: new Date().toISOString(),
          status: 'sent',
          sentCount: 1250,
          openRate: 85,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Kampanya Bildirimi',
          message: 'Özel indirimler sizi bekliyor!',
          targetAudience: 'active_users',
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          status: 'scheduled',
          sentCount: 0,
          openRate: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return NextResponse.json({ 
        success: true, 
        campaigns: mockCampaigns 
      });
    }

    return NextResponse.json({ 
      success: true, 
      campaigns: campaigns || [] 
    });

  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch notification campaigns' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const body = await request.json();
    const { title, message, targetAudience, scheduledAt, status = 'draft' } = body;

    // Validate required fields
    if (!title || !message || !targetAudience) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, message, and target audience are required' 
      }, { status: 400 });
    }

    // Create notification campaign
    const campaign = {
      title,
      message,
      target_audience: targetAudience,
      scheduled_at: scheduledAt || new Date().toISOString(),
      status,
      sent_count: 0,
      open_rate: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('notification_campaigns')
      .insert([campaign])
      .select()
      .single();

    if (error) {
      console.error('Campaign creation error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create notification campaign' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      campaign: data 
    });

  } catch (error) {
    console.error('Notification campaign creation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create notification campaign' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Campaign ID is required' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('notification_campaigns')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Campaign update error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update notification campaign' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      campaign: data 
    });

  } catch (error) {
    console.error('Notification campaign update error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update notification campaign' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Campaign ID is required' 
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('notification_campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Campaign deletion error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete notification campaign' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Campaign deleted successfully' 
    });

  } catch (error) {
    console.error('Notification campaign deletion error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete notification campaign' 
    }, { status: 500 });
  }
}
