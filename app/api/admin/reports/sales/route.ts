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
    const groupBy = searchParams.get('groupBy') || 'day'; // day, week, month

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get orders in date range
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
        status: { not: 'cancelled' },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                category: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Calculate metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Group by date
    const dailyData: Record<string, { revenue: number; orders: number }> = {};
    orders.forEach(order => {
      const dateKey = groupBy === 'day' 
        ? order.createdAt.toISOString().split('T')[0]
        : groupBy === 'week'
        ? `${order.createdAt.getFullYear()}-W${Math.ceil((order.createdAt.getTime() - new Date(order.createdAt.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`
        : `${order.createdAt.getFullYear()}-${String(order.createdAt.getMonth() + 1).padStart(2, '0')}`;
      
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { revenue: 0, orders: 0 };
      }
      dailyData[dateKey].revenue += order.total;
      dailyData[dateKey].orders += 1;
    });

    // Top products
    const productSales: Record<string, { title: string; category: string; quantity: number; revenue: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const key = item.productId;
        if (!productSales[key]) {
          productSales[key] = {
            title: item.product.title,
            category: item.product.category,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[key].quantity += item.qty;
        productSales[key].revenue += item.subtotal;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Payment method breakdown
    const paymentMethods: Record<string, { count: number; revenue: number }> = {};
    orders.forEach(order => {
      const method = order.paymentMethod || 'unknown';
      if (!paymentMethods[method]) {
        paymentMethods[method] = { count: 0, revenue: 0 };
      }
      paymentMethods[method].count += 1;
      paymentMethods[method].revenue += order.total;
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        dateRange: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      },
      dailyData: Object.entries(dailyData).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      })),
      topProducts,
      paymentMethods: Object.entries(paymentMethods).map(([method, data]) => ({
        method,
        count: data.count,
        revenue: data.revenue,
      })),
    });

  } catch (error) {
    console.error('Satış raporu hatası:', error);
    return NextResponse.json(
      {
        error: "Satış raporu oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



