'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import ProductCard from './ProductCard';
import CategoryHero from './CategoryHero';
import CategoryFilters from './CategoryFilters';

const mockProducts = [
  {
    id: '1',
    title: 'Kablosuz Kulaklık - Noise Cancelling',
    price: 899.99,
    originalPrice: 1199.99,
    image: 'https://via.placeholder.com/400x400/2C3E50/FFFFFF?text=Headphones',
    category: 'Kulaklık',
    rating: 4.8,
    reviewCount: 234,
    isNew: true,
    discount: 25
  },
  {
    id: '2',
    title: 'Akıllı Ev Hub - WiFi 6',
    price: 299.99,
    image: 'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Smart+Hub',
    category: 'Akıllı Ev',
    rating: 4.7,
    reviewCount: 156,
    isFeatured: true
  },
  {
    id: '3',
    title: 'LED Aydınlatma Seti - RGB',
    price: 149.99,
    image: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=LED+Strip',
    category: 'Aydınlatma',
    rating: 4.6,
    reviewCount: 89
  },
  {
    id: '4',
    title: 'Gaming Mouse - 16000 DPI',
    price: 199.99,
    image: 'https://via.placeholder.com/400x400/27AE60/FFFFFF?text=Gaming+Mouse',
    category: 'Gaming',
    rating: 4.9,
    reviewCount: 312
  },
  {
    id: '5',
    title: 'Mekanik Klavye - RGB',
    price: 249.99,
    image: 'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Keyboard',
    category: 'Klavye',
    rating: 4.5,
    reviewCount: 178
  },
  {
    id: '6',
    title: 'Webcam 4K - Streaming',
    price: 179.99,
    image: 'https://via.placeholder.com/400x400/9B59B6/FFFFFF?text=Webcam',
    category: 'Webcam',
    rating: 4.4,
    reviewCount: 67
  }
];

const filters = {
  price: { min: 0, max: 2000 },
  categories: [
    { id: 'kulaklik', label: 'Kulaklık & Ses', count: 45 },
    { id: 'akilli-ev', label: 'Akıllı Ev', count: 23 },
    { id: 'aydinlatma', label: 'Aydınlatma', count: 18 },
    { id: 'gaming', label: 'Gaming & Konsol', count: 31 },
    { id: 'pc', label: 'Bilgisayar Aksesuarları', count: 27 },
    { id: 'giyilebilir', label: 'Giyilebilir Teknoloji', count: 19 }
  ],
  brands: [
    { id: 'apple', label: 'Apple', count: 15 },
    { id: 'samsung', label: 'Samsung', count: 22 },
    { id: 'sony', label: 'Sony', count: 18 },
    { id: 'logitech', label: 'Logitech', count: 12 },
    { id: 'razer', label: 'Razer', count: 8 }
  ],
  colors: [
    { id: 'black', label: '#000000' },
    { id: 'white', label: '#FFFFFF' },
    { id: 'silver', label: '#C0C0C0' },
    { id: 'blue', label: '#3498DB' },
    { id: 'red', label: '#E74C3C' },
    { id: 'green', label: '#27AE60' }
  ],
  features: [
    { id: 'wireless', label: 'Kablosuz', count: 28 },
    { id: 'rgb', label: 'RGB Işık', count: 15 },
    { id: 'waterproof', label: 'Su Geçirmez', count: 12 },
    { id: 'fast-charge', label: 'Hızlı Şarj', count: 20 }
  ]
};

export default function ElektronikPage() {
  const handleFilterChange = (filterType: string, value: any) => {
    console.log('Filter changed:', filterType, value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <CategoryHero
        title="Elektronik"
        description="En son teknoloji ürünleri ile hayatınızı kolaylaştırın. Akıllı ev çözümlerinden gaming ekipmanlarına kadar her şey burada."
        backgroundImage="https://via.placeholder.com/1920x1080/2C3E50/FFFFFF?text=Electronics"
        accentColor="bg-blue-600"
        gradientFrom="from-blue-900"
        gradientTo="to-indigo-900"
        features={['Son Teknoloji', 'Akıllı Bağlantı', 'Enerji Tasarrufu', 'Kolay Kurulum']}
        ctaText="Teknolojiyi Keşfet"
        ctaLink="#products"
      />

      {/* Tech Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Teknoloji Özellikleri
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ürünlerimizde kullanılan en son teknolojiler ile performans ve 
              kullanıcı deneyimini bir üst seviyeye taşıyoruz.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Hızlı Performans',
                description: 'En yeni işlemciler ile yüksek performans',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: '🔗',
                title: 'Akıllı Bağlantı',
                description: 'WiFi 6 ve Bluetooth 5.0 desteği',
                color: 'from-blue-400 to-cyan-500'
              },
              {
                icon: '🔋',
                title: 'Uzun Pil Ömrü',
                description: 'Gelişmiş batarya teknolojisi',
                color: 'from-green-400 to-emerald-500'
              },
              {
                icon: '🛡️',
                title: 'Güvenlik',
                description: 'Gelişmiş güvenlik protokolleri',
                color: 'from-purple-400 to-pink-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10`} />
                <div className="relative p-8 text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Home Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Akıllı Ev Çözümleri
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Evinizi akıllı hale getirin. Tek dokunuşla tüm cihazlarınızı 
                kontrol edin ve enerji tasarrufu sağlayın.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: '🏠',
                    title: 'Merkezi Kontrol',
                    description: 'Tüm cihazları tek yerden yönetin'
                  },
                  {
                    icon: '📱',
                    title: 'Mobil Uygulama',
                    description: 'Uzaktan kontrol ve izleme'
                  },
                  {
                    icon: '🌡️',
                    title: 'Otomatik Ayarlar',
                    description: 'Akıllı sensörler ile otomatik kontrol'
                  },
                  {
                    icon: '💡',
                    title: 'Enerji Tasarrufu',
                    description: 'Akıllı algoritmalar ile tasarruf'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="text-2xl">{feature.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Akıllı Ev Paketleri
              </motion.button>
            </motion.div>

            {/* Smart Home Visualization */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl p-8">
                <div className="relative w-full h-full">
                  <Image
                    src="https://via.placeholder.com/600x600/2C3E50/FFFFFF?text=Smart+Home"
                    alt="Smart Home"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              {/* Floating Icons */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl"
              >
                🏠
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute bottom-4 left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl"
              >
                💡
              </motion.div>
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
                    Tüm Elektronik Ürünler
                  </h2>
                  <p className="text-gray-600">
                    {mockProducts.length} ürün bulundu
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
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
