'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { 
  SparklesIcon,
  LightBulbIcon,
  ChartBarIcon,
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  EyeIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  description: string;
  inStock: boolean;
  discount?: number;
}

interface UserBehavior {
  viewedProducts: string[];
  purchasedProducts: string[];
  wishlistedProducts: string[];
  cartedProducts: string[];
  searchHistory: string[];
  categoryPreferences: Record<string, number>;
  priceRange: { min: number; max: number };
  brandPreferences: Record<string, number>;
}

interface Recommendation {
  product: Product;
  score: number;
  reason: string;
  confidence: number;
  algorithm: 'collaborative' | 'content-based' | 'hybrid' | 'trending' | 'personalized';
}

interface AIRecommendationEngineProps {
  limit?: number;
  category?: string;
  showReasons?: boolean;
  showConfidence?: boolean;
  algorithm?: 'auto' | 'collaborative' | 'content-based' | 'hybrid' | 'trending';
  context?: string;
  showAlgorithmInfo?: boolean;
  enablePersonalization?: boolean;
}

export default function AIRecommendationEngine({
  limit = 8,
  category,
  showReasons = true,
  showConfidence = true,
  algorithm = 'auto',
  context = 'general',
  showAlgorithmInfo = true,
  enablePersonalization = true
}: AIRecommendationEngineProps) {
  const { user } = useAuth();
  const { state: cartState } = useCart();
  const { wishlistItems: wishlistState } = useWishlist();
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userBehavior, setUserBehavior] = useState<UserBehavior | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithm);
  const [insights, setInsights] = useState<any>(null);

  // Mock products data
  const mockProducts: Product[] = useMemo(() => [
    {
      id: '1',
      title: 'Akıllı Telefon',
      price: 15000,
      image: '/images/products/phone.jpg',
      category: 'Electronics',
      rating: 4.5,
      reviewCount: 128,
      tags: ['smartphone', 'android', 'camera'],
      description: 'Yüksek performanslı akıllı telefon',
      inStock: true,
      discount: 10
    },
    {
      id: '2',
      title: 'Laptop',
      price: 25000,
      image: '/images/products/laptop.jpg',
      category: 'Electronics',
      rating: 4.8,
      reviewCount: 89,
      tags: ['laptop', 'gaming', 'work'],
      description: 'Profesyonel iş ve oyun laptopu',
      inStock: true
    },
    {
      id: '3',
      title: 'Kulaklık',
      price: 2500,
      image: '/images/products/headphones.jpg',
      category: 'Electronics',
      rating: 4.3,
      reviewCount: 256,
      tags: ['headphones', 'wireless', 'audio'],
      description: 'Kablosuz ses deneyimi',
      inStock: true,
      discount: 15
    },
    {
      id: '4',
      title: 'Spor Ayakkabı',
      price: 1200,
      image: '/images/products/shoes.jpg',
      category: 'Fashion',
      rating: 4.6,
      reviewCount: 342,
      tags: ['shoes', 'sports', 'comfort'],
      description: 'Rahat spor ayakkabı',
      inStock: true
    },
    {
      id: '5',
      title: 'Kitap',
      price: 150,
      image: '/images/products/book.jpg',
      category: 'Books',
      rating: 4.7,
      reviewCount: 89,
      tags: ['book', 'education', 'reading'],
      description: 'Eğitici kitap',
      inStock: true
    }
  ], []);

  useEffect(() => {
    fetchUserBehavior();
    generateRecommendations();
  }, [user, selectedAlgorithm, category]);

  const fetchUserBehavior = useCallback(async () => {
    try {
      if (!user) {
        // Anonymous user behavior
        setUserBehavior({
          viewedProducts: ['1', '3'],
          purchasedProducts: [],
          wishlistedProducts: ['2'],
          cartedProducts: ['1'],
          searchHistory: ['telefon', 'kulaklık'],
          categoryPreferences: { 'Electronics': 0.8, 'Fashion': 0.3 },
          priceRange: { min: 1000, max: 20000 },
          brandPreferences: { 'Samsung': 0.6, 'Apple': 0.4 }
        });
        return;
      }

      // Fetch real user behavior from API
      const response = await fetch(`/api/ai/user-behavior/${user.id}`);
      const data = await response.json();
      setUserBehavior(data.behavior);
    } catch (error) {
      console.error('Error fetching user behavior:', error);
      // Fallback to default behavior
      setUserBehavior({
        viewedProducts: [],
        purchasedProducts: [],
        wishlistedProducts: [],
        cartedProducts: [],
        searchHistory: [],
        categoryPreferences: {},
        priceRange: { min: 0, max: 50000 },
        brandPreferences: {}
      });
    }
  }, [user]);

  const generateRecommendations = useCallback(async () => {
    setLoading(true);
    
    try {
      let recommendations: Recommendation[] = [];

      if (selectedAlgorithm === 'auto') {
        // Use hybrid approach for best results
        recommendations = await generateHybridRecommendations();
      } else {
        switch (selectedAlgorithm) {
          case 'collaborative':
            recommendations = await generateCollaborativeRecommendations();
            break;
          case 'content-based':
            recommendations = await generateContentBasedRecommendations();
            break;
          case 'hybrid':
            recommendations = await generateHybridRecommendations();
            break;
          case 'trending':
            recommendations = await generateTrendingRecommendations();
            break;
          default:
            recommendations = await generateHybridRecommendations();
        }
      }

      // Filter by category if specified
      if (category) {
        recommendations = recommendations.filter(rec => 
          rec.product.category === category
        );
      }

      // Limit results
      recommendations = recommendations.slice(0, limit);

      setRecommendations(recommendations);
      generateInsights(recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedAlgorithm, category, limit]);

  const generateCollaborativeRecommendations = useCallback(async (): Promise<Recommendation[]> => {
    // Collaborative filtering based on similar users
    const similarUsers = await findSimilarUsers();
    const recommendations: Recommendation[] = [];

    for (const product of mockProducts) {
      if (userBehavior?.viewedProducts.includes(product.id) || 
          userBehavior?.purchasedProducts.includes(product.id)) {
        continue;
      }

      let score = 0;
      let reason = '';

      // Calculate score based on similar users' preferences
      for (const similarUser of similarUsers) {
        if (similarUser.purchasedProducts.includes(product.id)) {
          score += similarUser.similarity * 0.8;
        }
        if (similarUser.wishlistedProducts.includes(product.id)) {
          score += similarUser.similarity * 0.6;
        }
        if (similarUser.viewedProducts.includes(product.id)) {
          score += similarUser.similarity * 0.4;
        }
      }

      if (score > 0.3) {
        recommendations.push({
          product,
          score,
          reason: `Benzer kullanıcılar bu ürünü beğendi`,
          confidence: Math.min(score * 100, 95),
          algorithm: 'collaborative'
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }, [mockProducts, userBehavior?.purchasedProducts, userBehavior?.viewedProducts]);

  const generateContentBasedRecommendations = useCallback(async (): Promise<Recommendation[]> => {
    const recommendations: Recommendation[] = [];

    for (const product of mockProducts) {
      if (userBehavior?.viewedProducts.includes(product.id) || 
          userBehavior?.purchasedProducts.includes(product.id)) {
        continue;
      }

      let score = 0;
      let reason = '';

      // Category preference
      const categoryScore = userBehavior?.categoryPreferences[product.category] || 0;
      score += categoryScore * 0.4;

      // Price range preference
      if (userBehavior?.priceRange) {
        const { min, max } = userBehavior.priceRange;
        if (product.price >= min && product.price <= max) {
          score += 0.3;
        }
      }

      // Tag similarity
      const userTags = userBehavior?.searchHistory || [];
      const productTags = product.tags;
      const tagMatches = userTags.filter(tag => 
        productTags.some(productTag => 
          productTag.toLowerCase().includes(tag.toLowerCase())
        )
      ).length;
      score += (tagMatches / Math.max(userTags.length, 1)) * 0.3;

      if (score > 0.2) {
        let reasonText = '';
        if (categoryScore > 0.5) {
          reasonText = `${product.category} kategorisini beğeniyorsunuz`;
        } else if (tagMatches > 0) {
          reasonText = 'Aradığınız özelliklere uygun';
        } else {
          reasonText = 'İlgi alanlarınıza uygun';
        }

        recommendations.push({
          product,
          score,
          reason: reasonText,
          confidence: Math.min(score * 100, 90),
          algorithm: 'content-based'
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }, [userBehavior, mockProducts]);

  const generateHybridRecommendations = useCallback(async (): Promise<Recommendation[]> => {
    const collaborative = await generateCollaborativeRecommendations();
    const contentBased = await generateContentBasedRecommendations();
    
    const combined = new Map<string, Recommendation>();

    // Combine recommendations with weighted scores
    collaborative.forEach(rec => {
      const existing = combined.get(rec.product.id);
      if (existing) {
        existing.score = existing.score * 0.6 + rec.score * 0.4;
        existing.reason = `${existing.reason} ve ${rec.reason}`;
        existing.confidence = Math.min((existing.confidence + rec.confidence) / 2, 95);
      } else {
        combined.set(rec.product.id, { ...rec, algorithm: 'hybrid' });
      }
    });

    contentBased.forEach(rec => {
      const existing = combined.get(rec.product.id);
      if (existing) {
        existing.score = existing.score * 0.4 + rec.score * 0.6;
        existing.reason = `${existing.reason} ve ${rec.reason}`;
        existing.confidence = Math.min((existing.confidence + rec.confidence) / 2, 95);
      } else {
        combined.set(rec.product.id, { ...rec, algorithm: 'hybrid' });
      }
    });

    return Array.from(combined.values()).sort((a, b) => b.score - a.score);
  }, [generateCollaborativeRecommendations, generateContentBasedRecommendations]);

  const generateTrendingRecommendations = useCallback(async (): Promise<Recommendation[]> => {
    const recommendations: Recommendation[] = [];

    // Sort products by popularity (rating * review count)
    const trendingProducts = [...mockProducts].sort((a, b) => 
      (b.rating * b.reviewCount) - (a.rating * a.reviewCount)
    );

    trendingProducts.forEach((product, index) => {
      if (userBehavior?.viewedProducts.includes(product.id) || 
          userBehavior?.purchasedProducts.includes(product.id)) {
        return;
      }

      const score = 1 - (index / trendingProducts.length) * 0.5;
      const reason = `Trend ürün - ${product.rating}⭐ (${product.reviewCount} değerlendirme)`;

      recommendations.push({
        product,
        score,
        reason,
        confidence: Math.min(score * 100, 85),
        algorithm: 'trending'
      });
    });

    return recommendations;
  }, [mockProducts, userBehavior?.purchasedProducts, userBehavior?.viewedProducts]);

  const findSimilarUsers = async () => {
    // Mock similar users data
    return [
      {
        id: 'user1',
        similarity: 0.8,
        purchasedProducts: ['1', '3'],
        wishlistedProducts: ['2'],
        viewedProducts: ['1', '2', '3', '4']
      },
      {
        id: 'user2',
        similarity: 0.6,
        purchasedProducts: ['2'],
        wishlistedProducts: ['1', '5'],
        viewedProducts: ['1', '2', '5']
      }
    ];
  };

  const generateInsights = (recommendations: Recommendation[]) => {
    const insights = {
      totalRecommendations: recommendations.length,
      averageConfidence: recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length,
      algorithmDistribution: recommendations.reduce((acc, rec) => {
        acc[rec.algorithm] = (acc[rec.algorithm] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      topCategories: recommendations.reduce((acc, rec) => {
        acc[rec.product.category] = (acc[rec.product.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      priceRange: {
        min: Math.min(...recommendations.map(rec => rec.product.price)),
        max: Math.max(...recommendations.map(rec => rec.product.price)),
        average: recommendations.reduce((sum, rec) => sum + rec.product.price, 0) / recommendations.length
      }
    };

    setInsights(insights);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const getAlgorithmName = (algo: string) => {
    const names: Record<string, string> = {
      'collaborative': 'İşbirlikçi Filtreleme',
      'content-based': 'İçerik Tabanlı',
      'hybrid': 'Hibrit Yaklaşım',
      'trending': 'Trend Ürünler',
      'personalized': 'Kişiselleştirilmiş'
    };
    return names[algo] || algo;
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <SparklesIcon className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Öneri Sistemi</h2>
              <p className="text-gray-600">Size özel ürün önerileri</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="auto">Otomatik</option>
              <option value="hybrid">Hibrit</option>
              <option value="collaborative">İşbirlikçi</option>
              <option value="content-based">İçerik Tabanlı</option>
              <option value="trending">Trend</option>
            </select>
          </div>
        </div>

        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <LightBulbIcon className="w-6 h-6 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Toplam Öneri</p>
                  <p className="text-2xl font-bold text-blue-900">{insights.totalRecommendations}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <ChartBarIcon className="w-6 h-6 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">Ort. Güven</p>
                  <p className="text-2xl font-bold text-green-900">%{Math.round(insights.averageConfidence)}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <UserIcon className="w-6 h-6 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-900">Algoritma</p>
                  <p className="text-lg font-bold text-purple-900">
                    {getAlgorithmName(selectedAlgorithm)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <ShoppingBagIcon className="w-6 h-6 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-900">Fiyat Aralığı</p>
                  <p className="text-lg font-bold text-orange-900">
                    {formatPrice(insights.priceRange.min)} - {formatPrice(insights.priceRange.max)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendations.map((recommendation) => (
          <div key={recommendation.product.id} className="group relative">
            <div className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={recommendation.product.image}
                  alt={recommendation.product.title}
                  width={300}
                  height={192}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                {recommendation.product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    -%{recommendation.product.discount}
                  </div>
                )}
                {showConfidence && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    %{Math.round(recommendation.confidence)}
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {recommendation.product.title}
              </h3>

              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(recommendation.product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  ({recommendation.product.reviewCount})
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(recommendation.product.price)}
                  </span>
                  {recommendation.product.discount && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {formatPrice(recommendation.product.price / (1 - recommendation.product.discount / 100))}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {recommendation.product.category}
                </span>
              </div>

              {showReasons && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 italic">
                    &quot;{recommendation.reason}&quot;
                  </p>
                </div>
              )}

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

      {recommendations.length === 0 && (
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
