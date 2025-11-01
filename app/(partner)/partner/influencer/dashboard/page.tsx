import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import InfluencerDashboardContent from '@/components/partner/influencer/InfluencerDashboardContent';

export const dynamic = 'force-dynamic';

export default async function InfluencerDashboardPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/giris?redirect=/partner/influencer/dashboard');
  }

  const user = session.user as any;
  
  if (user.role !== 'INFLUENCER' && user.role !== 'ADMIN') {
    redirect('/403');
  }

  // Get influencer profile
  const influencerProfile = await prisma.influencerProfile.findUnique({
    where: { userId: user.id },
  });

  // Check if approved
  if (influencerProfile && influencerProfile.status === 'pending') {
    redirect('/partner/pending');
  }

  if (influencerProfile && influencerProfile.status === 'rejected') {
    redirect('/partner/rejected');
  }

  if (!influencerProfile && user.role !== 'ADMIN') {
    redirect('/influencer/apply');
  }

  // Get dashboard data
  const [collaborations, totalEarnings] = await Promise.all([
    prisma.collaboration.count({
      where: { influencerId: influencerProfile?.id },
    }),
    prisma.collaboration.aggregate({
      where: {
        influencerId: influencerProfile?.id,
        status: 'COMPLETED',
      },
      _sum: {
        commission: true,
      },
    }),
  ]);

  const dashboardData = {
    collaborations,
    earnings: totalEarnings._sum.commission || 0,
    followers: influencerProfile?.followersCount || 0,
    platform: influencerProfile?.platform || 'Instagram',
    name: user.name,
    rating: influencerProfile?.rating || 0,
  };

  return <InfluencerDashboardContent data={dashboardData} />;
}

