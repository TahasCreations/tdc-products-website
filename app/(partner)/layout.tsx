import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import PartnerDashboardLayout from '@/components/partner/PartnerDashboardLayout';

export default async function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // Require authentication
  if (!session || !session.user) {
    redirect('/giris?redirect=/partner');
  }

  const user = session.user as any;
  const role = user.role;

  // Only SELLER, INFLUENCER, and ADMIN can access
  if (!['SELLER', 'INFLUENCER', 'ADMIN'].includes(role)) {
    redirect('/403');
  }

  return (
    <PartnerDashboardLayout user={user} role={role}>
      {children}
    </PartnerDashboardLayout>
  );
}


