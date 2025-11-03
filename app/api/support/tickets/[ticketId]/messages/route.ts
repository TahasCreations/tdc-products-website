import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// GET - Get ticket messages
export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const messages = await prisma.supportMessage.findMany({
      where: {
        ticketId: params.ticketId,
        isInternal: false // Sadece public mesajlar
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      messages: messages.map(msg => ({
        ...msg,
        attachments: msg.attachments ? JSON.parse(msg.attachments) : []
      }))
    });

  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Send new message
export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    
    const { content, attachments = [], senderType = 'user' } = body;

    if (!content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Message content required' },
        { status: 400 }
      );
    }

    // Verify ticket exists
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.ticketId }
    });

    if (!ticket) {
      return NextResponse.json(
        { success: false, error: 'Ticket not found' },
        { status: 404 }
      );
    }

    // Create message
    const message = await prisma.supportMessage.create({
      data: {
        ticketId: params.ticketId,
        senderId: session?.user?.id || null,
        senderType,
        messageType: attachments.length > 0 ? 'IMAGE' : 'TEXT',
        content,
        attachments: attachments.length > 0 ? JSON.stringify(attachments) : null
      }
    });

    // Update ticket status
    if (senderType === 'user') {
      await prisma.supportTicket.update({
        where: { id: params.ticketId },
        data: {
          status: 'IN_PROGRESS',
          updatedAt: new Date()
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: {
        ...message,
        attachments: attachments
      }
    });

  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

