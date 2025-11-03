import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Get live activity stats for social proof
 */
export async function GET(req: NextRequest) {
  try {
    // Simulate live stats (in production, use real-time data)
    const stats = {
      activeBuyers: Math.floor(Math.random() * 50) + 30, // 30-80
      todayOrders: Math.floor(Math.random() * 200) + 100, // 100-300
      currentViewers: Math.floor(Math.random() * 100) + 50 // 50-150
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Social proof stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

