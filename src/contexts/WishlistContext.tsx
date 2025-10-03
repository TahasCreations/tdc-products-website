'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type WishlistItem = {
  id: string;
  title: string;
  slug?: string;
  image?: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  has: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);
const STORAGE_KEY = 'tdc_wishlist_v1';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
    } catch {}
  }, [items]);

  const map = useMemo(() => new Set(items.map(i => i.id)), [items]);
  const has = (id: string) => map.has(id);
  const add = (item: WishlistItem) => setItems(prev => (map.has(item.id) ? prev : [...prev, item]));
  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const toggle = (item: WishlistItem) => (has(item.id) ? remove(item.id) : add(item));
  const clear = () => setItems([]);

  const value: WishlistContextValue = { items, has, toggle, add, remove, clear };
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}


