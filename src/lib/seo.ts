// Advanced SEO utilities and meta tag management

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  siteName?: string;
  locale?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  price?: {
    amount: number;
    currency: string;
  };
  availability?: 'in stock' | 'out of stock' | 'preorder';
  brand?: string;
  category?: string;
  rating?: {
    value: number;
    count: number;
  };
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

class SEOManager {
  private defaultConfig: Partial<SEOConfig> = {
    siteName: 'TDC Products',
    locale: 'tr_TR',
    type: 'website',
    image: '/images/og-default.jpg'
  };

  generateMetaTags(config: SEOConfig): Record<string, string> {
    const fullConfig = { ...this.defaultConfig, ...config };
    
    return {
      // Basic meta tags
      title: fullConfig.title,
      description: fullConfig.description,
      keywords: fullConfig.keywords?.join(', ') || '',
      
      // Open Graph tags
      'og:title': fullConfig.title,
      'og:description': fullConfig.description,
      'og:image': fullConfig.image || '',
      'og:url': fullConfig.url || '',
      'og:type': fullConfig.type || 'website',
      'og:site_name': fullConfig.siteName || '',
      'og:locale': fullConfig.locale || 'tr_TR',
      
      // Twitter Card tags
      'twitter:card': 'summary_large_image',
      'twitter:title': fullConfig.title,
      'twitter:description': fullConfig.description,
      'twitter:image': fullConfig.image || '',
      
      // Additional meta tags
      'robots': 'index, follow',
      'author': fullConfig.author || '',
      'viewport': 'width=device-width, initial-scale=1.0',
      'theme-color': '#3b82f6',
      
      // Article specific
      ...(fullConfig.type === 'article' && {
        'article:author': fullConfig.author || '',
        'article:published_time': fullConfig.publishedTime || '',
        'article:modified_time': fullConfig.modifiedTime || '',
        'article:section': fullConfig.section || '',
        'article:tag': fullConfig.tags?.join(', ') || ''
      }),
      
      // Product specific
      ...(fullConfig.type === 'product' && {
        'product:price:amount': fullConfig.price?.amount?.toString() || '',
        'product:price:currency': fullConfig.price?.currency || 'TRY',
        'product:availability': fullConfig.availability || 'in stock',
        'product:brand': fullConfig.brand || '',
        'product:category': fullConfig.category || ''
      })
    };
  }

  generateStructuredData(config: SEOConfig): StructuredData[] {
    const fullConfig = { ...this.defaultConfig, ...config };
    const structuredData: StructuredData[] = [];

    // Website/Organization schema
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: fullConfig.siteName,
      url: fullConfig.url || '',
      logo: fullConfig.image || '',
      description: fullConfig.description,
      sameAs: [
        'https://www.facebook.com/tdcproducts',
        'https://www.instagram.com/tdcproducts',
        'https://www.twitter.com/tdcproducts'
      ]
    });

    // WebSite schema
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: fullConfig.siteName,
      url: fullConfig.url || '',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${fullConfig.url}/products?search={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    });

    // Article schema
    if (fullConfig.type === 'article') {
      structuredData.push({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: fullConfig.title,
        description: fullConfig.description,
        image: fullConfig.image || '',
        author: {
          '@type': 'Person',
          name: fullConfig.author || ''
        },
        publisher: {
          '@type': 'Organization',
          name: fullConfig.siteName,
          logo: {
            '@type': 'ImageObject',
            url: fullConfig.image || ''
          }
        },
        datePublished: fullConfig.publishedTime || '',
        dateModified: fullConfig.modifiedTime || '',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': fullConfig.url || ''
        }
      });
    }

    // Product schema
    if (fullConfig.type === 'product') {
      const productSchema: StructuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: fullConfig.title,
        description: fullConfig.description,
        image: fullConfig.image || '',
        url: fullConfig.url || '',
        brand: {
          '@type': 'Brand',
          name: fullConfig.brand || fullConfig.siteName
        },
        category: fullConfig.category || '',
        offers: {
          '@type': 'Offer',
          price: fullConfig.price?.amount || 0,
          priceCurrency: fullConfig.price?.currency || 'TRY',
          availability: `https://schema.org/${fullConfig.availability?.replace(' ', '') || 'InStock'}`,
          seller: {
            '@type': 'Organization',
            name: fullConfig.siteName
          }
        }
      };

      if (fullConfig.rating) {
        productSchema.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: fullConfig.rating.value,
          reviewCount: fullConfig.rating.count
        };
      }

      structuredData.push(productSchema);
    }

    // Breadcrumb schema
    if (fullConfig.url) {
      const pathSegments = fullConfig.url.split('/').filter(Boolean);
      if (pathSegments.length > 1) {
        const breadcrumbList = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: pathSegments.map((segment, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: segment.charAt(0).toUpperCase() + segment.slice(1),
            item: `${fullConfig.url?.split('/').slice(0, index + 2).join('/')}`
          }))
        };
        structuredData.push(breadcrumbList);
      }
    }

    return structuredData;
  }

  generateSitemap(pages: Array<{
    url: string;
    lastModified?: string;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }>): string {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tdcproducts.com';
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastModified ? `<lastmod>${page.lastModified}</lastmod>` : ''}
    ${page.changeFrequency ? `<changefreq>${page.changeFrequency}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  }

  generateRobotsTxt(disallowPaths: string[] = []): string {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tdcproducts.com';
    
    return `User-agent: *
Allow: /

${disallowPaths.map(path => `Disallow: ${path}`).join('\n')}

Sitemap: ${baseUrl}/sitemap.xml`;
  }

  // Performance optimization for meta tags
  optimizeMetaTags(metaTags: Record<string, string>): Record<string, string> {
    const optimized: Record<string, string> = {};
    
    // Remove empty values
    Object.entries(metaTags).forEach(([key, value]) => {
      if (value && value.trim()) {
        optimized[key] = value.trim();
      }
    });

    // Truncate long descriptions
    if (optimized.description && optimized.description.length > 160) {
      optimized.description = optimized.description.substring(0, 157) + '...';
    }

    // Ensure title is not too long
    if (optimized.title && optimized.title.length > 60) {
      optimized.title = optimized.title.substring(0, 57) + '...';
    }

    return optimized;
  }

  // Generate canonical URL
  generateCanonicalUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tdcproducts.com';
    return `${baseUrl}${path}`;
  }

  // Generate alternate language URLs
  generateAlternateUrls(path: string, languages: string[] = ['tr', 'en']): Record<string, string> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tdcproducts.com';
    const alternates: Record<string, string> = {};

    languages.forEach(lang => {
      alternates[lang] = `${baseUrl}/${lang}${path}`;
    });

    return alternates;
  }
}

// Create singleton instance
export const seoManager = new SEOManager();

// Utility functions
export const seoUtils = {
  // Generate page title with site name
  generatePageTitle(title: string, siteName?: string): string {
    const defaultSiteName = 'TDC Products';
    const finalSiteName = siteName || defaultSiteName;
    
    if (title === finalSiteName) {
      return title;
    }
    
    return `${title} | ${finalSiteName}`;
  },

  // Generate meta description from content
  generateDescription(content: string, maxLength: number = 160): string {
    // Remove HTML tags and extra whitespace
    const cleanContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (cleanContent.length <= maxLength) {
      return cleanContent;
    }

    // Find the last complete sentence within the limit
    const truncated = cleanContent.substring(0, maxLength);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );

    if (lastSentenceEnd > maxLength * 0.7) {
      return truncated.substring(0, lastSentenceEnd + 1);
    }

    return truncated.substring(0, maxLength - 3) + '...';
  },

  // Generate keywords from content
  generateKeywords(content: string, maxKeywords: number = 10): string[] {
    // Remove HTML tags and convert to lowercase
    const cleanContent = content
      .replace(/<[^>]*>/g, '')
      .toLowerCase();

    // Common Turkish stop words
    const stopWords = new Set([
      've', 'bir', 'bu', 'şu', 'o', 'için', 'ile', 'da', 'de', 'ta', 'te',
      'den', 'dan', 'ten', 'tan', 'nin', 'nın', 'nun', 'nün', 'na', 'ne',
      'ya', 'ye', 'la', 'le', 'ki', 'mi', 'mı', 'mu', 'mü', 'dır', 'dir',
      'dur', 'dür', 'tır', 'tir', 'tur', 'tür', 'olduğu', 'olduğunu',
      'olan', 'olarak', 'olup', 'oldu', 'olmuş', 'olacak', 'olmalı'
    ]);

    // Extract words
    const words = cleanContent
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    // Count word frequency
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    // Sort by frequency and return top keywords
    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([word]) => word);
  },

  // Validate SEO configuration
  validateSEOConfig(config: SEOConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.title || config.title.trim().length === 0) {
      errors.push('Title is required');
    } else if (config.title.length > 60) {
      errors.push('Title should be 60 characters or less');
    }

    if (!config.description || config.description.trim().length === 0) {
      errors.push('Description is required');
    } else if (config.description.length > 160) {
      errors.push('Description should be 160 characters or less');
    }

    if (config.image && !config.image.startsWith('http') && !config.image.startsWith('/')) {
      errors.push('Image URL should be absolute or start with /');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default seoManager;
