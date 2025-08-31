import Image from "next/image";
import Link from "next/link";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "../../../../AddToCartButton";
import { notFound } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { PageLoader } from '../../../components/LoadingSpinner';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  
  try {
    // Supabase'den direkt veri çek
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error || !product) {
      console.error('Product not found for metadata:', slug);
      return {
        title: 'Ürün Detayı | TDC Products',
        description: 'Premium kalitede figürler ve koleksiyon ürünleri',
      };
    }
    
    return {
      title: `${product.title} | TDC Products`,
      description: product.description?.slice(0, 160) || 'Premium kalitede figürler ve koleksiyon ürünleri',
      openGraph: {
        title: `${product.title} | TDC Products`,
        description: product.description,
        images: product.image ? [product.image] : [],
        type: 'product',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.title} | TDC Products`,
        description: product.description,
        images: product.image ? [product.image] : [],
      }
    };
  } catch (error) {
    console.error('Metadata generation error:', error);
    return {
      title: 'Ürün Detayı | TDC Products',
      description: 'Premium kalitede figürler ve koleksiyon ürünleri',
    };
  }
}

// Supabase'den tek ürünü getir
async function getProductBySlug(slug: string) {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return null;
    }
    
    if (!product) {
      console.error('Product not found:', slug);
      return null;
    }
    
    return product;
  } catch (error) {
    console.error('Ürün yüklenirken hata:', error);
    return null;
  }
}

// Benzer ürünleri getir
async function getSimilarProducts(currentSlug: string, category: string) {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('slug', currentSlug)
      .eq('status', 'active')
      .limit(4);
    
    if (error) {
      console.error('Similar products error:', error);
      return [];
    }
    
    return products || [];
  } catch (error) {
    console.error('Benzer ürünler yüklenirken hata:', error);
    return [];
  }
}

export default async function ProductDetailPage({ params }: Props) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      console.error('No slug provided');
      notFound();
    }
    
    const product = await getProductBySlug(slug);
    
    if (!product) {
      console.error('Product not found for slug:', slug);
      notFound();
    }

    // Loading durumu kontrolü
    if (!product) {
      return <PageLoader text="Ürün detayları yükleniyor..." />;
    }

    const similarProducts = await getSimilarProducts(product.slug, product.category);

    // Stok durumunu belirle
    const getStockStatus = (stock: number) => {
      if (stock > 10) return { 
        status: 'Stokta', 
        color: 'text-green-600', 
        bg: 'bg-green-100',
        icon: 'ri-check-line'
      };
      if (stock > 0) return { 
        status: `Son ${stock} adet`, 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-100',
        icon: 'ri-time-line'
      };
      return { 
        status: 'Stokta yok', 
        color: 'text-red-600', 
        bg: 'bg-red-100',
        icon: 'ri-close-line'
      };
    };

    const stockInfo = getStockStatus(product.stock);

    // Structured Data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.description,
      image: product.image,
      category: product.category,
      brand: {
        "@type": "Brand",
        name: "TDC Products"
      },
      offers: {
        "@type": "Offer",
        price: product.price,
        priceCurrency: "TRY",
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "TDC Products"
        }
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "127"
      }
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          {/* Hero Section */}
          <section className="relative py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex items-center space-x-2 text-sm text-white/80 mb-8">
                <Link href="/" className="hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
                <i className="ri-arrow-right-s-line"></i>
                <Link href="/products" className="hover:text-white transition-colors">
                  Ürünler
                </Link>
                <i className="ri-arrow-right-s-line"></i>
                <span className="text-white font-medium">{product.title}</span>
              </nav>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Product Images */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  <ProductGallery 
                    images={Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image]} 
                    alt={product.title} 
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                {/* Category and Stock Badges */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                    <i className="ri-price-tag-3-line mr-2"></i>
                    {product.category}
                  </span>
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${stockInfo.bg} ${stockInfo.color} shadow-lg`}>
                    <i className={`${stockInfo.icon} mr-2`}></i>
                    {stockInfo.status}
                  </span>
                </div>

                {/* Product Title */}
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                    {product.title}
                  </h1>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      ₺{product.price.toLocaleString('tr-TR')}
                    </div>
                    {product.stock > 0 && (
                      <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
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
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 space-y-4">
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
            {similarProducts.length > 0 && (
              <div className="mt-20">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Benzer Ürünler</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Bu ürünle birlikte alabileceğiniz diğer harika ürünlerimizi keşfedin
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {similarProducts.map((p: any) => (
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
              </div>
            )}
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Product detail page error:', error);
    notFound();
  }
}
