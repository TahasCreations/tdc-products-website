'use client';

import React from 'react';
import { 
  generateOrganizationSchema, 
  generateProductSchema, 
  generateFAQSchema, 
  generateBreadcrumbSchema,
  generateCategorySchema,
  generateSearchResultsSchema,
  generateLocalBusinessSchema,
  generateWebsiteSchema,
  generateArticleSchema,
  generateEventSchema,
  combineSchemas,
  defaultOrganizationData,
  commonFAQs,
  OrganizationData,
  ProductData,
  FAQData,
  BreadcrumbData
} from '@/lib/seo/structuredData';

interface StructuredDataProps {
  type: 'organization' | 'product' | 'faq' | 'breadcrumb' | 'category' | 'search' | 'localBusiness' | 'website' | 'article' | 'event' | 'combined';
  data?: any;
  schemas?: any[];
}

export function StructuredData({ type, data, schemas }: StructuredDataProps) {
  const generateSchema = () => {
    switch (type) {
      case 'organization':
        return generateOrganizationSchema(data || defaultOrganizationData);
      
      case 'product':
        return generateProductSchema(data);
      
      case 'faq':
        return generateFAQSchema(data || commonFAQs);
      
      case 'breadcrumb':
        return generateBreadcrumbSchema(data);
      
      case 'category':
        return generateCategorySchema(data);
      
      case 'search':
        return generateSearchResultsSchema(data.query, data.results, data.totalCount);
      
      case 'localBusiness':
        return generateLocalBusinessSchema();
      
      case 'website':
        return generateWebsiteSchema();
      
      case 'article':
        return generateArticleSchema(data);
      
      case 'event':
        return generateEventSchema(data);
      
      case 'combined':
        return combineSchemas(...(schemas || []));
      
      default:
        return null;
    }
  };

  const schema = generateSchema();

  if (!schema) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  );
}

// Specific component for product pages
interface ProductStructuredDataProps {
  product: ProductData;
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  return <StructuredData type="product" data={product} />;
}

// Specific component for FAQ pages
interface FAQStructuredDataProps {
  faqs?: FAQData[];
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  return <StructuredData type="faq" data={faqs} />;
}

// Specific component for breadcrumbs
interface BreadcrumbStructuredDataProps {
  breadcrumbs: BreadcrumbData[];
}

export function BreadcrumbStructuredData({ breadcrumbs }: BreadcrumbStructuredDataProps) {
  return <StructuredData type="breadcrumb" data={breadcrumbs} />;
}

// Specific component for organization
interface OrganizationStructuredDataProps {
  organization?: OrganizationData;
}

export function OrganizationStructuredData({ organization }: OrganizationStructuredDataProps) {
  return <StructuredData type="organization" data={organization} />;
}

// Combined schema component for pages with multiple schema types
interface CombinedStructuredDataProps {
  schemas: any[];
}

export function CombinedStructuredData({ schemas }: CombinedStructuredDataProps) {
  return <StructuredData type="combined" schemas={schemas} />;
}

// SEO Meta component
interface SEOMetaProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  nofollow?: boolean;
}

export function SEOMeta({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noindex = false,
  nofollow = false
}: SEOMetaProps) {
  const robots = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow'
  ].join(', ');

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content="TDC Market" />
      <meta property="og:locale" content="tr_TR" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#CBA135" />
      <link rel="canonical" href={url} />
    </>
  );
}

// Performance monitoring component
interface PerformanceMonitorProps {
  pageName: string;
  startTime?: number;
}

export function PerformanceMonitor({ pageName, startTime }: PerformanceMonitorProps) {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const endTime = performance.now();
      const loadTime = startTime ? endTime - startTime : endTime;
      
      // Log performance metrics
      console.log(`[Performance] ${pageName} loaded in ${loadTime.toFixed(2)}ms`);
      
      // Send to analytics (if available)
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'page_load_time', {
          page_name: pageName,
          load_time: Math.round(loadTime)
        });
      }
    }
  }, [pageName, startTime]);

  return null;
}

// Accessibility helper component
interface A11yAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

export function A11yAnnouncer({ message, priority = 'polite' }: A11yAnnouncerProps) {
  const [announcement, setAnnouncement] = React.useState('');

  React.useEffect(() => {
    if (message) {
      setAnnouncement(message);
      
      // Clear announcement after it's been read
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

// Focus management component
interface FocusManagerProps {
  children: React.ReactNode;
  trapFocus?: boolean;
}

export function FocusManager({ children, trapFocus = false }: FocusManagerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (trapFocus && containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement?.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement?.focus();
              e.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [trapFocus]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}

// Skip link component for accessibility
export function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#CBA135] text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2"
    >
      {children}
    </a>
  );
}
