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

    // Mock security statistics
    const securityStats = {
      totalEvents: 1247,
      criticalEvents: 3,
      highEvents: 12,
      mediumEvents: 45,
      lowEvents: 1187,
      resolvedEvents: 1156,
      activeAlerts: 8,
      failedLogins: 234,
      suspiciousActivities: 15,
      mfaEnabledUsers: 89,
      totalUsers: 100,
      securityScore: 94,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(securityStats);
  } catch (error) {
    console.error('Security stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
