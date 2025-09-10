import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock integration logs data
    const logs = [
      {
        id: '1',
        integrationId: '1',
        integrationName: 'Aras Kargo',
        action: 'kargo_gonder',
        status: 'success',
        message: 'Kargo başarıyla gönderildi',
        data: { trackingNumber: 'AR123456789', orderId: '12345' },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        duration: 1250
      },
      {
        id: '2',
        integrationId: '2',
        integrationName: 'İş Bankası',
        action: 'odeme_kontrol',
        status: 'success',
        message: 'Ödeme başarıyla kontrol edildi',
        data: { transactionId: 'TXN123456', amount: 1500 },
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        duration: 890
      },
      {
        id: '3',
        integrationId: '3',
        integrationName: 'E-Fatura',
        action: 'fatura_gonder',
        status: 'success',
        message: 'E-fatura başarıyla gönderildi',
        data: { invoiceId: 'INV123456', uuid: 'uuid-123-456' },
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        duration: 2100
      },
      {
        id: '4',
        integrationId: '4',
        integrationName: 'Instagram',
        action: 'icerik_senkronizasyon',
        status: 'warning',
        message: 'Bazı içerikler senkronize edilemedi',
        data: { syncedCount: 8, failedCount: 2 },
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        duration: 4500
      },
      {
        id: '5',
        integrationId: '5',
        integrationName: 'SendGrid',
        action: 'email_gonder',
        status: 'success',
        message: 'E-posta başarıyla gönderildi',
        data: { emailId: 'email-123', recipient: 'user@example.com' },
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        duration: 320
      },
      {
        id: '6',
        integrationId: '6',
        integrationName: 'Twilio',
        action: 'sms_gonder',
        status: 'error',
        message: 'SMS gönderimi başarısız',
        data: { phoneNumber: '+905551234567', error: 'Invalid phone number' },
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        duration: 1200
      }
    ];

    return NextResponse.json(logs);

  } catch (error) {
    console.error('Integration logs error:', error);
    return NextResponse.json(
      { error: 'Entegrasyon logları alınamadı' },
      { status: 500 }
    );
  }
}
