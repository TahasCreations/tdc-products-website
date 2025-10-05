'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Leaf, Hand, Minimize, Recycle } from 'lucide-react';
import ProductCard from './ProductCard';
import CategoryHero from './CategoryHero';
import CategoryFilters from './CategoryFilters';
import PromoBand from './PromoBand';
import QuickViewDialog from './QuickViewDialog';

const mockProducts = [
  {
    id: '1',
    title: 'Modern Vazo Seti - 3\'lü',
    price: 149.99,
    originalPrice: 199.99,
    image: 'https://via.placeholder.com/400x400/27AE60/FFFFFF?text=Vase+Set',
    category: 'Dekorasyon',
    rating: 4.7,
    reviewCount: 89,
    isNew: true,
    discount: 25
  },
  {
    id: '2',
    title: 'Bambu Mutfak Seti',
    price: 79.99,
    image: 'https://via.placeholder.com/400x400/8E44AD/FFFFFF?text=Kitchen+Set',
    category: 'Mutfak',
    rating: 4.8,
    reviewCount: 156,
    isFeatured: true
  },
  {
    id: '3',
    title: 'LED Masa Lambası - Touch',
    price: 129.99,
    image: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Table+Lamp',
    category: 'Aydınlatma',
    rating: 4.6,
    reviewCount: 67
  },
  {
    id: '4',
    title: 'Organizatör Raf Sistemi',
    price: 199.99,
    image: 'https://via.placeholder.com/400x400/3498DB/FFFFFF?text=Shelf+System',
    category: 'Düzenleme',
    rating: 4.5,
    reviewCount: 43
  },
  {
    id: '5',
    title: 'Banyo Aksesuar Seti',
    price: 89.99,
    image: 'https://via.placeholder.com/400x400/E67E22/FFFFFF?text=Bathroom+Set',
    category: 'Banyo',
    rating: 4.4,
    reviewCount: 78
  },
  {
    id: '6',
    title: 'Yatak Takımı - Organik Pamuk',
    price: 179.99,
    image: 'https://via.placeholder.com/400x400/1ABC9C/FFFFFF?text=Bedding+Set',
    category: 'Tekstil',
    rating: 4.9,
    reviewCount: 234
  }
];

const filters = {
  price: { min: 0, max: 500 },
  categories: [
    { id: 'dekor', label: 'Dekorasyon', count: 45 },
    { id: 'mutfak', label: 'Mutfak', count: 23 },
    { id: 'aydinlatma', label: 'Aydınlatma', count: 18 },
    { id: 'duzenleme', label: 'Düzenleme', count: 31 },
    { id: 'banyo', label: 'Banyo', count: 27 },
    { id: 'tekstil', label: 'Tekstil', count: 19 }
  ],
  brands: [
    { id: 'ikea', label: 'IKEA', count: 15 },
    { id: 'zara-home', label: 'Zara Home', count: 22 },
    { id: 'westelm', label: 'West Elm', count: 18 },
    { id: 'crate-barrel', label: 'Crate & Barrel', count: 12 }
  ],
  colors: [
    { id: 'white', label: '#FFFFFF' },
    { id: 'beige', label: '#F5F5DC' },
    { id: 'gray', label: '#808080' },
    { id: 'blue', label: '#3498DB' },
    { id: 'green', label: '#27AE60' },
    { id: 'brown', label: '#8B4513' }
  ],
  features: [
    { id: 'eco-friendly', label: 'Çevre Dostu', count: 28 },
    { id: 'handmade', label: 'El Yapımı', count: 15 },
    { id: 'organic', label: 'Organik', count: 12 },
    { id: 'minimalist', label: 'Minimalist', count: 20 }
  ]
};

export default function EvYasamPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleFilterChange = (filterType: string, value: any) => {
    console.log('Filter changed:', filterType, value);
  };

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const promoData = [
    {
      id: '1',
      title: 'Minimalist Salon',
      description: 'Sade ve şık salon dekorasyonu',
      image: 'https://via.placeholder.com/600x400/27AE60/FFFFFF?text=Minimalist+Living',
      ctaText: 'Salon Dekorasyonu',
      ctaLink: '#products',
      badge: 'Minimalist',
      gradient: 'from-green-900 to-emerald-900'
    },
    {
      id: '2',
      title: 'Scandi Mutfak',
      description: 'İskandinav tarzı mutfak tasarımı',
      image: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Scandi+Kitchen',
      ctaText: 'Mutfak Tasarımı',
      ctaLink: '#products',
      badge: 'Scandinavian',
      gradient: 'from-indigo-900 to-purple-900'
    },
    {
      id: '3',
      title: 'Boho Yatak Odası',
      description: 'Bohem tarzı yatak odası dekorasyonu',
      image: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Boho+Bedroom',
      ctaText: 'Yatak Odası',
      ctaLink: '#products',
      badge: 'Boho',
      gradient: 'from-pink-900 to-rose-900'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Hero Section */}
      <CategoryHero
        category="ev-yasam"
        title="Evinde Yeni Bir Hava"
        description="Evinizi güzelleştiren dekorasyon ürünleri ve yaşam kalitenizi artıran çözümler. Her detayda konfor ve estetik."
        badge="Sürdürülebilir Yaşam"
        ctaText="Evi Keşfet"
        ctaHref="#products"
        features={[
          {
            icon: <Leaf className="w-5 h-5" />,
            title: 'Çevre Dostu',
            description: 'Sürdürülebilir malzemeler'
          },
          {
            icon: <Hand className="w-5 h-5" />,
            title: 'El Yapımı',
            description: 'Özenle üretilmiş'
          },
          {
            icon: <Minimize className="w-5 h-5" />,
            title: 'Minimalist Tasarım',
            description: 'Sade ve şık'
          },
          {
            icon: <Recycle className="w-5 h-5" />,
            title: 'Sürdürülebilir',
            description: 'Doğaya saygılı'
          }
        ]}
      />

      {/* Promo Band */}
      <PromoBand promos={promoData} className="bg-gradient-to-r from-green-50 to-emerald-50" />

      {/* Lifestyle Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Oda Bazlı Kısayol Kartları
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Her oda için özel olarak tasarlanmış dekorasyon ürünleri ile 
              evinizin her köşesini güzelleştirin.
            </p>
          </motion.div>

          {/* Lifestyle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Salon',
                description: 'Rahat ve şık oturma alanı',
                image: 'https://via.placeholder.com/600x400/27AE60/FFFFFF?text=Living+Room',
                items: 24,
                color: 'from-green-100 to-emerald-200',
                icon: '🛋️'
              },
              {
                title: 'Mutfak',
                description: 'Fonksiyonel ve modern mutfak',
                image: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Kitchen',
                items: 18,
                color: 'from-indigo-100 to-purple-200',
                icon: '🍳'
              },
              {
                title: 'Banyo',
                description: 'Rahatlatıcı banyo alanı',
                image: 'https://via.placeholder.com/600x400/06B6D4/FFFFFF?text=Bathroom',
                items: 31,
                color: 'from-cyan-100 to-blue-200',
                icon: '🛁'
              },
              {
                title: 'Çalışma',
                description: 'Verimli çalışma ortamı',
                image: 'https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Study+Room',
                items: 15,
                color: 'from-purple-100 to-violet-200',
                icon: '💻'
              },
              {
                title: 'Yatak Odası',
                description: 'Huzurlu uyku alanı',
                image: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Bedroom',
                items: 22,
                color: 'from-pink-100 to-rose-200',
                icon: '🛏️'
              },
              {
                title: 'Balkon',
                description: 'Açık hava yaşam alanı',
                image: 'https://via.placeholder.com/600x400/10B981/FFFFFF?text=Balcony',
                items: 28,
                color: 'from-emerald-100 to-green-200',
                icon: '🌿'
              }
            ].map((style, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${style.color} opacity-80`} />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{style.icon}</span>
                      <h3 className="text-2xl font-bold text-gray-900">{style.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-4">{style.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {style.items} ürün
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg font-medium hover:bg-white transition-colors"
                      >
                        Keşfet
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Inspiration Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Oda İlhamları
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Farklı odalar için tasarım fikirleri ve ürün önerileri ile 
              evinizi yeniden düzenleyin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Living Room */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-2xl shadow-xl"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src="https://via.placeholder.com/800x600/27AE60/FFFFFF?text=Living+Room"
                  alt="Living Room"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-3xl font-bold mb-2">Oturma Odası</h3>
                  <p className="text-white/90 mb-4">Rahat ve şık bir oturma alanı</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg font-medium hover:bg-white/30 transition-colors"
                  >
                    Ürünleri Gör
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Kitchen */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-2xl shadow-xl"
            >
              <div className="aspect-[4/3] relative">
                <Image
                  src="https://via.placeholder.com/800x600/8E44AD/FFFFFF?text=Kitchen"
                  alt="Kitchen"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-3xl font-bold mb-2">Mutfak</h3>
                  <p className="text-white/90 mb-4">Fonksiyonel ve modern mutfak</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg font-medium hover:bg-white/30 transition-colors"
                  >
                    Ürünleri Gör
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-80 flex-shrink-0">
              <CategoryFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                className="sticky top-24"
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Tüm Ev & Yaşam Ürünleri
                  </h2>
                  <p className="text-gray-600">
                    {mockProducts.length} ürün bulundu
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>Önerilen</option>
                    <option>En Yeni</option>
                    <option>Fiyat: Düşük → Yüksek</option>
                    <option>Fiyat: Yüksek → Düşük</option>
                    <option>En Çok Satan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                    whileHover={{ y: -8 }}
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-emerald-200">
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Lifestyle Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                          {product.isNew && (
                            <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                              YENİ
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                              ÖNE ÇIKAN
                            </span>
                          )}
                          {product.discount && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                              %{product.discount} İNDİRİM
                            </span>
                          )}
                        </div>

                        {/* Quick View Button */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuickView(product)}
                            className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                          >
                            Hızlı Görüntüle
                          </motion.button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="text-xs text-emerald-600 uppercase tracking-wide font-bold">
                            {product.category}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                          {product.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">({product.reviewCount})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl font-bold text-gray-900">
                            {new Intl.NumberFormat('tr-TR', {
                              style: 'currency',
                              currency: 'TRY',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(product.price)}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-sm text-gray-500 line-through">
                              {new Intl.NumberFormat('tr-TR', {
                                style: 'currency',
                                currency: 'TRY',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* CTA Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 px-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                        >
                          Sepete Ekle
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Daha Fazla Yükle
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Dialog */}
      <QuickViewDialog
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}
