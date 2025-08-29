import Image from "next/image";
import Link from "next/link";
import { headers } from 'next/headers';
import ProductGallery from "@/components/ProductGallery";

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  // Best-effort fetch for SEO; ignore failures
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    const res = await fetch(`${baseUrl}/api/products?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (res.ok) {
      const product = await res.json();
      return {
        title: `${product.title} | TDC Products`,
        description: product.description?.slice(0, 160) || 'Ürün detayları',
        openGraph: {
          title: `${product.title} | TDC Products`,
          description: product.description,
          images: product.image ? [product.image] : [],
        }
      };
    }
  } catch {}
  return {
    title: 'Ürün Detayı | TDC Products',
    description: 'Ürün detay sayfası',
  };
}

// API'den tek ürünü getir
async function getProductBySlug(slug: string) {
  try {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const response = await fetch(`${baseUrl}/api/products?slug=${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 } // 60 saniye cache
    });
    
    if (!response.ok) {
      throw new Error('Ürün yüklenemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ürün yüklenirken hata:', error);
    return null;
  }
}

export function generateStaticParams() {
  // Demo statik ürünler kaldırıldı
  return [];
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün bulunamadı</h1>
          <Link href="/products" className="text-orange-600 hover:text-orange-700">
            ← Ürünlere geri dön
          </Link>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
        <div>
          <ProductGallery images={Array.isArray((product as any).images) && (product as any).images.length > 0 ? (product as any).images : [product.image]} alt={product.title} />
        </div>
        <div>
          <div className="text-xs text-gray-500">{product.category}</div>
          <h1 className="text-3xl font-bold mt-1">{product.title}</h1>
          <div className="text-2xl font-extrabold mt-3">₺{product.price}</div>
          <p className="text-gray-700 mt-4">{product.description}</p>
          <div className="mt-6 flex gap-3">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-lg">Sepete Ekle</button>
            <Link href="/products" className="px-5 py-3 rounded-lg border font-semibold">Diğer Ürünler</Link>
          </div>
          {/* Similar products */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Benzer Ürünler</h2>
            <SimilarProducts currentSlug={product.slug} baseUrl={baseUrl} />
          </div>
        </div>
      </div>
    </>
  );
}

async function fetchProducts(baseUrl: string) {
  const res = await fetch(`${baseUrl}/api/products`, { next: { revalidate: 60 } });
  if (!res.ok) return [] as any[];
  return res.json();
}

async function SimilarProducts({ currentSlug, baseUrl }: { currentSlug: string; baseUrl: string }) {
  const products = await fetchProducts(baseUrl);
  const list = (products || []).filter((p: any) => p.slug !== currentSlug).slice(0, 4);
  if (list.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-4">
      {list.map((p: any) => (
        <Link key={p.id} href={`/products/${p.slug}`} className="group flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition">
          <Image src={p.image} alt={p.title} width={64} height={64} className="w-16 h-16 rounded object-cover" />
          <div>
            <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">{p.title}</div>
            <div className="text-xs text-gray-500">₺{p.price}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
