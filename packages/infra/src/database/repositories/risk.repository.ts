import { PrismaClient } from '../prisma-client.js';
import { 
  RiskRule, 
  RiskScore, 
  RiskEvent, 
  RiskProfile,
  RiskRuleType,
  RiskCategory,
  RiskAction,
  RiskLevel,
  RiskScoreStatus,
  RiskEventType,
  RiskSeverity,
  RiskEntityType
} from '@prisma/client';

export interface CreateRiskRuleInput {
  tenantId: string;
  name: string;
  description?: string;
  ruleType: RiskRuleType;
  category: RiskCategory;
  priority?: number;
  conditions: any;
  threshold?: number;
  weight?: number;
  action: RiskAction;
  actionParams?: any;
  isActive?: boolean;
  isEnabled?: boolean;
  createdBy?: string;
  tags?: string[];
  metadata?: any;
}

export interface UpdateRiskRuleInput {
  name?: string;
  description?: string;
  ruleType?: RiskRuleType;
  category?: RiskCategory;
  priority?: number;
  conditions?: any;
  threshold?: number;
  weight?: number;
  action?: RiskAction;
  actionParams?: any;
  isActive?: boolean;
  isEnabled?: boolean;
  lastModifiedBy?: string;
  tags?: string[];
  metadata?: any;
}

export interface CreateRiskScoreInput {
  tenantId: string;
  orderId?: string;
  customerId?: string;
  sellerId?: string;
  totalScore: number;
  maxPossibleScore: number;
  riskLevel: RiskLevel;
  ruleScores: any;
  context?: any;
  signals?: any;
  status?: RiskScoreStatus;
  isBlocked?: boolean;
  blockReason?: string;
  actionsTaken?: string[];
  metadata?: any;
}

export interface UpdateRiskScoreInput {
  totalScore?: number;
  maxPossibleScore?: number;
  riskLevel?: RiskLevel;
  ruleScores?: any;
  context?: any;
  signals?: any;
  status?: RiskScoreStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  isBlocked?: boolean;
  blockReason?: string;
  actionsTaken?: string[];
  metadata?: any;
}

export interface CreateRiskEventInput {
  tenantId: string;
  riskScoreId: string;
  eventType: RiskEventType;
  eventName: string;
  description?: string;
  eventData?: any;
  severity?: RiskSeverity;
  source?: string;
  sourceId?: string;
  tags?: string[];
  metadata?: any;
}

export interface CreateRiskProfileInput {
  tenantId: string;
  entityId: string;
  entityType: RiskEntityType;
  riskLevel?: RiskLevel;
  riskScore?: number;
  lastCalculatedAt?: Date;
  riskFactors?: any;
  riskHistory?: any;
  isBlacklisted?: boolean;
  isWhitelisted?: boolean;
  isHighRisk?: boolean;
  lastReviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  metadata?: any;
}

export interface RiskSearchParams {
  tenantId: string;
  entityId?: string;
  entityType?: RiskEntityType;
  riskLevel?: RiskLevel;
  status?: RiskScoreStatus;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export class RiskRepository {
  constructor(private prisma: PrismaClient) {}

  // RiskRule methods
  async createRiskRule(input: CreateRiskRuleInput): Promise<RiskRule> {
    return this.prisma.riskRule.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        description: input.description,
        ruleType: input.ruleType,
        category: input.category,
        priority: input.priority || 1,
        conditions: input.conditions,
        threshold: input.threshold,
        weight: input.weight || 1.0,
        action: input.action,
        actionParams: input.actionParams,
        isActive: input.isActive ?? true,
        isEnabled: input.isEnabled ?? true,
        createdBy: input.createdBy,
        tags: input.tags || [],
        metadata: input.metadata
      }
    });
  }

  async updateRiskRule(id: string, input: UpdateRiskRuleInput): Promise<RiskRule> {
    return this.prisma.riskRule.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date()
      }
    });
  }

  async getRiskRuleById(id: string): Promise<RiskRule | null> {
    return this.prisma.riskRule.findUnique({
      where: { id }
    });
  }

  async getActiveRiskRules(tenantId: string, category?: RiskCategory): Promise<RiskRule[]> {
    return this.prisma.riskRule.findMany({
      where: {
        tenantId,
        isActive: true,
        isEnabled: true,
        ...(category && { category })
      },
      orderBy: { priority: 'asc' }
    });
  }

  async getRiskRulesByTenant(tenantId: string, page: number = 1, limit: number = 50): Promise<{
    rules: RiskRule[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const skip = (page - 1) * limit;

    const [rules, total] = await Promise.all([
      this.prisma.riskRule.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.riskRule.count({ where: { tenantId } })
    ]);

    return {
      rules,
      total,
      page,
      limit,
      hasMore: (page * limit) < total
    };
  }

  async deleteRiskRule(id: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.riskRule.delete({
        where: { id }
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  // RiskScore methods
  async createRiskScore(input: CreateRiskScoreInput): Promise<RiskScore> {
    return this.prisma.riskScore.create({
      data: {
        tenantId: input.tenantId,
        orderId: input.orderId,
        customerId: input.customerId,
        sellerId: input.sellerId,
        totalScore: input.totalScore,
        maxPossibleScore: input.maxPossibleScore,
        riskLevel: input.riskLevel,
        ruleScores: input.ruleScores,
        context: input.context,
        signals: input.signals,
        status: input.status || 'PENDING',
        isBlocked: input.isBlocked || false,
        blockReason: input.blockReason,
        actionsTaken: input.actionsTaken || [],
        metadata: input.metadata
      }
    });
  }

  async updateRiskScore(id: string, input: UpdateRiskScoreInput): Promise<RiskScore> {
    return this.prisma.riskScore.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date()
      }
    });
  }

  async getRiskScoreById(id: string): Promise<RiskScore | null> {
    return this.prisma.riskScore.findUnique({
      where: { id },
      include: {
        riskEvents: true,
        order: true
      }
    });
  }

  async getRiskScoresByOrder(orderId: string): Promise<RiskScore[]> {
    return this.prisma.riskScore.findMany({
      where: { orderId },
      include: {
        riskEvents: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getRiskScoresByEntity(entityId: string, entityType: RiskEntityType, tenantId: string): Promise<RiskScore[]> {
    const where: any = {
      tenantId,
      ...(entityType === 'CUSTOMER' && { customerId: entityId }),
      ...(entityType === 'SELLER' && { sellerId: entityId }),
      ...(entityType === 'ORDER' && { orderId: entityId })
    };

    return this.prisma.riskScore.findMany({
      where,
      include: {
        riskEvents: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async searchRiskScores(params: RiskSearchParams): Promise<{
    scores: RiskScore[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const {
      tenantId,
      entityId,
      entityType,
      riskLevel,
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 50
    } = params;

    const where: any = {
      tenantId,
      ...(entityId && entityType && {
        ...(entityType === 'CUSTOMER' && { customerId: entityId }),
        ...(entityType === 'SELLER' && { sellerId: entityId }),
        ...(entityType === 'ORDER' && { orderId: entityId })
      }),
      ...(riskLevel && { riskLevel }),
      ...(status && { status }),
      ...(dateFrom && dateTo && {
        createdAt: {
          gte: dateFrom,
          lte: dateTo
        }
      })
    };

    const skip = (page - 1) * limit;

    const [scores, total] = await Promise.all([
      this.prisma.riskScore.findMany({
        where,
        include: {
          riskEvents: true,
          order: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.riskScore.count({ where })
    ]);

    return {
      scores,
      total,
      page,
      limit,
      hasMore: (page * limit) < total
    };
  }

  // RiskEvent methods
  async createRiskEvent(input: CreateRiskEventInput): Promise<RiskEvent> {
    return this.prisma.riskEvent.create({
      data: {
        tenantId: input.tenantId,
        riskScoreId: input.riskScoreId,
        eventType: input.eventType,
        eventName: input.eventName,
        description: input.description,
        eventData: input.eventData,
        severity: input.severity || 'MEDIUM',
        source: input.source,
        sourceId: input.sourceId,
        tags: input.tags || [],
        metadata: input.metadata
      }
    });
  }

  async getRiskEventsByScore(riskScoreId: string): Promise<RiskEvent[]> {
    return this.prisma.riskEvent.findMany({
      where: { riskScoreId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getRiskEventsByEntity(entityId: string, entityType: RiskEntityType, tenantId: string, limit: number = 50): Promise<RiskEvent[]> {
    // First get risk scores for the entity
    const riskScores = await this.getRiskScoresByEntity(entityId, entityType, tenantId);
    const riskScoreIds = riskScores.map(score => score.id);

    if (riskScoreIds.length === 0) {
      return [];
    }

    return this.prisma.riskEvent.findMany({
      where: {
        riskScoreId: { in: riskScoreIds }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  async getUnprocessedEvents(tenantId: string, limit: number = 100): Promise<RiskEvent[]> {
    return this.prisma.riskEvent.findMany({
      where: {
        tenantId,
        isProcessed: false
      },
      orderBy: { createdAt: 'asc' },
      take: limit
    });
  }

  async markEventAsProcessed(eventId: string, processedBy?: string): Promise<RiskEvent> {
    return this.prisma.riskEvent.update({
      where: { id: eventId },
      data: {
        isProcessed: true,
        processedAt: new Date(),
        processedBy
      }
    });
  }

  // RiskProfile methods
  async createRiskProfile(input: CreateRiskProfileInput): Promise<RiskProfile> {
    return this.prisma.riskProfile.create({
      data: {
        tenantId: input.tenantId,
        entityId: input.entityId,
        entityType: input.entityType,
        riskLevel: input.riskLevel || 'LOW',
        riskScore: input.riskScore || 0.0,
        lastCalculatedAt: input.lastCalculatedAt,
        riskFactors: input.riskFactors,
        riskHistory: input.riskHistory,
        isBlacklisted: input.isBlacklisted || false,
        isWhitelisted: input.isWhitelisted || false,
        isHighRisk: input.isHighRisk || false,
        lastReviewedAt: input.lastReviewedAt,
        reviewedBy: input.reviewedBy,
        reviewNotes: input.reviewNotes,
        metadata: input.metadata
      }
    });
  }

  async updateRiskProfile(id: string, input: Partial<CreateRiskProfileInput>): Promise<RiskProfile> {
    return this.prisma.riskProfile.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date()
      }
    });
  }

  async getRiskProfile(entityId: string, entityType: RiskEntityType, tenantId: string): Promise<RiskProfile | null> {
    return this.prisma.riskProfile.findUnique({
      where: {
        tenantId_entityId_entityType: {
          tenantId,
          entityId,
          entityType
        }
      }
    });
  }

  async getRiskProfilesByTenant(tenantId: string, entityType?: RiskEntityType): Promise<RiskProfile[]> {
    return this.prisma.riskProfile.findMany({
      where: {
        tenantId,
        ...(entityType && { entityType })
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async blacklistEntity(entityId: string, entityType: RiskEntityType, tenantId: string, reason: string): Promise<RiskProfile> {
    return this.prisma.riskProfile.upsert({
      where: {
        tenantId_entityId_entityType: {
          tenantId,
          entityId,
          entityType
        }
      },
      update: {
        isBlacklisted: true,
        isWhitelisted: false,
        lastReviewedAt: new Date(),
        reviewNotes: reason,
        updatedAt: new Date()
      },
      create: {
        tenantId,
        entityId,
        entityType,
        isBlacklisted: true,
        isWhitelisted: false,
        riskLevel: 'HIGH',
        riskScore: 100.0,
        lastReviewedAt: new Date(),
        reviewNotes: reason
      }
    });
  }

  async whitelistEntity(entityId: string, entityType: RiskEntityType, tenantId: string, reason: string): Promise<RiskProfile> {
    return this.prisma.riskProfile.upsert({
      where: {
        tenantId_entityId_entityType: {
          tenantId,
          entityId,
          entityType
        }
      },
      update: {
        isWhitelisted: true,
        isBlacklisted: false,
        lastReviewedAt: new Date(),
        reviewNotes: reason,
        updatedAt: new Date()
      },
      create: {
        tenantId,
        entityId,
        entityType,
        isWhitelisted: true,
        isBlacklisted: false,
        riskLevel: 'LOW',
        riskScore: 0.0,
        lastReviewedAt: new Date(),
        reviewNotes: reason
      }
    });
  }

  async removeFromList(entityId: string, entityType: RiskEntityType, tenantId: string, listType: 'BLACKLIST' | 'WHITELIST'): Promise<RiskProfile | null> {
    const profile = await this.getRiskProfile(entityId, entityType, tenantId);
    if (!profile) return null;

    const updates: any = {
      lastReviewedAt: new Date(),
      updatedAt: new Date()
    };

    if (listType === 'BLACKLIST') {
      updates.isBlacklisted = false;
    } else {
      updates.isWhitelisted = false;
    }

    return this.prisma.riskProfile.update({
      where: { id: profile.id },
      data: updates
    });
  }

  // Statistics methods
  async getRiskStatistics(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<{
    totalAssessments: number;
    averageScore: number;
    riskLevelDistribution: Record<string, number>;
    blockedCount: number;
    heldCount: number;
    reviewedCount: number;
    topRiskFactors: Array<{
      factor: string;
      count: number;
      averageScore: number;
    }>;
  }> {
    const where: any = { tenantId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    const scores = await this.prisma.riskScore.findMany({
      where,
      select: {
        totalScore: true,
        riskLevel: true,
        isBlocked: true,
        status: true,
        ruleScores: true
      }
    });

    const totalAssessments = scores.length;
    const averageScore = totalAssessments > 0 ? scores.reduce((sum, s) => sum + s.totalScore, 0) / totalAssessments : 0;

    const riskLevelDistribution = scores.reduce((acc, score) => {
      acc[score.riskLevel] = (acc[score.riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const blockedCount = scores.filter(s => s.isBlocked).length;
    const heldCount = scores.filter(s => s.status === 'PENDING').length;
    const reviewedCount = scores.filter(s => s.status === 'REVIEWED').length;

    // Analyze top risk factors from rule scores
    const factorScores: Record<string, { count: number; totalScore: number }> = {};
    scores.forEach(score => {
      if (score.ruleScores && typeof score.ruleScores === 'object') {
        Object.entries(score.ruleScores).forEach(([factor, factorScore]) => {
          if (typeof factorScore === 'number') {
            if (!factorScores[factor]) {
              factorScores[factor] = { count: 0, totalScore: 0 };
            }
            factorScores[factor].count++;
            factorScores[factor].totalScore += factorScore;
          }
        });
      }
    });

    const topRiskFactors = Object.entries(factorScores)
      .map(([factor, data]) => ({
        factor,
        count: data.count,
        averageScore: data.totalScore / data.count
      }))
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 10);

    return {
      totalAssessments,
      averageScore,
      riskLevelDistribution,
      blockedCount,
      heldCount,
      reviewedCount,
      topRiskFactors
    };
  }

  // Utility methods
  async getHighRiskScores(tenantId: string, limit: number = 50): Promise<RiskScore[]> {
    return this.prisma.riskScore.findMany({
      where: {
        tenantId,
        riskLevel: { in: ['HIGH', 'CRITICAL'] }
      },
      include: {
        riskEvents: true,
        order: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  async getBlockedScores(tenantId: string): Promise<RiskScore[]> {
    return this.prisma.riskScore.findMany({
      where: {
        tenantId,
        isBlocked: true
      },
      include: {
        riskEvents: true,
        order: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPendingReviewScores(tenantId: string): Promise<RiskScore[]> {
    return this.prisma.riskScore.findMany({
      where: {
        tenantId,
        status: 'PENDING'
      },
      include: {
        riskEvents: true,
        order: true
      },
      orderBy: { createdAt: 'asc' }
    });
  }
}

