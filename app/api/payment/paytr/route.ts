import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import paytrService from "@/lib/paytr";
import { z } from "zod";

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

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
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

    // PayTR token oluştur
    const clientIp = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     '127.0.0.1';

    const paymentToken = await paytrService.createPaymentToken({
      orderId: validatedData.orderId,
      amount: validatedData.amount,
      currency: validatedData.currency,
      customerEmail: validatedData.customerEmail,
      customerName: validatedData.customerName,
      customerPhone: validatedData.customerPhone,
      customerAddress: validatedData.customerAddress,
      productName: validatedData.productName,
      productCount: validatedData.basket.reduce((sum, item) => sum + item.quantity, 0),
      basket: validatedData.basket,
      successUrl: validatedData.successUrl,
      failUrl: validatedData.failUrl,
      userIp: clientIp,
    });

    return NextResponse.json({
      success: true,
      token: paymentToken.token,
      iframeUrl: paymentToken.iframeUrl,
      paymentUrl: paymentToken.paymentUrl,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.errors }, { status: 400 });
    }
    
    console.error('PayTR payment token oluşturulurken hata:', error);
    return NextResponse.json({ 
      error: "Ödeme token'ı oluşturulamadı",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PayTR callback endpoint
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const merchantOrderId = searchParams.get('merchant_order_id');
    const status = searchParams.get('status');
    const totalAmount = searchParams.get('total_amount');
    const hash = searchParams.get('hash');

    if (!merchantOrderId || !status || !totalAmount || !hash) {
      return NextResponse.json({ error: "Geçersiz callback parametreleri" }, { status: 400 });
    }

    // Hash doğrulama
    const isValid = paytrService.verifyCallback({
      merchantOrderId,
      status,
      totalAmount,
      hash,
    });

    if (!isValid) {
      return NextResponse.json({ error: "Geçersiz hash" }, { status: 400 });
    }

    // Sipariş durumunu güncelle
    const orderStatus = status === 'success' ? 'paid' : 'failed';
    
    await prisma.order.update({
      where: { orderNumber: merchantOrderId },
      data: { 
        status: orderStatus,
        paymentRef: hash,
      }
    });

    // Başarılı ödeme durumunda email gönder
    if (status === 'success') {
      // TODO: Email notification
      console.log(`Payment successful for order: ${merchantOrderId}`);
    }

    return NextResponse.json({
      success: true,
      status: orderStatus,
      orderId: merchantOrderId,
    });

  } catch (error) {
    console.error('PayTR callback işlenirken hata:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
