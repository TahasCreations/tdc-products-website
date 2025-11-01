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

    const { roomId } = await req.json();

    await prisma.chatRoom.update({
      where: { id: roomId },
      data: {
        status: 'closed',
      },
    });

    // Create system message
    await prisma.chatMessage.create({
      data: {
        roomId,
        senderId: user.id,
        senderType: 'ADMIN',
        content: 'Bu sohbet admin tarafından kapatıldı.',
        messageType: 'system',
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Close chat error:', error);
    return Response.json({ error: 'Failed to close chat' }, { status: 500 });
  }
}


