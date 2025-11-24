import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSellerOrdersBySellerId } from "@/lib/orders/seller-order-manager";

/**
 * GET /api/seller/orders
 * Satıcıya ait sub-orders (SellerOrder) listesini getirir
 */
export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (status) filters.status = status;
    if (startDate && endDate) {
      filters.startDate = new Date(startDate);
      filters.endDate = new Date(endDate);
    }

    // SellerOrder'ları getir
    const sellerOrders = await prisma.sellerOrder.findMany({
      where: {
        sellerId: sellerProfile.id,
        ...(status && { status }),
        ...(startDate && endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
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
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    const total = await prisma.sellerOrder.count({
      where: {
        sellerId: sellerProfile.id,
        ...(status && { status }),
        ...(startDate && endDate && {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
      },
    });

    // İstatistikler
    const stats = await prisma.sellerOrder.groupBy({
      by: ['status'],
      where: { sellerId: sellerProfile.id },
      _count: true,
      _sum: {
        total: true,
        payoutAmount: true,
        commission: true,
      },
    });

    const statusStats = stats.reduce((acc, stat) => {
      acc[stat.status] = {
        count: stat._count,
        total: stat._sum.total || 0,
        payoutAmount: stat._sum.payoutAmount || 0,
        commission: stat._sum.commission || 0,
      };
      return acc;
    }, {} as Record<string, any>);

    // Toplam istatistikler
    const totalStats = await prisma.sellerOrder.aggregate({
      where: { sellerId: sellerProfile.id },
      _sum: {
        total: true,
        payoutAmount: true,
        commission: true,
      },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      orders: sellerOrders.map((so) => ({
        id: so.id,
        orderId: so.orderId,
        orderNumber: so.order.orderNumber,
        status: so.status,
        total: so.total,
        commission: so.commission,
        commissionRate: so.commissionRate,
        payoutAmount: so.payoutAmount,
        trackingNumber: so.trackingNumber,
        notes: so.notes,
        customer: so.order.user ? {
          id: so.order.user.id,
          name: so.order.user.name,
          email: so.order.user.email,
          phone: so.order.user.phone,
        } : null,
        items: so.order.items.map((item) => ({
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
        paidAt: so.paidAt?.toISOString(),
        shippedAt: so.shippedAt?.toISOString(),
        deliveredAt: so.deliveredAt?.toISOString(),
        createdAt: so.createdAt.toISOString(),
        updatedAt: so.updatedAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        byStatus: statusStats,
        total: {
          orders: totalStats._count,
          totalRevenue: totalStats._sum.total || 0,
          totalPayout: totalStats._sum.payoutAmount || 0,
          totalCommission: totalStats._sum.commission || 0,
        },
      },
    });

  } catch (error) {
    console.error('Satıcı siparişleri getirme hatası:', error);
    return NextResponse.json(
      {
        error: "Siparişler getirilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
