/**
 * Moderation Domain Port
 * Interface for content moderation and image similarity detection
 */

export interface ModerationCase {
  id: string;
  tenantId: string;
  productId?: string;
  sellerId?: string;
  caseType: ModerationType;
  status: ModerationStatus;
  priority: ModerationPriority;
  title?: string;
  description?: string;
  imageUrl?: string;
  imageHash?: string;
  imageHashType?: string;
  similarCases?: Array<{ caseId: string; similarityScore: number }>;
  similarityScore?: number;
  similarityThreshold: number;
  aiAnalysis?: Record<string, any>;
  confidenceScore?: number;
  detectedIssues: string[];
  assignedTo?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  reviewDecision?: ModerationDecision;
  resolvedAt?: Date;
  resolutionNotes?: string;
  actionTaken?: string;
  source?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageHash {
  id: string;
  tenantId: string;
  productId?: string;
  imageUrl: string;
  imageHash: string;
  hashType: string;
  hashLength: number;
  width?: number;
  height?: number;
  fileSize?: number;
  format?: string;
  processedAt: Date;
  processingTime?: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageSimilarityResult {
  imageHash: string;
  similarHashes: Array<{
    hash: string;
    similarity: number;
    productId?: string;
    caseId?: string;
  }>;
  highestSimilarity: number;
  isFlagged: boolean;
  threshold: number;
}

export interface ProductFlaggedEvent {
  productId: string;
  tenantId: string;
  sellerId: string;
  caseId: string;
  reason: string;
  similarityScore: number;
  threshold: number;
  similarProducts: Array<{
    productId: string;
    similarity: number;
  }>;
  imageUrl: string;
  imageHash: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ModerationPort {
  // Image hash operations
  generateImageHash(imageUrl: string, options?: {
    hashType?: 'pHash' | 'dHash' | 'aHash';
    hashLength?: number;
  }): Promise<{
    hash: string;
    hashType: string;
    hashLength: number;
    processingTime: number;
  }>;
  
  // Image similarity detection
  detectImageSimilarity(imageHash: string, options?: {
    threshold?: number;
    limit?: number;
  }): Promise<ImageSimilarityResult>;
  
  // Moderation case management
  createModerationCase(caseData: Partial<ModerationCase>): Promise<ModerationCase>;
  updateModerationCase(caseId: string, updates: Partial<ModerationCase>): Promise<ModerationCase>;
  getModerationCase(caseId: string): Promise<ModerationCase | null>;
  getModerationCases(filters: {
    tenantId: string;
    status?: ModerationStatus;
    caseType?: ModerationType;
    assignedTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    cases: ModerationCase[];
    total: number;
  }>;
  
  // Product moderation
  moderateProduct(productId: string, imageUrls: string[]): Promise<{
    flagged: boolean;
    cases: ModerationCase[];
    events: ProductFlaggedEvent[];
  }>;
  
  // Image hash management
  storeImageHash(hashData: Partial<ImageHash>): Promise<ImageHash>;
  getImageHashes(filters: {
    tenantId: string;
    productId?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ImageHash[]>;
  
  // Event publishing
  publishProductFlaggedEvent(event: ProductFlaggedEvent): Promise<boolean>;
  
  // Health check
  healthCheck(): Promise<boolean>;
}

// Enums
export enum ModerationType {
  IMAGE_SIMILARITY = 'IMAGE_SIMILARITY',
  CONTENT_REVIEW = 'CONTENT_REVIEW',
  SPAM_DETECTION = 'SPAM_DETECTION',
  INAPPROPRIATE = 'INAPPROPRIATE',
  COPYRIGHT = 'COPYRIGHT',
  TRADEMARK = 'TRADEMARK',
  COUNTERFEIT = 'COUNTERFEIT',
  MANUAL_REPORT = 'MANUAL_REPORT',
  AUTOMATED_FLAG = 'AUTOMATED_FLAG',
}

export enum ModerationStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
}

export enum ModerationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ModerationDecision {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  MODIFY = 'MODIFY',
  ESCALATE = 'ESCALATE',
  IGNORE = 'IGNORE',
}

