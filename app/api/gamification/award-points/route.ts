import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * Award points to user
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
    const { userId, points, reason } = body;

    if (!points || points <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid points amount' },
        { status: 400 }
      );
    }

    // In production: Save to database
    // await prisma.gamificationPoints.create({
    //   data: {
    //     userId,
    //     points,
    //     reason,
    //     createdAt: new Date()
    //   }
    // });

    console.log(`🎮 Points awarded: ${points} to user ${userId} - ${reason}`);

    return NextResponse.json({
      success: true,
      totalPoints: points,
      message: `${points} puan kazandınız!`
    });

  } catch (error) {
    console.error('Award points error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to award points' },
      { status: 500 }
    );
  }
}

