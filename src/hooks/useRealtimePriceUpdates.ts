import { useState, useEffect, useCallback, useRef } from 'react';

interface PriceUpdateConfig {
  updateInterval: number; // milisaniye
  maxChangePercent: number; // maksimum değişim yüzdesi
  isActive: boolean;
}

interface ProductPrice {
  id: string;
  symbol: string;
  name: string;
  basePrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  category: string;
  image: string;
  isActive: boolean;
  lastUpdate: Date;
}

export const useRealtimePriceUpdates = (
  products: Omit<ProductPrice, 'currentPrice' | 'change' | 'changePercent' | 'lastUpdate'>[],
  config: PriceUpdateConfig
) => {
  const [updatedProducts, setUpdatedProducts] = useState<ProductPrice[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<Date>(new Date());

  // Rastgele fiyat değişimi hesaplama (optimize edilmiş)
  const calculatePriceChange = useCallback((basePrice: number, currentPrice: number) => {
    const maxChange = config.maxChangePercent;
    const randomChange = (Math.random() - 0.5) * 2 * maxChange;
    const newPrice = basePrice * (1 + randomChange / 100);
    const change = newPrice - currentPrice;
    const changePercent = (change / currentPrice) * 100;
    
    return {
      price: Math.max(newPrice, basePrice * 0.5), // Minimum fiyat koruması
      change,
      changePercent
    };
  }, [config.maxChangePercent]);

  // Ürünleri güncelle (batch update ile optimize edilmiş)
  const updateProducts = useCallback(() => {
    if (!config.isActive) return;

    setIsUpdating(true);
    lastUpdateRef.current = new Date();

    setUpdatedProducts(prevProducts => {
      const newProducts = prevProducts.map(product => {
        const baseProduct = products.find(p => p.id === product.id);
        if (!baseProduct) return product;

        const { price, change, changePercent } = calculatePriceChange(
          baseProduct.basePrice,
          product.currentPrice
        );

        return {
          ...product,
          currentPrice: price,
          change,
          changePercent,
          lastUpdate: lastUpdateRef.current
        };
      });

      // State güncellemesi tamamlandıktan sonra isUpdating'i false yap
      setTimeout(() => setIsUpdating(false), 100);
      
      return newProducts;
    });
  }, [products, calculatePriceChange, config.isActive]);

  // Başlangıç verilerini yükle
  useEffect(() => {
    const initialProducts: ProductPrice[] = products.map(product => ({
      ...product,
      currentPrice: product.basePrice,
      change: 0,
      changePercent: 0,
      lastUpdate: new Date()
    }));

    setUpdatedProducts(initialProducts);
  }, [products]);

  // Interval'ı başlat/durdur
  useEffect(() => {
    if (config.isActive) {
      intervalRef.current = setInterval(updateProducts, config.updateInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [config.isActive, config.updateInterval, updateProducts]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    products: updatedProducts,
    isUpdating,
    lastUpdate: lastUpdateRef.current
  };
};

// Performans optimizasyonu için memoization hook'u
export const useOptimizedPriceDisplay = (products: ProductPrice[]) => {
  const [displayProducts, setDisplayProducts] = useState<ProductPrice[]>([]);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Debounce updates to prevent excessive re-renders
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      setDisplayProducts([...products]);
    }, 50); // 50ms debounce

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [products]);

  return displayProducts;
};

// Memory usage monitoring
export const useMemoryMonitor = () => {
  const [memoryUsage, setMemoryUsage] = useState<{
    used: number;
    total: number;
    percentage: number;
  } | null>(null);

  useEffect(() => {
    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const used = memory.usedJSHeapSize / 1024 / 1024; // MB
        const total = memory.totalJSHeapSize / 1024 / 1024; // MB
        const percentage = (used / total) * 100;

        setMemoryUsage({ used, total, percentage });
      }
    };

    checkMemory();
    const interval = setInterval(checkMemory, 5000); // Her 5 saniyede kontrol

    return () => clearInterval(interval);
  }, []);

  return memoryUsage;
};
