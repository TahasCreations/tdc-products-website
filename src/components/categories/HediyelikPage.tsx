'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { Gift, Heart, Truck, Package } from 'lucide-react';
import ProductCard from './ProductCard';
import CategoryHero from './CategoryHero';
import CategoryFilters from './CategoryFilters';
import PromoBand from './PromoBand';
import QuickViewDialog from './QuickViewDialog';
import GiftWizard from './GiftWizard';

const mockProducts = [
  {
    id: '1',
    title: 'Özel Günler İçin Hediye Kutusu',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Gift+Box',
    images: [
      'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Gift+Box+1',
      'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Gift+Box+2',
      'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Gift+Box+3'
    ],
    category: 'Hediye Kutuları',
    rating: 4.9,
    reviewCount: 234,
    isNew: true,
    discount: 31,
    description: 'Özel günler için hazırlanmış lüks hediye kutusu. İçinde çeşitli hediyeler ve sürprizler.',
    features: ['Lüks ambalaj', 'Çeşitli hediyeler', 'Kişiselleştirilebilir', 'Hediye kartı dahil'],
    specifications: {
      'Boyut': '25x20x15 cm',
      'Malzeme': 'Premium karton',
      'İçerik': 'Çeşitli hediyeler',
      'Renk': 'Kırmızı/Altın',
      'Marka': 'GiftBox Premium'
    },
    inStock: true,
    stockCount: 25
  },
  {
    id: '2',
    title: 'Doğum Günü Sürpriz Paketi',
    price: 149.99,
    image: 'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Birthday+Surprise',
    images: [
      'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Birthday+1',
      'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Birthday+2'
    ],
    category: 'Doğum Günü',
    rating: 4.8,
    reviewCount: 156,
    isFeatured: true,
    description: 'Doğum günü için özel olarak tasarlanmış sürpriz paket. Balonlar, süslemeler ve hediyeler dahil.',
    features: ['Balon seti', 'Süsleme malzemeleri', 'Hediye paketi', 'Doğum günü kartı'],
    specifications: {
      'İçerik': 'Balon, süsleme, hediye',
      'Yaş Grubu': 'Tüm yaşlar',
      'Tema': 'Doğum günü',
      'Renk': 'Çok renkli',
      'Marka': 'PartyTime'
    },
    inStock: true,
    stockCount: 18
  },
  {
    id: '3',
    title: 'Anneler Günü Özel Seti',
    price: 199.99,
    image: 'https://via.placeholder.com/400x400/FF9F43/FFFFFF?text=Mothers+Day',
    images: [
      'https://via.placeholder.com/400x400/FF9F43/FFFFFF?text=Mothers+1',
      'https://via.placeholder.com/400x400/FF9F43/FFFFFF?text=Mothers+2'
    ],
    category: 'Anneler Günü',
    rating: 4.9,
    reviewCount: 189,
    description: 'Anneler günü için özel olarak hazırlanmış lüks hediye seti. Çiçek, çikolata ve özel not dahil.',
    features: ['Taze çiçek', 'Premium çikolata', 'Özel not', 'Lüks ambalaj'],
    specifications: {
      'İçerik': 'Çiçek, çikolata, not',
      'Çiçek Türü': 'Gül buketi',
      'Çikolata': 'Belçika çikolatası',
      'Ambalaj': 'Lüks kutu',
      'Marka': 'FlowerGift'
    },
    inStock: true,
    stockCount: 12
  },
  {
    id: '4',
    title: 'Sevgililer Günü Romantik Set',
    price: 299.99,
    image: 'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Valentines',
    images: [
      'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Valentines+1',
      'https://via.placeholder.com/400x400/E74C3C/FFFFFF?text=Valentines+2'
    ],
    category: 'Sevgililer Günü',
    rating: 4.7,
    reviewCount: 98,
    description: 'Sevgililer günü için romantik hediye seti. Çiçek, çikolata, şarap ve özel mesaj dahil.',
    features: ['Kırmızı güller', 'Premium şarap', 'Çikolata kutusu', 'Romantik mesaj'],
    specifications: {
      'İçerik': 'Gül, şarap, çikolata',
      'Şarap': 'Kırmızı şarap',
      'Çiçek': '12 adet kırmızı gül',
      'Ambalaj': 'Romantik kutu',
      'Marka': 'RomanceGift'
    },
    inStock: false,
    stockCount: 0
  },
  {
    id: '5',
    title: 'Yılbaşı Kutlama Paketi',
    price: 179.99,
    image: 'https://via.placeholder.com/400x400/27AE60/FFFFFF?text=New+Year',
    images: [
      'https://via.placeholder.com/400x400/27AE60/FFFFFF?text=New+Year+1',
      'https://via.placeholder.com/400x400/27AE60/FFFFFF?text=New+Year+2'
    ],
    category: 'Yılbaşı',
    rating: 4.6,
    reviewCount: 145,
    description: 'Yılbaşı kutlaması için özel paket. Süslemeler, içecekler ve atıştırmalıklar dahil.',
    features: ['Yılbaşı süsleri', 'İçecek seti', 'Atıştırmalık', 'Kutlama kartı'],
    specifications: {
      'İçerik': 'Süsleme, içecek, atıştırmalık',
      'Süsleme': 'Yılbaşı temalı',
      'İçecek': 'Şampanya + meyve suyu',
      'Atıştırmalık': 'Çeşitli',
      'Marka': 'NewYearParty'
    },
    inStock: true,
    stockCount: 30
  },
  {
    id: '6',
    title: 'Bebek Doğum Hediye Seti',
    price: 249.99,
    image: 'https://via.placeholder.com/400x400/8E44AD/FFFFFF?text=Baby+Gift',
    images: [
      'https://via.placeholder.com/400x400/8E44AD/FFFFFF?text=Baby+1',
      'https://via.placeholder.com/400x400/8E44AD/FFFFFF?text=Baby+2'
    ],
    category: 'Bebek Hediyeleri',
    rating: 4.8,
    reviewCount: 167,
    description: 'Yeni doğan bebek için özel hediye seti. Bebek kıyafetleri, oyuncaklar ve bakım ürünleri dahil.',
    features: ['Bebek kıyafetleri', 'Oyuncaklar', 'Bakım ürünleri', 'Özel kutu'],
    specifications: {
      'İçerik': 'Kıyafet, oyuncak, bakım',
      'Yaş': '0-6 ay',
      'Malzeme': 'Organik pamuk',
      'Renk': 'Pembe/Mavi',
      'Marka': 'BabyGift'
    },
    inStock: true,
    stockCount: 22
  }
];

const filters = {
  price: { min: 0, max: 500 },
  categories: [
    { id: 'birthday', label: 'Doğum Günü', count: 45 },
    { id: 'valentines', label: 'Sevgililer Günü', count: 30 },
    { id: 'mothers-day', label: 'Anneler Günü', count: 25 },
    { id: 'new-year', label: 'Yılbaşı', count: 20 },
    { id: 'baby', label: 'Bebek Hediyeleri', count: 35 },
    { id: 'corporate', label: 'Kurumsal', count: 15 },
  ],
  brands: [
    { id: 'giftbox', label: 'GiftBox Premium', count: 20 },
    { id: 'partytime', label: 'PartyTime', count: 15 },
    { id: 'flowergift', label: 'FlowerGift', count: 12 },
    { id: 'romancegift', label: 'RomanceGift', count: 8 },
    { id: 'babygift', label: 'BabyGift', count: 10 },
  ],
  colors: [
    { id: 'red', label: '#E74C3C' },
    { id: 'pink', label: '#F39C12' },
    { id: 'purple', label: '#9B59B6' },
    { id: 'blue', label: '#3498DB' },
    { id: 'green', label: '#27AE60' },
    { id: 'gold', label: '#F1C40F' }
  ],
  features: [
    { id: 'personalized', label: 'Kişiselleştirilebilir', count: 40 },
    { id: 'luxury', label: 'Lüks', count: 30 },
    { id: 'eco-friendly', label: 'Çevre Dostu', count: 25 },
    { id: 'handmade', label: 'El Yapımı', count: 15 }
  ]
};

export default function HediyelikPage() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [showGiftWizard, setShowGiftWizard] = useState(false);

  const handleFilterChange = (filterType: string, value: any) => {
    console.log('Filter changed:', filterType, value);
  };

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleGiftWizardComplete = (giftData: any) => {
    console.log('Gift wizard completed:', giftData);
    setShowGiftWizard(false);
    // Here you could redirect to filtered products or show recommendations
  };

  const promoData = [
    {
      id: '1',
      title: 'Özel Günler',
      description: 'Her özel gün için mükemmel hediye seçenekleri',
      image: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Special+Occasions',
      ctaText: 'Özel Günler',
      ctaLink: '#products',
      badge: 'Özel',
      gradient: 'from-red-900 to-pink-900'
    },
    {
      id: '2',
      title: 'Hediye Rehberi',
      description: 'Doğru hediye seçimi için uzman önerileri',
      image: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Gift+Guide',
      ctaText: 'Rehberi Gör',
      ctaLink: '#gift-wizard',
      badge: 'Rehber',
      gradient: 'from-purple-900 to-indigo-900'
    },
    {
      id: '3',
      title: 'Kişiselleştirme',
      description: 'Hediyelerinizi özel mesajlarla kişiselleştirin',
      image: 'https://via.placeholder.com/600x400/27AE60/FFFFFF?text=Personalization',
      ctaText: 'Kişiselleştir',
      ctaLink: '#products',
      badge: 'Özel',
      gradient: 'from-green-900 to-emerald-900'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50">
      {/* Hero Section */}
      <CategoryHero
        category="hediyelik"
        title="Sevgiyi Hediye Et"
        description="Özel günlerde sevdiklerinizi mutlu edecek anlamlı hediyeler. Her duruma uygun, kişiselleştirilebilir hediye seçenekleri."
        badge="Özel Günler"
        ctaText="Hediye Keşfet"
        ctaHref="#products"
        features={[
          {
            icon: <Gift className="w-5 h-5" />,
            title: 'Kişiselleştirilebilir',
            description: 'Özel tasarım'
          },
          {
            icon: <Heart className="w-5 h-5" />,
            title: 'Anlamlı Hediyeler',
            description: 'Duygusal değer'
          },
          {
            icon: <Truck className="w-5 h-5" />,
            title: 'Hızlı Teslimat',
            description: 'Aynı gün teslimat'
          },
          {
            icon: <Package className="w-5 h-5" />,
            title: 'Özel Ambalaj',
            description: 'Lüks paketleme'
          }
        ]}
      />

      {/* Promo Band */}
      <PromoBand promos={promoData} className="bg-gradient-to-r from-pink-50 to-red-50" />

      {/* Gift Wizard Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Doğru Hediyeyi Bul
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Hediye seçiminde zorlanıyor musunuz? Uzman rehberimiz size en uygun hediye önerilerini sunar.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGiftWizard(true)}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Hediye Rehberini Başlat
            </motion.button>
          </motion.div>

          {/* Quick Gift Ideas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: '🎂',
                title: 'Doğum Günü',
                description: 'Unutulmaz doğum günü hediyeleri',
                color: 'from-pink-400 to-rose-400'
              },
              {
                icon: '💕',
                title: 'Sevgililer Günü',
                description: 'Romantik hediye seçenekleri',
                color: 'from-red-400 to-pink-400'
              },
              {
                icon: '👶',
                title: 'Bebek Hediyeleri',
                description: 'Yeni doğan için özel hediyeler',
                color: 'from-purple-400 to-indigo-400'
              },
              {
                icon: '🎄',
                title: 'Yılbaşı',
                description: 'Yeni yıl kutlama paketleri',
                color: 'from-green-400 to-emerald-400'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Celebration Themes */}
      <section className="py-20 bg-gradient-to-r from-red-50 to-pink-50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Kutlama Temaları
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Her özel gün için özel olarak tasarlanmış hediye temaları
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Romantik Tema',
                description: 'Sevgiliniz için romantik hediye seçenekleri',
                image: 'https://via.placeholder.com/600x400/E74C3C/FFFFFF?text=Romantic',
                color: 'from-red-500 to-pink-500',
                items: ['Çiçek buketi', 'Çikolata kutusu', 'Romantik mesaj', 'Özel ambalaj']
              },
              {
                title: 'Aile Tema',
                description: 'Aile bireyleri için anlamlı hediyeler',
                image: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Family',
                color: 'from-blue-500 to-indigo-500',
                items: ['Aile fotoğrafı', 'Kişisel eşya', 'Anı kutusu', 'Özel mesaj']
              },
              {
                title: 'Arkadaş Tema',
                description: 'Arkadaşlarınız için eğlenceli hediyeler',
                image: 'https://via.placeholder.com/600x400/27AE60/FFFFFF?text=Friends',
                color: 'from-green-500 to-emerald-500',
                items: ['Eğlenceli oyuncak', 'Hobi malzemesi', 'Deneyim hediyesi', 'Şaka hediyesi']
              }
            ].map((theme, index) => (
              <motion.div
                key={theme.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={theme.image}
                    alt={theme.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${theme.color} opacity-80`} />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-2">{theme.title}</h3>
                    <p className="text-sm opacity-90">{theme.description}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {theme.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 bg-gradient-to-r ${theme.color} rounded-full`} />
                        <span className="text-sm text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-64 flex-shrink-0">
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
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Hediye Seçenekleri</h2>
                  <p className="text-gray-600">{mockProducts.length} ürün bulundu</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    <option>En Popüler</option>
                    <option>En Yeni</option>
                    <option>Fiyat (Düşük → Yüksek)</option>
                    <option>Fiyat (Yüksek → Düşük)</option>
                    <option>Değerlendirme</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      image={product.image}
                      category={product.category}
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      isNew={product.isNew}
                      isFeatured={product.isFeatured}
                      discount={product.discount}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Dialog */}
      {isQuickViewOpen && selectedProduct && (
        <QuickViewDialog
          product={selectedProduct}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
        />
      )}

      {/* Gift Wizard Modal */}
      {showGiftWizard && (
        <GiftWizard
          isOpen={showGiftWizard}
          onClose={() => setShowGiftWizard(false)}
          onComplete={handleGiftWizardComplete}
        />
      )}
    </div>
  );
}