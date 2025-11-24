import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  source: z.string().optional(),
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
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { subscribedAt: 'desc' },
      take: limit,
    });

    const stats = {
      total: await prisma.newsletterSubscriber.count(),
      active: await prisma.newsletterSubscriber.count({ where: { status: 'active' } }),
      unsubscribed: await prisma.newsletterSubscriber.count({ where: { status: 'unsubscribed' } }),
      bounced: await prisma.newsletterSubscriber.count({ where: { status: 'bounced' } }),
    };

    return NextResponse.json({
      success: true,
      subscribers: subscribers.map(sub => ({
        id: sub.id,
        email: sub.email,
        firstName: sub.firstName,
        lastName: sub.lastName,
        status: sub.status,
        source: sub.source,
        tags: sub.tags ? JSON.parse(sub.tags) : [],
        subscribedAt: sub.subscribedAt.toISOString(),
        unsubscribedAt: sub.unsubscribedAt?.toISOString(),
        lastEmailAt: sub.lastEmailAt?.toISOString(),
      })),
      stats,
    });

  } catch (error) {
    console.error('Newsletter listeleme hatası:', error);
    return NextResponse.json(
      {
        error: "Aboneler listelenemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = subscribeSchema.parse(body);

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: validatedData.email },
    });

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { success: false, error: 'Bu email zaten abone' },
          { status: 400 }
        );
      } else {
        // Reactivate
        const subscriber = await prisma.newsletterSubscriber.update({
          where: { email: validatedData.email },
          data: {
            status: 'active',
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            source: validatedData.source,
            tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
            unsubscribedAt: null,
          },
        });

        return NextResponse.json({
          success: true,
          subscriber: {
            id: subscriber.id,
            email: subscriber.email,
            status: subscriber.status,
          },
        });
      }
    }

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: validatedData.email,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        source: validatedData.source || 'website',
        tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
      },
    });

    return NextResponse.json({
      success: true,
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        status: subscriber.status,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Newsletter abonelik hatası:', error);
    return NextResponse.json(
      {
        error: "Abonelik oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



