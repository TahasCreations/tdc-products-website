import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      storeName, 
      storeSlug,
      description,
      storeCategory,
      businessYears,
      contactName,
      contactEmail,
      phone,
      whatsapp,
      address,
      city,
      district,
      postalCode,
      sellerType,
      companyName,
      mersisNo,
      taxId, 
      taxOffice,
      iban, 
      bankName,
      cargoCompanies,
      preparationTime,
      returnPolicy,
      returnAddress,
      acceptTerms,
      acceptCommission,
      acceptKVKK,
      acceptQuality
    } = body;
    
    // Validation
    if (!storeName || !storeSlug || !description || !taxId || !iban || !acceptTerms) {
      return NextResponse.json({ error: "Lütfen tüm zorunlu alanları doldurun" }, { status: 400 });
    }

    // IBAN validation
    if (!iban.match(/^TR[0-9]{24}$/)) {
      return NextResponse.json({ error: "Geçerli bir TR IBAN girin (boşluksuz)" }, { status: 400 });
    }

    // TC/Vergi No validation
    if (sellerType === 'individual' && taxId.length !== 11) {
      return NextResponse.json({ error: "TC Kimlik No 11 haneli olmalıdır" }, { status: 400 });
    }
    if (sellerType === 'company' && taxId.length !== 10) {
      return NextResponse.json({ error: "Vergi No 10 haneli olmalıdır" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ 
      where: { email: session.user.email } 
    });
    
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    // Check if slug is taken
    const existingSlug = await prisma.sellerApplication.findFirst({
      where: { 
        storeName: { contains: storeSlug, mode: 'insensitive' }
      }
    });

    if (existingSlug) {
      return NextResponse.json({ 
        error: "Bu mağaza URL'i zaten kullanılıyor. Lütfen farklı bir URL deneyin." 
      }, { status: 400 });
    }

    // Check existing application
    const existingApp = await prisma.sellerApplication.findFirst({
      where: { userId: user.id, status: { in: ["pending", "approved"] } }
    });

    if (existingApp) {
      return NextResponse.json({ 
        error: "Zaten aktif bir başvurunuz var. Lütfen onay bekleyin." 
      }, { status: 400 });
    }

    // Create application with all data
    const app = await prisma.sellerApplication.create({
      data: { 
        userId: user.id, 
        storeName, 
        taxId, 
        iban, 
        shippingPref: cargoCompanies || 'yurtici',
        agreement: !!acceptTerms,
        // Additional data can be stored in metadata field if available
      },
    });

    return NextResponse.json({ ok: true, id: app.id });
  } catch (error: any) {
    console.error("Seller application error:", error);
    return NextResponse.json({ 
      error: error.message || "Başvuru gönderilirken bir hata oluştu" 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
