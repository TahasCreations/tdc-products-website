import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

/**
 * Escalate chat to human agent (AI → Human handoff)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, message, userId, intent, sentiment } = body;

    if (!sessionId || !message) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if ticket already exists for this session
    let ticket = await prisma.supportTicket.findFirst({
      where: {
        sessionId,
        status: { in: ['OPEN', 'IN_PROGRESS'] }
      }
    });

    if (!ticket) {
      // Create new ticket
      const ticketNumber = `TDC-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      
      // Auto-assign agent
      const agent = await prisma.supportAgent.findFirst({
        where: {
          isOnline: true,
          isAvailable: true
        },
        orderBy: {
          totalTickets: 'asc'
        }
      });

      // Determine priority based on sentiment
      let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM';
      if (sentiment === 'negative') priority = 'HIGH';
      if (intent?.includes('complaint') || intent?.includes('urgent')) priority = 'URGENT';

      ticket = await prisma.supportTicket.create({
        data: {
          ticketNumber,
          userId: userId || null,
          sessionId,
          subject: message.substring(0, 100), // İlk 100 karakter
          category: intent || 'general',
          status: 'OPEN',
          priority,
          assignedTo: agent?.userId || null,
          aiIntent: intent,
          aiSentiment: sentiment
        }
      });

      // Create initial message
      await prisma.supportMessage.create({
        data: {
          ticketId: ticket.id,
          senderId: userId || null,
          senderType: 'user',
          content: message
        }
      });

      // Update agent stats
      if (agent) {
        await prisma.supportAgent.update({
          where: { userId: agent.userId },
          data: {
            totalTickets: { increment: 1 },
            lastActiveAt: new Date()
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        assignedTo: ticket.assignedTo
      },
      message: agent ? 
        `Ticket oluşturuldu: ${ticket.ticketNumber}. Bir temsilcimiz en kısa sürede size dönüş yapacak.` :
        `Ticket oluşturuldu: ${ticket.ticketNumber}. Tüm temsilcilerimiz meşgul, en kısa sürede dönüş yapacağız.`
    });

  } catch (error) {
    console.error('Escalation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to escalate to agent' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

