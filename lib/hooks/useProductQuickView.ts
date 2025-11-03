/**
 * Product Quick View Hook
 * Kolayca quick view modal'ı yönetmek için
 */

import { useState } from 'react';

export function useProductQuickView() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const openQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsOpen(true);
  };

  const closeQuickView = () => {
    setIsOpen(false);
    // Slight delay before clearing product
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return {
    isOpen,
    selectedProduct,
    openQuickView,
    closeQuickView
  };
}

