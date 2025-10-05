'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Shield, 
  Truck, 
  Zap, 
  Crown, 
  Sparkles,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  Heart,
  Eye,
  ShoppingCart,
  ChevronDown,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react';
import CategoryHero from './CategoryHero';
import { ProductCardImage } from '@/components/media/AutoImage';
import ProductCard from './ProductCard';

// Mock data for premium figure collection
const mockProducts = [
  {
    id: '1',
    title: 'Naruto Uzumaki Figürü - Shippuden',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Anime Figürleri',
    rating: 4.8,
    reviewCount: 156,
    isNew: true,
    discount: 25,
    inStock: true,
    stockCount: 15,
    series: 'Naruto Shippuden',
    scale: '1:6',
    material: 'PVC',
    height: '25cm',
    franchise: 'Naruto',
    preOrder: false,
    limited: false
  },
  {
    id: '2',
    title: 'One Piece Luffy Figürü - Gear 4',
    price: 349.99,
    category: 'Anime Figürleri',
    rating: 4.9,
    reviewCount: 203,
    isNew: false,
    discount: 0,
    inStock: true,
    stockCount: 8,
    series: 'One Piece',
    scale: '1:6',
    material: 'PVC',
    height: '28cm',
    franchise: 'One Piece',
    preOrder: false,
    limited: true
  },
  {
    id: '3',
    title: 'Attack on Titan Levi Figürü',
    price: 279.99,
    originalPrice: 329.99,
    category: 'Anime Figürleri',
    rating: 4.7,
    reviewCount: 89,
    isNew: false,
    discount: 15,
    inStock: false,
    stockCount: 0,
    series: 'Attack on Titan',
    scale: '1:8',
    material: 'PVC',
    height: '22cm',
    franchise: 'Attack on Titan',
    preOrder: true,
    limited: false
  },
  {
    id: '4',
    title: 'Marvel Iron Man Mark 85',
    price: 449.99,
    category: 'Süper Kahraman',
    rating: 4.9,
    reviewCount: 312,
    isNew: true,
    discount: 0,
    inStock: true,
    stockCount: 5,
    series: 'Marvel Studios',
    scale: '1:6',
    material: 'PVC & Die-cast',
    height: '30cm',
    franchise: 'Marvel',
    preOrder: false,
    limited: true
  }
];

const filterOptions = {
  series: [
    { id: 'naruto', label: 'Naruto', count: 12 },
    { id: 'one-piece', label: 'One Piece', count: 8 },
    { id: 'attack-on-titan', label: 'Attack on Titan', count: 6 },
    { id: 'marvel', label: 'Marvel', count: 15 },
    { id: 'dc', label: 'DC Comics', count: 9 }
  ],
  scale: [
    { id: '1:6', label: '1:6 Scale', count: 25 },
    { id: '1:8', label: '1:8 Scale', count: 18 },
    { id: '1:12', label: '1:12 Scale', count: 32 },
    { id: '1:18', label: '1:18 Scale', count: 14 }
  ],
  material: [
    { id: 'pvc', label: 'PVC', count: 45 },
    { id: 'resin', label: 'Resin', count: 12 },
    { id: 'die-cast', label: 'Die-cast', count: 8 },
    { id: 'mixed', label: 'Karışık', count: 15 }
  ],
  stock: [
    { id: 'in-stock', label: 'Stokta Var', count: 35 },
    { id: 'pre-order', label: 'Ön Sipariş', count: 18 },
    { id: 'limited', label: 'Sınırlı Üretim', count: 7 }
  ]
};

export default function FigurKoleksiyonPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    series: [] as string[],
    scale: [] as string[],
    material: [] as string[],
    stock: [] as string[]
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [muted, setMuted] = useState(true);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = mockProducts.filter(product => {
    const seriesMatch = selectedFilters.series.length === 0 || 
      selectedFilters.series.includes(product.franchise.toLowerCase().replace(' ', '-'));
    const scaleMatch = selectedFilters.scale.length === 0 || 
      selectedFilters.scale.includes(product.scale);
    const materialMatch = selectedFilters.material.length === 0 || 
      selectedFilters.material.some(m => product.material.toLowerCase().includes(m));
    const stockMatch = selectedFilters.stock.length === 0 || 
      selectedFilters.stock.some(s => {
        if (s === 'in-stock') return product.inStock;
        if (s === 'pre-order') return product.preOrder;
        if (s === 'limited') return product.limited;
        return false;
      });
    
    return seriesMatch && scaleMatch && materialMatch && stockMatch;
  });

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F6F6F6]">
      {/* Hero Section */}
      <CategoryHero
        category="figur-koleksiyon"
        title="Premium Figür"
        description="Anime'den süper kahramanlara, en sevdiğiniz karakterlerin premium figürlerini keşfedin. Her detayı özenle işlenmiş, koleksiyoner kalitesinde ürünler."
        badge="Yeni Koleksiyon"
        ctaText="Koleksiyonu Keşfet"
        ctaHref="#products"
        features={[
          {
            icon: <Crown className="w-5 h-5" />,
            title: 'Premium Kalite',
            description: 'Koleksiyoner standartlarında'
          },
          {
            icon: <Sparkles className="w-5 h-5" />,
            title: 'Sınırlı Üretim',
            description: 'Özel ve nadir figürler'
          },
          {
            icon: <Shield className="w-5 h-5" />,
            title: 'Orijinal Lisans',
            description: 'Resmi lisanslı ürünler'
          }
        ]}
      />

      {/* Video Background Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-[#1a1a1a] to-[#0B0B0B]" />
        <div className="absolute inset-0 bg-[url('/images/neon-grid.svg')] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
                3D Rotasyon
              </span>
              <br />
              <span className="text-white">Deneyimi</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Figürlerimizi 360° döndürerek her açıdan inceleyin. Hover efektleriyle detayları keşfedin.
            </p>
          </motion.div>

          {/* 3D Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* 3D Figür Preview */}
              <div className="relative aspect-square bg-gradient-to-br from-[#CBA135]/20 to-[#F4D03F]/10 rounded-3xl overflow-hidden">
                <ProductCardImage
                  alt="Naruto Uzumaki"
                  className="w-full h-full hover:scale-110 transition-transform duration-700"
                />
                
                {/* Rotation Indicator */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full p-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-5 h-5 text-[#CBA135]" />
                  </motion.div>
                </div>
              </div>

              {/* Interactive Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="absolute -bottom-6 -left-6 bg-[#CBA135] text-black px-6 py-3 rounded-2xl font-semibold shadow-lg"
              >
                Hover ile Döndür
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Gerçekçi Detaylar</h3>
                <p className="text-gray-300 leading-relaxed">
                  Her figür, orijinal karakter tasarımına sadık kalınarak üretilir. 
                  Yüz ifadeleri, kıyafet detayları ve aksesuarlar gerçekçi bir şekilde işlenir.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#CBA135]/20 rounded-lg flex items-center justify-center">
                    <Star className="w-4 h-4 text-[#CBA135]" />
                  </div>
                  <span className="text-white font-medium">Premium PVC Malzeme</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#CBA135]/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-[#CBA135]" />
                  </div>
                  <span className="text-white font-medium">Articulated Eklemler</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#CBA135]/20 rounded-lg flex items-center justify-center">
                    <Crown className="w-4 h-4 text-[#CBA135]" />
                  </div>
                  <span className="text-white font-medium">Özel Stand Dahil</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0B0B0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Premium</span>
              <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent ml-4">
                Koleksiyon
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              En popüler anime ve süper kahraman figürlerimizi keşfedin. 
              Her biri koleksiyoner kalitesinde ve orijinal lisanslı.
            </p>
          </motion.div>

          {/* Filters and Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12"
          >
            {/* Results Count */}
            <div className="text-gray-300">
              <span className="font-semibold text-[#CBA135]">{filteredProducts.length}</span> ürün bulundu
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filtreler</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#CBA135]"
              >
                <option value="recommended">Önerilen</option>
                <option value="newest">En Yeni</option>
                <option value="price-low">Fiyat (Düşük)</option>
                <option value="price-high">Fiyat (Yüksek)</option>
                <option value="rating">En Yüksek Puan</option>
              </select>

              {/* View Mode */}
              <div className="flex bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-[#CBA135] text-black' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-[#CBA135] text-black' : 'text-white hover:bg-white/10'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Series Filter */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Seri/Franchise</h3>
                    <div className="space-y-2">
                      {filterOptions.series.map((option) => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFilters.series.includes(option.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  series: [...prev.series, option.id]
                                }));
                              } else {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  series: prev.series.filter(id => id !== option.id)
                                }));
                              }
                            }}
                            className="w-4 h-4 text-[#CBA135] bg-transparent border-white/30 rounded focus:ring-[#CBA135]"
                          />
                          <span className="text-gray-300">{option.label}</span>
                          <span className="text-gray-500 text-sm">({option.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Scale Filter */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Ölçek</h3>
                    <div className="space-y-2">
                      {filterOptions.scale.map((option) => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFilters.scale.includes(option.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  scale: [...prev.scale, option.id]
                                }));
                              } else {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  scale: prev.scale.filter(id => id !== option.id)
                                }));
                              }
                            }}
                            className="w-4 h-4 text-[#CBA135] bg-transparent border-white/30 rounded focus:ring-[#CBA135]"
                          />
                          <span className="text-gray-300">{option.label}</span>
                          <span className="text-gray-500 text-sm">({option.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Material Filter */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Malzeme</h3>
                    <div className="space-y-2">
                      {filterOptions.material.map((option) => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFilters.material.includes(option.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  material: [...prev.material, option.id]
                                }));
                              } else {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  material: prev.material.filter(id => id !== option.id)
                                }));
                              }
                            }}
                            className="w-4 h-4 text-[#CBA135] bg-transparent border-white/30 rounded focus:ring-[#CBA135]"
                          />
                          <span className="text-gray-300">{option.label}</span>
                          <span className="text-gray-500 text-sm">({option.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Stock Filter */}
                  <div>
                    <h3 className="text-white font-semibold mb-4">Stok Durumu</h3>
                    <div className="space-y-2">
                      {filterOptions.stock.map((option) => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFilters.stock.includes(option.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  stock: [...prev.stock, option.id]
                                }));
                              } else {
                                setSelectedFilters(prev => ({
                                  ...prev,
                                  stock: prev.stock.filter(id => id !== option.id)
                                }));
                              }
                            }}
                            className="w-4 h-4 text-[#CBA135] bg-transparent border-white/30 rounded focus:ring-[#CBA135]"
                          />
                          <span className="text-gray-300">{option.label}</span>
                          <span className="text-gray-500 text-sm">({option.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProductCard
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={`/images/figures/${product.id}.jpg`}
                  category={product.category}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  isNew={product.isNew}
                  discount={product.discount}
                  inStock={product.inStock}
                  stockCount={product.stockCount}
                  specifications={{
                    'Seri': product.series,
                    'Ölçek': product.scale,
                    'Malzeme': product.material,
                    'Yükseklik': product.height,
                    'Franchise': product.franchise
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-[#CBA135]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-12 h-12 text-[#CBA135]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ürün Bulunamadı</h3>
              <p className="text-gray-300 mb-8">
                Seçtiğiniz filtreler için ürün bulunamadı. Filtreleri temizleyerek tekrar deneyin.
              </p>
              <button
                onClick={() => setSelectedFilters({ series: [], scale: [], material: [], stock: [] })}
                className="px-8 py-3 bg-[#CBA135] text-black font-semibold rounded-xl hover:bg-[#F4D03F] transition-colors"
              >
                Filtreleri Temizle
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Editorial Section */}
      <section className="py-20 bg-gradient-to-b from-[#0B0B0B] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
                  Sanatçı
                </span>
                <br />
                <span className="text-white">Röportajı</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Figür tasarımcımız Akira Tanaka ile koleksiyon sürecini ve 
                her figürdeki detaylara nasıl hayat verdiğini konuştuk.
              </p>
              <button className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-colors">
                <Play className="w-5 h-5" />
                <span>Röportajı İzle</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <ProductCardImage
                alt="Sanatçı Atölyesi"
                className="aspect-[4/3] rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl" />
              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-sm opacity-90">Akira Tanaka</p>
                <p className="font-semibold">Senior Figür Tasarımcısı</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bakım İpuçları */}
      <section className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0B0B0B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              <span className="text-white">Figür Bakım</span>
              <br />
              <span className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] bg-clip-text text-transparent">
                İpuçları
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Koleksiyonunuzun uzun yıllar mükemmel görünmesi için 
              uzman tavsiyelerimizi keşfedin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Doğru Saklama',
                description: 'Direkt güneş ışığından uzak, serin ve kuru bir yerde saklayın.',
                tip: 'Toz örtüsü kullanarak temiz tutun.'
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: 'Temizlik',
                description: 'Yumuşak fırça ile nazikçe temizleyin, kimyasal ürün kullanmayın.',
                tip: 'Mikrofiber bez önerilir.'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Pozisyonlama',
                description: 'Eklemleri aşırı zorlamadan doğal pozisyonlarda tutun.',
                tip: 'Düzenli pozisyon değişimi yapın.'
              }
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="w-16 h-16 bg-[#CBA135]/20 rounded-2xl flex items-center justify-center mb-6 text-[#CBA135]">
                  {tip.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{tip.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{tip.description}</p>
                <div className="bg-[#CBA135]/10 border border-[#CBA135]/30 rounded-lg p-3">
                  <p className="text-[#CBA135] text-sm font-medium">💡 Pro İpucu</p>
                  <p className="text-[#F4D03F] text-sm">{tip.tip}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}