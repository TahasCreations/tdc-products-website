import { z } from 'zod';
import { 
  MediaFileInput, 
  MediaFileOutput, 
  MediaQuotaInput, 
  MediaQuotaOutput,
  MediaUploadRequest,
  MediaUploadResult,
  MediaSearchFilters,
  MediaSearchResult,
  QuotaCheckResult,
  QuotaUsage,
  MediaLibraryConfig,
  MediaLibraryStats,
  MediaProcessingJob,
  MediaProcessingQueue,
  StorageProvider,
  ImageProcessingOptions,
  ImageProcessingResult,
  ThumbnailConfig,
  ProcessingStatus,
  MediaType,
  ThumbnailSize
} from '../../types/media.types.js';

// Validation schemas
export const ProcessingStatusSchema = z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED']);
export const MediaTypeSchema = z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'ARCHIVE', 'OTHER']);
export const ThumbnailSizeSchema = z.enum(['SMALL', 'MEDIUM', 'LARGE', 'XLARGE', 'ORIGINAL']);

export const MediaFileInputSchema = z.object({
  tenantId: z.string().min(1),
  storeId: z.string().min(1),
  userId: z.string().optional(),
  filename: z.string().min(1),
  originalName: z.string().min(1),
  mimeType: z.string().min(1),
  fileSize: z.number().min(0),
  fileExtension: z.string().min(1),
  storageProvider: z.string().min(1),
  storagePath: z.string().min(1),
  storageUrl: z.string().url(),
  storageBucket: z.string().optional(),
  storageRegion: z.string().optional(),
  width: z.number().int().min(0).optional(),
  height: z.number().int().min(0).optional(),
  aspectRatio: z.number().min(0).optional(),
  colorSpace: z.string().optional(),
  hasAlpha: z.boolean().default(false),
  thumbnails: z.record(z.string()).optional(),
  webpUrl: z.string().url().optional(),
  avifUrl: z.string().url().optional(),
  blurDataUrl: z.string().optional(),
  processingStatus: ProcessingStatusSchema.default('PENDING'),
  processingError: z.string().optional(),
  processingStarted: z.date().optional(),
  processingCompleted: z.date().optional(),
  usageCount: z.number().int().min(0).default(0),
  lastUsedAt: z.date().optional(),
  altText: z.string().optional(),
  caption: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.any()).optional(),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(true)
});

export const MediaQuotaInputSchema = z.object({
  tenantId: z.string().min(1),
  storeId: z.string().min(1),
  subscriptionId: z.string().optional(),
  maxStorageBytes: z.number().int().min(0),
  maxFiles: z.number().int().min(0),
  maxFileSize: z.number().int().min(0),
  allowedMimeTypes: z.array(z.string()).min(1),
  usedStorageBytes: z.number().int().min(0).default(0),
  usedFiles: z.number().int().min(0).default(0),
  storageWarningThreshold: z.number().min(0).max(1).default(0.8),
  filesWarningThreshold: z.number().min(0).max(1).default(0.8),
  isActive: z.boolean().default(true),
  lastResetAt: z.date().optional(),
  nextResetAt: z.date().optional(),
  metadata: z.record(z.any()).optional()
});

// Media Port Interface
export interface MediaPort {
  // Media File Management
  createMediaFile(input: MediaFileInput): Promise<MediaFileOutput>;
  getMediaFile(id: string, tenantId: string): Promise<MediaFileOutput | null>;
  getMediaFiles(storeId: string, filters?: MediaSearchFilters): Promise<MediaSearchResult>;
  updateMediaFile(id: string, tenantId: string, input: Partial<MediaFileInput>): Promise<MediaFileOutput>;
  deleteMediaFile(id: string, tenantId: string): Promise<boolean>;
  bulkDeleteMediaFiles(ids: string[], tenantId: string): Promise<{ deleted: number; errors: string[] }>;
  
  // Media Upload
  uploadMedia(request: MediaUploadRequest): Promise<MediaUploadResult>;
  uploadMultipleMedia(requests: MediaUploadRequest[]): Promise<MediaUploadResult[]>;
  getUploadUrl(filename: string, mimeType: string, storeId: string): Promise<{
    uploadUrl: string;
    fileId: string;
    expiresIn: number;
  }>;
  
  // Media Processing
  processMediaFile(mediaFileId: string, options: ImageProcessingOptions): Promise<ImageProcessingResult>;
  generateThumbnails(mediaFileId: string, sizes: ThumbnailSize[]): Promise<ImageProcessingResult>;
  convertToWebP(mediaFileId: string, quality?: number): Promise<ImageProcessingResult>;
  convertToAVIF(mediaFileId: string, quality?: number): Promise<ImageProcessingResult>;
  generateBlurPlaceholder(mediaFileId: string): Promise<ImageProcessingResult>;
  optimizeImage(mediaFileId: string, options: ImageProcessingOptions): Promise<ImageProcessingResult>;
  
  // Background Processing
  queueMediaProcessing(job: Omit<MediaProcessingJob, 'id' | 'createdAt'>): Promise<string>;
  processMediaQueue(): Promise<{ processed: number; failed: number; errors: string[] }>;
  getProcessingJobs(filters: {
    mediaFileId?: string;
    status?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<MediaProcessingJob[]>;
  retryProcessingJob(jobId: string): Promise<boolean>;
  cancelProcessingJob(jobId: string): Promise<boolean>;
  
  // Quota Management
  createMediaQuota(input: MediaQuotaInput): Promise<MediaQuotaOutput>;
  getMediaQuota(storeId: string): Promise<MediaQuotaOutput | null>;
  updateMediaQuota(storeId: string, input: Partial<MediaQuotaInput>): Promise<MediaQuotaOutput>;
  checkQuota(storeId: string, fileSize: number, mimeType: string): Promise<QuotaCheckResult>;
  updateQuotaUsage(storeId: string, fileSize: number, fileCount: number): Promise<QuotaUsage>;
  resetQuota(storeId: string): Promise<QuotaUsage>;
  getQuotaUsage(storeId: string): Promise<QuotaUsage>;
  
  // Quota Warnings and Notifications
  checkQuotaWarnings(storeId: string): Promise<{
    storageWarning: boolean;
    filesWarning: boolean;
    storageExceeded: boolean;
    filesExceeded: boolean;
    warnings: string[];
  }>;
  sendQuotaWarning(storeId: string, type: 'storage' | 'files' | 'both'): Promise<boolean>;
  sendQuotaExceeded(storeId: string, type: 'storage' | 'files' | 'both'): Promise<boolean>;
  
  // Media Library Management
  getMediaLibraryConfig(storeId: string): Promise<MediaLibraryConfig>;
  updateMediaLibraryConfig(storeId: string, config: Partial<MediaLibraryConfig>): Promise<MediaLibraryConfig>;
  getMediaLibraryStats(storeId: string): Promise<MediaLibraryStats>;
  
  // Media Search and Filtering
  searchMedia(storeId: string, query: string, filters?: Partial<MediaSearchFilters>): Promise<MediaSearchResult>;
  getMediaByTags(storeId: string, tags: string[]): Promise<MediaFileOutput[]>;
  getMediaByType(storeId: string, mediaType: MediaType): Promise<MediaFileOutput[]>;
  getRecentMedia(storeId: string, limit?: number): Promise<MediaFileOutput[]>;
  getMostUsedMedia(storeId: string, limit?: number): Promise<MediaFileOutput[]>;
  
  // Media Analytics
  trackMediaUsage(mediaFileId: string, context?: string): Promise<boolean>;
  getMediaUsageStats(storeId: string, period: 'day' | 'week' | 'month' | 'year'): Promise<{
    totalViews: number;
    uniqueFiles: number;
    topFiles: Array<{
      mediaFile: MediaFileOutput;
      views: number;
      lastViewed: Date;
    }>;
    viewsByType: Record<MediaType, number>;
    viewsByDate: Array<{
      date: Date;
      views: number;
    }>;
  }>;
  
  // Storage Management
  getStorageProviders(): Promise<StorageProvider[]>;
  setStorageProvider(storeId: string, provider: string, config: Record<string, any>): Promise<boolean>;
  getStorageConfig(storeId: string): Promise<{
    provider: string;
    config: Record<string, any>;
    bucket?: string;
    region?: string;
  } | null>;
  
  // File Operations
  copyMediaFile(mediaFileId: string, newPath: string): Promise<MediaFileOutput>;
  moveMediaFile(mediaFileId: string, newPath: string): Promise<MediaFileOutput>;
  duplicateMediaFile(mediaFileId: string, newName?: string): Promise<MediaFileOutput>;
  
  // Media Organization
  addTags(mediaFileId: string, tags: string[]): Promise<MediaFileOutput>;
  removeTags(mediaFileId: string, tags: string[]): Promise<MediaFileOutput>;
  updateAltText(mediaFileId: string, altText: string): Promise<MediaFileOutput>;
  updateCaption(mediaFileId: string, caption: string): Promise<MediaFileOutput>;
  updateMetadata(mediaFileId: string, metadata: Record<string, any>): Promise<MediaFileOutput>;
  
  // Media Validation
  validateFile(file: File, storeId: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }>;
  validateMimeType(mimeType: string, storeId: string): Promise<boolean>;
  validateFileSize(fileSize: number, storeId: string): Promise<boolean>;
  
  // Media Cleanup
  cleanupUnusedMedia(storeId: string, olderThanDays?: number): Promise<{
    deleted: number;
    freedSpace: number;
    errors: string[];
  }>;
  cleanupFailedProcessing(storeId: string): Promise<{
    deleted: number;
    errors: string[];
  }>;
  cleanupOrphanedFiles(storeId: string): Promise<{
    deleted: number;
    errors: string[];
  }>;
  
  // Media Export/Import
  exportMediaLibrary(storeId: string): Promise<{
    files: MediaFileOutput[];
    quota: MediaQuotaOutput;
    config: MediaLibraryConfig;
  }>;
  importMediaLibrary(storeId: string, data: {
    files: MediaFileInput[];
    config?: Partial<MediaLibraryConfig>;
  }): Promise<{
    imported: number;
    errors: string[];
  }>;
  
  // Media Backup
  backupMedia(storeId: string): Promise<{
    backupId: string;
    files: number;
    totalSize: number;
    backupUrl: string;
  }>;
  restoreMedia(storeId: string, backupId: string): Promise<{
    restored: number;
    errors: string[];
  }>;
  
  // Media Security
  generateSecureUrl(mediaFileId: string, expiresIn?: number): Promise<string>;
  revokeAccess(mediaFileId: string): Promise<boolean>;
  setAccessControl(mediaFileId: string, isPublic: boolean): Promise<MediaFileOutput>;
  
  // Media Optimization
  optimizeMediaLibrary(storeId: string): Promise<{
    optimized: number;
    spaceSaved: number;
    errors: string[];
  }>;
  compressImages(storeId: string, quality?: number): Promise<{
    compressed: number;
    spaceSaved: number;
    errors: string[];
  }>;
  
  // Media Monitoring
  getProcessingQueueStatus(): Promise<{
    pending: number;
    processing: number;
    completed: number;
    failed: number;
    averageProcessingTime: number;
  }>;
  getStorageUsage(storeId: string): Promise<{
    used: number;
    available: number;
    percentage: number;
    byType: Record<string, number>;
  }>;
  
  // Media Events
  onMediaUploaded: (callback: (mediaFile: MediaFileOutput) => void) => void;
  onMediaProcessed: (callback: (mediaFile: MediaFileOutput) => void) => void;
  onQuotaWarning: (callback: (storeId: string, type: string) => void) => void;
  onQuotaExceeded: (callback: (storeId: string, type: string) => void) => void;
}

