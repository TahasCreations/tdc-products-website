import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Satıcı Paneli - TDC Market',
  description: 'Mağazanızı yönetin, ürünlerinizi ekleyin, siparişlerinizi takip edin',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is a seller or admin
  if (!session?.user) {
    redirect('/giris?redirect=/seller');
  }

  const userRole = (session.user as any).role;
  if (userRole !== 'SELLER' && userRole !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}

