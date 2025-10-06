import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin kontrolü
    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (admin?.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { applicationId, type } = await req.json();

    if (!applicationId || !type) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    // Başvuru durumunu güncelle
    if (type === 'seller') {
      await prisma.sellerApplication.update({
        where: { id: applicationId },
        data: { status: 'rejected' }
      });
    } else if (type === 'influencer') {
      await prisma.influencerApplication.update({
        where: { id: applicationId },
        data: { status: 'rejected' }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reddetme hatası:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
