import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStoreContext, StoreContext } from '../hooks/useStoreContext';

interface StoreProviderProps {
  children: React.ReactNode;
}

const StoreContextProvider = createContext<StoreContext | null>(null);

export function StoreProvider({ children }: StoreProviderProps) {
  const storeContext = useStoreContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for store context resolution
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <StoreContextProvider.Provider value={storeContext}>
      {children}
    </StoreContextProvider.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContextProvider);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

export function useStoreInfo() {
  const store = useStore();
  
  return {
    id: store?.storeId,
    slug: store?.storeSlug,
    name: store?.storeName,
    tenantId: store?.tenantId,
    domain: store?.domain,
    isCustomDomain: store?.isCustomDomain || false,
    isStoreRoute: store?.isStoreRoute || false
  };
}

