'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/home/Hero';
import CategoryStrip from '@/components/home/CategoryStrip';
import CollectionStrip from '@/components/home/CollectionStrip';
import MixedProductGrid from '@/components/home/MixedProductGrid';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import MediaShowcase from '@/components/home/MediaShowcase';
import QualitySection from '@/components/home/QualitySection';
import CommunitySection from '@/components/home/CommunitySection';
import CtaStrip from '@/components/home/CtaStrip';

export default function MarketingHome() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCollectionExplore = () => {
    setIsLoading(true);
    router.push('/collections');
  };

  const handleSellerPortal = () => {
    setIsLoading(true);
    router.push('/figures');
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Search functionality will be implemented
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-50 to-ink-100">
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <Hero 
          onSearch={handleSearch}
          onCollectionClick={handleCollectionExplore}
        />

        {/* Category Strip */}
        <CategoryStrip />

        {/* Collection Strips */}
        <CollectionStrip />

        {/* Mixed Product Grid */}
        <MixedProductGrid />

        {/* Featured Collections */}
        <FeaturedCollections />

        {/* Media Showcase */}
        <MediaShowcase />

        {/* Quality Section */}
        <QualitySection />

        {/* Community Section */}
        <CommunitySection />

        {/* CTA Strip */}
        <CtaStrip />
      </main>

      <Footer />
    </div>
  );
}
