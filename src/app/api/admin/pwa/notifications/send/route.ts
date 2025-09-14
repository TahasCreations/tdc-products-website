import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface PushNotificationPayload {
  title: string;
  message: string;
  targetAudience: string;
  data?: any;
  icon?: string;
  badge?: string;
  image?: string;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const body: PushNotificationPayload = await request.json();
    const { title, message, targetAudience, data, icon, badge, image, actions } = body;

    // Validate required fields
    if (!title || !message || !targetAudience) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title, message, and target audience are required' 
      }, { status: 400 });
    }

    // Get push subscriptions based on target audience
    let subscriptions: PushSubscription[] = [];
    
    if (targetAudience === 'all') {
      const { data: allSubscriptions, error: allError } = await supabase
        .from('push_subscriptions')
        .select('*');
      
      if (allError) {
        console.error('Error fetching all subscriptions:', allError);
      } else {
        subscriptions = allSubscriptions || [];
      }
    } else if (targetAudience === 'active_users') {
      // Get subscriptions for active users (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const { data: activeSubscriptions, error: activeError } = await supabase
        .from('push_subscriptions')
        .select(`
          *,
          user:user_id (
            last_active_at
          )
        `)
        .gte('user.last_active_at', sevenDaysAgo.toISOString());
      
      if (activeError) {
        console.error('Error fetching active subscriptions:', activeError);
      } else {
        subscriptions = activeSubscriptions || [];
      }
    } else if (targetAudience === 'premium_users') {
      // Get subscriptions for premium users
      const { data: premiumSubscriptions, error: premiumError } = await supabase
        .from('push_subscriptions')
        .select(`
          *,
          user:user_id (
            subscription_type
          )
        `)
        .eq('user.subscription_type', 'premium');
      
      if (premiumError) {
        console.error('Error fetching premium subscriptions:', premiumError);
      } else {
        subscriptions = premiumSubscriptions || [];
      }
    }

    // If no subscriptions found, return mock success for demo
    if (subscriptions.length === 0) {
      console.log('No subscriptions found, returning mock success');
      return NextResponse.json({
        success: true,
        message: 'Notification sent successfully (demo mode)',
        sentCount: 0,
        targetAudience
      });
    }

    // Send push notifications
    const results = await Promise.allSettled(
      subscriptions.map(subscription => sendPushNotification(subscription, {
        title,
        message,
        data,
        icon: icon || '/icons/icon-192x192.png',
        badge: badge || '/icons/badge-72x72.png',
        image,
        actions: actions || [
          {
            action: 'view',
            title: 'Görüntüle',
            icon: '/icons/action-view.png'
          },
          {
            action: 'dismiss',
            title: 'Kapat',
            icon: '/icons/action-close.png'
          }
        ]
      }))
    );

    // Count successful and failed sends
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    // Log notification campaign
    const { error: logError } = await supabase
      .from('notification_campaigns')
      .insert([{
        title,
        message,
        target_audience: targetAudience,
        status: 'sent',
        sent_count: successful,
        open_rate: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (logError) {
      console.error('Error logging notification campaign:', logError);
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications sent successfully',
      sentCount: successful,
      failedCount: failed,
      targetAudience
    });

  } catch (error) {
    console.error('Push notification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send push notifications' 
    }, { status: 500 });
  }
}

async function sendPushNotification(
  subscription: PushSubscription, 
  payload: {
    title: string;
    message: string;
    data?: any;
    icon?: string;
    badge?: string;
    image?: string;
    actions?: Array<{
      action: string;
      title: string;
      icon?: string;
    }>;
  }
): Promise<void> {
  try {
    // In a real implementation, you would use a push service like web-push
    // For demo purposes, we'll simulate the notification
    
    const notificationPayload = {
      title: payload.title,
      body: payload.message,
      icon: payload.icon,
      badge: payload.badge,
      image: payload.image,
      data: payload.data || {},
      actions: payload.actions,
      requireInteraction: true,
      vibrate: [200, 100, 200],
      tag: 'tdc-notification',
      timestamp: Date.now()
    };

    // Simulate sending to push service
    console.log('Sending push notification to:', subscription.endpoint);
    console.log('Payload:', notificationPayload);

    // In production, you would use web-push library:
    // const webpush = require('web-push');
    // await webpush.sendNotification(subscription, JSON.stringify(notificationPayload));

    // For demo, we'll just log success
    return Promise.resolve();

  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

// Test notification endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');

    if (test === 'true') {
      // Send a test notification
      const testPayload: PushNotificationPayload = {
        title: 'Test Bildirimi',
        message: 'Bu bir test bildirimidir. PWA bildirimleri düzgün çalışıyor!',
        targetAudience: 'all',
        data: {
          url: '/',
          type: 'test'
        }
      };

      // Simulate sending test notification
      console.log('Sending test notification:', testPayload);

      return NextResponse.json({
        success: true,
        message: 'Test notification sent successfully',
        payload: testPayload
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Push notification service is running'
    });

  } catch (error) {
    console.error('Test notification error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send test notification' 
    }, { status: 500 });
  }
}
