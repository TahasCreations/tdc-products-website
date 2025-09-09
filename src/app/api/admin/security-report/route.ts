import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();

    // Güvenlik raporu verilerini çek
    const [
      { data: adminUsers },
      { data: auditLogs },
      { data: failedLogins },
      { data: suspiciousActivities }
    ] = await Promise.all([
      // Toplam ve aktif kullanıcılar
      supabase!!
        .from('admin_users')
        .select('id, is_active, role, last_login'),
      
      // Son 24 saat girişler
      supabase!
        .from('audit_logs')
        .select('user_id, created_at')
        .eq('action', 'LOGIN')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      
      // Başarısız girişler
      supabase!
        .from('audit_logs')
        .select('id')
        .eq('action', 'LOGIN_FAILED')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Şüpheli aktiviteler
      supabase!
        .from('audit_logs')
        .select('id')
        .in('action', ['UNAUTHORIZED_ACCESS', 'SUSPICIOUS_ACTIVITY', 'MULTIPLE_FAILED_LOGINS'])
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    // Rol dağılımını hesapla
    const roleDistribution = adminUsers?.reduce((acc: Record<string, number>, user: any) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {}) || {};

    // Güvenlik raporu oluştur
    const securityReport = {
      total_users: adminUsers?.length || 0,
      active_users: adminUsers?.filter((user: any) => user.is_active).length || 0,
      failed_logins: failedLogins?.length || 0,
      suspicious_activities: suspiciousActivities?.length || 0,
      last_24h_logins: auditLogs?.length || 0,
      role_distribution: roleDistribution
    };

    return NextResponse.json(securityReport);

  } catch (error) {
    console.error('Security report GET error:', error);
    return NextResponse.json(
      { error: 'Güvenlik raporu oluşturulamadı' },
      { status: 500 }
    );
  }
}
