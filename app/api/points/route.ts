import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Kullanıcının puan bilgilerini getir
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kullanıcının puan bilgilerini getir veya oluştur
    let userPoints = await prisma.$queryRawUnsafe(`
      SELECT * FROM "UserPoints" WHERE "userId" = $1
    `, session.user.id);

    if (!userPoints || (userPoints as any[]).length === 0) {
      // İlk defa puan kontrolü - oluştur
      await prisma.$executeRawUnsafe(`
        INSERT INTO "UserPoints" ("id", "userId", "totalPoints", "availablePoints", "lifetimePoints", "level", "tier")
        VALUES ($1, $2, 0, 0, 0, 1, 'BRONZE')
      `, `points-${session.user.id}`, session.user.id);

      userPoints = [{
        id: `points-${session.user.id}`,
        userId: session.user.id,
        totalPoints: 0,
        availablePoints: 0,
        lifetimePoints: 0,
        level: 1,
        tier: 'BRONZE',
        streakDays: 0,
        lastLoginDate: null,
      }];
    }

    return NextResponse.json({
      success: true,
      points: (userPoints as any[])[0],
    });
  } catch (error) {
    console.error('Get points error:', error);
    return NextResponse.json(
      { error: 'Failed to get points' },
      { status: 500 }
    );
  }
}

