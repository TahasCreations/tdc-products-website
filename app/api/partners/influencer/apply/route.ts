import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { socialLinks, followerEst, category, agreement } = await req.json();
    
    if (!socialLinks || !agreement) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Mevcut başvuru var mı kontrol et
    const existingApp = await prisma.influencerApplication.findFirst({
      where: { userId: user.id, status: { in: ["pending", "approved"] } }
    });

    if (existingApp) {
      return NextResponse.json({ 
        error: "Zaten aktif bir başvurunuz bulunmaktadır" 
      }, { status: 400 });
    }

    const app = await prisma.influencerApplication.create({
      data: {
        userId: user.id,
        socialLinks,
        followerEst: followerEst ? Number(followerEst) : null,
        category: category || null,
        agreement: !!agreement,
      },
    });

    return NextResponse.json({ ok: true, id: app.id });
  } catch (error) {
    console.error("Influencer application error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  } finally {
    }
}
