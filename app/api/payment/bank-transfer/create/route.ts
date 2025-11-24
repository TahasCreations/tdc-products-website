import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBankTransferPayment } from "@/lib/payments/bank-transfer";
import { z } from "zod";

const createBankTransferSchema = z.object({
  orderId: z.string(),
  expiresInDays: z.number().min(1).max(7).optional(),
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
    const validatedData = createBankTransferSchema.parse(body);

    // Order'ı kontrol et
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
      select: { id: true, userId: true, total: true, status: true, paymentMethod: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    // Sadece sipariş sahibi veya admin işlem yapabilir
    if (order.userId !== user.id) {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    // Sadece bank transfer ödeme yöntemi için
    if (order.paymentMethod !== 'bank') {
      return NextResponse.json(
        { error: "Bu sipariş havale/EFT ödeme yöntemi ile oluşturulmamış" },
        { status: 400 }
      );
    }

    // Ödeme işlemini oluştur
    const result = await createBankTransferPayment({
      orderId: validatedData.orderId,
      userId: user.id,
      amount: order.total,
      currency: 'TRY',
      expiresInDays: validatedData.expiresInDays,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Ödeme işlemi oluşturulamadı",
          details: result.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionId: result.transactionId,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Havale/EFT ödeme oluşturma hatası:', error);
    return NextResponse.json(
      {
        error: "Ödeme işlemi oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



