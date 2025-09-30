/**
 * Moderation Adapter - Concrete implementation of moderation service
 * Handles image similarity detection using pHash algorithm
 */

import { ModerationPort, ModerationCase, ImageHash, ImageSimilarityResult, ProductFlaggedEvent, ModerationType, ModerationStatus, ModerationPriority, ModerationDecision } from '@tdc/domain';
import { PrismaClient } from '@prisma/client';
import { EventOutbox } from '@tdc/domain';

export class ModerationAdapter implements ModerationPort {
  constructor(private prisma: PrismaClient) {}

  // ===========================================
  // IMAGE HASH OPERATIONS
  // ===========================================

  async generateImageHash(imageUrl: string, options: {
    hashType?: 'pHash' | 'dHash' | 'aHash';
    hashLength?: number;
  } = {}): Promise<{
    hash: string;
    hashType: string;
    hashLength: number;
    processingTime: number;
  }> {
    const startTime = Date.now();
    
    try {
      // Mock pHash generation - in real implementation, this would use a library like 'pHash'
      const hashType = options.hashType || 'pHash';
      const hashLength = options.hashLength || 64;
      
      // Simulate image processing and hash generation
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing time
      
      // Generate a mock pHash (in real implementation, this would be actual pHash)
      const mockHash = this.generateMockPHash(hashLength);
      
      const processingTime = Date.now() - startTime;
      
      return {
        hash: mockHash,
        hashType,
        hashLength,
        processingTime,
      };
    } catch (error: any) {
      console.error('Error generating image hash:', error);
      throw error;
    }
  }

  // ===========================================
  // IMAGE SIMILARITY DETECTION
  // ===========================================

  async detectImageSimilarity(imageHash: string, options: {
    threshold?: number;
    limit?: number;
  } = {}): Promise<ImageSimilarityResult> {
    try {
      const threshold = options.threshold || 0.8;
      const limit = options.limit || 10;
      
      // Get all active image hashes from the database
      const existingHashes = await this.prisma.imageHash.findMany({
        where: {
          isActive: true,
          imageHash: {
            not: imageHash, // Exclude the current image
          },
        },
        include: {
          product: true,
        },
        take: 1000, // Limit for performance
      });
      
      // Calculate similarity with each existing hash
      const similarities = existingHashes.map(existing => {
        const similarity = this.calculateHashSimilarity(imageHash, existing.imageHash);
        return {
          hash: existing.imageHash,
          similarity,
          productId: existing.productId,
          caseId: undefined, // Would be populated if there's a related moderation case
        };
      });
      
      // Sort by similarity and take top results
      const topSimilarities = similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
      
      const highestSimilarity = topSimilarities.length > 0 ? topSimilarities[0].similarity : 0;
      const isFlagged = highestSimilarity >= threshold;
      
      return {
        imageHash,
        similarHashes: topSimilarities,
        highestSimilarity,
        isFlagged,
        threshold,
      };
    } catch (error: any) {
      console.error('Error detecting image similarity:', error);
      throw error;
    }
  }

  // ===========================================
  // MODERATION CASE MANAGEMENT
  // ===========================================

  async createModerationCase(caseData: Partial<ModerationCase>): Promise<ModerationCase> {
    try {
      const case_ = await this.prisma.moderationCase.create({
        data: {
          id: caseData.id || undefined,
          tenantId: caseData.tenantId!,
          productId: caseData.productId,
          sellerId: caseData.sellerId,
          caseType: caseData.caseType!,
          status: caseData.status || ModerationStatus.PENDING,
          priority: caseData.priority || ModerationPriority.MEDIUM,
          title: caseData.title,
          description: caseData.description,
          imageUrl: caseData.imageUrl,
          imageHash: caseData.imageHash,
          imageHashType: caseData.imageHashType || 'pHash',
          similarCases: caseData.similarCases || null,
          similarityScore: caseData.similarityScore,
          similarityThreshold: caseData.similarityThreshold || 0.8,
          aiAnalysis: caseData.aiAnalysis || null,
          confidenceScore: caseData.confidenceScore,
          detectedIssues: caseData.detectedIssues || [],
          assignedTo: caseData.assignedTo,
          reviewedAt: caseData.reviewedAt,
          reviewNotes: caseData.reviewNotes,
          reviewDecision: caseData.reviewDecision,
          resolvedAt: caseData.resolvedAt,
          resolutionNotes: caseData.resolutionNotes,
          actionTaken: caseData.actionTaken,
          source: caseData.source,
          metadata: caseData.metadata || null,
        },
      });
      
      return this.mapPrismaToModerationCase(case_);
    } catch (error: any) {
      console.error('Error creating moderation case:', error);
      throw error;
    }
  }

  async updateModerationCase(caseId: string, updates: Partial<ModerationCase>): Promise<ModerationCase> {
    try {
      const case_ = await this.prisma.moderationCase.update({
        where: { id: caseId },
        data: {
          ...(updates.tenantId && { tenantId: updates.tenantId }),
          ...(updates.productId !== undefined && { productId: updates.productId }),
          ...(updates.sellerId !== undefined && { sellerId: updates.sellerId }),
          ...(updates.caseType && { caseType: updates.caseType }),
          ...(updates.status && { status: updates.status }),
          ...(updates.priority && { priority: updates.priority }),
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.imageUrl !== undefined && { imageUrl: updates.imageUrl }),
          ...(updates.imageHash !== undefined && { imageHash: updates.imageHash }),
          ...(updates.imageHashType !== undefined && { imageHashType: updates.imageHashType }),
          ...(updates.similarCases !== undefined && { similarCases: updates.similarCases }),
          ...(updates.similarityScore !== undefined && { similarityScore: updates.similarityScore }),
          ...(updates.similarityThreshold !== undefined && { similarityThreshold: updates.similarityThreshold }),
          ...(updates.aiAnalysis !== undefined && { aiAnalysis: updates.aiAnalysis }),
          ...(updates.confidenceScore !== undefined && { confidenceScore: updates.confidenceScore }),
          ...(updates.detectedIssues !== undefined && { detectedIssues: updates.detectedIssues }),
          ...(updates.assignedTo !== undefined && { assignedTo: updates.assignedTo }),
          ...(updates.reviewedAt !== undefined && { reviewedAt: updates.reviewedAt }),
          ...(updates.reviewNotes !== undefined && { reviewNotes: updates.reviewNotes }),
          ...(updates.reviewDecision !== undefined && { reviewDecision: updates.reviewDecision }),
          ...(updates.resolvedAt !== undefined && { resolvedAt: updates.resolvedAt }),
          ...(updates.resolutionNotes !== undefined && { resolutionNotes: updates.resolutionNotes }),
          ...(updates.actionTaken !== undefined && { actionTaken: updates.actionTaken }),
          ...(updates.source !== undefined && { source: updates.source }),
          ...(updates.metadata !== undefined && { metadata: updates.metadata }),
        },
      });
      
      return this.mapPrismaToModerationCase(case_);
    } catch (error: any) {
      console.error('Error updating moderation case:', error);
      throw error;
    }
  }

  async getModerationCase(caseId: string): Promise<ModerationCase | null> {
    try {
      const case_ = await this.prisma.moderationCase.findUnique({
        where: { id: caseId },
      });
      
      return case_ ? this.mapPrismaToModerationCase(case_) : null;
    } catch (error: any) {
      console.error('Error getting moderation case:', error);
      return null;
    }
  }

  async getModerationCases(filters: {
    tenantId: string;
    status?: ModerationStatus;
    caseType?: ModerationType;
    assignedTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    cases: ModerationCase[];
    total: number;
  }> {
    try {
      const where: any = {
        tenantId: filters.tenantId,
      };
      
      if (filters.status) where.status = filters.status;
      if (filters.caseType) where.caseType = filters.caseType;
      if (filters.assignedTo) where.assignedTo = filters.assignedTo;
      
      const [cases, total] = await Promise.all([
        this.prisma.moderationCase.findMany({
          where,
          take: filters.limit || 20,
          skip: filters.offset || 0,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.moderationCase.count({ where }),
      ]);
      
      return {
        cases: cases.map(c => this.mapPrismaToModerationCase(c)),
        total,
      };
    } catch (error: any) {
      console.error('Error getting moderation cases:', error);
      return { cases: [], total: 0 };
    }
  }

  // ===========================================
  // PRODUCT MODERATION
  // ===========================================

  async moderateProduct(productId: string, imageUrls: string[]): Promise<{
    flagged: boolean;
    cases: ModerationCase[];
    events: ProductFlaggedEvent[];
  }> {
    try {
      // This would typically be called by the moderation service
      // For now, return empty results
      return {
        flagged: false,
        cases: [],
        events: [],
      };
    } catch (error: any) {
      console.error('Error moderating product:', error);
      throw error;
    }
  }

  // ===========================================
  // IMAGE HASH MANAGEMENT
  // ===========================================

  async storeImageHash(hashData: Partial<ImageHash>): Promise<ImageHash> {
    try {
      const hash = await this.prisma.imageHash.create({
        data: {
          id: hashData.id || undefined,
          tenantId: hashData.tenantId!,
          productId: hashData.productId,
          imageUrl: hashData.imageUrl!,
          imageHash: hashData.imageHash!,
          hashType: hashData.hashType || 'pHash',
          hashLength: hashData.hashLength || 64,
          width: hashData.width,
          height: hashData.height,
          fileSize: hashData.fileSize,
          format: hashData.format,
          processedAt: hashData.processedAt || new Date(),
          processingTime: hashData.processingTime,
          isActive: hashData.isActive !== undefined ? hashData.isActive : true,
          metadata: hashData.metadata || null,
        },
      });
      
      return this.mapPrismaToImageHash(hash);
    } catch (error: any) {
      console.error('Error storing image hash:', error);
      throw error;
    }
  }

  async getImageHashes(filters: {
    tenantId: string;
    productId?: string;
    isActive?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ImageHash[]> {
    try {
      const where: any = {
        tenantId: filters.tenantId,
      };
      
      if (filters.productId) where.productId = filters.productId;
      if (filters.isActive !== undefined) where.isActive = filters.isActive;
      
      const hashes = await this.prisma.imageHash.findMany({
        where,
        take: filters.limit || 100,
        skip: filters.offset || 0,
        orderBy: { createdAt: 'desc' },
      });
      
      return hashes.map(h => this.mapPrismaToImageHash(h));
    } catch (error: any) {
      console.error('Error getting image hashes:', error);
      return [];
    }
  }

  // ===========================================
  // EVENT PUBLISHING
  // ===========================================

  async publishProductFlaggedEvent(event: ProductFlaggedEvent): Promise<boolean> {
    try {
      // Store the event in the outbox for reliable delivery
      await this.prisma.eventOutbox.create({
        data: {
          eventType: 'ProductFlagged',
          aggregateId: event.productId,
          aggregateType: 'Product',
          eventData: event,
          tenantId: event.tenantId,
          status: 'PENDING',
          retryCount: 0,
          scheduledFor: new Date(),
        },
      });
      
      return true;
    } catch (error: any) {
      console.error('Error publishing ProductFlagged event:', error);
      return false;
    }
  }

  // ===========================================
  // HEALTH CHECK
  // ===========================================

  async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  private generateMockPHash(length: number): string {
    // Generate a mock pHash string
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private calculateHashSimilarity(hash1: string, hash2: string): number {
    if (hash1.length !== hash2.length) return 0;
    
    let matches = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] === hash2[i]) matches++;
    }
    
    return matches / hash1.length;
  }

  private mapPrismaToModerationCase(prismaCase: any): ModerationCase {
    return {
      id: prismaCase.id,
      tenantId: prismaCase.tenantId,
      productId: prismaCase.productId,
      sellerId: prismaCase.sellerId,
      caseType: prismaCase.caseType,
      status: prismaCase.status,
      priority: prismaCase.priority,
      title: prismaCase.title,
      description: prismaCase.description,
      imageUrl: prismaCase.imageUrl,
      imageHash: prismaCase.imageHash,
      imageHashType: prismaCase.imageHashType,
      similarCases: prismaCase.similarCases,
      similarityScore: prismaCase.similarityScore,
      similarityThreshold: prismaCase.similarityThreshold,
      aiAnalysis: prismaCase.aiAnalysis,
      confidenceScore: prismaCase.confidenceScore,
      detectedIssues: prismaCase.detectedIssues,
      assignedTo: prismaCase.assignedTo,
      reviewedAt: prismaCase.reviewedAt,
      reviewNotes: prismaCase.reviewNotes,
      reviewDecision: prismaCase.reviewDecision,
      resolvedAt: prismaCase.resolvedAt,
      resolutionNotes: prismaCase.resolutionNotes,
      actionTaken: prismaCase.actionTaken,
      source: prismaCase.source,
      metadata: prismaCase.metadata,
      createdAt: prismaCase.createdAt,
      updatedAt: prismaCase.updatedAt,
    };
  }

  private mapPrismaToImageHash(prismaHash: any): ImageHash {
    return {
      id: prismaHash.id,
      tenantId: prismaHash.tenantId,
      productId: prismaHash.productId,
      imageUrl: prismaHash.imageUrl,
      imageHash: prismaHash.imageHash,
      hashType: prismaHash.hashType,
      hashLength: prismaHash.hashLength,
      width: prismaHash.width,
      height: prismaHash.height,
      fileSize: prismaHash.fileSize,
      format: prismaHash.format,
      processedAt: prismaHash.processedAt,
      processingTime: prismaHash.processingTime,
      isActive: prismaHash.isActive,
      metadata: prismaHash.metadata,
      createdAt: prismaHash.createdAt,
      updatedAt: prismaHash.updatedAt,
    };
  }
}

