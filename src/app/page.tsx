import type { Metadata } from 'next';
import MarketingHome from '@/components/home/MarketingHome';

export const metadata: Metadata = {
  title: 'TDC Market',
  description: 'Çok kategorili pazar yeri — TDC Market',
};

// Tam statik olsun
export const dynamic = 'force-static';

export default function HomePage() {
  return <MarketingHome />;
}