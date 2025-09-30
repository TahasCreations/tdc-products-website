/**
 * Product Recommendations Component
 * Displays product recommendations with event tracking
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, ShoppingCart, Heart, Star } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  tags: string[];
  images: string[];
  specifications: Record<string, any>;
}

interface Recommendation {
  product: Product;
  score: number;
  reason: string;
  algorithm: 'item_similarity' | 'collaborative' | 'content_based' | 'trending';
}

interface RecommendationResult {
  recommendations: Recommendation[];
  total: number;
  algorithm: string;
  processingTime: number;
}

interface ProductRecommendationsProps {
  productId?: string;
  userId?: string;
  sessionId?: string;
  context: 'product_detail' | 'cart' | 'homepage' | 'search';
  title?: string;
  limit?: number;
  showAlgorithm?: boolean;
  showScores?: boolean;
  onProductClick?: (productId: string) => void;
  onAddToCart?: (productId: string) => void;
}

export default function ProductRecommendations({
  productId,
  userId,
  sessionId,
  context,
  title,
  limit = 8,
  showAlgorithm = false,
  showScores = false,
  onProductClick,
  onAddToCart,
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate session ID if not provided
  const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Fetch recommendations
  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (productId) params.append('productId', productId);
      if (userId) params.append('userId', userId);
      params.append('context', context);
      params.append('limit', limit.toString());

      const response = await fetch(`/api/recommendations?${params}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          userId,
          sessionId: currentSessionId,
          context,
          limit,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setRecommendations(data.data.recommendations);
      } else {
        setError(data.error || 'Failed to fetch recommendations');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [productId, userId, context, limit]);

  // Track product view
  const trackProductView = async (productId: string) => {
    if (!userId) return;

    try {
      await fetch('/api/recommendations/events/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          sessionId: currentSessionId,
          productId,
          metadata: {
            context,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Error tracking product view:', error);
    }
  };

  // Track product click
  const trackProductClick = async (productId: string) => {
    if (!userId) return;

    try {
      await fetch('/api/recommendations/events/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          sessionId: currentSessionId,
          productId,
          metadata: {
            context,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Error tracking product click:', error);
    }
  };

  // Track add to cart
  const trackAddToCart = async (productId: string) => {
    if (!userId) return;

    try {
      await fetch('/api/recommendations/events/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          sessionId: currentSessionId,
          productId,
          metadata: {
            context,
            timestamp: new Date().toISOString(),
          },
        }),
      });
    } catch (error) {
      console.error('Error tracking add to cart:', error);
    }
  };

  // Handle product click
  const handleProductClick = (productId: string) => {
    trackProductClick(productId);
    onProductClick?.(productId);
  };

  // Handle add to cart
  const handleAddToCart = (productId: string) => {
    trackAddToCart(productId);
    onAddToCart?.(productId);
  };

  // Get context-specific title
  const getTitle = () => {
    if (title) return title;
    
    switch (context) {
      case 'product_detail':
        return 'Benzer Ürünler';
      case 'cart':
        return 'Sepetinize Uygun Ürünler';
      case 'homepage':
        return 'Önerilen Ürünler';
      case 'search':
        return 'İlgili Ürünler';
      default:
        return 'Önerilen Ürünler';
    }
  };

  // Get algorithm badge color
  const getAlgorithmBadgeColor = (algorithm: string) => {
    switch (algorithm) {
      case 'item_similarity':
        return 'bg-blue-100 text-blue-800';
      case 'collaborative':
        return 'bg-green-100 text-green-800';
      case 'content_based':
        return 'bg-purple-100 text-purple-800';
      case 'trending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: limit }).map((_, index) => (
              <Card key={index}>
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchRecommendations} variant="outline">
              Tekrar Dene
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{getTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Henüz öneri bulunmuyor.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
        <CardDescription>
          {recommendations.length} ürün önerisi
          {showAlgorithm && ` • ${recommendations[0]?.algorithm || 'unknown'} algoritması`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((recommendation) => (
            <Card 
              key={recommendation.product.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleProductClick(recommendation.product.id)}
            >
              <div className="aspect-square bg-muted flex items-center justify-center relative">
                {recommendation.product.images?.[0] ? (
                  <img
                    src={recommendation.product.images[0]}
                    alt={recommendation.product.title}
                    className="w-full h-full object-cover"
                    onLoad={() => trackProductView(recommendation.product.id)}
                  />
                ) : (
                  <div className="text-muted-foreground">No Image</div>
                )}
                
                {showScores && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {(recommendation.score * 100).toFixed(0)}%
                    </Badge>
                  </div>
                )}
                
                {showAlgorithm && (
                  <div className="absolute top-2 left-2">
                    <Badge className={`text-xs ${getAlgorithmBadgeColor(recommendation.algorithm)}`}>
                      {recommendation.algorithm}
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold line-clamp-2 text-sm">
                    {recommendation.product.title}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {recommendation.product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">
                      ₺{recommendation.product.price.toLocaleString()}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {recommendation.product.brand}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {recommendation.product.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {recommendation.reason && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {recommendation.reason}
                    </p>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(recommendation.product.id);
                      }}
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Sepete Ekle
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle wishlist
                      }}
                    >
                      <Heart className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

