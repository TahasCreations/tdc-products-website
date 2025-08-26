'use client';

import WhatsAppButton from '@/components/WhatsAppButton';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-white min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://readdy.ai/api/search-image?query=Clean%20white%20background%20with%20elegant%20silhouettes%20of%20anime%20and%20gaming%20figurines%20scattered%20around%20the%20edges%2C%20minimalist%20design%20with%20subtle%20shadows%2C%20professional%20studio%20lighting%2C%20high-end%20product%20photography%20style&width=1920&height=1080&seq=hero-white&orientation=landscape')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.3
          }}
        />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Hayalinizdeki
              <span className="block text-orange-500 font-['Pacifico'] animate-pulse">3D Figürler</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Anime, oyun ve film karakterlerinizi yüksek kaliteli 3D baskı teknolojisi ile gerçeğe dönüştürüyoruz. Her detay özenle işlenmiş, kusursuz kalite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-center whitespace-nowrap transform hover:-translate-y-1">
                Ürünleri Keşfet
              </Link>
              <Link href="/about" className="bg-white hover:bg-gray-50 text-orange-500 px-8 py-4 rounded-full font-semibold transition-all duration-300 border-2 border-orange-500 hover:scale-105 text-center whitespace-nowrap transform hover:-translate-y-1">
                Hikayemizi Öğren
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in">Popüler Kategoriler</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En sevilen karakterlerin yüksek kaliteli 3D baskı versiyonlarını keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/products?category=anime" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
              <div 
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                  backgroundImage: `url('https://readdy.ai/api/search-image?query=Beautiful%20collection%20of%20detailed%20anime%20figurines%20and%20characters%20displayed%20on%20clean%20white%20shelves%2C%20colorful%20and%20vibrant%20anime%20style%20figures%2C%20professional%20product%20photography%2C%20soft%20lighting%2C%20modern%20display%20setup&width=800&height=600&seq=anime1&orientation=landscape')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <i className="ri-user-star-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Anime Figürleri</h3>
                <p className="text-gray-600 mb-4">Favori anime karakterlerinizin detaylı 3D baskı versiyonları</p>
                <div className="flex items-center text-orange-600 font-semibold">
                  <span>Keşfet</span>
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-2 transition-transform duration-300"></i>
                </div>
              </div>
            </Link>

            <Link href="/products?category=oyun" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
              <div 
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                  backgroundImage: `url('https://readdy.ai/api/search-image?query=Gaming%20character%20figurines%20and%20collectibles%20from%20popular%20video%20games%2C%20detailed%20miniatures%20and%20action%20figures%20on%20modern%20display%2C%20professional%20photography%2C%20orange%20and%20tech-inspired%20lighting&width=800&height=600&seq=gaming1&orientation=landscape')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <i className="ri-gamepad-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Oyun Karakterleri</h3>
                <p className="text-gray-600 mb-4">Popüler oyunların ikonik karakterlerinin koleksiyonu</p>
                <div className="flex items-center text-orange-600 font-semibold">
                  <span>Keşfet</span>
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-2 transition-transform duration-300"></i>
                </div>
              </div>
            </Link>

            <Link href="/products?category=film" className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 p-8 hover:scale-105 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
              <div 
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                style={{
                  backgroundImage: `url('https://readdy.ai/api/search-image?query=Movie%20character%20figurines%20and%20collectible%20statues%20from%20popular%20films%2C%20cinematic%20heroes%20and%20villains%20displayed%20professionally%2C%20warm%20lighting%2C%20premium%20collectibles%20showcase&width=800&height=600&seq=movie1&orientation=landscape')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <i className="ri-movie-line text-2xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Film Karakterleri</h3>
                <p className="text-gray-600 mb-4">Unutulmaz film karakterlerinin özel koleksiyonu</p>
                <div className="flex items-center text-orange-600 font-semibold">
                  <span>Keşfet</span>
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-2 transition-transform duration-300"></i>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En popüler ve yeni eklenen ürünlerimizi keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" data-product-shop>
            {[
              {
                name: "Naruto Uzumaki Figürü",
                price: "₺299",
                category: "Anime",
                image: "https://readdy.ai/api/search-image?query=Detailed%20Naruto%20Uzumaki%203D%20printed%20figurine%20with%20orange%20jumpsuit%20and%20ninja%20headband%2C%20high%20quality%20collectible%20figure%20on%20clean%20white%20background%2C%20professional%20product%20photography&width=400&height=400&seq=naruto1&orientation=squarish"
              },
              {
                name: "Link Zelda Figürü", 
                price: "₺349",
                category: "Oyun",
                image: "https://readdy.ai/api/search-image?query=Link%20from%20Legend%20of%20Zelda%203D%20printed%20figure%20with%20green%20tunic%20and%20Master%20sword%2C%20detailed%20gaming%20collectible%20on%20white%20background%2C%20premium%20quality%20figurine&width=400&height=400&seq=link1&orientation=squarish"
              },
              {
                name: "Spider-Man Figürü",
                price: "₺279",
                category: "Film", 
                image: "https://readdy.ai/api/search-image?query=Spider-Man%203D%20printed%20action%20figure%20in%20classic%20red%20and%20blue%20suit%2C%20dynamic%20pose%2C%20high%20detail%20superhero%20collectible%20on%20white%20background%2C%20professional%20photography&width=400&height=400&seq=spiderman1&orientation=squarish"
              },
              {
                name: "Goku Super Saiyan",
                price: "₺399",
                category: "Anime",
                image: "https://readdy.ai/api/search-image?query=Goku%20Super%20Saiyan%203D%20printed%20figurine%20with%20golden%20hair%20and%20orange%20gi%2C%20powerful%20stance%2C%20Dragon%20Ball%20collectible%20figure%20on%20clean%20white%20background&width=400&height=400&seq=goku1&orientation=squarish"
              }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-3 hover:scale-105">
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">{product.category}</span>
                  <h3 className="text-lg font-semibold text-gray-900 mt-3 mb-2 group-hover:text-orange-600 transition-colors duration-300">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{product.price}</span>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full transition-all duration-300 whitespace-nowrap hover:scale-110 hover:rotate-12">
                      <i className="ri-shopping-cart-add-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap transform hover:-translate-y-1">
              Tüm Ürünleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <i className="ri-award-line text-2xl text-orange-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Yüksek Kalite</h3>
              <p className="text-gray-600">En son 3D baskı teknolojisi ile mükemmel detaylar</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <i className="ri-truck-line text-2xl text-orange-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hızlı Kargo</h3>
              <p className="text-gray-600">Türkiye geneline ücretsiz ve hızlı teslimat</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <i className="ri-customer-service-2-line text-2xl text-orange-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7/24 Destek</h3>
              <p className="text-gray-600">Her zaman yanınızdayız, sorularınız için bize yazın</p>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
}