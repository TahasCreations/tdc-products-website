'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface GoogleAnalyticsProps {
  measurementId: string;
  enabled?: boolean;
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export default function GoogleAnalytics({ 
  measurementId, 
  enabled = true 
}: GoogleAnalyticsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!enabled || !measurementId) return;

    // Google Analytics script'ini yükle
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // gtag fonksiyonunu tanımla
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    });

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll(`script[src*="${measurementId}"]`);
      scripts.forEach(script => script.remove());
    };
  }, [measurementId, enabled]);

  // Sayfa değişikliklerini takip et
  useEffect(() => {
    if (!enabled || !window.gtag) return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    
    window.gtag('config', measurementId, {
      page_path: url,
      page_title: document.title,
    });
  }, [pathname, searchParams, measurementId, enabled]);

  return null;
}

// E-ticaret event'leri için yardımcı fonksiyonlar
export const trackPurchase = (transactionId: string, value: number, currency: string, items: any[]) => {
  if (!window.gtag) return;

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items
  });
};

export const trackAddToCart = (itemId: string, itemName: string, category: string, quantity: number, price: number) => {
  if (!window.gtag) return;

  window.gtag('event', 'add_to_cart', {
    currency: 'TRY',
    value: price * quantity,
    items: [{
      item_id: itemId,
      item_name: itemName,
      item_category: category,
      quantity: quantity,
      price: price
    }]
  });
};

export const trackViewItem = (itemId: string, itemName: string, category: string, price: number) => {
  if (!window.gtag) return;

  window.gtag('event', 'view_item', {
    currency: 'TRY',
    value: price,
    items: [{
      item_id: itemId,
      item_name: itemName,
      item_category: category,
      price: price
    }]
  });
};

export const trackSearch = (searchTerm: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'search', {
    search_term: searchTerm
  });
};

export const trackBeginCheckout = (value: number, currency: string, items: any[]) => {
  if (!window.gtag) return;

  window.gtag('event', 'begin_checkout', {
    currency: currency,
    value: value,
    items: items
  });
};
