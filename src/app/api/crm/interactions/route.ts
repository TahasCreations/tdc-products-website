import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock interactions data
    const interactions = [
      {
        id: '1',
        customerId: '1',
        type: 'email',
        subject: 'Ürün Sorgusu',
        description: 'Müşteri Samsung Galaxy S24 hakkında bilgi istedi',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: 'Ahmet Yılmaz',
        outcome: 'positive',
        nextAction: 'Ürün detayları e-postası gönderildi',
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        customerId: '2',
        type: 'call',
        subject: 'Teknik Destek',
        description: 'Müşteri ürün kurulumu konusunda yardım istedi',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        user: 'Mehmet Kaya',
        outcome: 'positive',
        nextAction: 'Kurulum kılavuzu e-postası gönderildi',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        customerId: '3',
        type: 'meeting',
        subject: 'Satış Toplantısı',
        description: 'Yeni ürün kataloğu sunumu yapıldı',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Ayşe Demir',
        outcome: 'positive',
        nextAction: 'Teklif hazırlanacak',
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        customerId: '4',
        type: 'support',
        subject: 'Şikayet',
        description: 'Müşteri geç teslimat konusunda şikayet etti',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        user: 'Fatma Özkan',
        outcome: 'negative',
        nextAction: 'Özür mektubu ve indirim kuponu gönderilecek',
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        customerId: '1',
        type: 'purchase',
        subject: 'Satın Alma',
        description: 'Müşteri Samsung Galaxy S24 satın aldı',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        user: 'Sistem',
        outcome: 'positive',
        nextAction: 'Satış sonrası takip e-postası gönderilecek',
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        customerId: '2',
        type: 'website',
        subject: 'Web Sitesi Ziyareti',
        description: 'Müşteri ürün sayfalarını inceledi',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        user: 'Sistem',
        outcome: 'neutral',
        nextAction: 'Kişiselleştirilmiş öneriler gönderilecek',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    return NextResponse.json(interactions);

  } catch (error) {
    console.error('CRM interactions error:', error);
    return NextResponse.json(
      { error: 'Etkileşim verileri alınamadı' },
      { status: 500 }
    );
  }
}
