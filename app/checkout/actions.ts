// /app/checkout/actions.ts
"use server";

import { PrismaClient } from "@prisma/client";
import { requireUser } from "@/lib/guards";

const prisma = new PrismaClient();

export async function createOrder(items: Array<{productId: string; qty: number;}>) {
  const user = await requireUser();

  // Ürünleri oku
  const products = await prisma.product.findMany({
    where: { id: { in: items.map(i => i.productId) } },
    include: { seller: true },
  });

  // Fiyat hesapla
  const itemRows = items.map((i) => {
    const p = products.find(x => x.id === i.productId)!;
    const subtotal = Number(p.price) * i.qty;
    return {
      productId: p.id,
      sellerId: p.sellerId,
      title: p.title,
      unitPrice: p.price,
      qty: i.qty,
      subtotal,
    };
  });

  const total = itemRows.reduce((a, b) => a + Number(b.subtotal), 0);

  // Order oluştur (ödeme başlamadan önce pending)
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      orderNumber: `TDC-${Date.now()}`,
      total,
      items: { create: itemRows },
      status: "pending",
    },
    include: { items: true },
  });

  // Burada ödeme sağlayıcıya (PayTR/iyzico) yönlendirme linki oluşturursun
  return order;
}

// Split payment için satıcı paylarını hesapla
export async function calculateSellerPayouts(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) throw new Error("Order not found");

  // Satıcı bazında grupla
  const sellerTotals = order.items.reduce((acc, item) => {
    if (!acc[item.sellerId]) {
      acc[item.sellerId] = 0;
    }
    acc[item.sellerId] += Number(item.subtotal);
    return acc;
  }, {} as Record<string, number>);

  // Her satıcı için payout oluştur
  const payouts = await Promise.all(
    Object.entries(sellerTotals).map(async ([sellerId, amount]) => {
      return await prisma.payout.create({
        data: {
          sellerId,
          amount,
          status: "scheduled",
        },
      });
    })
  );

  return payouts;
}

// Webhook: Ödeme başarılı
export async function handlePaymentSuccess(orderId: string, paymentRef: string) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "paid",
      paymentRef,
    },
    include: { items: { include: { product: true } } },
  });

  // Stok düşümü
  await Promise.all(
    order.items.map(async (item) => {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.qty,
          },
        },
      });
    })
  );

  // Satıcı paylarını oluştur
  await calculateSellerPayouts(orderId);

  return order;
}

// Webhook: Ödeme iptal
export async function handlePaymentCancelled(orderId: string) {
  return await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "cancelled",
    },
  });
}
