import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Güvenlik istatistiklerini hesapla
    const stats = {
      totalThreats: 0,
      criticalThreats: 0,
      mediumThreats: 0,
      lowThreats: 0,
      blockedAttempts: 0,
      securityScore: 0,
      lastScanDate: '',
      vulnerabilities: {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0
      },
      compliance: {
        gdpr: 85,
        iso27001: 92,
        pci: 78,
        sox: 88
      },
      activeUsers: 0,
      failedLogins: 0,
      suspiciousActivities: 0
    };

    if (supabase) {
      // Gerçek verilerden hesapla
      const [threatsResult, usersResult, logsResult] = await Promise.all([
        supabase.from('security_threats').select('id, severity, status, created_at'),
        supabase.from('admin_users').select('id, last_login, is_active'),
        supabase.from('security_logs').select('id, event_type, severity, created_at')
      ]);

      const threats = threatsResult.data || [];
      const users = usersResult.data || [];
      const logs = logsResult.data || [];

      // Tehdit istatistikleri
      stats.totalThreats = threats.length;
      stats.criticalThreats = threats.filter(t => t.severity === 'critical').length;
      stats.mediumThreats = threats.filter(t => t.severity === 'medium').length;
      stats.lowThreats = threats.filter(t => t.severity === 'low').length;
      stats.blockedAttempts = threats.filter(t => t.status === 'blocked').length;

      // Güvenlik skoru hesaplama
      const totalThreats = threats.length;
      const blockedThreats = threats.filter(t => t.status === 'blocked').length;
      stats.securityScore = totalThreats > 0 ? Math.round((blockedThreats / totalThreats) * 100) : 100;

      // Son tarama tarihi
      if (threats.length > 0) {
        const lastThreat = threats.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        stats.lastScanDate = lastThreat.created_at;
      }

      // Güvenlik açıkları
      const vulnerabilities = threats.filter(t => t.severity === 'critical' || t.severity === 'high' || t.severity === 'medium' || t.severity === 'low');
      stats.vulnerabilities.critical = vulnerabilities.filter(v => v.severity === 'critical').length;
      stats.vulnerabilities.high = vulnerabilities.filter(v => v.severity === 'high').length;
      stats.vulnerabilities.medium = vulnerabilities.filter(v => v.severity === 'medium').length;
      stats.vulnerabilities.low = vulnerabilities.filter(v => v.severity === 'low').length;

      // Aktif kullanıcılar
      stats.activeUsers = users.filter(u => u.is_active).length;

      // Başarısız girişler
      stats.failedLogins = logs.filter(l => l.event_type === 'failed_login').length;

      // Şüpheli aktiviteler
      stats.suspiciousActivities = logs.filter(l => l.severity === 'high' || l.severity === 'critical').length;

    } else {
      // Fallback: Mock data
      stats.totalThreats = 23;
      stats.criticalThreats = 2;
      stats.mediumThreats = 8;
      stats.lowThreats = 13;
      stats.blockedAttempts = 21;
      stats.securityScore = 91;
      stats.lastScanDate = '2024-01-20T10:30:00Z';
      stats.vulnerabilities = {
        critical: 2,
        high: 5,
        medium: 8,
        low: 13
      };
      stats.compliance = {
        gdpr: 85,
        iso27001: 92,
        pci: 78,
        sox: 88
      };
      stats.activeUsers = 12;
      stats.failedLogins = 45;
      stats.suspiciousActivities = 7;
    }

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Security stats error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch security statistics',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
