import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    // TODO: Add proper authentication check
    
    // Fetch real data from database
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      orderStats,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.sellerProfile.count({
        where: { applicationStatus: 'pending' },
      }),
      prisma.sellerProfile.count({
        where: { applicationStatus: 'approved' },
      }),
      prisma.sellerProfile.count({
        where: { applicationStatus: 'rejected' },
      }),
    ]);

    const totalRevenue = orderStats._sum.totalAmount || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'İstatistikler yüklenirken hata oluştu',
        stats: {
          totalUsers: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0,
          pendingApplications: 0,
          approvedApplications: 0,
          rejectedApplications: 0,
        },
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

