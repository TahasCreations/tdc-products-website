import { Suspense } from 'react';
import ProductFilters from '../../src/components/products/ProductFilters';
import ProductGrid from '../../src/components/products/ProductGrid';
import ProductSorting from '../../src/components/products/ProductSorting';
import Breadcrumb from '../../src/components/ui/Breadcrumb';
import { gcsObjectPublicUrl } from '@/src/lib/gcs';

export const metadata = {
  title: 'Tüm Ürünler - TDC Market',
  description: 'TDC Market\'te tüm ürünleri keşfedin. Figürlerden elektroniğe, modadan hediyeliğe kadar geniş ürün yelpazesi.',
  openGraph: {
    title: 'Tüm Ürünler - TDC Market',
    description: 'TDC Market\'te tüm ürünleri keşfedin. Figürlerden elektroniğe, modadan hediyeliğe kadar geniş ürün yelpazesi.',
    images: ['https://via.placeholder.com/1200x630/4F46E5/FFFFFF?text=TDC+Market+Products'],
  },
};

// Mock data - in real app, this would come from API/database
const mockProducts = [
  {
    id: '1',
    title: 'Naruto Uzumaki Figürü - Shippuden',
    slug: 'naruto-uzumaki-figuru-shippuden',
    price: 299.99,
    listPrice: 399.99,
    currency: 'TRY',
    rating: 4.8,
    reviewCount: 156,
    stock: 25,
    images: ['products/naruto-figur-1.jpg'],
    tags: ['anime', 'naruto', 'figür', 'shippuden'],
    seller: {
      name: 'AnimeWorld Store',
      slug: 'animeworld-store',
      rating: 4.8,
      logo: 'https://via.placeholder.com/50x50/4F46E5/FFFFFF?text=AW'
    },
    category: {
      name: 'Anime Figürleri',
      slug: 'anime-figurleri'
    }
  },
  {
    id: '2',
    title: 'One Piece Luffy Figürü - Gear 4',
    slug: 'one-piece-luffy-figuru-gear-4',
    price: 459.99,
    listPrice: 599.99,
    currency: 'TRY',
    rating: 4.9,
    reviewCount: 89,
    stock: 15,
    images: ['https://via.placeholder.com/400x400/FF9F43/FFFFFF?text=Luffy'],
    tags: ['anime', 'one-piece', 'luffy', 'gear-4'],
    seller: {
      name: 'AnimeWorld Store',
      slug: 'animeworld-store',
      rating: 4.8,
      logo: 'https://via.placeholder.com/50x50/4F46E5/FFFFFF?text=AW'
    },
    category: {
      name: 'Anime Figürleri',
      slug: 'anime-figurleri'
    }
  },
  {
    id: '3',
    title: 'Iron Man Mark 85 Figürü',
    slug: 'iron-man-mark-85-figuru',
    price: 1299.99,
    listPrice: 1599.99,
    currency: 'TRY',
    rating: 4.7,
    reviewCount: 234,
    stock: 8,
    images: ['https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Iron+Man'],
    tags: ['marvel', 'iron-man', 'figür', 'led'],
    seller: {
      name: 'AnimeWorld Store',
      slug: 'animeworld-store',
      rating: 4.8,
      logo: 'https://via.placeholder.com/50x50/4F46E5/FFFFFF?text=AW'
    },
    category: {
      name: 'Film/TV Figürleri',
      slug: 'film-tv-figurleri'
    }
  },
  {
    id: '4',
    title: 'Anime Tişört - Naruto Collection',
    slug: 'anime-tisort-naruto-collection',
    price: 89.99,
    listPrice: 129.99,
    currency: 'TRY',
    rating: 4.5,
    reviewCount: 67,
    stock: 50,
    images: ['https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Naruto+T'],
    tags: ['tişört', 'naruto', 'anime', 'pamuklu'],
    seller: {
      name: 'FashionHub',
      slug: 'fashionhub',
      rating: 4.5,
      logo: 'https://via.placeholder.com/50x50/7C3AED/FFFFFF?text=FH'
    },
    category: {
      name: 'Tişört',
      slug: 'tisort'
    }
  },
  {
    id: '5',
    title: 'Kablosuz Kulaklık - Noise Cancelling',
    slug: 'kablosuz-kulaklik-noise-cancelling',
    price: 899.99,
    listPrice: 1199.99,
    currency: 'TRY',
    rating: 4.6,
    reviewCount: 189,
    stock: 30,
    images: ['https://via.placeholder.com/400x400/2C3E50/FFFFFF?text=Headphones'],
    tags: ['kulaklık', 'kablosuz', 'gürültü-engelleyici', 'bluetooth'],
    seller: {
      name: 'TechGear Pro',
      slug: 'techgear-pro',
      rating: 4.6,
      logo: 'https://via.placeholder.com/50x50/059669/FFFFFF?text=TG'
    },
    category: {
      name: 'Kulaklık',
      slug: 'kulaklik'
    }
  },
  {
    id: '6',
    title: 'LED Aydınlatma Seti - RGB',
    slug: 'led-aydinlatma-seti-rgb',
    price: 149.99,
    listPrice: 199.99,
    currency: 'TRY',
    rating: 4.4,
    reviewCount: 92,
    stock: 40,
    images: ['https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=LED'],
    tags: ['led', 'aydınlatma', 'rgb', 'uzaktan-kumanda'],
    seller: {
      name: 'HomeDecor Plus',
      slug: 'homedecor-plus',
      rating: 4.4,
      logo: 'https://via.placeholder.com/50x50/EA580C/FFFFFF?text=HD'
    },
    category: {
      name: 'Dekor',
      slug: 'dekor'
    }
  },
  {
    id: '7',
    title: 'Akrilik Boya Seti - 24 Renk',
    slug: 'akrilik-boya-seti-24-renk',
    price: 199.99,
    listPrice: 249.99,
    currency: 'TRY',
    rating: 4.7,
    reviewCount: 145,
    stock: 25,
    images: ['https://via.placeholder.com/400x400/FF9F43/FFFFFF?text=Paint'],
    tags: ['akrilik', 'boya', 'sanat', 'profesyonel'],
    seller: {
      name: 'ArtCraft Studio',
      slug: 'artcraft-studio',
      rating: 4.7,
      logo: 'https://via.placeholder.com/50x50/DC2626/FFFFFF?text=AC'
    },
    category: {
      name: 'Boya & Fırça',
      slug: 'boya-firca'
    }
  },
  {
    id: '8',
    title: 'Kişiye Özel Fotoğraf Çerçevesi',
    slug: 'kisiye-ozel-fotograf-cercevesi',
    price: 79.99,
    listPrice: 99.99,
    currency: 'TRY',
    rating: 4.8,
    reviewCount: 78,
    stock: 60,
    images: ['https://via.placeholder.com/400x400/8E44AD/FFFFFF?text=Frame'],
    tags: ['çerçeve', 'kişiye-özel', 'ahşap', 'gravür'],
    seller: {
      name: 'HomeDecor Plus',
      slug: 'homedecor-plus',
      rating: 4.4,
      logo: 'https://via.placeholder.com/50x50/EA580C/FFFFFF?text=HD'
    },
    category: {
      name: 'Kişiye Özel',
      slug: 'kisiye-ozel'
    }
  },
  {
    id: '9',
    title: 'Doğum Günü Hediyelik Seti',
    slug: 'dogum-gunu-hediyelik-seti',
    price: 149.99,
    listPrice: 179.99,
    currency: 'TRY',
    rating: 4.6,
    reviewCount: 56,
    stock: 35,
    images: ['https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Gift+Set'],
    tags: ['hediye', 'doğum-günü', 'set', 'özel'],
    seller: {
      name: 'HomeDecor Plus',
      slug: 'homedecor-plus',
      rating: 4.4,
      logo: 'https://via.placeholder.com/50x50/EA580C/FFFFFF?text=HD'
    },
    category: {
      name: 'Doğum Günü',
      slug: 'dogum-gunu'
    }
  },
  {
    id: '10',
    title: 'Dragon Ball Goku Figürü - Super Saiyan',
    slug: 'dragon-ball-goku-figuru-super-saiyan',
    price: 349.99,
    listPrice: 449.99,
    currency: 'TRY',
    rating: 4.9,
    reviewCount: 203,
    stock: 12,
    images: ['https://via.placeholder.com/400x400/FFD93D/FFFFFF?text=Goku'],
    tags: ['anime', 'dragon-ball', 'goku', 'super-saiyan'],
    seller: {
      name: 'AnimeWorld Store',
      slug: 'animeworld-store',
      rating: 4.8,
      logo: 'https://via.placeholder.com/50x50/4F46E5/FFFFFF?text=AW'
    },
    category: {
      name: 'Anime Figürleri',
      slug: 'anime-figurleri'
    }
  }
];

const mockCategories = [
  { id: '1', name: 'Anime Figürleri', slug: 'anime-figurleri', count: 3 },
  { id: '2', name: 'Film/TV Figürleri', slug: 'film-tv-figurleri', count: 1 },
  { id: '3', name: 'Tişört', slug: 'tisort', count: 1 },
  { id: '4', name: 'Kulaklık', slug: 'kulaklik', count: 1 },
  { id: '5', name: 'Dekor', slug: 'dekor', count: 1 },
  { id: '6', name: 'Boya & Fırça', slug: 'boya-firca', count: 1 },
  { id: '7', name: 'Kişiye Özel', slug: 'kisiye-ozel', count: 1 },
  { id: '8', name: 'Doğum Günü', slug: 'dogum-gunu', count: 1 }
];

const mockSellers = [
  { id: '1', name: 'AnimeWorld Store', slug: 'animeworld-store', count: 4 },
  { id: '2', name: 'FashionHub', slug: 'fashionhub', count: 1 },
  { id: '3', name: 'TechGear Pro', slug: 'techgear-pro', count: 1 },
  { id: '4', name: 'HomeDecor Plus', slug: 'homedecor-plus', count: 3 },
  { id: '5', name: 'ArtCraft Studio', slug: 'artcraft-studio', count: 1 }
];

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sortBy = (searchParams.sort as string) || 'recommended';
  const category = searchParams.category as string;
  const seller = searchParams.seller as string;
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const inStock = searchParams.inStock === 'true';
  const page = Number(searchParams.page) || 1;
  const limit = 12;

  // Filter products based on search params
  let filteredProducts = [...mockProducts];

  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.slug === category
    );
  }

  if (seller) {
    filteredProducts = filteredProducts.filter(product => 
      product.seller.slug === seller
    );
  }

  if (minPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= minPrice
    );
  }

  if (maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.price <= maxPrice
    );
  }

  if (inStock) {
    filteredProducts = filteredProducts.filter(product => 
      product.stock > 0
    );
  }

  // Sort products
  switch (sortBy) {
    case 'newest':
      filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
      break;
    case 'price-asc':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'best-selling':
      filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'highest-rated':
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    default: // recommended
      filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Tüm Ürünler', href: '/products' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tüm Ürünler</h1>
          <p className="text-gray-600">
            {filteredProducts.length} ürün bulundu
            {category && ` • ${mockCategories.find(c => c.slug === category)?.name}`}
            {seller && ` • ${mockSellers.find(s => s.slug === seller)?.name}`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <ProductFilters
              categories={mockCategories}
              sellers={mockSellers}
              currentFilters={{
                category,
                seller,
                minPrice,
                maxPrice,
                inStock
              }}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sorting */}
            <div className="mb-6">
              <ProductSorting currentSort={sortBy} />
            </div>

            {/* Products Grid */}
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid 
                products={paginatedProducts}
                currentPage={page}
                totalPages={totalPages}
                totalProducts={filteredProducts.length}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Tüm Ürünler - TDC Market",
            "description": "TDC Market'te tüm ürünleri keşfedin. Figürlerden elektroniğe, modadan hediyeliğe kadar geniş ürün yelpazesi.",
            "url": "https://tdcmarket.com/products",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": filteredProducts.length,
              "itemListElement": paginatedProducts.map((product, index) => ({
                "@type": "Product",
                "position": index + 1,
                "name": product.title,
                "url": `https://tdcmarket.com/products/${product.slug}`,
                "image": product.images[0],
                "offers": {
                  "@type": "Offer",
                  "price": product.price,
                  "priceCurrency": product.currency,
                  "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": product.rating,
                  "reviewCount": product.reviewCount
                }
              }))
            }
          })
        }}
      />
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}