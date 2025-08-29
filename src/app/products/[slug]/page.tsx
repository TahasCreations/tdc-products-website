import Image from "next/image";
import Link from "next/link";
import { headers } from 'next/headers';
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "../../../../AddToCartButton";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-error-warning-line text-4xl text-red-500"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
          <p className="text-gray-600 mb-8">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <i className="ri-arrow-left-line"></i>
            Ürünlere Geri Dön
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

  // Stok durumunu belirle
  const getStockStatus = (stock: number) => {
    if (stock > 10) return { status: 'Stokta', color: 'text-green-600', bg: 'bg-green-100' };
    if (stock > 0) return { status: 'Son ' + stock + ' adet', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Stokta yok', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const stockInfo = getStockStatus(product.stock);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Ana Sayfa
            </Link>
            <i className="ri-arrow-right-s-line"></i>
            <Link href="/products" className="hover:text-orange-500 transition-colors">
              Ürünler
            </Link>
            <i className="ri-arrow-right-s-line"></i>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Product Images */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <ProductGallery 
                  images={Array.isArray((product as any).images) && (product as any).images.length > 0 ? (product as any).images : [product.image]} 
                  alt={product.title} 
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Category Badge */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <i className="ri-price-tag-3-line mr-1"></i>
                  {product.category}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${stockInfo.bg} ${stockInfo.color}`}>
                  <i className="ri-store-2-line mr-1"></i>
                  {stockInfo.status}
                </span>
              </div>

              {/* Product Title */}
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                  {product.title}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-orange-600">
                    ₺{product.price.toLocaleString('tr-TR')}
                  </div>
                  {product.stock > 0 && (
                    <div className="text-sm text-gray-500">
                      <i className="ri-shipping-line mr-1"></i>
                      Ücretsiz kargo
                    </div>
                  )}
                </div>
              </div>

              {/* Product Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Variations */}
              {product.variations && product.variations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Varyasyonlar</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.variations.map((variation: string, index: number) => (
                      <button
                        key={index}
                        className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-orange-500 hover:text-orange-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                      >
                        {variation}
                      </button>
                    ))}
                  </div>
                </div>
              )}

                             {/* Action Buttons */}
               <div className="space-y-4">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <div className="h-14">
                     <AddToCartButton 
                       product={{
                         id: product.id,
                         title: product.title,
                         price: product.price,
                         image: product.image,
                         slug: product.slug,
                         category: product.category,
                         stock: product.stock
                       }}
                     />
                   </div>
                   
                   <button className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                     <i className="ri-flashlight-line text-xl"></i>
                     Hızlı Al
                   </button>
                 </div>
                
                <Link 
                  href="/products"
                  className="w-full h-14 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <i className="ri-arrow-left-line"></i>
                  Diğer Ürünleri Gör
                </Link>
              </div>

              {/* Product Features */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Özellikler</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <i className="ri-shield-check-line text-green-600"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Güvenli Ödeme</div>
                      <div className="text-sm text-gray-500">256-bit SSL koruması</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-truck-line text-blue-600"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Hızlı Teslimat</div>
                      <div className="text-sm text-gray-500">1-3 iş günü</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <i className="ri-refund-2-line text-purple-600"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Kolay İade</div>
                      <div className="text-sm text-gray-500">14 gün içinde</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <i className="ri-customer-service-2-line text-orange-600"></i>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">7/24 Destek</div>
                      <div className="text-sm text-gray-500">WhatsApp & Email</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Benzer Ürünler</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Bu ürünle birlikte alabileceğiniz diğer harika ürünlerimizi keşfedin
              </p>
            </div>
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
  
  if (list.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-inbox-line text-2xl text-gray-400"></i>
        </div>
        <p className="text-gray-500">Henüz benzer ürün bulunmuyor</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {list.map((p: any) => (
        <Link 
          key={p.id} 
          href={`/products/${p.slug}`}
          className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200"
        >
          <div className="relative overflow-hidden">
            <Image 
              src={p.image} 
              alt={p.title} 
              width={300} 
              height={200} 
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2">
              {p.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-orange-600">₺{p.price.toLocaleString('tr-TR')}</span>
              <span className="text-sm text-gray-500">{p.category}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
