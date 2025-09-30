// Store Pages Types
export interface StorePageInput {
  tenantId: string;
  storeId: string;
  path: string;
  title: string;
  description?: string;
  content?: any;
  layoutJson?: any;
  themeId?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  status?: PageStatus;
  isPublished?: boolean;
  startAt?: Date;
  endAt?: Date;
  isCampaign?: boolean;
  campaignType?: CampaignType;
  discountCode?: string;
  priority?: number;
  cacheTtl?: number;
  metadata?: Record<string, any>;
}

export interface StorePageOutput {
  id: string;
  tenantId: string;
  storeId: string;
  path: string;
  title: string;
  description?: string;
  content?: any;
  layoutJson?: any;
  themeId?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  status: PageStatus;
  isPublished: boolean;
  startAt?: Date;
  endAt?: Date;
  isCampaign: boolean;
  campaignType?: CampaignType;
  discountCode?: string;
  priority: number;
  viewCount: number;
  lastViewedAt?: Date;
  cacheTtl: number;
  revalidateAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorePageUpdateInput {
  path?: string;
  title?: string;
  description?: string;
  content?: any;
  layoutJson?: any;
  themeId?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  status?: PageStatus;
  isPublished?: boolean;
  startAt?: Date;
  endAt?: Date;
  isCampaign?: boolean;
  campaignType?: CampaignType;
  discountCode?: string;
  priority?: number;
  cacheTtl?: number;
  metadata?: Record<string, any>;
}

export interface PagePublishingStatus {
  isPublished: boolean;
  isScheduled: boolean;
  isExpired: boolean;
  isActive: boolean;
  status: PageStatus;
  startAt?: Date;
  endAt?: Date;
  nextRevalidation?: Date;
}

export interface PageAnalytics {
  viewCount: number;
  lastViewedAt?: Date;
  averageViewTime?: number;
  bounceRate?: number;
  conversionRate?: number;
}

export interface CampaignPage extends StorePageOutput {
  isCampaign: true;
  campaignType: CampaignType;
  discountCode?: string;
  priority: number;
}

export interface PageCacheInfo {
  cacheKey: string;
  ttl: number;
  revalidateAt?: Date;
  isStale: boolean;
  lastModified?: Date;
}

export interface PageRevalidationResult {
  success: boolean;
  revalidatedAt: Date;
  nextRevalidation?: Date;
  error?: string;
}

export interface OGImageData {
  title: string;
  description?: string;
  imageUrl?: string;
  storeName: string;
  storeLogo?: string;
  campaignType?: CampaignType;
  discountCode?: string;
  endDate?: Date;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

export interface PageRouteInfo {
  storeId: string;
  tenantId: string;
  path: string;
  isCampaign: boolean;
  campaignType?: CampaignType;
  priority: number;
  isPublished: boolean;
  startAt?: Date;
  endAt?: Date;
  revalidateAt?: Date;
}

// Enums
export enum PageStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  PUBLISHED = 'PUBLISHED',
  UNPUBLISHED = 'UNPUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum CampaignType {
  SALE = 'SALE',
  PROMOTION = 'PROMOTION',
  EVENT = 'EVENT',
  SEASONAL = 'SEASONAL',
  FLASH = 'FLASH',
  CLEARANCE = 'CLEARANCE'
}

// Page Builder Integration
export interface PageBuilderData {
  layoutJson?: any;
  themeId?: string;
  customCSS?: string;
  customJS?: string;
}

// SEO Data
export interface PageSEOData {
  title: string;
  description?: string;
  keywords: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  robots?: string;
  structuredData?: any;
}

// Publishing Schedule
export interface PublishingSchedule {
  startAt?: Date;
  endAt?: Date;
  timezone?: string;
  recurring?: {
    pattern: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
  };
}

// Cache Configuration
export interface CacheConfiguration {
  ttl: number;
  revalidateAt?: Date;
  tags?: string[];
  vary?: string[];
  staleWhileRevalidate?: number;
}

