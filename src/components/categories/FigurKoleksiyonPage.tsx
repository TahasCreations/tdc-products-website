'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import ProductCard from './ProductCard';
import CategoryHero from './CategoryHero';
import CategoryFilters from './CategoryFilters';
import PromoBand from './PromoBand';
import QuickViewDialog from './QuickViewDialog';
import CategorySEO from '../seo/CategorySEO';
import SkipLinks from '../accessibility/SkipLinks';
import Announcer from '../accessibility/Announcer';

const mockProducts = [
  {
    id: '1',
    title: 'Naruto Uzumaki Figürü - Shippuden',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Naruto',
    images: [
      'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Naruto+1',
      'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Naruto+2',
      'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Naruto+3'
    ],
    category: 'Anime Figürleri',
    rating: 4.8,
    reviewCount: 156,
    isNew: true,
    discount: 25,
    description: 'Naruto Uzumaki\'nin Shippuden serisindeki en ikonik hallerinden biri. Premium PVC malzemeden üretilmiş, 25cm yüksekliğinde detaylı figür.',
    features: ['Premium PVC malzeme', '25cm yükseklik', 'Articulated eklemler', 'Özel stand'],
    specifications: {
      'Yükseklik': '25cm',
      'Malzeme': 'PVC',
      'Ölçek': '1:6',
      'Seri': 'Naruto Shippuden',
      'Üretici': 'Good Smile Company'
    },
    inStock: true,
    stockCount: 15
  },
  {
    id: '2',
    title: 'One Piece Luffy Figürü - Gear 4',
    price: 349.99,
    image: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Luffy',
    images: [
      'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Luffy+1',
      'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Luffy+2'
    ],
    category: 'Anime Figürleri',
    rating: 4.9,
    reviewCount: 203,
    isFeatured: true,
    description: 'Monkey D. Luffy\'nin Gear Fourth formundaki güçlü görünümü. Resin malzemeden üretilmiş, 30cm yüksekliğinde detaylı figür.',
    features: ['Resin malzeme', '30cm yükseklik', 'LED efektli', 'Özel diorama'],
    specifications: {
      'Yükseklik': '30cm',
      'Malzeme': 'Resin',
      'Ölçek': '1:6',
      'Seri': 'One Piece',
      'Üretici': 'Banpresto'
    },
    inStock: true,
    stockCount: 8
  },
  {
    id: '3',
    title: 'Dragon Ball Goku Figürü - Super Saiyan',
    price: 279.99,
    image: 'https://via.placeholder.com/400x400/FFD93D/FFFFFF?text=Goku',
    images: [
      'https://via.placeholder.com/400x400/FFD93D/FFFFFF?text=Goku+1',
      'https://via.placeholder.com/400x400/FFD93D/FFFFFF?text=Goku+2'
    ],
    category: 'Anime Figürleri',
    rating: 4.7,
    reviewCount: 89,
    description: 'Son Goku\'nun Super Saiyan formundaki güçlü görünümü. Articulated eklemler ile farklı pozisyonlar.',
    features: ['Articulated eklemler', '22cm yükseklik', 'Çoklu aksesuar', 'Özel stand'],
    specifications: {
      'Yükseklik': '22cm',
      'Malzeme': 'PVC',
      'Ölçek': '1:12',
      'Seri': 'Dragon Ball Z',
      'Üretici': 'S.H.Figuarts'
    },
    inStock: true,
    stockCount: 23
  },
  {
    id: '4',
    title: 'Attack on Titan Eren Figürü',
    price: 319.99,
    image: 'https://via.placeholder.com/400x400/2C3E50/FFFFFF?text=Eren',
    images: [
      'https://via.placeholder.com/400x400/2C3E50/FFFFFF?text=Eren+1',
      'https://via.placeholder.com/400x400/2C3E50/FFFFFF?text=Eren+2'
    ],
    category: 'Anime Figürleri',
    rating: 4.6,
    reviewCount: 124,
    description: 'Eren Yeager\'ın Attack on Titan serisindeki en ikonik hallerinden biri. Detaylı kostüm ve aksesuarlar.',
    features: ['Detaylı kostüm', '28cm yükseklik', 'Çoklu aksesuar', 'Özel diorama'],
    specifications: {
      'Yükseklik': '28cm',
      'Malzeme': 'PVC',
      'Ölçek': '1:6',
      'Seri': 'Attack on Titan',
      'Üretici': 'Kotobukiya'
    },
    inStock: false,
    stockCount: 0
  },
  {
    id: '5',
    title: 'Demon Slayer Tanjiro Figürü',
    price: 289.99,
    image: 'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Tanjiro',
    images: [
      'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Tanjiro+1',
      'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Tanjiro+2'
    ],
    category: 'Anime Figürleri',
    rating: 4.8,
    reviewCount: 167,
    description: 'Tanjiro Kamado\'nun Demon Slayer serisindeki güçlü görünümü. Kılıç detayları ve özel efektler.',
    features: ['Kılıç detayları', '26cm yükseklik', 'Özel efektler', 'Articulated'],
    specifications: {
      'Yükseklik': '26cm',
      'Malzeme': 'PVC',
      'Ölçek': '1:6',
      'Seri': 'Demon Slayer',
      'Üretici': 'Good Smile Company'
    },
    inStock: true,
    stockCount: 12
  },
  {
    id: '6',
    title: 'My Hero Academia Deku Figürü',
    price: 269.99,
    image: 'https://via.placeholder.com/400x400/27AE60/FFFFFF?text=Deku',
    images: [
      'https://via.placeholder.com/400x400/27AE60/FFFFFF?text=Deku+1',
      'https://via.placeholder.com/400x400/27AE60/FFFFFF?text=Deku+2'
    ],
    category: 'Anime Figürleri',
    rating: 4.5,
    reviewCount: 98,
    description: 'Izuku Midoriya\'nın My Hero Academia serisindeki hero kostümü. Detaylı kostüm ve aksesuarlar.',
    features: ['Hero kostümü', '24cm yükseklik', 'Çoklu aksesuar', 'Articulated'],
    specifications: {
      'Yükseklik': '24cm',
      'Malzeme': 'PVC',
      'Ölçek': '1:6',
      'Seri': 'My Hero Academia',
      'Üretici': 'Banpresto'
    },
    inStock: true,
    stockCount: 18
  }
];

const filters = {
  price: { min: 0, max: 1000 },
  categories: [
    { id: 'anime', label: 'Anime Figürleri', count: 45 },
    { id: 'film', label: 'Film/TV Figürleri', count: 23 },
    { id: 'diorama', label: 'Dioramalar', count: 12 },
    { id: 'koleksiyon', label: 'Koleksiyon Arabaları', count: 18 },
    { id: 'maket', label: 'Maket & Kitler', count: 31 },
    { id: 'limited', label: 'Limited Edition', count: 8 }
  ],
  brands: [
    { id: 'banpresto', label: 'Banpresto', count: 15 },
    { id: 'goodsmile', label: 'Good Smile Company', count: 22 },
    { id: 'kotobukiya', label: 'Kotobukiya', count: 18 },
    { id: 'figuarts', label: 'S.H.Figuarts', count: 12 }
  ],
  colors: [
    { id: 'red', label: '#E74C3C' },
    { id: 'blue', label: '#3498DB' },
    { id: 'green', label: '#27AE60' },
    { id: 'yellow', label: '#F1C40F' },
    { id: 'purple', label: '#9B59B6' },
    { id: 'orange', label: '#E67E22' }
  ],
  features: [
    { id: 'articulated', label: 'Articulated', count: 28 },
    { id: 'led', label: 'LED Işık', count: 5 },
    { id: 'sound', label: 'Ses Efekti', count: 3 },
    { id: 'magnetic', label: 'Manyetik Taban', count: 12 }
  ]
};

export default function FigurKoleksiyonPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const handleFilterChange = (filterType: string, value: any) => {
    console.log('Filter changed:', filterType, value);
    setAnnouncement(`Filtre değiştirildi: ${filterType}`);
  };

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
    setAnnouncement(`${product.title} ürünü hızlı görünümde açıldı`);
  };

  const promoData = [
    {
      id: '1',
      title: 'Yeni Koleksiyon',
      description: 'En sevilen anime karakterlerinin premium figürleri',
      image: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=New+Collection',
      ctaText: 'Koleksiyonu Keşfet',
      ctaLink: '#products',
      badge: 'Yeni',
      gradient: 'from-purple-900 to-indigo-900'
    },
    {
      id: '2',
      title: 'Trendler',
      description: 'En popüler anime serilerinden özel seçimler',
      image: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Trending',
      ctaText: 'Trendleri Gör',
      ctaLink: '#products',
      badge: 'Trend',
      gradient: 'from-pink-900 to-rose-900'
    },
    {
      id: '3',
      title: 'Sınırlı Üretim',
      description: 'Sadece koleksiyoncular için özel üretim figürler',
      image: 'https://via.placeholder.com/600x400/CBA135/FFFFFF?text=Limited+Edition',
      ctaText: 'Sınırlı Üretim',
      ctaLink: '#products',
      badge: 'Limited',
      gradient: 'from-yellow-900 to-orange-900'
    }
  ];

  return (
    <>
      <CategorySEO
        title="Figür & Koleksiyon"
        description="Anime dünyasının en sevilen karakterlerini koleksiyonunuza ekleyin. Premium kalitede figürler, aksiyon figürleri, model kitleri ve özel koleksiyon ürünleri."
        keywords={[
          'figür',
          'koleksiyon',
          'anime figürü',
          'aksiyon figürü',
          'model kit',
          'funko pop',
          'nendoroid',
          'premium figür',
          'koleksiyon ürünleri',
          'anime karakterleri'
        ]}
        category="figur-koleksiyon"
        image="https://via.placeholder.com/1200x630/4F46E5/FFFFFF?text=Figur+Koleksiyon"
      />
      <SkipLinks />
      <Announcer message={announcement} />
      
      <div className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <CategoryHero
        title="Efsaneleri Koleksiyonuna Kat"
        description="Anime dünyasının en sevilen karakterlerini koleksiyonunuza ekleyin. Premium kalitede figürler ve özel koleksiyon ürünleri."
        backgroundImage="https://via.placeholder.com/1920x1080/0B0B0B/CBA135?text=Figur+Collection"
        accentColor="bg-yellow-500"
        gradientFrom="from-gray-900"
        gradientTo="to-black"
        features={['Premium Kalite', 'Limited Edition', '3D Detaylar', 'Koleksiyon Değeri']}
        ctaText="Koleksiyonu Keşfet"
        ctaLink="#products"
      />

      {/* Promo Band */}
      <PromoBand promos={promoData} className="bg-gray-900" />

      {/* 3D Showcase Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              3D Detaylar & Özel Efektler
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Figürlerimizdeki her detay özenle işlenmiş, 360° döndürme özelliği ile 
              koleksiyonunuzu farklı açılardan inceleyebilirsiniz.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 3D Preview */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl p-8 relative overflow-hidden">
                <div className="relative w-full h-full">
                  <Image
                    src="https://via.placeholder.com/600x600/CBA135/000000?text=3D+Preview"
                    alt="3D Figür Preview"
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                {/* Neon Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              {/* Floating Elements with Neon */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-30 blur-sm"
              />
              <motion.div
                animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30 blur-sm"
              />
            </motion.div>

            {/* Features */}
            <div className="space-y-8">
              {[
                {
                  icon: '🎯',
                  title: 'Hassas Detaylar',
                  description: 'Her figürde 0.1mm hassasiyetle işlenmiş detaylar',
                  color: 'from-yellow-400 to-orange-400'
                },
                {
                  icon: '🔄',
                  title: '360° Döndürme',
                  description: 'Tüm açılardan inceleme imkanı',
                  color: 'from-purple-400 to-pink-400'
                },
                {
                  icon: '💎',
                  title: 'Premium Malzeme',
                  description: 'Dayanıklı ve kaliteli PVC malzeme',
                  color: 'from-blue-400 to-cyan-400'
                },
                {
                  icon: '📦',
                  title: 'Özel Ambalaj',
                  description: 'Koleksiyon değerini koruyan özel kutu',
                  color: 'from-green-400 to-emerald-400'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-4 group"
                >
                  <div className={`text-3xl p-3 rounded-xl bg-gradient-to-r ${feature.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-80 flex-shrink-0">
              <CategoryFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                className="sticky top-24 bg-gray-800 border-gray-700"
              />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Tüm Figürler
                  </h2>
                  <p className="text-gray-300">
                    {mockProducts.length} ürün bulundu
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent">
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
                    whileHover={{ y: -8, rotateY: 5 }}
                  >
                    <div className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700 group-hover:border-yellow-400/50">
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden bg-gray-700">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                          {product.isNew && (
                            <span className="px-2 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                              YENİ
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
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
                            className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition-colors"
                          >
                            Hızlı Görüntüle
                          </motion.button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="text-xs text-yellow-400 uppercase tracking-wide font-bold">
                            {product.category}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-white mb-3 line-clamp-2 group-hover:text-yellow-400 transition-colors">
                          {product.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-600'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">({product.reviewCount})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xl font-bold text-white">
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
                          className="w-full py-3 px-4 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition-colors"
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
                  className="px-8 py-3 bg-yellow-500 text-black rounded-xl font-bold hover:bg-yellow-400 transition-colors"
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
    </>
  );
}
