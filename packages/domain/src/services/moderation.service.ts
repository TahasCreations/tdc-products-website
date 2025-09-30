/**
 * Moderation Service - Business logic for content moderation
 * Handles image similarity detection using pHash
 */

import { ModerationPort, ModerationCase, ImageHash, ImageSimilarityResult, ProductFlaggedEvent, ModerationType, ModerationStatus, ModerationPriority, ModerationDecision } from '../ports/services/moderation.port';

export class ModerationService {
  constructor(private moderationPort: ModerationPort) {}

  // ===========================================
  // IMAGE SIMILARITY DETECTION
  // ===========================================

  async moderateProductImages(productId: string, tenantId: string, sellerId: string, imageUrls: string[]): Promise<{
    flagged: boolean;
    cases: ModerationCase[];
    events: ProductFlaggedEvent[];
  }> {
    try {
      const cases: ModerationCase[] = [];
      const events: ProductFlaggedEvent[] = [];
      let flagged = false;

      for (const imageUrl of imageUrls) {
        // Generate pHash for the image
        const hashResult = await this.moderationPort.generateImageHash(imageUrl, {
          hashType: 'pHash',
          hashLength: 64,
        });

        // Store the image hash
        const imageHash = await this.moderationPort.storeImageHash({
          tenantId,
          productId,
          imageUrl,
          imageHash: hashResult.hash,
          hashType: hashResult.hashType,
          hashLength: hashResult.hashLength,
          processingTime: hashResult.processingTime,
          isActive: true,
        });

        // Detect similar images
        const similarityResult = await this.moderationPort.detectImageSimilarity(hashResult.hash, {
          threshold: 0.8, // 80% similarity threshold
          limit: 10,
        });

        // If similarity is above threshold, create moderation case
        if (similarityResult.isFlagged) {
          const moderationCase = await this.moderationPort.createModerationCase({
            tenantId,
            productId,
            sellerId,
            caseType: ModerationType.IMAGE_SIMILARITY,
            status: ModerationStatus.FLAGGED,
            priority: this.calculatePriority(similarityResult.highestSimilarity),
            title: `Image similarity detected for product ${productId}`,
            description: `Product image is ${(similarityResult.highestSimilarity * 100).toFixed(1)}% similar to existing images`,
            imageUrl,
            imageHash: hashResult.hash,
            imageHashType: hashResult.hashType,
            similarCases: similarityResult.similarHashes.map(sh => ({
              caseId: sh.caseId || '',
              similarityScore: sh.similarity,
            })),
            similarityScore: similarityResult.highestSimilarity,
            similarityThreshold: similarityResult.threshold,
            detectedIssues: ['image_similarity'],
            source: 'automated_detection',
            metadata: {
              similarHashes: similarityResult.similarHashes,
              processingTime: hashResult.processingTime,
            },
          });

          cases.push(moderationCase);

          // Create ProductFlagged event
          const flaggedEvent: ProductFlaggedEvent = {
            productId,
            tenantId,
            sellerId,
            caseId: moderationCase.id,
            reason: 'Image similarity detected',
            similarityScore: similarityResult.highestSimilarity,
            threshold: similarityResult.threshold,
            similarProducts: similarityResult.similarHashes
              .filter(sh => sh.productId)
              .map(sh => ({
                productId: sh.productId!,
                similarity: sh.similarity,
              })),
            imageUrl,
            imageHash: hashResult.hash,
            timestamp: new Date(),
            metadata: {
              caseType: ModerationType.IMAGE_SIMILARITY,
              priority: moderationCase.priority,
            },
          };

          events.push(flaggedEvent);

          // Publish the event
          await this.moderationPort.publishProductFlaggedEvent(flaggedEvent);

          flagged = true;
        }
      }

      return {
        flagged,
        cases,
        events,
      };
    } catch (error: any) {
      console.error('Error moderating product images:', error);
      throw error;
    }
  }

  // ===========================================
  // MODERATION CASE MANAGEMENT
  // ===========================================

  async createModerationCase(caseData: Partial<ModerationCase>): Promise<ModerationCase> {
    try {
      return await this.moderationPort.createModerationCase(caseData);
    } catch (error: any) {
      console.error('Error creating moderation case:', error);
      throw error;
    }
  }

  async updateModerationCase(caseId: string, updates: Partial<ModerationCase>): Promise<ModerationCase> {
    try {
      return await this.moderationPort.updateModerationCase(caseId, updates);
    } catch (error: any) {
      console.error('Error updating moderation case:', error);
      throw error;
    }
  }

  async getModerationCase(caseId: string): Promise<ModerationCase | null> {
    try {
      return await this.moderationPort.getModerationCase(caseId);
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
      return await this.moderationPort.getModerationCases(filters);
    } catch (error: any) {
      console.error('Error getting moderation cases:', error);
      return { cases: [], total: 0 };
    }
  }

  // ===========================================
  // IMAGE HASH MANAGEMENT
  // ===========================================

  async generateAndStoreImageHash(imageUrl: string, tenantId: string, productId?: string): Promise<ImageHash> {
    try {
      const hashResult = await this.moderationPort.generateImageHash(imageUrl, {
        hashType: 'pHash',
        hashLength: 64,
      });

      return await this.moderationPort.storeImageHash({
        tenantId,
        productId,
        imageUrl,
        imageHash: hashResult.hash,
        hashType: hashResult.hashType,
        hashLength: hashResult.hashLength,
        processingTime: hashResult.processingTime,
        isActive: true,
      });
    } catch (error: any) {
      console.error('Error generating and storing image hash:', error);
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
      return await this.moderationPort.getImageHashes(filters);
    } catch (error: any) {
      console.error('Error getting image hashes:', error);
      return [];
    }
  }

  // ===========================================
  // SIMILARITY DETECTION
  // ===========================================

  async detectSimilarImages(imageUrl: string, tenantId: string, threshold = 0.8): Promise<ImageSimilarityResult> {
    try {
      // Generate hash for the input image
      const hashResult = await this.moderationPort.generateImageHash(imageUrl, {
        hashType: 'pHash',
        hashLength: 64,
      });

      // Detect similar images
      return await this.moderationPort.detectImageSimilarity(hashResult.hash, {
        threshold,
        limit: 10,
      });
    } catch (error: any) {
      console.error('Error detecting similar images:', error);
      throw error;
    }
  }

  // ===========================================
  // MODERATION WORKFLOW
  // ===========================================

  async assignModerationCase(caseId: string, moderatorId: string): Promise<ModerationCase> {
    try {
      return await this.moderationPort.updateModerationCase(caseId, {
        assignedTo: moderatorId,
        status: ModerationStatus.IN_REVIEW,
        reviewedAt: new Date(),
      });
    } catch (error: any) {
      console.error('Error assigning moderation case:', error);
      throw error;
    }
  }

  async reviewModerationCase(caseId: string, decision: ModerationDecision, notes?: string): Promise<ModerationCase> {
    try {
      const updates: Partial<ModerationCase> = {
        reviewDecision: decision,
        reviewNotes: notes,
        reviewedAt: new Date(),
      };

      // Update status based on decision
      switch (decision) {
        case ModerationDecision.APPROVE:
          updates.status = ModerationStatus.APPROVED;
          updates.resolvedAt = new Date();
          updates.actionTaken = 'approved';
          break;
        case ModerationDecision.REJECT:
          updates.status = ModerationStatus.REJECTED;
          updates.resolvedAt = new Date();
          updates.actionTaken = 'rejected';
          break;
        case ModerationDecision.MODIFY:
          updates.status = ModerationStatus.PENDING;
          updates.actionTaken = 'modification_requested';
          break;
        case ModerationDecision.ESCALATE:
          updates.status = ModerationStatus.FLAGGED;
          updates.priority = ModerationPriority.URGENT;
          updates.actionTaken = 'escalated';
          break;
        case ModerationDecision.IGNORE:
          updates.status = ModerationStatus.RESOLVED;
          updates.resolvedAt = new Date();
          updates.actionTaken = 'ignored';
          break;
      }

      return await this.moderationPort.updateModerationCase(caseId, updates);
    } catch (error: any) {
      console.error('Error reviewing moderation case:', error);
      throw error;
    }
  }

  // ===========================================
  // ANALYTICS AND REPORTING
  // ===========================================

  async getModerationStats(tenantId: string, dateRange?: {
    start: Date;
    end: Date;
  }): Promise<{
    totalCases: number;
    pendingCases: number;
    resolvedCases: number;
    flaggedCases: number;
    averageResolutionTime: number;
    casesByType: Record<string, number>;
    casesByStatus: Record<string, number>;
    casesByPriority: Record<string, number>;
  }> {
    try {
      // Get all cases for the tenant
      const { cases } = await this.moderationPort.getModerationCases({
        tenantId,
        limit: 1000, // Get all cases for stats
      });

      // Filter by date range if provided
      const filteredCases = dateRange
        ? cases.filter(case_ => 
            case_.createdAt >= dateRange.start && case_.createdAt <= dateRange.end
          )
        : cases;

      // Calculate statistics
      const totalCases = filteredCases.length;
      const pendingCases = filteredCases.filter(c => c.status === ModerationStatus.PENDING).length;
      const resolvedCases = filteredCases.filter(c => c.status === ModerationStatus.RESOLVED).length;
      const flaggedCases = filteredCases.filter(c => c.status === ModerationStatus.FLAGGED).length;

      // Calculate average resolution time
      const resolvedCasesWithTime = filteredCases.filter(c => 
        c.resolvedAt && c.reviewedAt
      );
      const averageResolutionTime = resolvedCasesWithTime.length > 0
        ? resolvedCasesWithTime.reduce((sum, c) => 
            sum + (c.resolvedAt!.getTime() - c.reviewedAt!.getTime()), 0
          ) / resolvedCasesWithTime.length / (1000 * 60 * 60) // Convert to hours
        : 0;

      // Group by type, status, and priority
      const casesByType = filteredCases.reduce((acc, c) => {
        acc[c.caseType] = (acc[c.caseType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const casesByStatus = filteredCases.reduce((acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const casesByPriority = filteredCases.reduce((acc, c) => {
        acc[c.priority] = (acc[c.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalCases,
        pendingCases,
        resolvedCases,
        flaggedCases,
        averageResolutionTime,
        casesByType,
        casesByStatus,
        casesByPriority,
      };
    } catch (error: any) {
      console.error('Error getting moderation stats:', error);
      return {
        totalCases: 0,
        pendingCases: 0,
        resolvedCases: 0,
        flaggedCases: 0,
        averageResolutionTime: 0,
        casesByType: {},
        casesByStatus: {},
        casesByPriority: {},
      };
    }
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  private calculatePriority(similarityScore: number): ModerationPriority {
    if (similarityScore >= 0.95) return ModerationPriority.URGENT;
    if (similarityScore >= 0.9) return ModerationPriority.HIGH;
    if (similarityScore >= 0.8) return ModerationPriority.MEDIUM;
    return ModerationPriority.LOW;
  }

  // ===========================================
  // HEALTH CHECK
  // ===========================================

  async healthCheck(): Promise<boolean> {
    try {
      return await this.moderationPort.healthCheck();
    } catch (error) {
      console.error('Moderation service health check failed:', error);
      return false;
    }
  }
}

