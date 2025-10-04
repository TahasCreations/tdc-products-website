import { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
import MissionVisionValues from '@/components/about/MissionVisionValues';
import StatsStrip from '@/components/about/StatsStrip';
import Timeline from '@/components/about/Timeline';
import TeamSection from '@/components/about/TeamSection';
import ProcessShowcase from '@/components/about/ProcessShowcase';
import Testimonials from '@/components/about/Testimonials';
import FAQSection from '@/components/about/FAQSection';
import ContactCTA from '@/components/about/ContactCTA';

export const metadata: Metadata = {
  title: 'Hakkımızda | TDC Market',
  description: 'TDC Market\'in misyonu, güvenilir alışveriş ve sürdürülebilir üretim yaklaşımıyla topluluğa değer katmaktır. Ekibimizi tanıyın, süreçlerimizi görün, güvenle alışveriş yapın.',
  keywords: 'TDC Market, hakkımızda, misyon, vizyon, değerler, ekip, süreç, güven, kalite',
  openGraph: {
    title: 'Hakkımızda | TDC Market',
    description: 'TDC Market\'in misyonu, güvenilir alışveriş ve sürdürülebilir üretim yaklaşımıyla topluluğa değer katmaktır.',
    type: 'website',
    url: 'https://tdcmarket.com/hakkimizda',
    images: [
      {
        url: 'https://tdcmarket.com/og-hakkimizda.jpg',
        width: 1200,
        height: 630,
        alt: 'TDC Market Hakkımızda'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hakkımızda | TDC Market',
    description: 'TDC Market\'in misyonu, güvenilir alışveriş ve sürdürülebilir üretim yaklaşımıyla topluluğa değer katmaktır.',
    images: ['https://tdcmarket.com/og-hakkimizda.jpg']
  }
};

// JSON-LD Schema
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TDC Market',
  url: 'https://tdcmarket.com',
  logo: 'https://tdcmarket.com/logo.png',
  description: 'TDC Market - Özel figürlerden elektroniğe, tasarımdan ev yaşamına kadar her alanda kaliteli ürünler ve güvenilir hizmet sunuyoruz.',
  foundingDate: '2019',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Maslak Mahallesi, Büyükdere Caddesi No: 123',
    addressLocality: 'Sarıyer',
    addressRegion: 'İstanbul',
    addressCountry: 'TR'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+90-850-123-45-67',
    contactType: 'customer service',
    availableLanguage: 'Turkish'
  },
  sameAs: [
    'https://instagram.com/tdcmarket',
    'https://twitter.com/tdcmarket',
    'https://youtube.com/tdcmarket',
    'https://discord.gg/tdcmarket'
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1250'
  }
};

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <AboutHero />
      
      {/* Mission, Vision, Values */}
      <MissionVisionValues />
      
      {/* Stats Strip */}
      <StatsStrip />
      
      {/* Timeline */}
      <Timeline />
      
      {/* Team Section */}
      <TeamSection />
      
      {/* Process Showcase */}
      <ProcessShowcase />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Contact CTA */}
      <ContactCTA />
    </>
  );
}
