/**
 * Risk Port - Interface for risk management operations
 * Supports multiple risk assessment providers and rule engines
 */

export interface RiskSignal {
  signalType: string;
  signalName: string;
  value: any;
  weight: number;
  source: string;
  timestamp: Date;
  metadata?: any;
}

export interface RiskContext {
  entityId: string;
  entityType: 'CUSTOMER' | 'SELLER' | 'ORDER' | 'PAYMENT';
  tenantId: string;
  signals: RiskSignal[];
  contextData: any;
  metadata?: any;
}

export interface RiskRule {
  id: string;
  name: string;
  description?: string;
  ruleType: 'SCORING' | 'THRESHOLD' | 'BLACKLIST' | 'WHITELIST' | 'NOTIFICATION' | 'AUTO_ACTION';
  category: 'CUSTOMER' | 'SELLER' | 'ORDER' | 'PAYMENT' | 'FRAUD' | 'COMPLIANCE' | 'GEOGRAPHIC' | 'BEHAVIORAL' | 'FINANCIAL' | 'TECHNICAL';
  priority: number;
  conditions: any;
  threshold?: number;
  weight: number;
  action: 'SCORE' | 'BLOCK' | 'HOLD' | 'NOTIFY' | 'REVIEW' | 'APPROVE' | 'ESCALATE';
  actionParams?: any;
  isActive: boolean;
  isEnabled: boolean;
  tags: string[];
  metadata?: any;
}

export interface RiskScore {
  id: string;
  entityId: string;
  entityType: 'CUSTOMER' | 'SELLER' | 'ORDER' | 'PAYMENT';
  tenantId: string;
  totalScore: number;
  maxPossibleScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ruleScores: Record<string, number>;
  context: any;
  signals: RiskSignal[];
  status: 'PENDING' | 'CALCULATED' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  isBlocked: boolean;
  blockReason?: string;
  actionsTaken: string[];
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
}

export interface RiskEvent {
  id: string;
  eventType: string;
  eventName: string;
  description?: string;
  eventData: any;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  source?: string;
  sourceId?: string;
  tags: string[];
  isProcessed: boolean;
  processedAt?: Date;
  processedBy?: string;
  createdAt: Date;
  metadata?: any;
}

export interface RiskProfile {
  id: string;
  entityId: string;
  entityType: 'CUSTOMER' | 'SELLER' | 'ORDER' | 'PAYMENT';
  tenantId: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  lastCalculatedAt?: Date;
  riskFactors: Record<string, any>;
  riskHistory: any[];
  isBlacklisted: boolean;
  isWhitelisted: boolean;
  isHighRisk: boolean;
  lastReviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
}

export interface RiskAssessmentRequest {
  entityId: string;
  entityType: 'CUSTOMER' | 'SELLER' | 'ORDER' | 'PAYMENT';
  tenantId: string;
  context: RiskContext;
  forceRecalculation?: boolean;
  includeHistory?: boolean;
}

export interface RiskAssessmentResult {
  riskScore: RiskScore;
  riskProfile?: RiskProfile;
  events: RiskEvent[];
  recommendations: string[];
  shouldBlock: boolean;
  shouldHold: boolean;
  shouldReview: boolean;
  confidence: number;
  metadata?: any;
}

export interface RiskRuleEvaluation {
  ruleId: string;
  ruleName: string;
  matched: boolean;
  score: number;
  reason: string;
  action: string;
  actionParams?: any;
  metadata?: any;
}

export interface RiskThresholds {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface RiskStatistics {
  totalAssessments: number;
  averageScore: number;
  riskLevelDistribution: Record<string, number>;
  blockedCount: number;
  heldCount: number;
  reviewedCount: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  topRiskFactors: Array<{
    factor: string;
    count: number;
    averageScore: number;
  }>;
  timeRange: {
    from: Date;
    to: Date;
  };
}

export interface RiskPort {
  /**
   * Assess risk for an entity
   */
  assessRisk(request: RiskAssessmentRequest): Promise<RiskAssessmentResult>;

  /**
   * Evaluate risk rules against context
   */
  evaluateRules(context: RiskContext, rules: RiskRule[]): Promise<RiskRuleEvaluation[]>;

  /**
   * Calculate risk score from rule evaluations
   */
  calculateRiskScore(evaluations: RiskRuleEvaluation[], context: RiskContext): Promise<RiskScore>;

  /**
   * Determine risk level from score
   */
  determineRiskLevel(score: number, maxScore: number, thresholds?: RiskThresholds): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  /**
   * Get risk profile for entity
   */
  getRiskProfile(entityId: string, entityType: string, tenantId: string): Promise<RiskProfile | null>;

  /**
   * Update risk profile
   */
  updateRiskProfile(profile: Partial<RiskProfile>): Promise<RiskProfile>;

  /**
   * Create risk event
   */
  createRiskEvent(event: Omit<RiskEvent, 'id' | 'createdAt'>): Promise<RiskEvent>;

  /**
   * Get risk events for entity
   */
  getRiskEvents(entityId: string, entityType: string, tenantId: string, limit?: number): Promise<RiskEvent[]>;

  /**
   * Get active risk rules
   */
  getActiveRiskRules(tenantId: string, category?: string): Promise<RiskRule[]>;

  /**
   * Create risk rule
   */
  createRiskRule(rule: Omit<RiskRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<RiskRule>;

  /**
   * Update risk rule
   */
  updateRiskRule(ruleId: string, updates: Partial<RiskRule>): Promise<RiskRule>;

  /**
   * Delete risk rule
   */
  deleteRiskRule(ruleId: string): Promise<{ success: boolean }>;

  /**
   * Get risk statistics
   */
  getRiskStatistics(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<RiskStatistics>;

  /**
   * Get risk thresholds
   */
  getRiskThresholds(tenantId: string): Promise<RiskThresholds>;

  /**
   * Update risk thresholds
   */
  updateRiskThresholds(tenantId: string, thresholds: RiskThresholds): Promise<RiskThresholds>;

  /**
   * Blacklist entity
   */
  blacklistEntity(entityId: string, entityType: string, tenantId: string, reason: string): Promise<{ success: boolean }>;

  /**
   * Whitelist entity
   */
  whitelistEntity(entityId: string, entityType: string, tenantId: string, reason: string): Promise<{ success: boolean }>;

  /**
   * Remove from blacklist/whitelist
   */
  removeFromList(entityId: string, entityType: string, tenantId: string, listType: 'BLACKLIST' | 'WHITELIST'): Promise<{ success: boolean }>;

  /**
   * Review risk score
   */
  reviewRiskScore(scoreId: string, action: 'APPROVE' | 'REJECT', notes?: string, reviewedBy?: string): Promise<RiskScore>;

  /**
   * Get risk alerts
   */
  getRiskAlerts(tenantId: string, severity?: string, limit?: number): Promise<RiskEvent[]>;

  /**
   * Mark risk event as processed
   */
  markEventAsProcessed(eventId: string, processedBy?: string): Promise<{ success: boolean }>;

  /**
   * Health check for risk system
   */
  healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }>;

  /**
   * Get system capabilities
   */
  getCapabilities(): Promise<{
    supportedEntityTypes: string[];
    supportedRuleTypes: string[];
    supportedActions: string[];
    maxRulesPerTenant: number;
    maxSignalsPerAssessment: number;
    supportedDataTypes: string[];
  }>;
}

