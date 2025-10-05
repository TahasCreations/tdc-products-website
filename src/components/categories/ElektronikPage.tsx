'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Cpu, Wifi, Battery, Settings } from 'lucide-react';
import ProductCard from './ProductCard';
import CategoryHero from './CategoryHero';
import CategoryFilters from './CategoryFilters';
import PromoBand from './PromoBand';
import QuickViewDialog from './QuickViewDialog';
import CompareDialog from './CompareDialog';

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
    discount: 25,
    specifications: {
      'Ses Kalitesi': 'Hi-Res Audio',
      'Pil Ömrü': '30 saat',
      'Bağlantı': 'Bluetooth 5.0',
      'Ağırlık': '250g',
      'Marka': 'TechSound'
    }
  },
  {
    id: '2',
    title: 'Akıllı Ev Hub - WiFi 6',
    price: 299.99,
    image: 'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Smart+Hub',
    category: 'Akıllı Ev',
    rating: 4.7,
    reviewCount: 156,
    isFeatured: true,
    specifications: {
      'WiFi': 'WiFi 6',
      'Bağlantı': 'Zigbee, Z-Wave',
      'Kapasite': '100 cihaz',
      'Güç': 'USB-C',
      'Marka': 'SmartHome Pro'
    }
  },
  {
    id: '3',
    title: 'LED Aydınlatma Seti - RGB',
    price: 149.99,
    image: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=LED+Strip',
    category: 'Aydınlatma',
    rating: 4.6,
    reviewCount: 89,
    specifications: {
      'Uzunluk': '5 metre',
      'Renkler': '16.7M RGB',
      'Güç': '12V',
      'Kontrol': 'Uzaktan kumanda',
      'Marka': 'LEDMaster'
    }
  },
  {
    id: '4',
    title: 'Gaming Mouse - 16000 DPI',
    price: 199.99,
    image: 'https://via.placeholder.com/400x400/27AE60/FFFFFF?text=Gaming+Mouse',
    category: 'Gaming',
    rating: 4.9,
    reviewCount: 312,
    specifications: {
      'DPI': '16000',
      'Sensör': 'Optik',
      'Bağlantı': 'USB-A',
      'Ağırlık': '120g',
      'Marka': 'GameTech'
    }
  },
  {
    id: '5',
    title: 'Mekanik Klavye - RGB',
    price: 249.99,
    image: 'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Keyboard',
    category: 'Klavye',
    rating: 4.5,
    reviewCount: 178,
    specifications: {
      'Switch': 'Cherry MX Blue',
      'Bağlantı': 'USB-C',
      'Aydınlatma': 'RGB',
      'Layout': 'TKL',
      'Marka': 'KeyMaster'
    }
  },
  {
    id: '6',
    title: 'Webcam 4K - Streaming',
    price: 179.99,
    image: 'https://via.placeholder.com/400x400/9B59B6/FFFFFF?text=Webcam',
    category: 'Webcam',
    rating: 4.4,
    reviewCount: 67,
    specifications: {
      'Çözünürlük': '4K UHD',
      'FPS': '30fps',
      'Mikrofon': 'Stereo',
      'Bağlantı': 'USB 3.0',
      'Marka': 'StreamCam'
    }
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
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [compareProducts, setCompareProducts] = useState<any[]>([]);

  const handleFilterChange = (filterType: string, value: any) => {
    console.log('Filter changed:', filterType, value);
  };

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCompare = (product: any) => {
    if (compareProducts.find(p => p.id === product.id)) {
      setCompareProducts(compareProducts.filter(p => p.id !== product.id));
    } else if (compareProducts.length < 3) {
      setCompareProducts([...compareProducts, product]);
    }
  };

  const promoData = [
    {
      id: '1',
      title: 'Yüksek Performans',
      description: 'En son teknoloji ile donatılmış cihazlar',
      image: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=High+Performance',
      ctaText: 'Performans Ürünleri',
      ctaLink: '#products',
      badge: 'Performance',
      gradient: 'from-blue-900 to-indigo-900'
    },
    {
      id: '2',
      title: 'Uzun Pil Ömrü',
      description: 'Gün boyu kullanım için optimize edilmiş',
      image: 'https://via.placeholder.com/600x400/27AE60/FFFFFF?text=Long+Battery',
      ctaText: 'Pil Ömrü',
      ctaLink: '#products',
      badge: 'Battery',
      gradient: 'from-green-900 to-emerald-900'
    },
    {
      id: '3',
      title: 'Dayanıklılık',
      description: 'Zorlu koşullara dayanıklı tasarım',
      image: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Durability',
      ctaText: 'Dayanıklı Ürünler',
      ctaLink: '#products',
      badge: 'Durable',
      gradient: 'from-red-900 to-pink-900'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <CategoryHero
        category="elektronik"
        title="Performans ve İnovasyon"
        description="En son teknoloji ürünleri ile hayatınızı kolaylaştırın. Akıllı ev çözümlerinden gaming ekipmanlarına kadar her şey burada."
        badge="Son Teknoloji"
        ctaText="Teknolojiyi Keşfet"
        ctaHref="#products"
        features={[
          {
            icon: <Cpu className="w-5 h-5" />,
            title: 'Son Teknoloji',
            description: 'En güncel teknoloji'
          },
          {
            icon: <Wifi className="w-5 h-5" />,
            title: 'Akıllı Bağlantı',
            description: 'Kablosuz bağlantı'
          },
          {
            icon: <Battery className="w-5 h-5" />,
            title: 'Enerji Tasarrufu',
            description: 'Düşük güç tüketimi'
          },
          {
            icon: <Settings className="w-5 h-5" />,
            title: 'Kolay Kurulum',
            description: 'Hızlı kurulum'
          }
        ]}
      />

      {/* Promo Band */}
      <PromoBand promos={promoData} className="bg-gray-900" />

      {/* Tech Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Özellik Kartları
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ürünlerimizde kullanılan en son teknolojiler ile performans ve 
              kullanıcı deneyimini bir üst seviyeye taşıyoruz.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '⚡',
                title: 'Yüksek Performans',
                description: 'En yeni işlemciler ile yüksek performans',
                color: 'from-blue-400 to-cyan-400',
                specs: ['8-Core CPU', '16GB RAM', '1TB SSD']
              },
              {
                icon: '🔗',
                title: 'Akıllı Bağlantı',
                description: 'WiFi 6 ve Bluetooth 5.0 desteği',
                color: 'from-purple-400 to-pink-400',
                specs: ['5G Ready', 'WiFi 6E', 'Bluetooth 5.3']
              },
              {
                icon: '🔋',
                title: 'Uzun Pil Ömrü',
                description: 'Gelişmiş batarya teknolojisi',
                color: 'from-green-400 to-emerald-400',
                specs: ['24 Saat Kullanım', 'Hızlı Şarj', 'Akıllı Yönetim']
              },
              {
                icon: '🛡️',
                title: 'Dayanıklılık',
                description: 'Zorlu koşullara dayanıklı tasarım',
                color: 'from-red-400 to-orange-400',
                specs: ['IP68 Su Geçirmez', 'Gorilla Glass', 'MIL-STD-810G']
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group text-center p-6 bg-gray-700 rounded-2xl hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-cyan-400/50"
              >
                <div className={`text-4xl mb-4 p-3 rounded-xl bg-gradient-to-r ${feature.color} bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300 inline-block`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-4">{feature.description}</p>
                <div className="space-y-1">
                  {feature.specs.map((spec, specIndex) => (
                    <div key={specIndex} className="text-sm text-gray-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                      {spec}
                    </div>
                  ))}
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
                    Tüm Elektronik Ürünler
                  </h2>
                  <p className="text-gray-300">
                    {mockProducts.length} ürün bulundu
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent">
                    <option>Önerilen</option>
                    <option>En Yeni</option>
                    <option>Fiyat: Düşük → Yüksek</option>
                    <option>Fiyat: Yüksek → Düşük</option>
                    <option>En Çok Satan</option>
                  </select>
                  
                  {/* Compare Button */}
                  {compareProducts.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsCompareOpen(true)}
                      className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
                    >
                      Karşılaştır ({compareProducts.length})
                    </motion.button>
                  )}
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
                    <div className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-700 group-hover:border-cyan-400/50">
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden bg-gray-700">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Tech Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                          {product.isNew && (
                            <span className="px-2 py-1 bg-cyan-500 text-black text-xs font-bold rounded-full">
                              YENİ
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                              ÖNE ÇIKAN
                            </span>
                          )}
                          {product.discount && (
                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                              %{product.discount} İNDİRİM
                            </span>
                          )}
                        </div>

                        {/* Quick View & Compare Buttons */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleQuickView(product)}
                            className="px-4 py-2 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-colors"
                          >
                            Hızlı Görüntüle
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCompare(product)}
                            className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                              compareProducts.find(p => p.id === product.id)
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-white/20 text-white hover:bg-white/30'
                            }`}
                          >
                            {compareProducts.find(p => p.id === product.id) ? 'Kaldır' : 'Karşılaştır'}
                          </motion.button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6">
                        <div className="mb-2">
                          <span className="text-xs text-cyan-400 uppercase tracking-wide font-bold">
                            {product.category}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                          {product.title}
                        </h3>

                        {/* Tech Specs */}
                        <div className="mb-4 space-y-1">
                          {product.specifications && Object.entries(product.specifications).slice(0, 3).map(([key, value], index) => (
                            <div key={key} className="text-sm text-gray-400 flex items-center">
                              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                              {key}: {value}
                            </div>
                          ))}
                        </div>

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
                          className="w-full py-3 px-4 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-colors"
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
                  className="px-8 py-3 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-colors"
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

      {/* Compare Dialog */}
      <CompareDialog
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        products={compareProducts}
      />
    </div>
  );
}
