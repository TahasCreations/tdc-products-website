import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import iyzicoService from "@/lib/iyzico";
import { z } from "zod";

const iyzicoPaymentSchema = z.object({
  orderId: z.string().min(1),
  cardHolderName: z.string().min(1),
  cardNumber: z.string().min(13).max(19),
  expireMonth: z.string().min(1).max(2),
  expireYear: z.string().min(2).max(4),
  cvc: z.string().min(3).max(4),
  installment: z.number().min(1).max(12).default(1),
  buyer: z.object({
    name: z.string().min(1),
    surname: z.string().min(1),
    gsmNumber: z.string().min(1),
    email: z.string().email(),
    identityNumber: z.string().min(11).max(11),
    registrationAddress: z.string().min(1),
    ip: z.string().optional(),
    city: z.string().min(1),
    country: z.string().min(1),
    zipCode: z.string().min(1),
  }),
  shippingAddress: z.object({
    contactName: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    address: z.string().min(1),
    zipCode: z.string().min(1),
  }),
  billingAddress: z.object({
    contactName: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    address: z.string().min(1),
    zipCode: z.string().min(1),
  }),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = iyzicoPaymentSchema.parse(body);

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Siparişi bul ve ürünleri getir
    const order = await prisma.order.findUnique({
      where: { orderNumber: validatedData.orderId },
      include: { 
        items: { 
          include: { product: true } 
        } 
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Client IP'yi al
    const clientIp = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     '127.0.0.1';

    // Iyzico payment request oluştur
    const paymentRequest = {
      conversationId: `tdc_${validatedData.orderId}_${Date.now()}`,
      price: order.total,
      paidPrice: order.total,
      currency: 'TRY',
      installment: validatedData.installment,
      cardHolderName: validatedData.cardHolderName,
      cardNumber: validatedData.cardNumber,
      expireMonth: validatedData.expireMonth,
      expireYear: validatedData.expireYear,
      cvc: validatedData.cvc,
      buyer: {
        ...validatedData.buyer,
        id: user.id,
        ip: clientIp,
      },
      shippingAddress: validatedData.shippingAddress,
      billingAddress: validatedData.billingAddress,
      basketItems: order.items.map(item => ({
        id: item.product.id,
        name: item.product.title,
        category1: item.product.category,
        category2: 'E-ticaret',
        itemType: 'PHYSICAL',
        price: item.price,
      })),
    };

    // Iyzico'ya ödeme isteği gönder
    const paymentResult = await iyzicoService.createPayment(paymentRequest);

    if (paymentResult.success) {
      // Sipariş durumunu güncelle
      await prisma.order.update({
        where: { orderNumber: validatedData.orderId },
        data: { 
          status: 'paid',
          paymentRef: paymentResult.paymentId,
        }
      });

      // TODO: Email notification
      console.log(`Iyzico payment successful for order: ${validatedData.orderId}`);

      return NextResponse.json({
        success: true,
        paymentId: paymentResult.paymentId,
        status: paymentResult.status,
        htmlContent: paymentResult.htmlContent,
      });
    } else {
      // Ödeme başarısız
      await prisma.order.update({
        where: { orderNumber: validatedData.orderId },
        data: { status: 'failed' }
      });

      return NextResponse.json({
        success: false,
        errorMessage: paymentResult.errorMessage || 'Ödeme işlemi başarısız',
      }, { status: 400 });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.errors }, { status: 400 });
    }
    
    console.error('Iyzico payment error:', error);
    return NextResponse.json({ 
      error: "Ödeme işlemi sırasında hata oluştu",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
