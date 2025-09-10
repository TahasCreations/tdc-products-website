import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock campaigns data
    const campaigns = [
      {
        id: '1',
        name: 'VIP Müşteri Kampanyası',
        type: 'email',
        status: 'running',
        targetSegment: 'VIP',
        subject: 'Özel VIP İndirimleri Sizi Bekliyor!',
        content: 'Sevgili VIP müşterimiz, size özel %20 indirim fırsatı...',
        scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        sentCount: 15,
        openRate: 85.2,
        clickRate: 45.8,
        conversionRate: 12.5,
        revenue: 6750
      },
      {
        id: '2',
        name: 'Yeni Müşteri Hoş Geldin',
        type: 'email',
        status: 'completed',
        targetSegment: 'New',
        subject: 'Hoş Geldiniz! İlk Alışverişinizde %15 İndirim',
        content: 'Hoş geldiniz! İlk alışverişinizde %15 indirim kazanın...',
        scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        sentCount: 85,
        openRate: 72.3,
        clickRate: 38.9,
        conversionRate: 18.7,
        revenue: 4250
      },
      {
        id: '3',
        name: 'Risk Altındaki Müşteriler',
        type: 'sms',
        status: 'running',
        targetSegment: 'At Risk',
        subject: 'Sizi Özledik! Geri Dönün, Özel Hediye Kazanın',
        content: 'Uzun zamandır görüşmüyoruz. Size özel hediye kazanma fırsatı...',
        scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        sentCount: 35,
        openRate: 95.8,
        clickRate: 52.1,
        conversionRate: 8.9,
        revenue: 2100
      },
      {
        id: '4',
        name: 'Sosyal Medya Kampanyası',
        type: 'social',
        status: 'paused',
        targetSegment: 'Standard',
        subject: 'Instagram\'da Bizi Takip Edin',
        content: 'Instagram hesabımızı takip edin ve özel içeriklerden haberdar olun...',
        scheduledDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        sentCount: 120,
        openRate: 45.2,
        clickRate: 28.7,
        conversionRate: 6.3,
        revenue: 1800
      },
      {
        id: '5',
        name: 'Push Bildirim Kampanyası',
        type: 'push',
        status: 'draft',
        targetSegment: 'Premium',
        subject: 'Yeni Ürünler Geldi!',
        content: 'En yeni ürünlerimizi keşfedin ve erken erişim kazanın...',
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        sentCount: 0,
        openRate: 0,
        clickRate: 0,
        conversionRate: 0,
        revenue: 0
      }
    ];

    return NextResponse.json(campaigns);

  } catch (error) {
    console.error('CRM campaigns error:', error);
    return NextResponse.json(
      { error: 'Kampanya verileri alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const campaignData = await request.json();
    
    // Mock campaign creation
    const newCampaign = {
      id: Date.now().toString(),
      ...campaignData,
      sentCount: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      revenue: 0
    };

    return NextResponse.json(newCampaign);

  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { error: 'Kampanya oluşturulamadı' },
      { status: 500 }
    );
  }
}
