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
    
    if (cronKey !== process.env.CRON_KEY) {
      try {
        await requireAdmin();
      } catch (error) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
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
