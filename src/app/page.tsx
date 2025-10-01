'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import MediaShowcase from '@/components/home/MediaShowcase';
import QualitySection from '@/components/home/QualitySection';
import CommunitySection from '@/components/home/CommunitySection';
import CtaStrip from '@/components/home/CtaStrip';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Event handlers
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleCategoryClick = (category: any) => {
    console.log('Category clicked:', category);
    router.push(`/collections/${category.slug}`);
  };

  const handleProductClick = (product: any) => {
    console.log('Product clicked:', product);
    router.push(`/products/${product.slug}`);
  };

  const handleCollectionClick = (collection: any) => {
    console.log('Collection clicked:', collection);
    router.push(`/collections/${collection.slug}`);
  };

  const handleCouponCopy = (coupon: any) => {
    console.log('Coupon copied:', coupon);
    // Copy to clipboard functionality
    navigator.clipboard.writeText(coupon.code);
    // Show toast notification
    alert(`Kupon kodu kopyalandı: ${coupon.code}`);
  };

  const handleStoreClick = (store: any) => {
    console.log('Store clicked:', store);
    router.push(`/stores/${store.slug}`);
  };

  const handlePostClick = (post: any) => {
    console.log('Post clicked:', post);
    router.push(`/blog/${post.slug}`);
  };

  const handleAuthSuccess = (type: 'user' | 'seller') => {
    console.log(`${type} authentication successful`);
    // Redirect based on user type
    if (type === 'seller') {
      router.push('/seller/dashboard');
    } else {
      router.push('/user/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <Hero 
          onSearch={handleSearch}
          onCollectionClick={handleCollectionClick}
        />
        
        {/* Featured Collections */}
        <FeaturedCollections 
          onCollectionClick={handleCollectionClick}
          onProductClick={handleProductClick}
        />
        
        {/* Media Showcase */}
        <MediaShowcase />
        
        {/* Quality Section */}
        <QualitySection />
        
        {/* Community Section */}
        <CommunitySection />
        
        {/* CTA Strip */}
        <CtaStrip onAuthSuccess={handleAuthSuccess} />
      </main>
      
      <Footer />
    </div>
  );
}