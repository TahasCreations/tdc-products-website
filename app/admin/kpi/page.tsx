import { Metadata } from 'next';
import KPIDashboard from '../../../components/admin/KPIDashboard';
import { requireAuth } from '@/lib/auth/middleware';
import { Permission } from '@/lib/rbac/permissions';

export const metadata: Metadata = {
  title: 'KPI Dashboard — TDC Market Admin',
  description: 'TDC Market KPI ve analitik dashboard',
  robots: 'noindex, nofollow',
};

export default function KPIPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            KPI Dashboard
          </h1>
          <p className="text-gray-600">
            TDC Market performans metrikleri ve analitik veriler
          </p>
        </div>

        <KPIDashboard />
      </div>
    </div>
  );
}
