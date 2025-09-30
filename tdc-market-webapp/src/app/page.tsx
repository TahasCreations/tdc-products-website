'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnnouncementBar from '../components/home/AnnouncementBar';
import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import CollectionStrip from '../components/home/CollectionStrip';
import CouponBanner from '../components/home/CouponBanner';
import StoreSpotlight from '../components/home/StoreSpotlight';
import TrustSection from '../components/home/TrustSection';
import BlogSection from '../components/home/BlogSection';
import { seedData } from '../data/seed';

// Analytics event tracking
const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // In a real app, this would send to your analytics service
  console.log('Analytics Event:', eventName, properties);
  
  // Example: Send to Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }
};

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Event handlers
  const handleSearch = (query: string) => {
    trackEvent('home_search_submit', { query });
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleCategoryClick = (category: any) => {
    trackEvent('home_category_click', { 
      category_id: category.id, 
      category_name: category.name 
    });
  };

  const handleProductClick = (product: any) => {
    trackEvent('product_card_click', { 
      product_id: product.id, 
      product_name: product.name,
      product_price: product.price
    });
  };

  const handleCollectionClick = (collection: any) => {
    trackEvent('home_collection_click', { 
      collection_id: collection.id, 
      collection_name: collection.title 
    });
  };

  const handleCouponCopy = (coupon: any) => {
    trackEvent('coupon_copy', { 
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type
    });
  };

  const handleStoreClick = (store: any) => {
    trackEvent('seller_cta_click', { 
      store_id: store.id, 
      store_name: store.name 
    });
  };

  const handlePostClick = (post: any) => {
    trackEvent('blog_post_click', { 
      post_id: post.id, 
      post_title: post.title 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-tdc rounded-tdc animate-pulse mx-auto"></div>
          <p className="text-ink-600 font-medium">TDC Market yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Hero Section */}
      <Hero onSearch={handleSearch} />

      {/* Category Discovery */}
      <CategoryGrid 
        categories={seedData.categories} 
        onCategoryClick={handleCategoryClick} 
      />

      {/* Curation Strips */}
      <CollectionStrip 
        collections={seedData.collections} 
        onProductClick={handleProductClick}
        onCollectionClick={handleCollectionClick}
      />

      {/* Coupon Banner */}
      <CouponBanner 
        coupons={seedData.coupons} 
        onCouponCopy={handleCouponCopy} 
      />

      {/* Store Spotlight */}
      <StoreSpotlight 
        stores={seedData.stores} 
        onStoreClick={handleStoreClick} 
      />

      {/* Trust & Support */}
      <TrustSection />

      {/* Blog & Guide */}
      <BlogSection 
        posts={seedData.blogPosts} 
        onPostClick={handlePostClick} 
      />
    </div>
  );
}
