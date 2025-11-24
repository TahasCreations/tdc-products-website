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

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get all financial data
    const [orders, payouts, refunds, coupons] = await Promise.all([
      // Orders
      prisma.order.findMany({
        where: {
          createdAt: { gte: start, lte: end },
          status: { not: 'cancelled' },
        },
        select: {
          total: true,
          status: true,
          paymentMethod: true,
          createdAt: true,
        },
      }),
      // Payouts
      prisma.payout.findMany({
        where: {
          createdAt: { gte: start, lte: end },
        },
        select: {
          amount: true,
          status: true,
          createdAt: true,
        },
      }),
      // Refunds (from return requests)
      prisma.returnRequest.findMany({
        where: {
          createdAt: { gte: start, lte: end },
          status: 'completed',
        },
        select: {
          refundAmount: true,
          refundMethod: true,
          createdAt: true,
        },
      }),
      // Coupon usage
      prisma.couponUsage.findMany({
        where: {
          usedAt: { gte: start, lte: end },
        },
        include: {
          coupon: {
            select: {
              type: true,
              discountValue: true,
            },
          },
        },
      }),
    ]);

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalPayouts = payouts
      .filter(p => p.status === 'paid')
      .reduce((sum, payout) => sum + payout.amount, 0);
    const totalRefunds = refunds.reduce((sum, refund) => sum + (refund.refundAmount || 0), 0);
    const totalDiscounts = coupons.reduce((sum, usage) => sum + usage.discountAmount, 0);
    const netRevenue = totalRevenue - totalRefunds - totalDiscounts;
    const profit = netRevenue - totalPayouts;

    // Revenue by payment method
    const revenueByMethod: Record<string, number> = {};
    orders.forEach(order => {
      const method = order.paymentMethod || 'unknown';
      revenueByMethod[method] = (revenueByMethod[method] || 0) + order.total;
    });

    // Daily breakdown
    const dailyBreakdown: Record<string, { revenue: number; payouts: number; refunds: number; discounts: number }> = {};
    
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!dailyBreakdown[date]) {
        dailyBreakdown[date] = { revenue: 0, payouts: 0, refunds: 0, discounts: 0 };
      }
      dailyBreakdown[date].revenue += order.total;
    });

    payouts.filter(p => p.status === 'paid').forEach(payout => {
      const date = payout.createdAt.toISOString().split('T')[0];
      if (!dailyBreakdown[date]) {
        dailyBreakdown[date] = { revenue: 0, payouts: 0, refunds: 0, discounts: 0 };
      }
      dailyBreakdown[date].payouts += payout.amount;
    });

    refunds.forEach(refund => {
      const date = refund.createdAt.toISOString().split('T')[0];
      if (!dailyBreakdown[date]) {
        dailyBreakdown[date] = { revenue: 0, payouts: 0, refunds: 0, discounts: 0 };
      }
      dailyBreakdown[date].refunds += refund.refundAmount || 0;
    });

    coupons.forEach(usage => {
      const date = usage.usedAt.toISOString().split('T')[0];
      if (!dailyBreakdown[date]) {
        dailyBreakdown[date] = { revenue: 0, payouts: 0, refunds: 0, discounts: 0 };
      }
      dailyBreakdown[date].discounts += usage.discountAmount;
    });

    return NextResponse.json({
      success: true,
      summary: {
        totalRevenue,
        totalPayouts,
        totalRefunds,
        totalDiscounts,
        netRevenue,
        profit,
        dateRange: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      },
      revenueByMethod: Object.entries(revenueByMethod).map(([method, amount]) => ({
        method,
        amount,
      })),
      dailyBreakdown: Object.entries(dailyBreakdown).map(([date, data]) => ({
        date,
        ...data,
        net: data.revenue - data.refunds - data.discounts,
      })),
    });

  } catch (error) {
    console.error('Finansal rapor hatası:', error);
    return NextResponse.json(
      {
        error: "Finansal rapor oluşturulamadı",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



