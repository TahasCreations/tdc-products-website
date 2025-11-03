import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Get product-specific social proof stats
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    // Simulate product-specific stats (in production, use real data)
    const stats = {
      currentViewers: Math.floor(Math.random() * 15) + 5, // 5-20
      cartAdds: Math.floor(Math.random() * 30) + 10, // 10-40
      recentPurchases: Math.floor(Math.random() * 10) + 2, // 2-12
      trending: Math.random() > 0.7 // 30% chance
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Product social proof error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

