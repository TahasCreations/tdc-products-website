import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Generate scratch card reward
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId } = body;

    // Check if scratch card already generated for this order
    // In production: Check database
    // const existing = await prisma.scratchCard.findUnique({
    //   where: { orderId }
    // });
    // if (existing) return existing.reward;

    // Generate random reward (weighted distribution)
    const rewards = [
      { amount: 5, weight: 35 },    // 35% - 5₺
      { amount: 10, weight: 30 },   // 30% - 10₺
      { amount: 15, weight: 15 },   // 15% - 15₺
      { amount: 20, weight: 10 },   // 10% - 20₺
      { amount: 25, weight: 5 },    // 5% - 25₺
      { amount: 50, weight: 4 },    // 4% - 50₺
      { amount: 100, weight: 1 }    // 1% - 100₺
    ];

    const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
    let random = Math.random() * totalWeight;

    let reward = 5; // Default
    for (const item of rewards) {
      random -= item.weight;
      if (random <= 0) {
        reward = item.amount;
        break;
      }
    }

    // In production: Save to database
    // await prisma.scratchCard.create({
    //   data: {
    //     orderId,
    //     userId: session.user.id,
    //     reward,
    //     couponCode: `SCRATCH${reward}`,
    //     isRevealed: false
    //   }
    // });

    console.log(`🎫 Scratch card generated: ${reward}₺ for order ${orderId}`);

    return NextResponse.json({
      success: true,
      reward,
      couponCode: `SCRATCH${reward}`
    });

  } catch (error) {
    console.error('Generate scratch card error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate scratch card' },
      { status: 500 }
    );
  }
}

