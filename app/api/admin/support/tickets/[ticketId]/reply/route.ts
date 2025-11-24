import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const replySchema = z.object({
  content: z.string().min(1),
  isInternal: z.boolean().optional().default(false),
});

export async function POST(
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
    const validatedData = replySchema.parse(body);

    // Get ticket
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: params.ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket bulunamadı" }, { status: 404 });
    }

    // Create message
    const message = await prisma.supportMessage.create({
      data: {
        ticketId: params.ticketId,
        content: validatedData.content,
        senderType: validatedData.isInternal ? 'admin_internal' : 'admin',
        senderId: user.id,
      },
    });

    // Update ticket status if needed
    if (ticket.status === 'WAITING_CUSTOMER') {
      await prisma.supportTicket.update({
        where: { id: params.ticketId },
        data: { status: 'IN_PROGRESS' },
      });
    }

    return NextResponse.json({
      success: true,
      message: {
        id: message.id,
        content: message.content,
        senderType: message.senderType,
        createdAt: message.createdAt.toISOString(),
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Mesaj gönderme hatası:', error);
    return NextResponse.json(
      {
        error: "Mesaj gönderilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



