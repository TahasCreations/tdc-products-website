import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import InfluencerMarketplace from '@/components/partner/seller/InfluencerMarketplace';

export const dynamic = 'force-dynamic';

export default async function SellerInfluencersPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/giris?redirect=/partner/seller/influencers');
  }

  const user = session.user as any;
  
  if (user.role !== 'SELLER' && user.role !== 'ADMIN') {
    redirect('/403');
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Influencer Marketplace
        </h1>
        <p className="text-gray-600">
          İş birliği yapmak istediğiniz influencer'ları keşfedin ve teklif gönderin
        </p>
      </div>

      <InfluencerMarketplace userId={user.id} />
    </div>
  );
}


