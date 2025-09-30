import { PrismaClient } from '../prisma-client.js';
import { 
  AdCampaign, 
  AdGroup, 
  Ad, 
  AdBudget, 
  AdImpression, 
  AdClick,
  SellerWallet,
  WalletTransaction,
  PromotedListingSlot,
  AdCampaignStatus,
  AdCampaignType,
  AdTargetingType,
  AdBidType,
  AdGroupStatus,
  AdStatus,
  AdBudgetType,
  AdRecurringType,
  AdBudgetStatus,
  AdImpressionType,
  AdClickType,
  AdSlotType,
  WalletStatus,
  WalletTransactionType,
  TransactionStatus
} from '@prisma/client';

export interface CreateAdCampaignInput {
  tenantId: string;
  name: string;
  description?: string;
  campaignType: AdCampaignType;
  targetingType?: AdTargetingType;
  targetKeywords?: string[];
  targetCategories?: string[];
  targetLocations?: string[];
  targetAudiences?: string[];
  dailyBudget: number;
  totalBudget?: number;
  bidType?: AdBidType;
  bidAmount: number;
  maxBidAmount?: number;
  startDate: Date;
  endDate?: Date;
  sellerId?: string;
  createdBy?: string;
  tags?: string[];
  metadata?: any;
}

export interface CreateAdGroupInput {
  tenantId: string;
  campaignId: string;
  name: string;
  description?: string;
  keywords?: string[];
  negativeKeywords?: string[];
  categories?: string[];
  locations?: string[];
  bidType: AdBidType;
  bidAmount: number;
  maxBidAmount?: number;
  metadata?: any;
}

export interface CreateAdInput {
  tenantId: string;
  campaignId: string;
  adGroupId: string;
  productId?: string;
  title: string;
  description?: string;
  headline?: string;
  callToAction?: string;
  imageUrl?: string;
  videoUrl?: string;
  logoUrl?: string;
  landingPageUrl: string;
  finalUrl?: string;
  priority?: number;
  metadata?: any;
}

export interface CreateAdBudgetInput {
  tenantId: string;
  campaignId: string;
  budgetType: AdBudgetType;
  amount: number;
  currency?: string;
  startDate: Date;
  endDate?: Date;
  isRecurring?: boolean;
  recurringType?: AdRecurringType;
  description?: string;
  metadata?: any;
}

export interface CreateAdImpressionInput {
  tenantId: string;
  campaignId: string;
  adId: string;
  impressionType: AdImpressionType;
  slot: AdSlotType;
  position: number;
  userId?: string;
  sessionId?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  region?: string;
  searchQuery?: string;
  searchCategory?: string;
  searchFilters?: any;
  productId?: string;
  categoryId?: string;
  sellerId?: string;
  isVisible?: boolean;
  viewTime?: number;
  viewPercentage?: number;
  metadata?: any;
}

export interface CreateAdClickInput {
  tenantId: string;
  campaignId: string;
  adId: string;
  impressionId?: string;
  clickType: AdClickType;
  slot: AdSlotType;
  position: number;
  userId?: string;
  sessionId?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  region?: string;
  searchQuery?: string;
  searchCategory?: string;
  searchFilters?: any;
  productId?: string;
  categoryId?: string;
  sellerId?: string;
  clickPosition?: any;
  timeOnPage?: number;
  bounceRate?: boolean;
  isConversion?: boolean;
  conversionValue?: number;
  conversionType?: string;
  cost: number;
  currency?: string;
  metadata?: any;
}

export interface CreateWalletTransactionInput {
  tenantId: string;
  walletId: string;
  sellerId: string;
  type: WalletTransactionType;
  amount: number;
  currency?: string;
  description?: string;
  reference?: string;
  campaignId?: string;
  adId?: string;
  paymentMethod?: string;
  paymentId?: string;
  paymentStatus?: string;
  metadata?: any;
}

export interface AdCampaignSearchParams {
  tenantId: string;
  sellerId?: string;
  status?: AdCampaignStatus;
  campaignType?: AdCampaignType;
  targetingType?: AdTargetingType;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export class AdCampaignRepository {
  constructor(private prisma: PrismaClient) {}

  // Ad Campaign methods
  async createAdCampaign(input: CreateAdCampaignInput): Promise<AdCampaign> {
    return this.prisma.adCampaign.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        description: input.description,
        campaignType: input.campaignType,
        targetingType: input.targetingType || 'KEYWORD',
        targetKeywords: input.targetKeywords || [],
        targetCategories: input.targetCategories || [],
        targetLocations: input.targetLocations || [],
        targetAudiences: input.targetAudiences || [],
        dailyBudget: input.dailyBudget,
        totalBudget: input.totalBudget,
        bidType: input.bidType || 'CPC',
        bidAmount: input.bidAmount,
        maxBidAmount: input.maxBidAmount,
        startDate: input.startDate,
        endDate: input.endDate,
        sellerId: input.sellerId,
        createdBy: input.createdBy,
        tags: input.tags || [],
        metadata: input.metadata
      }
    });
  }

  async updateAdCampaign(id: string, input: Partial<CreateAdCampaignInput>): Promise<AdCampaign> {
    return this.prisma.adCampaign.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date()
      }
    });
  }

  async getAdCampaignById(id: string): Promise<AdCampaign | null> {
    return this.prisma.adCampaign.findUnique({
      where: { id },
      include: {
        adGroups: {
          include: {
            ads: true
          }
        },
        budgets: true,
        impressions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        clicks: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
  }

  async searchAdCampaigns(params: AdCampaignSearchParams): Promise<{
    campaigns: AdCampaign[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const {
      tenantId,
      sellerId,
      status,
      campaignType,
      targetingType,
      dateFrom,
      dateTo,
      page = 1,
      limit = 50
    } = params;

    const where: any = {
      tenantId,
      ...(sellerId && { sellerId }),
      ...(status && { status }),
      ...(campaignType && { campaignType }),
      ...(targetingType && { targetingType }),
      ...(dateFrom && dateTo && {
        startDate: { gte: dateFrom },
        endDate: { lte: dateTo }
      })
    };

    const skip = (page - 1) * limit;

    const [campaigns, total] = await Promise.all([
      this.prisma.adCampaign.findMany({
        where,
        include: {
          adGroups: {
            include: {
              ads: true
            }
          },
          budgets: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.adCampaign.count({ where })
    ]);

    return {
      campaigns,
      total,
      page,
      limit,
      hasMore: (page * limit) < total
    };
  }

  async getActiveAdCampaigns(tenantId: string): Promise<AdCampaign[]> {
    return this.prisma.adCampaign.findMany({
      where: {
        tenantId,
        status: 'ACTIVE',
        isActive: true,
        isPaused: false
      },
      include: {
        adGroups: {
          where: { status: 'ACTIVE' },
          include: {
            ads: {
              where: { 
                status: 'ACTIVE',
                isActive: true,
                isApproved: true
              }
            }
          }
        }
      },
      orderBy: { priority: 'desc' }
    });
  }

  // Ad Group methods
  async createAdGroup(input: CreateAdGroupInput): Promise<AdGroup> {
    return this.prisma.adGroup.create({
      data: {
        tenantId: input.tenantId,
        campaignId: input.campaignId,
        name: input.name,
        description: input.description,
        keywords: input.keywords || [],
        negativeKeywords: input.negativeKeywords || [],
        categories: input.categories || [],
        locations: input.locations || [],
        bidType: input.bidType,
        bidAmount: input.bidAmount,
        maxBidAmount: input.maxBidAmount,
        metadata: input.metadata
      }
    });
  }

  async getAdGroupsByCampaign(campaignId: string): Promise<AdGroup[]> {
    return this.prisma.adGroup.findMany({
      where: { campaignId },
      include: {
        ads: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Ad methods
  async createAd(input: CreateAdInput): Promise<Ad> {
    return this.prisma.ad.create({
      data: {
        tenantId: input.tenantId,
        campaignId: input.campaignId,
        adGroupId: input.adGroupId,
        productId: input.productId,
        title: input.title,
        description: input.description,
        headline: input.headline,
        callToAction: input.callToAction,
        imageUrl: input.imageUrl,
        videoUrl: input.videoUrl,
        logoUrl: input.logoUrl,
        landingPageUrl: input.landingPageUrl,
        finalUrl: input.finalUrl,
        priority: input.priority || 1,
        metadata: input.metadata
      }
    });
  }

  async getAdsByCampaign(campaignId: string): Promise<Ad[]> {
    return this.prisma.ad.findMany({
      where: { campaignId },
      include: {
        product: true,
        impressions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        clicks: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getEligibleAdsForSlot(
    slotType: AdSlotType,
    position: number,
    context: {
      searchQuery?: string;
      searchCategory?: string;
      productId?: string;
      categoryId?: string;
      sellerId?: string;
    }
  ): Promise<Ad[]> {
    const where: any = {
      status: 'ACTIVE',
      isActive: true,
      isApproved: true
    };

    // Add targeting filters based on context
    if (context.searchQuery) {
      where.OR = [
        { title: { contains: context.searchQuery, mode: 'insensitive' } },
        { description: { contains: context.searchQuery, mode: 'insensitive' } }
      ];
    }

    if (context.categoryId) {
      where.campaign = {
        targetCategories: { has: context.categoryId }
      };
    }

    if (context.sellerId) {
      where.campaign = {
        sellerId: context.sellerId
      };
    }

    return this.prisma.ad.findMany({
      where,
      include: {
        campaign: true,
        adGroup: true,
        product: true
      },
      orderBy: { priority: 'desc' }
    });
  }

  // Ad Budget methods
  async createAdBudget(input: CreateAdBudgetInput): Promise<AdBudget> {
    return this.prisma.adBudget.create({
      data: {
        tenantId: input.tenantId,
        campaignId: input.campaignId,
        budgetType: input.budgetType,
        amount: input.amount,
        currency: input.currency || 'TRY',
        startDate: input.startDate,
        endDate: input.endDate,
        isRecurring: input.isRecurring || false,
        recurringType: input.recurringType,
        remainingAmount: input.amount,
        description: input.description,
        metadata: input.metadata
      }
    });
  }

  async getBudgetsByCampaign(campaignId: string): Promise<AdBudget[]> {
    return this.prisma.adBudget.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateBudgetUsage(budgetId: string, amount: number): Promise<AdBudget> {
    return this.prisma.adBudget.update({
      where: { id: budgetId },
      data: {
        usedAmount: { increment: amount },
        remainingAmount: { decrement: amount },
        isExhausted: { equals: 0 } // Will be true if remainingAmount becomes 0
      }
    });
  }

  // Ad Impression methods
  async createAdImpression(input: CreateAdImpressionInput): Promise<AdImpression> {
    return this.prisma.adImpression.create({
      data: {
        tenantId: input.tenantId,
        campaignId: input.campaignId,
        adId: input.adId,
        impressionType: input.impressionType,
        slot: input.slot,
        position: input.position,
        userId: input.userId,
        sessionId: input.sessionId,
        deviceType: input.deviceType,
        browser: input.browser,
        os: input.os,
        ipAddress: input.ipAddress,
        country: input.country,
        city: input.city,
        region: input.region,
        searchQuery: input.searchQuery,
        searchCategory: input.searchCategory,
        searchFilters: input.searchFilters,
        productId: input.productId,
        categoryId: input.categoryId,
        sellerId: input.sellerId,
        isVisible: input.isVisible,
        viewTime: input.viewTime,
        viewPercentage: input.viewPercentage,
        metadata: input.metadata
      }
    });
  }

  async getImpressionsByCampaign(campaignId: string, dateFrom?: Date, dateTo?: Date): Promise<AdImpression[]> {
    const where: any = { campaignId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    return this.prisma.adImpression.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  // Ad Click methods
  async createAdClick(input: CreateAdClickInput): Promise<AdClick> {
    return this.prisma.adClick.create({
      data: {
        tenantId: input.tenantId,
        campaignId: input.campaignId,
        adId: input.adId,
        impressionId: input.impressionId,
        clickType: input.clickType,
        slot: input.slot,
        position: input.position,
        userId: input.userId,
        sessionId: input.sessionId,
        deviceType: input.deviceType,
        browser: input.browser,
        os: input.os,
        ipAddress: input.ipAddress,
        country: input.country,
        city: input.city,
        region: input.region,
        searchQuery: input.searchQuery,
        searchCategory: input.searchCategory,
        searchFilters: input.searchFilters,
        productId: input.productId,
        categoryId: input.categoryId,
        sellerId: input.sellerId,
        clickPosition: input.clickPosition,
        timeOnPage: input.timeOnPage,
        bounceRate: input.bounceRate,
        isConversion: input.isConversion,
        conversionValue: input.conversionValue,
        conversionType: input.conversionType,
        cost: input.cost,
        currency: input.currency || 'TRY',
        metadata: input.metadata
      }
    });
  }

  async getClicksByCampaign(campaignId: string, dateFrom?: Date, dateTo?: Date): Promise<AdClick[]> {
    const where: any = { campaignId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    return this.prisma.adClick.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  // Seller Wallet methods
  async getSellerWallet(sellerId: string, tenantId: string): Promise<SellerWallet | null> {
    return this.prisma.sellerWallet.findFirst({
      where: {
        sellerId,
        tenantId
      },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });
  }

  async createSellerWallet(
    sellerId: string, 
    tenantId: string, 
    initialBalance: number = 0
  ): Promise<SellerWallet> {
    return this.prisma.sellerWallet.create({
      data: {
        sellerId,
        tenantId,
        balance: initialBalance,
        totalDeposited: initialBalance
      }
    });
  }

  async updateWalletBalance(
    walletId: string, 
    newBalance: number, 
    totalSpent: number, 
    totalDeposited: number
  ): Promise<SellerWallet> {
    return this.prisma.sellerWallet.update({
      where: { id: walletId },
      data: {
        balance: newBalance,
        totalSpent,
        totalDeposited,
        lastSpentAt: new Date(),
        lastDepositedAt: new Date()
      }
    });
  }

  // Wallet Transaction methods
  async createWalletTransaction(input: CreateWalletTransactionInput): Promise<WalletTransaction> {
    // Get current wallet balance
    const wallet = await this.prisma.sellerWallet.findUnique({
      where: { id: input.walletId }
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const balanceBefore = wallet.balance;
    const balanceAfter = calculateNewBalance(balanceBefore, input.type, input.amount);

    return this.prisma.walletTransaction.create({
      data: {
        tenantId: input.tenantId,
        walletId: input.walletId,
        sellerId: input.sellerId,
        type: input.type,
        amount: input.amount,
        currency: input.currency || 'TRY',
        balanceBefore,
        balanceAfter,
        description: input.description,
        reference: input.reference,
        campaignId: input.campaignId,
        adId: input.adId,
        paymentMethod: input.paymentMethod,
        paymentId: input.paymentId,
        paymentStatus: input.paymentStatus,
        metadata: input.metadata
      }
    });
  }

  async getWalletTransactions(
    walletId: string, 
    dateFrom?: Date, 
    dateTo?: Date
  ): Promise<WalletTransaction[]> {
    const where: any = { walletId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    return this.prisma.walletTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  // Promoted Listing Slot methods
  async getPromotedListingSlots(tenantId: string): Promise<PromotedListingSlot[]> {
    return this.prisma.promotedListingSlot.findMany({
      where: {
        tenantId,
        isActive: true
      },
      orderBy: { position: 'asc' }
    });
  }

  async getSlotByType(slotType: AdSlotType, tenantId: string): Promise<PromotedListingSlot | null> {
    return this.prisma.promotedListingSlot.findFirst({
      where: {
        slotType,
        tenantId,
        isActive: true
      }
    });
  }

  // Statistics methods
  async getCampaignStatistics(
    campaignId: string, 
    dateFrom?: Date, 
    dateTo?: Date
  ): Promise<{
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
    ctr: number;
    cpc: number;
    cpm: number;
    cpa: number;
    roas: number;
  }> {
    const where: any = { campaignId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    const [impressions, clicks, conversions, spend, revenue] = await Promise.all([
      this.prisma.adImpression.count({ where }),
      this.prisma.adClick.count({ where }),
      this.prisma.adClick.count({ where: { ...where, isConversion: true } }),
      this.prisma.adClick.aggregate({
        where,
        _sum: { cost: true }
      }),
      this.prisma.adClick.aggregate({
        where: { ...where, isConversion: true },
        _sum: { conversionValue: true }
      })
    ]);

    const totalSpend = spend._sum.cost || 0;
    const totalRevenue = revenue._sum.conversionValue || 0;

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? totalSpend / clicks : 0;
    const cpm = impressions > 0 ? (totalSpend / impressions) * 1000 : 0;
    const cpa = conversions > 0 ? totalSpend / conversions : 0;
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    return {
      impressions,
      clicks,
      conversions,
      spend: totalSpend,
      revenue: totalRevenue,
      ctr,
      cpc,
      cpm,
      cpa,
      roas
    };
  }

  async getSlotStatistics(
    slotType: AdSlotType, 
    tenantId: string, 
    dateFrom?: Date, 
    dateTo?: Date
  ): Promise<{
    totalImpressions: number;
    totalClicks: number;
    totalRevenue: number;
    averageCtr: number;
    averageCpc: number;
  }> {
    const where: any = { 
      slot: slotType,
      tenantId
    };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    const [impressions, clicks, revenue] = await Promise.all([
      this.prisma.adImpression.count({ where }),
      this.prisma.adClick.count({ where }),
      this.prisma.adClick.aggregate({
        where,
        _sum: { cost: true }
      })
    ]);

    const totalRevenue = revenue._sum.cost || 0;
    const averageCtr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const averageCpc = clicks > 0 ? totalRevenue / clicks : 0;

    return {
      totalImpressions: impressions,
      totalClicks: clicks,
      totalRevenue,
      averageCtr,
      averageCpc
    };
  }

  // Utility methods
  async incrementCampaignMetrics(
    campaignId: string, 
    impressions: number = 0, 
    clicks: number = 0, 
    conversions: number = 0, 
    spend: number = 0
  ): Promise<void> {
    await this.prisma.adCampaign.update({
      where: { id: campaignId },
      data: {
        impressions: { increment: impressions },
        clicks: { increment: clicks },
        conversions: { increment: conversions },
        spend: { increment: spend }
      }
    });
  }

  async updateAdMetrics(
    adId: string, 
    impressions: number = 0, 
    clicks: number = 0, 
    conversions: number = 0, 
    spend: number = 0
  ): Promise<void> {
    await this.prisma.ad.update({
      where: { id: adId },
      data: {
        impressions: { increment: impressions },
        clicks: { increment: clicks },
        conversions: { increment: conversions },
        spend: { increment: spend }
      }
    });
  }
}

// Helper function to calculate new balance
function calculateNewBalance(
  currentBalance: number, 
  transactionType: WalletTransactionType, 
  amount: number
): number {
  switch (transactionType) {
    case 'DEPOSIT':
    case 'REFUND':
    case 'BONUS':
      return currentBalance + amount;
    case 'WITHDRAWAL':
    case 'SPEND':
    case 'PENALTY':
      return Math.max(0, currentBalance - amount);
    default:
      return currentBalance;
  }
}

