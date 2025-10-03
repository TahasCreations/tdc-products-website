'use client';

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

interface CompareItem {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  rating?: number;
  reviewCount?: number;
}

interface CompareContextType {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  isInCompare: (id: string) => boolean;
  isOpen: boolean;
  toggleOpen: () => void;
  openCompare: () => void;
  closeCompare: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = 'tdc_compare_v1';
const MAX_ITEMS = 4; // Maximum items that can be compared

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (stored) setItems(JSON.parse(stored));
    } catch {/* noop */}
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
    } catch {/* noop */}
  }, [items]);

  const addItem = useCallback((item: CompareItem) => {
    setItems(prev => {
      if (prev.some(i => i.id === item.id)) return prev; // Already in compare
      if (prev.length >= MAX_ITEMS) return prev; // Max items reached
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  const isInCompare = useCallback((id: string) => {
    return items.some(item => item.id === id);
  }, [items]);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const openCompare = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCompare = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = React.useMemo(() => ({
    items,
    addItem,
    removeItem,
    clearItems,
    isInCompare,
    isOpen,
    toggleOpen,
    openCompare,
    closeCompare,
  }), [items, addItem, removeItem, clearItems, isInCompare, isOpen, toggleOpen, openCompare, closeCompare]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
