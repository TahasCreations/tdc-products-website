import { PrismaClient } from '../prisma-client.js';
import { 
  ShippingContract, 
  ShippingLabel, 
  TrackingEvent,
  ShippingProvider,
  ContractStatus,
  LabelStatus,
  TrackingEventType
} from '@prisma/client';

export interface CreateShippingContractInput {
  tenantId: string;
  contractName: string;
  provider: ShippingProvider;
  contractNumber: string;
  providerConfig: any;
  apiCredentials: any;
  services?: string[];
  zones?: string[];
  weightLimits?: any;
  dimensionLimits?: any;
  baseRates?: any;
  surcharges?: any;
  discounts?: any;
  startDate: Date;
  endDate?: Date;
  autoRenew?: boolean;
  noticePeriod?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  description?: string;
  tags?: string[];
  metadata?: any;
}

export interface UpdateShippingContractInput {
  contractName?: string;
  status?: ContractStatus;
  providerConfig?: any;
  apiCredentials?: any;
  services?: string[];
  zones?: string[];
  weightLimits?: any;
  dimensionLimits?: any;
  baseRates?: any;
  surcharges?: any;
  discounts?: any;
  endDate?: Date;
  autoRenew?: boolean;
  noticePeriod?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  description?: string;
  tags?: string[];
  metadata?: any;
}

export interface CreateShippingLabelInput {
  tenantId: string;
  orderId: string;
  contractId: string;
  labelNumber: string;
  trackingNumber: string;
  serviceType: string;
  status?: LabelStatus;
  weight: number;
  dimensions: any;
  packageType?: string;
  senderAddress: any;
  recipientAddress: any;
  basePrice?: number;
  surcharges?: number;
  discounts?: number;
  totalPrice?: number;
  currency?: string;
  providerLabelId?: string;
  providerData?: any;
  labelUrl?: string;
  barcodeUrl?: string;
  notes?: string;
  metadata?: any;
}

export interface UpdateShippingLabelInput {
  status?: LabelStatus;
  printedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  errorMessage?: string;
  retryCount?: number;
  lastRetryAt?: Date;
  notes?: string;
  metadata?: any;
}

export interface CreateTrackingEventInput {
  labelId: string;
  tenantId: string;
  eventType: TrackingEventType;
  eventName: string;
  description?: string;
  location?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status?: string;
  statusCode?: string;
  eventDate: Date;
  providerEventId?: string;
  providerData?: any;
  metadata?: any;
}

export interface ShippingSearchParams {
  tenantId: string;
  orderId?: string;
  trackingNumber?: string;
  status?: LabelStatus;
  provider?: ShippingProvider;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export class ShippingRepository {
  constructor(private prisma: PrismaClient) {}

  // ShippingContract methods
  async createShippingContract(input: CreateShippingContractInput): Promise<ShippingContract> {
    return this.prisma.shippingContract.create({
      data: {
        tenantId: input.tenantId,
        contractName: input.contractName,
        provider: input.provider,
        contractNumber: input.contractNumber,
        providerConfig: input.providerConfig,
        apiCredentials: input.apiCredentials,
        services: input.services || [],
        zones: input.zones || [],
        weightLimits: input.weightLimits,
        dimensionLimits: input.dimensionLimits,
        baseRates: input.baseRates,
        surcharges: input.surcharges,
        discounts: input.discounts,
        startDate: input.startDate,
        endDate: input.endDate,
        autoRenew: input.autoRenew || false,
        noticePeriod: input.noticePeriod,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        description: input.description,
        tags: input.tags || [],
        metadata: input.metadata
      }
    });
  }

  async updateShippingContract(id: string, input: UpdateShippingContractInput): Promise<ShippingContract> {
    return this.prisma.shippingContract.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date()
      }
    });
  }

  async getShippingContractById(id: string): Promise<ShippingContract | null> {
    return this.prisma.shippingContract.findUnique({
      where: { id }
    });
  }

  async getShippingContractsByTenant(tenantId: string, page: number = 1, limit: number = 50): Promise<{
    contracts: ShippingContract[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const skip = (page - 1) * limit;

    const [contracts, total] = await Promise.all([
      this.prisma.shippingContract.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.shippingContract.count({ where: { tenantId } })
    ]);

    return {
      contracts,
      total,
      page,
      limit,
      hasMore: (page * limit) < total
    };
  }

  async getActiveShippingContracts(tenantId: string): Promise<ShippingContract[]> {
    return this.prisma.shippingContract.findMany({
      where: {
        tenantId,
        status: 'ACTIVE'
      },
      orderBy: { contractName: 'asc' }
    });
  }

  async getShippingContractsByProvider(tenantId: string, provider: ShippingProvider): Promise<ShippingContract[]> {
    return this.prisma.shippingContract.findMany({
      where: {
        tenantId,
        provider,
        status: 'ACTIVE'
      },
      orderBy: { contractName: 'asc' }
    });
  }

  async deleteShippingContract(id: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.shippingContract.delete({
        where: { id }
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  // ShippingLabel methods
  async createShippingLabel(input: CreateShippingLabelInput): Promise<ShippingLabel> {
    return this.prisma.shippingLabel.create({
      data: {
        tenantId: input.tenantId,
        orderId: input.orderId,
        contractId: input.contractId,
        labelNumber: input.labelNumber,
        trackingNumber: input.trackingNumber,
        serviceType: input.serviceType,
        status: input.status || 'CREATED',
        weight: input.weight,
        dimensions: input.dimensions,
        packageType: input.packageType || 'PACKAGE',
        senderAddress: input.senderAddress,
        recipientAddress: input.recipientAddress,
        basePrice: input.basePrice || 0.0,
        surcharges: input.surcharges || 0.0,
        discounts: input.discounts || 0.0,
        totalPrice: input.totalPrice || 0.0,
        currency: input.currency || 'TRY',
        providerLabelId: input.providerLabelId,
        providerData: input.providerData,
        labelUrl: input.labelUrl,
        barcodeUrl: input.barcodeUrl,
        notes: input.notes,
        metadata: input.metadata
      }
    });
  }

  async updateShippingLabel(id: string, input: UpdateShippingLabelInput): Promise<ShippingLabel> {
    return this.prisma.shippingLabel.update({
      where: { id },
      data: {
        ...input,
        updatedAt: new Date()
      }
    });
  }

  async getShippingLabelById(id: string): Promise<ShippingLabel | null> {
    return this.prisma.shippingLabel.findUnique({
      where: { id },
      include: {
        contract: true,
        tracking: {
          orderBy: { eventDate: 'desc' }
        }
      }
    });
  }

  async getShippingLabelByTrackingNumber(trackingNumber: string): Promise<ShippingLabel | null> {
    return this.prisma.shippingLabel.findUnique({
      where: { trackingNumber },
      include: {
        contract: true,
        tracking: {
          orderBy: { eventDate: 'desc' }
        }
      }
    });
  }

  async getShippingLabelsByOrder(orderId: string): Promise<ShippingLabel[]> {
    return this.prisma.shippingLabel.findMany({
      where: { orderId },
      include: {
        contract: true,
        tracking: {
          orderBy: { eventDate: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async searchShippingLabels(params: ShippingSearchParams): Promise<{
    labels: ShippingLabel[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const {
      tenantId,
      orderId,
      trackingNumber,
      status,
      provider,
      dateFrom,
      dateTo,
      page = 1,
      limit = 50
    } = params;

    const where: any = {
      tenantId,
      ...(orderId && { orderId }),
      ...(trackingNumber && { trackingNumber: { contains: trackingNumber } }),
      ...(status && { status }),
      ...(dateFrom && dateTo && {
        createdAt: {
          gte: dateFrom,
          lte: dateTo
        }
      })
    };

    // Add provider filter through contract relation
    if (provider) {
      where.contract = {
        provider
      };
    }

    const skip = (page - 1) * limit;

    const [labels, total] = await Promise.all([
      this.prisma.shippingLabel.findMany({
        where,
        include: {
          contract: true,
          tracking: {
            orderBy: { eventDate: 'desc' },
            take: 5 // Limit tracking events for performance
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.shippingLabel.count({ where })
    ]);

    return {
      labels,
      total,
      page,
      limit,
      hasMore: (page * limit) < total
    };
  }

  async getShippingLabelsByStatus(tenantId: string, status: LabelStatus): Promise<ShippingLabel[]> {
    return this.prisma.shippingLabel.findMany({
      where: {
        tenantId,
        status
      },
      include: {
        contract: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPendingShippingLabels(tenantId: string): Promise<ShippingLabel[]> {
    return this.prisma.shippingLabel.findMany({
      where: {
        tenantId,
        status: 'CREATED'
      },
      include: {
        contract: true
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async getErrorShippingLabels(tenantId: string): Promise<ShippingLabel[]> {
    return this.prisma.shippingLabel.findMany({
      where: {
        tenantId,
        status: 'ERROR'
      },
      include: {
        contract: true
      },
      orderBy: { lastRetryAt: 'asc' }
    });
  }

  // TrackingEvent methods
  async createTrackingEvent(input: CreateTrackingEventInput): Promise<TrackingEvent> {
    return this.prisma.trackingEvent.create({
      data: {
        labelId: input.labelId,
        tenantId: input.tenantId,
        eventType: input.eventType,
        eventName: input.eventName,
        description: input.description,
        location: input.location,
        city: input.city,
        state: input.state,
        country: input.country,
        postalCode: input.postalCode,
        status: input.status,
        statusCode: input.statusCode,
        eventDate: input.eventDate,
        providerEventId: input.providerEventId,
        providerData: input.providerData,
        metadata: input.metadata
      }
    });
  }

  async getTrackingEventsByLabel(labelId: string): Promise<TrackingEvent[]> {
    return this.prisma.trackingEvent.findMany({
      where: { labelId },
      orderBy: { eventDate: 'desc' }
    });
  }

  async getTrackingEventsByTrackingNumber(trackingNumber: string): Promise<TrackingEvent[]> {
    const label = await this.prisma.shippingLabel.findUnique({
      where: { trackingNumber },
      select: { id: true }
    });

    if (!label) {
      return [];
    }

    return this.prisma.trackingEvent.findMany({
      where: { labelId: label.id },
      orderBy: { eventDate: 'desc' }
    });
  }

  async getLatestTrackingEvent(labelId: string): Promise<TrackingEvent | null> {
    return this.prisma.trackingEvent.findFirst({
      where: { labelId },
      orderBy: { eventDate: 'desc' }
    });
  }

  // Statistics methods
  async getShippingStatistics(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<{
    totalLabels: number;
    totalContracts: number;
    labelsByStatus: Record<string, number>;
    labelsByProvider: Record<string, number>;
    averageDeliveryTime: number;
    successRate: number;
    totalShippingCost: number;
    topDestinations: Array<{
      city: string;
      count: number;
      percentage: number;
    }>;
  }> {
    const where: any = { tenantId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    const [
      totalLabels,
      totalContracts,
      labelsByStatus,
      labelsByProvider,
      averageDeliveryTime,
      successRate,
      totalShippingCost,
      topDestinations
    ] = await Promise.all([
      this.prisma.shippingLabel.count({ where }),
      this.prisma.shippingContract.count({ where: { tenantId } }),
      this.getLabelsByStatus(tenantId, dateFrom, dateTo),
      this.getLabelsByProvider(tenantId, dateFrom, dateTo),
      this.getAverageDeliveryTime(tenantId, dateFrom, dateTo),
      this.getSuccessRate(tenantId, dateFrom, dateTo),
      this.getTotalShippingCost(tenantId, dateFrom, dateTo),
      this.getTopDestinations(tenantId, dateFrom, dateTo)
    ]);

    return {
      totalLabels,
      totalContracts,
      labelsByStatus,
      labelsByProvider,
      averageDeliveryTime,
      successRate,
      totalShippingCost,
      topDestinations
    };
  }

  private async getLabelsByStatus(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<Record<string, number>> {
    const where: any = { tenantId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    const labels = await this.prisma.shippingLabel.findMany({
      where,
      select: { status: true }
    });

    return labels.reduce((acc, label) => {
      acc[label.status] = (acc[label.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private async getLabelsByProvider(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<Record<string, number>> {
    const where: any = { tenantId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    const labels = await this.prisma.shippingLabel.findMany({
      where,
      include: {
        contract: {
          select: { provider: true }
        }
      }
    });

    return labels.reduce((acc, label) => {
      const provider = label.contract.provider;
      acc[provider] = (acc[provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private async getAverageDeliveryTime(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<number> {
    const where: any = {
      tenantId,
      status: 'DELIVERED',
      deliveredAt: { not: null }
    };
    
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    const labels = await this.prisma.shippingLabel.findMany({
      where,
      select: {
        createdAt: true,
        deliveredAt: true
      }
    });

    if (labels.length === 0) {
      return 0;
    }

    const totalDays = labels.reduce((sum, label) => {
      if (label.deliveredAt) {
        const days = Math.ceil((label.deliveredAt.getTime() - label.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }
      return sum;
    }, 0);

    return totalDays / labels.length;
  }

  private async getSuccessRate(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<number> {
    const where: any = { tenantId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    const [total, successful] = await Promise.all([
      this.prisma.shippingLabel.count({ where }),
      this.prisma.shippingLabel.count({
        where: {
          ...where,
          status: 'DELIVERED'
        }
      })
    ]);

    return total > 0 ? (successful / total) * 100 : 0;
  }

  private async getTotalShippingCost(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<number> {
    const where: any = { tenantId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    const result = await this.prisma.shippingLabel.aggregate({
      where,
      _sum: {
        totalPrice: true
      }
    });

    return result._sum.totalPrice || 0;
  }

  private async getTopDestinations(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<Array<{ city: string; count: number; percentage: number }>> {
    const where: any = { tenantId };
    if (dateFrom && dateTo) {
      where.createdAt = { gte: dateFrom, lte: dateTo };
    }

    const labels = await this.prisma.shippingLabel.findMany({
      where,
      select: {
        recipientAddress: true
      }
    });

    const cityCounts: Record<string, number> = {};
    labels.forEach(label => {
      const city = label.recipientAddress?.city;
      if (city) {
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      }
    });

    const total = labels.length;
    return Object.entries(cityCounts)
      .map(([city, count]) => ({
        city,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  // Utility methods
  async getActiveContractsByProvider(tenantId: string, provider: ShippingProvider): Promise<ShippingContract[]> {
    return this.prisma.shippingContract.findMany({
      where: {
        tenantId,
        provider,
        status: 'ACTIVE'
      },
      orderBy: { contractName: 'asc' }
    });
  }

  async getContractUsageStats(contractId: string): Promise<{
    totalLabels: number;
    lastUsedAt: Date | null;
    errorCount: number;
    successRate: number;
  }> {
    const [totalLabels, lastUsedAt, errorCount, successCount] = await Promise.all([
      this.prisma.shippingLabel.count({ where: { contractId } }),
      this.prisma.shippingLabel.findFirst({
        where: { contractId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
      }).then(result => result?.createdAt || null),
      this.prisma.shippingLabel.count({
        where: { contractId, status: 'ERROR' }
      }),
      this.prisma.shippingLabel.count({
        where: { contractId, status: 'DELIVERED' }
      })
    ]);

    const successRate = totalLabels > 0 ? (successCount / totalLabels) * 100 : 0;

    return {
      totalLabels,
      lastUsedAt,
      errorCount,
      successRate
    };
  }
}

