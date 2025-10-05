'use client';

import React from 'react';
import { SEOMeta, StructuredData } from './StructuredData';

interface AboutSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  faqs?: Array<{ question: string; answer: string }>;
  stats?: Array<{ label: string; value: string }>;
}

export function AboutSEO({
  title = 'Hakkımızda - TDC Market',
  description = 'TDC Market\'in hikayesini, misyonunu ve değerlerini keşfedin. Premium koleksiyon ve tasarım ürünleri mağazası.',
  keywords = 'TDC Market, hakkımızda, misyon, vizyon, değerler, güven, ekip, hikaye',
  faqs = [],
  stats = []
}: AboutSEOProps) {
  const canonicalUrl = 'https://tdcmarket.com/hakkimizda';
  const ogImage = 'https://tdcmarket.com/api/og?title=Hakkımızda&type=about';

  // Organization schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TDC Market',
    url: 'https://tdcmarket.com',
    logo: 'https://tdcmarket.com/logo.png',
    description: 'Premium koleksiyon ve tasarım ürünleri mağazası',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Örnek Mahallesi, Tasarım Sokak No: 123',
      addressLocality: 'İstanbul',
      addressRegion: 'İstanbul',
      postalCode: '34000',
      addressCountry: 'TR'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-212-XXX-XXXX',
      contactType: 'Customer Service',
      email: 'info@tdcmarket.com'
    },
    sameAs: [
      'https://www.instagram.com/tdcmarket',
      'https://www.facebook.com/tdcmarket',
      'https://twitter.com/tdcmarket'
    ]
  };

  // FAQ schema
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null;

  // About page schema
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: title,
    description,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'Organization',
      name: 'TDC Market',
      description: 'Premium koleksiyon ve tasarım ürünleri mağazası'
    },
    ...(stats.length > 0 && {
      mainContentOfPage: {
        '@type': 'WebPageElement',
        cssSelector: '.stats-section',
        about: stats.map(stat => ({
          '@type': 'Thing',
          name: stat.label,
          description: stat.value
        }))
      }
    })
  };

  return (
    <>
      <SEOMeta
        title={title}
        description={description}
        keywords={keywords}
        image={ogImage}
        url={canonicalUrl}
        type="website"
      />
      
      <StructuredData type="combined" schemas={[
        organizationSchema,
        aboutPageSchema,
        ...(faqSchema ? [faqSchema] : [])
      ]} />
    </>
  );
}
