// SEO Types
export interface SitemapEntryInput {
  tenantId: string;
  storeId: string;
  url: string;
  path: string;
  type?: SitemapType;
  priority?: number;
  changefreq?: ChangeFreq;
  lastmod?: Date;
  isActive?: boolean;
  productId?: string;
  pageId?: string;
  categoryId?: string;
  metadata?: Record<string, any>;
}

export interface SitemapEntryOutput {
  id: string;
  tenantId: string;
  storeId: string;
  url: string;
  path: string;
  type: SitemapType;
  priority: number;
  changefreq: ChangeFreq;
  lastmod: Date;
  isActive: boolean;
  productId?: string;
  pageId?: string;
  categoryId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeoMetadataInput {
  tenantId: string;
  storeId: string;
  pageType: string;
  pageId?: string;
  path?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: Record<string, any>;
  breadcrumbs?: Record<string, any>;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export interface SeoMetadataOutput {
  id: string;
  tenantId: string;
  storeId: string;
  pageType: string;
  pageId?: string;
  path?: string;
  title?: string;
  description?: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: Record<string, any>;
  breadcrumbs?: Record<string, any>;
  isActive: boolean;
  lastUpdated: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SitemapConfig {
  storeId: string;
  domain: string;
  protocol: 'http' | 'https';
  lastmod: Date;
  entries: SitemapEntryOutput[];
  customSitemapUrl?: string;
}

export interface RobotsTxtConfig {
  storeId: string;
  domain: string;
  allowPaths: string[];
  disallowPaths: string[];
  sitemapUrl: string;
  customRobotsTxt?: string;
  userAgents: Array<{
    name: string;
    allow: string[];
    disallow: string[];
    crawlDelay?: number;
  }>;
}

export interface CanonicalUrlConfig {
  storeId: string;
  primaryDomain: string;
  currentPath: string;
  protocol: 'http' | 'https';
  includeQueryParams?: boolean;
  excludeParams?: string[];
}

export interface AnalyticsConfig {
  ga4MeasurementId?: string;
  metaPixelId?: string;
  googleTagManager?: string;
  hotjarId?: string;
  mixpanelToken?: string;
  customScripts?: Array<{
    name: string;
    script: string;
    position: 'head' | 'body';
    async?: boolean;
    defer?: boolean;
  }>;
}

export interface StructuredDataConfig {
  type: 'Organization' | 'WebSite' | 'Store' | 'Product' | 'BreadcrumbList' | 'FAQPage' | 'Article';
  data: Record<string, any>;
  context?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

export interface BreadcrumbConfig {
  items: BreadcrumbItem[];
  homeUrl: string;
  separator?: string;
}

// Sitemap Generation
export interface SitemapGenerator {
  generateSitemap(config: SitemapConfig): Promise<string>;
  generateRobotsTxt(config: RobotsTxtConfig): Promise<string>;
  updateSitemapEntry(entry: SitemapEntryInput): Promise<SitemapEntryOutput>;
  deleteSitemapEntry(entryId: string, tenantId: string): Promise<boolean>;
  getSitemapEntries(storeId: string, filters?: {
    type?: SitemapType;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<SitemapEntryOutput[]>;
}

// SEO Metadata Management
export interface SeoMetadataManager {
  createMetadata(input: SeoMetadataInput): Promise<SeoMetadataOutput>;
  updateMetadata(id: string, input: Partial<SeoMetadataInput>): Promise<SeoMetadataOutput>;
  getMetadata(storeId: string, pageType: string, pageId?: string): Promise<SeoMetadataOutput | null>;
  deleteMetadata(id: string, tenantId: string): Promise<boolean>;
  generateCanonicalUrl(config: CanonicalUrlConfig): string;
  generateStructuredData(type: string, data: Record<string, any>): string;
  generateBreadcrumbs(config: BreadcrumbConfig): string;
}

// Analytics Integration
export interface AnalyticsManager {
  injectAnalytics(config: AnalyticsConfig): string;
  generateGA4Script(measurementId: string): string;
  generateMetaPixelScript(pixelId: string): string;
  generateGTMScript(gtmId: string): string;
  generateHotjarScript(hotjarId: string): string;
  generateMixpanelScript(token: string): string;
}

// Enums
export enum SitemapType {
  PAGE = 'PAGE',
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  BLOG = 'BLOG',
  CUSTOM = 'CUSTOM'
}

export enum ChangeFreq {
  ALWAYS = 'ALWAYS',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  NEVER = 'NEVER'
}

export enum PageType {
  HOME = 'home',
  PRODUCT = 'product',
  CATEGORY = 'category',
  PAGE = 'page',
  BLOG = 'blog',
  CUSTOM = 'custom'
}

export enum TwitterCardType {
  SUMMARY = 'summary',
  SUMMARY_LARGE_IMAGE = 'summary_large_image',
  APP = 'app',
  PLAYER = 'player'
}

export enum OpenGraphType {
  WEBSITE = 'website',
  ARTICLE = 'article',
  PRODUCT = 'product',
  PROFILE = 'profile',
  VIDEO = 'video',
  MUSIC = 'music',
  BOOK = 'book'
}

// SEO Utilities
export interface SeoUtils {
  generateMetaTags(metadata: SeoMetadataOutput, config: {
    domain: string;
    protocol: 'http' | 'https';
    defaultImage?: string;
  }): string;
  
  generateCanonicalTag(url: string): string;
  
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
  
  generateStructuredDataTags(structuredData: Record<string, any>): string;
  
  validateUrl(url: string): boolean;
  
  sanitizeText(text: string, maxLength?: number): string;
  
  generateSlug(text: string): string;
}

// SEO Performance
export interface SeoPerformance {
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
}

// SEO Monitoring
export interface SeoMonitoring {
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
}

