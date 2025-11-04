import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Günlük giriş puanı
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Kullanıcı puanlarını getir
    const userPoints = await prisma.$queryRawUnsafe(`
      SELECT * FROM "UserPoints" WHERE "userId" = $1
    `, session.user.id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let earnedPoints = false;
    let streakDays = 0;
    let dailyPoints = 10;

    if (!userPoints || (userPoints as any[]).length === 0) {
      // İlk giriş - puan kaydı oluştur
      streakDays = 1;
      await prisma.$executeRawUnsafe(`
        INSERT INTO "UserPoints" ("id", "userId", "totalPoints", "availablePoints", "lifetimePoints", "streakDays", "lastLoginDate")
        VALUES ($1, $2, $3, $4, $5, 1, NOW())
      `, `points-${session.user.id}`, session.user.id, dailyPoints, dailyPoints, dailyPoints);

      await addPointsTransaction(session.user.id, dailyPoints, 'Günlük giriş puanı', 'daily_login');
      earnedPoints = true;
    } else {
      const userPointsData = (userPoints as any[])[0];
      const lastLogin = userPointsData.lastLoginDate ? new Date(userPointsData.lastLoginDate) : null;

      if (!lastLogin || lastLogin < today) {
        // Bugün ilk giriş
        let newStreak = 1;

        if (lastLogin) {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);

          if (lastLogin >= yesterday) {
            // Ardışık gün
            newStreak = (userPointsData.streakDays || 0) + 1;
          }
        }

        streakDays = newStreak;

        // Streak bonusu
        if (newStreak >= 7) {
          dailyPoints += 20; // 7+ gün için bonus
        } else if (newStreak >= 3) {
          dailyPoints += 5; // 3+ gün için bonus
        }

        // Puanları güncelle
        const newAvailable = userPointsData.availablePoints + dailyPoints;
        const newTotal = userPointsData.totalPoints + dailyPoints;
        const newLifetime = userPointsData.lifetimePoints + dailyPoints;

        await prisma.$executeRawUnsafe(`
          UPDATE "UserPoints"
          SET "availablePoints" = $1, "totalPoints" = $2, "lifetimePoints" = $3, 
              "streakDays" = $4, "lastLoginDate" = NOW(), "updatedAt" = NOW()
          WHERE "userId" = $5
        `, newAvailable, newTotal, newLifetime, newStreak, session.user.id);

        await addPointsTransaction(session.user.id, dailyPoints, 
          `Günlük giriş puanı${newStreak > 1 ? ` (${newStreak} gün streak!)` : ''}`, 'daily_login');

        earnedPoints = true;
      } else {
        streakDays = userPointsData.streakDays || 0;
      }
    }

    return NextResponse.json({
      success: true,
      earnedPoints,
      points: dailyPoints,
      streakDays,
      message: earnedPoints ? `+${dailyPoints} puan kazandınız! 🎉` : 'Bugün zaten giriş yaptınız',
    });
  } catch (error) {
    console.error('Daily login error:', error);
    return NextResponse.json(
      { error: 'Failed to process daily login' },
      { status: 500 }
    );
  }
}

async function addPointsTransaction(userId: string, points: number, description: string, referenceType: string) {
  await prisma.$executeRawUnsafe(`
    INSERT INTO "PointsTransaction" ("id", "userId", "type", "points", "balance", "description", "referenceType")
    SELECT $1, $2, 'EARN', $3, "availablePoints", $4, $5
    FROM "UserPoints"
    WHERE "userId" = $2
  `, `trans-${Date.now()}-${userId}`, userId, points, description, referenceType);
}

