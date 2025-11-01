export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Get messages for a room
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    const since = searchParams.get('since'); // For polling updates

    if (!roomId) {
      return Response.json({ error: 'Room ID required' }, { status: 400 });
    }

    const where: any = {
      roomId,
      isDeleted: false,
    };

    // If since parameter exists, get only new messages
    if (since) {
      where.createdAt = {
        gt: new Date(since),
      };
    }

    const messages = await prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: since ? undefined : 50, // Load last 50 on initial load
    });

    return Response.json({ success: true, messages });
  } catch (error) {
    console.error('Get messages error:', error);
    return Response.json({ error: 'Failed to get messages' }, { status: 500 });
  }
}

// Send a new message
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roomId, content, senderType, senderId, messageType = 'text', attachments } = await req.json();

    if (!roomId || !content || !senderType || !senderId) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create message
    const message = await prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        senderType,
        content,
        messageType,
        attachments: attachments ? JSON.stringify(attachments) : null,
      },
    });

    // Update room's last message time
    await prisma.chatRoom.update({
      where: { id: roomId },
      data: { lastMessageAt: new Date() },
    });

    return Response.json({ success: true, message });
  } catch (error) {
    console.error('Send message error:', error);
    return Response.json({ error: 'Failed to send message' }, { status: 500 });
  }
}


