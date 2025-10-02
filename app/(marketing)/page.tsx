import { Metadata } from 'next';
import Hero from '../../src/components/home/Hero';
import CategoryStrip from '../../src/components/home/CategoryStrip';
import CollectionStrip from '../../src/components/home/CollectionStrip';
import MixedProductGrid from '../../src/components/home/MixedProductGrid';
import { revalidateTag } from 'next/cache';
import ClientShim from './ClientShim';

export const metadata: Metadata = {
  title: 'TDC Market — Özel figürlerden elektroniğe, tasarımdan ev yaşamına',
  description: 'El yapımı & koleksiyon ürünlerinden moda ve teknolojiye; hepsi TDC Market\'te. Özel figürler, tasarım ürünleri ve daha fazlası.',
  keywords: ['TDC Market', 'özel figürler', 'koleksiyon', 'el yapımı', 'tasarım', 'elektronik', 'moda', 'ev yaşamı'],
  openGraph: {
    title: 'TDC Market — Özel figürlerden elektroniğe, tasarımdan ev yaşamına',
    description: 'El yapımı & koleksiyon ürünlerinden moda ve teknolojiye; hepsi TDC Market\'te.',
    type: 'website',
    locale: 'tr_TR',
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

// Revalidate every hour
export const revalidate = 3600;

export default async function HomePage() {
  // Revalidate tags for fresh data
  revalidateTag('home');
  revalidateTag('products');
  revalidateTag('blog');

  return (
    <main className="min-h-screen">
      <ClientShim />
      {/* Hero Section */}
      <Hero />
      
      {/* Category Strip */}
      <CategoryStrip />
      
      {/* Collection Strips */}
      <CollectionStrip />
      
      {/* Mixed Product Grid */}
      <MixedProductGrid />
    </main>
  );
}
