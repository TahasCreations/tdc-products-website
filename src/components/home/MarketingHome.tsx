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
  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-50 to-ink-100">
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <Hero />

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
