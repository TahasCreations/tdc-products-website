import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPaymentReminderEmail } from "@/lib/payments/bank-transfer";
import { z } from "zod";

const remindPaymentSchema = z.object({
  transactionId: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sadece admin hatırlatma gönderebilir
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = remindPaymentSchema.parse(body);

    const result = await sendPaymentReminderEmail(validatedData.transactionId);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Hatırlatma email'i gönderilemedi",
          details: result.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Hatırlatma email'i gönderildi",
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Ödeme hatırlatma hatası:', error);
    return NextResponse.json(
      {
        error: "Hatırlatma email'i gönderilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



