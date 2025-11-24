import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/src/lib/email";
import { KVKKCompliance } from "@/lib/kvkk/compliance";
import { createSellerOrders } from "@/lib/orders/seller-order-manager";
import { z } from "zod";

const createOrderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    title: z.string(),
    price: z.number(),
    quantity: z.number(),
    sellerId: z.string(),
    sellerName: z.string(),
  })),
  customerInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
  }),
  total: z.number(),
  paymentMethod: z.enum(['credit', 'bank']),
  couponCode: z.string().optional(),
  distanceSalesAgreementAccepted: z.boolean().refine(val => val === true, {
    message: "Mesafeli satış sözleşmesini kabul etmeniz gerekmektedir",
  }),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createOrderSchema.parse(body);

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sipariş numarası oluştur
    const orderNumber = `TDC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Mesafeli satış sözleşmesi onayını kaydet
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: validatedData.paymentMethod === 'bank' ? 'pending' : 'pending', // Havale/EFT için pending
        total: validatedData.total,
        shippingAddress: validatedData.shippingAddress,
        customerInfo: validatedData.customerInfo,
        paymentMethod: validatedData.paymentMethod,
        items: {
          create: validatedData.items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            sellerId: item.sellerId,
            sellerName: item.sellerName,
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                images: true,
              }
            }
          }
        }
      }
    });

    // Kupon kullanımını kaydet
    if (validatedData.couponCode) {
      try {
        const coupon = await prisma.coupon.findUnique({
          where: { code: validatedData.couponCode.toUpperCase() },
        });

        if (coupon) {
          // İndirim tutarını hesapla
          let discountAmount = 0;
          if (coupon.type === 'percentage') {
            discountAmount = (validatedData.total * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
              discountAmount = coupon.maxDiscountAmount;
            }
          } else if (coupon.type === 'fixed') {
            discountAmount = coupon.discountValue;
          } else if (coupon.type === 'free_shipping') {
            discountAmount = coupon.discountValue || 125;
          }

          // Kupon kullanımını kaydet
          await prisma.couponUsage.create({
            data: {
              couponId: coupon.id,
              orderId: order.id,
              userId: user.id,
              discountAmount,
              orderTotal: validatedData.total,
            },
          });

          // Kupon kullanım sayısını güncelle
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: {
              usedCount: { increment: 1 },
            },
          });
        }
      } catch (couponError) {
        console.error("Kupon kullanımı kaydetme hatası:", couponError);
        // Hata durumunda devam et, sipariş oluşturuldu
      }
    }

    // Havale/EFT ödeme yöntemi için payment transaction oluştur
    if (validatedData.paymentMethod === 'bank') {
      try {
        const { createBankTransferPayment } = await import("@/lib/payments/bank-transfer");
        await createBankTransferPayment({
          orderId: order.id,
          userId: user.id,
          amount: validatedData.total,
          currency: 'TRY',
          expiresInDays: 3,
        });
      } catch (paymentError) {
        console.error("Havale/EFT ödeme işlemi oluşturma hatası:", paymentError);
        // Hata durumunda devam et, sipariş oluşturuldu
      }
    }

    // SellerOrder'ları oluştur (çok satıcılı sistem için)
    try {
      await createSellerOrders({
        orderId: order.id,
        orderItems: order.items.map(item => ({
          id: item.id,
          sellerId: item.sellerId,
          subtotal: item.subtotal,
        })),
      });
    } catch (sellerOrderError) {
      console.error("SellerOrder oluşturma hatası:", sellerOrderError);
      // Hata durumunda devam et, sipariş oluşturuldu
    }

    // Mesafeli satış sözleşmesi onayını kaydet
    await KVKKCompliance.recordDistanceSalesAgreement(
      user.id,
      order.id,
      '1.0',
      Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
      userAgent
    );

    // Send order confirmation email
    if (user.email) {
      try {
        const shippingAddressStr = `${validatedData.shippingAddress.address}, ${validatedData.shippingAddress.city} ${validatedData.shippingAddress.postalCode}`;
        await sendOrderConfirmation(user.email, {
          orderNumber: order.orderNumber,
          customerName: user.name || validatedData.customerInfo.firstName,
          items: order.items.map(item => ({
            name: item.product?.title || item.title || "Ürün",
            price: item.unitPrice,
            quantity: item.qty,
            image: item.product?.images ? (JSON.parse(item.product.images as string)?.[0] || null) : null,
          })),
          total: order.total,
          shippingAddress: shippingAddressStr,
        });
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
        // Don't fail the order creation if email fails
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.total,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Geçersiz veri", details: error.errors }, { status: 400 });
    }
    
    console.error('Sipariş oluşturulurken hata:', error);
    return NextResponse.json({ 
      error: "Sipariş oluşturulamadı",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
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
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Kullanıcının siparişlerini getir
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ orders });

  } catch (error) {
    console.error('Siparişler getirilirken hata:', error);
    return NextResponse.json({ 
      error: "Siparişler getirilemedi",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
