'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../../lib/supabase';

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    slug: string;
    category: string;
    stock: number;
  };
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const wishlistCount = wishlistItems.length;

  // Wishlist'i getir
  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          id,
          product_id,
          created_at,
          products (
            id,
            title,
            price,
            image,
            slug,
            category,
            stock
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Wishlist fetch error:', error);
        return;
      }

      if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
          product_id: item.product_id,
          created_at: item.created_at,
          product: item.products[0] // products bir array olduğu için ilk elemanı al
        }));
        setWishlistItems(formattedData);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error('Wishlist fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Wishlist'e ürün ekle
  const addToWishlist = async (productId: string) => {
    if (!user) {
      alert('Wishlist\'e ürün eklemek için giriş yapmanız gerekiyor!');
      return;
    }

    try {
      // Önce ürünün zaten wishlist'te olup olmadığını kontrol et
      const isAlreadyInWishlist = wishlistItems.some(item => item.product_id === productId);
      if (isAlreadyInWishlist) {
        alert('Bu ürün zaten wishlist\'inizde!');
        return;
      }

      const { error } = await supabase
        .from('wishlists')
        .insert([
          {
            user_id: user.id,
            product_id: productId
          }
        ]);

      if (error) {
        console.error('Add to wishlist error:', error);
        alert('Ürün wishlist\'e eklenirken hata oluştu!');
        return;
      }

      // Wishlist'i yenile
      await fetchWishlist();
      alert('Ürün wishlist\'e eklendi!');
    } catch (error) {
      console.error('Add to wishlist error:', error);
      alert('Ürün wishlist\'e eklenirken hata oluştu!');
    }
  };

  // Wishlist'ten ürün çıkar
  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Remove from wishlist error:', error);
        alert('Ürün wishlist\'ten çıkarılırken hata oluştu!');
        return;
      }

      // Local state'i güncelle
      setWishlistItems(prev => prev.filter(item => item.product_id !== productId));
      alert('Ürün wishlist\'ten çıkarıldı!');
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      alert('Ürün wishlist\'ten çıkarılırken hata oluştu!');
    }
  };

  // Ürünün wishlist'te olup olmadığını kontrol et
  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.product_id === productId);
  };

  // Wishlist'i temizle
  const clearWishlist = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Clear wishlist error:', error);
        alert('Wishlist temizlenirken hata oluştu!');
        return;
      }

      setWishlistItems([]);
      alert('Wishlist temizlendi!');
    } catch (error) {
      console.error('Clear wishlist error:', error);
      alert('Wishlist temizlenirken hata oluştu!');
    }
  };

  // Kullanıcı değiştiğinde wishlist'i yenile
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user, fetchWishlist]);

  const value: WishlistContextType = {
    wishlistItems,
    wishlistCount,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

