import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storeName, taxId, iban, shippingPref, agreement } = await req.json();
    
    if (!storeName || !taxId || !iban || !shippingPref || !agreement) {
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Mevcut başvuru var mı kontrol et
    const existingApp = await prisma.sellerApplication.findFirst({
      where: { userId: user.id, status: { in: ["pending", "approved"] } }
    });

    if (existingApp) {
      return NextResponse.json({ 
        error: "Zaten aktif bir başvurunuz bulunmaktadır" 
      }, { status: 400 });
    }

    const app = await prisma.sellerApplication.create({
      data: { 
        userId: user.id, 
        storeName, 
        taxId, 
        iban, 
        shippingPref, 
        agreement: !!agreement 
      },
    });

    return NextResponse.json({ ok: true, id: app.id });
  } catch (error) {
    console.error("Seller application error:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
