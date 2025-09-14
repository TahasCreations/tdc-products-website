import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client could not be created' }, { status: 500 });
    }

    // Mock security alerts data
    const securityAlerts = [
      {
        id: '1',
        type: 'brute_force',
        severity: 'critical',
        title: 'Brute Force Saldırısı Tespit Edildi',
        description: 'IP adresi 203.0.113.100\'den sistematik şifre kırma girişimi tespit edildi. 5 dakika içinde 50 başarısız giriş denemesi yapıldı.',
        isAcknowledged: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'unusual_location',
        severity: 'high',
        title: 'Olağandışı Konumdan Giriş',
        description: 'Kullanıcı admin@example.com normal konumundan (Turkey) farklı bir konumdan (Russia) giriş yaptı.',
        isAcknowledged: true,
        isResolved: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'privilege_escalation',
        severity: 'critical',
        title: 'Yetki Yükseltme Girişimi',
        description: 'Kullanıcı user@example.com yetkisiz olarak yönetici yetkilerine erişmeye çalıştı.',
        isAcknowledged: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        type: 'data_anomaly',
        severity: 'medium',
        title: 'Veri Erişim Anomalisi',
        description: 'Kullanıcı test@example.com normalden 10 kat fazla veri indirdi.',
        isAcknowledged: true,
        isResolved: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        type: 'malware_detection',
        severity: 'critical',
        title: 'Kötü Amaçlı Yazılım Tespiti',
        description: 'Sistemde kötü amaçlı yazılım aktivitesi tespit edildi. Hemen müdahale gerekli.',
        isAcknowledged: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        type: 'session_hijacking',
        severity: 'high',
        title: 'Oturum Çalma Girişimi',
        description: 'Kullanıcı victim@example.com\'un oturumu çalınmaya çalışıldı.',
        isAcknowledged: true,
        isResolved: false,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '7',
        type: 'api_abuse',
        severity: 'medium',
        title: 'API Kötüye Kullanımı',
        description: 'API endpoint\'i aşırı kullanım tespit edildi. Rate limiting uygulanmalı.',
        isAcknowledged: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '8',
        type: 'suspicious_activity',
        severity: 'high',
        title: 'Şüpheli Aktivite',
        description: 'Kullanıcı suspicious@example.com normal dışı veri erişim kalıbı sergiliyor.',
        isAcknowledged: false,
        isResolved: false,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Filter only active alerts (not resolved)
    const activeAlerts = securityAlerts.filter(alert => !alert.isResolved);

    return NextResponse.json(activeAlerts);
  } catch (error) {
    console.error('Security alerts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}