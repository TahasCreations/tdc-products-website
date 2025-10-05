/**
 * Medya Kütüphanesi (DAM) - Digital Asset Management
 * Görsel yönetimi, optimizasyon ve otomatik varyant üretimi
 */

import { z } from 'zod';

// Medya türleri
export const MediaType = z.enum(['image', 'video', 'lottie', '3d', 'audio']);
export type MediaType = z.infer<typeof MediaType>;

// Varyant boyutları
export const VariantSize = z.enum([
  'thumbnail',    // 1:1 (300x300)
  'card',         // 4:5 (800x1000)
  'hero',         // 16:9 (1920x1080)
  'banner',       // 3:2 (1440x960)
  'square',       // 1:1 (800x800)
  'portrait',     // 3:4 (600x800)
  'landscape'     // 4:3 (1200x900)
]);
export type VariantSize = z.infer<typeof VariantSize>;

// Medya öğesi şeması
export const MediaItemSchema = z.object({
  id: z.string(),
  filename: z.string(),
  originalName: z.string(),
  mimeType: z.string(),
  size: z.number(),
  width: z.number(),
  height: z.number(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  tags: z.array(z.string()).default([]),
  collections: z.array(z.string()).default([]),
  variants: z.record(VariantSize, z.object({
    url: z.string(),
    width: z.number(),
    height: z.number(),
    format: z.enum(['jpeg', 'webp', 'avif']),
    quality: z.number().min(0).max(100),
    size: z.number()
  })),
  blurDataUrl: z.string().optional(),
  colorPalette: z.object({
    dominant: z.string(),
    palette: z.array(z.string()).length(5),
    isDark: z.boolean()
  }).optional(),
  metadata: z.object({
    camera: z.string().optional(),
    lens: z.string().optional(),
    settings: z.string().optional(),
    location: z.string().optional(),
    createdAt: z.string(),
    uploadedBy: z.string(),
    aiGenerated: z.boolean().default(false)
  }),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type MediaItem = z.infer<typeof MediaItemSchema>;

// Koleksiyon şeması
export const CollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  slug: z.string(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).default([]),
  itemCount: z.number().default(0),
  isPublic: z.boolean().default(false),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Collection = z.infer<typeof CollectionSchema>;

// Hero yönetimi şeması
export const HeroConfigSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(), // kategori slug'ı
  type: z.enum(['category', 'campaign', 'seasonal', 'promotion']),
  media: z.object({
    desktop: z.string(), // MediaItem ID
    tablet: z.string().optional(),
    mobile: z.string().optional()
  }),
  content: z.object({
    headline: z.string(),
    subheadline: z.string().optional(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    overlayOpacity: z.number().min(0).max(1).default(0.3)
  }),
  schedule: z.object({
    startDate: z.string(),
    endDate: z.string().optional(),
    timezone: z.string().default('Europe/Istanbul')
  }).optional(),
  abTest: z.object({
    isActive: z.boolean().default(false),
    variants: z.array(z.object({
      id: z.string(),
      traffic: z.number().min(0).max(100), // yüzde
      media: z.object({
        desktop: z.string(),
        tablet: z.string().optional(),
        mobile: z.string().optional()
      }),
      content: z.object({
        headline: z.string(),
        subheadline: z.string().optional(),
        ctaText: z.string().optional(),
        ctaLink: z.string().optional()
      })
    })).default([])
  }).optional(),
  analytics: z.object({
    views: z.number().default(0),
    clicks: z.number().default(0),
    conversions: z.number().default(0)
  }).default({ views: 0, clicks: 0, conversions: 0 }),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type HeroConfig = z.infer<typeof HeroConfigSchema>;

// UGC (User Generated Content) şeması
export const UGCSchema = z.object({
  id: z.string(),
  userId: z.string(),
  mediaItemId: z.string(),
  productId: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  moderation: z.object({
    reviewedBy: z.string().optional(),
    reviewedAt: z.string().optional(),
    notes: z.string().optional(),
    violations: z.array(z.enum([
      'inappropriate', 'copyright', 'spam', 'low_quality', 'irrelevant'
    ])).default([])
  }).optional(),
  consent: z.object({
    marketingUse: z.boolean().default(false),
    socialMedia: z.boolean().default(false),
    productPromotion: z.boolean().default(true)
  }),
  metadata: z.object({
    userAgent: z.string().optional(),
    ipAddress: z.string().optional(),
    uploadSource: z.enum(['web', 'mobile_app', 'api']).default('web')
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type UGC = z.infer<typeof UGCSchema>;

// Varyant boyut tanımları
export const VARIANT_CONFIGS: Record<VariantSize, {
  width: number;
  height: number;
  quality: number;
  formats: ('avif' | 'webp' | 'jpeg')[];
}> = {
  thumbnail: { width: 300, height: 300, quality: 85, formats: ['avif', 'webp', 'jpeg'] },
  card: { width: 800, height: 1000, quality: 90, formats: ['avif', 'webp', 'jpeg'] },
  hero: { width: 1920, height: 1080, quality: 95, formats: ['avif', 'webp', 'jpeg'] },
  banner: { width: 1440, height: 960, quality: 90, formats: ['avif', 'webp', 'jpeg'] },
  square: { width: 800, height: 800, quality: 90, formats: ['avif', 'webp', 'jpeg'] },
  portrait: { width: 600, height: 800, quality: 90, formats: ['avif', 'webp', 'jpeg'] },
  landscape: { width: 1200, height: 900, quality: 90, formats: ['avif', 'webp', 'jpeg'] }
};

// Medya kütüphanesi servis sınıfı
export class MediaLibraryService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // Medya yükleme
  async uploadMedia(
    file: File,
    metadata: Partial<Pick<MediaItem, 'alt' | 'caption' | 'tags' | 'collections'>>
  ): Promise<MediaItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await fetch(`${this.baseUrl}/api/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return MediaItemSchema.parse(await response.json());
  }

  // Medya listesi
  async getMediaItems(filters?: {
    tags?: string[];
    collections?: string[];
    type?: MediaType;
    limit?: number;
    offset?: number;
  }): Promise<{ items: MediaItem[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.tags) params.append('tags', filters.tags.join(','));
    if (filters?.collections) params.append('collections', filters.collections.join(','));
    if (filters?.type) params.append('type', filters.type);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await fetch(`${this.baseUrl}/api/media?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      items: data.items.map((item: any) => MediaItemSchema.parse(item)),
      total: data.total
    };
  }

  // Medya detayı
  async getMediaItem(id: string): Promise<MediaItem> {
    const response = await fetch(`${this.baseUrl}/api/media/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch media item: ${response.statusText}`);
    }

    return MediaItemSchema.parse(await response.json());
  }

  // Medya güncelleme
  async updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    const response = await fetch(`${this.baseUrl}/api/media/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Failed to update media item: ${response.statusText}`);
    }

    return MediaItemSchema.parse(await response.json());
  }

  // Medya silme
  async deleteMediaItem(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/media/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete media item: ${response.statusText}`);
    }
  }

  // AI alt metin önerisi
  async generateAltText(mediaItemId: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/media/${mediaItemId}/alt-text`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to generate alt text: ${response.statusText}`);
    }

    const data = await response.json();
    return data.altText;
  }

  // Renk paleti çıkarma
  async extractColorPalette(mediaItemId: string): Promise<{
    dominant: string;
    palette: string[];
    isDark: boolean;
  }> {
    const response = await fetch(`${this.baseUrl}/api/media/${mediaItemId}/palette`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to extract color palette: ${response.statusText}`);
    }

    return await response.json();
  }

  // Hero yapılandırması
  async getHeroConfig(slug: string): Promise<HeroConfig | null> {
    const response = await fetch(`${this.baseUrl}/api/hero/${slug}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch hero config: ${response.statusText}`);
    }

    return HeroConfigSchema.parse(await response.json());
  }

  // UGC yükleme
  async uploadUGC(
    file: File,
    userId: string,
    productId?: string,
    consent?: UGC['consent']
  ): Promise<UGC> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    if (productId) formData.append('productId', productId);
    if (consent) formData.append('consent', JSON.stringify(consent));

    const response = await fetch(`${this.baseUrl}/api/ugc/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`UGC upload failed: ${response.statusText}`);
    }

    return UGCSchema.parse(await response.json());
  }

  // UGC moderasyon
  async moderateUGC(id: string, status: UGC['status'], notes?: string): Promise<UGC> {
    const response = await fetch(`${this.baseUrl}/api/ugc/${id}/moderate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({ status, notes })
    });

    if (!response.ok) {
      throw new Error(`UGC moderation failed: ${response.statusText}`);
    }

    return UGCSchema.parse(await response.json());
  }
}

// Varsayılan servis instance
export const mediaLibrary = new MediaLibraryService(
  process.env.NEXT_PUBLIC_API_URL || '',
  process.env.MEDIA_API_KEY || ''
);
