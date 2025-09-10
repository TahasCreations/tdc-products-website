import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock integrations data
    const integrations = [
      {
        id: '1',
        name: 'Aras Kargo',
        type: 'cargo',
        provider: 'Aras Kargo',
        status: 'active',
        apiKey: '***',
        apiSecret: '***',
        webhookUrl: 'https://api.company.com/webhooks/aras',
        configuration: { baseUrl: 'https://api.araskargo.com', timeout: 30000 },
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        syncFrequency: 'Her saat',
        errorCount: 0,
        successRate: 98,
        description: 'Kargo takip ve gönderim entegrasyonu'
      },
      {
        id: '2',
        name: 'İş Bankası',
        type: 'bank',
        provider: 'İş Bankası',
        status: 'active',
        apiKey: '***',
        apiSecret: '***',
        webhookUrl: 'https://api.company.com/webhooks/isbank',
        configuration: { baseUrl: 'https://api.isbank.com.tr', timeout: 30000 },
        lastSync: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        syncFrequency: 'Her 30 dakika',
        errorCount: 1,
        successRate: 95,
        description: 'Banka hesap ve ödeme entegrasyonu'
      },
      {
        id: '3',
        name: 'E-Fatura',
        type: 'e-invoice',
        provider: 'GİB',
        status: 'active',
        apiKey: '***',
        apiSecret: '***',
        webhookUrl: 'https://api.company.com/webhooks/efatura',
        configuration: { baseUrl: 'https://earsivportal.efatura.gov.tr', timeout: 60000 },
        lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        syncFrequency: 'Günlük',
        errorCount: 0,
        successRate: 100,
        description: 'E-fatura gönderim ve alım entegrasyonu'
      },
      {
        id: '4',
        name: 'Instagram',
        type: 'social',
        provider: 'Meta',
        status: 'active',
        apiKey: '***',
        apiSecret: '***',
        webhookUrl: 'https://api.company.com/webhooks/instagram',
        configuration: { baseUrl: 'https://graph.instagram.com', timeout: 30000 },
        lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        syncFrequency: 'Her 15 dakika',
        errorCount: 2,
        successRate: 92,
        description: 'Instagram içerik ve etkileşim entegrasyonu'
      },
      {
        id: '5',
        name: 'SendGrid',
        type: 'email',
        provider: 'SendGrid',
        status: 'active',
        apiKey: '***',
        apiSecret: '***',
        webhookUrl: 'https://api.company.com/webhooks/sendgrid',
        configuration: { baseUrl: 'https://api.sendgrid.com', timeout: 30000 },
        lastSync: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        syncFrequency: 'Anlık',
        errorCount: 0,
        successRate: 99,
        description: 'E-posta gönderim entegrasyonu'
      },
      {
        id: '6',
        name: 'Twilio',
        type: 'sms',
        provider: 'Twilio',
        status: 'active',
        apiKey: '***',
        apiSecret: '***',
        webhookUrl: 'https://api.company.com/webhooks/twilio',
        configuration: { baseUrl: 'https://api.twilio.com', timeout: 30000 },
        lastSync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        syncFrequency: 'Anlık',
        errorCount: 1,
        successRate: 97,
        description: 'SMS gönderim entegrasyonu'
      }
    ];

    return NextResponse.json(integrations);

  } catch (error) {
    console.error('Integrations error:', error);
    return NextResponse.json(
      { error: 'Entegrasyonlar alınamadı' },
      { status: 500 }
    );
  }
}
