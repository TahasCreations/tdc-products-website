'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Seller {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  storeName: string;
  status: 'active' | 'pending' | 'suspended';
  role: 'seller';
  createdAt: string;
  lastLoginAt?: string;
}

export function useSellerAuth() {
  const [seller, setSeller] = useState<Seller | null>(null);
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

  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
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

  const updateSeller = (sellerData: Partial<Seller>) => {
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
export function useIsSeller(): boolean {
  const { seller } = useSellerAuth();
  return seller?.role === 'seller';
}

export function useSellerStore(): string | null {
  const { seller } = useSellerAuth();
  return seller?.storeName || null;
}

export function useSellerStatus(): 'active' | 'pending' | 'suspended' | null {
  const { seller } = useSellerAuth();
  return seller?.status || null;
}
