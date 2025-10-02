import type { Metadata } from 'next';
import MarketingHome from '@/components/home/MarketingHome';

export const metadata: Metadata = {
  title: 'TDC Market',
  description: 'Çok kategorili pazar yeri — TDC Market',
};

// Dinamik olsun (client component var)
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return <MarketingHome />;
}