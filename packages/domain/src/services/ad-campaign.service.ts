/**
 * Ad Campaign service - Pure functions for advertising operations
 * Handles campaign management, bidding, slot allocation, and performance tracking
 */

export interface AdCampaignContext {
  campaignId: string;
  adId: string;
  slotType: 'SEARCH_TOP' | 'SEARCH_SIDE' | 'SEARCH_BOTTOM' | 'CATEGORY_TOP' | 'CATEGORY_SIDE' | 'PRODUCT_TOP' | 'PRODUCT_SIDE' | 'HOME_BANNER' | 'HOME_SIDEBAR' | 'CHECKOUT_TOP' | 'CART_SIDEBAR';
  position: number;
  searchQuery?: string;
  searchCategory?: string;
  productId?: string;
  categoryId?: string;
  sellerId?: string;
  userId?: string;
  sessionId?: string;
  deviceType?: string;
  location?: {
    country: string;
    city: string;
    region: string;
  };
  metadata?: any;
}

export interface BiddingResult {
  adId: string;
  bidAmount: number;
  qualityScore: number;
  relevanceScore: number;
  finalScore: number;
  isWinner: boolean;
  position: number;
  cost: number;
  metadata?: any;
}

export interface SlotAllocationResult {
  slotType: string;
  position: number;
  allocatedAds: Array<{
    adId: string;
    campaignId: string;
    bidAmount: number;
    qualityScore: number;
    finalScore: number;
    cost: number;
  }>;
  totalRevenue: number;
  metadata?: any;
}

export interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  cpm: number; // Cost per mille
  cpa: number; // Cost per acquisition
  roas: number; // Return on ad spend
  qualityScore: number;
  relevanceScore: number;
}

export interface WalletTransaction {
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'SPEND' | 'REFUND' | 'BONUS' | 'PENALTY';
  amount: number;
  currency: string;
  description?: string;
  reference?: string;
  campaignId?: string;
  adId?: string;
  paymentMethod?: string;
  metadata?: any;
}

/**
 * Calculate quality score for an ad
 * Pure function - no side effects
 */
export function calculateQualityScore(
  ad: {
    title: string;
    description?: string;
    landingPageUrl: string;
    impressions: number;
    clicks: number;
    conversions: number;
  },
  context: AdCampaignContext
): number {
  let score = 0;

  // Ad relevance (0-3 points)
  const relevanceScore = calculateRelevanceScore(ad, context);
  score += relevanceScore;

  // Expected CTR (0-3 points)
  const expectedCtr = calculateExpectedCtr(ad, context);
  score += expectedCtr;

  // Landing page experience (0-3 points)
  const landingPageScore = calculateLandingPageScore(ad.landingPageUrl);
  score += landingPageScore;

  // Ad format (0-1 point)
  const formatScore = calculateAdFormatScore(ad);
  score += formatScore;

  // Normalize to 0-10 scale
  return Math.min(10, Math.max(0, (score / 10) * 10));
}

/**
 * Calculate relevance score for an ad
 * Pure function - no side effects
 */
function calculateRelevanceScore(
  ad: { title: string; description?: string },
  context: AdCampaignContext
): number {
  let score = 0;

  // Keyword relevance
  if (context.searchQuery) {
    const queryWords = context.searchQuery.toLowerCase().split(' ');
    const titleWords = ad.title.toLowerCase().split(' ');
    const descriptionWords = (ad.description || '').toLowerCase().split(' ');

    const titleMatches = queryWords.filter(word => titleWords.includes(word)).length;
    const descriptionMatches = queryWords.filter(word => descriptionWords.includes(word)).length;

    score += (titleMatches / queryWords.length) * 2; // 0-2 points
    score += (descriptionMatches / queryWords.length) * 1; // 0-1 point
  }

  // Category relevance
  if (context.searchCategory && context.categoryId) {
    if (context.searchCategory === context.categoryId) {
      score += 1; // 1 point for exact category match
    }
  }

  return Math.min(3, score);
}

/**
 * Calculate expected CTR for an ad
 * Pure function - no side effects
 */
function calculateExpectedCtr(
  ad: { impressions: number; clicks: number },
  context: AdCampaignContext
): number {
  // Base CTR from historical data
  const historicalCtr = ad.impressions > 0 ? ad.clicks / ad.impressions : 0;

  // Position factor (higher positions have higher CTR)
  const positionFactor = Math.max(0.1, 1 - (context.position - 1) * 0.2);

  // Device factor
  const deviceFactor = context.deviceType === 'mobile' ? 1.2 : 1.0;

  // Expected CTR = Historical CTR * Position Factor * Device Factor
  const expectedCtr = historicalCtr * positionFactor * deviceFactor;

  // Convert to 0-3 scale
  return Math.min(3, expectedCtr * 10);
}

/**
 * Calculate landing page experience score
 * Pure function - no side effects
 */
function calculateLandingPageScore(landingPageUrl: string): number {
  let score = 0;

  // URL structure (0-1 point)
  if (landingPageUrl.includes('https://')) score += 0.5;
  if (landingPageUrl.length < 100) score += 0.5; // Short, clean URLs

  // Domain authority (0-1 point)
  if (landingPageUrl.includes('www.')) score += 0.5;
  if (!landingPageUrl.includes('?')) score += 0.5; // Clean URLs without parameters

  // Mobile friendliness (0-1 point)
  // This would typically require actual page analysis
  score += 0.5; // Assume mobile-friendly for now

  return Math.min(3, score);
}

/**
 * Calculate ad format score
 * Pure function - no side effects
 */
function calculateAdFormatScore(ad: { title: string; description?: string }): number {
  let score = 0;

  // Title quality (0-0.5 points)
  if (ad.title.length >= 10 && ad.title.length <= 60) score += 0.5;

  // Description quality (0-0.5 points)
  if (ad.description && ad.description.length >= 20 && ad.description.length <= 160) {
    score += 0.5;
  }

  return Math.min(1, score);
}

/**
 * Calculate final bid score for auction
 * Pure function - no side effects
 */
export function calculateFinalBidScore(
  bidAmount: number,
  qualityScore: number,
  relevanceScore: number,
  context: AdCampaignContext
): number {
  // Final Score = Bid Amount * Quality Score * Relevance Score
  const baseScore = bidAmount * qualityScore * relevanceScore;

  // Position factor (higher positions get slight boost)
  const positionFactor = 1 + (context.position - 1) * 0.1;

  // Device factor
  const deviceFactor = context.deviceType === 'mobile' ? 1.1 : 1.0;

  // Location factor (premium locations get boost)
  const locationFactor = context.location?.country === 'TR' ? 1.05 : 1.0;

  return baseScore * positionFactor * deviceFactor * locationFactor;
}

/**
 * Run ad auction for a slot
 * Pure function - no side effects
 */
export function runAdAuction(
  slotType: string,
  position: number,
  competingAds: Array<{
    adId: string;
    campaignId: string;
    bidAmount: number;
    qualityScore: number;
    relevanceScore: number;
    maxBidAmount?: number;
  }>,
  context: AdCampaignContext
): BiddingResult[] {
  // Calculate final scores for all ads
  const scoredAds = competingAds.map(ad => {
    const finalScore = calculateFinalBidScore(
      ad.bidAmount,
      ad.qualityScore,
      ad.relevanceScore,
      context
    );

    return {
      ...ad,
      finalScore,
      cost: calculateActualCost(ad.bidAmount, ad.qualityScore, ad.relevanceScore, context)
    };
  });

  // Sort by final score (highest first)
  const sortedAds = scoredAds.sort((a, b) => b.finalScore - a.finalScore);

  // Allocate positions
  const results: BiddingResult[] = [];
  const maxAds = getMaxAdsForSlot(slotType);

  for (let i = 0; i < Math.min(sortedAds.length, maxAds); i++) {
    const ad = sortedAds[i];
    results.push({
      adId: ad.adId,
      bidAmount: ad.bidAmount,
      qualityScore: ad.qualityScore,
      relevanceScore: ad.relevanceScore,
      finalScore: ad.finalScore,
      isWinner: true,
      position: position + i,
      cost: ad.cost,
      metadata: {
        slotType,
        auctionRank: i + 1,
        totalCompetitors: competingAds.length
      }
    });
  }

  return results;
}

/**
 * Calculate actual cost for winning ad
 * Pure function - no side effects
 */
function calculateActualCost(
  bidAmount: number,
  qualityScore: number,
  relevanceScore: number,
  context: AdCampaignContext
): number {
  // Second-price auction: winner pays the minimum amount needed to win
  // For simplicity, we'll use a percentage of the bid amount
  const costFactor = 0.8; // Winner pays 80% of their bid
  return bidAmount * costFactor;
}

/**
 * Get maximum ads for a slot type
 * Pure function - no side effects
 */
function getMaxAdsForSlot(slotType: string): number {
  const slotLimits: Record<string, number> = {
    'SEARCH_TOP': 3,
    'SEARCH_SIDE': 1,
    'SEARCH_BOTTOM': 2,
    'CATEGORY_TOP': 4,
    'CATEGORY_SIDE': 2,
    'PRODUCT_TOP': 2,
    'PRODUCT_SIDE': 1,
    'HOME_BANNER': 1,
    'HOME_SIDEBAR': 3,
    'CHECKOUT_TOP': 1,
    'CART_SIDEBAR': 2
  };

  return slotLimits[slotType] || 1;
}

/**
 * Calculate performance metrics
 * Pure function - no side effects
 */
export function calculatePerformanceMetrics(
  impressions: number,
  clicks: number,
  conversions: number,
  spend: number,
  revenue: number
): PerformanceMetrics {
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;
  const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
  const cpa = conversions > 0 ? spend / conversions : 0;
  const roas = spend > 0 ? revenue / spend : 0;

  return {
    impressions,
    clicks,
    conversions,
    spend,
    revenue,
    ctr,
    cpc,
    cpm,
    cpa,
    roas,
    qualityScore: 0, // Would be calculated separately
    relevanceScore: 0 // Would be calculated separately
  };
}

/**
 * Calculate wallet balance after transaction
 * Pure function - no side effects
 */
export function calculateWalletBalance(
  currentBalance: number,
  transaction: WalletTransaction
): number {
  switch (transaction.type) {
    case 'DEPOSIT':
    case 'REFUND':
    case 'BONUS':
      return currentBalance + transaction.amount;
    case 'WITHDRAWAL':
    case 'SPEND':
    case 'PENALTY':
      return Math.max(0, currentBalance - transaction.amount);
    default:
      return currentBalance;
  }
}

/**
 * Validate wallet transaction
 * Pure function - no side effects
 */
export function validateWalletTransaction(
  transaction: WalletTransaction,
  currentBalance: number,
  dailySpendLimit?: number,
  monthlySpendLimit?: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Amount validation
  if (transaction.amount <= 0) {
    errors.push('Transaction amount must be greater than 0');
  }

  // Balance validation for withdrawals and spending
  if ((transaction.type === 'WITHDRAWAL' || transaction.type === 'SPEND') && 
      transaction.amount > currentBalance) {
    errors.push('Insufficient balance for this transaction');
  }

  // Daily spend limit validation
  if (transaction.type === 'SPEND' && dailySpendLimit && 
      transaction.amount > dailySpendLimit) {
    errors.push(`Transaction amount exceeds daily spend limit of ${dailySpendLimit}`);
  }

  // Monthly spend limit validation
  if (transaction.type === 'SPEND' && monthlySpendLimit && 
      transaction.amount > monthlySpendLimit) {
    errors.push(`Transaction amount exceeds monthly spend limit of ${monthlySpendLimit}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Calculate slot revenue
 * Pure function - no side effects
 */
export function calculateSlotRevenue(
  slotType: string,
  position: number,
  allocatedAds: Array<{ cost: number }>
): number {
  return allocatedAds.reduce((total, ad) => total + ad.cost, 0);
}

/**
 * Determine ad eligibility for slot
 * Pure function - no side effects
 */
export function isAdEligibleForSlot(
  ad: {
    status: string;
    isActive: boolean;
    isApproved: boolean;
    bidAmount: number;
    maxBidAmount?: number;
  },
  slot: {
    minBidAmount: number;
    reservePrice?: number;
    targetCategories: string[];
    targetKeywords: string[];
  },
  context: AdCampaignContext
): { eligible: boolean; reason?: string } {
  // Status checks
  if (ad.status !== 'ACTIVE') {
    return { eligible: false, reason: 'Ad is not active' };
  }

  if (!ad.isActive) {
    return { eligible: false, reason: 'Ad is paused' };
  }

  if (!ad.isApproved) {
    return { eligible: false, reason: 'Ad is not approved' };
  }

  // Bid amount checks
  if (ad.bidAmount < slot.minBidAmount) {
    return { eligible: false, reason: 'Bid amount below minimum' };
  }

  if (slot.reservePrice && ad.bidAmount < slot.reservePrice) {
    return { eligible: false, reason: 'Bid amount below reserve price' };
  }

  if (ad.maxBidAmount && ad.bidAmount > ad.maxBidAmount) {
    return { eligible: false, reason: 'Bid amount exceeds maximum' };
  }

  // Category targeting
  if (slot.targetCategories.length > 0 && context.categoryId) {
    if (!slot.targetCategories.includes(context.categoryId)) {
      return { eligible: false, reason: 'Ad not targeted for this category' };
    }
  }

  // Keyword targeting
  if (slot.targetKeywords.length > 0 && context.searchQuery) {
    const queryWords = context.searchQuery.toLowerCase().split(' ');
    const hasMatchingKeyword = slot.targetKeywords.some(keyword => 
      queryWords.some(word => word.includes(keyword.toLowerCase()))
    );
    
    if (!hasMatchingKeyword) {
      return { eligible: false, reason: 'No matching keywords found' };
    }
  }

  return { eligible: true };
}

/**
 * Generate ad performance report
 * Pure function - no side effects
 */
export function generateAdPerformanceReport(
  campaignId: string,
  dateRange: { start: Date; end: Date },
  metrics: PerformanceMetrics,
  additionalData?: {
    topKeywords?: string[];
    topLocations?: string[];
    deviceBreakdown?: Record<string, number>;
    hourlyBreakdown?: Record<string, number>;
  }
): {
  campaignId: string;
  dateRange: { start: Date; end: Date };
  summary: PerformanceMetrics;
  insights: string[];
  recommendations: string[];
  additionalData?: any;
} {
  const insights: string[] = [];
  const recommendations: string[] = [];

  // CTR insights
  if (metrics.ctr > 5) {
    insights.push('High click-through rate indicates strong ad relevance');
  } else if (metrics.ctr < 1) {
    insights.push('Low click-through rate suggests ad relevance issues');
    recommendations.push('Consider improving ad title and description');
  }

  // CPC insights
  if (metrics.cpc > 2) {
    insights.push('High cost per click may indicate competitive keywords');
    recommendations.push('Consider targeting long-tail keywords or adjusting bids');
  }

  // ROAS insights
  if (metrics.roas > 4) {
    insights.push('Excellent return on ad spend');
  } else if (metrics.roas < 1) {
    insights.push('Negative return on ad spend');
    recommendations.push('Review targeting and landing page optimization');
  }

  // Conversion insights
  if (metrics.conversions > 0 && metrics.cpa > 50) {
    insights.push('High cost per acquisition');
    recommendations.push('Optimize landing page for better conversion rates');
  }

  return {
    campaignId,
    dateRange,
    summary: metrics,
    insights,
    recommendations,
    additionalData
  };
}

/**
 * Calculate budget utilization
 * Pure function - no side effects
 */
export function calculateBudgetUtilization(
  totalBudget: number,
  usedAmount: number,
  remainingAmount: number
): {
  utilizationPercentage: number;
  status: 'UNDER_BUDGET' | 'ON_TRACK' | 'OVER_BUDGET' | 'EXHAUSTED';
  daysRemaining?: number;
} {
  const utilizationPercentage = totalBudget > 0 ? (usedAmount / totalBudget) * 100 : 0;

  let status: 'UNDER_BUDGET' | 'ON_TRACK' | 'OVER_BUDGET' | 'EXHAUSTED';
  
  if (remainingAmount <= 0) {
    status = 'EXHAUSTED';
  } else if (utilizationPercentage > 100) {
    status = 'OVER_BUDGET';
  } else if (utilizationPercentage > 80) {
    status = 'ON_TRACK';
  } else {
    status = 'UNDER_BUDGET';
  }

  return {
    utilizationPercentage,
    status
  };
}

/**
 * Generate bid recommendations
 * Pure function - no side effects
 */
export function generateBidRecommendations(
  currentBid: number,
  qualityScore: number,
  competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH',
  performanceHistory: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
  }
): {
  recommendedBid: number;
  reasoning: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
} {
  let recommendedBid = currentBid;
  let reasoning = '';
  let confidence: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';

  // Adjust based on quality score
  if (qualityScore > 7) {
    recommendedBid *= 1.1; // Increase bid for high quality
    reasoning += 'High quality score allows for higher bids. ';
  } else if (qualityScore < 4) {
    recommendedBid *= 0.9; // Decrease bid for low quality
    reasoning += 'Low quality score suggests reducing bid. ';
  }

  // Adjust based on competition
  switch (competitionLevel) {
    case 'LOW':
      recommendedBid *= 0.9;
      reasoning += 'Low competition allows for lower bids. ';
      break;
    case 'HIGH':
      recommendedBid *= 1.2;
      reasoning += 'High competition requires higher bids. ';
      break;
  }

  // Adjust based on performance
  const ctr = performanceHistory.impressions > 0 ? 
    performanceHistory.clicks / performanceHistory.impressions : 0;
  
  if (ctr > 0.05) { // 5% CTR
    recommendedBid *= 1.1;
    reasoning += 'Good CTR performance supports higher bids. ';
    confidence = 'HIGH';
  } else if (ctr < 0.01) { // 1% CTR
    recommendedBid *= 0.8;
    reasoning += 'Poor CTR performance suggests lower bids. ';
    confidence = 'HIGH';
  }

  return {
    recommendedBid: Math.round(recommendedBid * 100) / 100,
    reasoning: reasoning.trim(),
    confidence
  };
}

