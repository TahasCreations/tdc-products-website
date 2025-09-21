'use client';

import Image from 'next/image';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  ChartBarIcon,
  ClockIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useRealtimePriceUpdates, useOptimizedPriceDisplay, useMemoryMonitor } from '../../hooks/useRealtimePriceUpdates';

interface Product {
  id: string;
  symbol: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  category: string;
  image: string;
  isActive: boolean;
  lastUpdate: Date;
}

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdate: Date;
}

// Demo ürün verileri - Gerçek verilerle değiştirilecek
const initialProducts: Omit<Product, 'currentPrice' | 'change' | 'changePercent' | 'lastUpdate'>[] = [];

const initialIndices: Omit<MarketIndex, 'lastUpdate'>[] = [
  {
    name: 'TDC 100',
    value: 9234.56,
    change: 123.45,
    changePercent: 1.35
  },
  {
    name: 'TDC 30',
    value: 8567.89,
    change: 89.12,
    changePercent: 1.05
  },
  {
    name: 'TDC 50',
    value: 7890.12,
    change: 67.34,
    changePercent: 0.86
  }
];

export default function TdcBistPage() {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Memory monitoring
  const memoryUsage = useMemoryMonitor();

  // Optimize edilmiş gerçek zamanlı fiyat güncellemeleri
  const { products, isUpdating } = useRealtimePriceUpdates(initialProducts, {
    updateInterval: 30000, // 30 saniye
    maxChangePercent: 3, // %3 maksimum değişim
    isActive: isLive
  });

  // Optimize edilmiş görüntüleme
  const displayProducts = useOptimizedPriceDisplay(products);

  // Endeksleri güncelle
  const updateIndices = useCallback(() => {
    setIndices(prevIndices =>
      prevIndices.map(index => {
        const randomChange = (Math.random() - 0.5) * 2 * 0.5; // -0.5% ile +0.5% arası
        const newValue = index.value * (1 + randomChange / 100);
        const change = newValue - index.value;
        const changePercent = (change / index.value) * 100;
        
        return {
          ...index,
          value: newValue,
          change,
          changePercent,
          lastUpdate: new Date()
        };
      })
    );
  }, []);

  // Başlangıç endeks verilerini yükle
  useEffect(() => {
    const initialIndicesData: MarketIndex[] = initialIndices.map(index => ({
      ...index,
      lastUpdate: new Date()
    }));

    setIndices(initialIndicesData);
  }, []);

  // Endeksleri güncelle
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      updateIndices();
      setLastUpdate(new Date());
    }, 30000); // 30 saniye

    return () => clearInterval(interval);
  }, [isLive, updateIndices]);

  // Filtrelenmiş ürünler
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return displayProducts;
    return displayProducts.filter(product => product.category === selectedCategory);
  }, [displayProducts, selectedCategory]);

  // Kategoriler
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(displayProducts.map(p => p.category))];
    return cats;
  }, [displayProducts]);

  // Format fiyat
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Format yüzde
  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute top-20 right-20 w-3 h-3 bg-yellow-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-red-400 rounded-full animate-ping delay-2000"></div>
          <div className="absolute bottom-10 right-10 w-5 h-5 bg-blue-400 rounded-full animate-ping delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="w-8 h-8 text-white" />
              <h1 className="text-4xl md:text-6xl font-extrabold text-white">
                TDC BİST
              </h1>
            </div>
            <div className="ml-4 flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-white font-medium">
                {isLive ? 'CANLI' : 'DURAKLADI'}
              </span>
            </div>
          </div>
          
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            TDC Products koleksiyon ürünlerinin gerçek zamanlı fiyat takibi ve piyasa analizi
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                isLive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLive ? '⏸️ Duraklat' : '▶️ Başlat'}
            </button>
            
            <div className="flex items-center space-x-2 text-blue-100">
              <ClockIcon className="w-5 h-5" />
              <span>Son Güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <SparklesIcon className="w-8 h-8 text-purple-600 mr-3" />
            Piyasa Genel Görünümü
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {indices.map((index) => (
              <div key={index.name} className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{index.name}</h3>
                  <div className={`p-2 rounded-full ${
                    index.changePercent >= 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {index.changePercent >= 0 ? (
                      <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </div>
                
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {index.value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </div>
                
                <div className={`flex items-center text-sm font-medium ${
                  index.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="mr-2">
                    {formatPercent(index.changePercent)}
                  </span>
                  <span>
                    ({index.change >= 0 ? '+' : ''}{index.change.toFixed(2)})
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  Güncelleme: {index.lastUpdate.toLocaleTimeString('tr-TR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tümü
            </button>
            {categories.filter(cat => cat !== 'all').map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Table */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <FireIcon className="w-8 h-8 text-orange-600 mr-3" />
            Koleksiyon Ürünleri
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Ürün
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Son Fiyat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Değişim
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Hacim
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Piyasa Değeri
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.symbol}</div>
                            <div className="text-sm text-gray-500">{product.name}</div>
                            <div className="text-xs text-blue-600">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-gray-900">
                          {formatPrice(product.currentPrice)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Base: {formatPrice(product.basePrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center text-sm font-medium ${
                          product.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.changePercent >= 0 ? (
                            <ArrowUpIcon className="w-4 h-4 mr-1" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4 mr-1" />
                          )}
                          {formatPercent(product.changePercent)}
                        </div>
                        <div className={`text-sm ${
                          product.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {product.change >= 0 ? '+' : ''}{formatPrice(product.change)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.volume}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.marketCap}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            product.isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                          }`}></div>
                          <span className="text-sm text-gray-600">
                            {product.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {product.lastUpdate.toLocaleTimeString('tr-TR')}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Canlı İstatistikler</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-white mb-2">
                {displayProducts.length}
              </div>
              <div className="text-blue-100">Aktif Ürün</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-white mb-2">
                {displayProducts.filter(p => p.changePercent > 0).length}
              </div>
              <div className="text-blue-100">Yükselen</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-white mb-2">
                {displayProducts.filter(p => p.changePercent < 0).length}
              </div>
              <div className="text-blue-100">Düşen</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-white mb-2">
                {isLive ? '30s' : '⏸️'}
              </div>
              <div className="text-blue-100">Güncelleme</div>
            </div>
          </div>
          
          {/* Memory Usage Indicator */}
          {memoryUsage && (
            <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100 text-sm">Memory Usage</span>
                <span className="text-white text-sm font-medium">
                  {memoryUsage.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(memoryUsage.percentage, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-blue-200 mt-1">
                {memoryUsage.used.toFixed(1)}MB / {memoryUsage.total.toFixed(1)}MB
              </div>
            </div>
          )}
          
          {/* Update Status */}
          {isUpdating && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-blue-100">
              <div className="w-4 h-4 border-2 border-blue-100 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Fiyatlar güncelleniyor...</span>
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Yasal Uyarı</h3>
            <p className="text-yellow-700 text-sm">
              Bu sayfada yer alan fiyat değişimleri simüle edilmiştir ve gerçek piyasa verilerini yansıtmamaktadır. 
              Sadece demo amaçlıdır ve yatırım tavsiyesi niteliği taşımamaktadır.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}