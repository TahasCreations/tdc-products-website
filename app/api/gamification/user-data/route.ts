import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { gamificationEngine } from '@/lib/gamification/gamification-engine';

export const dynamic = 'force-dynamic';

/**
 * Get user gamification data
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

    // In production: Fetch actual user data from database
    const userData = {
      orderCount: 0,
      reviewCount: 0,
      referralCount: 0,
      wishlistCount: 0,
      loginStreak: 1,
      totalSpent: 0
    };

    // Check achievements
    const achievements = gamificationEngine.checkAchievements(userData);

    // Generate challenges
    const dailyChallenges = gamificationEngine.generateDailyChallenges();
    const weeklyChallenges = gamificationEngine.generateWeeklyChallenges();

    const response = {
      totalPoints: 0, // Calculate from achievements + challenges
      currentLevel: 1,
      nextLevelPoints: 100,
      achievements,
      completedChallenges: 0,
      activeChallenges: [...dailyChallenges, ...weeklyChallenges],
      loginStreak: userData.loginStreak,
      lastLoginDate: new Date()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Gamification data error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

