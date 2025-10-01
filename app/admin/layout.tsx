import { Metadata } from 'next';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

export const metadata: Metadata = {
  title: {
    default: 'Admin Panel — TDC Market',
    template: '%s — TDC Market Admin',
  },
  description: 'TDC Market admin paneli',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64">
          {children}
        </main>
      </div>
    </div>
  );
}
