import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Mock audit logs data
    const auditLogs = [
      {
        id: '1',
        userId: '1',
        userName: 'Ahmet Yılmaz',
        action: 'login',
        resource: 'system',
        details: 'Başarılı giriş yapıldı',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'success',
        riskLevel: 'low'
      },
      {
        id: '2',
        userId: '2',
        userName: 'Mehmet Kaya',
        action: 'data_export',
        resource: 'customers',
        details: 'Müşteri verileri dışa aktarıldı',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'success',
        riskLevel: 'medium'
      },
      {
        id: '3',
        userId: '3',
        userName: 'Ayşe Demir',
        action: 'permission_change',
        resource: 'user_permissions',
        details: 'Kullanıcı izinleri değiştirildi',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'success',
        riskLevel: 'high'
      },
      {
        id: '4',
        userId: '4',
        userName: 'Fatma Özkan',
        action: 'failed_login',
        resource: 'system',
        details: 'Başarısız giriş denemesi',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'failed',
        riskLevel: 'medium'
      },
      {
        id: '5',
        userId: '1',
        userName: 'Ahmet Yılmaz',
        action: 'data_delete',
        resource: 'orders',
        details: 'Sipariş verisi silindi',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
        status: 'success',
        riskLevel: 'high'
      },
      {
        id: '6',
        userId: '2',
        userName: 'Mehmet Kaya',
        action: 'api_access',
        resource: 'api_endpoint',
        details: 'API endpoint\'e erişim sağlandı',
        ipAddress: '192.168.1.101',
        userAgent: 'PostmanRuntime/7.28.0',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'success',
        riskLevel: 'low'
      },
      {
        id: '7',
        userId: '5',
        userName: 'Ali Veli',
        action: 'unauthorized_access',
        resource: 'admin_panel',
        details: 'Yetkisiz admin panel erişim denemesi',
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
        status: 'blocked',
        riskLevel: 'critical'
      },
      {
        id: '8',
        userId: '3',
        userName: 'Ayşe Demir',
        action: 'password_change',
        resource: 'user_account',
        details: 'Şifre değiştirildi',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        status: 'success',
        riskLevel: 'medium'
      }
    ];

    return NextResponse.json(auditLogs);

  } catch (error) {
    console.error('Audit logs error:', error);
    return NextResponse.json(
      { error: 'Audit log verileri alınamadı' },
      { status: 500 }
    );
  }
}
