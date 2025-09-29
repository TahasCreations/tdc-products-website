'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useSellerAuth() {
  const [seller, setSeller] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load seller session on mount
  useEffect(() => {
    const loadSellerSession = () => {
      try {
        const savedSeller = localStorage.getItem('seller_user');
        const savedToken = localStorage.getItem('seller_token');

        if (savedSeller && savedToken) {
          const sellerData = JSON.parse(savedSeller);
          setSeller(sellerData);
        }
      } catch (error) {
        console.error('Error loading seller session:', error);
        localStorage.removeItem('seller_user');
        localStorage.removeItem('seller_token');
      } finally {
        setIsLoading(false);
      }
    };

    loadSellerSession();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await fetch('/api/auth/seller/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('seller_user', JSON.stringify(data.seller));
        localStorage.setItem('seller_token', data.token);
        
        if (rememberMe) {
          localStorage.setItem('remember_seller', 'true');
        }

        setSeller(data.seller);
        return true;
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('seller_user');
    localStorage.removeItem('seller_token');
    localStorage.removeItem('remember_seller');
    
    setSeller(null);
    router.push('/seller/login');
  };

  const updateSeller = (sellerData) => {
    if (seller) {
      const updatedSeller = { ...seller, ...sellerData };
      setSeller(updatedSeller);
      localStorage.setItem('seller_user', JSON.stringify(updatedSeller));
    }
  };

  return {
    seller,
    isAuthenticated: !!seller,
    isLoading,
    login,
    logout,
    updateSeller,
  };
}

// Helper hooks
export function useIsSeller() {
  const { seller } = useSellerAuth();
  return seller?.role === 'seller';
}

export function useSellerStore() {
  const { seller } = useSellerAuth();
  return seller?.storeName || null;
}

export function useSellerStatus() {
  const { seller } = useSellerAuth();
  return seller?.status || null;
}
