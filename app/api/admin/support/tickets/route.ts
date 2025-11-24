import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createTicketSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string(),
  subject: z.string().min(1),
  category: z.enum(['order', 'product', 'payment', 'technical', 'other']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  message: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const assignedTo = searchParams.get('assignedTo');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (assignedTo) where.assignedTo = assignedTo;
    
    if (search) {
      where.OR = [
        { ticketNumber: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tickets = await prisma.supportTicket.findMany({
      where,
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
          take: 1, // Son mesaj
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });

    return NextResponse.json({
      success: true,
      tickets: tickets.map(ticket => ({
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo,
        userId: ticket.userId,
        user: ticket.user,
        messageCount: ticket._count.messages,
        lastMessage: ticket.messages[0]?.content?.substring(0, 100),
        rating: ticket.rating,
        tags: ticket.tags ? JSON.parse(ticket.tags) : [],
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString(),
        resolvedAt: ticket.resolvedAt?.toISOString(),
        closedAt: ticket.closedAt?.toISOString(),
      })),
    });

  } catch (error) {
    console.error('Ticket listeleme hatası:', error);
    return NextResponse.json(
      {
        error: "Ticket'lar listelenemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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
    const validatedData = createTicketSchema.parse(body);

    // Generate ticket number
    const year = new Date().getFullYear();
    const ticketCount = await prisma.supportTicket.count({
      where: {
        ticketNumber: {
          startsWith: `TDC-${year}-`,
        },
      },
    });
    const ticketNumber = `TDC-${year}-${String(ticketCount + 1).padStart(5, '0')}`;

    // Create ticket with first message
    const ticket = await prisma.supportTicket.create({
      data: {
        ticketNumber,
        userId: validatedData.userId,
        sessionId: validatedData.sessionId,
        subject: validatedData.subject,
        category: validatedData.category,
        priority: validatedData.priority || 'MEDIUM',
        tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
        messages: {
          create: {
            content: validatedData.message,
            senderType: 'user',
            senderId: validatedData.userId,
          },
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        status: ticket.status,
        user: ticket.user,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Ticket oluşturma hatası:', error);
    return NextResponse.json(
      {
        error: "Ticket oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



