import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPayTRToken, PayTRBasketItem } from "@/lib/payments/paytr";

const paytrPaymentSchema = z.object({
  orderId: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().default('TRY'),
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  customerAddress: z.string().min(1),
  productName: z.string().min(1),
  basket: z.array(z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
  successUrl: z.string().url(),
  failUrl: z.string().url(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = paytrPaymentSchema.parse(body);

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Siparişi kontrol et
    const order = await prisma.order.findUnique({
      where: { orderNumber: validatedData.orderId },
      include: { items: { include: { product: true } } }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const clientIp = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     '127.0.0.1';

    const basket: PayTRBasketItem[] = validatedData.basket.map((item) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    const tokenResponse = await createPayTRToken({
      orderId: validatedData.orderId,
      amount: validatedData.amount,
      currency: "TRY",
      email: validatedData.customerEmail,
      fullName: validatedData.customerName,
      phone: validatedData.customerPhone,
      address: validatedData.customerAddress,
      basket,
      successUrl: validatedData.successUrl,
      failUrl: validatedData.failUrl,
      userIp: clientIp,
    });

    await prisma.order.update({
      where: { orderNumber: validatedData.orderId },
      data: { status: "pending" },
    });

    return NextResponse.json({
      success: true,
      token: tokenResponse.token,
      iframeUrl: tokenResponse.iframeUrl,
      paymentUrl: tokenResponse.redirectUrl,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.errors }, { status: 400 });
    }
    
    console.error('PayTR payment token oluşturulurken hata:', error);
    return NextResponse.json({ 
      error: "Ödeme işlemi başlatılamadı",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
