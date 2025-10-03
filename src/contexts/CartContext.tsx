'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image?: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  saveForLater: CartItem[];
  appliedCoupons: string[];
  freeShippingThreshold: number;
  freeShippingProgress: number;
  isFreeShippingEligible: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  moveToSaved: (id: string) => void;
  moveToCart: (id: string) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: (code: string) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = 'tdc_cart_v1';
const STORAGE_SAVED_KEY = 'tdc_saved_v1';
const STORAGE_COUPONS_KEY = 'tdc_coupons_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [saveForLater, setSaveForLater] = useState<CartItem[]>([]);
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
  const freeShippingThreshold = 500; // ₺500

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setItems(JSON.parse(raw));
      const rawSaved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_SAVED_KEY) : null;
      if (rawSaved) setSaveForLater(JSON.parse(rawSaved));
      const rawCoupons = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_COUPONS_KEY) : null;
      if (rawCoupons) setAppliedCoupons(JSON.parse(rawCoupons));
    } catch {/* noop */}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
    } catch {/* noop */}
  }, [items]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(saveForLater));
      }
    } catch {/* noop */}
  }, [saveForLater]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_COUPONS_KEY, JSON.stringify(appliedCoupons));
      }
    } catch {/* noop */}
  }, [appliedCoupons]);

  const count = useMemo(() => items.reduce((a, b) => a + b.qty, 0), [items]);
  const total = useMemo(() => items.reduce((a, b) => a + b.qty * b.price, 0), [items]);
  const freeShippingProgress = useMemo(() => Math.min((total / freeShippingThreshold) * 100, 100), [total, freeShippingThreshold]);
  const isFreeShippingEligible = useMemo(() => total >= freeShippingThreshold, [total, freeShippingThreshold]);

  const addItem: CartContextValue['addItem'] = (item, qty = 1) => {
    setItems(prev => {
      const i = prev.findIndex(p => p.id === item.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(p => p.id !== id));
  const setQty = (id: string, qty: number) => setItems(prev => prev.map(p => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  const clear = () => setItems([]);
  const moveToSaved = (id: string) => {
    setItems(prev => {
      const found = prev.find(p => p.id === id);
      if (found) setSaveForLater(s => (s.find(i => i.id === id) ? s : [...s, found]));
      return prev.filter(p => p.id !== id);
    });
  };
  const moveToCart = (id: string) => {
    setSaveForLater(prev => {
      const found = prev.find(p => p.id === id);
      if (found) setItems(s => (s.find(i => i.id === id) ? s : [...s, found]));
      return prev.filter(p => p.id !== id);
    });
  };

  const applyCoupon = (code: string): boolean => {
    const validCoupons = ['INDIRIM10', 'KARGO20', 'YENI15'];
    if (validCoupons.includes(code.toUpperCase()) && !appliedCoupons.includes(code.toUpperCase())) {
      setAppliedCoupons(prev => [...prev, code.toUpperCase()]);
      return true;
    }
    return false;
  };

  const removeCoupon = (code: string) => {
    setAppliedCoupons(prev => prev.filter(c => c !== code));
  };

  const value: CartContextValue = {
    items,
    count,
    total,
    isOpen,
    saveForLater,
    appliedCoupons,
    freeShippingThreshold,
    freeShippingProgress,
    isFreeShippingEligible,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen(v => !v),
    addItem,
    removeItem,
    setQty,
    clear,
    moveToSaved,
    moveToCart,
    applyCoupon,
    removeCoupon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}


