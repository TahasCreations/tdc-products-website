import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin kontrolü
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Satıcı başvuruları
    const sellerApplications = await prisma.sellerApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Influencer başvuruları
    const influencerApplications = await prisma.influencerApplication.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Başvuruları birleştir
    const applications = [
      ...sellerApplications.map(app => ({
        id: app.id,
        type: 'seller' as const,
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        user: app.user,
        data: {
          storeName: app.storeName,
          taxId: app.taxId,
          iban: app.iban,
          shippingPref: app.shippingPref
        }
      })),
      ...influencerApplications.map(app => ({
        id: app.id,
        type: 'influencer' as const,
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        user: app.user,
        data: {
          socialLinks: app.socialLinks,
          followerEst: app.followerEst,
          category: app.category
        }
      }))
    ];

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Başvurular getirilirken hata:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
