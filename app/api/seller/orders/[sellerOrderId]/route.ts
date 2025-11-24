import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSellerOrderStatus } from "@/lib/orders/seller-order-manager";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
  trackingNumber: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * GET /api/seller/orders/[sellerOrderId]
 * Belirli bir sub-order'ın detaylarını getirir
 */
export async function GET(
  req: Request,
  { params }: { params: { sellerOrderId: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: "Satıcı profili bulunamadı" }, { status: 404 });
    }

    const sellerOrder = await prisma.sellerOrder.findFirst({
      where: {
        id: params.sellerOrderId,
        sellerId: sellerProfile.id,
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            paymentMethod: true,
            shippingAddress: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            items: {
              where: {
                sellerId: sellerProfile.id,
              },
              include: {
                product: {
                  select: {
                    id: true,
                    title: true,
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!sellerOrder) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: sellerOrder.id,
        orderId: sellerOrder.orderId,
        orderNumber: sellerOrder.order.orderNumber,
        status: sellerOrder.status,
        total: sellerOrder.total,
        commission: sellerOrder.commission,
        commissionRate: sellerOrder.commissionRate,
        payoutAmount: sellerOrder.payoutAmount,
        trackingNumber: sellerOrder.trackingNumber,
        notes: sellerOrder.notes,
        customer: sellerOrder.order.user ? {
          id: sellerOrder.order.user.id,
          name: sellerOrder.order.user.name,
          email: sellerOrder.order.user.email,
          phone: sellerOrder.order.user.phone,
        } : null,
        shippingAddress: sellerOrder.order.shippingAddress,
        items: sellerOrder.order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          title: item.title,
          quantity: item.qty,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          image: item.product?.images 
            ? (JSON.parse(item.product.images as string)?.[0] || null)
            : null,
        })),
        paidAt: sellerOrder.paidAt?.toISOString(),
        shippedAt: sellerOrder.shippedAt?.toISOString(),
        deliveredAt: sellerOrder.deliveredAt?.toISOString(),
        createdAt: sellerOrder.createdAt.toISOString(),
        updatedAt: sellerOrder.updatedAt.toISOString(),
      },
    });

  } catch (error) {
    console.error('Sub-order detayı getirme hatası:', error);
    return NextResponse.json(
      {
        error: "Sipariş getirilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/seller/orders/[sellerOrderId]
 * Sub-order durumunu günceller
 */
export async function PATCH(
  req: Request,
  { params }: { params: { sellerOrderId: string } }
) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true },
    });

    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: "Satıcı profili bulunamadı" }, { status: 404 });
    }

    const body = await req.json();
    const validatedData = updateStatusSchema.parse(body);

    // Sub-order'ı kontrol et
    const sellerOrder = await prisma.sellerOrder.findFirst({
      where: {
        id: params.sellerOrderId,
        sellerId: sellerProfile.id,
      },
    });

    if (!sellerOrder) {
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 });
    }

    // Durumu güncelle
    const updatedOrder = await updateSellerOrderStatus(
      params.sellerOrderId,
      validatedData.status,
      {
        trackingNumber: validatedData.trackingNumber,
        notes: validatedData.notes,
      }
    );

    return NextResponse.json({
      success: true,
      order: {
        id: updatedOrder.id,
        status: updatedOrder.status,
        trackingNumber: updatedOrder.trackingNumber,
        notes: updatedOrder.notes,
        shippedAt: updatedOrder.shippedAt?.toISOString(),
        deliveredAt: updatedOrder.deliveredAt?.toISOString(),
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Geçersiz veri", details: error.errors },
        { status: 400 }
      );
    }

    console.error('Sub-order güncelleme hatası:', error);
    return NextResponse.json(
      {
        error: "Sipariş güncellenemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

