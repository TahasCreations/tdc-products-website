import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getSellerDashboardData } from '@/lib/seller-dashboard';
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

  let dashboardData;

  try {
    dashboardData = await getSellerDashboardData(user.id);
  } catch (error: any) {
    if (error?.message === 'SELLER_PROFILE_NOT_FOUND' && user.role !== 'ADMIN') {
      redirect('/seller/apply');
    }
    throw error;
  }

  const storeStatus = dashboardData.metrics.storeStatus?.toLowerCase() ?? 'approved';

  if (storeStatus === 'pending') {
    redirect('/partner/pending');
  }

  if (storeStatus === 'rejected') {
    redirect('/partner/rejected');
  }

  return <SellerDashboardContent data={dashboardData} />;
}


