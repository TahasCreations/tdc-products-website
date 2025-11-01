export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== 'ADMIN') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { roomId, reason } = await req.json();

    await prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        isFlagged: true,
        flagReason: reason,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Flag room error:', error);
    return Response.json({ error: 'Failed to flag room' }, { status: 500 });
  }
}


