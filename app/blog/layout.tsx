import { Metadata } from 'next';
import Header from '../../src/components/Header';
import Footer from '../../src/components/Footer';
import { ThemeProvider } from '../../src/contexts/ThemeContext';

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
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
