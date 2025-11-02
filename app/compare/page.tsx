"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { X, Plus, Check, ShoppingCart, Star, TrendingUp, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  stock: number;
  specifications: Record<string, string>;
}

const FEATURE_CATEGORIES = [
  { key: 'basic', label: 'Temel Özellikler' },
  { key: 'specs', label: 'Teknik Özellikler' },
  { key: 'dimensions', label: 'Boyutlar' },
  { key: 'pricing', label: 'Fiyatlandırma' },
  { key: 'availability', label: 'Stok & Kargo' },
];

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  useEffect(() => {
    const productIds = searchParams.get('ids')?.split(',') || [];
    if (productIds.length > 0) {
      fetchProducts(productIds);
    } else {
      setIsLoading(false);
    }
  }, [searchParams]);

  const fetchProducts = async (ids: string[]) => {
    setIsLoading(true);
    try {
      const responses = await Promise.all(
        ids.map(id => fetch(`/api/products/${id}`).then(res => res.json()))
      );
      setProducts(responses.filter(Boolean));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      setSearchResults(data.products || []);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const addProduct = (product: Product) => {
    if (products.length >= 4) {
      alert('Maksimum 4 ürün karşılaştırabilirsiniz');
      return;
    }
    if (products.some(p => p.id === product.id)) {
      alert('Bu ürün zaten eklendi');
      return;
    }

    const newProducts = [...products, product];
    setProducts(newProducts);
    updateUrl(newProducts);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeProduct = (productId: string) => {
    const newProducts = products.filter(p => p.id !== productId);
    setProducts(newProducts);
    updateUrl(newProducts);
  };

  const updateUrl = (productList: Product[]) => {
    const ids = productList.map(p => p.id).join(',');
    router.push(`/compare${ids ? `?ids=${ids}` : ''}`);
  };

  const getComparisonFeatures = () => {
    const allFeatures: Record<string, { label: string; values: (string | number | null)[]; category: string }> = {};

    products.forEach((product, index) => {
      // Basic info
      allFeatures['name'] = {
        label: 'Ürün Adı',
        values: products.map(p => p.name),
        category: 'basic',
      };
      allFeatures['price'] = {
        label: 'Fiyat',
        values: products.map(p => `₺${p.price.toFixed(2)}`),
        category: 'pricing',
      };
      allFeatures['rating'] = {
        label: 'Değerlendirme',
        values: products.map(p => `${p.rating}/5 (${p.reviews} yorum)`),
        category: 'basic',
      };
      allFeatures['stock'] = {
        label: 'Stok Durumu',
        values: products.map(p => p.stock > 0 ? `${p.stock} adet` : 'Tükendi'),
        category: 'availability',
      };

      // Specifications
      Object.entries(product.specifications || {}).forEach(([key, value]) => {
        if (!allFeatures[key]) {
          allFeatures[key] = {
            label: key,
            values: new Array(products.length).fill('-'),
            category: 'specs',
          };
        }
        allFeatures[key].values[index] = value;
      });
    });

    return allFeatures;
  };

  const getBestValue = (feature: string, values: (string | number | null)[]) => {
    if (feature === 'price') {
      const prices = values.map(v => 
        typeof v === 'string' ? parseFloat(v.replace('₺', '').replace(',', '')) : 0
      );
      const minPrice = Math.min(...prices);
      return prices.indexOf(minPrice);
    }
    if (feature === 'rating') {
      const ratings = values.map(v =>
        typeof v === 'string' ? parseFloat(v.split('/')[0]) : 0
      );
      const maxRating = Math.max(...ratings);
      return ratings.indexOf(maxRating);
    }
    return -1;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ürün Karşılaştırma
          </h1>
          <p className="text-gray-600">
            En fazla 4 ürünü yan yana karşılaştırın ve size en uygun olanı bulun
          </p>
        </div>

        {/* Add Product */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Karşılaştırmak için ürün arayın..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none"
            />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addProduct(product)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors flex items-center space-x-4 text-left"
                  >
                    <div className="w-16 h-16 relative bg-gray-100 rounded-lg flex-shrink-0">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">₺{product.price.toFixed(2)}</p>
                    </div>
                    <Plus className="w-5 h-5 text-indigo-600" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Henüz ürün eklemediniz
            </h3>
            <p className="text-gray-600">
              Karşılaştırmak istediğiniz ürünleri yukarıdaki arama kutusundan ekleyin
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                    <th className="px-6 py-4 text-left text-white font-semibold sticky left-0 bg-indigo-600">
                      Özellik
                    </th>
                    {products.map((product) => (
                      <th key={product.id} className="px-6 py-4 min-w-[250px]">
                        <div className="space-y-3">
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors ml-auto block"
                          >
                            <X className="w-5 h-5 text-white" />
                          </button>
                          <div className="relative w-full h-48 bg-white/10 rounded-xl overflow-hidden">
                            {product.image && (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <Link
                            href={`/products/${product.slug}`}
                            className="text-white font-semibold hover:underline block"
                          >
                            {product.name}
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_CATEGORIES.map((category) => {
                    const features = Object.entries(getComparisonFeatures()).filter(
                      ([_, data]) => data.category === category.key
                    );

                    if (features.length === 0) return null;

                    return (
                      <>
                        <tr key={category.key} className="bg-gray-50">
                          <td
                            colSpan={products.length + 1}
                            className="px-6 py-3 font-semibold text-gray-900"
                          >
                            {category.label}
                          </td>
                        </tr>
                        {features.map(([key, data]) => {
                          const bestIndex = getBestValue(key, data.values);
                          return (
                            <tr key={key} className="border-b border-gray-100">
                              <td className="px-6 py-4 font-medium text-gray-700 sticky left-0 bg-white">
                                {data.label}
                              </td>
                              {data.values.map((value, index) => (
                                <td
                                  key={index}
                                  className={`px-6 py-4 ${
                                    bestIndex === index
                                      ? 'bg-green-50 font-semibold text-green-700'
                                      : 'text-gray-600'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    {bestIndex === index && (
                                      <Award className="w-4 h-4 text-green-600" />
                                    )}
                                    <span>{value || '-'}</span>
                                  </div>
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </>
                    );
                  })}

                  {/* Action Buttons */}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-900 sticky left-0 bg-gray-50">
                      İşlemler
                    </td>
                    {products.map((product) => (
                      <td key={product.id} className="px-6 py-4">
                        <div className="space-y-2">
                          <Link
                            href={`/products/${product.slug}`}
                            className="block w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-center font-semibold"
                          >
                            Detayları Gör
                          </Link>
                          <button
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                            disabled={product.stock === 0}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Sepete Ekle</span>
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

