import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Kullanıcının görevlerini getir
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Aktif görevleri getir
    const tasks = await prisma.$queryRawUnsafe(`
      SELECT 
        t.*,
        ut."id" as "userTaskId",
        ut."status",
        ut."progress",
        ut."completedAt",
        ut."claimedAt"
      FROM "Task" t
      LEFT JOIN "UserTask" ut ON t."id" = ut."taskId" AND ut."userId" = $1
      WHERE t."isActive" = true
      AND (t."endDate" IS NULL OR t."endDate" > NOW())
      ORDER BY t."order", t."points" DESC
    `, session.user.id);

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to get tasks' },
      { status: 500 }
    );
  }
}

