import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { gcsObjectPublicUrl } from '@/src/lib/gcs';

const mockProducts = {
  'naruto-uzumaki-figuru-shippuden': {
    id: '1',
    title: 'Naruto Uzumaki Figürü - Shippuden',
    price: 299.99,
    listPrice: 399.99,
    currency: 'TRY',
    rating: 4.8,
    reviewCount: 156,
    stock: 25,
    images: [
      'https://via.placeholder.com/600x600/FF6B6B/FFFFFF?text=Naruto+1',
      'https://via.placeholder.com/600x600/FF6B6B/FFFFFF?text=Naruto+2',
      'https://via.placeholder.com/600x600/FF6B6B/FFFFFF?text=Naruto+3'
    ],
    description: 'Naruto Uzumaki\'nin Shippuden serisindeki görünümünü yansıtan yüksek kaliteli PVC figürü. Detaylı yüz ifadeleri ve karakteristik pozları ile koleksiyonunuzun vazgeçilmez parçası.',
    features: [
      'Yüksek kaliteli PVC malzeme',
      'Detaylı yüz ifadeleri',
      'Karakteristik pozlar',
      'Koleksiyon standında sergileme',
      'Orijinal lisanslı ürün'
    ],
    seller: {
      name: 'AnimeWorld Store',
      slug: 'animeworld-store',
      rating: 4.8,
      logo: 'https://via.placeholder.com/50x50/4F46E5/FFFFFF?text=AW',
      policies: {
        shipping: '2-3 iş günü',
        returns: '14 gün içinde iade'
      },
      badges: ['Güvenilir Satıcı', 'Hızlı Kargo']
    },
    category: {
      name: 'Anime Figürleri',
      slug: 'anime-figurleri'
    },
    tags: ['anime', 'naruto', 'figür', 'shippuden'],
    variants: [
      { id: '1', name: 'Standart', price: 299.99, stock: 25 },
      { id: '2', name: 'Özel Baskı', price: 349.99, stock: 10 }
    ]
  },
  'one-piece-luffy-figuru-gear-4': {
    id: '2',
    title: 'One Piece Luffy Figürü - Gear 4',
    price: 459.99,
    listPrice: 599.99,
    currency: 'TRY',
    rating: 4.9,
    reviewCount: 89,
    stock: 15,
    images: [
      'https://via.placeholder.com/600x600/FF9F43/FFFFFF?text=Luffy+1',
      'https://via.placeholder.com/600x600/FF9F43/FFFFFF?text=Luffy+2',
      'https://via.placeholder.com/600x600/FF9F43/FFFFFF?text=Luffy+3'
    ],
    description: 'One Piece\'in ana karakteri Monkey D. Luffy\'nin Gear 4 formundaki görünümünü yansıtan özel figürü. Dinamik poz ve detaylı tasarımı ile dikkat çekiyor.',
    features: [
      'Gear 4 özel formu',
      'Dinamik poz',
      'Detaylı kas yapısı',
      'Özel stand',
      'LED aydınlatma özelliği'
    ],
    seller: {
      name: 'AnimeWorld Store',
      slug: 'animeworld-store',
      rating: 4.8,
      logo: 'https://via.placeholder.com/50x50/4F46E5/FFFFFF?text=AW',
      policies: {
        shipping: '2-3 iş günü',
        returns: '14 gün içinde iade'
      },
      badges: ['Güvenilir Satıcı', 'Hızlı Kargo']
    },
    category: {
      name: 'Anime Figürleri',
      slug: 'anime-figurleri'
    },
    tags: ['anime', 'one-piece', 'luffy', 'gear-4'],
    variants: [
      { id: '1', name: 'Standart', price: 459.99, stock: 15 },
      { id: '2', name: 'LED Versiyon', price: 599.99, stock: 5 }
    ]
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = mockProducts[params.slug as keyof typeof mockProducts];
  
  if (!product) {
    return {
      title: 'Ürün Bulunamadı - TDC Market',
      description: 'Aradığınız ürün bulunamadı.'
    };
  }

  return {
    title: `${product.title} - TDC Market`,
    description: product.description,
    openGraph: {
      title: `${product.title} - TDC Market`,
      description: product.description,
      images: product.images,
    },
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = mockProducts[params.slug as keyof typeof mockProducts];
  
  if (!product) {
    notFound();
  }

  const discountPercentage = Math.round(((product.listPrice - product.price) / product.listPrice) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-indigo-600">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-indigo-600">Ürünler</Link>
          <span>/</span>
          <Link href={`/categories/${product.category.slug}`} className="hover:text-indigo-600">{product.category.name}</Link>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
              <Image
                src={gcsObjectPublicUrl(product.images[0])}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
                  <Image
                    src={gcsObjectPublicUrl(image)}
                    alt={`${product.title} ${index + 2}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-gray-600">({product.reviewCount} değerlendirme)</span>
                </div>
                <div className="text-sm text-gray-600">
                  Satıcı: <Link href={`/sellers/${product.seller.slug}`} className="text-indigo-600 hover:text-indigo-700">{product.seller.name}</Link>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">{product.price} {product.currency}</span>
                {product.listPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">{product.listPrice} {product.currency}</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                      %{discountPercentage} İndirim
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 1 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Varyant Seçimi</h3>
                <div className="space-y-2">
                  {product.variants.map((variant) => (
                    <label key={variant.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 cursor-pointer">
                      <input type="radio" name="variant" value={variant.id} className="text-indigo-600" />
                      <div className="flex-1">
                        <div className="font-medium">{variant.name}</div>
                        <div className="text-sm text-gray-600">{variant.price} {product.currency}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {variant.stock > 0 ? `${variant.stock} adet` : 'Stokta yok'}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.stock > 0 ? (
                <>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 font-medium">Stokta ({product.stock} adet)</span>
                </>
              ) : (
                <>
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-red-600 font-medium">Stokta yok</span>
                </>
              )}
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              {product.stock > 0 ? (
                <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  Sepete Ekle
                </button>
              ) : (
                <button className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-medium cursor-not-allowed">
                  Stokta Yok
                </button>
              )}
              
              <div className="flex space-x-3">
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Favorilere Ekle
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Karşılaştır
                </button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Satıcı Bilgileri</h3>
              <div className="flex items-center space-x-3 mb-3">
                <img src={product.seller.logo} alt={product.seller.name} className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-medium">{product.seller.name}</div>
                  <div className="text-sm text-gray-600">⭐ {product.seller.rating} (156 değerlendirme)</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo:</span>
                  <span className="font-medium">{product.seller.policies.shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">İade:</span>
                  <span className="font-medium">{product.seller.policies.returns}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {product.seller.badges.map((badge, index) => (
                  <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ürün Açıklaması</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Özellikler</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Kargo & İade</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Ücretsiz kargo (150₺ üzeri)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Hızlı teslimat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>14 gün içinde iade</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span>Güvenli ödeme</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiketler</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "description": product.description,
            "image": product.images,
            "brand": {
              "@type": "Brand",
              "name": product.seller.name
            },
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": product.currency,
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": product.seller.name
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating,
              "reviewCount": product.reviewCount
            }
          })
        }}
      />
    </div>
  );
}
