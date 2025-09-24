'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { 
  SparklesIcon,
  StarIcon,
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  discount?: number;
}

interface SimpleRecommendationEngineProps {
  limit?: number;
  category?: string;
  context?: string;
}

export default function SimpleRecommendationEngine({
  limit = 6,
  category,
  context = 'general'
}: SimpleRecommendationEngineProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gerçek ürünlerden öneriler - API'den çekilecek
  const [realProducts, setRealProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Gerçek ürünleri API'den çek
    const fetchRealProducts = async () => {
      try {
        const response = await fetch('/api/ecommerce?type=products');
        const data = await response.json();
        
        if (data.success && data.products) {
          // API'den gelen ürünleri Product formatına çevir
          const formattedProducts: Product[] = data.products.map((product: any) => ({
            id: product.id,
            title: product.title || product.name,
            price: product.price,
            image: product.image || 'https://via.placeholder.com/400x300?text=No+Image',
            category: product.category,
            rating: product.rating || 4.0,
            reviewCount: product.reviewCount || Math.floor(Math.random() * 100) + 10,
            discount: product.discount || 0
          }));
          
          setRealProducts(formattedProducts);
          
          // Filtreleme işlemi
          let filteredProducts = formattedProducts;

          // Kategori filtresi
          if (category) {
            filteredProducts = formattedProducts.filter(p => p.category === category);
          }

          // Context'e göre özel filtreleme
          switch (context) {
            case 'cart':
              // Sepet içeriğine göre benzer ürünler
              filteredProducts = formattedProducts.filter(p => p.category === 'Electronics');
              break;
            case 'wishlist':
              // İstek listesine göre benzer ürünler
              filteredProducts = formattedProducts.filter(p => p.rating > 4.0);
              break;
            case 'orders':
              // Geçmiş siparişlere göre benzer ürünler
              filteredProducts = formattedProducts.filter(p => p.price > 100);
              break;
            case 'search':
              // Arama sonuçlarına göre benzer ürünler
              filteredProducts = formattedProducts.filter(p => p.title.toLowerCase().includes('akıllı'));
              break;
            case 'product_detail':
              // Ürün detayına göre benzer ürünler
              filteredProducts = formattedProducts.filter(p => p.category === 'Electronics');
              break;
            case 'profile':
              // Profil bilgilerine göre öneriler
              filteredProducts = formattedProducts.filter(p => p.rating > 3.5);
              break;
            case 'blog':
              // Blog içeriğine göre öneriler
              filteredProducts = formattedProducts.filter(p => p.category === 'Books');
              break;
            case 'blog_detail':
              // Blog detayına göre öneriler
              filteredProducts = formattedProducts.filter(p => p.category === 'Books');
              break;
            case 'about':
              // Hakkımızda sayfası için popüler ürünler
              filteredProducts = formattedProducts.filter(p => p.reviewCount > 5);
              break;
            default:
              // Genel öneriler
              filteredProducts = formattedProducts;
          }

          // Rastgele sıralama ve limit uygula
          filteredProducts = filteredProducts
            .sort(() => Math.random() - 0.5)
            .slice(0, limit);
          
          setProducts(filteredProducts);
        } else {
          // API'den veri gelmezse boş array
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRealProducts();
  }, [category, limit, context]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <SparklesIcon className="w-8 h-8 text-purple-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Önerilen Ürünler</h2>
            <p className="text-gray-600">Size özel seçilmiş ürünler</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group relative">
            <div className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    -%{product.discount}
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.title}
              </h3>

              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  ({product.reviewCount})
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.discount && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {formatPrice(product.price / (1 - product.discount / 100))}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mr-2">
                  Sepete Ekle
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <HeartIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <EyeIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <SparklesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Henüz öneri yok
          </h3>
          <p className="text-gray-600">
            Daha fazla ürün görüntüleyerek kişiselleştirilmiş öneriler alabilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}
