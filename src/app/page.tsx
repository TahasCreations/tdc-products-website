import type { Metadata } from 'next';
import MarketingHome from './(marketing)/page';

export const metadata: Metadata = {
  title: 'TDC Market',
  description: 'Çok kategorili pazar yeri — TDC Market',
};

// İsteğe göre: tamamen dinamikse aşağıdakini kullan
// export const dynamic = 'force-dynamic';
// veya kısmi statik + ISR istiyorsan:
export const revalidate = 300; // 5 dk

export default function Page() {
  return <MarketingHome />;
}