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
  SparklesIcon,
  CubeIcon,
  CpuChipIcon,
  PrinterIcon
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
      {/* Hero Section - 3D Yazıcı Animasyonlu */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 overflow-hidden">
        {/* 3D Yazıcı Animasyon Arka Plan */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* 3D Yazıcı Gölgesi */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          
          {/* 3D Yazıcı Işık Efektleri */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-ping delay-1000"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl animate-ping delay-2000"></div>
          
          {/* 3D Yazıcı Parçacıkları */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/40 rounded-full animate-bounce delay-1000"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400/40 rounded-full animate-bounce delay-2000"></div>
          <div className="absolute bottom-32 left-20 w-3 h-3 bg-cyan-400/40 rounded-full animate-bounce delay-3000"></div>
          <div className="absolute bottom-20 right-10 w-1 h-1 bg-pink-400/40 rounded-full animate-bounce delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Sol Taraf - Metin */}
            <div className="text-center lg:text-left">
              <div className="mb-8">
                <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-fade-in-up">
                  TDC Products
                </h1>
              </div>

              <div className="space-y-6">
                <p className="text-2xl md:text-3xl font-semibold text-white animate-text-slide-up delay-300">
                  3D Yazıcı ile Üretilen
                </p>
                <p className="text-xl md:text-2xl font-medium text-blue-200 animate-text-slide-up delay-500">
                  Premium Figürler & Koleksiyon Ürünleri
                </p>
                <p className="text-lg text-gray-300 max-w-2xl leading-relaxed animate-text-slide-up delay-700">
                  En sevdiğiniz karakterlerin detaylı ve kaliteli figürlerini keşfedin.
                  Her ürün 3D yazıcı teknolojisi ile özenle üretilmiştir.
                </p>
              </div>
            </div>

            {/* Sağ Taraf - 3D Yazıcı Animasyonu */}
            <div className="relative flex justify-center items-center">
              <div className="relative w-80 h-80">
                {/* 3D Yazıcı Ana Gövde */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl transform rotate-3 animate-float">
                  {/* 3D Yazıcı Ekran */}
                  <div className="absolute top-4 left-4 w-16 h-12 bg-blue-500 rounded-lg shadow-lg animate-pulse">
                    <div className="absolute inset-1 bg-blue-300 rounded animate-ping"></div>
                  </div>
                  
                  {/* 3D Yazıcı Nozul */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 rounded-full shadow-lg animate-bounce">
                    <div className="absolute inset-1 bg-orange-300 rounded-full animate-ping"></div>
                  </div>
                  
                  {/* 3D Yazıcı Işık */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-400/30 rounded-full blur-lg animate-pulse"></div>
                </div>
                
                {/* 3D Yazıcı Platform */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-4 bg-gray-700 rounded-lg shadow-lg"></div>
                
                {/* 3D Yazıcı Parçacıkları */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-pink-400 rounded-full animate-bounce delay-3000"></div>
              </div>
            </div>
          </div>

          {/* Arama ve Butonlar */}
          <div className="mt-12 space-y-8">
            <div className="max-w-2xl mx-auto animate-text-slide-up delay-600">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="3D figür ara..."
                  className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-full focus:border-blue-400 focus:outline-none shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 text-white placeholder-gray-300"
                  id="searchInput"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-110 hover:shadow-lg"
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
                className="group relative bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <CubeIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  3D Figürleri Keşfet
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Link>
              <Link
                href="/about"
                className="group relative bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-white/20 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <CpuChipIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  3D Teknolojisi
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
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
              Sınırlı süreli indirimler ve özel fırsatlar
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
              Neden TDC Products?
            </h2>
            <p className="text-xl text-gray-600">
              3D yazıcı teknolojisi ile üretilen premium kalite
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <CubeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3D Teknoloji</h3>
              <p className="text-gray-600">En son 3D yazıcı teknolojisi ile üretim</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <StarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Kalite</h3>
              <p className="text-gray-600">Yüksek kaliteli malzemeler ve detaylı işçilik</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <TruckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hızlı Teslimat</h3>
              <p className="text-gray-600">Güvenli ve hızlı kargo ile teslimat</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Güvenli Alışveriş</h3>
              <p className="text-gray-600">Güvenli ödeme ve müşteri memnuniyeti</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Öne Çıkan 3D Figürler
              </h2>
              <p className="text-xl text-gray-600">
                En popüler ve yeni eklenen ürünler
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
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <CubeIcon className="w-5 h-5 mr-2" />
                Tüm 3D Figürleri Gör
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            3D Figür Koleksiyonunuzu Başlatın
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            En sevdiğiniz karakterlerin detaylı figürlerini keşfedin ve koleksiyonunuzu oluşturun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Ürünleri İncele
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Hakkımızda
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}