'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import ProductCard from './ProductCard';
import CategoryHero from './CategoryHero';
import CategoryFilters from './CategoryFilters';

const mockProducts = [
  {
    id: '1',
    title: 'Kişiye Özel Fotoğraf Çerçevesi',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://via.placeholder.com/400x400/8E44AD/FFFFFF?text=Custom+Frame',
    category: 'Kişiye Özel',
    rating: 4.9,
    reviewCount: 234,
    isNew: true,
    discount: 20
  },
  {
    id: '2',
    title: 'Doğum Günü Hediye Seti',
    price: 149.99,
    image: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Birthday+Set',
    category: 'Doğum Günü',
    rating: 4.8,
    reviewCount: 156,
    isFeatured: true
  },
  {
    id: '3',
    title: 'Anneler Günü Özel Kutu',
    price: 199.99,
    image: 'https://via.placeholder.com/400x400/27AE60/FFFFFF?text=Mothers+Day',
    category: 'Özel Günler',
    rating: 4.7,
    reviewCount: 89
  },
  {
    id: '4',
    title: 'Kurumsal Hediye Seti',
    price: 299.99,
    image: 'https://via.placeholder.com/400x400/3498DB/FFFFFF?text=Corporate+Gift',
    category: 'Kurumsal',
    rating: 4.6,
    reviewCount: 67
  },
  {
    id: '5',
    title: 'Sevgililer Günü Romantik Set',
    price: 179.99,
    image: 'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Valentines+Set',
    category: 'Sevgililer Günü',
    rating: 4.8,
    reviewCount: 123
  },
  {
    id: '6',
    title: 'Mini Hediye Koleksiyonu',
    price: 59.99,
    image: 'https://via.placeholder.com/400x400/9B59B6/FFFFFF?text=Mini+Gift+Set',
    category: 'Mini Setler',
    rating: 4.5,
    reviewCount: 78
  }
];

const filters = {
  price: { min: 0, max: 500 },
  categories: [
    { id: 'kisiye-ozel', label: 'Kişiye Özel', count: 45 },
    { id: 'dogum-gunu', label: 'Doğum Günü', count: 23 },
    { id: 'ozel-gunler', label: 'Özel Günler', count: 18 },
    { id: 'kurumsal', label: 'Kurumsal', count: 31 },
    { id: 'mini-set', label: 'Mini Setler', count: 27 },
    { id: 'kart', label: 'Kart & Aksesuar', count: 19 }
  ],
  brands: [
    { id: 'custom', label: 'Özel Tasarım', count: 35 },
    { id: 'premium', label: 'Premium', count: 22 },
    { id: 'eco', label: 'Eco-Friendly', count: 18 },
    { id: 'handmade', label: 'El Yapımı', count: 12 }
  ],
  colors: [
    { id: 'gold', label: '#FFD700' },
    { id: 'silver', label: '#C0C0C0' },
    { id: 'rose', label: '#FF69B4' },
    { id: 'blue', label: '#3498DB' },
    { id: 'green', label: '#27AE60' },
    { id: 'purple', label: '#9B59B6' }
  ],
  features: [
    { id: 'personalized', label: 'Kişiselleştirilebilir', count: 28 },
    { id: 'gift-wrap', label: 'Hediye Paketi', count: 35 },
    { id: 'express', label: 'Hızlı Teslimat', count: 12 },
    { id: 'premium', label: 'Premium Kalite', count: 20 }
  ]
};

export default function HediyelikPage() {
  const handleFilterChange = (filterType: string, value: any) => {
    console.log('Filter changed:', filterType, value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <CategoryHero
        title="Hediyelik"
        description="Sevdiklerinizi mutlu edecek özel hediyeler ve anlamlı anlar yaratın. Her hediye bir hikaye, her anı bir hazine."
        backgroundImage="https://via.placeholder.com/1920x1080/8E44AD/FFFFFF?text=Gifts+Special+Occasions"
        accentColor="bg-purple-600"
        gradientFrom="from-purple-900"
        gradientTo="to-pink-900"
        features={['Kişiselleştirilebilir', 'Özel Günler', 'Hızlı Teslimat', 'Anlamlı Hediyeler']}
        ctaText="Hediye Keşfet"
        ctaLink="#products"
      />

      {/* Celebration Themes Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Özel Günler & Kutlamalar
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hayatınızdaki özel anları unutulmaz kılacak hediyeler. 
              Her kutlama için özel tasarlanmış koleksiyonlar.
            </p>
          </motion.div>

          {/* Celebration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Doğum Günleri',
                description: 'Yaşınızın güzelliğini kutlayın',
                image: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Birthday',
                color: 'from-pink-500 to-rose-500',
                icon: '🎂'
              },
              {
                title: 'Anneler Günü',
                description: 'Annelerin değerini gösterin',
                image: 'https://via.placeholder.com/600x400/27AE60/FFFFFF?text=Mothers+Day',
                color: 'from-green-500 to-emerald-500',
                icon: '🌹'
              },
              {
                title: 'Sevgililer Günü',
                description: 'Aşkınızı kutlayın',
                image: 'https://via.placeholder.com/600x400/E74C3C/FFFFFF?text=Valentines',
                color: 'from-red-500 to-pink-500',
                icon: '💕'
              },
              {
                title: 'Babalar Günü',
                description: 'Babaların gücünü onurlandırın',
                image: 'https://via.placeholder.com/600x400/3498DB/FFFFFF?text=Fathers+Day',
                color: 'from-blue-500 to-cyan-500',
                icon: '👨‍👧‍👦'
              },
              {
                title: 'Yılbaşı',
                description: 'Yeni yılı karşılayın',
                image: 'https://via.placeholder.com/600x400/9B59B6/FFFFFF?text=New+Year',
                color: 'from-purple-500 to-indigo-500',
                icon: '🎊'
              },
              {
                title: 'Kurumsal',
                description: 'İş dünyasında değer yaratın',
                image: 'https://via.placeholder.com/600x400/2C3E50/FFFFFF?text=Corporate',
                color: 'from-gray-500 to-gray-700',
                icon: '💼'
              }
            ].map((celebration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={celebration.image}
                    alt={celebration.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${celebration.color} opacity-80`} />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <div className="text-5xl mb-4">{celebration.icon}</div>
                    <h3 className="text-2xl font-bold mb-3">{celebration.title}</h3>
                    <p className="text-white/90 mb-6">{celebration.description}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg font-medium hover:bg-white/30 transition-colors"
                    >
                      Hediyeleri Gör
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Guide Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Hediye Rehberi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Doğru hediye seçimi için ipuçları ve öneriler. 
              Her kişiye özel hediye fikirleri.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gift Ideas */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {[
                {
                  icon: '👶',
                  title: 'Bebek & Çocuk',
                  description: 'Minikler için güvenli ve eğlenceli hediyeler',
                  items: ['Oyuncaklar', 'Kıyafetler', 'Eğitici Setler']
                },
                {
                  icon: '👩',
                  title: 'Kadınlar İçin',
                  description: 'Zarif ve şık hediye seçenekleri',
                  items: ['Takılar', 'Çantalar', 'Kozmetik Setleri']
                },
                {
                  icon: '👨',
                  title: 'Erkekler İçin',
                  description: 'Pratik ve kaliteli hediye fikirleri',
                  items: ['Aksesuarlar', 'Teknoloji', 'Spor Ekipmanları']
                },
                {
                  icon: '👴',
                  title: 'Yaşlılar İçin',
                  description: 'Anlamlı ve kullanışlı hediyeler',
                  items: ['Sağlık Ürünleri', 'Hobi Malzemeleri', 'Anı Eşyaları']
                }
              ].map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{category.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{category.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {category.items.map((item, itemIndex) => (
                          <span
                            key={itemIndex}
                            className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gift Wrapping */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://via.placeholder.com/600x750/8E44AD/FFFFFF?text=Gift+Wrapping"
                  alt="Gift Wrapping"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Özel Hediye Paketi</h3>
                  <p className="text-white/90 mb-4">
                    Tüm hediyelerimiz özel paketleme ile gönderilir
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg font-medium hover:bg-white/30 transition-colors"
                  >
                    Paketleme Seçenekleri
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
                    Tüm Hediye Ürünleri
                  </h2>
                  <p className="text-gray-600">
                    {mockProducts.length} ürün bulundu
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
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
                  className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
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
