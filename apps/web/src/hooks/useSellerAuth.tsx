'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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

interface SellerAuthContextType {
  seller: Seller | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  updateSeller: (sellerData: Partial<Seller>) => void;
}

const SellerAuthContext = createContext<SellerAuthContextType | undefined>(undefined);

export function SellerAuthProvider({ children }: { children: ReactNode }) {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [token, setToken] = useState<string | null>(null);
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
          setToken(savedToken);
        }
      } catch (error) {
        console.error('Error loading seller session:', error);
        // Clear invalid session data
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
        // Store seller session
        localStorage.setItem('seller_user', JSON.stringify(data.seller));
        localStorage.setItem('seller_token', data.token);
        
        if (rememberMe) {
          localStorage.setItem('remember_seller', 'true');
        }

        setSeller(data.seller);
        setToken(data.token);
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
    // Clear session data
    localStorage.removeItem('seller_user');
    localStorage.removeItem('seller_token');
    localStorage.removeItem('remember_seller');
    
    setSeller(null);
    setToken(null);
    
    // Redirect to seller login
    router.push('/seller/login');
  };

  const updateSeller = (sellerData: Partial<Seller>) => {
    if (seller) {
      const updatedSeller = { ...seller, ...sellerData };
      setSeller(updatedSeller);
      localStorage.setItem('seller_user', JSON.stringify(updatedSeller));
    }
  };

  const contextValue: SellerAuthContextType = {
    seller,
    token,
    isAuthenticated: !!seller && !!token,
    isLoading,
    login,
    logout,
    updateSeller,
  };

  return (
    <SellerAuthContext.Provider value={contextValue}>
      {children}
    </SellerAuthContext.Provider>
  );
}

export function useSellerAuth(): SellerAuthContextType {
  const context = useContext(SellerAuthContext);
  if (context === undefined) {
    throw new Error('useSellerAuth must be used within a SellerAuthProvider');
  }
  return context;
}

// Hook for checking if user is a seller
export function useIsSeller(): boolean {
  const { seller } = useSellerAuth();
  return seller?.role === 'seller';
}

// Hook for getting seller store name
export function useSellerStore(): string | null {
  const { seller } = useSellerAuth();
  return seller?.storeName || null;
}

// Hook for checking seller status
export function useSellerStatus(): 'active' | 'pending' | 'suspended' | null {
  const { seller } = useSellerAuth();
  return seller?.status || null;
}
