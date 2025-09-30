/**
 * CRM Service Implementation
 * Orchestrates CRM operations using domain logic and repository
 */

import { CrmRepository, CreateSegmentInput, CreateCampaignInput, CreateMessageInput, CreateTemplateInput, CreateProviderInput, SegmentSearchParams, CampaignSearchParams } from '../database/repositories/crm.repository.js';
import { PrismaClient } from '../database/prisma-client.js';
import { MockEmailAdapter } from '../communication/adapters/email-adapter.js';
import { MockWhatsAppAdapter } from '../communication/adapters/whatsapp-adapter.js';
import { 
  evaluateCustomerSegment,
  calculateSegmentCustomerCount,
  generateSegmentInsights,
  calculateCampaignMetrics,
  generateCampaignRecommendations,
  determineOptimalSendTime,
  generatePersonalizedContent,
  validateCampaign,
  calculateCampaignBudget,
  CustomerSegment,
  Customer,
  Campaign,
  SegmentCriteria
} from '@tdc/domain';

export interface CrmService {
  // Segment management
  createSegment(input: CreateSegmentInput): Promise<{ success: boolean; segment?: any; error?: string }>;
  updateSegment(id: string, input: any): Promise<{ success: boolean; segment?: any; error?: string }>;
  getSegment(id: string): Promise<any | null>;
  searchSegments(params: SegmentSearchParams): Promise<any>;
  deleteSegment(id: string): Promise<{ success: boolean }>;
  
  // Segment customer management
  addCustomerToSegment(segmentId: string, customerId: string, tenantId: string, assignedBy?: string): Promise<{ success: boolean; error?: string }>;
  removeCustomerFromSegment(segmentId: string, customerId: string): Promise<{ success: boolean; error?: string }>;
  getSegmentCustomers(segmentId: string): Promise<any[]>;
  calculateSegmentCustomers(segmentId: string): Promise<{ success: boolean; count?: number; error?: string }>;
  
  // Campaign management
  createCampaign(input: CreateCampaignInput): Promise<{ success: boolean; campaign?: any; error?: string }>;
  updateCampaign(id: string, input: any): Promise<{ success: boolean; campaign?: any; error?: string }>;
  getCampaign(id: string): Promise<any | null>;
  searchCampaigns(params: CampaignSearchParams): Promise<any>;
  deleteCampaign(id: string): Promise<{ success: boolean }>;
  
  // Campaign execution
  startCampaign(campaignId: string): Promise<{ success: boolean; error?: string }>;
  pauseCampaign(campaignId: string): Promise<{ success: boolean; error?: string }>;
  resumeCampaign(campaignId: string): Promise<{ success: boolean; error?: string }>;
  stopCampaign(campaignId: string): Promise<{ success: boolean; error?: string }>;
  
  // Message management
  sendMessage(input: CreateMessageInput): Promise<{ success: boolean; message?: any; error?: string }>;
  sendBulkMessages(messages: CreateMessageInput[]): Promise<{ success: boolean; messages?: any[]; error?: string }>;
  getMessageStatus(messageId: string): Promise<any | null>;
  
  // Template management
  createTemplate(input: CreateTemplateInput): Promise<{ success: boolean; template?: any; error?: string }>;
  getTemplates(sellerId: string, tenantId: string): Promise<any[]>;
  getTemplate(id: string): Promise<any | null>;
  
  // Provider management
  createProvider(input: CreateProviderInput): Promise<{ success: boolean; provider?: any; error?: string }>;
  getProviders(providerType: string, tenantId: string): Promise<any[]>;
  
  // Analytics
  getCampaignAnalytics(campaignId: string, dateFrom?: Date, dateTo?: Date): Promise<any>;
  getSegmentAnalytics(segmentId: string, dateFrom?: Date, dateTo?: Date): Promise<any>;
  getCrmDashboard(sellerId: string, tenantId: string): Promise<any>;
  
  // Health check
  healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }>;
}

export class CrmServiceImpl implements CrmService {
  private prisma: PrismaClient;
  private crmRepo: CrmRepository;
  private emailAdapter: MockEmailAdapter;
  private whatsappAdapter: MockWhatsAppAdapter;

  constructor() {
    this.prisma = new PrismaClient();
    this.crmRepo = new CrmRepository(this.prisma);
    this.emailAdapter = new MockEmailAdapter();
    this.whatsappAdapter = new MockWhatsAppAdapter();
  }

  async createSegment(input: CreateSegmentInput): Promise<{ success: boolean; segment?: any; error?: string }> {
    try {
      console.log('[CRM Service] Creating segment:', input.name);

      const segment = await this.crmRepo.createSegment(input);

      // Calculate initial customer count if criteria is provided
      if (input.criteria) {
        const customers = await this.getCustomersForSegment(input.criteria, input.tenantId);
        const count = calculateSegmentCustomerCount(customers, input.criteria);
        await this.crmRepo.updateSegmentCustomerCount(segment.id, count);
      }

      console.log('[CRM Service] Segment created successfully:', segment.id);

      return {
        success: true,
        segment: this.transformSegment(segment)
      };
    } catch (error) {
      console.error('[CRM Service] Error creating segment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create segment'
      };
    }
  }

  async updateSegment(id: string, input: any): Promise<{ success: boolean; segment?: any; error?: string }> {
    try {
      console.log('[CRM Service] Updating segment:', id);

      const segment = await this.crmRepo.updateSegment(id, input);

      // Recalculate customer count if criteria changed
      if (input.criteria) {
        const customers = await this.getCustomersForSegment(input.criteria, segment.tenantId);
        const count = calculateSegmentCustomerCount(customers, input.criteria);
        await this.crmRepo.updateSegmentCustomerCount(segment.id, count);
      }

      return {
        success: true,
        segment: this.transformSegment(segment)
      };
    } catch (error) {
      console.error('[CRM Service] Error updating segment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update segment'
      };
    }
  }

  async getSegment(id: string): Promise<any | null> {
    try {
      const segment = await this.crmRepo.getSegmentById(id);
      return segment ? this.transformSegment(segment) : null;
    } catch (error) {
      console.error('[CRM Service] Error getting segment:', error);
      return null;
    }
  }

  async searchSegments(params: SegmentSearchParams): Promise<any> {
    try {
      const result = await this.crmRepo.searchSegments(params);
      return {
        ...result,
        segments: result.segments.map(segment => this.transformSegment(segment))
      };
    } catch (error) {
      console.error('[CRM Service] Error searching segments:', error);
      return {
        segments: [],
        total: 0,
        page: 1,
        limit: 50,
        hasMore: false
      };
    }
  }

  async deleteSegment(id: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.customerSegment.delete({
        where: { id }
      });
      return { success: true };
    } catch (error) {
      console.error('[CRM Service] Error deleting segment:', error);
      return { success: false };
    }
  }

  async addCustomerToSegment(segmentId: string, customerId: string, tenantId: string, assignedBy?: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.crmRepo.addCustomerToSegment(segmentId, customerId, tenantId, assignedBy);
      return { success: true };
    } catch (error) {
      console.error('[CRM Service] Error adding customer to segment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add customer to segment'
      };
    }
  }

  async removeCustomerFromSegment(segmentId: string, customerId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const removed = await this.crmRepo.removeCustomerFromSegment(segmentId, customerId);
      return { success: removed };
    } catch (error) {
      console.error('[CRM Service] Error removing customer from segment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove customer from segment'
      };
    }
  }

  async getSegmentCustomers(segmentId: string): Promise<any[]> {
    try {
      const customers = await this.crmRepo.getSegmentCustomers(segmentId);
      return customers.map(customer => this.transformSegmentCustomer(customer));
    } catch (error) {
      console.error('[CRM Service] Error getting segment customers:', error);
      return [];
    }
  }

  async calculateSegmentCustomers(segmentId: string): Promise<{ success: boolean; count?: number; error?: string }> {
    try {
      const segment = await this.crmRepo.getSegmentById(segmentId);
      if (!segment) {
        return { success: false, error: 'Segment not found' };
      }

      const customers = await this.getCustomersForSegment(segment.criteria, segment.tenantId);
      const count = calculateSegmentCustomerCount(customers, segment.criteria);
      
      await this.crmRepo.updateSegmentCustomerCount(segmentId, count);

      return { success: true, count };
    } catch (error) {
      console.error('[CRM Service] Error calculating segment customers:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to calculate segment customers'
      };
    }
  }

  async createCampaign(input: CreateCampaignInput): Promise<{ success: boolean; campaign?: any; error?: string }> {
    try {
      console.log('[CRM Service] Creating campaign:', input.name);

      // Validate campaign
      const validation = validateCampaign(input as any);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Campaign validation failed: ${validation.errors.join(', ')}`
        };
      }

      const campaign = await this.crmRepo.createCampaign(input);

      console.log('[CRM Service] Campaign created successfully:', campaign.id);

      return {
        success: true,
        campaign: this.transformCampaign(campaign)
      };
    } catch (error) {
      console.error('[CRM Service] Error creating campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create campaign'
      };
    }
  }

  async updateCampaign(id: string, input: any): Promise<{ success: boolean; campaign?: any; error?: string }> {
    try {
      console.log('[CRM Service] Updating campaign:', id);

      const campaign = await this.crmRepo.updateCampaign(id, input);

      return {
        success: true,
        campaign: this.transformCampaign(campaign)
      };
    } catch (error) {
      console.error('[CRM Service] Error updating campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update campaign'
      };
    }
  }

  async getCampaign(id: string): Promise<any | null> {
    try {
      const campaign = await this.crmRepo.getCampaignById(id);
      return campaign ? this.transformCampaign(campaign) : null;
    } catch (error) {
      console.error('[CRM Service] Error getting campaign:', error);
      return null;
    }
  }

  async searchCampaigns(params: CampaignSearchParams): Promise<any> {
    try {
      const result = await this.crmRepo.searchCampaigns(params);
      return {
        ...result,
        campaigns: result.campaigns.map(campaign => this.transformCampaign(campaign))
      };
    } catch (error) {
      console.error('[CRM Service] Error searching campaigns:', error);
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
      await this.prisma.campaign.delete({
        where: { id }
      });
      return { success: true };
    } catch (error) {
      console.error('[CRM Service] Error deleting campaign:', error);
      return { success: false };
    }
  }

  async startCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('[CRM Service] Starting campaign:', campaignId);

      const campaign = await this.crmRepo.getCampaignById(campaignId);
      if (!campaign) {
        return { success: false, error: 'Campaign not found' };
      }

      // Update campaign status
      await this.crmRepo.updateCampaign(campaignId, { status: 'RUNNING' });

      // Start sending messages
      await this.processCampaign(campaign);

      return { success: true };
    } catch (error) {
      console.error('[CRM Service] Error starting campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to start campaign'
      };
    }
  }

  async pauseCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.crmRepo.updateCampaign(campaignId, { status: 'PAUSED' });
      return { success: true };
    } catch (error) {
      console.error('[CRM Service] Error pausing campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to pause campaign'
      };
    }
  }

  async resumeCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.crmRepo.updateCampaign(campaignId, { status: 'RUNNING' });
      return { success: true };
    } catch (error) {
      console.error('[CRM Service] Error resuming campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resume campaign'
      };
    }
  }

  async stopCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.crmRepo.updateCampaign(campaignId, { status: 'CANCELLED' });
      return { success: true };
    } catch (error) {
      console.error('[CRM Service] Error stopping campaign:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to stop campaign'
      };
    }
  }

  async sendMessage(input: CreateMessageInput): Promise<{ success: boolean; message?: any; error?: string }> {
    try {
      console.log('[CRM Service] Sending message to:', input.recipient);

      // Create message record
      const message = await this.crmRepo.createMessage(input);

      // Send via appropriate adapter
      let response;
      switch (input.deliveryMethod) {
        case 'EMAIL':
          response = await this.emailAdapter.sendEmail({
            to: input.recipient,
            subject: input.subject || '',
            content: input.content,
            trackingId: input.trackingId
          });
          break;
        case 'WHATSAPP':
          response = await this.whatsappAdapter.sendMessage({
            to: input.recipient,
            messageType: 'text',
            content: { text: input.content },
            trackingId: input.trackingId
          });
          break;
        default:
          throw new Error(`Unsupported delivery method: ${input.deliveryMethod}`);
      }

      // Update message status
      await this.crmRepo.updateMessageStatus(message.id, 'SENT', {
        sentAt: new Date(),
        providerId: response.messageId,
        providerResponse: response.providerResponse
      });

      return {
        success: true,
        message: this.transformMessage(message)
      };
    } catch (error) {
      console.error('[CRM Service] Error sending message:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message'
      };
    }
  }

  async sendBulkMessages(messages: CreateMessageInput[]): Promise<{ success: boolean; messages?: any[]; error?: string }> {
    try {
      console.log('[CRM Service] Sending bulk messages:', messages.length);

      const results = [];
      
      for (const messageInput of messages) {
        const result = await this.sendMessage(messageInput);
        results.push(result);
      }

      return {
        success: true,
        messages: results
      };
    } catch (error) {
      console.error('[CRM Service] Error sending bulk messages:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send bulk messages'
      };
    }
  }

  async getMessageStatus(messageId: string): Promise<any | null> {
    try {
      const message = await this.prisma.message.findUnique({
        where: { id: messageId }
      });
      return message ? this.transformMessage(message) : null;
    } catch (error) {
      console.error('[CRM Service] Error getting message status:', error);
      return null;
    }
  }

  async createTemplate(input: CreateTemplateInput): Promise<{ success: boolean; template?: any; error?: string }> {
    try {
      console.log('[CRM Service] Creating template:', input.name);

      const template = await this.crmRepo.createTemplate(input);

      return {
        success: true,
        template: this.transformTemplate(template)
      };
    } catch (error) {
      console.error('[CRM Service] Error creating template:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create template'
      };
    }
  }

  async getTemplates(sellerId: string, tenantId: string): Promise<any[]> {
    try {
      const templates = await this.crmRepo.getTemplatesBySeller(sellerId, tenantId);
      return templates.map(template => this.transformTemplate(template));
    } catch (error) {
      console.error('[CRM Service] Error getting templates:', error);
      return [];
    }
  }

  async getTemplate(id: string): Promise<any | null> {
    try {
      const template = await this.crmRepo.getTemplateById(id);
      return template ? this.transformTemplate(template) : null;
    } catch (error) {
      console.error('[CRM Service] Error getting template:', error);
      return null;
    }
  }

  async createProvider(input: CreateProviderInput): Promise<{ success: boolean; provider?: any; error?: string }> {
    try {
      console.log('[CRM Service] Creating provider:', input.name);

      const provider = await this.crmRepo.createProvider(input);

      return {
        success: true,
        provider: this.transformProvider(provider)
      };
    } catch (error) {
      console.error('[CRM Service] Error creating provider:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create provider'
      };
    }
  }

  async getProviders(providerType: string, tenantId: string): Promise<any[]> {
    try {
      const providers = await this.crmRepo.getProvidersByType(providerType as any, tenantId);
      return providers.map(provider => this.transformProvider(provider));
    } catch (error) {
      console.error('[CRM Service] Error getting providers:', error);
      return [];
    }
  }

  async getCampaignAnalytics(campaignId: string, dateFrom?: Date, dateTo?: Date): Promise<any> {
    try {
      const analytics = await this.crmRepo.getCampaignAnalytics(campaignId, dateFrom, dateTo);
      return analytics;
    } catch (error) {
      console.error('[CRM Service] Error getting campaign analytics:', error);
      return null;
    }
  }

  async getSegmentAnalytics(segmentId: string, dateFrom?: Date, dateTo?: Date): Promise<any> {
    try {
      const analytics = await this.crmRepo.getSegmentAnalytics(segmentId, dateFrom, dateTo);
      return analytics;
    } catch (error) {
      console.error('[CRM Service] Error getting segment analytics:', error);
      return null;
    }
  }

  async getCrmDashboard(sellerId: string, tenantId: string): Promise<any> {
    try {
      // Get segments
      const segments = await this.crmRepo.searchSegments({ tenantId, sellerId, limit: 10 });
      
      // Get campaigns
      const campaigns = await this.crmRepo.searchCampaigns({ tenantId, sellerId, limit: 10 });
      
      // Get recent messages
      const recentMessages = await this.prisma.message.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      return {
        segments: {
          total: segments.total,
          recent: segments.segments.slice(0, 5)
        },
        campaigns: {
          total: campaigns.total,
          recent: campaigns.campaigns.slice(0, 5)
        },
        messages: {
          recent: recentMessages.map(msg => this.transformMessage(msg))
        }
      };
    } catch (error) {
      console.error('[CRM Service] Error getting CRM dashboard:', error);
      return null;
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }> {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Check communication adapters
      const [emailHealth, whatsappHealth] = await Promise.all([
        this.emailAdapter.healthCheck(),
        this.whatsappAdapter.healthCheck()
      ]);

      const isHealthy = emailHealth.status === 'healthy' && whatsappHealth.status === 'healthy';

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        message: isHealthy ? 'CRM service is healthy' : 'CRM service has issues',
        details: {
          database: 'connected',
          emailAdapter: emailHealth.status,
          whatsappAdapter: whatsappHealth.status
        }
      };
    } catch (error) {
      console.error('[CRM Service] Health check failed:', error);
      return {
        status: 'unhealthy',
        message: `CRM service health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  // Private helper methods

  private async getCustomersForSegment(criteria: any, tenantId: string): Promise<Customer[]> {
    // Mock implementation - would query actual customer data
    return [];
  }

  private async processCampaign(campaign: any): Promise<void> {
    // Mock implementation - would process campaign messages
    console.log('[CRM Service] Processing campaign:', campaign.id);
  }

  private transformSegment(segment: any): any {
    return {
      id: segment.id,
      name: segment.name,
      description: segment.description,
      segmentType: segment.segmentType,
      status: segment.status,
      criteria: segment.criteria,
      filters: segment.filters,
      customerCount: segment.customerCount,
      lastCalculatedAt: segment.lastCalculatedAt,
      isDynamic: segment.isDynamic,
      updateFrequency: segment.updateFrequency,
      tags: segment.tags,
      metadata: segment.metadata,
      createdAt: segment.createdAt,
      updatedAt: segment.updatedAt,
      customers: segment.customers?.map((c: any) => this.transformSegmentCustomer(c)) || []
    };
  }

  private transformSegmentCustomer(segmentCustomer: any): any {
    return {
      id: segmentCustomer.id,
      assignedAt: segmentCustomer.assignedAt,
      assignedBy: segmentCustomer.assignedBy,
      assignmentReason: segmentCustomer.assignmentReason,
      status: segmentCustomer.status,
      lastActivityAt: segmentCustomer.lastActivityAt,
      metadata: segmentCustomer.metadata,
      createdAt: segmentCustomer.createdAt,
      customer: segmentCustomer.customer
    };
  }

  private transformCampaign(campaign: any): any {
    return {
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      campaignType: campaign.campaignType,
      status: campaign.status,
      messageType: campaign.messageType,
      deliveryMethod: campaign.deliveryMethod,
      targetSegments: campaign.targetSegments,
      targetCustomers: campaign.targetCustomers,
      subject: campaign.subject,
      content: campaign.content,
      templateId: campaign.templateId,
      attachments: campaign.attachments,
      images: campaign.images,
      priority: campaign.priority,
      batchSize: campaign.batchSize,
      delayBetweenBatches: campaign.delayBetweenBatches,
      couponId: campaign.couponId,
      couponCode: campaign.couponCode,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      isScheduled: campaign.isScheduled,
      scheduledAt: campaign.scheduledAt,
      totalSent: campaign.totalSent,
      totalDelivered: campaign.totalDelivered,
      totalOpened: campaign.totalOpened,
      totalClicked: campaign.totalClicked,
      totalConverted: campaign.totalConverted,
      totalBounced: campaign.totalBounced,
      totalUnsubscribed: campaign.totalUnsubscribed,
      deliveryRate: campaign.deliveryRate,
      openRate: campaign.openRate,
      clickRate: campaign.clickRate,
      conversionRate: campaign.conversionRate,
      bounceRate: campaign.bounceRate,
      tags: campaign.tags,
      metadata: campaign.metadata,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
      segment: campaign.segment,
      messages: campaign.messages?.map((msg: any) => this.transformMessage(msg)) || [],
      coupon: campaign.coupon
    };
  }

  private transformMessage(message: any): any {
    return {
      id: message.id,
      messageType: message.messageType,
      deliveryMethod: message.deliveryMethod,
      recipient: message.recipient,
      subject: message.subject,
      content: message.content,
      status: message.status,
      sentAt: message.sentAt,
      deliveredAt: message.deliveredAt,
      openedAt: message.openedAt,
      clickedAt: message.clickedAt,
      convertedAt: message.convertedAt,
      bouncedAt: message.bouncedAt,
      unsubscribedAt: message.unsubscribedAt,
      providerId: message.providerId,
      providerResponse: message.providerResponse,
      errorMessage: message.errorMessage,
      retryCount: message.retryCount,
      maxRetries: message.maxRetries,
      trackingId: message.trackingId,
      openTracking: message.openTracking,
      clickTracking: message.clickTracking,
      openCount: message.openCount,
      clickCount: message.clickCount,
      conversionValue: message.conversionValue,
      metadata: message.metadata,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    };
  }

  private transformTemplate(template: any): any {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      templateType: template.templateType,
      messageType: template.messageType,
      deliveryMethod: template.deliveryMethod,
      subject: template.subject,
      content: template.content,
      variables: template.variables,
      isActive: template.isActive,
      isDefault: template.isDefault,
      usageCount: template.usageCount,
      lastUsedAt: template.lastUsedAt,
      tags: template.tags,
      metadata: template.metadata,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt
    };
  }

  private transformProvider(provider: any): any {
    return {
      id: provider.id,
      name: provider.name,
      providerType: provider.providerType,
      status: provider.status,
      config: provider.config,
      dailyLimit: provider.dailyLimit,
      monthlyLimit: provider.monthlyLimit,
      rateLimit: provider.rateLimit,
      dailyUsage: provider.dailyUsage,
      monthlyUsage: provider.monthlyUsage,
      lastResetAt: provider.lastResetAt,
      successRate: provider.successRate,
      averageLatency: provider.averageLatency,
      description: provider.description,
      metadata: provider.metadata,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt
    };
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}

