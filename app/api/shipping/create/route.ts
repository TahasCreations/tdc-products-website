import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getShippingManager } from "@/lib/shipping/shipping-manager";
import { z } from "zod";

const createShipmentSchema = z.object({
  orderId: z.string(),
  carrierCode: z.string(), // YURTICI, ARAS, MNG, etc.
  service: z.string().optional(),
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

    // Sadece admin veya satıcı kargo oluşturabilir
    if (user.role !== 'ADMIN' && user.role !== 'SELLER') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = createShipmentSchema.parse(body);

    // Siparişi getir
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        items: {
          include: {
            product: { select: { title: true, weight: true, dimensions: true } },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    // Sadece ödenmiş siparişler için kargo oluşturulabilir
    if (order.status !== 'paid') {
      return NextResponse.json(
        { error: "Sadece ödenmiş siparişler için kargo oluşturulabilir" },
        { status: 400 }
      );
    }

    // Satıcı bilgilerini al (ilk item'dan)
    const firstItem = order.items[0];
    if (!firstItem) {
      return NextResponse.json({ error: "Siparişte ürün bulunamadı" }, { status: 400 });
    }

    const seller = await prisma.sellerProfile.findUnique({
      where: { id: firstItem.sellerId },
      select: {
        id: true,
        storeName: true,
        userId: true,
      },
    });

    if (!seller) {
      return NextResponse.json({ error: "Satıcı bulunamadı" }, { status: 404 });
    }

    // Satıcı kendi siparişleri için kargo oluşturabilir
    if (user.role === 'SELLER' && seller.userId !== user.id) {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    // Satıcı adres bilgilerini al (seller profile'dan veya default)
    const sellerUser = await prisma.user.findUnique({
      where: { id: seller.userId },
      select: { name: true, email: true, phone: true },
    });

    // Kargo bilgilerini hazırla
    const shippingAddress = order.shippingAddress as any;
    const totalWeight = order.items.reduce((sum, item) => {
      const weight = (item.product?.weight as number) || 0.5;
      return sum + weight * item.qty;
    }, 0);

    const shippingManager = getShippingManager();
    
    const shipmentResult = await shippingManager.createShipment(validatedData.carrierCode, {
      sender: {
        name: seller.storeName,
        phone: sellerUser?.phone || '',
        email: sellerUser?.email || '',
        address: 'Satıcı Adresi', // TODO: Seller address bilgisi eklenmeli
        city: 'İstanbul', // TODO: Seller city bilgisi eklenmeli
        district: '',
        postalCode: '',
        country: 'Turkey',
      },
      recipient: {
        name: shippingAddress?.name || order.user?.name || 'Müşteri',
        phone: shippingAddress?.phone || order.user?.phone || '',
        email: order.user?.email || '',
        address: shippingAddress?.address || '',
        city: shippingAddress?.city || '',
        district: shippingAddress?.district || '',
        postalCode: shippingAddress?.postalCode || '',
        country: 'Turkey',
      },
      package: {
        weight: totalWeight,
        dimensions: undefined, // TODO: Calculate from items
        value: order.total,
        description: order.items.map(item => item.product?.title || item.title).join(', '),
      },
      service: validatedData.service,
      reference: order.orderNumber,
      codAmount: undefined, // Kapıda ödeme desteklenmiyor
    });

    if (!shipmentResult.success) {
      return NextResponse.json(
        {
          error: "Kargo oluşturulamadı",
          details: shipmentResult.errors,
        },
        { status: 400 }
      );
    }

    // Order item'ları güncelle (tracking code ekle)
    await prisma.orderItem.updateMany({
      where: { orderId: order.id },
      data: {
        trackingCode: shipmentResult.trackingNumber,
        trackingCarrier: validatedData.carrierCode,
        status: 'shipped',
        shippedAt: new Date(),
      },
    });

    // Order status'u güncelle
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'shipped' },
    });

    return NextResponse.json({
      success: true,
      shipment: {
        trackingNumber: shipmentResult.trackingNumber,
        carrier: validatedData.carrierCode,
        labelUrl: shipmentResult.label?.labelUrl,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Kargo oluşturma hatası:', error);
    return NextResponse.json(
      {
        error: "Kargo oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

