/**
 * CRM Management API Routes
 * Handles customer segmentation, campaigns, and communication
 */

import { Router } from 'express';
import { z } from 'zod';
import { CrmServiceImpl } from '@tdc/infra';

const router = Router();
const crmService = new CrmServiceImpl();

// Validation schemas
const CreateSegmentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  segmentType: z.enum(['MANUAL', 'DYNAMIC', 'BEHAVIORAL', 'DEMOGRAPHIC', 'GEOGRAPHIC', 'PURCHASE', 'ENGAGEMENT']),
  criteria: z.any(),
  filters: z.any().optional(),
  isDynamic: z.boolean().optional(),
  updateFrequency: z.enum(['REAL_TIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY']).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.any().optional()
});

const CreateCampaignSchema = z.object({
  segmentId: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  campaignType: z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'COUPON', 'PROMOTIONAL', 'TRANSACTIONAL', 'WELCOME', 'ABANDONED_CART', 'BIRTHDAY', 'ANNIVERSARY']),
  messageType: z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'COUPON', 'PROMOTIONAL', 'TRANSACTIONAL']),
  deliveryMethod: z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'IN_APP']),
  targetSegments: z.array(z.string()).optional(),
  targetCustomers: z.array(z.string()).optional(),
  subject: z.string().optional(),
  content: z.string().min(1),
  templateId: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  batchSize: z.number().int().positive().optional(),
  delayBetweenBatches: z.number().int().positive().optional(),
  couponId: z.string().optional(),
  couponCode: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isScheduled: z.boolean().optional(),
  scheduledAt: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.any().optional()
});

const CreateTemplateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  templateType: z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'COUPON', 'WELCOME', 'ABANDONED_CART', 'BIRTHDAY', 'ANNIVERSARY']),
  messageType: z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'COUPON', 'PROMOTIONAL', 'TRANSACTIONAL']),
  deliveryMethod: z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH', 'IN_APP']),
  subject: z.string().optional(),
  content: z.string().min(1),
  variables: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.any().optional()
});

const CreateProviderSchema = z.object({
  name: z.string().min(1),
  providerType: z.enum(['EMAIL', 'SMS', 'WHATSAPP', 'PUSH']),
  config: z.any(),
  credentials: z.any(),
  dailyLimit: z.number().int().positive().optional(),
  monthlyLimit: z.number().int().positive().optional(),
  rateLimit: z.number().int().positive().optional(),
  description: z.string().optional(),
  metadata: z.any().optional()
});

// Segment Management

/**
 * POST /api/crm/segments
 * Create a new customer segment
 */
router.post('/segments', async (req, res) => {
  try {
    const validatedData = CreateSegmentSchema.parse(req.body);
    const { tenantId, sellerId } = req.query;

    if (!tenantId || !sellerId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId and sellerId are required'
      });
    }

    const result = await crmService.createSegment({
      ...validatedData,
      tenantId: tenantId as string,
      sellerId: sellerId as string
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.segment,
      message: result.success ? 'Segment created successfully' : 'Failed to create segment',
      error: result.error
    });
  } catch (error) {
    console.error('Create segment error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create segment',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/crm/segments
 * Get segments with filters
 */
router.get('/segments', async (req, res) => {
  try {
    const { 
      tenantId, 
      sellerId, 
      segmentType, 
      status, 
      isDynamic, 
      page = '1', 
      limit = '50' 
    } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await crmService.searchSegments({
      tenantId: tenantId as string,
      sellerId: sellerId as string,
      segmentType: segmentType as any,
      status: status as any,
      isDynamic: isDynamic ? isDynamic === 'true' : undefined,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });

    res.json({
      success: true,
      data: result,
      message: `Found ${result.segments.length} segments`
    });
  } catch (error) {
    console.error('Get segments error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get segments'
    });
  }
});

/**
 * GET /api/crm/segments/:id
 * Get specific segment
 */
router.get('/segments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const segment = await crmService.getSegment(id);

    if (!segment) {
      return res.status(404).json({
        success: false,
        error: 'Segment not found'
      });
    }

    res.json({
      success: true,
      data: segment,
      message: 'Segment found'
    });
  } catch (error) {
    console.error('Get segment error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get segment'
    });
  }
});

/**
 * PUT /api/crm/segments/:id
 * Update segment
 */
router.put('/segments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = CreateSegmentSchema.partial().parse(req.body);

    const result = await crmService.updateSegment(id, validatedData);

    res.json({
      success: result.success,
      data: result.segment,
      message: result.success ? 'Segment updated successfully' : 'Failed to update segment',
      error: result.error
    });
  } catch (error) {
    console.error('Update segment error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update segment',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * DELETE /api/crm/segments/:id
 * Delete segment
 */
router.delete('/segments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await crmService.deleteSegment(id);

    res.json({
      success: result.success,
      message: result.success ? 'Segment deleted successfully' : 'Failed to delete segment'
    });
  } catch (error) {
    console.error('Delete segment error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete segment'
    });
  }
});

/**
 * POST /api/crm/segments/:id/calculate
 * Calculate segment customer count
 */
router.post('/segments/:id/calculate', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await crmService.calculateSegmentCustomers(id);

    res.json({
      success: result.success,
      data: { count: result.count },
      message: result.success ? 'Segment customers calculated successfully' : 'Failed to calculate segment customers',
      error: result.error
    });
  } catch (error) {
    console.error('Calculate segment customers error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate segment customers'
    });
  }
});

/**
 * GET /api/crm/segments/:id/customers
 * Get segment customers
 */
router.get('/segments/:id/customers', async (req, res) => {
  try {
    const { id } = req.params;

    const customers = await crmService.getSegmentCustomers(id);

    res.json({
      success: true,
      data: customers,
      message: `Found ${customers.length} customers in segment`
    });
  } catch (error) {
    console.error('Get segment customers error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get segment customers'
    });
  }
});

// Campaign Management

/**
 * POST /api/crm/campaigns
 * Create a new campaign
 */
router.post('/campaigns', async (req, res) => {
  try {
    const validatedData = CreateCampaignSchema.parse(req.body);
    const { tenantId, sellerId } = req.query;

    if (!tenantId || !sellerId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId and sellerId are required'
      });
    }

    const result = await crmService.createCampaign({
      ...validatedData,
      tenantId: tenantId as string,
      sellerId: sellerId as string,
      startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
      endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      scheduledAt: validatedData.scheduledAt ? new Date(validatedData.scheduledAt) : undefined
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
 * GET /api/crm/campaigns
 * Get campaigns with filters
 */
router.get('/campaigns', async (req, res) => {
  try {
    const { 
      tenantId, 
      sellerId, 
      campaignType, 
      status, 
      messageType, 
      deliveryMethod, 
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

    const result = await crmService.searchCampaigns({
      tenantId: tenantId as string,
      sellerId: sellerId as string,
      campaignType: campaignType as any,
      status: status as any,
      messageType: messageType as any,
      deliveryMethod: deliveryMethod as any,
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
 * GET /api/crm/campaigns/:id
 * Get specific campaign
 */
router.get('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await crmService.getCampaign(id);

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
 * PUT /api/crm/campaigns/:id
 * Update campaign
 */
router.put('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = CreateCampaignSchema.partial().parse(req.body);

    const result = await crmService.updateCampaign(id, validatedData);

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
 * DELETE /api/crm/campaigns/:id
 * Delete campaign
 */
router.delete('/campaigns/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await crmService.deleteCampaign(id);

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

// Campaign Actions

/**
 * POST /api/crm/campaigns/:id/start
 * Start campaign
 */
router.post('/campaigns/:id/start', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await crmService.startCampaign(id);

    res.json({
      success: result.success,
      message: result.success ? 'Campaign started successfully' : 'Failed to start campaign',
      error: result.error
    });
  } catch (error) {
    console.error('Start campaign error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to start campaign'
    });
  }
});

/**
 * POST /api/crm/campaigns/:id/pause
 * Pause campaign
 */
router.post('/campaigns/:id/pause', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await crmService.pauseCampaign(id);

    res.json({
      success: result.success,
      message: result.success ? 'Campaign paused successfully' : 'Failed to pause campaign',
      error: result.error
    });
  } catch (error) {
    console.error('Pause campaign error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to pause campaign'
    });
  }
});

/**
 * POST /api/crm/campaigns/:id/resume
 * Resume campaign
 */
router.post('/campaigns/:id/resume', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await crmService.resumeCampaign(id);

    res.json({
      success: result.success,
      message: result.success ? 'Campaign resumed successfully' : 'Failed to resume campaign',
      error: result.error
    });
  } catch (error) {
    console.error('Resume campaign error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to resume campaign'
    });
  }
});

/**
 * POST /api/crm/campaigns/:id/stop
 * Stop campaign
 */
router.post('/campaigns/:id/stop', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await crmService.stopCampaign(id);

    res.json({
      success: result.success,
      message: result.success ? 'Campaign stopped successfully' : 'Failed to stop campaign',
      error: result.error
    });
  } catch (error) {
    console.error('Stop campaign error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to stop campaign'
    });
  }
});

// Message Management

/**
 * POST /api/crm/messages
 * Send a message
 */
router.post('/messages', async (req, res) => {
  try {
    const { 
      campaignId, 
      customerId, 
      messageType, 
      deliveryMethod, 
      recipient, 
      subject, 
      content, 
      trackingId, 
      metadata 
    } = req.body;

    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await crmService.sendMessage({
      tenantId: tenantId as string,
      campaignId,
      customerId,
      messageType,
      deliveryMethod,
      recipient,
      subject,
      content,
      trackingId,
      metadata
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.message,
      message: result.success ? 'Message sent successfully' : 'Failed to send message',
      error: result.error
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message'
    });
  }
});

/**
 * POST /api/crm/messages/bulk
 * Send bulk messages
 */
router.post('/messages/bulk', async (req, res) => {
  try {
    const { messages } = req.body;
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await crmService.sendBulkMessages(messages);

    res.json({
      success: result.success,
      data: result.messages,
      message: result.success ? 'Bulk messages sent successfully' : 'Failed to send bulk messages',
      error: result.error
    });
  } catch (error) {
    console.error('Send bulk messages error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send bulk messages'
    });
  }
});

/**
 * GET /api/crm/messages/:id/status
 * Get message status
 */
router.get('/messages/:id/status', async (req, res) => {
  try {
    const { id } = req.params;

    const message = await crmService.getMessageStatus(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    res.json({
      success: true,
      data: message,
      message: 'Message status found'
    });
  } catch (error) {
    console.error('Get message status error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get message status'
    });
  }
});

// Template Management

/**
 * POST /api/crm/templates
 * Create a new template
 */
router.post('/templates', async (req, res) => {
  try {
    const validatedData = CreateTemplateSchema.parse(req.body);
    const { tenantId, sellerId } = req.query;

    if (!tenantId || !sellerId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId and sellerId are required'
      });
    }

    const result = await crmService.createTemplate({
      ...validatedData,
      tenantId: tenantId as string,
      sellerId: sellerId as string
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.template,
      message: result.success ? 'Template created successfully' : 'Failed to create template',
      error: result.error
    });
  } catch (error) {
    console.error('Create template error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create template',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/crm/templates
 * Get templates
 */
router.get('/templates', async (req, res) => {
  try {
    const { sellerId, tenantId } = req.query;

    if (!tenantId || !sellerId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId and sellerId are required'
      });
    }

    const templates = await crmService.getTemplates(sellerId as string, tenantId as string);

    res.json({
      success: true,
      data: templates,
      message: `Found ${templates.length} templates`
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get templates'
    });
  }
});

/**
 * GET /api/crm/templates/:id
 * Get specific template
 */
router.get('/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const template = await crmService.getTemplate(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: template,
      message: 'Template found'
    });
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get template'
    });
  }
});

// Provider Management

/**
 * POST /api/crm/providers
 * Create a new provider
 */
router.post('/providers', async (req, res) => {
  try {
    const validatedData = CreateProviderSchema.parse(req.body);
    const { tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const result = await crmService.createProvider({
      ...validatedData,
      tenantId: tenantId as string
    });

    res.status(result.success ? 201 : 400).json({
      success: result.success,
      data: result.provider,
      message: result.success ? 'Provider created successfully' : 'Failed to create provider',
      error: result.error
    });
  } catch (error) {
    console.error('Create provider error:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create provider',
      details: error instanceof z.ZodError ? error.errors : undefined
    });
  }
});

/**
 * GET /api/crm/providers
 * Get providers
 */
router.get('/providers', async (req, res) => {
  try {
    const { providerType, tenantId } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required'
      });
    }

    const providers = await crmService.getProviders(providerType as string, tenantId as string);

    res.json({
      success: true,
      data: providers,
      message: `Found ${providers.length} providers`
    });
  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get providers'
    });
  }
});

// Analytics

/**
 * GET /api/crm/campaigns/:id/analytics
 * Get campaign analytics
 */
router.get('/campaigns/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    const { dateFrom, dateTo } = req.query;

    const analytics = await crmService.getCampaignAnalytics(
      id,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );

    res.json({
      success: true,
      data: analytics,
      message: 'Campaign analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Get campaign analytics error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get campaign analytics'
    });
  }
});

/**
 * GET /api/crm/segments/:id/analytics
 * Get segment analytics
 */
router.get('/segments/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    const { dateFrom, dateTo } = req.query;

    const analytics = await crmService.getSegmentAnalytics(
      id,
      dateFrom ? new Date(dateFrom as string) : undefined,
      dateTo ? new Date(dateTo as string) : undefined
    );

    res.json({
      success: true,
      data: analytics,
      message: 'Segment analytics retrieved successfully'
    });
  } catch (error) {
    console.error('Get segment analytics error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get segment analytics'
    });
  }
});

/**
 * GET /api/crm/dashboard
 * Get CRM dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    const { sellerId, tenantId } = req.query;

    if (!tenantId || !sellerId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId and sellerId are required'
      });
    }

    const dashboard = await crmService.getCrmDashboard(sellerId as string, tenantId as string);

    res.json({
      success: true,
      data: dashboard,
      message: 'CRM dashboard retrieved successfully'
    });
  } catch (error) {
    console.error('Get CRM dashboard error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get CRM dashboard'
    });
  }
});

// System endpoints

/**
 * GET /api/crm/health
 * Health check for CRM service
 */
router.get('/health', async (req, res) => {
  try {
    const health = await crmService.healthCheck();

    res.status(health.status === 'healthy' ? 200 : 503).json({
      success: health.status === 'healthy',
      data: health,
      message: health.message
    });
  } catch (error) {
    console.error('CRM service health check error:', error);
    res.status(503).json({
      success: false,
      error: error instanceof Error ? error.message : 'Health check failed'
    });
  }
});

export { router as crmRouter };

