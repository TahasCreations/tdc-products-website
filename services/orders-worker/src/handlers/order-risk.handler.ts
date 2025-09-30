/**
 * Order Risk Handler
 * Handles OrderCreated events for risk assessment
 */

import { RiskService } from '@tdc/infra';
import { collectOrderRiskSignals } from '@tdc/domain';

export interface OrderCreatedPayload {
  orderId: string;
  tenantId: string;
  customerId: string;
  sellerId: string;
  totalAmount: number;
  itemCount: number;
  paymentMethod: string;
  shippingAddress: any;
  billingAddress: any;
  customerHistory?: any;
  sellerHistory?: any;
  deviceInfo?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface OrderRiskAssessmentResult {
  success: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  shouldBlock: boolean;
  shouldHold: boolean;
  shouldReview: boolean;
  riskScore: number;
  recommendations: string[];
  message: string;
  riskScoreId?: string;
  events?: any[];
}

export class OrderRiskHandler {
  private riskService: RiskService;

  constructor() {
    this.riskService = new RiskService();
  }

  /**
   * Handle OrderCreated event for risk assessment
   */
  async handleOrderCreated(payload: OrderCreatedPayload): Promise<OrderRiskAssessmentResult> {
    try {
      console.log('[Order Risk Handler] Processing OrderCreated event:', payload.orderId);

      // Collect risk signals from order data
      const signals = collectOrderRiskSignals(payload);

      console.log('[Order Risk Handler] Collected signals:', signals.length);

      // Create risk context
      const context = {
        entityId: payload.orderId,
        entityType: 'ORDER' as const,
        tenantId: payload.tenantId,
        signals,
        contextData: {
          order: {
            id: payload.orderId,
            totalAmount: payload.totalAmount,
            itemCount: payload.itemCount,
            paymentMethod: payload.paymentMethod,
            createdAt: payload.createdAt
          },
          customer: {
            id: payload.customerId,
            history: payload.customerHistory
          },
          seller: {
            id: payload.sellerId,
            history: payload.sellerHistory
          },
          device: payload.deviceInfo,
          location: {
            ipAddress: payload.ipAddress,
            userAgent: payload.userAgent
          }
        },
        metadata: {
          source: 'ORDER_CREATED',
          timestamp: new Date().toISOString()
        }
      };

      // Assess risk
      const assessment = await this.riskService.assessRisk({
        entityId: payload.orderId,
        entityType: 'ORDER',
        tenantId: payload.tenantId,
        context,
        forceRecalculation: false,
        includeHistory: true
      });

      console.log('[Order Risk Handler] Risk assessment completed:', {
        orderId: payload.orderId,
        riskLevel: assessment.riskScore.riskLevel,
        totalScore: assessment.riskScore.totalScore,
        shouldBlock: assessment.shouldBlock,
        shouldHold: assessment.shouldHold
      });

      // Determine if order should be held or blocked
      const shouldBlock = assessment.shouldBlock || assessment.riskScore.riskLevel === 'CRITICAL';
      const shouldHold = assessment.shouldHold || assessment.riskScore.riskLevel === 'HIGH';
      const shouldReview = assessment.shouldReview || assessment.riskScore.riskLevel === 'MEDIUM';

      // If order should be blocked or held, we need to publish OrderOnHold event
      if (shouldBlock || shouldHold) {
        await this.publishOrderOnHoldEvent(payload, assessment);
      }

      return {
        success: true,
        riskLevel: assessment.riskScore.riskLevel,
        shouldBlock,
        shouldHold,
        shouldReview,
        riskScore: assessment.riskScore.totalScore,
        recommendations: assessment.recommendations,
        message: this.generateRiskMessage(assessment.riskScore.riskLevel, shouldBlock, shouldHold),
        riskScoreId: assessment.riskScore.id,
        events: assessment.events
      };

    } catch (error) {
      console.error('[Order Risk Handler] Error processing OrderCreated event:', error);
      
      return {
        success: false,
        riskLevel: 'LOW',
        shouldBlock: false,
        shouldHold: false,
        shouldReview: false,
        riskScore: 0,
        recommendations: ['Risk assessment failed - manual review recommended'],
        message: `Risk assessment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Publish OrderOnHold event when risk assessment indicates hold/block
   */
  private async publishOrderOnHoldEvent(payload: OrderCreatedPayload, assessment: any): Promise<void> {
    try {
      console.log('[Order Risk Handler] Publishing OrderOnHold event for order:', payload.orderId);

      // In a real implementation, this would publish to the event bus
      // For now, we'll just log the event
      const orderOnHoldEvent = {
        eventType: 'OrderOnHold',
        eventId: `order-on-hold-${payload.orderId}-${Date.now()}`,
        tenantId: payload.tenantId,
        orderId: payload.orderId,
        customerId: payload.customerId,
        sellerId: payload.sellerId,
        reason: 'RISK_ASSESSMENT',
        riskLevel: assessment.riskScore.riskLevel,
        riskScore: assessment.riskScore.totalScore,
        shouldBlock: assessment.shouldBlock,
        shouldHold: assessment.shouldHold,
        recommendations: assessment.recommendations,
        riskScoreId: assessment.riskScore.id,
        holdUntil: this.calculateHoldUntil(assessment.riskScore.riskLevel),
        metadata: {
          riskAssessment: {
            totalScore: assessment.riskScore.totalScore,
            maxPossibleScore: assessment.riskScore.maxPossibleScore,
            confidence: assessment.confidence,
            ruleScores: assessment.riskScore.ruleScores
          },
          originalOrder: {
            totalAmount: payload.totalAmount,
            itemCount: payload.itemCount,
            paymentMethod: payload.paymentMethod,
            createdAt: payload.createdAt
          }
        },
        createdAt: new Date()
      };

      console.log('[Order Risk Handler] OrderOnHold event:', orderOnHoldEvent);

      // TODO: Publish to actual event bus (Redis, RabbitMQ, etc.)
      // await this.eventBus.publish('OrderOnHold', orderOnHoldEvent);

    } catch (error) {
      console.error('[Order Risk Handler] Error publishing OrderOnHold event:', error);
      // Don't throw - this is not critical for the main flow
    }
  }

  /**
   * Calculate hold duration based on risk level
   */
  private calculateHoldUntil(riskLevel: string): Date {
    const now = new Date();
    
    switch (riskLevel) {
      case 'CRITICAL':
        // Hold for 24 hours for critical risk
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'HIGH':
        // Hold for 4 hours for high risk
        return new Date(now.getTime() + 4 * 60 * 60 * 1000);
      case 'MEDIUM':
        // Hold for 1 hour for medium risk
        return new Date(now.getTime() + 60 * 60 * 1000);
      default:
        // Hold for 30 minutes for low risk
        return new Date(now.getTime() + 30 * 60 * 1000);
    }
  }

  /**
   * Generate human-readable risk message
   */
  private generateRiskMessage(riskLevel: string, shouldBlock: boolean, shouldHold: boolean): string {
    if (shouldBlock) {
      return `Order blocked due to ${riskLevel.toLowerCase()} risk level. Manual review required.`;
    } else if (shouldHold) {
      return `Order held for review due to ${riskLevel.toLowerCase()} risk level. Will be processed after review.`;
    } else {
      return `Order processed with ${riskLevel.toLowerCase()} risk level. No additional action required.`;
    }
  }

  /**
   * Get risk assessment for an order
   */
  async getOrderRiskAssessment(orderId: string, tenantId: string): Promise<any> {
    try {
      const riskProfile = await this.riskService.getRiskProfile(orderId, 'ORDER', tenantId);
      const riskEvents = await this.riskService.getRiskEvents(orderId, 'ORDER', tenantId);
      
      return {
        riskProfile,
        riskEvents,
        hasRiskProfile: !!riskProfile,
        eventCount: riskEvents.length
      };
    } catch (error) {
      console.error('[Order Risk Handler] Error getting order risk assessment:', error);
      return null;
    }
  }

  /**
   * Release order from hold (manual review completed)
   */
  async releaseOrderFromHold(orderId: string, tenantId: string, action: 'APPROVE' | 'REJECT', notes?: string, reviewedBy?: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('[Order Risk Handler] Releasing order from hold:', orderId, action);

      // Get the latest risk score for this order
      const riskScores = await this.riskService.getRiskEvents(orderId, 'ORDER', tenantId);
      if (riskScores.length === 0) {
        return {
          success: false,
          message: 'No risk assessment found for this order'
        };
      }

      // Find the latest risk score
      const latestRiskScore = riskScores[0]; // Assuming they're sorted by date desc
      
      // Review the risk score
      const reviewedScore = await this.riskService.reviewRiskScore(
        latestRiskScore.id,
        action,
        notes,
        reviewedBy
      );

      console.log('[Order Risk Handler] Order released from hold:', {
        orderId,
        action,
        riskScoreId: reviewedScore.id
      });

      // TODO: Publish OrderReleased event
      // await this.eventBus.publish('OrderReleased', {
      //   orderId,
      //   tenantId,
      //   action,
      //   reviewedBy,
      //   riskScoreId: reviewedScore.id,
      //   releasedAt: new Date()
      // });

      return {
        success: true,
        message: `Order ${action.toLowerCase()}d and released from hold`
      };

    } catch (error) {
      console.error('[Order Risk Handler] Error releasing order from hold:', error);
      return {
        success: false,
        message: `Failed to release order: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get risk statistics for a tenant
   */
  async getRiskStatistics(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<any> {
    try {
      return await this.riskService.getRiskStatistics(tenantId, dateFrom, dateTo);
    } catch (error) {
      console.error('[Order Risk Handler] Error getting risk statistics:', error);
      return null;
    }
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    try {
      await this.riskService.cleanup();
    } catch (error) {
      console.error('[Order Risk Handler] Error during cleanup:', error);
    }
  }
}

