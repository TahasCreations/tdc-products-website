import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyBankTransferPayment, rejectBankTransferPayment } from "@/lib/payments/bank-transfer";
import { z } from "zod";

const verifyPaymentSchema = z.object({
  transactionId: z.string(),
  reference: z.string().min(1),
  receiptUrl: z.string().url().optional(),
  action: z.enum(['verify', 'reject']).default('verify'),
  rejectionReason: z.string().optional(),
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

    // Sadece admin ödeme onaylayabilir
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = verifyPaymentSchema.parse(body);

    let result;
    
    if (validatedData.action === 'verify') {
      result = await verifyBankTransferPayment({
        transactionId: validatedData.transactionId,
        reference: validatedData.reference,
        receiptUrl: validatedData.receiptUrl,
        verifiedBy: user.id,
      });
    } else {
      if (!validatedData.rejectionReason) {
        return NextResponse.json(
          { error: "Red sebebi gerekli" },
          { status: 400 }
        );
      }
      
      result = await rejectBankTransferPayment(
        validatedData.transactionId,
        validatedData.rejectionReason,
        user.id,
      );
    }

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Ödeme işlemi güncellenemedi",
          details: result.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: validatedData.action === 'verify' ? 'Ödeme onaylandı' : 'Ödeme reddedildi',
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Ödeme onaylama hatası:', error);
    return NextResponse.json(
      {
        error: "Ödeme işlemi güncellenemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



