import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { KVKKCompliance } from "@/lib/kvkk/compliance";
import { z } from "zod";

const consentSchema = z.object({
  consentType: z.enum(['kvkk', 'cookies', 'marketing', 'analytics', 'functional']),
  consentStatus: z.boolean(),
  consentText: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = consentSchema.parse(body);

    // IP adresi ve user agent'ı al
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Onayı kaydet
    await KVKKCompliance.recordConsent({
      userId: user.id,
      consentType: validatedData.consentType,
      consentStatus: validatedData.consentStatus,
      ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
      userAgent,
      consentText: validatedData.consentText,
    });

    return NextResponse.json({
      success: true,
      message: "Onay kaydedildi",
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('KVKK onay kaydı hatası:', error);
    return NextResponse.json(
      {
        error: "Onay kaydedilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const url = new URL(req.url);
    const consentType = url.searchParams.get('type') as 'kvkk' | 'cookies' | 'marketing' | 'analytics' | 'functional' | null;

    if (consentType) {
      // Belirli bir onay tipinin durumunu getir
      const status = await KVKKCompliance.getConsentStatus(user.id, consentType);
      return NextResponse.json({ consentStatus: status });
    } else {
      // Tüm onay geçmişini getir
      const history = await KVKKCompliance.getConsentHistory(user.id);
      return NextResponse.json({ history });
    }

  } catch (error) {
    console.error('KVKK onay durumu getirme hatası:', error);
    return NextResponse.json(
      {
        error: "Onay durumu getirilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



