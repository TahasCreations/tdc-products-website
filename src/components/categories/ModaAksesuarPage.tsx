'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Sparkles, Crown, Leaf, Users } from 'lucide-react';
import ProductCard from './ProductCard';
import CategoryHero from './CategoryHero';
import CategoryFilters from './CategoryFilters';
import PromoBand from './PromoBand';
import QuickViewDialog from './QuickViewDialog';

// Empty products array - no demo data
const mockProducts: any[] = [];

const filters = {
  price: { min: 0, max: 500 },
  categories: [
    { id: 'tisort', label: 'Tişört & T-Shirt', count: 0 },
    { id: 'hoodie', label: 'Hoodie & Sweatshirt', count: 0 },
    { id: 'sapka', label: 'Şapka & Kasket', count: 0 },
    { id: 'taki', label: 'Takı & Bileklik', count: 0 },
    { id: 'canta', label: 'Çanta & Cüzdan', count: 0 },
    { id: 'ayakkabi', label: 'Ayakkabı', count: 0 }
  ],
  brands: [
    { id: 'nike', label: 'Nike', count: 0 },
    { id: 'adidas', label: 'Adidas', count: 0 },
    { id: 'puma', label: 'Puma', count: 0 },
    { id: 'vans', label: 'Vans', count: 0 },
    { id: 'converse', label: 'Converse', count: 0 }
  ],
  colors: [
    { id: 'black', label: '#000000' },
    { id: 'white', label: '#FFFFFF' },
    { id: 'red', label: '#E74C3C' },
    { id: 'blue', label: '#3498DB' },
    { id: 'green', label: '#27AE60' },
    { id: 'gray', label: '#95A5A6' }
  ],
  features: [
    { id: 'organic', label: 'Organik Pamuk', count: 28 },
    { id: 'unisex', label: 'Unisex', count: 35 },
    { id: 'limited', label: 'Limited Edition', count: 12 },
    { id: 'handmade', label: 'El Yapımı', count: 8 }
  ]
};

export default function ModaAksesuarPage() {
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
      title: 'Yeni Sezon Koleksiyonu',
      description: 'En trend parçalar ve stil önerileri',
      image: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=New+Season',
      ctaText: 'Koleksiyonu Keşfet',
      ctaLink: '#products',
      badge: 'Yeni Sezon',
      gradient: 'from-pink-900 to-rose-900'
    },
    {
      id: '2',
      title: 'Minimalist Gardırop',
      description: 'Sade ve şık parçalarla tarzınızı yaratın',
      image: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Minimalist',
      ctaText: 'Minimalist Seç',
      ctaLink: '#products',
      badge: 'Minimalist',
      gradient: 'from-indigo-900 to-purple-900'
    },
    {
      id: '3',
      title: 'Aksesuar Layering',
      description: 'Mükemmel kombinasyonlar için aksesuar ipuçları',
      image: 'https://via.placeholder.com/600x400/27AE60/FFFFFF?text=Accessories',
      ctaText: 'Aksesuarları Gör',
      ctaLink: '#products',
      badge: 'Aksesuar',
      gradient: 'from-green-900 to-emerald-900'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      {/* Hero Section */}
      <CategoryHero
        category="moda-aksesuar"
        title="Sezona Özel Editorial"
        description="Tarzınızı yansıtan özel tasarım kıyafetler ve aksesuarlar. Her detayda kalite ve stil bir arada."
        badge="Yeni Koleksiyon"
        ctaText="Koleksiyonu Keşfet"
        ctaHref="#products"
        features={[
          {
            icon: <Sparkles className="w-5 h-5" />,
            title: 'Özel Tasarım',
            description: 'Benzersiz tasarımlar'
          },
          {
            icon: <Crown className="w-5 h-5" />,
            title: 'Premium Kalite',
            description: 'En iyi malzemeler'
          },
          {
            icon: <Leaf className="w-5 h-5" />,
            title: 'Sürdürülebilir',
            description: 'Çevre dostu'
          },
          {
            icon: <Users className="w-5 h-5" />,
            title: 'Unisex Seçenekler',
            description: 'Herkes için'
          }
        ]}
      />

      {/* Promo Band */}
      <PromoBand promos={promoData} className="bg-gradient-to-r from-pink-50 to-rose-50" />

      {/* Collection Slider Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Full-Width Koleksiyon Slider
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Her koleksiyonumuz farklı bir hikaye anlatır. Moda dünyasındaki 
              trendleri takip ederek size özel tasarımlar sunuyoruz.
            </p>
          </motion.div>

          {/* Full-Width Collection Slider */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              {[
                {
                  title: 'Vintage Revival',
                  description: 'Retro tarzın modern yorumu',
                  image: 'https://via.placeholder.com/800x600/FF6B6B/FFFFFF?text=Vintage+Revival',
                  items: 24,
                  color: 'from-pink-500 to-rose-500',
                  ctaText: 'Koleksiyonu Keşfet'
                },
                {
                  title: 'Street Culture',
                  description: 'Şehir hayatının dinamizmi',
                  image: 'https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Street+Culture',
                  items: 18,
                  color: 'from-indigo-500 to-purple-500',
                  ctaText: 'Street Style'
                },
                {
                  title: 'Minimalist',
                  description: 'Sadelikte güzellik',
                  image: 'https://via.placeholder.com/800x600/27AE60/FFFFFF?text=Minimalist',
                  items: 31,
                  color: 'from-green-500 to-emerald-500',
                  ctaText: 'Minimal Seç'
                }
              ].map((collection, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group relative overflow-hidden h-96 lg:h-[500px]"
                >
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${collection.color} opacity-90`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      <h3 className="text-3xl lg:text-4xl font-bold mb-3">{collection.title}</h3>
                      <p className="text-lg text-white/90 mb-6 max-w-md">{collection.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                          {collection.items} ürün
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
                        >
                          {collection.ctaText}
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Style Guide Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Stil Rehberi Kartları
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Farklı tarzları nasıl kombinleyeceğinizi öğrenin ve kendi benzersiz 
              stilinizi yaratın.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Style Tips */}
            <div className="space-y-8">
              {[
                {
                  icon: '🎨',
                  title: 'Renk Kombinasyonları',
                  description: 'Uyumlu renk paletleri ile tarzınızı öne çıkarın'
                },
                {
                  icon: '👔',
                  title: 'Kıyafet Katmanları',
                  description: 'Farklı katmanlar ile derinlik yaratın'
                },
                {
                  icon: '💎',
                  title: 'Aksesuar Seçimi',
                  description: 'Doğru aksesuarlar ile tamamlayın'
                },
                {
                  icon: '🌟',
                  title: 'Kişisel Tarz',
                  description: 'Kendinize özgü stilinizi keşfedin'
                }
              ].map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl">{tip.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600">{tip.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Style Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://via.placeholder.com/600x750/FF6B6B/FFFFFF?text=Style+Guide"
                  alt="Style Guide"
                  fill
                  className="object-cover"
                />
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
                    Tüm Ürünler
                  </h2>
                  <p className="text-gray-600">
                    {mockProducts.length} ürün bulundu
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent">
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
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-pink-200">
                      {/* Product Image with Hover Effect */}
                      <div className="relative aspect-square overflow-hidden bg-gray-50">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Color Variants */}
                        <div className="absolute bottom-3 left-3 flex space-x-2">
                          {['#FF6B6B', '#4F46E5', '#27AE60', '#F1C40F'].map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>

                        {/* Quick View Button */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuickView(product)}
                            className="px-6 py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors"
                          >
                            Hızlı Görüntüle
                          </motion.button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="text-xs text-pink-600 uppercase tracking-wide font-medium">
                            {product.category}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-pink-600 transition-colors">
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
                          <span className="text-lg font-bold text-gray-900">
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
                          className="w-full py-2.5 px-4 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors"
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
                  className="px-8 py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors"
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
