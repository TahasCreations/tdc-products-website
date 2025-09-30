import { z } from 'zod';
import { 
  SitemapEntryInput, 
  SitemapEntryOutput, 
  SeoMetadataInput, 
  SeoMetadataOutput,
  SitemapConfig,
  RobotsTxtConfig,
  CanonicalUrlConfig,
  AnalyticsConfig,
  StructuredDataConfig,
  BreadcrumbConfig,
  SitemapType,
  ChangeFreq,
  PageType,
  TwitterCardType,
  OpenGraphType
} from '../../types/seo.types.js';

// Validation schemas
export const SitemapTypeSchema = z.enum(['PAGE', 'PRODUCT', 'CATEGORY', 'BLOG', 'CUSTOM']);
export const ChangeFreqSchema = z.enum(['ALWAYS', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'NEVER']);
export const PageTypeSchema = z.enum(['home', 'product', 'category', 'page', 'blog', 'custom']);
export const TwitterCardTypeSchema = z.enum(['summary', 'summary_large_image', 'app', 'player']);
export const OpenGraphTypeSchema = z.enum(['website', 'article', 'product', 'profile', 'video', 'music', 'book']);

export const SitemapEntryInputSchema = z.object({
  tenantId: z.string().min(1),
  storeId: z.string().min(1),
  url: z.string().url(),
  path: z.string().min(1),
  type: SitemapTypeSchema.default('PAGE'),
  priority: z.number().min(0).max(1).default(0.5),
  changefreq: ChangeFreqSchema.default('WEEKLY'),
  lastmod: z.date().optional(),
  isActive: z.boolean().default(true),
  productId: z.string().optional(),
  pageId: z.string().optional(),
  categoryId: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const SeoMetadataInputSchema = z.object({
  tenantId: z.string().min(1),
  storeId: z.string().min(1),
  pageType: PageTypeSchema,
  pageId: z.string().optional(),
  path: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  keywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().url().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url().optional(),
  ogType: OpenGraphTypeSchema.default('website'),
  twitterCard: TwitterCardTypeSchema.default('summary'),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().url().optional(),
  structuredData: z.record(z.any()).optional(),
  breadcrumbs: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
  metadata: z.record(z.any()).optional()
});

// SEO Port Interface
export interface SeoPort {
  // Sitemap Management
  createSitemapEntry(input: SitemapEntryInput): Promise<SitemapEntryOutput>;
  getSitemapEntry(id: string, tenantId: string): Promise<SitemapEntryOutput | null>;
  getSitemapEntries(storeId: string, filters?: {
    type?: SitemapType;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<SitemapEntryOutput[]>;
  updateSitemapEntry(id: string, tenantId: string, input: Partial<SitemapEntryInput>): Promise<SitemapEntryOutput>;
  deleteSitemapEntry(id: string, tenantId: string): Promise<boolean>;
  bulkCreateSitemapEntries(entries: SitemapEntryInput[]): Promise<SitemapEntryOutput[]>;
  bulkUpdateSitemapEntries(updates: Array<{ id: string; input: Partial<SitemapEntryInput> }>): Promise<SitemapEntryOutput[]>;
  bulkDeleteSitemapEntries(entryIds: string[], tenantId: string): Promise<boolean>;

  // Sitemap Generation
  generateSitemap(config: SitemapConfig): Promise<string>;
  generateSitemapIndex(storeId: string, sitemaps: Array<{
    url: string;
    lastmod: Date;
  }>): Promise<string>;
  updateSitemapForStore(storeId: string, domain: string): Promise<{
    sitemapUrl: string;
    entryCount: number;
    lastmod: Date;
  }>;
  regenerateSitemap(storeId: string): Promise<{
    success: boolean;
    sitemapUrl: string;
    entryCount: number;
    errors: string[];
  }>;

  // Robots.txt Management
  generateRobotsTxt(config: RobotsTxtConfig): Promise<string>;
  updateRobotsTxtForStore(storeId: string, domain: string): Promise<{
    robotsTxt: string;
    lastmod: Date;
  }>;
  getRobotsTxt(storeId: string): Promise<string>;

  // SEO Metadata Management
  createSeoMetadata(input: SeoMetadataInput): Promise<SeoMetadataOutput>;
  getSeoMetadata(id: string, tenantId: string): Promise<SeoMetadataOutput | null>;
  getSeoMetadataByPage(storeId: string, pageType: string, pageId?: string): Promise<SeoMetadataOutput | null>;
  getSeoMetadataByPath(storeId: string, path: string): Promise<SeoMetadataOutput | null>;
  updateSeoMetadata(id: string, tenantId: string, input: Partial<SeoMetadataInput>): Promise<SeoMetadataOutput>;
  deleteSeoMetadata(id: string, tenantId: string): Promise<boolean>;
  bulkCreateSeoMetadata(entries: SeoMetadataInput[]): Promise<SeoMetadataOutput[]>;
  bulkUpdateSeoMetadata(updates: Array<{ id: string; input: Partial<SeoMetadataInput> }>): Promise<SeoMetadataOutput[]>;

  // Canonical URL Management
  generateCanonicalUrl(config: CanonicalUrlConfig): string;
  updateCanonicalUrlsForStore(storeId: string, primaryDomain: string): Promise<{
    updated: number;
    errors: string[];
  }>;
  validateCanonicalUrl(url: string): Promise<{
    valid: boolean;
    errors: string[];
  }>;

  // Structured Data Management
  generateStructuredData(type: string, data: Record<string, any>): string;
  generateBreadcrumbStructuredData(breadcrumbs: Array<{
    name: string;
    url: string;
    position: number;
  }>): string;
  generateProductStructuredData(product: {
    name: string;
    description: string;
    image: string;
    price: number;
    currency: string;
    availability: string;
    brand: string;
    sku: string;
  }): string;
  generateOrganizationStructuredData(organization: {
    name: string;
    url: string;
    logo: string;
    description: string;
    contactPoint?: {
      telephone: string;
      contactType: string;
    };
  }): string;

  // Meta Tags Generation
  generateMetaTags(metadata: SeoMetadataOutput, config: {
    domain: string;
    protocol: 'http' | 'https';
    defaultImage?: string;
  }): string;
  generateOpenGraphTags(metadata: SeoMetadataOutput, config: {
    domain: string;
    protocol: 'http' | 'https';
    defaultImage?: string;
  }): string;
  generateTwitterCardTags(metadata: SeoMetadataOutput, config: {
    domain: string;
    protocol: 'http' | 'https';
    defaultImage?: string;
  }): string;
  generateCanonicalTag(url: string): string;

  // Analytics Integration
  generateAnalyticsScripts(config: AnalyticsConfig): string;
  generateGA4Script(measurementId: string): string;
  generateMetaPixelScript(pixelId: string): string;
  generateGTMScript(gtmId: string): string;
  generateHotjarScript(hotjarId: string): string;
  generateMixpanelScript(token: string): string;
  injectAnalyticsIntoPage(html: string, config: AnalyticsConfig): string;

  // SEO Utilities
  sanitizeText(text: string, maxLength?: number): string;
  generateSlug(text: string): string;
  validateUrl(url: string): boolean;
  extractDomainFromUrl(url: string): string;
  normalizeUrl(url: string): string;

  // SEO Performance
  getPageSpeedScore(url: string): Promise<number>;
  getSeoScore(url: string): Promise<number>;
  getCoreWebVitals(url: string): Promise<{
    lcp: number;
    fid: number;
    cls: number;
  }>;
  analyzePage(url: string): Promise<{
    title: string;
    description: string;
    headings: string[];
    images: Array<{ src: string; alt: string }>;
    links: Array<{ href: string; text: string }>;
    issues: string[];
    suggestions: string[];
  }>;

  // SEO Monitoring
  trackKeywordRanking(keyword: string, url: string): Promise<{
    position: number;
    date: Date;
    searchVolume?: number;
  }>;
  trackBacklinks(url: string): Promise<Array<{
    source: string;
    anchorText: string;
    date: Date;
    domainAuthority: number;
  }>>;
  trackIndexingStatus(url: string): Promise<{
    indexed: boolean;
    lastCrawled?: Date;
    status: string;
  }>;
  generateSeoReport(storeId: string, period: 'week' | 'month' | 'quarter'): Promise<{
    totalPages: number;
    indexedPages: number;
    averageSeoScore: number;
    topKeywords: Array<{ keyword: string; position: number; traffic: number }>;
    issues: Array<{ type: string; count: number; pages: string[] }>;
    recommendations: string[];
  }>;

  // SEO Automation
  autoGenerateSitemap(storeId: string): Promise<{
    success: boolean;
    sitemapUrl: string;
    entryCount: number;
    errors: string[];
  }>;
  autoGenerateSeoMetadata(storeId: string, pageType: string, pageId: string, content: {
    title?: string;
    description?: string;
    keywords?: string[];
  }): Promise<SeoMetadataOutput>;
  autoOptimizeSeo(storeId: string): Promise<{
    optimized: number;
    issues: string[];
    recommendations: string[];
  }>;

  // SEO Validation
  validateSeoMetadata(metadata: SeoMetadataOutput): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    score: number;
  }>;
  validateSitemap(sitemapUrl: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
    entryCount: number;
  }>;
  validateRobotsTxt(robotsTxt: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }>;

  // SEO Export/Import
  exportSeoData(storeId: string): Promise<{
    sitemapEntries: SitemapEntryOutput[];
    seoMetadata: SeoMetadataOutput[];
    robotsTxt: string;
    sitemapXml: string;
  }>;
  importSeoData(storeId: string, data: {
    sitemapEntries?: SitemapEntryInput[];
    seoMetadata?: SeoMetadataInput[];
    robotsTxt?: string;
  }): Promise<{
    success: boolean;
    imported: {
      sitemapEntries: number;
      seoMetadata: number;
    };
    errors: string[];
  }>;

  // SEO Analytics
  getSeoAnalytics(storeId: string, period: 'day' | 'week' | 'month' | 'year'): Promise<{
    totalPages: number;
    indexedPages: number;
    averageSeoScore: number;
    topPerformingPages: Array<{
      url: string;
      title: string;
      seoScore: number;
      traffic: number;
    }>;
    keywordRankings: Array<{
      keyword: string;
      position: number;
      change: number;
      searchVolume: number;
    }>;
    backlinks: {
      total: number;
      new: number;
      lost: number;
      domainAuthority: number;
    };
  }>;
}

