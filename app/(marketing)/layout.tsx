import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: {
    default: 'TDC Market — Özel figürlerden elektroniğe, tasarımdan ev yaşamına',
    template: '%s — TDC Market',
  },
  description: 'El yapımı & koleksiyon ürünlerinden moda ve teknolojiye; hepsi TDC Market\'te.',
  keywords: ['TDC Market', 'özel figürler', 'koleksiyon', 'el yapımı', 'tasarım', 'elektronik', 'moda', 'ev yaşamı'],
  openGraph: {
    title: 'TDC Market — Özel figürlerden elektroniğe, tasarımdan ev yaşamına',
    description: 'El yapımı & koleksiyon ürünlerinden moda ve teknolojiye; hepsi TDC Market\'te.',
    type: 'website',
    locale: 'tr_TR',
    siteName: 'TDC Market',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TDC Market — Özel figürlerden elektroniğe, tasarımdan ev yaşamına',
    description: 'El yapımı & koleksiyon ürünlerinden moda ve teknolojiye; hepsi TDC Market\'te.',
  },
  alternates: {
    canonical: 'https://tdcmarket.com',
  },
};

export default function MarketingLayout({
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
