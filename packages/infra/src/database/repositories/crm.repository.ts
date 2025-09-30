import { PrismaClient } from '../prisma-client.js';
import { 
  CustomerSegment, 
  SegmentCustomer, 
  Campaign, 
  Message,
  CommunicationTemplate,
  CommunicationProvider,
  SegmentType,
  SegmentStatus,
  UpdateFrequency,
  AssignmentStatus,
  CampaignType,
  CampaignStatus,
  MessageType,
  DeliveryMethod,
  CampaignPriority,
  MessageStatus,
  TemplateType,
  ProviderType,
  ProviderStatus
} from '@prisma/client';

export interface CreateSegmentInput {
  tenantId: string;
  sellerId: string;
  name: string;
  description?: string;
  segmentType: SegmentType;
  criteria: any;
  filters?: any;
  isDynamic?: boolean;
  updateFrequency?: UpdateFrequency;
  tags?: string[];
  metadata?: any;
}

export interface CreateCampaignInput {
  tenantId: string;
  sellerId: string;
  segmentId?: string;
  name: string;
  description?: string;
  campaignType: CampaignType;
  messageType: MessageType;
  deliveryMethod: DeliveryMethod;
  targetSegments?: string[];
  targetCustomers?: string[];
  subject?: string;
  content: string;
  templateId?: string;
  attachments?: string[];
  images?: string[];
  priority?: CampaignPriority;
  batchSize?: number;
  delayBetweenBatches?: number;
  couponId?: string;
  couponCode?: string;
  startDate?: Date;
  endDate?: Date;
  isScheduled?: boolean;
  scheduledAt?: Date;
  tags?: string[];
  metadata?: any;
}

export interface CreateMessageInput {
  tenantId: string;
  campaignId: string;
  customerId: string;
  messageType: MessageType;
  deliveryMethod: DeliveryMethod;
  recipient: string;
  subject?: string;
  content: string;
  trackingId?: string;
  metadata?: any;
}

export interface CreateTemplateInput {
  tenantId: string;
  sellerId: string;
  name: string;
  description?: string;
  templateType: TemplateType;
  messageType: MessageType;
  deliveryMethod: DeliveryMethod;
  subject?: string;
  content: string;
  variables?: string[];
  tags?: string[];
  metadata?: any;
}

export interface CreateProviderInput {
  tenantId: string;
  name: string;
  providerType: ProviderType;
  config: any;
  credentials: any;
  dailyLimit?: number;
  monthlyLimit?: number;
  rateLimit?: number;
  description?: string;
  metadata?: any;
}

export interface SegmentSearchParams {
  tenantId: string;
  sellerId?: string;
  segmentType?: SegmentType;
  status?: SegmentStatus;
  isDynamic?: boolean;
  page?: number;
  limit?: number;
}

export interface CampaignSearchParams {
  tenantId: string;
  sellerId?: string;
  campaignType?: CampaignType;
  status?: CampaignStatus;
  messageType?: MessageType;
  deliveryMethod?: DeliveryMethod;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export class CrmRepository {
  constructor(private prisma: PrismaClient) {}

  // Customer Segment methods
  async createSegment(input: CreateSegmentInput): Promise<CustomerSegment> {
    return this.prisma.customerSegment.create({
      data: {
        tenantId: input.tenantId,
        sellerId: input.sellerId,
        name: input.name,
        description: input.description,
        segmentType: input.segmentType,
        criteria: input.criteria,
        filters: input.filters,
        isDynamic: input.isDynamic || false,
        updateFrequency: input.updateFrequency || 'DAILY',
        tags: input.tags || [],
        metadata: input.metadata
      }
    });
  }

  async updateSegment(id: string, input: Partial<CreateSegmentInput>): Promise<CustomerSegment> {
    return this.prisma.customerSegment.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date()
      }
    });
  }

  async getSegmentById(id: string): Promise<CustomerSegment | null> {
    return this.prisma.customerSegment.findUnique({
      where: { id },
      include: {
        customers: {
          include: {
            customer: true
          }
        },
        campaigns: true
      }
    });
  }

  async searchSegments(params: SegmentSearchParams): Promise<{
    segments: CustomerSegment[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const {
      tenantId,
      sellerId,
      segmentType,
      status,
      isDynamic,
      page = 1,
      limit = 50
    } = params;

    const where: any = {
      tenantId,
      ...(sellerId && { sellerId }),
      ...(segmentType && { segmentType }),
      ...(status && { status }),
      ...(isDynamic !== undefined && { isDynamic })
    };

    const skip = (page - 1) * limit;

    const [segments, total] = await Promise.all([
      this.prisma.customerSegment.findMany({
        where,
        include: {
          customers: {
            include: {
              customer: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.customerSegment.count({ where })
    ]);

    return {
      segments,
      total,
      page,
      limit,
      hasMore: (page * limit) < total
    };
  }

  async updateSegmentCustomerCount(segmentId: string, count: number): Promise<CustomerSegment> {
    return this.prisma.customerSegment.update({
      where: { id: segmentId },
      data: {
        customerCount: count,
        lastCalculatedAt: new Date()
      }
    });
  }

  // Segment Customer methods
  async addCustomerToSegment(
    segmentId: string,
    customerId: string,
    tenantId: string,
    assignedBy?: string,
    assignmentReason?: string
  ): Promise<SegmentCustomer> {
    return this.prisma.segmentCustomer.create({
      data: {
        tenantId,
        segmentId,
        customerId,
        assignedBy,
        assignmentReason
      }
    });
  }

  async removeCustomerFromSegment(segmentId: string, customerId: string): Promise<boolean> {
    const result = await this.prisma.segmentCustomer.deleteMany({
      where: {
        segmentId,
        customerId
      }
    });
    return result.count > 0;
  }

  async getSegmentCustomers(segmentId: string): Promise<SegmentCustomer[]> {
    return this.prisma.segmentCustomer.findMany({
      where: { segmentId },
      include: {
        customer: true
      },
      orderBy: { assignedAt: 'desc' }
    });
  }

  async getCustomerSegments(customerId: string): Promise<SegmentCustomer[]> {
    return this.prisma.segmentCustomer.findMany({
      where: { customerId },
      include: {
        segment: true
      },
      orderBy: { assignedAt: 'desc' }
    });
  }

  // Campaign methods
  async createCampaign(input: CreateCampaignInput): Promise<Campaign> {
    return this.prisma.campaign.create({
      data: {
        tenantId: input.tenantId,
        sellerId: input.sellerId,
        segmentId: input.segmentId,
        name: input.name,
        description: input.description,
        campaignType: input.campaignType,
        messageType: input.messageType,
        deliveryMethod: input.deliveryMethod,
        targetSegments: input.targetSegments || [],
        targetCustomers: input.targetCustomers || [],
        subject: input.subject,
        content: input.content,
        templateId: input.templateId,
        attachments: input.attachments || [],
        images: input.images || [],
        priority: input.priority || 'NORMAL',
        batchSize: input.batchSize || 100,
        delayBetweenBatches: input.delayBetweenBatches || 60,
        couponId: input.couponId,
        couponCode: input.couponCode,
        startDate: input.startDate,
        endDate: input.endDate,
        isScheduled: input.isScheduled || false,
        scheduledAt: input.scheduledAt,
        tags: input.tags || [],
        metadata: input.metadata
      }
    });
  }

  async updateCampaign(id: string, input: Partial<CreateCampaignInput>): Promise<Campaign> {
    return this.prisma.campaign.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date()
      }
    });
  }

  async getCampaignById(id: string): Promise<Campaign | null> {
    return this.prisma.campaign.findUnique({
      where: { id },
      include: {
        segment: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        coupon: true
      }
    });
  }

  async searchCampaigns(params: CampaignSearchParams): Promise<{
    campaigns: Campaign[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const {
      tenantId,
      sellerId,
      campaignType,
      status,
      messageType,
      deliveryMethod,
      dateFrom,
      dateTo,
      page = 1,
      limit = 50
    } = params;

    const where: any = {
      tenantId,
      ...(sellerId && { sellerId }),
      ...(campaignType && { campaignType }),
      ...(status && { status }),
      ...(messageType && { messageType }),
      ...(deliveryMethod && { deliveryMethod }),
      ...(dateFrom && dateTo && {
        startDate: { gte: dateFrom },
        endDate: { lte: dateTo }
      })
    };

    const skip = (page - 1) * limit;

    const [campaigns, total] = await Promise.all([
      this.prisma.campaign.findMany({
        where,
        include: {
          segment: true,
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 5
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.campaign.count({ where })
    ]);

    return {
      campaigns,
      total,
      page,
      limit,
      hasMore: (page * limit) < total
    };
  }

  async getScheduledCampaigns(): Promise<Campaign[]> {
    return this.prisma.campaign.findMany({
      where: {
        isScheduled: true,
        status: 'SCHEDULED',
        scheduledAt: { lte: new Date() }
      },
      orderBy: { scheduledAt: 'asc' }
    });
  }

  async updateCampaignMetrics(
    campaignId: string,
    metrics: {
      totalSent?: number;
      totalDelivered?: number;
      totalOpened?: number;
      totalClicked?: number;
      totalConverted?: number;
      totalBounced?: number;
      totalUnsubscribed?: number;
    }
  ): Promise<Campaign> {
    const updateData: any = {};
    
    if (metrics.totalSent !== undefined) updateData.totalSent = { increment: metrics.totalSent };
    if (metrics.totalDelivered !== undefined) updateData.totalDelivered = { increment: metrics.totalDelivered };
    if (metrics.totalOpened !== undefined) updateData.totalOpened = { increment: metrics.totalOpened };
    if (metrics.totalClicked !== undefined) updateData.totalClicked = { increment: metrics.totalClicked };
    if (metrics.totalConverted !== undefined) updateData.totalConverted = { increment: metrics.totalConverted };
    if (metrics.totalBounced !== undefined) updateData.totalBounced = { increment: metrics.totalBounced };
    if (metrics.totalUnsubscribed !== undefined) updateData.totalUnsubscribed = { increment: metrics.totalUnsubscribed };

    return this.prisma.campaign.update({
      where: { id: campaignId },
      data: updateData
    });
  }

  // Message methods
  async createMessage(input: CreateMessageInput): Promise<Message> {
    return this.prisma.message.create({
      data: {
        tenantId: input.tenantId,
        campaignId: input.campaignId,
        customerId: input.customerId,
        messageType: input.messageType,
        deliveryMethod: input.deliveryMethod,
        recipient: input.recipient,
        subject: input.subject,
        content: input.content,
        trackingId: input.trackingId,
        metadata: input.metadata
      }
    });
  }

  async updateMessageStatus(
    messageId: string,
    status: MessageStatus,
    additionalData?: {
      sentAt?: Date;
      deliveredAt?: Date;
      openedAt?: Date;
      clickedAt?: Date;
      convertedAt?: Date;
      bouncedAt?: Date;
      unsubscribedAt?: Date;
      providerId?: string;
      providerResponse?: any;
      errorMessage?: string;
      retryCount?: number;
    }
  ): Promise<Message> {
    const updateData: any = { status };
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined) {
          updateData[key] = value;
        }
      });
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: updateData
    });
  }

  async getMessagesByCampaign(campaignId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getMessagesByStatus(status: MessageStatus, limit: number = 100): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: { status },
      orderBy: { createdAt: 'asc' },
      take: limit
    });
  }

  async getMessageStats(campaignId: string): Promise<{
    total: number;
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    bounced: number;
    failed: number;
  }> {
    const stats = await this.prisma.message.groupBy({
      by: ['status'],
      where: { campaignId },
      _count: { status: true }
    });

    const result = {
      total: 0,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      bounced: 0,
      failed: 0
    };

    stats.forEach(stat => {
      const count = stat._count.status;
      result.total += count;
      
      switch (stat.status) {
        case 'SENT':
          result.sent += count;
          break;
        case 'DELIVERED':
          result.delivered += count;
          break;
        case 'OPENED':
          result.opened += count;
          break;
        case 'CLICKED':
          result.clicked += count;
          break;
        case 'CONVERTED':
          result.converted += count;
          break;
        case 'BOUNCED':
          result.bounced += count;
          break;
        case 'FAILED':
          result.failed += count;
          break;
      }
    });

    return result;
  }

  // Template methods
  async createTemplate(input: CreateTemplateInput): Promise<CommunicationTemplate> {
    return this.prisma.communicationTemplate.create({
      data: {
        tenantId: input.tenantId,
        sellerId: input.sellerId,
        name: input.name,
        description: input.description,
        templateType: input.templateType,
        messageType: input.messageType,
        deliveryMethod: input.deliveryMethod,
        subject: input.subject,
        content: input.content,
        variables: input.variables || [],
        tags: input.tags || [],
        metadata: input.metadata
      }
    });
  }

  async getTemplatesBySeller(sellerId: string, tenantId: string): Promise<CommunicationTemplate[]> {
    return this.prisma.communicationTemplate.findMany({
      where: {
        sellerId,
        tenantId,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTemplateById(id: string): Promise<CommunicationTemplate | null> {
    return this.prisma.communicationTemplate.findUnique({
      where: { id }
    });
  }

  // Provider methods
  async createProvider(input: CreateProviderInput): Promise<CommunicationProvider> {
    return this.prisma.communicationProvider.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        providerType: input.providerType,
        config: input.config,
        credentials: input.credentials,
        dailyLimit: input.dailyLimit,
        monthlyLimit: input.monthlyLimit,
        rateLimit: input.rateLimit,
        description: input.description,
        metadata: input.metadata
      }
    });
  }

  async getProvidersByType(providerType: ProviderType, tenantId: string): Promise<CommunicationProvider[]> {
    return this.prisma.communicationProvider.findMany({
      where: {
        providerType,
        tenantId,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getProviderById(id: string): Promise<CommunicationProvider | null> {
    return this.prisma.communicationProvider.findUnique({
      where: { id }
    });
  }

  // Analytics methods
  async getCampaignAnalytics(
    campaignId: string,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<{
    totalSent: number;
    totalDelivered: number;
    totalOpened: number;
    totalClicked: number;
    totalConverted: number;
    totalBounced: number;
    totalUnsubscribed: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    bounceRate: number;
    unsubscribeRate: number;
  }> {
    const where: any = { campaignId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    const stats = await this.getMessageStats(campaignId);
    
    const deliveryRate = stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0;
    const openRate = stats.delivered > 0 ? (stats.opened / stats.delivered) * 100 : 0;
    const clickRate = stats.delivered > 0 ? (stats.clicked / stats.delivered) * 100 : 0;
    const conversionRate = stats.delivered > 0 ? (stats.converted / stats.delivered) * 100 : 0;
    const bounceRate = stats.total > 0 ? (stats.bounced / stats.total) * 100 : 0;
    const unsubscribeRate = stats.total > 0 ? (stats.total - stats.sent) / stats.total * 100 : 0;

    return {
      ...stats,
      deliveryRate,
      openRate,
      clickRate,
      conversionRate,
      bounceRate,
      unsubscribeRate
    };
  }

  async getSegmentAnalytics(
    segmentId: string,
    dateFrom?: Date,
    dateTo?: Date
  ): Promise<{
    totalCustomers: number;
    activeCustomers: number;
    engagementRate: number;
    averageOrderValue: number;
    topCampaigns: Array<{
      campaignId: string;
      campaignName: string;
      openRate: number;
      clickRate: number;
    }>;
  }> {
    const segment = await this.getSegmentById(segmentId);
    if (!segment) {
      throw new Error('Segment not found');
    }

    const customers = await this.getSegmentCustomers(segmentId);
    const activeCustomers = customers.filter(c => c.status === 'ACTIVE').length;
    
    // Mock analytics - would be calculated from actual data
    const engagementRate = Math.random() * 100;
    const averageOrderValue = Math.random() * 1000;
    
    const topCampaigns = await this.prisma.campaign.findMany({
      where: {
        segmentId,
        status: 'COMPLETED'
      },
      select: {
        id: true,
        name: true,
        totalOpened: true,
        totalClicked: true,
        totalDelivered: true
      },
      orderBy: { totalOpened: 'desc' },
      take: 5
    });

    return {
      totalCustomers: customers.length,
      activeCustomers,
      engagementRate,
      averageOrderValue,
      topCampaigns: topCampaigns.map(campaign => ({
        campaignId: campaign.id,
        campaignName: campaign.name,
        openRate: campaign.totalDelivered > 0 ? (campaign.totalOpened / campaign.totalDelivered) * 100 : 0,
        clickRate: campaign.totalDelivered > 0 ? (campaign.totalClicked / campaign.totalDelivered) * 100 : 0
      }))
    };
  }
}

