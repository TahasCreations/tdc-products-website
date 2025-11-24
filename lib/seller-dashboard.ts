import { prisma } from "@/lib/prisma";

type Nullable<T> = T | null | undefined;

function parsePrimaryImage(images: Nullable<string>): string | null {
  if (!images) {
    return null;
  }

  try {
    const parsed = JSON.parse(images);
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
      return parsed[0];
    }
  } catch {
    // ignore JSON parse errors
  }

  return null;
}

export interface SellerDashboardMetrics {
  productCount: number;
  activeProductCount: number;
  lowStockCount: number;
  orderCount: number;
  deliveredOrderCount: number;
  revenueTotal: number;
  revenueDelivered: number;
  pendingPayoutAmount: number;
  paidPayoutAmount: number;
  availableBalance: number;
  plan: string;
  storeName: string;
  storeStatus: string;
  rating: number;
}

export interface SellerFinancialSnapshot {
  revenueTotal: number;
  revenueDelivered: number;
  pendingPayoutAmount: number;
  paidPayoutAmount: number;
  availableBalance: number;
}

export interface SellerDashboardOrderItem {
  id: string;
  productId: string;
  title: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  image: string | null;
  status: string;
  trackingCode: string | null;
  trackingCarrier: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
}

export interface SellerDashboardOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
  items: SellerDashboardOrderItem[];
}

export interface SellerDashboardLowStockProduct {
  id: string;
  title: string;
  stock: number;
  isActive: boolean;
  productType: string;
  image: string | null;
  price: number;
}

export interface SellerDashboardPayout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  processedAt: string | null;
}

export interface SellerDashboardData {
  metrics: SellerDashboardMetrics;
  recentOrders: SellerDashboardOrder[];
  lowStock: SellerDashboardLowStockProduct[];
  payouts: SellerDashboardPayout[];
}

export async function getSellerFinancialSnapshot(sellerId: string): Promise<SellerFinancialSnapshot> {
  const [revenueAll, revenueDelivered, payoutPending, payoutPaid] = await Promise.all([
    prisma.orderItem.aggregate({
      where: { sellerId },
      _sum: { subtotal: true },
    }),
    prisma.orderItem.aggregate({
      where: {
        sellerId,
        order: {
          status: { in: ["delivered", "DELIVERED", "completed", "COMPLETED"] },
        },
      },
      _sum: { subtotal: true },
    }),
    prisma.payout.aggregate({
      where: {
        sellerId,
        status: { in: ["scheduled", "processing"] },
      },
      _sum: { amount: true },
    }),
    prisma.payout.aggregate({
      where: {
        sellerId,
        status: { in: ["paid"] },
      },
      _sum: { amount: true },
    }),
  ]);

  const revenueTotal = revenueAll._sum.subtotal ?? 0;
  const revenueDeliveredTotal = revenueDelivered._sum.subtotal ?? 0;
  const pendingPayoutAmount = payoutPending._sum.amount ?? 0;
  const paidPayoutAmount = payoutPaid._sum.amount ?? 0;
  const availableBalance = Math.max(revenueDeliveredTotal - paidPayoutAmount - pendingPayoutAmount, 0);

  return {
    revenueTotal,
    revenueDelivered: revenueDeliveredTotal,
    pendingPayoutAmount,
    paidPayoutAmount,
    availableBalance,
  };
}

export async function getSellerDashboardData(userId: string): Promise<SellerDashboardData> {
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId },
    include: {
      subscriptions: {
        where: { status: "active", periodEnd: { gte: new Date() } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!sellerProfile) {
    throw new Error("SELLER_PROFILE_NOT_FOUND");
  }

  const sellerId = sellerProfile.id;
  const plan = sellerProfile.subscriptions[0]?.plan ?? "FREE";

  const [
    productCount,
    activeProductCount,
    lowStockProductsRaw,
    ordersRaw,
    orderCount,
    deliveredOrderCount,
    financials,
  ] = await Promise.all([
    prisma.product.count({ where: { sellerId } }),
    prisma.product.count({ where: { sellerId, isActive: true } }),
    prisma.product.findMany({
      where: {
        sellerId,
        stock: { lte: 5, gte: 0 },
        isActive: true,
      },
      orderBy: { stock: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        stock: true,
        isActive: true,
        productType: true,
        images: true,
        price: true,
      },
    }),
    prisma.order.findMany({
      where: {
        items: {
          some: {
            sellerId,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          where: { sellerId },
          select: {
            id: true,
            productId: true,
            title: true,
            qty: true,
            unitPrice: true,
            subtotal: true,
            product: {
              select: {
                images: true,
              },
            },
            status: true,
            trackingCode: true,
            trackingCarrier: true,
            shippedAt: true,
            deliveredAt: true,
          },
        },
      },
    }),
    prisma.order.count({
      where: {
        items: {
          some: {
            sellerId,
          },
        },
      },
    }),
    prisma.order.count({
      where: {
        items: {
          some: {
            sellerId,
          },
        },
        status: { in: ["delivered", "DELIVERED", "completed", "COMPLETED"] },
      },
    }),
    getSellerFinancialSnapshot(sellerId),
  ]);

  const lowStock = lowStockProductsRaw.map((product) => ({
    id: product.id,
    title: product.title,
    stock: product.stock,
    isActive: product.isActive,
    productType: product.productType,
    image: parsePrimaryImage(product.images),
    price: product.price,
  }));

  const recentOrders = ordersRaw.map((order) => {
    const items = order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      title: item.title,
      qty: item.qty,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal,
      image: parsePrimaryImage(item.product?.images ?? null),
      status: item.status,
      trackingCode: item.trackingCode ?? null,
      trackingCarrier: item.trackingCarrier ?? null,
      shippedAt: item.shippedAt ? item.shippedAt.toISOString() : null,
      deliveredAt: item.deliveredAt ? item.deliveredAt.toISOString() : null,
    }));

    const totalForSeller = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: totalForSeller,
      createdAt: order.createdAt.toISOString(),
      customerName: order.user?.name ?? null,
      customerEmail: order.user?.email ?? null,
      items,
    };
  });

  const payoutsRaw = await prisma.payout.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      amount: true,
      currency: true,
      status: true,
      createdAt: true,
      processedAt: true,
    },
  });

  const payouts = payoutsRaw.map((payout) => ({
    id: payout.id,
    amount: payout.amount,
    currency: payout.currency,
    status: payout.status,
    createdAt: payout.createdAt.toISOString(),
    processedAt: payout.processedAt ? payout.processedAt.toISOString() : null,
  }));

  return {
    metrics: {
      productCount,
      activeProductCount,
      lowStockCount: lowStockProductsRaw.length,
      orderCount,
      deliveredOrderCount,
      revenueTotal: financials.revenueTotal,
      revenueDelivered: financials.revenueDelivered,
      pendingPayoutAmount: financials.pendingPayoutAmount,
      paidPayoutAmount: financials.paidPayoutAmount,
      availableBalance: financials.availableBalance,
      plan,
      storeName: sellerProfile.storeName ?? "Mağazam",
      storeStatus: sellerProfile.status ?? "approved",
      rating: sellerProfile.rating ?? 0,
    },
    recentOrders,
    lowStock,
    payouts,
  };
}


