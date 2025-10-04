'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import ProductCard from './ProductCard';
import CategoryHero from './CategoryHero';
import CategoryFilters from './CategoryFilters';

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
  const handleFilterChange = (filterType: string, value: any) => {
    console.log('Filter changed:', filterType, value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <CategoryHero
        title="Ev & Yaşam"
        description="Evinizi güzelleştiren dekorasyon ürünleri ve yaşam kalitenizi artıran çözümler. Her detayda konfor ve estetik."
        backgroundImage="https://via.placeholder.com/1920x1080/27AE60/FFFFFF?text=Home+Living"
        accentColor="bg-green-600"
        gradientFrom="from-green-900"
        gradientTo="to-emerald-900"
        features={['Çevre Dostu', 'El Yapımı', 'Minimalist Tasarım', 'Sürdürülebilir']}
        ctaText="Evi Keşfet"
        ctaLink="#products"
      />

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
              Yaşam Tarzı Koleksiyonları
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Farklı yaşam tarzlarına uygun koleksiyonlarımız ile evinizi 
              kişiselleştirin ve kendinizi evde hissettirin.
            </p>
          </motion.div>

          {/* Lifestyle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Minimalist Yaşam',
                description: 'Sadelikte güzellik bulun',
                image: 'https://via.placeholder.com/600x400/F8F9FA/6C757D?text=Minimalist',
                items: 24,
                color: 'from-gray-100 to-gray-200'
              },
              {
                title: 'Bohem Tarzı',
                description: 'Renkli ve özgür ruh',
                image: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Bohemian',
                items: 18,
                color: 'from-pink-100 to-rose-200'
              },
              {
                title: 'Scandinavian',
                description: 'Kuzeyin sıcaklığı',
                image: 'https://via.placeholder.com/600x400/3498DB/FFFFFF?text=Scandinavian',
                items: 31,
                color: 'from-blue-100 to-cyan-200'
              },
              {
                title: 'Industrial',
                description: 'Modern endüstriyel',
                image: 'https://via.placeholder.com/600x400/2C3E50/FFFFFF?text=Industrial',
                items: 15,
                color: 'from-gray-200 to-gray-300'
              },
              {
                title: 'Rustic',
                description: 'Doğal ve sıcak',
                image: 'https://via.placeholder.com/600x400/8B4513/FFFFFF?text=Rustic',
                items: 22,
                color: 'from-amber-100 to-yellow-200'
              },
              {
                title: 'Modern',
                description: 'Çağdaş tasarım',
                image: 'https://via.placeholder.com/600x400/27AE60/FFFFFF?text=Modern',
                items: 28,
                color: 'from-green-100 to-emerald-200'
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{style.title}</h3>
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
                  className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
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
