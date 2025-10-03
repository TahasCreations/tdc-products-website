export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check CRON_KEY
    const url = new URL(request.url);
    const cronKey = url.searchParams.get('key');
    
    if (cronKey !== process.env.CRON_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Reset spentToday for all ACTIVE campaigns
    const result = await prisma.adCampaign.updateMany({
      where: {
        status: 'ACTIVE',
      },
      data: {
        spentToday: 0,
      },
    });

    return NextResponse.json({
      ok: true,
      reset: result.count,
      message: `Reset spentToday for ${result.count} active campaigns`,
    });
  } catch (error) {
    console.error('Ads reset spend failed:', error);
    return NextResponse.json(
      { 
        error: 'Reset failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}