import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

// Generate ticket number
function generateTicketNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `TDC-${year}-${random}`;
}

// Auto-assign agent based on availability
async function assignAgent(category: string): Promise<string | null> {
  const agent = await prisma.supportAgent.findFirst({
    where: {
      isOnline: true,
      isAvailable: true,
      categories: {
        contains: category
      }
    },
    orderBy: {
      totalTickets: 'asc' // Load balancing: En az ticket'ı olana ata
    }
  });

  return agent?.userId || null;
}

// POST - Create new ticket
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    
    const {
      subject,
      message,
      category = 'other',
      priority = 'MEDIUM',
      sessionId,
      aiIntent,
      aiSentiment
    } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Subject and message required' },
        { status: 400 }
      );
    }

    // Auto-assign agent
    const assignedTo = await assignAgent(category);

    // Create ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber: generateTicketNumber(),
        userId: session?.user?.id || null,
        sessionId: sessionId || `guest-${Date.now()}`,
        subject,
        category,
        status: 'OPEN',
        priority,
        assignedTo,
        aiIntent,
        aiSentiment
      }
    });

    // Create first message
    await prisma.supportMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: session?.user?.id || null,
        senderType: 'user',
        messageType: 'TEXT',
        content: message
      }
    });

    // Update agent stats
    if (assignedTo) {
      await prisma.supportAgent.update({
        where: { userId: assignedTo },
        data: {
          totalTickets: { increment: 1 }
        }
      });
    }

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        assignedTo: ticket.assignedTo
      }
    });

  } catch (error) {
    console.error('Ticket creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ticket' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET - List user tickets
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const tickets = await prisma.supportTicket.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1 // Sadece ilk mesajı al
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      tickets
    });

  } catch (error) {
    console.error('Tickets fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

