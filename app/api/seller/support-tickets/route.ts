import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/seller/support-tickets
 * Satıcıya ait destek taleplerini listeler
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: "Satıcı profili bulunamadı" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {
      sellerId: sellerProfile.id,
    };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (category) {
      where.category = category;
    }

    // Destek taleplerini getir
    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assignedAgent: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1, // Son mesajı al
            select: {
              id: true,
              content: true,
              senderType: true,
              createdAt: true,
            },
          },
          _count: {
            select: { messages: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.supportTicket.count({ where }),
    ]);

    // İstatistikler
    const stats = await prisma.supportTicket.groupBy({
      by: ['status'],
      where: { sellerId: sellerProfile.id },
      _count: true,
    });

    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      tickets: tickets.map((ticket) => ({
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        priority: ticket.priority,
        customer: ticket.user ? {
          id: ticket.user.id,
          name: ticket.user.name,
          email: ticket.user.email,
        } : null,
        assignedAgent: ticket.assignedAgent ? {
          id: ticket.assignedAgent.id,
          name: ticket.assignedAgent.name,
          email: ticket.assignedAgent.email,
        } : null,
        messageCount: ticket._count.messages,
        lastMessage: ticket.messages[0] ? {
          content: ticket.messages[0].content.substring(0, 100),
          senderType: ticket.messages[0].senderType,
          createdAt: ticket.messages[0].createdAt.toISOString(),
        } : null,
        tags: ticket.tags ? JSON.parse(ticket.tags) : [],
        rating: ticket.rating,
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString(),
        resolvedAt: ticket.resolvedAt?.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        open: statusCounts['OPEN'] || 0,
        inProgress: statusCounts['IN_PROGRESS'] || 0,
        waitingCustomer: statusCounts['WAITING_CUSTOMER'] || 0,
        resolved: statusCounts['RESOLVED'] || 0,
        closed: statusCounts['CLOSED'] || 0,
        total,
      },
    });

  } catch (error) {
    console.error('Satıcı destek talepleri getirme hatası:', error);
    return NextResponse.json(
      {
        error: "Destek talepleri getirilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

