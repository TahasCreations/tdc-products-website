/**
 * Ad Campaign Service Implementation
 * Orchestrates ad campaign operations using domain logic and repository
 */

import { AdCampaignRepository, CreateAdCampaignInput, CreateAdGroupInput, CreateAdInput, CreateAdBudgetInput, CreateAdImpressionInput, CreateAdClickInput, CreateWalletTransactionInput, AdCampaignSearchParams } from '../database/repositories/ad-campaign.repository.js';
import { PrismaClient } from '../database/prisma-client.js';
import { 
  calculateQualityScore,
  calculateFinalBidScore,
  runAdAuction,
  calculatePerformanceMetrics,
  calculateWalletBalance,
  validateWalletTransaction,
  calculateSlotRevenue,
  isAdEligibleForSlot,
  generateAdPerformanceReport,
  calculateBudgetUtilization,
  generateBidRecommendations,
  AdCampaignContext,
  BiddingResult,
  SlotAllocationResult,
  PerformanceMetrics,
  WalletTransaction
} from '@tdc/domain';

export interface AdCampaignService {
  // Campaign management
  createCampaign(input: CreateAdCampaignInput): Promise<{ success: boolean; campaign?: any; error?: string }>;
  updateCampaign(id: string, input: any): Promise<{ success: boolean; campaign?: any; error?: string }>;
  getCampaign(id: string): Promise<any | null>;
  searchCampaigns(params: AdCampaignSearchParams): Promise<any>;
  deleteCampaign(id: string): Promise<{ success: boolean }>;
  
  // Ad group management
  createAdGroup(input: CreateAdGroupInput): Promise<{ success: boolean; adGroup?: any; error?: string }>;
  getAdGroupsByCampaign(campaignId: string): Promise<any[]>;
  
  // Ad management
  createAd(input: CreateAdInput): Promise<{ success: boolean; ad?: any; error?: string }>;
  getAdsByCampaign(campaignId: string): Promise<any[]>;
  approveAd(adId: string, approvedBy: string): Promise<{ success: boolean; error?: string }>;
  rejectAd(adId: string, reason: string, rejectedBy: string): Promise<{ success: boolean; error?: string }>;
  
  // Slot allocation and bidding
  allocateSlot(slotType: string, position: number, context: AdCampaignContext): Promise<SlotAllocationResult>;
  runAuction(slotType: string, position: number, context: AdCampaignContext): Promise<BiddingResult[]>;
  
  // Impression and click tracking
  recordImpression(input: CreateAdImpressionInput): Promise<{ success: boolean; impression?: any; error?: string }>;
  recordClick(input: CreateAdClickInput): Promise<{ success: boolean; click?: any; error?: string }>;
  
  // Wallet management
  getSellerWallet(sellerId: string, tenantId: string): Promise<any | null>;
  createSellerWallet(sellerId: string, tenantId: string, initialBalance?: number): Promise<{ success: boolean; wallet?: any; error?: string }>;
  depositToWallet(walletId: string, amount: number, paymentMethod: string, reference?: string): Promise<{ success: boolean; transaction?: any; error?: string }>;
  withdrawFromWallet(walletId: string, amount: number, description?: string): Promise<{ success: boolean; transaction?: any; error?: string }>;
  
  // Budget management
  createBudget(input: CreateAdBudgetInput): Promise<{ success: boolean; budget?: any; error?: string }>;
  updateBudgetUsage(budgetId: string, amount: number): Promise<{ success: boolean; error?: string }>;
  
  // Statistics and reporting
  getCampaignStatistics(campaignId: string, dateFrom?: Date, dateTo?: Date): Promise<any>;
  getSlotStatistics(slotType: string, tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<any>;
  generatePerformanceReport(campaignId: string, dateRange: { start: Date; end: Date }): Promise<any>;
  
  // Health check
  healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }>;
}

export class AdCampaignServiceImpl implements AdCampaignService {
  private prisma: PrismaClient;
  private adCampaignRepo: AdCampaignRepository;

  constructor() {
    this.prisma = new PrismaClient();
    this.adCampaignRepo = new AdCampaignRepository(this.prisma);
  }

  async createCampaign(input: CreateAdCampaignInput): Promise<{ success: boolean; campaign?: any; error?: string }> {
    try {
      console.log('[Ad Campaign Service] Creating campaign:', input.name);

      const campaign = await this.adCampaignRepo.createAdCampaign(input);

      console.log('[Ad Campaign Service] Campaign created successfully:', campaign.id);

      return {
        success: true,
        campaign: this.transformCampaign(campaign)
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Error creating campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create campaign'
      };
    }
  }

  async updateCampaign(id: string, input: any): Promise<{ success: boolean; campaign?: any; error?: string }> {
    try {
      console.log('[Ad Campaign Service] Updating campaign:', id);

      const campaign = await this.adCampaignRepo.updateAdCampaign(id, input);

      return {
        success: true,
        campaign: this.transformCampaign(campaign)
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Error updating campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update campaign'
      };
    }
  }

  async getCampaign(id: string): Promise<any | null> {
    try {
      const campaign = await this.adCampaignRepo.getAdCampaignById(id);
      return campaign ? this.transformCampaign(campaign) : null;
    } catch (error) {
      console.error('[Ad Campaign Service] Error getting campaign:', error);
      return null;
    }
  }

  async searchCampaigns(params: AdCampaignSearchParams): Promise<any> {
    try {
      const result = await this.adCampaignRepo.searchAdCampaigns(params);
      return {
        ...result,
        campaigns: result.campaigns.map(campaign => this.transformCampaign(campaign))
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Error searching campaigns:', error);
      return {
        campaigns: [],
        total: 0,
        page: 1,
        limit: 50,
        hasMore: false
      };
    }
  }

  async deleteCampaign(id: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.adCampaign.delete({
        where: { id }
      });
      return { success: true };
    } catch (error) {
      console.error('[Ad Campaign Service] Error deleting campaign:', error);
      return { success: false };
    }
  }

  async createAdGroup(input: CreateAdGroupInput): Promise<{ success: boolean; adGroup?: any; error?: string }> {
    try {
      console.log('[Ad Campaign Service] Creating ad group:', input.name);

      const adGroup = await this.adCampaignRepo.createAdGroup(input);

      return {
        success: true,
        adGroup: this.transformAdGroup(adGroup)
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Error creating ad group:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create ad group'
      };
    }
  }

  async getAdGroupsByCampaign(campaignId: string): Promise<any[]> {
    try {
      const adGroups = await this.adCampaignRepo.getAdGroupsByCampaign(campaignId);
      return adGroups.map(adGroup => this.transformAdGroup(adGroup));
    } catch (error) {
      console.error('[Ad Campaign Service] Error getting ad groups:', error);
      return [];
    }
  }

  async createAd(input: CreateAdInput): Promise<{ success: boolean; ad?: any; error?: string }> {
    try {
      console.log('[Ad Campaign Service] Creating ad:', input.title);

      const ad = await this.adCampaignRepo.createAd(input);

      return {
        success: true,
        ad: this.transformAd(ad)
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Error creating ad:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create ad'
      };
    }
  }

  async getAdsByCampaign(campaignId: string): Promise<any[]> {
    try {
      const ads = await this.adCampaignRepo.getAdsByCampaign(campaignId);
      return ads.map(ad => this.transformAd(ad));
    } catch (error) {
      console.error('[Ad Campaign Service] Error getting ads:', error);
      return [];
    }
  }

  async approveAd(adId: string, approvedBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.prisma.ad.update({
        where: { id: adId },
        data: {
          isApproved: true,
          approvedBy,
          approvedAt: new Date(),
          status: 'ACTIVE'
        }
      });

      return { success: true };
    } catch (error) {
      console.error('[Ad Campaign Service] Error approving ad:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to approve ad'
      };
    }
  }

  async rejectAd(adId: string, reason: string, rejectedBy: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.prisma.ad.update({
        where: { id: adId },
        data: {
          isApproved: false,
          rejectionReason: reason,
          status: 'REJECTED'
        }
      });

      return { success: true };
    } catch (error) {
      console.error('[Ad Campaign Service] Error rejecting ad:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reject ad'
      };
    }
  }

  async allocateSlot(slotType: string, position: number, context: AdCampaignContext): Promise<SlotAllocationResult> {
    try {
      console.log('[Ad Campaign Service] Allocating slot:', slotType, position);

      // Get eligible ads for the slot
      const eligibleAds = await this.adCampaignRepo.getEligibleAdsForSlot(
        slotType as any,
        position,
        {
          searchQuery: context.searchQuery,
          searchCategory: context.searchCategory,
          productId: context.productId,
          categoryId: context.categoryId,
          sellerId: context.sellerId
        }
      );

      // Filter and score ads
      const competingAds = [];
      for (const ad of eligibleAds) {
        const qualityScore = calculateQualityScore(ad, context);
        const relevanceScore = 0.8; // Would be calculated based on context
        const finalScore = calculateFinalBidScore(ad.bidAmount, qualityScore, relevanceScore, context);

        competingAds.push({
          adId: ad.id,
          campaignId: ad.campaignId,
          bidAmount: ad.bidAmount,
          qualityScore,
          relevanceScore,
          maxBidAmount: ad.maxBidAmount
        });
      }

      // Run auction
      const auctionResults = runAdAuction(slotType, position, competingAds, context);

      // Calculate total revenue
      const totalRevenue = calculateSlotRevenue(slotType, position, auctionResults);

      console.log('[Ad Campaign Service] Slot allocated successfully:', {
        slotType,
        position,
        allocatedAds: auctionResults.length,
        totalRevenue
      });

      return {
        slotType,
        position,
        allocatedAds: auctionResults,
        totalRevenue,
        metadata: {
          totalEligibleAds: eligibleAds.length,
          totalCompetingAds: competingAds.length,
          allocatedAds: auctionResults.length
        }
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Error allocating slot:', error);
      return {
        slotType,
        position,
        allocatedAds: [],
        totalRevenue: 0,
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  async runAuction(slotType: string, position: number, context: AdCampaignContext): Promise<BiddingResult[]> {
    try {
      // Get eligible ads
      const eligibleAds = await this.adCampaignRepo.getEligibleAdsForSlot(
        slotType as any,
        position,
        {
          searchQuery: context.searchQuery,
          searchCategory: context.searchCategory,
          productId: context.productId,
          categoryId: context.categoryId,
          sellerId: context.sellerId
        }
      );

      // Prepare competing ads
      const competingAds = eligibleAds.map(ad => ({
        adId: ad.id,
        campaignId: ad.campaignId,
        bidAmount: ad.bidAmount,
        qualityScore: calculateQualityScore(ad, context),
        relevanceScore: 0.8, // Would be calculated based on context
        maxBidAmount: ad.maxBidAmount
      }));

      // Run auction
      return runAdAuction(slotType, position, competingAds, context);
    } catch (error) {
      console.error('[Ad Campaign Service] Error running auction:', error);
      return [];
    }
  }

  async recordImpression(input: CreateAdImpressionInput): Promise<{ success: boolean; impression?: any; error?: string }> {
    try {
      console.log('[Ad Campaign Service] Recording impression for ad:', input.adId);

      const impression = await this.adCampaignRepo.createAdImpression(input);

      // Update campaign and ad metrics
      await this.adCampaignRepo.incrementCampaignMetrics(input.campaignId, 1, 0, 0, 0);
      await this.adCampaignRepo.updateAdMetrics(input.adId, 1, 0, 0, 0);

      return {
        success: true,
        impression: this.transformImpression(impression)
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Error recording impression:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to record impression'
      };
    }
  }

  async recordClick(input: CreateAdClickInput): Promise<{ success: boolean; click?: any; error?: string }> {
    try {
      console.log('[Ad Campaign Service] Recording click for ad:', input.adId);

      const click = await this.adCampaignRepo.createAdClick(input);

      // Update campaign and ad metrics
      await this.adCampaignRepo.incrementCampaignMetrics(
        input.campaignId, 
        0, 
        1, 
        input.isConversion ? 1 : 0, 
        input.cost
      );
      await this.adCampaignRepo.updateAdMetrics(
        input.adId, 
        0, 
        1, 
        input.isConversion ? 1 : 0, 
        input.cost
      );

      return {
        success: true,
        click: this.transformClick(click)
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Error recording click:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to record click'
      };
    }
  }

  async getSellerWallet(sellerId: string, tenantId: string): Promise<any | null> {
    try {
      const wallet = await this.adCampaignRepo.getSellerWallet(sellerId, tenantId);
      return wallet ? this.transformWallet(wallet) : null;
    } catch (error) {
      console.error('[Ad Campaign Service] Error getting seller wallet:', error);
      return null;
    }
  }

  async createSellerWallet(sellerId: string, tenantId: string, initialBalance: number = 0): Promise<{ success: boolean; wallet?: any; error?: string }> {
    try {
      console.log('[Ad Campaign Service] Creating seller wallet for:', sellerId);

      const wallet = await this.adCampaignRepo.createSellerWallet(sellerId, tenantId, initialBalance);

      return {
        success: true,
        wallet: this.transformWallet(wallet)
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Error creating seller wallet:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create seller wallet'
      };
    }
  }

  async depositToWallet(walletId: string, amount: number, paymentMethod: string, reference?: string): Promise<{ success: boolean; transaction?: any; error?: string }> {
    try {
      console.log('[Ad Campaign Service] Depositing to wallet:', walletId, amount);

      // Get current wallet
      const wallet = await this.prisma.sellerWallet.findUnique({
        where: { id: walletId }
      });

      if (!wallet) {
        return {
          success: false,
          error: 'Wallet not found'
        };
      }

      // Create transaction
      const transaction = await this.adCampaignRepo.createWalletTransaction({
        tenantId: wallet.tenantId,
        walletId,
        sellerId: wallet.sellerId,
        type: 'DEPOSIT',
        amount,
        currency: wallet.currency,
        description: `Deposit via ${paymentMethod}`,
        reference,
        paymentMethod,
        paymentId: reference,
        paymentStatus: 'completed'
      });

      // Update wallet balance
      const newBalance = calculateWalletBalance(wallet.balance, {
        type: 'DEPOSIT',
        amount,
        currency: wallet.currency
      });

      await this.adCampaignRepo.updateWalletBalance(
        walletId,
        newBalance,
        wallet.totalSpent,
        wallet.totalDeposited + amount
      );

      return {
        success: true,
        transaction: this.transformTransaction(transaction)
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Error depositing to wallet:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to deposit to wallet'
      };
    }
  }

  async withdrawFromWallet(walletId: string, amount: number, description?: string): Promise<{ success: boolean; transaction?: any; error?: string }> {
    try {
      console.log('[Ad Campaign Service] Withdrawing from wallet:', walletId, amount);

      // Get current wallet
      const wallet = await this.prisma.sellerWallet.findUnique({
        where: { id: walletId }
      });

      if (!wallet) {
        return {
          success: false,
          error: 'Wallet not found'
        };
      }

      // Validate transaction
      const validation = validateWalletTransaction(
        { type: 'WITHDRAWAL', amount, currency: wallet.currency },
        wallet.balance,
        wallet.dailySpendLimit,
        wallet.monthlySpendLimit
      );

      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', ')
        };
      }

      // Create transaction
      const transaction = await this.adCampaignRepo.createWalletTransaction({
        tenantId: wallet.tenantId,
        walletId,
        sellerId: wallet.sellerId,
        type: 'WITHDRAWAL',
        amount,
        currency: wallet.currency,
        description: description || 'Withdrawal from wallet'
      });

      // Update wallet balance
      const newBalance = calculateWalletBalance(wallet.balance, {
        type: 'WITHDRAWAL',
        amount,
        currency: wallet.currency
      });

      await this.adCampaignRepo.updateWalletBalance(
        walletId,
        newBalance,
        wallet.totalSpent,
        wallet.totalDeposited
      );

      return {
        success: true,
        transaction: this.transformTransaction(transaction)
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Error withdrawing from wallet:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to withdraw from wallet'
      };
    }
  }

  async createBudget(input: CreateAdBudgetInput): Promise<{ success: boolean; budget?: any; error?: string }> {
    try {
      console.log('[Ad Campaign Service] Creating budget for campaign:', input.campaignId);

      const budget = await this.adCampaignRepo.createAdBudget(input);

      return {
        success: true,
        budget: this.transformBudget(budget)
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Error creating budget:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create budget'
      };
    }
  }

  async updateBudgetUsage(budgetId: string, amount: number): Promise<{ success: boolean; error?: string }> {
    try {
      await this.adCampaignRepo.updateBudgetUsage(budgetId, amount);
      return { success: true };
    } catch (error) {
      console.error('[Ad Campaign Service] Error updating budget usage:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update budget usage'
      };
    }
  }

  async getCampaignStatistics(campaignId: string, dateFrom?: Date, dateTo?: Date): Promise<any> {
    try {
      const stats = await this.adCampaignRepo.getCampaignStatistics(campaignId, dateFrom, dateTo);
      return stats;
    } catch (error) {
      console.error('[Ad Campaign Service] Error getting campaign statistics:', error);
      return null;
    }
  }

  async getSlotStatistics(slotType: string, tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<any> {
    try {
      const stats = await this.adCampaignRepo.getSlotStatistics(slotType as any, tenantId, dateFrom, dateTo);
      return stats;
    } catch (error) {
      console.error('[Ad Campaign Service] Error getting slot statistics:', error);
      return null;
    }
  }

  async generatePerformanceReport(campaignId: string, dateRange: { start: Date; end: Date }): Promise<any> {
    try {
      const stats = await this.adCampaignRepo.getCampaignStatistics(campaignId, dateRange.start, dateRange.end);
      const metrics = calculatePerformanceMetrics(
        stats.impressions,
        stats.clicks,
        stats.conversions,
        stats.spend,
        stats.revenue
      );

      return generateAdPerformanceReport(campaignId, dateRange, metrics);
    } catch (error) {
      console.error('[Ad Campaign Service] Error generating performance report:', error);
      return null;
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }> {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Check if we have any active campaigns
      const activeCampaigns = await this.adCampaignRepo.getActiveAdCampaigns('default-tenant');

      return {
        status: 'healthy',
        message: 'Ad Campaign service is healthy',
        details: {
          activeCampaigns: activeCampaigns.length,
          databaseConnected: true
        }
      };
    } catch (error) {
      console.error('[Ad Campaign Service] Health check failed:', error);
      return {
        status: 'unhealthy',
        message: `Ad Campaign service health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  // Private helper methods

  private transformCampaign(campaign: any): any {
    return {
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      status: campaign.status,
      campaignType: campaign.campaignType,
      targetingType: campaign.targetingType,
      targetKeywords: campaign.targetKeywords,
      targetCategories: campaign.targetCategories,
      targetLocations: campaign.targetLocations,
      targetAudiences: campaign.targetAudiences,
      dailyBudget: campaign.dailyBudget,
      totalBudget: campaign.totalBudget,
      bidType: campaign.bidType,
      bidAmount: campaign.bidAmount,
      maxBidAmount: campaign.maxBidAmount,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      isActive: campaign.isActive,
      isPaused: campaign.isPaused,
      impressions: campaign.impressions,
      clicks: campaign.clicks,
      conversions: campaign.conversions,
      spend: campaign.spend,
      revenue: campaign.revenue,
      qualityScore: campaign.qualityScore,
      ctr: campaign.ctr,
      cpc: campaign.cpc,
      cpm: campaign.cpm,
      roas: campaign.roas,
      sellerId: campaign.sellerId,
      createdBy: campaign.createdBy,
      approvedBy: campaign.approvedBy,
      approvedAt: campaign.approvedAt,
      tags: campaign.tags,
      metadata: campaign.metadata,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
      adGroups: campaign.adGroups?.map((adGroup: any) => this.transformAdGroup(adGroup)) || [],
      budgets: campaign.budgets?.map((budget: any) => this.transformBudget(budget)) || []
    };
  }

  private transformAdGroup(adGroup: any): any {
    return {
      id: adGroup.id,
      name: adGroup.name,
      description: adGroup.description,
      status: adGroup.status,
      keywords: adGroup.keywords,
      negativeKeywords: adGroup.negativeKeywords,
      categories: adGroup.categories,
      locations: adGroup.locations,
      bidType: adGroup.bidType,
      bidAmount: adGroup.bidAmount,
      maxBidAmount: adGroup.maxBidAmount,
      impressions: adGroup.impressions,
      clicks: adGroup.clicks,
      conversions: adGroup.conversions,
      spend: adGroup.spend,
      qualityScore: adGroup.qualityScore,
      ctr: adGroup.ctr,
      cpc: adGroup.cpc,
      metadata: adGroup.metadata,
      createdAt: adGroup.createdAt,
      updatedAt: adGroup.updatedAt,
      ads: adGroup.ads?.map((ad: any) => this.transformAd(ad)) || []
    };
  }

  private transformAd(ad: any): any {
    return {
      id: ad.id,
      title: ad.title,
      description: ad.description,
      headline: ad.headline,
      callToAction: ad.callToAction,
      imageUrl: ad.imageUrl,
      videoUrl: ad.videoUrl,
      logoUrl: ad.logoUrl,
      landingPageUrl: ad.landingPageUrl,
      finalUrl: ad.finalUrl,
      status: ad.status,
      isActive: ad.isActive,
      priority: ad.priority,
      impressions: ad.impressions,
      clicks: ad.clicks,
      conversions: ad.conversions,
      spend: ad.spend,
      qualityScore: ad.qualityScore,
      ctr: ad.ctr,
      cpc: ad.cpc,
      relevanceScore: ad.relevanceScore,
      isApproved: ad.isApproved,
      approvedBy: ad.approvedBy,
      approvedAt: ad.approvedAt,
      rejectionReason: ad.rejectionReason,
      metadata: ad.metadata,
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt,
      product: ad.product,
      impressions: ad.impressions?.map((impression: any) => this.transformImpression(impression)) || [],
      clicks: ad.clicks?.map((click: any) => this.transformClick(click)) || []
    };
  }

  private transformBudget(budget: any): any {
    return {
      id: budget.id,
      budgetType: budget.budgetType,
      amount: budget.amount,
      currency: budget.currency,
      startDate: budget.startDate,
      endDate: budget.endDate,
      isRecurring: budget.isRecurring,
      recurringType: budget.recurringType,
      usedAmount: budget.usedAmount,
      remainingAmount: budget.remainingAmount,
      status: budget.status,
      isExhausted: budget.isExhausted,
      description: budget.description,
      metadata: budget.metadata,
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt
    };
  }

  private transformImpression(impression: any): any {
    return {
      id: impression.id,
      impressionType: impression.impressionType,
      slot: impression.slot,
      position: impression.position,
      userId: impression.userId,
      sessionId: impression.sessionId,
      deviceType: impression.deviceType,
      browser: impression.browser,
      os: impression.os,
      ipAddress: impression.ipAddress,
      country: impression.country,
      city: impression.city,
      region: impression.region,
      searchQuery: impression.searchQuery,
      searchCategory: impression.searchCategory,
      searchFilters: impression.searchFilters,
      productId: impression.productId,
      categoryId: impression.categoryId,
      sellerId: impression.sellerId,
      isVisible: impression.isVisible,
      viewTime: impression.viewTime,
      viewPercentage: impression.viewPercentage,
      metadata: impression.metadata,
      createdAt: impression.createdAt
    };
  }

  private transformClick(click: any): any {
    return {
      id: click.id,
      clickType: click.clickType,
      slot: click.slot,
      position: click.position,
      userId: click.userId,
      sessionId: click.sessionId,
      deviceType: click.deviceType,
      browser: click.browser,
      os: click.os,
      ipAddress: click.ipAddress,
      country: click.country,
      city: click.city,
      region: click.region,
      searchQuery: click.searchQuery,
      searchCategory: click.searchCategory,
      searchFilters: click.searchFilters,
      productId: click.productId,
      categoryId: click.categoryId,
      sellerId: click.sellerId,
      clickPosition: click.clickPosition,
      timeOnPage: click.timeOnPage,
      bounceRate: click.bounceRate,
      isConversion: click.isConversion,
      conversionValue: click.conversionValue,
      conversionType: click.conversionType,
      cost: click.cost,
      currency: click.currency,
      metadata: click.metadata,
      createdAt: click.createdAt
    };
  }

  private transformWallet(wallet: any): any {
    return {
      id: wallet.id,
      balance: wallet.balance,
      currency: wallet.currency,
      isActive: wallet.isActive,
      dailySpendLimit: wallet.dailySpendLimit,
      monthlySpendLimit: wallet.monthlySpendLimit,
      totalSpendLimit: wallet.totalSpendLimit,
      totalSpent: wallet.totalSpent,
      totalDeposited: wallet.totalDeposited,
      lastSpentAt: wallet.lastSpentAt,
      lastDepositedAt: wallet.lastDepositedAt,
      status: wallet.status,
      isSuspended: wallet.isSuspended,
      suspensionReason: wallet.suspensionReason,
      metadata: wallet.metadata,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
      transactions: wallet.transactions?.map((transaction: any) => this.transformTransaction(transaction)) || []
    };
  }

  private transformTransaction(transaction: any): any {
    return {
      id: transaction.id,
      type: transaction.type,
      amount: transaction.amount,
      currency: transaction.currency,
      balanceBefore: transaction.balanceBefore,
      balanceAfter: transaction.balanceAfter,
      description: transaction.description,
      reference: transaction.reference,
      campaignId: transaction.campaignId,
      adId: transaction.adId,
      paymentMethod: transaction.paymentMethod,
      paymentId: transaction.paymentId,
      paymentStatus: transaction.paymentStatus,
      status: transaction.status,
      processedAt: transaction.processedAt,
      failedAt: transaction.failedAt,
      failureReason: transaction.failureReason,
      metadata: transaction.metadata,
      createdAt: transaction.createdAt
    };
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}

