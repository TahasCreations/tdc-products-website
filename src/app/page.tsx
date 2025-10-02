import type { Metadata } from 'next';
import MarketingHome from '@/components/home/MarketingHome';

export const metadata: Metadata = {
  title: 'TDC Market',
  description: 'Çok kategorili pazar yeri — TDC Market',
};

// Statik+ISR istiyorsan:
export const revalidate = 300;
// Tam dinamik istersen yukarıdaki yerine:
// export const dynamic = 'force-dynamic';

export default function Page() {
  return <MarketingHome />;
}