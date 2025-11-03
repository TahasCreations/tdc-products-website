import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Get user referral statistics
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate referral code if doesn't exist
    let referralCode = user.id.substring(0, 8).toUpperCase();

    // Get referral stats
    // In production: Query actual referrals from database
    const stats = {
      referralCode,
      totalReferrals: 0,
      pendingRewards: 0,
      earnedRewards: 0,
      conversionRate: 0
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Referral stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

