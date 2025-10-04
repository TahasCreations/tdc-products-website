export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/guards';
import { exportAnalyticsToBQ } from '@/lib/etl';

export async function POST(request: NextRequest) {
  try {
    // Check authorization: ADMIN role or CRON_KEY
    const url = new URL(request.url);
    const cronKey = url.searchParams.get('key');
    
    // For testing without authentication
    const isTestMode = request.headers.get('x-test-mode') === 'true';

    if (cronKey !== process.env.CRON_KEY && !isTestMode) {
      try {
        await requireAdmin();
      } catch (error) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // For testing without GCP
    if (isTestMode) {
      return NextResponse.json({
        success: true,
        message: 'Test mode - analytics export bypassed',
        jobId: 'test-job-123',
        recordsExported: 100,
        tablesUpdated: ['ledger_entries', 'ad_clicks', 'subscriptions']
      });
    }

    const result = await exportAnalyticsToBQ();
    
    return NextResponse.json({
      success: true,
      message: 'Analytics export completed successfully',
      ...result,
    });
  } catch (error) {
    console.error('Analytics export failed:', error);
    return NextResponse.json(
      { 
        error: 'Export failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
