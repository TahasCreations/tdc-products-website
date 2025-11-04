import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Para çekme talebi oluştur
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { points, method, accountDetails } = await req.json();

    if (!points || points < 1) {
      return NextResponse.json(
        { error: 'Invalid points amount' },
        { status: 400 }
      );
    }

    // Ayarları getir
    const settings = await prisma.$queryRawUnsafe(`
      SELECT "key", "value" FROM "PointSettings"
    `);

    const settingsMap = (settings as any[]).reduce((acc, s) => {
      acc[s.key] = parseFloat(s.value);
      return acc;
    }, {} as Record<string, number>);

    const pointsToTlRate = settingsMap.POINTS_TO_TL_RATE || 100;
    const minWithdrawalPoints = settingsMap.MIN_WITHDRAWAL_POINTS || 1000;
    const maxWithdrawalAmount = settingsMap.MAX_WITHDRAWAL_AMOUNT || 1000;

    // Minimum kontrol
    if (points < minWithdrawalPoints) {
      return NextResponse.json(
        { error: `Minimum ${minWithdrawalPoints} puan gerekli` },
        { status: 400 }
      );
    }

    // Kullanıcı puanlarını kontrol et
    const userPoints = await prisma.$queryRawUnsafe(`
      SELECT * FROM "UserPoints" WHERE "userId" = $1
    `, session.user.id);

    if (!userPoints || (userPoints as any[]).length === 0) {
      return NextResponse.json(
        { error: 'User points not found' },
        { status: 404 }
      );
    }

    const { availablePoints } = (userPoints as any[])[0];

    if (availablePoints < points) {
      return NextResponse.json(
        { error: 'Yetersiz puan' },
        { status: 400 }
      );
    }

    // TL tutarını hesapla
    const amount = points / pointsToTlRate;

    // Maksimum tutarı kontrol et
    if (amount > maxWithdrawalAmount) {
      return NextResponse.json(
        { error: `Maksimum ${maxWithdrawalAmount} TL çekilebilir` },
        { status: 400 }
      );
    }

    // Çekim talebi oluştur
    const withdrawalId = `withdrawal-${Date.now()}-${session.user.id}`;
    await prisma.$executeRawUnsafe(`
      INSERT INTO "Withdrawal" ("id", "userId", "points", "amount", "rate", "status", "method", "accountDetails")
      VALUES ($1, $2, $3, $4, $5, 'PENDING', $6, $7)
    `, withdrawalId, session.user.id, points, amount, pointsToTlRate, method, JSON.stringify(accountDetails));

    // Puanları düş (REDEEM)
    const newAvailable = availablePoints - points;
    await prisma.$executeRawUnsafe(`
      UPDATE "UserPoints"
      SET "availablePoints" = $1, "updatedAt" = NOW()
      WHERE "userId" = $2
    `, newAvailable, session.user.id);

    // İşlem kaydı
    await prisma.$executeRawUnsafe(`
      INSERT INTO "PointsTransaction" ("id", "userId", "type", "points", "balance", "description", "reference", "referenceType")
      VALUES ($1, $2, 'REDEEM', $3, $4, $5, $6, 'withdrawal')
    `, `trans-${Date.now()}-${session.user.id}`, session.user.id, -points, newAvailable, `Para çekme talebi: ${amount.toFixed(2)} TL`, withdrawalId);

    return NextResponse.json({
      success: true,
      message: 'Çekim talebiniz alındı',
      withdrawal: {
        id: withdrawalId,
        points,
        amount,
        status: 'PENDING',
      },
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json(
      { error: 'Failed to create withdrawal' },
      { status: 500 }
    );
  }
}

// GET - Çekim geçmişini getir
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const withdrawals = await prisma.$queryRawUnsafe(`
      SELECT * FROM "Withdrawal"
      WHERE "userId" = $1
      ORDER BY "createdAt" DESC
      LIMIT 50
    `, session.user.id);

    return NextResponse.json({
      success: true,
      withdrawals,
    });
  } catch (error) {
    console.error('Get withdrawals error:', error);
    return NextResponse.json(
      { error: 'Failed to get withdrawals' },
      { status: 500 }
    );
  }
}

