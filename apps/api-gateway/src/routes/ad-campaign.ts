/**
 * Ad Campaign Management API Routes
 * Handles campaign creation, bidding, slot allocation, and wallet management
 */

import { Router } from 'express';
import { z } from 'zod';
import { AdCampaignServiceImpl } from '@tdc/infra';

const router = Router();
const adCampaignService = new AdCampaignServiceImpl();

// Validation schemas
const CreateCampaignSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  campaignType: z.enum(['SEARCH', 'DISPLAY', 'SHOPPING', 'VIDEO', 'SOCIAL', 'RETARGETING', 'BRAND']),
  targetingType: z.enum(['KEYWORD', 'CATEGORY', 'PRODUCT', 'AUDIENCE', 'LOCATION', 'DEMOGRAPHIC', 'BEHAVIORAL', 'LOOKALIKE']).optional(),
  targetKeywords: z.array(z.string()).optional(),
  targetCategories: z.array(z.string()).optional(),
  targetLocations: z.array(z.string()).optional(),
  targetAudiences: z.array(z.string()).optional(),
  dailyBudget: z.number().positive(),
  totalBudget: z.number().positive().optional(),
  bidType: z.enum(['CPC', 'CPM', 'CPA', 'CPV', 'CPE', 'CPO']).optional(),
  bidAmount: z.number().positive(),
  maxBidAmount: z.number().positive().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  sellerId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.any().optional()
});

const CreateAdGroupSchema = z.object({
  campaignId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  negativeKeywords: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  bidType: z.enum(['CPC', 'CPM', 'CPA', 'CPV', 'CPE', 'CPO']),
  bidAmount: z.number().positive(),
  maxBidAmount: z.number().positive().optional(),
  metadata: z.any().optional()
});

const CreateAdSchema = z.object({
  campaignId: z.string().min(1),
  adGroupId: z.string().min(1),
  productId: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  headline: z.string().optional(),
  callToAction: z.string().optional(),
  imageUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  landingPageUrl: z.string().url(),
  finalUrl: z.string().url().optional(),
  priority: z.number().int().positive().optional(),
  metadata: z.any().optional()
});

const CreateBudgetSchema = z.object({
  campaignId: z.string().min(1),
  budgetType: z.enum(['DAILY', 'MONTHLY', 'TOTAL', 'LIFETIME']),
  amount: z.number().positive(),
  currency: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  isRecurring: z.boolean().optional(),
  recurringType: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
  description: z.string().optional(),
  metadata: z.any().optional()
});

const SlotAllocationSchema = z.object({
  slotType: z.enum(['SEARCH_TOP', 'SEARCH_SIDE', 'SEARCH_BOTTOM', 'CATEGORY_TOP', 'CATEGORY_SIDE', 'PRODUCT_TOP', 'PRODUCT_SIDE', 'HOME_BANNER', 'HOME_SIDEBAR', 'CHECKOUT_TOP', 'CART_SIDEBAR']),
  position: z.number().int().positive(),
  searchQuery: z.string().optional(),
  searchCategory: z.string().optional(),
  productId: z.string().optional(),
  categoryId: z.string().optional(),
  sellerId: z.string().optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  deviceType: z.string().optional(),
  location: z.object({
    country: z.string(),
    city: z.string(),
    region: z.string()
  }).optional(),
  metadata: z.any().optional()
});

const WalletDepositSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: z.string().min(1),
  reference: z.string().optional()
});

const WalletWithdrawalSchema = z.object({
  amount: z.number().positive(),
  description: z.string().optional()
});

// Campaign Management

/**
 * POST /api/ad-campaign/campaigns
 * Create a new ad campaign
 */
router.post('/campaigns', async (req, res) => {
  try {
    const validatedData = CreateCampaignSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await adCampaignService.createCampaign({
      ...validatedData,
      tenantId: tenantId as string,
      startDate: new Date(validatedData.startDate),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.campaign,
      message: result.success ? 'Campaign created successfully' : 'Failed to create campaign',
      error: result.error
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create campaign',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/ad-campaign/campaigns
 * Get campaigns with filters
 */
router.get('/campaigns', async (req, res) => {
  try {
    const { 
      tenantId, 
      sellerId, 
      status, 
      campaignType, 
      targetingType, 
      dateFrom, 
      dateTo, 
      page = '1', 
      limit = '50' 
    } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await adCampaignService.searchCampaigns({
      tenantId: tenantId as string,
      sellerId: sellerId as string,
      status: status as any,
      campaignType: campaignType as any,
      targetingType: targetingType as any,
      dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo: dateTo ? new Date(dateTo as string) : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.json({
      success: true,
      data: result,
      message: `Found ${result.campaigns.length} campaigns`
    });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get campaigns'
    });
  }
});

/**
 * GET /api/ad-campaign/campaigns/:id
 * Get specific campaign
 */
router.get('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await adCampaignService.getCampaign(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    res.json({
      success: true,
      data: campaign,
      message: 'Campaign found'
    });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get campaign'
    });
  }
});

/**
 * PUT /api/ad-campaign/campaigns/:id
 * Update campaign
 */
router.put('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = CreateCampaignSchema.partial().parse(req.body);

    const result = await adCampaignService.updateCampaign(id, validatedData);

    res.json({
      success: result.success,
      data: result.campaign,
      message: result.success ? 'Campaign updated successfully' : 'Failed to update campaign',
      error: result.error
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update campaign',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * DELETE /api/ad-campaign/campaigns/:id
 * Delete campaign
 */
router.delete('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await adCampaignService.deleteCampaign(id);

    res.json({
      success: result.success,
      message: result.success ? 'Campaign deleted successfully' : 'Failed to delete campaign'
    });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete campaign'
    });
  }
});

// Ad Group Management

/**
 * POST /api/ad-campaign/ad-groups
 * Create a new ad group
 */
router.post('/ad-groups', async (req, res) => {
  try {
    const validatedData = CreateAdGroupSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await adCampaignService.createAdGroup({
      ...validatedData,
      tenantId: tenantId as string
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.adGroup,
      message: result.success ? 'Ad group created successfully' : 'Failed to create ad group',
      error: result.error
    });
  } catch (error) {
    console.error('Create ad group error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create ad group',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/ad-campaign/campaigns/:campaignId/ad-groups
 * Get ad groups for campaign
 */
router.get('/campaigns/:campaignId/ad-groups', async (req, res) => {
  try {
    const { campaignId } = req.params;

    const adGroups = await adCampaignService.getAdGroupsByCampaign(campaignId);

    res.json({
      success: true,
      data: adGroups,
      message: `Found ${adGroups.length} ad groups`
    });
  } catch (error) {
    console.error('Get ad groups error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get ad groups'
    });
  }
});

// Ad Management

/**
 * POST /api/ad-campaign/ads
 * Create a new ad
 */
router.post('/ads', async (req, res) => {
  try {
    const validatedData = CreateAdSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await adCampaignService.createAd({
      ...validatedData,
      tenantId: tenantId as string
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.ad,
      message: result.success ? 'Ad created successfully' : 'Failed to create ad',
      error: result.error
    });
  } catch (error) {
    console.error('Create ad error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create ad',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/ad-campaign/campaigns/:campaignId/ads
 * Get ads for campaign
 */
router.get('/campaigns/:campaignId/ads', async (req, res) => {
  try {
    const { campaignId } = req.params;

    const ads = await adCampaignService.getAdsByCampaign(campaignId);

    res.json({
      success: true,
      data: ads,
      message: `Found ${ads.length} ads`
    });
  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get ads'
    });
  }
});

/**
 * POST /api/ad-campaign/ads/:id/approve
 * Approve ad
 */
router.post('/ads/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { approvedBy } = req.body;

    if (!approvedBy) {
      return res.status(400).json({
        success: false,
        error: 'approvedBy is required'
      });
    }

    const result = await adCampaignService.approveAd(id, approvedBy);

    res.json({
      success: result.success,
      message: result.success ? 'Ad approved successfully' : 'Failed to approve ad',
      error: result.error
    });
  } catch (error) {
    console.error('Approve ad error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to approve ad'
    });
  }
});

/**
 * POST /api/ad-campaign/ads/:id/reject
 * Reject ad
 */
router.post('/ads/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, rejectedBy } = req.body;

    if (!reason || !rejectedBy) {
      return res.status(400).json({
        success: false,
        error: 'reason and rejectedBy are required'
      });
    }

    const result = await adCampaignService.rejectAd(id, reason, rejectedBy);

    res.json({
      success: result.success,
      message: result.success ? 'Ad rejected successfully' : 'Failed to reject ad',
      error: result.error
    });
  } catch (error) {
    console.error('Reject ad error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reject ad'
    });
  }
});

// Slot Allocation and Bidding

/**
 * POST /api/ad-campaign/slots/allocate
 * Allocate ads to a slot
 */
router.post('/slots/allocate', async (req, res) => {
  try {
    const validatedData = SlotAllocationSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await adCampaignService.allocateSlot(
      validatedData.slotType,
      validatedData.position,
      {
        campaignId: '', // Will be determined during allocation
        adId: '', // Will be determined during allocation
        slotType: validatedData.slotType as any,
        position: validatedData.position,
        searchQuery: validatedData.searchQuery,
        searchCategory: validatedData.searchCategory,
        productId: validatedData.productId,
        categoryId: validatedData.categoryId,
        sellerId: validatedData.sellerId,
        userId: validatedData.userId,
        sessionId: validatedData.sessionId,
        deviceType: validatedData.deviceType,
        location: validatedData.location,
        metadata: validatedData.metadata
      }
    );

    res.json({
      success: true,
      data: result,
      message: 'Slot allocated successfully'
    });
  } catch (error) {
    console.error('Allocate slot error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to allocate slot',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * POST /api/ad-campaign/slots/auction
 * Run auction for a slot
 */
router.post('/slots/auction', async (req, res) => {
  try {
    const validatedData = SlotAllocationSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await adCampaignService.runAuction(
      validatedData.slotType,
      validatedData.position,
      {
        campaignId: '',
        adId: '',
        slotType: validatedData.slotType as any,
        position: validatedData.position,
        searchQuery: validatedData.searchQuery,
        searchCategory: validatedData.searchCategory,
        productId: validatedData.productId,
        categoryId: validatedData.categoryId,
        sellerId: validatedData.sellerId,
        userId: validatedData.userId,
        sessionId: validatedData.sessionId,
        deviceType: validatedData.deviceType,
        location: validatedData.location,
        metadata: validatedData.metadata
      }
    );

    res.json({
      success: true,
      data: result,
      message: 'Auction completed successfully'
    });
  } catch (error) {
    console.error('Run auction error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to run auction',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

// Impression and Click Tracking

/**
 * POST /api/ad-campaign/impressions
 * Record ad impression
 */
router.post('/impressions', async (req, res) => {
  try {
    const { 
      campaignId, 
      adId, 
      impressionType, 
      slot, 
      position, 
      userId, 
      sessionId, 
      deviceType, 
      browser, 
      os, 
      ipAddress, 
      country, 
      city, 
      region, 
      searchQuery, 
      searchCategory, 
      searchFilters, 
      productId, 
      categoryId, 
      sellerId, 
      isVisible, 
      viewTime, 
      viewPercentage, 
      metadata 
    } = req.body;

    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await adCampaignService.recordImpression({
      tenantId: tenantId as string,
      campaignId,
      adId,
      impressionType,
      slot,
      position,
      userId,
      sessionId,
      deviceType,
      browser,
      os,
      ipAddress,
      country,
      city,
      region,
      searchQuery,
      searchCategory,
      searchFilters,
      productId,
      categoryId,
      sellerId,
      isVisible,
      viewTime,
      viewPercentage,
      metadata
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.impression,
      message: result.success ? 'Impression recorded successfully' : 'Failed to record impression',
      error: result.error
    });
  } catch (error) {
    console.error('Record impression error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record impression'
    });
  }
});

/**
 * POST /api/ad-campaign/clicks
 * Record ad click
 */
router.post('/clicks', async (req, res) => {
  try {
    const { 
      campaignId, 
      adId, 
      impressionId, 
      clickType, 
      slot, 
      position, 
      userId, 
      sessionId, 
      deviceType, 
      browser, 
      os, 
      ipAddress, 
      country, 
      city, 
      region, 
      searchQuery, 
      searchCategory, 
      searchFilters, 
      productId, 
      categoryId, 
      sellerId, 
      clickPosition, 
      timeOnPage, 
      bounceRate, 
      isConversion, 
      conversionValue, 
      conversionType, 
      cost, 
      currency, 
      metadata 
    } = req.body;

    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await adCampaignService.recordClick({
      tenantId: tenantId as string,
      campaignId,
      adId,
      impressionId,
      clickType,
      slot,
      position,
      userId,
      sessionId,
      deviceType,
      browser,
      os,
      ipAddress,
      country,
      city,
      region,
      searchQuery,
      searchCategory,
      searchFilters,
      productId,
      categoryId,
      sellerId,
      clickPosition,
      timeOnPage,
      bounceRate,
      isConversion,
      conversionValue,
      conversionType,
      cost,
      currency,
      metadata
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.click,
      message: result.success ? 'Click recorded successfully' : 'Failed to record click',
      error: result.error
    });
  } catch (error) {
    console.error('Record click error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record click'
    });
  }
});

// Wallet Management

/**
 * GET /api/ad-campaign/wallets/seller/:sellerId
 * Get seller wallet
 */
router.get('/wallets/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const wallet = await adCampaignService.getSellerWallet(sellerId, tenantId as string);

    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'Wallet not found'
      });
    }

    res.json({
      success: true,
      data: wallet,
      message: 'Wallet found'
    });
  } catch (error) {
    console.error('Get seller wallet error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get seller wallet'
    });
  }
});

/**
 * POST /api/ad-campaign/wallets/seller/:sellerId
 * Create seller wallet
 */
router.post('/wallets/seller/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { tenantId, initialBalance = 0 } = req.body;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await adCampaignService.createSellerWallet(sellerId, tenantId, initialBalance);

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.wallet,
      message: result.success ? 'Wallet created successfully' : 'Failed to create wallet',
      error: result.error
    });
  } catch (error) {
    console.error('Create seller wallet error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create wallet'
    });
  }
});

/**
 * POST /api/ad-campaign/wallets/:walletId/deposit
 * Deposit to wallet
 */
router.post('/wallets/:walletId/deposit', async (req, res) => {
  try {
    const { walletId } = req.params;
    const validatedData = WalletDepositSchema.parse(req.body);

    const result = await adCampaignService.depositToWallet(
      walletId,
      validatedData.amount,
      validatedData.paymentMethod,
      validatedData.reference
    );

    res.json({
      success: result.success,
      data: result.transaction,
      message: result.success ? 'Deposit successful' : 'Failed to deposit',
      error: result.error
    });
  } catch (error) {
    console.error('Deposit to wallet error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to deposit',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * POST /api/ad-campaign/wallets/:walletId/withdraw
 * Withdraw from wallet
 */
router.post('/wallets/:walletId/withdraw', async (req, res) => {
  try {
    const { walletId } = req.params;
    const validatedData = WalletWithdrawalSchema.parse(req.body);

    const result = await adCampaignService.withdrawFromWallet(
      walletId,
      validatedData.amount,
      validatedData.description
    );

    res.json({
      success: result.success,
      data: result.transaction,
      message: result.success ? 'Withdrawal successful' : 'Failed to withdraw',
      error: result.error
    });
  } catch (error) {
    console.error('Withdraw from wallet error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to withdraw',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

// Budget Management

/**
 * POST /api/ad-campaign/budgets
 * Create ad budget
 */
router.post('/budgets', async (req, res) => {
  try {
    const validatedData = CreateBudgetSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await adCampaignService.createBudget({
      ...validatedData,
      tenantId: tenantId as string,
      startDate: new Date(validatedData.startDate),
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.budget,
      message: result.success ? 'Budget created successfully' : 'Failed to create budget',
      error: result.error
    });
  } catch (error) {
    console.error('Create budget error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create budget',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

// Statistics and Reporting

/**
 * GET /api/ad-campaign/campaigns/:id/statistics
 * Get campaign statistics
 */
router.get('/campaigns/:id/statistics', async (req, res) => {
  try {
    const { id } = req.params;
    const { dateFrom, dateTo } = req.query;

    const statistics = await adCampaignService.getCampaignStatistics(
      id,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );

    res.json({
      success: true,
      data: statistics,
      message: 'Campaign statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Get campaign statistics error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get campaign statistics'
    });
  }
});

/**
 * GET /api/ad-campaign/slots/:slotType/statistics
 * Get slot statistics
 */
router.get('/slots/:slotType/statistics', async (req, res) => {
  try {
    const { slotType } = req.params;
    const { tenantId, dateFrom, dateTo } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const statistics = await adCampaignService.getSlotStatistics(
      slotType,
      tenantId as string,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );

    res.json({
      success: true,
      data: statistics,
      message: 'Slot statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Get slot statistics error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get slot statistics'
    });
  }
});

/**
 * GET /api/ad-campaign/campaigns/:id/reports
 * Generate performance report
 */
router.get('/campaigns/:id/reports', async (req, res) => {
  try {
    const { id } = req.params;
    const { dateFrom, dateTo } = req.query;

    if (!dateFrom || !dateTo) {
      return res.status(400).json({
        success: false,
        error: 'dateFrom and dateTo are required'
      });
    }

    const report = await adCampaignService.generatePerformanceReport(id, {
      start: new Date(dateFrom as string),
      end: new Date(dateTo as string)
    });

    res.json({
      success: true,
      data: report,
      message: 'Performance report generated successfully'
    });
  } catch (error) {
    console.error('Generate performance report error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate performance report'
    });
  }
});

// System endpoints

/**
 * GET /api/ad-campaign/health
 * Health check for ad campaign service
 */
router.get('/health', async (req, res) => {
  try {
    const health = await adCampaignService.healthCheck();

    res.status(health.status === 'healthy' ? 200 : 503).json({
      success: health.status === 'healthy',
      data: health,
      message: health.message
    });
  } catch (error) {
    console.error('Ad campaign service health check error:', error);
    res.status(503).json({
      success: false,
      error: error instanceof Error ? error.message : 'Health check failed'
    });
  }
});

export { router as adCampaignRouter };

