'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Award, 
  Users, 
  Heart, 
  Star, 
  CheckCircle,
  Truck,
  Clock,
  Headphones,
  Globe,
  Lock,
  Gift,
  Zap,
  Crown,
  Sparkles
} from 'lucide-react';
import AboutHero from './AboutHero';
import TrustBadges from './TrustBadges';
import MissionVisionValues from './MissionVisionValues';
import StatsCounter from './StatsCounter';
import Timeline from './Timeline';
import TeamSection from './TeamSection';
import ProcessTransparency from './ProcessTransparency';
import SocialProof from './SocialProof';
import PoliciesAssurance from './PoliciesAssurance';
import FAQSection from './FAQSection';
import ContactCTA from './ContactCTA';
import TrustBanner from './TrustBanner';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F6F6F6]">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "TDC Market",
            "description": "Özel figürlerden elektroniğe, tasarımdan ev yaşamına premium ürünler sunan güvenilir e-ticaret platformu",
            "url": "https://tdcmarket.com",
            "logo": "https://tdcmarket.com/logo.png",
            "foundingDate": "2024",
            "founders": [
              {
                "@type": "Person",
                "name": "TDC Market Kurucu Ekibi"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "TR",
              "addressLocality": "İstanbul"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+90-XXX-XXX-XXXX",
              "contactType": "customer service",
              "availableLanguage": "Turkish"
            },
            "sameAs": [
              "https://instagram.com/tdcmarket",
              "https://twitter.com/tdcmarket"
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "1250",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />

      {/* Hero Section */}
      <AboutHero />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Mission, Vision, Values */}
      <MissionVisionValues />

      {/* Stats Counter */}
      <StatsCounter />

      {/* Timeline */}
      <Timeline />

      {/* Team Section */}
      <TeamSection />

      {/* Process Transparency */}
      <ProcessTransparency />

      {/* Social Proof */}
      <SocialProof />

      {/* Policies & Assurance */}
      <PoliciesAssurance />

      {/* FAQ Section */}
      <FAQSection />

      {/* Contact CTA */}
      <ContactCTA />

      {/* Trust Banner */}
      <TrustBanner />
    </div>
  );
}