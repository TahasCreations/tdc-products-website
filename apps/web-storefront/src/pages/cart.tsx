/**
 * Cart Page with Recommendations
 * Shows cart items and recommended products based on cart contents
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard } from 'lucide-react';
import ProductRecommendations from '@/components/product-recommendations';

interface CartItem {
  id: string;
  productId: string;
  title: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
  inStock: boolean;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock user ID - in real app, this would come from auth context
  const userId = 'user-123';

  // Fetch cart items
  const fetchCartItems = async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock cart data - in real app, this would call an API
      const mockCartItems: CartItem[] = [
        {
          id: 'cart-1',
          productId: 'prod-1',
          title: 'Gaming Laptop ASUS ROG Strix G15',
          brand: 'ASUS',
          price: 25000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200',
          inStock: true,
        },
        {
          id: 'cart-2',
          productId: 'prod-2',
          title: 'Gaming Mouse Logitech G Pro X',
          brand: 'Logitech',
          price: 1200,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200',
          inStock: true,
        },
        {
          id: 'cart-3',
          productId: 'prod-3',
          title: 'Mechanical Keyboard Corsair K95',
          brand: 'Corsair',
          price: 1800,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=200',
          inStock: true,
        },
      ];

      setCartItems(mockCartItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Update quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over 500 TL
  const tax = subtotal * 0.18; // 18% KDV
  const total = subtotal + shipping + tax;

  // Handle add to cart from recommendations
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
          context: 'cart',
          timestamp: new Date().toISOString(),
        },
      }),
    }).catch(error => {
      console.error('Error tracking add to cart:', error);
    });

    // Add to cart logic here
    console.log('Added to cart from recommendations:', productId);
  };

  // Handle product click in recommendations
  const handleRecommendationClick = (productId: string) => {
    // Navigate to product detail page
    window.location.href = `/product/${productId}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="w-20 h-20" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchCartItems} variant="outline">
              Tekrar Dene
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sepetiniz Boş</h2>
            <p className="text-muted-foreground mb-6">
              Alışverişe devam etmek için ürünlere göz atın
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Alışverişe Başla
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
        <h1 className="text-3xl font-bold">Sepetim</h1>
        <Badge variant="secondary">{cartItems.length} ürün</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.brand}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg">
                          ₺{(item.price * item.quantity).toLocaleString()}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-muted-foreground">
                            ₺{item.price.toLocaleString()} × {item.quantity}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {!item.inStock && (
                      <Badge variant="destructive" className="text-xs">
                        Stokta Yok
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Özeti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Ara Toplam:</span>
                <span>₺{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Kargo:</span>
                <span>{shipping === 0 ? 'Ücretsiz' : `₺${shipping}`}</span>
              </div>
              <div className="flex justify-between">
                <span>KDV (%18):</span>
                <span>₺{tax.toLocaleString()}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Toplam:</span>
                  <span>₺{total.toLocaleString()}</span>
                </div>
              </div>
              
              <Button size="lg" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Ödemeye Geç
              </Button>
              
              {shipping > 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  ₺{500 - subtotal} daha alışveriş yapın, kargo ücretsiz olsun!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Cart-based Recommendations */}
      <ProductRecommendations
        userId={userId}
        context="cart"
        title="Sepetinize Uygun Ürünler"
        limit={6}
        showAlgorithm={true}
        onProductClick={handleRecommendationClick}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

