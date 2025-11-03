import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { gamificationEngine } from '@/lib/gamification/gamification-engine';

export const dynamic = 'force-dynamic';

/**
 * Get active challenges for user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Generate challenges (daily + weekly)
    const dailyChallenges = gamificationEngine.generateDailyChallenges();
    const weeklyChallenges = gamificationEngine.generateWeeklyChallenges();

    // In production: Fetch user's actual progress from database
    const challenges = [
      ...dailyChallenges.map(c => ({
        ...c,
        icon: c.id === 'daily_login' ? '🎯' : c.id === 'daily_browse' ? '🔍' : '❤️',
        expiresAt: c.expiresAt.toISOString()
      })),
      ...weeklyChallenges.map(c => ({
        ...c,
        icon: c.id === 'weekly_order' ? '🛒' : c.id === 'weekly_review' ? '✍️' : '🤝',
        expiresAt: c.expiresAt.toISOString()
      }))
    ];

    return NextResponse.json({
      success: true,
      challenges,
      streak: 1 // User's login streak
    });

  } catch (error) {
    console.error('Challenges error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch challenges' },
      { status: 500 }
    );
  }
}

