import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity') || 'all';
    const type = searchParams.get('type') || 'all';

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client could not be created' }, { status: 500 });
    }

    // Mock security events data
    const allEvents = [
      {
        id: '1',
        type: 'failed_login',
        severity: 'high',
        title: 'Başarısız Giriş Denemesi',
        description: '5 dakika içinde 5 başarısız giriş denemesi tespit edildi',
        user: {
          id: 'user1',
          email: 'test@example.com',
          name: 'Test User'
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: {
          country: 'Turkey',
          city: 'Istanbul'
        },
        isResolved: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'suspicious_activity',
        severity: 'critical',
        title: 'Şüpheli Aktivite Tespit Edildi',
        description: 'Normal dışı veri erişim kalıbı tespit edildi',
        user: {
          id: 'user2',
          email: 'admin@example.com',
          name: 'Admin User'
        },
        ipAddress: '203.0.113.1',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        location: {
          country: 'United States',
          city: 'New York'
        },
        isResolved: false,
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'privilege_escalation',
        severity: 'critical',
        title: 'Yetki Yükseltme Girişimi',
        description: 'Kullanıcı yetkisiz olarak yönetici yetkilerine erişmeye çalıştı',
        user: {
          id: 'user3',
          email: 'user@example.com',
          name: 'Regular User'
        },
        ipAddress: '198.51.100.1',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        location: {
          country: 'Germany',
          city: 'Berlin'
        },
        isResolved: true,
        resolvedBy: 'admin@example.com',
        resolvedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        type: 'data_breach_attempt',
        severity: 'high',
        title: 'Veri İhlali Girişimi',
        description: 'Hassas verilere yetkisiz erişim girişimi tespit edildi',
        user: {
          id: 'user4',
          email: 'hacker@example.com',
          name: 'Suspicious User'
        },
        ipAddress: '203.0.113.42',
        userAgent: 'curl/7.68.0',
        location: {
          country: 'Russia',
          city: 'Moscow'
        },
        isResolved: false,
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        type: 'unusual_location',
        severity: 'medium',
        title: 'Olağandışı Konum',
        description: 'Kullanıcı normal konumundan farklı bir yerden giriş yaptı',
        user: {
          id: 'user5',
          email: 'traveler@example.com',
          name: 'Traveling User'
        },
        ipAddress: '198.51.100.42',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
        location: {
          country: 'Japan',
          city: 'Tokyo'
        },
        isResolved: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        type: 'brute_force',
        severity: 'high',
        title: 'Brute Force Saldırısı',
        description: 'Sistematik şifre kırma girişimi tespit edildi',
        user: null,
        ipAddress: '203.0.113.100',
        userAgent: 'python-requests/2.25.1',
        location: {
          country: 'China',
          city: 'Beijing'
        },
        isResolved: true,
        resolvedBy: 'system',
        resolvedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '7',
        type: 'malware_detection',
        severity: 'critical',
        title: 'Kötü Amaçlı Yazılım Tespiti',
        description: 'Sistemde kötü amaçlı yazılım aktivitesi tespit edildi',
        user: {
          id: 'user7',
          email: 'infected@example.com',
          name: 'Infected User'
        },
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
        location: {
          country: 'Turkey',
          city: 'Ankara'
        },
        isResolved: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '8',
        type: 'session_hijacking',
        severity: 'high',
        title: 'Oturum Çalma Girişimi',
        description: 'Kullanıcı oturumu çalınmaya çalışıldı',
        user: {
          id: 'user8',
          email: 'victim@example.com',
          name: 'Victim User'
        },
        ipAddress: '198.51.100.200',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        location: {
          country: 'Brazil',
          city: 'São Paulo'
        },
        isResolved: false,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Filter events based on parameters
    let filteredEvents = allEvents;

    if (severity !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.severity === severity);
    }

    if (type !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.type === type);
    }

    // Sort by creation date (newest first)
    filteredEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(filteredEvents);
  } catch (error) {
    console.error('Security events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
