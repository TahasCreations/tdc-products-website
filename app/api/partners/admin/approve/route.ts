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

    // Admin kontrolü
    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email },
      select: { role: true }
    });

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin yetkisi gerekli" }, { status: 403 });
    }

    const { userId, role, applicationId } = await req.json();
    
    if (!userId || !role || !applicationId) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    if (!["SELLER", "INFLUENCER"].includes(role)) {
      return NextResponse.json({ error: "Geçersiz rol" }, { status: 400 });
    }

    // Kullanıcı rolünü güncelle
    await prisma.user.update({ 
      where: { id: userId }, 
      data: { role: role as any } 
    });

    // Başvuru durumunu güncelle
    if (role === "SELLER") {
      await prisma.sellerApplication.update({
        where: { id: applicationId },
        data: { status: "approved" }
      });
    } else if (role === "INFLUENCER") {
      await prisma.influencerApplication.update({
        where: { id: applicationId },
        data: { status: "approved" }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin approval error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  } finally {
    }
}
