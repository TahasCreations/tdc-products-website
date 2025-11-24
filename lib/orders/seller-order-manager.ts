/**
 * Seller Order Manager
 * 
 * Çok satıcılı sistemde siparişleri satıcılara böler ve SellerOrder (sub-order) oluşturur
 */

import { prisma } from "@/lib/prisma";

// SellerType enum (temporary - should be imported from domain package)
enum SellerType {
  TYPE_A = 'TYPE_A', // Company with tax number - 7% + KDV commission
  TYPE_B = 'TYPE_B', // Individual/IG seller - 10% + KDV commission
}

// Commission calculation (simplified - should use domain service)
function calculateCommission(orderAmount: number, sellerType: SellerType) {
  const baseRate = sellerType === SellerType.TYPE_A ? 0.07 : 0.10;
  const taxRate = 0.18;
  const commissionAmount = orderAmount * baseRate;
  const taxAmount = commissionAmount * taxRate;
  const totalCommission = commissionAmount + taxAmount;
  const sellerAmount = orderAmount - totalCommission;

  return {
    commissionRate: baseRate,
    commissionAmount,
    taxAmount,
    totalCommission,
    sellerAmount,
  };
}

export interface CreateSellerOrdersInput {
  orderId: string;
  orderItems: Array<{
    id: string;
    sellerId: string;
    subtotal: number;
  }>;
}

export interface SellerOrderResult {
  sellerId: string;
  sellerOrderId: string;
  total: number;
  commission: number;
  payoutAmount: number;
}

/**
 * Bir siparişi satıcılara böl ve SellerOrder'lar oluştur
 */
export async function createSellerOrders(
  input: CreateSellerOrdersInput
): Promise<SellerOrderResult[]> {
  const { orderId, orderItems } = input;

  // Satıcılara göre grupla
  const sellerGroups = new Map<string, Array<{ id: string; subtotal: number }>>();

  for (const item of orderItems) {
    if (!sellerGroups.has(item.sellerId)) {
      sellerGroups.set(item.sellerId, []);
    }
    sellerGroups.get(item.sellerId)!.push({ id: item.id, subtotal: item.subtotal });
  }

  const results: SellerOrderResult[] = [];

  // Her satıcı için SellerOrder oluştur
  for (const [sellerId, items] of sellerGroups.entries()) {
    // Satıcı bilgilerini getir
    const seller = await prisma.sellerProfile.findUnique({
      where: { id: sellerId },
      select: { id: true, taxNumber: true },
    });

    if (!seller) {
      console.error(`Seller ${sellerId} not found, skipping`);
      continue;
    }

    // Bu satıcının toplam tutarını hesapla
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    // Satıcı tipini belirle (TYPE_A: şirket, TYPE_B: bireysel)
    // Şimdilik varsayılan olarak TYPE_B kullanıyoruz
    // Gerçek uygulamada SellerProfile'da sellerType field'ı olmalı
    const sellerType: SellerType = seller.taxNumber ? SellerType.TYPE_A : SellerType.TYPE_B;

    // Komisyon hesapla
    const commissionResult = calculateCommission({
      orderAmount: total,
      sellerType,
    });

    // SellerOrder oluştur
    const sellerOrder = await prisma.sellerOrder.create({
      data: {
        orderId,
        sellerId,
        total,
        commission: commissionResult.totalCommission,
        commissionRate: commissionResult.commissionRate,
        payoutAmount: commissionResult.sellerAmount,
        status: 'pending',
      },
    });

    results.push({
      sellerId,
      sellerOrderId: sellerOrder.id,
      total,
      commission: commissionResult.totalCommission,
      payoutAmount: commissionResult.sellerAmount,
    });
  }

  return results;
}

/**
 * Bir sipariş için mevcut SellerOrder'ları getir
 */
export async function getSellerOrdersByOrderId(orderId: string) {
  return prisma.sellerOrder.findMany({
    where: { orderId },
    include: {
      seller: {
        select: {
          id: true,
          storeName: true,
          storeSlug: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

/**
 * Bir satıcı için SellerOrder'ları getir
 */
export async function getSellerOrdersBySellerId(
  sellerId: string,
  filters?: {
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  return prisma.sellerOrder.findMany({
    where: {
      sellerId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.startDate && filters?.endDate && {
        createdAt: {
          gte: filters.startDate,
          lte: filters.endDate,
        },
      }),
    },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * SellerOrder durumunu güncelle
 */
export async function updateSellerOrderStatus(
  sellerOrderId: string,
  status: string,
  data?: {
    trackingNumber?: string;
    notes?: string;
  }
) {
  const updateData: any = {
    status,
    ...(data?.trackingNumber && { trackingNumber: data.trackingNumber }),
    ...(data?.notes && { notes: data.notes }),
  };

  if (status === 'shipped') {
    updateData.shippedAt = new Date();
  } else if (status === 'delivered') {
    updateData.deliveredAt = new Date();
  }

  return prisma.sellerOrder.update({
    where: { id: sellerOrderId },
    data: updateData,
  });
}

