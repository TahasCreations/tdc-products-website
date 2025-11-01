import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import SellerDashboardContent from '@/components/partner/seller/SellerDashboardContent';

export const dynamic = 'force-dynamic';

export default async function SellerDashboardPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/giris?redirect=/partner/seller/dashboard');
  }

  const user = session.user as any;
  
  if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
    redirect('/403');
  }

  // Get seller profile
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: user.id },
    include: {
      subscriptions: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  // Check if approved
  if (sellerProfile && sellerProfile.status === 'pending') {
    redirect('/partner/pending');
  }

  if (sellerProfile && sellerProfile.status === 'rejected') {
    redirect('/partner/rejected');
  }

  if (!sellerProfile && user.role !== 'ADMIN') {
    redirect('/seller/apply');
  }

  // Get dashboard data
  const [products, orders, totalRevenue] = await Promise.all([
    prisma.product.count({
      where: { sellerId: sellerProfile?.id },
    }),
    prisma.order.count({
      where: {
        items: {
          some: {
            product: {
              sellerId: sellerProfile?.id,
            },
          },
        },
      },
    }),
    prisma.order.aggregate({
      where: {
        items: {
          some: {
            product: {
              sellerId: sellerProfile?.id,
            },
          },
        },
        status: { in: ['COMPLETED', 'DELIVERED'] },
      },
      _sum: {
        total: true,
      },
    }),
  ]);

  const dashboardData = {
    products,
    orders,
    revenue: totalRevenue._sum.total || 0,
    plan: sellerProfile?.subscriptions[0]?.plan || 'FREE',
    storeName: sellerProfile?.storeName || user.name,
    rating: sellerProfile?.rating || 0,
  };

  return <SellerDashboardContent data={dashboardData} />;
}


