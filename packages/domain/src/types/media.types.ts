// Media Types
export interface MediaFileInput {
  tenantId: string;
  storeId: string;
  userId?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileExtension: string;
  storageProvider: string;
  storagePath: string;
  storageUrl: string;
  storageBucket?: string;
  storageRegion?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  colorSpace?: string;
  hasAlpha?: boolean;
  thumbnails?: Record<string, string>;
  webpUrl?: string;
  avifUrl?: string;
  blurDataUrl?: string;
  processingStatus?: ProcessingStatus;
  processingError?: string;
  processingStarted?: Date;
  processingCompleted?: Date;
  usageCount?: number;
  lastUsedAt?: Date;
  altText?: string;
  caption?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  isActive?: boolean;
  isPublic?: boolean;
}

export interface MediaFileOutput {
  id: string;
  tenantId: string;
  storeId: string;
  userId?: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileExtension: string;
  storageProvider: string;
  storagePath: string;
  storageUrl: string;
  storageBucket?: string;
  storageRegion?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  colorSpace?: string;
  hasAlpha: boolean;
  thumbnails?: Record<string, string>;
  webpUrl?: string;
  avifUrl?: string;
  blurDataUrl?: string;
  processingStatus: ProcessingStatus;
  processingError?: string;
  processingStarted?: Date;
  processingCompleted?: Date;
  usageCount: number;
  lastUsedAt?: Date;
  altText?: string;
  caption?: string;
  tags: string[];
  metadata?: Record<string, any>;
  isActive: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaQuotaInput {
  tenantId: string;
  storeId: string;
  subscriptionId?: string;
  maxStorageBytes: number;
  maxFiles: number;
  maxFileSize: number;
  allowedMimeTypes: string[];
  usedStorageBytes?: number;
  usedFiles?: number;
  storageWarningThreshold?: number;
  filesWarningThreshold?: number;
  isActive?: boolean;
  lastResetAt?: Date;
  nextResetAt?: Date;
  metadata?: Record<string, any>;
}

export interface MediaQuotaOutput {
  id: string;
  tenantId: string;
  storeId: string;
  subscriptionId?: string;
  maxStorageBytes: number;
  maxFiles: number;
  maxFileSize: number;
  allowedMimeTypes: string[];
  usedStorageBytes: number;
  usedFiles: number;
  storageWarningThreshold: number;
  filesWarningThreshold: number;
  isActive: boolean;
  lastResetAt?: Date;
  nextResetAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Storage Provider Types
export interface StorageProvider {
  name: string;
  uploadFile: (file: FileUploadData) => Promise<StorageUploadResult>;
  deleteFile: (path: string) => Promise<StorageDeleteResult>;
  getFileUrl: (path: string) => string;
  generateSignedUrl: (path: string, expiresIn?: number) => Promise<string>;
  copyFile: (sourcePath: string, destPath: string) => Promise<StorageCopyResult>;
  moveFile: (sourcePath: string, destPath: string) => Promise<StorageMoveResult>;
}

export interface FileUploadData {
  file: Buffer | Uint8Array;
  filename: string;
  mimeType: string;
  path: string;
  bucket?: string;
  metadata?: Record<string, string>;
  acl?: string;
}

export interface StorageUploadResult {
  success: boolean;
  url: string;
  path: string;
  bucket?: string;
  etag?: string;
  error?: string;
}

export interface StorageDeleteResult {
  success: boolean;
  error?: string;
}

export interface StorageCopyResult {
  success: boolean;
  url: string;
  path: string;
  error?: string;
}

export interface StorageMoveResult {
  success: boolean;
  url: string;
  path: string;
  error?: string;
}

// Image Processing Types
export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  position?: 'top' | 'right' | 'bottom' | 'left' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  background?: string;
  blur?: number;
  sharpen?: number;
  gamma?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  hue?: number;
}

export interface ThumbnailConfig {
  size: ThumbnailSize;
  width: number;
  height: number;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
  fit: 'cover' | 'contain' | 'fill';
}

export interface ImageProcessingResult {
  success: boolean;
  thumbnails: Record<string, string>;
  webpUrl?: string;
  avifUrl?: string;
  blurDataUrl?: string;
  error?: string;
}

// Media Upload Types
export interface MediaUploadRequest {
  file: File;
  storeId: string;
  userId?: string;
  altText?: string;
  caption?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  isPublic?: boolean;
}

export interface MediaUploadResult {
  success: boolean;
  mediaFile?: MediaFileOutput;
  error?: string;
  quotaExceeded?: boolean;
  quotaWarning?: boolean;
}

// Media Search and Filter Types
export interface MediaSearchFilters {
  storeId: string;
  mimeType?: string;
  mediaType?: MediaType;
  tags?: string[];
  isActive?: boolean;
  isPublic?: boolean;
  processingStatus?: ProcessingStatus;
  dateFrom?: Date;
  dateTo?: Date;
  sizeMin?: number;
  sizeMax?: number;
  widthMin?: number;
  widthMax?: number;
  heightMin?: number;
  heightMax?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'filename' | 'fileSize' | 'usageCount';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface MediaSearchResult {
  files: MediaFileOutput[];
  total: number;
  hasMore: boolean;
  quota: MediaQuotaOutput;
  quotaUsage: {
    storagePercentage: number;
    filesPercentage: number;
    storageWarning: boolean;
    filesWarning: boolean;
  };
}

// Quota Management Types
export interface QuotaUsage {
  storageBytes: number;
  files: number;
  storagePercentage: number;
  filesPercentage: number;
  storageWarning: boolean;
  filesWarning: boolean;
  storageExceeded: boolean;
  filesExceeded: boolean;
}

export interface QuotaCheckResult {
  allowed: boolean;
  reason?: string;
  quota: MediaQuotaOutput;
  usage: QuotaUsage;
}

// Media Library Types
export interface MediaLibraryConfig {
  storeId: string;
  allowedMimeTypes: string[];
  maxFileSize: number;
  maxFiles: number;
  maxStorageBytes: number;
  thumbnailSizes: ThumbnailConfig[];
  enableWebP: boolean;
  enableAVIF: boolean;
  enableBlurPlaceholder: boolean;
  autoOptimize: boolean;
  quality: number;
}

export interface MediaLibraryStats {
  totalFiles: number;
  totalSize: number;
  totalSizeFormatted: string;
  byType: Record<string, { count: number; size: number }>;
  byStatus: Record<ProcessingStatus, number>;
  recentUploads: MediaFileOutput[];
  mostUsed: MediaFileOutput[];
  quotaUsage: QuotaUsage;
}

// Background Job Types
export interface MediaProcessingJob {
  id: string;
  mediaFileId: string;
  tenantId: string;
  storeId: string;
  type: 'thumbnail' | 'webp' | 'avif' | 'blur' | 'optimize';
  options: ImageProcessingOptions;
  priority: number;
  attempts: number;
  maxAttempts: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface MediaProcessingQueue {
  addJob: (job: Omit<MediaProcessingJob, 'id' | 'createdAt'>) => Promise<string>;
  processJob: (jobId: string) => Promise<MediaProcessingResult>;
  getJob: (jobId: string) => Promise<MediaProcessingJob | null>;
  getJobs: (filters: {
    mediaFileId?: string;
    status?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }) => Promise<MediaProcessingJob[]>;
  retryJob: (jobId: string) => Promise<boolean>;
  cancelJob: (jobId: string) => Promise<boolean>;
}

// Enums
export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  ARCHIVE = 'ARCHIVE',
  OTHER = 'OTHER'
}

export enum ThumbnailSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  XLARGE = 'XLARGE',
  ORIGINAL = 'ORIGINAL'
}

// Predefined Quota Plans
export const MEDIA_QUOTA_PLANS = {
  FREE: {
    maxStorageBytes: 100 * 1024 * 1024, // 100MB
    maxFiles: 50,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
  },
  BASIC: {
    maxStorageBytes: 1024 * 1024 * 1024, // 1GB
    maxFiles: 500,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4']
  },
  PRO: {
    maxStorageBytes: 10 * 1024 * 1024 * 1024, // 10GB
    maxFiles: 5000,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'video/mp4', 'video/webm', 'audio/mp3', 'audio/wav']
  },
  ENTERPRISE: {
    maxStorageBytes: 100 * 1024 * 1024 * 1024, // 100GB
    maxFiles: 50000,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'video/mp4', 'video/webm', 'audio/mp3', 'audio/wav', 'application/pdf', 'application/zip']
  }
} as const;

// Thumbnail Size Configurations
export const THUMBNAIL_SIZES: Record<ThumbnailSize, ThumbnailConfig> = {
  [ThumbnailSize.SMALL]: {
    size: ThumbnailSize.SMALL,
    width: 150,
    height: 150,
    quality: 80,
    format: 'jpeg',
    fit: 'cover'
  },
  [ThumbnailSize.MEDIUM]: {
    size: ThumbnailSize.MEDIUM,
    width: 300,
    height: 300,
    quality: 85,
    format: 'jpeg',
    fit: 'cover'
  },
  [ThumbnailSize.LARGE]: {
    size: ThumbnailSize.LARGE,
    width: 600,
    height: 600,
    quality: 90,
    format: 'jpeg',
    fit: 'cover'
  },
  [ThumbnailSize.XLARGE]: {
    size: ThumbnailSize.XLARGE,
    width: 1200,
    height: 1200,
    quality: 95,
    format: 'jpeg',
    fit: 'cover'
  },
  [ThumbnailSize.ORIGINAL]: {
    size: ThumbnailSize.ORIGINAL,
    width: 0,
    height: 0,
    quality: 100,
    format: 'jpeg',
    fit: 'cover'
  }
} as const;

