import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions as any) as any;
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get order items in date range
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: start, lte: end },
          status: { not: 'cancelled' },
        },
      },
      include: {
        product: {
          select: {
            title: true,
            category: true,
            price: true,
            stock: true,
          },
        },
        order: {
          select: {
            status: true,
            createdAt: true,
          },
        },
      },
    });

    // Aggregate by product
    const productStats: Record<string, {
      productId: string;
      title: string;
      category: string;
      totalSold: number;
      totalRevenue: number;
      averagePrice: number;
      currentStock: number;
      orderCount: number;
    }> = {};

    orderItems.forEach(item => {
      const key = item.productId;
      if (!productStats[key]) {
        productStats[key] = {
          productId: key,
          title: item.product.title,
          category: item.product.category,
          totalSold: 0,
          totalRevenue: 0,
          averagePrice: 0,
          currentStock: item.product.stock,
          orderCount: 0,
        };
      }
      productStats[key].totalSold += item.qty;
      productStats[key].totalRevenue += item.subtotal;
      productStats[key].orderCount += 1;
    });

    // Calculate averages
    Object.values(productStats).forEach(stat => {
      stat.averagePrice = stat.totalSold > 0 ? stat.totalRevenue / stat.totalSold : 0;
    });

    // Sort and limit
    const topProducts = Object.values(productStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);

    // Category breakdown
    const categoryStats: Record<string, { revenue: number; quantity: number; productCount: number }> = {};
    Object.values(productStats).forEach(stat => {
      if (!categoryStats[stat.category]) {
        categoryStats[stat.category] = { revenue: 0, quantity: 0, productCount: 0 };
      }
      categoryStats[stat.category].revenue += stat.totalRevenue;
      categoryStats[stat.category].quantity += stat.totalSold;
      categoryStats[stat.category].productCount += 1;
    });

    // Low stock products
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: { lte: 10 },
        stock: { gt: 0 },
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        category: true,
        stock: true,
        lowStockThreshold: true,
      },
      orderBy: { stock: 'asc' },
      take: 20,
    });

    // Out of stock products
    const outOfStockProducts = await prisma.product.findMany({
      where: {
        stock: 0,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        category: true,
        stock: true,
      },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      topProducts,
      categoryStats: Object.entries(categoryStats).map(([category, stats]) => ({
        category,
        ...stats,
      })),
      lowStockProducts,
      outOfStockProducts,
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    });

  } catch (error) {
    console.error('Ürün raporu hatası:', error);
    return NextResponse.json(
      {
        error: "Ürün raporu oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



