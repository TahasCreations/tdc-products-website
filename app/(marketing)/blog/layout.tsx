import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Blog — TDC Market',
    template: '%s — TDC Market Blog',
  },
  description: 'TDC Market blogunda en son trendler, ürün incelemeleri ve sektör haberleri.',
  keywords: ['blog', 'trend', 'inceleme', 'haber', 'TDC Market'],
  openGraph: {
    title: 'Blog — TDC Market',
    description: 'TDC Market blogunda en son trendler, ürün incelemeleri ve sektör haberleri.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://tdcmarket.com/blog',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
