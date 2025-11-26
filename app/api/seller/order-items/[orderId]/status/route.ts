import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendOrderShipped, sendOrderDelivered } from "@/src/lib/email";

const statusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  trackingCode: z.string().max(120).optional(),
  trackingCarrier: z.string().max(120).optional(),
  sellerNotes: z.string().max(500).optional(),
});

function parsePrimaryImage(images?: string | null): string | null {
  if (!images) return null;
  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
      return parsed[0];
    }
  } catch {
    // ignore
  }
  return null;
}

export async function PATCH(
  request: Request,
  { params }: { params: { orderId: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role?: string } | undefined;

    if (!user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "SELLER" && user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!sellerProfile && user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Seller profile not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const parsed = statusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Geçersiz istek", issues: parsed.error.flatten() },
        { status: 422 },
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        items: {
          where: user.role === "ADMIN" ? {} : { sellerId: sellerProfile!.id },
          select: {
            id: true,
            sellerId: true,
            status: true,
            shippedAt: true,
            deliveredAt: true,
            trackingCode: true,
            trackingCarrier: true,
            sellerNotes: true,
          },
        },
      },
    });

    if (!order || order.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Sipariş bulunamadı" },
        { status: 404 },
      );
    }

    const { status, trackingCode, trackingCarrier, sellerNotes } = parsed.data;
    const now = new Date();

    await prisma.$transaction(
      order.items.map((item) => {
        const data: any = {
          status,
          trackingCode: trackingCode ?? item.trackingCode,
          trackingCarrier: trackingCarrier ?? item.trackingCarrier,
          sellerNotes: sellerNotes ?? item.sellerNotes,
        };

        if (status === "processing") {
          data.shippedAt = null;
          data.deliveredAt = null;
        } else if (status === "shipped") {
          data.shippedAt = item.shippedAt ?? now;
          data.deliveredAt = null;
          
          // Eğer tracking code yoksa ve carrier varsa, otomatik kargo oluştur
          if (!data.trackingCode && trackingCarrier) {
            try {
              const { getShippingManager } = await import("@/lib/shipping/shipping-manager");
              const shippingManager = getShippingManager();
              
              // Order bilgilerini al
              const orderWithDetails = await prisma.order.findUnique({
                where: { id: order.id },
                include: {
                  user: { select: { name: true, email: true, phone: true } },
                  items: {
                    where: { id: item.id },
                    include: {
                      product: { select: { title: true, weight: true } },
                    },
                  },
                },
              });
              
              if (orderWithDetails && orderWithDetails.items.length > 0) {
                const orderItem = orderWithDetails.items[0];
                const shippingAddress = orderWithDetails.shippingAddress as any;
                
                const shipmentResult = await shippingManager.createShipment(trackingCarrier, {
                  sender: {
                    name: sellerProfile.storeName,
                    phone: '', // TODO: Seller phone
                    email: '', // TODO: Seller email
                    address: 'Satıcı Adresi',
                    city: 'İstanbul',
                    country: 'Turkey',
                  },
                  recipient: {
                    name: shippingAddress?.name || orderWithDetails.user?.name || 'Müşteri',
                    phone: shippingAddress?.phone || orderWithDetails.user?.phone || '',
                    email: orderWithDetails.user?.email || '',
                    address: shippingAddress?.address || '',
                    city: shippingAddress?.city || '',
                    district: shippingAddress?.district,
                    postalCode: shippingAddress?.postalCode,
                    country: 'Turkey',
                  },
                  package: {
                    weight: (orderItem.product?.weight as number) || 0.5,
                    value: orderItem.subtotal,
                    description: orderItem.product?.title || orderItem.title,
                  },
                  reference: orderWithDetails.orderNumber,
                });
                
                if (shipmentResult.success && shipmentResult.trackingNumber) {
                  data.trackingCode = shipmentResult.trackingNumber;
                }
              }
            } catch (error) {
              console.error("Otomatik kargo oluşturma hatası:", error);
              // Hata durumunda devam et, tracking code olmadan güncelle
            }
          }
        } else if (status === "delivered") {
          data.shippedAt = item.shippedAt ?? now;
          data.deliveredAt = now;
        } else if (status === "cancelled") {
          data.deliveredAt = null;
        }

        return prisma.orderItem.update({
          where: { id: item.id },
          data,
        });
      }),
    );

    const allItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
      select: { status: true },
    });

    let newOrderStatus = order.status;
    if (allItems.every((item) => item.status === "delivered")) {
      newOrderStatus = "delivered";
    } else if (allItems.every((item) => item.status === "cancelled")) {
      newOrderStatus = "cancelled";
    } else if (allItems.some((item) => item.status === "shipped" || item.status === "delivered")) {
      newOrderStatus = "shipped";
    } else if (allItems.some((item) => item.status === "processing")) {
      newOrderStatus = "processing";
    } else {
      newOrderStatus = "pending";
    }

    if (newOrderStatus !== order.status) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: newOrderStatus },
      });
    }

    // Send email notifications for status changes
    const orderWithUser = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (orderWithUser?.user?.email) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        
        // Check if any item was just shipped
        if (status === "shipped" && trackingCode) {
          const shippedItems = order.items.filter(item => item.status !== "shipped");
          if (shippedItems.length > 0) {
            await sendOrderShipped(orderWithUser.user.email, {
              customerName: orderWithUser.user.name || "Değerli Müşteri",
              orderNumber: order.orderNumber,
              trackingCode: trackingCode,
              trackingCarrier: trackingCarrier || "Kargo",
              trackingUrl: trackingCarrier ? `https://www.${trackingCarrier.toLowerCase()}.com/track/${trackingCode}` : undefined,
            });
          }
        }
        
        // Check if all items are delivered
        if (status === "delivered" && newOrderStatus === "delivered") {
          await sendOrderDelivered(orderWithUser.user.email, {
            customerName: orderWithUser.user.name || "Değerli Müşteri",
            orderNumber: order.orderNumber,
            reviewUrl: `${baseUrl}/orders/${order.orderNumber}`,
          });
        }
      } catch (emailError) {
        console.error("Failed to send order status email:", emailError);
        // Don't fail the update if email fails
      }
    }

    const updatedOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        user: { select: { name: true, email: true } },
        items: {
          where: user.role === "ADMIN" ? {} : { sellerId: sellerProfile!.id },
          select: {
            id: true,
            productId: true,
            title: true,
            qty: true,
            unitPrice: true,
            subtotal: true,
            status: true,
            trackingCode: true,
            trackingCarrier: true,
            sellerNotes: true,
            shippedAt: true,
            deliveredAt: true,
            product: { select: { images: true } },
          },
        },
      },
    });

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Sipariş güncellenemedi" },
        { status: 500 },
      );
    }

    const items = updatedOrder.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      title: item.title,
      qty: item.qty,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
      status: item.status,
      trackingCode: item.trackingCode,
      trackingCarrier: item.trackingCarrier,
      sellerNotes: item.sellerNotes ?? null,
      shippedAt: item.shippedAt ? item.shippedAt.toISOString() : null,
      deliveredAt: item.deliveredAt ? item.deliveredAt.toISOString() : null,
      image: parsePrimaryImage(item.product?.images ?? null),
    }));
    const totalForSeller = items.reduce((sum, item) => sum + item.subtotal, 0);

    return NextResponse.json({
      success: true,
      data: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        createdAt: updatedOrder.createdAt.toISOString(),
        customerName: updatedOrder.user?.name ?? null,
        customerEmail: updatedOrder.user?.email ?? null,
        total: totalForSeller,
        items,
      },
    });
  } catch (error) {
    console.error("Seller order status update error:", error);
    return NextResponse.json(
      { success: false, error: "Sipariş durumu güncellenemedi." },
      { status: 500 },
    );
  }
}

