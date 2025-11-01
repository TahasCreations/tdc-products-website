import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CampaignCreateForm from '@/components/partner/influencer/CampaignCreateForm';

export const dynamic = 'force-dynamic';

export default async function CreateCampaignPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/giris?redirect=/partner/influencer/campaigns/create');
  }

  const user = session.user as any;
  
  if (user.role !== 'INFLUENCER' && user.role !== 'ADMIN') {
    redirect('/403');
  }

  // Get influencer profile
  const influencerProfile = await prisma.influencerProfile.findUnique({
    where: { userId: user.id },
  });

  if (!influencerProfile && user.role !== 'ADMIN') {
    redirect('/influencer/apply');
  }

  if (influencerProfile?.status !== 'approved' && user.role !== 'ADMIN') {
    redirect('/partner/pending');
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Kampanya İlanı Oluştur
        </h1>
        <p className="text-gray-600">
          Satıcılarla iş birliği yapmak için kampanya ilanınızı oluşturun
        </p>
      </div>

      <CampaignCreateForm 
        influencerId={influencerProfile?.id || ''} 
        influencerData={{
          platform: influencerProfile?.platform || 'Instagram',
          followersCount: influencerProfile?.followersCount || 0,
          engagementRate: influencerProfile?.engagementRate || 0,
        }}
      />
    </div>
  );
}


