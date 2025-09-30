/**
 * Product Detail Page with Recommendations
 * Shows product details and similar product recommendations
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Heart, Share, Star, Eye, ArrowLeft } from 'lucide-react';
import ProductRecommendations from '@/components/product-recommendations';

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
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  stockCount?: number;
}

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Mock user ID - in real app, this would come from auth context
  const userId = 'user-123';

  // Fetch product details
  const fetchProduct = async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      // Mock product data - in real app, this would call an API
      const mockProduct: Product = {
        id: productId,
        title: 'Gaming Laptop ASUS ROG Strix G15',
        description: 'High-performance gaming laptop with RTX 4070 graphics card, 16GB RAM, 1TB SSD, 15.6" FHD 144Hz display. Perfect for gaming and content creation.',
        category: 'Electronics',
        brand: 'ASUS',
        price: 25000,
        tags: ['gaming', 'laptop', 'rtx', 'high-performance', 'gaming-laptop'],
        images: [
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
        ],
        specifications: {
          processor: 'Intel i7-13700H',
          graphics: 'RTX 4070',
          ram: '16GB DDR5',
          storage: '1TB NVMe SSD',
          screen: '15.6" FHD 144Hz',
          weight: '2.3 kg',
          battery: '90Wh',
          ports: 'USB-C, USB-A, HDMI, Ethernet',
        },
        rating: 4.5,
        reviewCount: 128,
        inStock: true,
        stockCount: 15,
      };

      setProduct(mockProduct);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // Track product view
  useEffect(() => {
    if (product && userId) {
      // Track product view event
      fetch('/api/recommendations/events/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          sessionId: `session_${Date.now()}`,
          productId: product.id,
          metadata: {
            context: 'product_detail',
            timestamp: new Date().toISOString(),
          },
        }),
      }).catch(error => {
        console.error('Error tracking product view:', error);
      });
    }
  }, [product, userId]);

  // Handle add to cart
  const handleAddToCart = (productId: string) => {
    // Track add to cart event
    fetch('/api/recommendations/events/add-to-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        sessionId: `session_${Date.now()}`,
        productId,
        metadata: {
          context: 'product_detail',
          quantity,
          timestamp: new Date().toISOString(),
        },
      }),
    }).catch(error => {
      console.error('Error tracking add to cart:', error);
    });

    // Add to cart logic here
    console.log('Added to cart:', productId, 'quantity:', quantity);
  };

  // Handle product click in recommendations
  const handleRecommendationClick = (productId: string) => {
    // Navigate to product detail page
    window.location.href = `/product/${productId}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="w-20 h-20" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {error || 'Ürün bulunamadı'}
            </p>
            <Button onClick={fetchProduct} variant="outline">
              Tekrar Dene
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Back Button */}
      <Button variant="outline" onClick={() => window.history.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Geri Dön
      </Button>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviewCount} değerlendirme)</span>
              </div>
              <Badge variant="outline">{product.brand}</Badge>
              <Badge variant="secondary">{product.category}</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">₺{product.price.toLocaleString()}</span>
              {product.inStock && (
                <Badge className="bg-green-100 text-green-800">
                  Stokta ({product.stockCount} adet)
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="font-medium">
                Miktar:
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => handleAddToCart(product.id)}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Sepete Ekle
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                Favorile
              </Button>
              <Button size="lg" variant="outline">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Ürün Özellikleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b">
                <span className="font-medium capitalize">{key}:</span>
                <span className="text-muted-foreground">{value as string}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Similar Products Recommendations */}
      <ProductRecommendations
        productId={product.id}
        userId={userId}
        context="product_detail"
        title="Benzer Ürünler"
        limit={8}
        showAlgorithm={true}
        showScores={true}
        onProductClick={handleRecommendationClick}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

