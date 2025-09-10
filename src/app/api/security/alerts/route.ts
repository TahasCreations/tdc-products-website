import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock security alerts data
    const alerts = [
      {
        id: '1',
        type: 'login_anomaly',
        severity: 'high',
        title: 'Anormal Giriş Aktivitesi',
        description: 'Kullanıcı 5 farklı IP adresinden 10 dakika içinde giriş yapmaya çalıştı',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'new',
        affectedUsers: ['4'],
        recommendedAction: 'Kullanıcı hesabını geçici olarak kilitleyin ve şifre sıfırlama talep edin'
      },
      {
        id: '2',
        type: 'permission_violation',
        severity: 'critical',
        title: 'Yetkisiz Erişim Denemesi',
        description: 'Düşük seviye kullanıcı admin panel\'e erişim sağlamaya çalıştı',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'investigating',
        affectedUsers: ['5'],
        recommendedAction: 'Kullanıcı hesabını askıya alın ve güvenlik ekibini bilgilendirin'
      },
      {
        id: '3',
        type: 'data_breach',
        severity: 'critical',
        title: 'Şüpheli Veri Erişimi',
        description: 'Büyük miktarda müşteri verisi kısa sürede dışa aktarıldı',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'investigating',
        affectedUsers: ['2'],
        recommendedAction: 'Veri erişimini durdurun ve acil güvenlik incelemesi başlatın'
      },
      {
        id: '4',
        type: 'suspicious_activity',
        severity: 'medium',
        title: 'Şüpheli API Kullanımı',
        description: 'Normalden fazla API çağrısı yapıldı',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'resolved',
        affectedUsers: ['2'],
        recommendedAction: 'API rate limiting uygulayın ve kullanıcıyı uyarın'
      },
      {
        id: '5',
        type: 'login_anomaly',
        severity: 'low',
        title: 'Geç Saatlerde Giriş',
        description: 'Kullanıcı gece 02:00\'da sisteme giriş yaptı',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'false_positive',
        affectedUsers: ['1'],
        recommendedAction: 'Normal aktivite olarak işaretlendi'
      },
      {
        id: '6',
        type: 'permission_violation',
        severity: 'high',
        title: 'Yetkisiz Dosya Erişimi',
        description: 'Kullanıcı yetkisi olmayan dosyalara erişim sağlamaya çalıştı',
        timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        status: 'resolved',
        affectedUsers: ['3'],
        recommendedAction: 'Kullanıcı izinlerini gözden geçirin ve gerekirse kısıtlayın'
      }
    ];

    return NextResponse.json(alerts);

  } catch (error) {
    console.error('Security alerts error:', error);
    return NextResponse.json(
      { error: 'Güvenlik uyarıları alınamadı' },
      { status: 500 }
    );
  }
}
