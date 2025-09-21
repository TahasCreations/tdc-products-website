'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '../components/ProductCard';
import CampaignSlider from '../components/CampaignSlider';
import { 
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  SparklesIcon
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

const getDefaultProducts = (): Product[] => [];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(getDefaultProducts());
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  // Basit arama fonksiyonu
  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/30 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400/30 rounded-full animate-bounce delay-2000"></div>
          <div className="absolute bottom-32 left-20 w-5 h-5 bg-pink-400/30 rounded-full animate-bounce delay-3000"></div>
          <div className="absolute bottom-20 right-10 w-2 h-2 bg-yellow-400/30 rounded-full animate-bounce delay-1000"></div>
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
            <div className="relative group">
              <input
                type="text"
                placeholder="Ürün ara..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105"
                id="searchInput"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <i className="ri-search-line text-xl"></i>
              </button>
              
              {/* Search Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"></div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-text-slide-up delay-700">
            <Link
              href="/products"
              className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <i className="ri-shopping-bag-line mr-2 group-hover:scale-110 transition-transform duration-300"></i>
                Ürünleri Keşfet
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>
            <Link
              href="/about"
              className="group relative bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-gray-200 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <i className="ri-information-line mr-2 group-hover:scale-110 transition-transform duration-300"></i>
                Hakkımızda
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
            <Link href="/features/premium-quality" className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                  <StarIcon className="w-10 h-10 text-white group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">Premium Kalite</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  En yüksek kalitede malzemelerle üretilen figürler
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <i className="ri-arrow-right-up-line text-blue-500 text-xl"></i>
              </div>
            </Link>

            <Link href="/features/fast-delivery" className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                  <TruckIcon className="w-10 h-10 text-white group-hover:animate-bounce" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-300">Hızlı Teslimat</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  Güvenli ve hızlı kargo ile kapınıza kadar
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <i className="ri-arrow-right-up-line text-purple-500 text-xl"></i>
              </div>
            </Link>

            <Link href="/features/secure-shopping" className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                  <ShieldCheckIcon className="w-10 h-10 text-white group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors duration-300">Güvenli Alışveriş</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  SSL sertifikası ile güvenli ödeme sistemi
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <i className="ri-arrow-right-up-line text-pink-500 text-xl"></i>
              </div>
            </Link>

            <Link href="/features/customer-satisfaction" className="group text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">
                  <HeartIcon className="w-10 h-10 text-white group-hover:animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">Müşteri Memnuniyeti</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  %100 müşteri memnuniyeti garantisi
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <i className="ri-arrow-right-up-line text-green-500 text-xl"></i>
              </div>
            </Link>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

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
          
          {/* Animated Background Elements */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-white/20 rounded-full animate-ping delay-2000"></div>
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-ping delay-3000"></div>
          <div className="absolute bottom-10 right-10 w-4 h-4 bg-white/20 rounded-full animate-ping delay-1000"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="relative inline-block">
              <SparklesIcon className="w-16 h-16 text-white mx-auto mb-4 animate-bounce" />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 relative">
              Koleksiyonunuza Başlayın
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent blur-sm"></div>
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              En sevdiğiniz karakterlerin figürlerini koleksiyonunuza ekleyin
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="group relative inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <i className="ri-shopping-cart-line mr-2 group-hover:scale-110 transition-transform duration-300"></i>
                Alışverişe Başla
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="/wishlist"
              className="group relative inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30 overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <HeartIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                İstek Listesi
              </span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group text-white hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                1000+
              </div>
              <div className="text-gray-300 group-hover:text-white transition-colors duration-300">Mutlu Müşteri</div>
            </div>
            <div className="group text-white hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-red-400 transition-all duration-300">
                500+
              </div>
              <div className="text-gray-300 group-hover:text-white transition-colors duration-300">Ürün Çeşidi</div>
            </div>
            <div className="group text-white hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-orange-400 transition-all duration-300">
                50+
              </div>
              <div className="text-gray-300 group-hover:text-white transition-colors duration-300">Marka</div>
            </div>
            <div className="group text-white hover:scale-105 transition-transform duration-300">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent group-hover:from-orange-400 group-hover:to-yellow-400 transition-all duration-300">
                24/7
              </div>
              <div className="text-gray-300 group-hover:text-white transition-colors duration-300">Müşteri Desteği</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}