'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Star, Palette, Heart, Leaf } from 'lucide-react';
import ProductCard from './ProductCard';
import CategoryHero from './CategoryHero';
import CategoryFilters from './CategoryFilters';
import PromoBand from './PromoBand';
import QuickViewDialog from './QuickViewDialog';

const mockProducts = [
  {
    id: '1',
    title: 'Akrilik Boya Seti - 24 Renk',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://via.placeholder.com/400x400/FF9F43/FFFFFF?text=Paint+Set',
    category: 'Boya & Fırça',
    rating: 4.8,
    reviewCount: 156,
    isNew: true,
    discount: 20
  },
  {
    id: '2',
    title: 'Canvas Tuval Seti - 5\'li',
    price: 89.99,
    image: 'https://via.placeholder.com/400x400/8E44AD/FFFFFF?text=Canvas+Set',
    category: 'Tuval',
    rating: 4.7,
    reviewCount: 89,
    isFeatured: true
  },
  {
    id: '3',
    title: 'Gundam Model Kit - RX-78-2',
    price: 299.99,
    image: 'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Gundam+Kit',
    category: 'Model & Maket',
    rating: 4.9,
    reviewCount: 234
  },
  {
    id: '4',
    title: '3D Yazıcı - PLA Filament',
    price: 1299.99,
    image: 'https://via.placeholder.com/400x400/27AE60/FFFFFF?text=3D+Printer',
    category: '3D Baskı',
    rating: 4.6,
    reviewCount: 67
  },
  {
    id: '5',
    title: 'El Sanatları Kiti - Dikiş',
    price: 149.99,
    image: 'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Sewing+Kit',
    category: 'El Sanatları',
    rating: 4.5,
    reviewCount: 43
  },
  {
    id: '6',
    title: 'Kırtasiye Seti - Çizim',
    price: 79.99,
    image: 'https://via.placeholder.com/400x400/3498DB/FFFFFF?text=Drawing+Set',
    category: 'Kırtasiye',
    rating: 4.4,
    reviewCount: 78
  }
];

const filters = {
  price: { min: 0, max: 2000 },
  categories: [
    { id: 'boya', label: 'Boya & Fırça', count: 45 },
    { id: 'tuval', label: 'Tuval', count: 23 },
    { id: '3d', label: '3D Baskı', count: 18 },
    { id: 'el-sanat', label: 'El Sanatları', count: 31 },
    { id: 'kirtasiye', label: 'Kırtasiye', count: 27 },
    { id: 'model', label: 'Model & Maket', count: 19 }
  ],
  brands: [
    { id: 'winsor-newton', label: 'Winsor & Newton', count: 15 },
    { id: 'prismacolor', label: 'Prismacolor', count: 22 },
    { id: 'bandai', label: 'Bandai', count: 18 },
    { id: 'creality', label: 'Creality', count: 12 }
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
    { id: 'professional', label: 'Profesyonel', count: 28 },
    { id: 'beginner', label: 'Başlangıç', count: 35 },
    { id: 'eco-friendly', label: 'Çevre Dostu', count: 12 },
    { id: 'premium', label: 'Premium Kalite', count: 20 }
  ]
};

export default function SanatHobiPage() {
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
      title: 'Yaratıcılığını Besle',
      description: 'Sanat ve hobi dünyasında kendini keşfet',
      image: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Creative+Art',
      ctaText: 'Sanat Dünyası',
      ctaLink: '#products',
      badge: 'Creative',
      gradient: 'from-orange-900 to-yellow-900'
    },
    {
      id: '2',
      title: 'Moodboard Grid',
      description: 'İlham veren proje örnekleri',
      image: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Moodboard',
      ctaText: 'İlham Al',
      ctaLink: '#products',
      badge: 'Inspiration',
      gradient: 'from-purple-900 to-pink-900'
    },
    {
      id: '3',
      title: 'Mini Atölye Kitleri',
      description: 'Başlangıç seviyesi setler',
      image: 'https://via.placeholder.com/600x400/27AE60/FFFFFF?text=Workshop+Kits',
      ctaText: 'Atölye Setleri',
      ctaLink: '#products',
      badge: 'Workshop',
      gradient: 'from-green-900 to-emerald-900'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Hero Section */}
      <CategoryHero
        category="sanat-hobi"
        title="Yaratıcılığını Besle"
        description="Yaratıcılığınızı ortaya çıkaracak sanat malzemeleri ve hobi ürünleri. Her projede mükemmellik için ihtiyacınız olan her şey."
        badge="Yaratıcı Projeler"
        ctaText="Yaratıcılığı Keşfet"
        ctaHref="#products"
        features={[
          {
            icon: <Star className="w-5 h-5" />,
            title: 'Profesyonel Kalite',
            description: 'En iyi malzemeler'
          },
          {
            icon: <Palette className="w-5 h-5" />,
            title: 'Yaratıcı Projeler',
            description: 'İlham verici'
          },
          {
            icon: <Heart className="w-5 h-5" />,
            title: 'Başlangıç Dostu',
            description: 'Kolay başlangıç'
          },
          {
            icon: <Leaf className="w-5 h-5" />,
            title: 'Sürdürülebilir',
            description: 'Çevre dostu'
          }
        ]}
      />

      {/* Promo Band */}
      <PromoBand promos={promoData} className="bg-gradient-to-r from-orange-50 to-yellow-50" />

      {/* Moodboard Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Yaratıcı İlham Panosu
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sanatçılarımızın eserlerinden ilham alın ve kendi projelerinizi 
              hayata geçirin. Her eser bir hikaye anlatır.
            </p>
          </motion.div>

          {/* Moodboard Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { image: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Abstract', quote: 'Renklerin dili' },
              { image: 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=Portrait', quote: 'İnsan ruhu' },
              { image: 'https://via.placeholder.com/300x300/27AE60/FFFFFF?text=Nature', quote: 'Doğanın güzelliği' },
              { image: 'https://via.placeholder.com/300x300/FFD93D/FFFFFF?text=Digital', quote: 'Dijital sanat' },
              { image: 'https://via.placeholder.com/300x300/9B59B6/FFFFFF?text=Sculpture', quote: 'Üç boyutlu düşünce' },
              { image: 'https://via.placeholder.com/300x300/E74C3C/FFFFFF?text=Calligraphy', quote: 'Yazının sanatı' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-square relative">
                  <Image
                    src={item.image}
                    alt="Artwork"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Quote on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-center font-medium text-sm">
                      "{item.quote}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Yaratıcı Süreç
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sanat yapmanın adımlarını keşfedin ve kendi yaratıcı 
              yolculuğunuza başlayın.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'İlham Al',
                description: 'Çevrenizden ve sanatçılardan ilham alın',
                icon: '💡',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                step: '02',
                title: 'Planla',
                description: 'Projenizi tasarlayın ve malzemeleri seçin',
                icon: '📋',
                color: 'from-blue-400 to-cyan-500'
              },
              {
                step: '03',
                title: 'Yarat',
                description: 'Hayal gücünüzü kullanarak eserinizi oluşturun',
                icon: '🎨',
                color: 'from-pink-400 to-rose-500'
              },
              {
                step: '04',
                title: 'Paylaş',
                description: 'Eserinizi dünyayla paylaşın',
                icon: '🌟',
                color: 'from-purple-400 to-indigo-500'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center group"
              >
                <div className={`relative w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <div className="text-sm font-bold text-orange-600 mb-2">
                  ADIM {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorial Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Video Eğitimler
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Uzman sanatçılarımızdan öğrenin. Adım adım rehberler ile 
                yaratıcı becerilerinizi geliştirin.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: 'Akrilik Boya Teknikleri',
                    duration: '15 dk',
                    level: 'Başlangıç',
                    students: 1250
                  },
                  {
                    title: '3D Modelleme Temelleri',
                    duration: '45 dk',
                    level: 'Orta',
                    students: 890
                  },
                  {
                    title: 'Dijital Sanat Rehberi',
                    duration: '30 dk',
                    level: 'İleri',
                    students: 2100
                  }
                ].map((tutorial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                      ▶
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {tutorial.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{tutorial.duration}</span>
                        <span>•</span>
                        <span>{tutorial.level}</span>
                        <span>•</span>
                        <span>{tutorial.students} öğrenci</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-8 py-4 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
              >
                Tüm Eğitimleri Gör
              </motion.button>
            </motion.div>

            {/* Video Thumbnail */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://via.placeholder.com/800x450/FF9F43/FFFFFF?text=Video+Tutorial"
                  alt="Video Tutorial"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center text-2xl text-orange-600"
                  >
                    ▶
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-50">
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
                    Tüm Sanat & Hobi Ürünleri
                  </h2>
                  <p className="text-gray-600">
                    {mockProducts.length} ürün bulundu
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent">
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
                  >
                    <ProductCard {...product} />
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
                  className="px-8 py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                >
                  Daha Fazla Yükle
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
