export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// Edit a message (15 minute rule)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await req.json();
    const messageId = params.id;

    // Get message
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return Response.json({ error: 'Message not found' }, { status: 404 });
    }

    // Check ownership
    if (message.senderId !== (session.user as any).id) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check 15 minute rule
    const now = new Date();
    const createdAt = new Date(message.createdAt);
    const diffMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;

    if (diffMinutes > 15) {
      return Response.json({ error: 'Edit time expired (15 minutes)' }, { status: 400 });
    }

    // Update message
    const updatedMessage = await prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        content,
        isEdited: true,
        editedAt: new Date(),
        originalContent: message.isEdited ? message.originalContent : message.content,
      },
    });

    return Response.json({ success: true, message: updatedMessage });
  } catch (error) {
    console.error('Edit message error:', error);
    return Response.json({ error: 'Failed to edit message' }, { status: 500 });
  }
}

// Delete a message
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messageId = params.id;

    // Get message
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      return Response.json({ error: 'Message not found' }, { status: 404 });
    }

    // Check ownership or admin
    const user = session.user as any;
    if (message.senderId !== user.id && user.role !== 'ADMIN') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Soft delete
    await prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    return Response.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}

// Mark as read
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messageId = params.id;

    await prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    return Response.json({ error: 'Failed to mark as read' }, { status: 500 });
  }
}


