/**
 * Risk Service Implementation
 * Orchestrates risk assessment using domain logic and repository
 */

import { RiskPort, RiskAssessmentRequest, RiskAssessmentResult, RiskSignal, RiskContext, RiskRule, RiskScore, RiskEvent, RiskProfile, RiskStatistics, RiskThresholds } from '@tdc/domain';
import { RiskRepository, CreateRiskScoreInput, CreateRiskEventInput, CreateRiskProfileInput } from '../database/repositories/risk.repository.js';
import { PrismaClient } from '../database/prisma-client.js';
import { 
  collectOrderRiskSignals, 
  evaluateRiskRules, 
  calculateRiskScore, 
  determineRiskLevel,
  validateRiskAssessmentInput,
  generateRiskSummary
} from '@tdc/domain';

export class RiskService implements RiskPort {
  private prisma: PrismaClient;
  private riskRepo: RiskRepository;

  constructor() {
    this.prisma = new PrismaClient();
    this.riskRepo = new RiskRepository(this.prisma);
  }

  async assessRisk(request: RiskAssessmentRequest): Promise<RiskAssessmentResult> {
    try {
      console.log('[Risk Service] Assessing risk for entity:', request.entityId);

      // Validate input
      const validation = validateRiskAssessmentInput(request);
      if (!validation.isValid) {
        throw new Error(`Invalid risk assessment input: ${validation.errors.join(', ')}`);
      }

      // Get active risk rules
      const rules = await this.riskRepo.getActiveRiskRules(request.tenantId);
      if (rules.length === 0) {
        console.log('[Risk Service] No active risk rules found, returning low risk');
        return this.createLowRiskResult(request);
      }

      // Evaluate rules against context
      const evaluations = evaluateRiskRules(request.context, rules);

      // Calculate risk score
      const riskScoreData = calculateRiskScore(evaluations, request.context);

      // Create risk score record
      const riskScoreInput: CreateRiskScoreInput = {
        tenantId: request.tenantId,
        orderId: request.entityType === 'ORDER' ? request.entityId : undefined,
        customerId: request.entityType === 'CUSTOMER' ? request.entityId : undefined,
        sellerId: request.entityType === 'SELLER' ? request.entityId : undefined,
        totalScore: riskScoreData.totalScore,
        maxPossibleScore: riskScoreData.maxPossibleScore,
        riskLevel: riskScoreData.riskLevel,
        ruleScores: riskScoreData.ruleScores,
        context: request.context.contextData,
        signals: request.context.signals,
        status: 'CALCULATED',
        isBlocked: riskScoreData.shouldBlock,
        blockReason: riskScoreData.shouldBlock ? 'Risk score exceeds threshold' : undefined,
        actionsTaken: this.getActionsTaken(riskScoreData),
        metadata: {
          evaluations: evaluations.map(e => ({
            ruleId: e.ruleId,
            ruleName: e.ruleName,
            matched: e.matched,
            score: e.score,
            reason: e.reason,
            action: e.action
          })),
          confidence: riskScoreData.confidence
        }
      };

      const riskScore = await this.riskRepo.createRiskScore(riskScoreInput);

      // Create risk events for matched rules
      const events: RiskEvent[] = [];
      for (const evaluation of evaluations) {
        if (evaluation.matched) {
          const eventInput: CreateRiskEventInput = {
            tenantId: request.tenantId,
            riskScoreId: riskScore.id,
            eventType: this.mapRuleCategoryToEventType(evaluation.metadata?.category),
            eventName: evaluation.ruleName,
            description: evaluation.reason,
            eventData: {
              ruleId: evaluation.ruleId,
              score: evaluation.score,
              action: evaluation.action,
              actionParams: evaluation.actionParams
            },
            severity: this.mapRiskLevelToSeverity(riskScoreData.riskLevel),
            source: 'RISK_ENGINE',
            sourceId: evaluation.ruleId,
            tags: ['risk-assessment', evaluation.metadata?.category?.toLowerCase() || 'general']
          };

          const event = await this.riskRepo.createRiskEvent(eventInput);
          events.push(this.transformToRiskEvent(event));
        }
      }

      // Update or create risk profile
      await this.updateRiskProfile(request.entityId, request.entityType, request.tenantId, riskScoreData);

      // Transform to result format
      const result: RiskAssessmentResult = {
        riskScore: this.transformToRiskScore(riskScore),
        riskProfile: await this.getRiskProfile(request.entityId, request.entityType, request.tenantId),
        events,
        recommendations: riskScoreData.recommendations,
        shouldBlock: riskScoreData.shouldBlock,
        shouldHold: riskScoreData.shouldHold,
        shouldReview: riskScoreData.shouldReview,
        confidence: riskScoreData.confidence,
        metadata: {
          evaluations: evaluations.length,
          matchedRules: evaluations.filter(e => e.matched).length,
          assessmentTime: new Date().toISOString()
        }
      };

      console.log('[Risk Service] Risk assessment completed:', {
        entityId: request.entityId,
        riskLevel: riskScoreData.riskLevel,
        totalScore: riskScoreData.totalScore,
        shouldBlock: riskScoreData.shouldBlock,
        shouldHold: riskScoreData.shouldHold
      });

      return result;

    } catch (error) {
      console.error('[Risk Service] Error assessing risk:', error);
      throw new Error(`Risk assessment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async evaluateRules(context: RiskContext, rules: RiskRule[]): Promise<any[]> {
    return evaluateRiskRules(context, rules);
  }

  async calculateRiskScore(evaluations: any[], context: RiskContext): Promise<RiskScore> {
    return calculateRiskScore(evaluations, context);
  }

  async determineRiskLevel(score: number, maxScore: number, thresholds?: RiskThresholds): Promise<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> {
    return determineRiskLevel(score, maxScore, thresholds);
  }

  async getRiskProfile(entityId: string, entityType: string, tenantId: string): Promise<RiskProfile | null> {
    try {
      const profile = await this.riskRepo.getRiskProfile(entityId, entityType as any, tenantId);
      return profile ? this.transformToRiskProfile(profile) : null;
    } catch (error) {
      console.error('[Risk Service] Error getting risk profile:', error);
      return null;
    }
  }

  async updateRiskProfile(profile: Partial<RiskProfile>): Promise<RiskProfile> {
    try {
      const updated = await this.riskRepo.updateRiskProfile(profile.id!, profile);
      return this.transformToRiskProfile(updated);
    } catch (error) {
      console.error('[Risk Service] Error updating risk profile:', error);
      throw new Error(`Risk profile update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createRiskEvent(event: Omit<RiskEvent, 'id' | 'createdAt'>): Promise<RiskEvent> {
    try {
      const eventInput: CreateRiskEventInput = {
        tenantId: event.tenantId || '',
        riskScoreId: event.riskScoreId || '',
        eventType: event.eventType as any,
        eventName: event.eventName,
        description: event.description,
        eventData: event.eventData,
        severity: event.severity as any,
        source: event.source,
        sourceId: event.sourceId,
        tags: event.tags,
        metadata: event.metadata
      };

      const created = await this.riskRepo.createRiskEvent(eventInput);
      return this.transformToRiskEvent(created);
    } catch (error) {
      console.error('[Risk Service] Error creating risk event:', error);
      throw new Error(`Risk event creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRiskEvents(entityId: string, entityType: string, tenantId: string, limit: number = 50): Promise<RiskEvent[]> {
    try {
      const events = await this.riskRepo.getRiskEventsByEntity(entityId, entityType as any, tenantId, limit);
      return events.map(event => this.transformToRiskEvent(event));
    } catch (error) {
      console.error('[Risk Service] Error getting risk events:', error);
      return [];
    }
  }

  async getActiveRiskRules(tenantId: string, category?: string): Promise<RiskRule[]> {
    try {
      const rules = await this.riskRepo.getActiveRiskRules(tenantId, category as any);
      return rules.map(rule => this.transformToRiskRule(rule));
    } catch (error) {
      console.error('[Risk Service] Error getting active risk rules:', error);
      return [];
    }
  }

  async createRiskRule(rule: Omit<RiskRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<RiskRule> {
    try {
      const created = await this.riskRepo.createRiskRule({
        tenantId: rule.tenantId || '',
        name: rule.name,
        description: rule.description,
        ruleType: rule.ruleType as any,
        category: rule.category as any,
        priority: rule.priority,
        conditions: rule.conditions,
        threshold: rule.threshold,
        weight: rule.weight,
        action: rule.action as any,
        actionParams: rule.actionParams,
        isActive: rule.isActive,
        isEnabled: rule.isEnabled,
        createdBy: rule.createdBy,
        tags: rule.tags,
        metadata: rule.metadata
      });

      return this.transformToRiskRule(created);
    } catch (error) {
      console.error('[Risk Service] Error creating risk rule:', error);
      throw new Error(`Risk rule creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateRiskRule(ruleId: string, updates: Partial<RiskRule>): Promise<RiskRule> {
    try {
      const updated = await this.riskRepo.updateRiskRule(ruleId, updates);
      return this.transformToRiskRule(updated);
    } catch (error) {
      console.error('[Risk Service] Error updating risk rule:', error);
      throw new Error(`Risk rule update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteRiskRule(ruleId: string): Promise<{ success: boolean }> {
    try {
      return await this.riskRepo.deleteRiskRule(ruleId);
    } catch (error) {
      console.error('[Risk Service] Error deleting risk rule:', error);
      return { success: false };
    }
  }

  async getRiskStatistics(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<RiskStatistics> {
    try {
      const stats = await this.riskRepo.getRiskStatistics(tenantId, dateFrom, dateTo);
      return {
        totalAssessments: stats.totalAssessments,
        averageScore: stats.averageScore,
        riskLevelDistribution: stats.riskLevelDistribution,
        blockedCount: stats.blockedCount,
        heldCount: stats.heldCount,
        reviewedCount: stats.reviewedCount,
        falsePositiveRate: 0, // Would need historical data to calculate
        falseNegativeRate: 0, // Would need historical data to calculate
        topRiskFactors: stats.topRiskFactors,
        timeRange: {
          from: dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          to: dateTo || new Date()
        }
      };
    } catch (error) {
      console.error('[Risk Service] Error getting risk statistics:', error);
      throw new Error(`Risk statistics failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRiskThresholds(tenantId: string): Promise<RiskThresholds> {
    // Default thresholds - in a real implementation, these would be configurable per tenant
    return {
      low: 0.2,
      medium: 0.4,
      high: 0.7,
      critical: 0.9
    };
  }

  async updateRiskThresholds(tenantId: string, thresholds: RiskThresholds): Promise<RiskThresholds> {
    // In a real implementation, this would save to database
    console.log('[Risk Service] Risk thresholds updated for tenant:', tenantId, thresholds);
    return thresholds;
  }

  async blacklistEntity(entityId: string, entityType: string, tenantId: string, reason: string): Promise<{ success: boolean }> {
    try {
      await this.riskRepo.blacklistEntity(entityId, entityType as any, tenantId, reason);
      return { success: true };
    } catch (error) {
      console.error('[Risk Service] Error blacklisting entity:', error);
      return { success: false };
    }
  }

  async whitelistEntity(entityId: string, entityType: string, tenantId: string, reason: string): Promise<{ success: boolean }> {
    try {
      await this.riskRepo.whitelistEntity(entityId, entityType as any, tenantId, reason);
      return { success: true };
    } catch (error) {
      console.error('[Risk Service] Error whitelisting entity:', error);
      return { success: false };
    }
  }

  async removeFromList(entityId: string, entityType: string, tenantId: string, listType: 'BLACKLIST' | 'WHITELIST'): Promise<{ success: boolean }> {
    try {
      await this.riskRepo.removeFromList(entityId, entityType as any, tenantId, listType);
      return { success: true };
    } catch (error) {
      console.error('[Risk Service] Error removing from list:', error);
      return { success: false };
    }
  }

  async reviewRiskScore(scoreId: string, action: 'APPROVE' | 'REJECT', notes?: string, reviewedBy?: string): Promise<RiskScore> {
    try {
      const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      const updated = await this.riskRepo.updateRiskScore(scoreId, {
        status: status as any,
        reviewedBy,
        reviewedAt: new Date(),
        reviewNotes: notes
      });

      return this.transformToRiskScore(updated);
    } catch (error) {
      console.error('[Risk Service] Error reviewing risk score:', error);
      throw new Error(`Risk score review failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRiskAlerts(tenantId: string, severity?: string, limit: number = 50): Promise<RiskEvent[]> {
    try {
      const events = await this.riskRepo.getUnprocessedEvents(tenantId, limit);
      return events
        .filter(event => !severity || event.severity === severity)
        .map(event => this.transformToRiskEvent(event));
    } catch (error) {
      console.error('[Risk Service] Error getting risk alerts:', error);
      return [];
    }
  }

  async markEventAsProcessed(eventId: string, processedBy?: string): Promise<{ success: boolean }> {
    try {
      await this.riskRepo.markEventAsProcessed(eventId, processedBy);
      return { success: true };
    } catch (error) {
      console.error('[Risk Service] Error marking event as processed:', error);
      return { success: false };
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }> {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Check if we have any active rules
      const ruleCount = await this.prisma.riskRule.count({
        where: { isActive: true, isEnabled: true }
      });

      return {
        status: 'healthy',
        message: 'Risk service is healthy',
        details: {
          activeRules: ruleCount,
          databaseConnected: true
        }
      };
    } catch (error) {
      console.error('[Risk Service] Health check failed:', error);
      return {
        status: 'unhealthy',
        message: `Risk service health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  async getCapabilities(): Promise<{
    supportedEntityTypes: string[];
    supportedRuleTypes: string[];
    supportedActions: string[];
    maxRulesPerTenant: number;
    maxSignalsPerAssessment: number;
    supportedDataTypes: string[];
  }> {
    return {
      supportedEntityTypes: ['CUSTOMER', 'SELLER', 'ORDER', 'PAYMENT'],
      supportedRuleTypes: ['SCORING', 'THRESHOLD', 'BLACKLIST', 'WHITELIST', 'NOTIFICATION', 'AUTO_ACTION'],
      supportedActions: ['SCORE', 'BLOCK', 'HOLD', 'NOTIFY', 'REVIEW', 'APPROVE', 'ESCALATE'],
      maxRulesPerTenant: 1000,
      maxSignalsPerAssessment: 100,
      supportedDataTypes: ['string', 'number', 'boolean', 'object', 'array']
    };
  }

  // Private helper methods

  private createLowRiskResult(request: RiskAssessmentRequest): RiskAssessmentResult {
    return {
      riskScore: {
        id: 'low-risk-default',
        entityId: request.entityId,
        entityType: request.entityType,
        tenantId: request.tenantId,
        totalScore: 0,
        maxPossibleScore: 100,
        riskLevel: 'LOW',
        ruleScores: {},
        context: request.context.contextData,
        signals: request.context.signals,
        status: 'CALCULATED',
        isBlocked: false,
        actionsTaken: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { reason: 'No active rules' }
      },
      events: [],
      recommendations: ['No risk rules configured'],
      shouldBlock: false,
      shouldHold: false,
      shouldReview: false,
      confidence: 1.0,
      metadata: { reason: 'No active rules' }
    };
  }

  private async updateRiskProfile(entityId: string, entityType: string, tenantId: string, riskScoreData: any): Promise<void> {
    try {
      const existingProfile = await this.riskRepo.getRiskProfile(entityId, entityType as any, tenantId);
      
      if (existingProfile) {
        await this.riskRepo.updateRiskProfile(existingProfile.id, {
          riskLevel: riskScoreData.riskLevel,
          riskScore: riskScoreData.totalScore,
          lastCalculatedAt: new Date(),
          isHighRisk: riskScoreData.riskLevel === 'HIGH' || riskScoreData.riskLevel === 'CRITICAL'
        });
      } else {
        await this.riskRepo.createRiskProfile({
          tenantId,
          entityId,
          entityType: entityType as any,
          riskLevel: riskScoreData.riskLevel,
          riskScore: riskScoreData.totalScore,
          lastCalculatedAt: new Date(),
          isHighRisk: riskScoreData.riskLevel === 'HIGH' || riskScoreData.riskLevel === 'CRITICAL'
        });
      }
    } catch (error) {
      console.warn('[Risk Service] Failed to update risk profile:', error);
    }
  }

  private getActionsTaken(riskScoreData: any): string[] {
    const actions: string[] = [];
    
    if (riskScoreData.shouldBlock) {
      actions.push('BLOCK');
    }
    if (riskScoreData.shouldHold) {
      actions.push('HOLD');
    }
    if (riskScoreData.shouldReview) {
      actions.push('REVIEW');
    }
    
    return actions;
  }

  private mapRuleCategoryToEventType(category?: string): string {
    const mapping: Record<string, string> = {
      'CUSTOMER': 'CUSTOMER_SIGNUP',
      'SELLER': 'SELLER_REGISTER',
      'ORDER': 'ORDER_CREATED',
      'PAYMENT': 'PAYMENT_PROCESSED',
      'FRAUD': 'FRAUD_DETECTED',
      'COMPLIANCE': 'MANUAL_REVIEW'
    };
    
    return mapping[category || ''] || 'MANUAL_REVIEW';
  }

  private mapRiskLevelToSeverity(riskLevel: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    const mapping: Record<string, 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'> = {
      'LOW': 'LOW',
      'MEDIUM': 'MEDIUM',
      'HIGH': 'HIGH',
      'CRITICAL': 'CRITICAL'
    };
    
    return mapping[riskLevel] || 'MEDIUM';
  }

  // Transformation methods
  private transformToRiskScore(score: any): RiskScore {
    return {
      id: score.id,
      entityId: score.orderId || score.customerId || score.sellerId || '',
      entityType: score.orderId ? 'ORDER' : score.customerId ? 'CUSTOMER' : 'SELLER',
      tenantId: score.tenantId,
      totalScore: score.totalScore,
      maxPossibleScore: score.maxPossibleScore,
      riskLevel: score.riskLevel,
      ruleScores: score.ruleScores || {},
      context: score.context,
      signals: score.signals || [],
      status: score.status,
      isBlocked: score.isBlocked,
      blockReason: score.blockReason,
      actionsTaken: score.actionsTaken || [],
      reviewedBy: score.reviewedBy,
      reviewedAt: score.reviewedAt,
      reviewNotes: score.reviewNotes,
      createdAt: score.createdAt,
      updatedAt: score.updatedAt,
      metadata: score.metadata
    };
  }

  private transformToRiskEvent(event: any): RiskEvent {
    return {
      id: event.id,
      eventType: event.eventType,
      eventName: event.eventName,
      description: event.description,
      eventData: event.eventData,
      severity: event.severity,
      source: event.source,
      sourceId: event.sourceId,
      tags: event.tags || [],
      isProcessed: event.isProcessed,
      processedAt: event.processedAt,
      processedBy: event.processedBy,
      createdAt: event.createdAt,
      metadata: event.metadata
    };
  }

  private transformToRiskProfile(profile: any): RiskProfile {
    return {
      id: profile.id,
      entityId: profile.entityId,
      entityType: profile.entityType,
      tenantId: profile.tenantId,
      riskLevel: profile.riskLevel,
      riskScore: profile.riskScore,
      lastCalculatedAt: profile.lastCalculatedAt,
      riskFactors: profile.riskFactors || {},
      riskHistory: profile.riskHistory || [],
      isBlacklisted: profile.isBlacklisted,
      isWhitelisted: profile.isWhitelisted,
      isHighRisk: profile.isHighRisk,
      lastReviewedAt: profile.lastReviewedAt,
      reviewedBy: profile.reviewedBy,
      reviewNotes: profile.reviewNotes,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      metadata: profile.metadata
    };
  }

  private transformToRiskRule(rule: any): RiskRule {
    return {
      id: rule.id,
      name: rule.name,
      description: rule.description,
      ruleType: rule.ruleType,
      category: rule.category,
      priority: rule.priority,
      conditions: rule.conditions,
      threshold: rule.threshold,
      weight: rule.weight,
      action: rule.action,
      actionParams: rule.actionParams,
      isActive: rule.isActive,
      isEnabled: rule.isEnabled,
      tags: rule.tags || [],
      metadata: rule.metadata
    };
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}

