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
import { EmptyProductsState } from '../empty/EmptyState';

// Empty products array - no demo data
const mockProducts: any[] = [];

const filters = {
  price: { min: 0, max: 5000 },
  categories: [
    { id: 'kulaklik', label: 'Kulaklık & Ses', count: 0 },
    { id: 'telefon', label: 'Telefon & Tablet', count: 0 },
    { id: 'laptop', label: 'Laptop & Bilgisayar', count: 0 },
    { id: 'ev-akilli', label: 'Akıllı Ev', count: 0 },
    { id: 'aydinlatma', label: 'Aydınlatma', count: 0 },
    { id: 'aksesuar', label: 'Aksesuar', count: 0 }
  ],
  brands: [
    { id: 'apple', label: 'Apple', count: 0 },
    { id: 'samsung', label: 'Samsung', count: 0 },
    { id: 'sony', label: 'Sony', count: 0 },
    { id: 'lg', label: 'LG', count: 0 },
    { id: 'xiaomi', label: 'Xiaomi', count: 0 }
  ],
  colors: [
    { id: 'black', label: 'Siyah', count: 0 },
    { id: 'white', label: 'Beyaz', count: 0 },
    { id: 'gray', label: 'Gri', count: 0 },
    { id: 'blue', label: 'Mavi', count: 0 }
  ],
  features: [
    { id: 'wireless', label: 'Kablosuz', count: 0 },
    { id: 'smart', label: 'Akıllı', count: 0 },
    { id: 'energy-efficient', label: 'Enerji Tasarruflu', count: 0 },
    { id: 'waterproof', label: 'Su Geçirmez', count: 0 }
  ]
};

export default function ElektronikPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    features: [] as string[],
    priceRange: [0, 5000] as [number, number]
  });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareProducts, setCompareProducts] = useState<string[]>([]);

  // Filter products based on selected filters
  const filteredProducts = mockProducts.filter(product => {
    // Add filtering logic here when products are available
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryHero
        category="elektronik"
        title="Elektronik"
        description="En son teknoloji ürünleri ile dijital dünyanızı keşfedin"
      />


      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Filtreler</h3>
                <p className="text-gray-500">Filtreler yakında eklenecek</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredProducts.length} ürün bulundu
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Elektronik kategorisinde en kaliteli ürünler
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* View Toggle */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="recommended">Önerilen</option>
                    <option value="newest">En Yeni</option>
                    <option value="price-asc">Fiyat (Düşük → Yüksek)</option>
                    <option value="price-desc">Fiyat (Yüksek → Düşük)</option>
                    <option value="rating">En Yüksek Puan</option>
                  </select>
                </div>
              </div>

              {/* Products Grid or Empty State */}
              {filteredProducts.length === 0 ? (
                <EmptyProductsState />
              ) : (
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
                        image={product.image}
                        category={product.category}
                        rating={product.rating}
                        reviewCount={product.reviewCount}
                        isNew={product.isNew}
                        discount={product.discount}
                        specifications={product.specifications}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Features Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Teknoloji ile Geleceği Keşfedin
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              En son teknoloji ürünleri ile hayatınızı kolaylaştırın ve dijital dünyada öncü olun
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Cpu className="w-12 h-12" />,
                title: 'Yüksek Performans',
                description: 'En güçlü işlemciler ve donanımlar'
              },
              {
                icon: <Wifi className="w-12 h-12" />,
                title: 'Hızlı Bağlantı',
                description: 'WiFi 6 ve 5G teknolojileri'
              },
              {
                icon: <Battery className="w-12 h-12" />,
                title: 'Uzun Pil Ömrü',
                description: 'Günlerce kullanım garantisi'
              },
              {
                icon: <Settings className="w-12 h-12" />,
                title: 'Akıllı Özellikler',
                description: 'AI destekli akıllı fonksiyonlar'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <QuickViewDialog
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

    </div>
  );
}