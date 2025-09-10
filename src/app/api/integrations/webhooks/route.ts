import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock webhook events data
    const webhooks = [
      {
        id: '1',
        integrationId: '1',
        event: 'kargo_durum_guncelleme',
        payload: {
          trackingNumber: 'AR123456789',
          status: 'teslim_edildi',
          location: 'İstanbul',
          timestamp: new Date().toISOString()
        },
        status: 'processed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        retryCount: 0
      },
      {
        id: '2',
        integrationId: '2',
        event: 'odeme_onaylandi',
        payload: {
          transactionId: 'TXN123456',
          amount: 1500,
          currency: 'TRY',
          status: 'completed'
        },
        status: 'processed',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        retryCount: 0
      },
      {
        id: '3',
        integrationId: '3',
        event: 'fatura_onaylandi',
        payload: {
          invoiceId: 'INV123456',
          uuid: 'uuid-123-456',
          status: 'approved',
          approvalDate: new Date().toISOString()
        },
        status: 'processed',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        retryCount: 0
      },
      {
        id: '4',
        integrationId: '4',
        event: 'instagram_begeni',
        payload: {
          postId: 'post-123',
          userId: 'user-456',
          action: 'like',
          timestamp: new Date().toISOString()
        },
        status: 'pending',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        retryCount: 0
      },
      {
        id: '5',
        integrationId: '5',
        event: 'email_acildi',
        payload: {
          emailId: 'email-123',
          recipient: 'user@example.com',
          openTime: new Date().toISOString(),
          userAgent: 'Mozilla/5.0...'
        },
        status: 'processed',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        retryCount: 0
      },
      {
        id: '6',
        integrationId: '6',
        event: 'sms_teslim_edildi',
        payload: {
          messageId: 'msg-123',
          phoneNumber: '+905551234567',
          status: 'delivered',
          deliveryTime: new Date().toISOString()
        },
        status: 'failed',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        retryCount: 2
      }
    ];

    return NextResponse.json(webhooks);

  } catch (error) {
    console.error('Webhook events error:', error);
    return NextResponse.json(
      { error: 'Webhook olayları alınamadı' },
      { status: 500 }
    );
  }
}
