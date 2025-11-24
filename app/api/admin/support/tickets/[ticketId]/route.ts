import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateTicketSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().nullable().optional(),
  tags: z.array(z.string()).optional(),
  category: z.enum(['order', 'product', 'payment', 'technical', 'other']).optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.ticketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        assignedAgent: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo,
        assignedAgent: ticket.assignedAgent,
        userId: ticket.userId,
        user: ticket.user,
        tags: ticket.tags ? JSON.parse(ticket.tags) : [],
        rating: ticket.rating,
        ratingComment: ticket.ratingComment,
        aiIntent: ticket.aiIntent,
        aiSentiment: ticket.aiSentiment,
        aiSummary: ticket.aiSummary,
        messages: ticket.messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          senderType: msg.senderType,
          senderId: msg.senderId,
          sender: msg.sender,
          createdAt: msg.createdAt.toISOString(),
        })),
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString(),
        resolvedAt: ticket.resolvedAt?.toISOString(),
        closedAt: ticket.closedAt?.toISOString(),
      },
    });

  } catch (error) {
    console.error('Ticket detay hatası:', error);
    return NextResponse.json(
      {
        error: "Ticket detayı alınamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true, id: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = updateTicketSchema.parse(body);

    const updateData: any = {};
    
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
      if (validatedData.status === 'RESOLVED') {
        updateData.resolvedAt = new Date();
      } else if (validatedData.status === 'CLOSED') {
        updateData.closedAt = new Date();
      }
    }
    if (validatedData.priority !== undefined) updateData.priority = validatedData.priority;
    if (validatedData.assignedTo !== undefined) updateData.assignedTo = validatedData.assignedTo;
    if (validatedData.tags !== undefined) updateData.tags = JSON.stringify(validatedData.tags);
    if (validatedData.category !== undefined) updateData.category = validatedData.category;

    const ticket = await prisma.supportTicket.update({
      where: { id: params.ticketId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Ticket güncelleme hatası:', error);
    return NextResponse.json(
      {
        error: "Ticket güncellenemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



