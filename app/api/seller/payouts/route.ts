import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSellerFinancialSnapshot } from "@/lib/seller-dashboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
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

    if (!sellerProfile) {
      return NextResponse.json(
        { success: false, error: "Seller profile not found" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status")?.trim()?.toLowerCase() ?? "all";
    const page = Math.max(Number.parseInt(searchParams.get("page") ?? "1", 10), 1);
    const pageSize = Math.min(
      Math.max(Number.parseInt(searchParams.get("pageSize") ?? "20", 10), 1),
      100,
    );
    const skip = (page - 1) * pageSize;

    const where: any = {
      sellerId: sellerProfile.id,
    };

    if (status !== "all") {
      where.status = status;
    }

    const [payouts, total, aggregates] = await prisma.$transaction([
      prisma.payout.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
        select: {
          id: true,
          amount: true,
          currency: true,
          status: true,
          meta: true,
          createdAt: true,
          processedAt: true,
        },
      }),
      prisma.payout.count({ where }),
      prisma.payout.groupBy({
        by: ["status"],
        _sum: { amount: true },
        where: { sellerId: sellerProfile.id },
      }),
    ]);

    const totalsByStatus = aggregates.reduce<Record<string, number>>((acc, current) => {
      acc[current.status] = current._sum.amount ?? 0;
      return acc;
    }, {});

    const financials = await getSellerFinancialSnapshot(sellerProfile.id);

    return NextResponse.json({
      success: true,
      data: payouts.map((payout) => ({
        id: payout.id,
        amount: payout.amount,
        currency: payout.currency,
        status: payout.status,
        meta: payout.meta,
        createdAt: payout.createdAt.toISOString(),
        processedAt: payout.processedAt ? payout.processedAt.toISOString() : null,
      })),
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        totalsByStatus,
        financials,
      },
    });
  } catch (error) {
    console.error("Seller payouts error:", error);
    return NextResponse.json(
      { success: false, error: "Ödeme kayıtları yüklenemedi." },
      { status: 500 },
    );
  }
}


