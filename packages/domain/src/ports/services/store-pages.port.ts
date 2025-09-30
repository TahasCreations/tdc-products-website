import { z } from 'zod';
import { 
  StorePageInput, 
  StorePageOutput, 
  StorePageUpdateInput,
  PageStatus,
  CampaignType,
  PagePublishingStatus,
  PageAnalytics,
  CampaignPage,
  PageCacheInfo,
  PageRevalidationResult,
  OGImageData,
  PageRouteInfo
} from '../../types/store-pages.types.js';

// Validation schemas
export const PageStatusSchema = z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED']);
export const CampaignTypeSchema = z.enum(['SALE', 'PROMOTION', 'EVENT', 'SEASONAL', 'FLASH', 'CLEARANCE']);

export const StorePageInputSchema = z.object({
  tenantId: z.string().min(1),
  storeId: z.string().min(1),
  path: z.string().min(1).max(500),
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  content: z.any().optional(),
  layoutJson: z.any().optional(),
  themeId: z.string().optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  metaKeywords: z.array(z.string()).default([]),
  ogImage: z.string().url().optional(),
  ogTitle: z.string().max(255).optional(),
  ogDescription: z.string().max(500).optional(),
  status: PageStatusSchema.default('DRAFT'),
  isPublished: z.boolean().default(false),
  startAt: z.date().optional(),
  endAt: z.date().optional(),
  isCampaign: z.boolean().default(false),
  campaignType: CampaignTypeSchema.optional(),
  discountCode: z.string().max(50).optional(),
  priority: z.number().int().min(0).default(0),
  cacheTtl: z.number().int().min(0).default(3600),
  metadata: z.record(z.any()).optional()
});

export const StorePageUpdateSchema = z.object({
  path: z.string().min(1).max(500).optional(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  content: z.any().optional(),
  layoutJson: z.any().optional(),
  themeId: z.string().optional(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
  metaKeywords: z.array(z.string()).optional(),
  ogImage: z.string().url().optional(),
  ogTitle: z.string().max(255).optional(),
  ogDescription: z.string().max(500).optional(),
  status: PageStatusSchema.optional(),
  isPublished: z.boolean().optional(),
  startAt: z.date().optional(),
  endAt: z.date().optional(),
  isCampaign: z.boolean().optional(),
  campaignType: CampaignTypeSchema.optional(),
  discountCode: z.string().max(50).optional(),
  priority: z.number().int().min(0).optional(),
  cacheTtl: z.number().int().min(0).optional(),
  metadata: z.record(z.any()).optional()
});

// Store Pages Port Interface
export interface StorePagesPort {
  // Page Management
  createPage(input: StorePageInput): Promise<StorePageOutput>;
  getPage(id: string, tenantId: string): Promise<StorePageOutput | null>;
  getPageByPath(storeId: string, path: string, tenantId: string): Promise<StorePageOutput | null>;
  getPages(tenantId: string, filters?: {
    storeId?: string;
    status?: PageStatus;
    isPublished?: boolean;
    isCampaign?: boolean;
    campaignType?: CampaignType;
    startAt?: Date;
    endAt?: Date;
    limit?: number;
    offset?: number;
  }): Promise<StorePageOutput[]>;
  updatePage(id: string, tenantId: string, input: StorePageUpdateInput): Promise<StorePageOutput>;
  deletePage(id: string, tenantId: string): Promise<boolean>;
  duplicatePage(id: string, tenantId: string, newPath: string): Promise<StorePageOutput>;

  // Publishing Management
  publishPage(id: string, tenantId: string, publishAt?: Date): Promise<StorePageOutput>;
  unpublishPage(id: string, tenantId: string): Promise<StorePageOutput>;
  schedulePage(id: string, tenantId: string, startAt: Date, endAt?: Date): Promise<StorePageOutput>;
  getPublishingStatus(id: string, tenantId: string): Promise<PagePublishingStatus>;

  // Campaign Management
  createCampaignPage(input: StorePageInput & { isCampaign: true }): Promise<CampaignPage>;
  getCampaignPages(tenantId: string, filters?: {
    storeId?: string;
    campaignType?: CampaignType;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<CampaignPage[]>;
  updateCampaignPriority(id: string, tenantId: string, priority: number): Promise<CampaignPage>;
  getActiveCampaigns(storeId: string, tenantId: string): Promise<CampaignPage[]>;

  // Route Resolution
  resolvePageRoute(storeId: string, path: string, tenantId: string): Promise<PageRouteInfo | null>;
  getPageRoutes(tenantId: string, storeId?: string): Promise<PageRouteInfo[]>;
  checkPathAvailability(storeId: string, path: string, tenantId: string, excludeId?: string): Promise<boolean>;

  // Cache Management
  getPageCacheInfo(id: string, tenantId: string): Promise<PageCacheInfo>;
  invalidatePageCache(id: string, tenantId: string): Promise<boolean>;
  revalidatePage(id: string, tenantId: string): Promise<PageRevalidationResult>;
  getPagesForRevalidation(tenantId: string, before?: Date): Promise<StorePageOutput[]>;
  updateRevalidationTime(id: string, tenantId: string, revalidateAt: Date): Promise<void>;

  // Analytics
  trackPageView(id: string, tenantId: string, viewData?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
    sessionId?: string;
  }): Promise<void>;
  getPageAnalytics(id: string, tenantId: string): Promise<PageAnalytics>;
  getPageStats(tenantId: string, filters?: {
    storeId?: string;
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<{
    totalPages: number;
    publishedPages: number;
    draftPages: number;
    campaignPages: number;
    totalViews: number;
    averageViewsPerPage: number;
    topPages: Array<{
      id: string;
      title: string;
      path: string;
      viewCount: number;
    }>;
  }>;

  // SEO & OG Images
  generateOGImage(data: OGImageData): Promise<{
    imageUrl: string;
    width: number;
    height: number;
  }>;
  getPageSEOData(id: string, tenantId: string): Promise<{
    title: string;
    description?: string;
    keywords: string[];
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
    canonicalUrl?: string;
    structuredData?: any;
  }>;
  updatePageSEO(id: string, tenantId: string, seoData: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    ogImage?: string;
    ogTitle?: string;
    ogDescription?: string;
  }): Promise<StorePageOutput>;

  // ISR (Incremental Static Regeneration)
  getISRConfig(tenantId: string): Promise<{
    revalidateInterval: number;
    maxPages: number;
    enabled: boolean;
  }>;
  updateISRConfig(tenantId: string, config: {
    revalidateInterval?: number;
    maxPages?: number;
    enabled?: boolean;
  }): Promise<void>;
  triggerISRRevalidation(tenantId: string, paths?: string[]): Promise<{
    success: boolean;
    revalidatedPaths: string[];
    errors: string[];
  }>;

  // Bulk Operations
  bulkUpdatePages(tenantId: string, updates: Array<{
    id: string;
    updates: StorePageUpdateInput;
  }>): Promise<StorePageOutput[]>;
  bulkDeletePages(tenantId: string, pageIds: string[]): Promise<boolean>;
  bulkPublishPages(tenantId: string, pageIds: string[], publishAt?: Date): Promise<StorePageOutput[]>;
  bulkUnpublishPages(tenantId: string, pageIds: string[]): Promise<StorePageOutput[]>;

  // Search & Filtering
  searchPages(tenantId: string, query: string, filters?: {
    storeId?: string;
    status?: PageStatus;
    isCampaign?: boolean;
    campaignType?: CampaignType;
    limit?: number;
    offset?: number;
  }): Promise<StorePageOutput[]>;
  getPagesByTag(tenantId: string, tag: string, storeId?: string): Promise<StorePageOutput[]>;
  getPagesByDateRange(tenantId: string, startDate: Date, endDate: Date, storeId?: string): Promise<StorePageOutput[]>;

  // Health & Monitoring
  getPageHealth(tenantId: string): Promise<{
    totalPages: number;
    publishedPages: number;
    scheduledPages: number;
    expiredPages: number;
    pagesNeedingRevalidation: number;
    averageCacheAge: number;
    lastRevalidation?: Date;
  }>;
  getSystemStatus(tenantId: string): Promise<{
    isrEnabled: boolean;
    cacheStatus: 'healthy' | 'degraded' | 'down';
    revalidationQueue: number;
    lastHealthCheck: Date;
  }>;
}

