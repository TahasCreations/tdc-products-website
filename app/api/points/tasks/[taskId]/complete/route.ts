import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Görevi tamamla ve puan kazan
export async function POST(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId } = params;

    // Görevi getir
    const task = await prisma.$queryRawUnsafe(`
      SELECT * FROM "Task" WHERE "id" = $1 AND "isActive" = true
    `, taskId);

    if (!task || (task as any[]).length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const taskData = (task as any[])[0];

    // Kullanıcının görev durumunu kontrol et
    const userTask = await prisma.$queryRawUnsafe(`
      SELECT * FROM "UserTask" 
      WHERE "userId" = $1 AND "taskId" = $2
    `, session.user.id, taskId);

    if (userTask && (userTask as any[]).length > 0) {
      const userTaskData = (userTask as any[])[0];
      if (userTaskData.status === 'COMPLETED' || userTaskData.status === 'CLAIMED') {
        if (!taskData.isRepeatable) {
          return NextResponse.json(
            { error: 'Task already completed' },
            { status: 400 }
          );
        }
      }
    }

    // UserTask oluştur veya güncelle
    const userTaskId = userTask && (userTask as any[]).length > 0
      ? (userTask as any[])[0].id
      : `usertask-${Date.now()}-${session.user.id}`;

    if (!userTask || (userTask as any[]).length === 0) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "UserTask" ("id", "userId", "taskId", "status", "progress", "completedAt")
        VALUES ($1, $2, $3, 'COMPLETED', $4, NOW())
      `, userTaskId, session.user.id, taskId, taskData.requirement);
    } else {
      await prisma.$executeRawUnsafe(`
        UPDATE "UserTask"
        SET "status" = 'COMPLETED', "progress" = $1, "completedAt" = NOW(), "updatedAt" = NOW()
        WHERE "id" = $2
      `, taskData.requirement, userTaskId);
    }

    // Puanları ekle
    await addPoints(session.user.id, taskData.points, 'EARN', `Görev tamamlandı: ${taskData.title}`, taskId, 'task');

    // Güncellenen bilgileri getir
    const updatedPoints = await prisma.$queryRawUnsafe(`
      SELECT * FROM "UserPoints" WHERE "userId" = $1
    `, session.user.id);

    return NextResponse.json({
      success: true,
      message: `+${taskData.points} puan kazandınız!`,
      points: (updatedPoints as any[])[0],
      task: taskData,
    });
  } catch (error) {
    console.error('Complete task error:', error);
    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    );
  }
}

// Puan ekleme yardımcı fonksiyonu
async function addPoints(
  userId: string,
  points: number,
  type: string,
  description: string,
  reference?: string,
  referenceType?: string
) {
  // Mevcut puanları getir
  const userPoints = await prisma.$queryRawUnsafe(`
    SELECT * FROM "UserPoints" WHERE "userId" = $1
  `, userId);

  const currentPoints = userPoints && (userPoints as any[]).length > 0
    ? (userPoints as any[])[0]
    : { availablePoints: 0, totalPoints: 0, lifetimePoints: 0 };

  const newAvailable = currentPoints.availablePoints + points;
  const newTotal = currentPoints.totalPoints + points;
  const newLifetime = currentPoints.lifetimePoints + points;

  // Puanları güncelle
  if (userPoints && (userPoints as any[]).length > 0) {
    await prisma.$executeRawUnsafe(`
      UPDATE "UserPoints"
      SET "availablePoints" = $1, "totalPoints" = $2, "lifetimePoints" = $3, "updatedAt" = NOW()
      WHERE "userId" = $4
    `, newAvailable, newTotal, newLifetime, userId);
  } else {
    await prisma.$executeRawUnsafe(`
      INSERT INTO "UserPoints" ("id", "userId", "availablePoints", "totalPoints", "lifetimePoints")
      VALUES ($1, $2, $3, $4, $5)
    `, `points-${userId}`, userId, newAvailable, newTotal, newLifetime);
  }

  // İşlem kaydı oluştur
  await prisma.$executeRawUnsafe(`
    INSERT INTO "PointsTransaction" ("id", "userId", "type", "points", "balance", "description", "reference", "referenceType")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, `trans-${Date.now()}-${userId}`, userId, type, points, newAvailable, description, reference || null, referenceType || null);
}

