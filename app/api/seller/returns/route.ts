import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/seller/returns
 * Satıcıya ait iade taleplerini listeler
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

    // Satıcı profilini bul
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: "Satıcı profili bulunamadı" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {
      sellerId: sellerProfile.id,
    };

    if (status) {
      where.status = status;
    }

    // İade taleplerini getir
    const [returnRequests, total] = await Promise.all([
      prisma.returnRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              total: true,
              createdAt: true,
            },
          },
          orderItem: {
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.returnRequest.count({ where }),
    ]);

    // İstatistikler
    const stats = await prisma.returnRequest.groupBy({
      by: ['status'],
      where: { sellerId: sellerProfile.id },
      _count: true,
    });

    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      success: true,
      returnRequests: returnRequests.map((rr) => ({
        id: rr.id,
        orderNumber: rr.order.orderNumber,
        customer: {
          id: rr.user.id,
          name: rr.user.name,
          email: rr.user.email,
        },
        product: rr.orderItem ? {
          id: rr.orderItem.productId,
          title: rr.orderItem.product?.title || rr.orderItem.title,
          quantity: rr.orderItem.qty,
          price: rr.orderItem.unitPrice,
          image: rr.orderItem.product?.images 
            ? (JSON.parse(rr.orderItem.product.images as string)?.[0] || null)
            : null,
        } : null,
        reason: rr.reason,
        description: rr.description,
        status: rr.status,
        refundAmount: rr.refundAmount,
        refundMethod: rr.refundMethod,
        trackingNumber: rr.trackingNumber,
        images: rr.images ? JSON.parse(rr.images) : [],
        adminNotes: rr.adminNotes,
        createdAt: rr.createdAt,
        processedAt: rr.processedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      stats: {
        pending: statusCounts['pending'] || 0,
        approved: statusCounts['approved'] || 0,
        processing: statusCounts['processing'] || 0,
        completed: statusCounts['completed'] || 0,
        rejected: statusCounts['rejected'] || 0,
        cancelled: statusCounts['cancelled'] || 0,
        total,
      },
    });

  } catch (error) {
    console.error('Satıcı iade talepleri getirme hatası:', error);
    return NextResponse.json(
      {
        error: "İade talepleri getirilemedi",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

