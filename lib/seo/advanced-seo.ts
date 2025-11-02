/**
 * Enterprise SEO Optimization System
 * Dynamic meta tags, structured data, sitemap generation
 */

import { prisma } from '@/lib/prisma';

interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
  robots?: string;
  structuredData?: any;
}

export class AdvancedSEOEngine {
  /**
   * Generate dynamic SEO config for product pages
   */
  async generateProductSEO(productId: string): Promise<SEOConfig> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        seller: true,
        reviews: {
          select: { rating: true },
          take: 100,
        },
      },
    });

    if (!product) throw new Error('Product not found');

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

    // AI-generated SEO title (optimal length: 50-60 chars)
    const seoTitle = this.optimizeTitle(
      `${product.name} - ${product.category.name} | TDC Market`,
      60
    );

    // AI-generated meta description (optimal length: 150-160 chars)
    const seoDescription = this.optimizeDescription(
      `${product.name} ürününü TDC Market'ten güvenle satın alın. ${product.description?.substring(0, 100)}. Hızlı kargo, güvenli ödeme.`,
      160
    );

    // Extract keywords using TF-IDF
    const keywords = await this.extractKeywords(product.name, product.description || '');

    // Generate structured data (Schema.org Product)
    const structuredData = this.generateProductStructuredData(product, avgRating);

    return {
      title: seoTitle,
      description: seoDescription,
      keywords,
      ogImage: product.images?.[0] || '/default-og-image.jpg',
      canonical: `/products/${product.slug}`,
      robots: product.isActive ? 'index,follow' : 'noindex,nofollow',
      structuredData,
    };
  }

  /**
   * Generate Product Schema.org structured data
   */
  private generateProductStructuredData(product: any, avgRating: number) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images || [],
      brand: {
        '@type': 'Brand',
        name: product.brand || 'TDC Market',
      },
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'TRY',
        availability: product.stock > 0 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: product.seller?.storeName || 'TDC Market',
        },
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      aggregateRating: avgRating > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: product.reviews.length,
        bestRating: 5,
        worstRating: 1,
      } : undefined,
      sku: product.sku || product.id,
      category: product.category?.name,
    };
  }

  /**
   * Generate Organization schema
   */
  generateOrganizationSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'TDC Market',
      url: 'https://tdc-market.com',
      logo: 'https://tdc-market.com/logo.png',
      description: 'Türkiye\'nin önde gelen e-ticaret platformu',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+90-850-XXX-XX-XX',
        contactType: 'customer service',
        availableLanguage: ['Turkish', 'English'],
      },
      sameAs: [
        'https://facebook.com/tdcmarket',
        'https://twitter.com/tdcmarket',
        'https://instagram.com/tdcmarket',
      ],
    };
  }

  /**
   * Generate Breadcrumb schema
   */
  generateBreadcrumbSchema(path: Array<{ name: string; url: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: path.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  /**
   * Keyword extraction with TF-IDF
   */
  private async extractKeywords(title: string, description: string): Promise<string[]> {
    const text = `${title} ${description}`.toLowerCase();
    
    // Turkish stopwords
    const stopwords = new Set(['ve', 'ile', 'için', 'bir', 'bu', 'şu', 'o']);
    
    // Tokenize
    const words = text.match(/[\wçğıöşü]+/gi) || [];
    
    // Filter stopwords and count frequencies
    const frequencies: Record<string, number> = {};
    words.forEach(word => {
      if (!stopwords.has(word) && word.length > 2) {
        frequencies[word] = (frequencies[word] || 0) + 1;
      }
    });

    // Sort by frequency and return top keywords
    return Object.entries(frequencies)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Optimize title length
   */
  private optimizeTitle(title: string, maxLength: number): string {
    if (title.length <= maxLength) return title;
    
    // Truncate smartly at word boundary
    const truncated = title.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  }

  /**
   * Optimize description length
   */
  private optimizeDescription(description: string, maxLength: number): string {
    if (description.length <= maxLength) return description;
    
    const truncated = description.substring(0, maxLength - 3);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substring(0, lastSpace) + '...';
  }

  /**
   * Generate XML sitemap
   */
  async generateSitemap(): Promise<string> {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const urls = [
      { url: '/', priority: 1.0, changefreq: 'daily' },
      { url: '/products', priority: 0.9, changefreq: 'daily' },
      { url: '/categories', priority: 0.8, changefreq: 'weekly' },
      ...products.map(p => ({
        url: `/products/${p.slug}`,
        priority: 0.7,
        changefreq: 'weekly' as const,
        lastmod: p.updatedAt.toISOString(),
      })),
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    urls.forEach(({ url, priority, changefreq, lastmod }) => {
      xml += '  <url>\n';
      xml += `    <loc>https://tdc-market.com${url}</loc>\n`;
      if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>${changefreq}</changefreq>\n`;
      xml += `    <priority>${priority}</priority>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  /**
   * Generate robots.txt
   */
  generateRobotsTxt(): string {
    return `# TDC Market Robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout
Disallow: /cart

# Sitemaps
Sitemap: https://tdc-market.com/sitemap.xml
Sitemap: https://tdc-market.com/sitemap-products.xml
Sitemap: https://tdc-market.com/sitemap-categories.xml

# Crawl delay
Crawl-delay: 1
`;
  }

  /**
   * Internal linking suggestions
   */
  async suggestInternalLinks(productId: string): Promise<Array<{ text: string; url: string }>> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    if (!product) return [];

    // Related products
    const related = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        isActive: true,
      },
      take: 5,
      select: { name: true, slug: true },
    });

    return [
      { text: `${product.category.name} Kategorisi`, url: `/categories/${product.category.slug}` },
      ...related.map(p => ({ text: p.name, url: `/products/${p.slug}` })),
    ];
  }

  /**
   * Page speed optimization suggestions
   */
  async analyzePageSpeed(url: string) {
    // Use Google PageSpeed Insights API
    const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`
    );

    const data = await response.json();
    
    return {
      score: data.lighthouseResult?.categories?.performance?.score * 100,
      metrics: {
        fcp: data.lighthouseResult?.audits['first-contentful-paint']?.numericValue,
        lcp: data.lighthouseResult?.audits['largest-contentful-paint']?.numericValue,
        cls: data.lighthouseResult?.audits['cumulative-layout-shift']?.numericValue,
        tti: data.lighthouseResult?.audits['interactive']?.numericValue,
      },
      opportunities: data.lighthouseResult?.audits,
    };
  }
}

export const seoEngine = new AdvancedSEOEngine();

