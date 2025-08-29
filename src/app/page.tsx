'use client';

import ProductCard from '../../ProductCard';
import AddToCartButton from '../../AddToCartButton';
import AnimatedText from '../../animated-text';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleSearch = () => {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput && searchInput.value.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchInput.value.trim())}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Figür Gölgeleri */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-40 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-pink-200 to-red-200 rounded-full opacity-50 animate-float-delayed"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-40 animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-60 animate-float"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-60 left-1/2 w-8 h-8 bg-gradient-to-br from-indigo-200 to-purple-200 transform rotate-45 opacity-50 animate-pulse"></div>
        <div className="absolute bottom-60 right-1/4 w-12 h-12 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-lg opacity-40 animate-bounce-slow"></div>
        
        {/* Floating Lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-40 animate-slide-right"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-purple-300 to-transparent opacity-40 animate-slide-left"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12">
            {/* TDC Products Logo */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bubblegum text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-logo-appear">
                TDC Products
              </h1>
            </div>
            
            {/* Tagline */}
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
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 animate-text-slide-up delay-600">
            <div className="relative">
              <input
                type="text"
                placeholder="Ürün ara..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:border-blue-500 focus:outline-none shadow-lg"
                id="searchInput"
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <i className="ri-search-line text-xl"></i>
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-text-slide-up delay-700">
            <Link
              href="/products"
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-fredoka font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="relative z-10">Ürünleri Keşfet</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="/blog"
              className="px-10 py-5 border-3 border-gray-400 text-gray-700 font-fredoka font-semibold text-lg rounded-full hover:border-gray-500 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bubblegum text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Neden TDC Products?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kaliteli figürler, hızlı teslimat ve müşteri memnuniyeti odaklı hizmet anlayışımızla sizlere en iyi deneyimi sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-medal-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-fredoka font-semibold text-gray-800 mb-4">Premium Kalite</h3>
              <p className="text-gray-600 leading-relaxed">
                Her figür özenle seçilmiş malzemelerle üretilmiş, detaylı işçilik ve yüksek kalite standartlarına sahiptir.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-truck-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-fredoka font-semibold text-gray-800 mb-4">Hızlı Teslimat</h3>
              <p className="text-gray-600 leading-relaxed">
                Siparişleriniz güvenli paketleme ile hızlıca hazırlanır ve en kısa sürede kapınıza teslim edilir.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-customer-service-line text-3xl text-white"></i>
              </div>
              <h3 className="text-2xl font-fredoka font-semibold text-gray-800 mb-4">7/24 Destek</h3>
              <p className="text-gray-600 leading-relaxed">
                Müşteri hizmetlerimiz her zaman yanınızda. Sorularınız için bize ulaşabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bubblegum text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              Öne Çıkan Ürünler
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En popüler ve çok satan figürlerimizi keşfedin. Her biri koleksiyonunuz için mükemmel bir seçim.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-fredoka font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <span>Tüm Ürünleri Gör</span>
              <i className="ri-arrow-right-line ml-2 text-xl"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bubblegum text-white mb-6">
            Koleksiyonunuza Başlayın
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            En sevdiğiniz karakterlerin figürlerini koleksiyonunuza ekleyin ve özel anlarınızı ölümsüzleştirin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 bg-white text-blue-600 font-fredoka font-semibold text-lg rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Ürünleri Keşfet
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-white text-white font-fredoka font-semibold text-lg rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}