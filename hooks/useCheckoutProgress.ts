/**
 * Checkout Progress Auto-Save Hook
 * Form verilerini localStorage'da saklar
 */

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'checkout_progress';

export interface CheckoutProgress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  addressNote: string;
  paymentMethod: 'credit' | 'bank' | 'cash';
  step: number;
  timestamp: number;
}

export function useCheckoutProgress() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const saveProgress = (data: Partial<CheckoutProgress>) => {
    if (!isMounted) return;

    try {
      const existing = loadProgress();
      const updated = {
        ...existing,
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save checkout progress:', error);
    }
  };

  const loadProgress = (): Partial<CheckoutProgress> => {
    if (!isMounted) return {};

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return {};

      const data = JSON.parse(saved);
      
      // Expire after 24 hours
      const age = Date.now() - (data.timestamp || 0);
      if (age > 24 * 60 * 60 * 1000) {
        clearProgress();
        return {};
      }

      return data;
    } catch (error) {
      console.error('Failed to load checkout progress:', error);
      return {};
    }
  };

  const clearProgress = () => {
    if (!isMounted) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear checkout progress:', error);
    }
  };

  const hasProgress = (): boolean => {
    if (!isMounted) return false;
    const progress = loadProgress();
    return Object.keys(progress).length > 0;
  };

  return {
    saveProgress,
    loadProgress,
    clearProgress,
    hasProgress,
    isMounted
  };
}

