import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Get micro-influencer statistics
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In production: Fetch from database
    const stats = {
      totalClicks: 0,
      totalSales: 0,
      totalEarnings: 0,
      conversionRate: 0,
      activeLinks: 0,
      followers: 1000, // Get from social media API
      tier: 'bronze' as const,
      commissionRate: 5
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Micro-influencer stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

