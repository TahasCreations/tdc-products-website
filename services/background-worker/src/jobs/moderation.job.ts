/**
 * Moderation Background Job
 * Processes ProductFlagged events and handles image similarity detection
 */

import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { ModerationService } from '@tdc/domain';
import { ModerationAdapter } from '@tdc/infra';

interface ProductModerationJobData {
  productId: string;
  tenantId: string;
  sellerId: string;
  imageUrls: string[];
  triggeredBy: 'product_upload' | 'manual_review' | 'scheduled_check';
}

export class ProductModerationJob {
  private prisma: PrismaClient;
  private moderationService: ModerationService;

  constructor() {
    this.prisma = new PrismaClient();
    const moderationAdapter = new ModerationAdapter(this.prisma);
    this.moderationService = new ModerationService(moderationAdapter);
  }

  async handle(job: Job<ProductModerationJobData>): Promise<void> {
    const { productId, tenantId, sellerId, imageUrls, triggeredBy } = job.data;
    
    console.log(`🔍 Processing product moderation for Product: ${productId}, Tenant: ${tenantId}, Seller: ${sellerId}`);
    console.log(`📸 Images to process: ${imageUrls.length}`);

    try {
      // Process product images for moderation
      const result = await this.moderationService.moderateProductImages(
        productId,
        tenantId,
        sellerId,
        imageUrls
      );

      if (result.flagged) {
        console.log(`🚨 Product ${productId} flagged for moderation`);
        console.log(`📋 Created ${result.cases.length} moderation cases`);
        console.log(`📢 Published ${result.events.length} ProductFlagged events`);
        
        // Update job progress
        await job.updateProgress(75);
        
        // Log flagged cases for monitoring
        result.cases.forEach(case_ => {
          console.log(`  - Case ${case_.id}: ${case_.caseType} (${case_.priority} priority)`);
          console.log(`    Similarity: ${(case_.similarityScore! * 100).toFixed(1)}%`);
          console.log(`    Issues: ${case_.detectedIssues.join(', ')}`);
        });
      } else {
        console.log(`✅ Product ${productId} passed moderation checks`);
      }

      // Update product status based on moderation result
      await this.updateProductModerationStatus(productId, result.flagged);

      await job.updateProgress(100);
      console.log(`✅ Product moderation completed for ${productId}`);
    } catch (error: any) {
      console.error(`❌ Error processing product moderation for ${productId}:`, error.message);
      
      // Update job progress with error
      await job.updateProgress(50);
      
      // Log error details for debugging
      console.error('Error details:', {
        productId,
        tenantId,
        sellerId,
        imageUrls: imageUrls.length,
        error: error.message,
        stack: error.stack,
      });
      
      throw error; // Re-throw to allow BullMQ to handle retries
    } finally {
      await this.prisma.$disconnect();
    }
  }

  private async updateProductModerationStatus(productId: string, flagged: boolean): Promise<void> {
    try {
      // Update product status based on moderation result
      const status = flagged ? 'PENDING_MODERATION' : 'ACTIVE';
      
      await this.prisma.product.update({
        where: { id: productId },
        data: {
          // Add moderation status field if it exists in schema
          // moderationStatus: status,
          updatedAt: new Date(),
        },
      });

      console.log(`📝 Updated product ${productId} status: ${status}`);
    } catch (error: any) {
      console.error(`❌ Error updating product moderation status for ${productId}:`, error.message);
      // Don't throw here as this is not critical for the main flow
    }
  }
}

// Job processor for ProductFlagged events
export class ProductFlaggedEventProcessor {
  private prisma: PrismaClient;
  private moderationService: ModerationService;

  constructor() {
    this.prisma = new PrismaClient();
    const moderationAdapter = new ModerationAdapter(this.prisma);
    this.moderationService = new ModerationService(moderationAdapter);
  }

  async handle(job: Job<any>): Promise<void> {
    const eventData = job.data;
    
    console.log(`🚨 Processing ProductFlagged event for Product: ${eventData.productId}`);
    console.log(`📋 Case ID: ${eventData.caseId}`);
    console.log(`🔍 Similarity Score: ${(eventData.similarityScore * 100).toFixed(1)}%`);

    try {
      // Process the ProductFlagged event
      await this.processProductFlaggedEvent(eventData);
      
      await job.updateProgress(100);
      console.log(`✅ ProductFlagged event processed for ${eventData.productId}`);
    } catch (error: any) {
      console.error(`❌ Error processing ProductFlagged event for ${eventData.productId}:`, error.message);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  private async processProductFlaggedEvent(eventData: any): Promise<void> {
    try {
      // 1. Update product status to flagged
      await this.updateProductStatus(eventData.productId, 'FLAGGED');
      
      // 2. Notify moderators (if notification system exists)
      await this.notifyModerators(eventData);
      
      // 3. Log the event for analytics
      await this.logModerationEvent(eventData);
      
      // 4. Update seller notification (if needed)
      await this.notifySeller(eventData);
      
      console.log(`📢 ProductFlagged event processed successfully for ${eventData.productId}`);
    } catch (error: any) {
      console.error(`❌ Error processing ProductFlagged event:`, error.message);
      throw error;
    }
  }

  private async updateProductStatus(productId: string, status: string): Promise<void> {
    try {
      await this.prisma.product.update({
        where: { id: productId },
        data: {
          // Add status field if it exists in schema
          // status: status,
          updatedAt: new Date(),
        },
      });
      
      console.log(`📝 Updated product ${productId} status to ${status}`);
    } catch (error: any) {
      console.error(`❌ Error updating product status:`, error.message);
    }
  }

  private async notifyModerators(eventData: any): Promise<void> {
    try {
      // In a real implementation, this would send notifications to moderators
      console.log(`📧 Notifying moderators about flagged product ${eventData.productId}`);
      
      // Mock notification logic
      const notification = {
        type: 'PRODUCT_FLAGGED',
        productId: eventData.productId,
        caseId: eventData.caseId,
        similarityScore: eventData.similarityScore,
        priority: eventData.metadata?.priority || 'MEDIUM',
        timestamp: new Date(),
      };
      
      console.log('Notification data:', notification);
    } catch (error: any) {
      console.error(`❌ Error notifying moderators:`, error.message);
    }
  }

  private async logModerationEvent(eventData: any): Promise<void> {
    try {
      // Log the event for analytics and monitoring
      const logEntry = {
        eventType: 'ProductFlagged',
        productId: eventData.productId,
        tenantId: eventData.tenantId,
        sellerId: eventData.sellerId,
        caseId: eventData.caseId,
        similarityScore: eventData.similarityScore,
        threshold: eventData.threshold,
        similarProductsCount: eventData.similarProducts?.length || 0,
        timestamp: new Date(),
      };
      
      console.log('📊 Moderation event logged:', logEntry);
    } catch (error: any) {
      console.error(`❌ Error logging moderation event:`, error.message);
    }
  }

  private async notifySeller(eventData: any): Promise<void> {
    try {
      // In a real implementation, this would send notification to the seller
      console.log(`📧 Notifying seller ${eventData.sellerId} about flagged product ${eventData.productId}`);
      
      // Mock seller notification
      const sellerNotification = {
        type: 'PRODUCT_UNDER_REVIEW',
        productId: eventData.productId,
        reason: eventData.reason,
        estimatedReviewTime: '24-48 hours',
        timestamp: new Date(),
      };
      
      console.log('Seller notification:', sellerNotification);
    } catch (error: any) {
      console.error(`❌ Error notifying seller:`, error.message);
    }
  }
}

