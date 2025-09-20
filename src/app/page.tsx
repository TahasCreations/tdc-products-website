'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../lib/supabase-client';
import { TimeoutWrapper, RetryWrapper } from '../lib/timeout-wrapper';
import { usePerformanceMonitor } from '../lib/performance-monitor';
import { useErrorHandler } from '../lib/error-handler';
import { useAdvancedCache } from '../lib/advanced-cache';
import { useSecurity } from '../lib/security';
import ProductCard from '../components/ProductCard';
import CampaignSlider from '../components/CampaignSlider';
import AIRecommendationEngine from '../components/ai/AIRecommendationEngine';
import PerformanceDashboard from '../components/PerformanceDashboard';
import { 
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  SparklesIcon,
  GiftIcon,
  TrophyIcon,
  FireIcon
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  images: string[];
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const getDefaultProducts = (): Product[] => [
  {
    id: "1",
    slug: "naruto-uzumaki-figuru",
    title: "Naruto Uzumaki Figürü",
    price: 299.99,
    category: "Anime",
    stock: 15,
    image: "",
    images: [],
    description: "Naruto anime serisinin baş karakteri olan Naruto Uzumaki'nin detaylı 3D baskı figürü.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "2",
    slug: "goku-super-saiyan-figuru",
    title: "Goku Super Saiyan Figürü",
    price: 349.99,
    category: "Anime",
    stock: 8,
    image: "",
    images: [],
    description: "Dragon Ball serisinin efsanevi karakteri Goku'nun Super Saiyan formundaki detaylı figürü.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "3",
    slug: "mario-bros-figuru",
    title: "Mario Bros Figürü",
    price: 199.99,
    category: "Gaming",
    stock: 25,
    image: "",
    images: [],
    description: "Nintendo'nun efsanevi karakteri Mario'nun 3D baskı figürü.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  },
  {
    id: "4",
    slug: "iron-man-mark-85-figuru",
    title: "Iron Man Mark 85 Figürü",
    price: 449.99,
    category: "Film",
    stock: 5,
    image: "",
    images: [],
    description: "Marvel Cinematic Universe'den Iron Man'in Mark 85 zırhının detaylı figürü.",
    status: "active",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  }
];

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();
  const isFetchingRef = useRef<boolean>(false);
  const [showAI, setShowAI] = useState<boolean>(false);

  // Enterprise-grade hooks
  const { measureApi, getCoreWebVitals, getMemoryUsage } = usePerformanceMonitor();
  const { handleError } = useErrorHandler();
  const { getOrSet, invalidatePattern } = useAdvancedCache();
  const { sanitizeInput, isRateLimited } = useSecurity();

  // Enterprise-grade product fetching with advanced caching and monitoring
  const fetchProducts = useCallback(async (forceRefresh = false) => {
    try {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      const now = Date.now();
      
      // Rate limiting check
      if (isRateLimited('fetch-products')) {
        console.warn('Rate limited: Too many product fetch requests');
        return;
      }

      // Advanced cache control with enterprise caching
      if (!forceRefresh) {
        const cachedProducts = await getOrSet('products', async () => {
          return await fetchProductsFromAPI();
        }, 5 * 60 * 1000); // 5 minutes cache
        
        if (cachedProducts) {
          setProducts(cachedProducts);
          setLoading(false);
          return;
        }
      }

      // Fetch from API with performance monitoring
      const data = await measureApi('fetch-products', async () => {
        return await fetchProductsFromAPI();
      });

      setProducts(data);
      setLastFetch(now);
      setLoading(false);
      
    } catch (error) {
      handleError(error as Error, 'fetchProducts');
      setProducts(getDefaultProducts());
      setLoading(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [measureApi, handleError, getOrSet, isRateLimited]);

  // Separate API fetching function for better error handling
  const fetchProductsFromAPI = async (): Promise<Product[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase client could not be created');
    }

    // Try API first
    try {
      const response = await TimeoutWrapper.fetchWithTimeout('/api/products', {
        cache: 'force-cache',
        headers: {
          'Cache-Control': 'max-age=300'
        }
      }, 5000);
      
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (apiError) {
      console.warn('API request failed, falling back to Supabase:', apiError);
    }

    // Fallback to Supabase
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, title, price, category, stock, image, images, description, status, created_at, updated_at')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    return data && data.length > 0 ? data : getDefaultProducts();
  };

  useEffect(() => {
    fetchProducts();
    
    // Her 60 saniyede bir otomatik yenileme (30'dan 60'a çıkarıldı)
    const interval = setInterval(() => {
      fetchProducts();
    }, 60000);

    // Defer heavy AI component until after first paint/idle
    const idle = (cb: () => void) => (window as any).requestIdleCallback ? (window as any).requestIdleCallback(cb) : setTimeout(cb, 1000);
    const timeoutId = idle(() => setShowAI(true));

    // Sayfa görünür olduğunda yenileme
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchProducts(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      if (timeoutId && typeof timeoutId === 'number') {
        clearTimeout(timeoutId);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      isFetchingRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = useCallback(() => {
    const query = sanitizeInput(searchQuery.trim());
    if (query && query.length >= 2) {
      // Rate limiting for search
      if (isRateLimited('search')) {
        console.warn('Search rate limited');
        return;
      }
      
      // Performance monitoring for search
      measureApi('search', async () => {
        router.push(`/products?search=${encodeURIComponent(query)}`);
      });
    }
  }, [searchQuery, router, sanitizeInput, isRateLimited, measureApi]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-12">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bubblegum text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-fade-in-up">
                TDC Products
              </h1>
            </div>

            <div className="space-y-4">
              <p className="text-2xl md:text-3xl font-fredoka text-gray-700 animate-text-slide-up delay-300">
                Premium Figürler & Koleksiyon Ürünleri
              </p>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-text-slide-up delay-500">
                En sevdiğiniz karakterlerin detaylı ve kaliteli figürlerini keşfedin.
                Her ürün özenle seçilmiş malzemelerle üretilmiştir.
              </p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-8 animate-text-slide-up delay-600">
            <div className="relative">
              <input
                type="text"
                placeholder="Ürün ara..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none shadow-lg"
                id="searchInput"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <i className="ri-search-line text-xl"></i>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-text-slide-up delay-700">
            <Link
              href="/products"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              Ürünleri Keşfet
            </Link>
            <Link
              href="/about"
              className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-gray-200"
            >
              <i className="ri-information-line mr-2"></i>
              Hakkımızda
            </Link>
          </div>
        </div>
      </section>

      {/* Campaign Slider */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🔥 Özel Kampanyalar
            </h2>
            <p className="text-xl text-gray-600">
              Kaçırılmayacak fırsatlar ve sınırlı süreli indirimler
            </p>
          </div>
          <CampaignSlider />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ⭐ Neden TDC Products?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kaliteli figürler ve koleksiyon ürünleri için doğru adres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <StarIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Kalite</h3>
              <p className="text-gray-600 leading-relaxed">
                En yüksek kalitede malzemelerle üretilen figürler
              </p>
            </div>

            <div className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TruckIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hızlı Teslimat</h3>
              <p className="text-gray-600 leading-relaxed">
                Güvenli ve hızlı kargo ile kapınıza kadar
              </p>
            </div>

            <div className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Güvenli Alışveriş</h3>
              <p className="text-gray-600 leading-relaxed">
                SSL sertifikası ile güvenli ödeme sistemi
              </p>
            </div>

            <div className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <HeartIcon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Müşteri Memnuniyeti</h3>
              <p className="text-gray-600 leading-relaxed">
                %100 müşteri memnuniyeti garantisi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🎯 Öne Çıkan Ürünler
            </h2>
            <p className="text-xl text-gray-600">
              En popüler ve yeni eklenen figürlerimizi keşfedin
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <i className="ri-arrow-right-line mr-2"></i>
              Tüm Ürünleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <SparklesIcon className="w-16 h-16 text-white mx-auto mb-4 animate-bounce" />
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Koleksiyonunuza Başlayın
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              En sevdiğiniz karakterlerin figürlerini koleksiyonunuza ekleyin
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <i className="ri-shopping-cart-line mr-2"></i>
              Alışverişe Başla
            </Link>
            <Link
              href="/wishlist"
              className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              <HeartIcon className="w-5 h-5 mr-2" />
              İstek Listesi
            </Link>
          </div>
        </div>
      </section>

      {/* AI-Powered Smart Recommendations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🤖 AI Önerileri
            </h2>
            <p className="text-xl text-gray-600">
              Size özel figür önerileri ve kişiselleştirilmiş deneyim
            </p>
          </div>
          {showAI && (
            <AIRecommendationEngine 
              context="homepage"
              limit={8}
              showAlgorithmInfo={true}
              enablePersonalization={true}
            />
          )}
        </div>
      </section>

      {/* Gamification Dashboard */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🎮 Gamification Sistemi
            </h2>
            <p className="text-xl text-gray-600">
              Alışveriş yaparken puan kazanın, seviye atlayın ve rozetler toplayın!
            </p>
          </div>
          {/* <GamificationDashboard /> */}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <div className="text-gray-300">Mutlu Müşteri</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-gray-300">Ürün Çeşidi</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-gray-300">Marka</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-gray-300">Müşteri Desteği</div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Dashboard - Only in development */}
      {process.env.NODE_ENV === 'development' && <PerformanceDashboard />}
    </div>
  );
}