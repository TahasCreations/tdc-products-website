import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import Hero from '../../src/components/home/Hero';
import CategoryStrip from '../../src/components/home/CategoryStrip';
import CollectionStrip from '../../src/components/home/CollectionStrip';
import MixedProductGrid from '../../src/components/home/MixedProductGrid';
// Note: Avoid revalidateTag in RSC to prevent runtime errors on home
import ClientShim from './ClientShim';
import nextDynamic from 'next/dynamic';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

// Dynamic page; do not schedule ISR here to avoid conflicts

export default async function HomePage() {
  // Get user session (guard errors to avoid 500s)
  let session: any = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }

  return (
    <main className="min-h-screen">
      <ClientShim />
      
      {/* Welcome Message for Authenticated Users */}
      {session?.user && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <img 
                src={session.user.image ?? ""} 
                alt={session.user.name ?? "User"} 
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm" 
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Merhaba, {session.user.name}!
                </h2>
                <p className="text-sm text-gray-600">
                  Hoş geldiniz! Size özel ürünleri keşfedin.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <Hero />
      
      {/* Category Strip */}
      <CategoryStrip />
      
      {/* Collection Strips */}
      <CollectionStrip />
      
      {/* Mixed Product Grid */}
      <MixedProductGrid />
      {/* Cart Drawer (client) */}
      {nextDynamic(() => import('../../src/components/cart/CartDrawer'), { ssr: false })({})}
    </main>
  );
}
