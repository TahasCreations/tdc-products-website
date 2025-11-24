import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendMarketingEmail } from "@/src/lib/email";

const createCampaignSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  fromName: z.string().min(1),
  fromEmail: z.string().email(),
  templateId: z.string().optional(),
  content: z.string().optional(),
  targetAudience: z.record(z.any()).optional(),
  sendDate: z.string().datetime().optional(),
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
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (status) where.status = status;

    const campaigns = await prisma.emailCampaign.findMany({
      where,
      include: {
        _count: {
          select: { recipients: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({
      success: true,
      campaigns: campaigns.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        subject: campaign.subject,
        status: campaign.status,
        totalRecipients: campaign.totalRecipients,
        deliveredCount: campaign.deliveredCount,
        openedCount: campaign.openedCount,
        clickedCount: campaign.clickedCount,
        openRate: campaign.openRate,
        clickRate: campaign.clickRate,
        sendDate: campaign.sendDate?.toISOString(),
        sentAt: campaign.sentAt?.toISOString(),
        createdAt: campaign.createdAt.toISOString(),
      })),
    });

  } catch (error) {
    console.error('Kampanya listeleme hatası:', error);
    return NextResponse.json(
      {
        error: "Kampanyalar listelenemedi",
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
    const validatedData = createCampaignSchema.parse(body);

    // Get target subscribers based on audience criteria
    const where: any = { status: 'active' };
    
    if (validatedData.targetAudience) {
      // Apply segmentation filters
      if (validatedData.targetAudience.tags) {
        // Filter by tags if needed
      }
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      select: { id: true, email: true },
    });

    // Create campaign
    const campaign = await prisma.emailCampaign.create({
      data: {
        name: validatedData.name,
        subject: validatedData.subject,
        fromName: validatedData.fromName,
        fromEmail: validatedData.fromEmail,
        templateId: validatedData.templateId,
        content: validatedData.content,
        targetAudience: validatedData.targetAudience || null,
        sendDate: validatedData.sendDate ? new Date(validatedData.sendDate) : null,
        status: validatedData.sendDate ? 'scheduled' : 'draft',
        totalRecipients: subscribers.length,
        createdBy: user.id,
        recipients: {
          create: subscribers.map(sub => ({
            subscriberId: sub.id,
            email: sub.email,
            status: 'pending',
          })),
        },
      },
    });

    // If sendDate is in the past or now, send immediately
    if (!validatedData.sendDate || new Date(validatedData.sendDate) <= new Date()) {
      // Send emails in background (would use queue in production)
      // For now, just mark as sending
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: { status: 'sending', sentAt: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      campaign: {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        totalRecipients: campaign.totalRecipients,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Kampanya oluşturma hatası:', error);
    return NextResponse.json(
      {
        error: "Kampanya oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



