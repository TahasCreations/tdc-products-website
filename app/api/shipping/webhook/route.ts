import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getShippingManager } from "@/lib/shipping/shipping-manager";
import { sendOrderShipped, sendOrderDelivered } from "@/src/lib/email";

/**
 * Kargo Webhook Handler
 * 
 * Kargo firmalarından gelen webhook'ları işler
 * - Kargo durumu güncellemeleri
 * - Teslimat bildirimleri
 * - İstisna durumları
 */

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { carrier, event, trackingNumber, status, data } = body;

    if (!carrier || !event || !trackingNumber) {
      return NextResponse.json(
        { error: "Geçersiz webhook verisi" },
        { status: 400 }
      );
    }

    // Webhook'u kaydet
    await prisma.webhookEvent.create({
      data: {
        provider: `shipping_${carrier.toLowerCase()}`,
        type: event,
        payload: body,
        processed: false,
      },
    });

    // Tracking number'a göre order item'ı bul
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        trackingCode: trackingNumber,
        trackingCarrier: carrier.toUpperCase(),
      },
      include: {
        order: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    if (!orderItem) {
      console.warn(`Order item bulunamadı: ${trackingNumber}`);
      return NextResponse.json({ success: true, message: "Order item bulunamadı" });
    }

    // Event tipine göre işlem yap
    switch (event) {
      case 'shipment_created':
      case 'picked_up':
        // Kargo alındı
        await prisma.orderItem.update({
          where: { id: orderItem.id },
          data: {
            status: 'shipped',
            shippedAt: new Date(),
          },
        });
        break;

      case 'in_transit':
      case 'out_for_delivery':
        // Kargoda
        await prisma.orderItem.update({
          where: { id: orderItem.id },
          data: {
            status: 'shipped',
          },
        });
        break;

      case 'delivered':
        // Teslim edildi
        await prisma.orderItem.update({
          where: { id: orderItem.id },
          data: {
            status: 'delivered',
            deliveredAt: new Date(),
          },
        });

        // Order durumunu kontrol et
        const allItems = await prisma.orderItem.findMany({
          where: { orderId: orderItem.orderId },
          select: { status: true },
        });

        if (allItems.every(item => item.status === 'delivered')) {
          await prisma.order.update({
            where: { id: orderItem.orderId },
            data: { status: 'delivered' },
          });

          // Teslimat email'i gönder
          if (orderItem.order.user?.email) {
            try {
              const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
              await sendOrderDelivered(orderItem.order.user.email, {
                customerName: orderItem.order.user.name || "Değerli Müşteri",
                orderNumber: orderItem.order.orderNumber,
                reviewUrl: `${baseUrl}/orders/${orderItem.order.orderNumber}`,
              });
            } catch (emailError) {
              console.error("Teslimat email gönderim hatası:", emailError);
            }
          }
        }
        break;

      case 'exception':
      case 'returned':
        // İstisna durumu veya iade
        await prisma.orderItem.update({
          where: { id: orderItem.id },
          data: {
            status: 'cancelled',
          },
        });
        break;
    }

    // Webhook'u işaretle
    await prisma.webhookEvent.updateMany({
      where: {
        provider: `shipping_${carrier.toLowerCase()}`,
        type: event,
        processed: false,
      },
      data: {
        processed: true,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Kargo webhook hatası:', error);
    return NextResponse.json(
      {
        error: "Webhook işlenemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



