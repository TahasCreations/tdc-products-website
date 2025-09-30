import { PrismaClient } from '../prisma-client.js';
import { 
  Invoice, 
  InvoiceItem, 
  InvoiceType, 
  InvoiceStatus, 
  IssuerType, 
  BuyerType 
} from '@prisma/client';

export interface CreateInvoiceInput {
  tenantId: string;
  orderId?: string;
  sellerId?: string;
  invoiceNumber: string;
  invoiceType: InvoiceType;
  issuerId: string;
  issuerType: IssuerType;
  issuerName: string;
  issuerTaxNumber: string;
  issuerAddress: string;
  issuerPhone?: string;
  issuerEmail?: string;
  buyerId: string;
  buyerType: BuyerType;
  buyerName: string;
  buyerTaxNumber?: string;
  buyerAddress: string;
  buyerPhone?: string;
  buyerEmail?: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency?: string;
  invoiceDate?: Date;
  dueDate?: Date;
  notes?: string;
  metadata?: any;
}

export interface UpdateInvoiceInput {
  status?: InvoiceStatus;
  paidDate?: Date;
  paymentMethod?: string;
  paymentReference?: string;
  paymentNotes?: string;
  externalId?: string;
  externalStatus?: string;
  externalData?: any;
  notes?: string;
  metadata?: any;
}

export interface CreateInvoiceItemInput {
  invoiceId: string;
  tenantId: string;
  productId?: string;
  productName: string;
  productSku?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  commissionRate?: number;
  commissionAmount?: number;
  metadata?: any;
}

export interface InvoiceSearchParams {
  tenantId: string;
  sellerId?: string;
  orderId?: string;
  invoiceType?: InvoiceType;
  status?: InvoiceStatus;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export class InvoiceRepository {
  constructor(private prisma: PrismaClient) {}

  // Invoice methods
  async createInvoice(input: CreateInvoiceInput): Promise<Invoice> {
    return this.prisma.invoice.create({
      data: {
        tenantId: input.tenantId,
        orderId: input.orderId,
        sellerId: input.sellerId,
        invoiceNumber: input.invoiceNumber,
        invoiceType: input.invoiceType,
        issuerId: input.issuerId,
        issuerType: input.issuerType,
        issuerName: input.issuerName,
        issuerTaxNumber: input.issuerTaxNumber,
        issuerAddress: input.issuerAddress,
        issuerPhone: input.issuerPhone,
        issuerEmail: input.issuerEmail,
        buyerId: input.buyerId,
        buyerType: input.buyerType,
        buyerName: input.buyerName,
        buyerTaxNumber: input.buyerTaxNumber,
        buyerAddress: input.buyerAddress,
        buyerPhone: input.buyerPhone,
        buyerEmail: input.buyerEmail,
        subtotal: input.subtotal,
        taxAmount: input.taxAmount,
        totalAmount: input.totalAmount,
        currency: input.currency || 'TRY',
        invoiceDate: input.invoiceDate || new Date(),
        dueDate: input.dueDate,
        notes: input.notes,
        metadata: input.metadata
      }
    });
  }

  async updateInvoice(id: string, input: UpdateInvoiceInput): Promise<Invoice> {
    return this.prisma.invoice.update({
      where: { id },
      data: input
    });
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
        order: true,
        seller: true
      }
    });
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | null> {
    return this.prisma.invoice.findUnique({
      where: { invoiceNumber },
      include: {
        items: true,
        order: true,
        seller: true
      }
    });
  }

  async getInvoicesByOrder(orderId: string): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: { orderId },
      include: {
        items: true,
        seller: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getInvoicesBySeller(sellerId: string): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: { sellerId },
      include: {
        items: true,
        order: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async searchInvoices(params: InvoiceSearchParams): Promise<{
    invoices: Invoice[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const {
      tenantId,
      sellerId,
      orderId,
      invoiceType,
      status,
      dateFrom,
      dateTo,
      page = 1,
      limit = 50
    } = params;

    const where: any = {
      tenantId,
      ...(sellerId && { sellerId }),
      ...(orderId && { orderId }),
      ...(invoiceType && { invoiceType }),
      ...(status && { status }),
      ...(dateFrom && dateTo && {
        invoiceDate: {
          gte: dateFrom,
          lte: dateTo
        }
      })
    };

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: {
          items: true,
          order: true,
          seller: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.invoice.count({ where })
    ]);

    return {
      invoices,
      total,
      page,
      limit,
      hasMore: (page * limit) < total
    };
  }

  async getInvoiceStats(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<{
    totalInvoices: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    statusBreakdown: Record<string, number>;
    typeBreakdown: Record<string, number>;
  }> {
    const where: any = {
      tenantId,
      ...(dateFrom && dateTo && {
        invoiceDate: {
          gte: dateFrom,
          lte: dateTo
        }
      })
    };

    const invoices = await this.prisma.invoice.findMany({
      where,
      select: {
        status: true,
        invoiceType: true,
        totalAmount: true,
        dueDate: true,
        paidDate: true
      }
    });

    const stats = invoices.reduce((acc, invoice) => {
      acc.totalInvoices += 1;
      acc.totalAmount += invoice.totalAmount;

      // Status breakdown
      acc.statusBreakdown[invoice.status] = (acc.statusBreakdown[invoice.status] || 0) + 1;

      // Type breakdown
      acc.typeBreakdown[invoice.invoiceType] = (acc.typeBreakdown[invoice.invoiceType] || 0) + 1;

      // Amount breakdown
      if (invoice.status === 'PAID') {
        acc.paidAmount += invoice.totalAmount;
      } else if (invoice.status === 'SENT' || invoice.status === 'APPROVED') {
        acc.pendingAmount += invoice.totalAmount;
      }

      // Overdue calculation
      if (invoice.dueDate && !invoice.paidDate && new Date() > invoice.dueDate) {
        acc.overdueAmount += invoice.totalAmount;
      }

      return acc;
    }, {
      totalInvoices: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      statusBreakdown: {},
      typeBreakdown: {}
    });

    return stats;
  }

  // InvoiceItem methods
  async createInvoiceItem(input: CreateInvoiceItemInput): Promise<InvoiceItem> {
    return this.prisma.invoiceItem.create({
      data: {
        invoiceId: input.invoiceId,
        tenantId: input.tenantId,
        productId: input.productId,
        productName: input.productName,
        productSku: input.productSku,
        description: input.description,
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        subtotal: input.subtotal,
        taxRate: input.taxRate,
        taxAmount: input.taxAmount,
        totalAmount: input.totalAmount,
        commissionRate: input.commissionRate,
        commissionAmount: input.commissionAmount,
        metadata: input.metadata
      }
    });
  }

  async createInvoiceItems(items: CreateInvoiceItemInput[]): Promise<InvoiceItem[]> {
    return this.prisma.invoiceItem.createMany({
      data: items.map(item => ({
        invoiceId: item.invoiceId,
        tenantId: item.tenantId,
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        taxRate: item.taxRate,
        taxAmount: item.taxAmount,
        totalAmount: item.totalAmount,
        commissionRate: item.commissionRate,
        commissionAmount: item.commissionAmount,
        metadata: item.metadata
      }))
    }).then(() => this.prisma.invoiceItem.findMany({
      where: { invoiceId: items[0]?.invoiceId }
    }));
  }

  async getInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
    return this.prisma.invoiceItem.findMany({
      where: { invoiceId },
      include: {
        product: true
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async updateInvoiceItem(id: string, data: Partial<CreateInvoiceItemInput>): Promise<InvoiceItem> {
    return this.prisma.invoiceItem.update({
      where: { id },
      data: {
        productName: data.productName,
        productSku: data.productSku,
        description: data.description,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        subtotal: data.subtotal,
        taxRate: data.taxRate,
        taxAmount: data.taxAmount,
        totalAmount: data.totalAmount,
        commissionRate: data.commissionRate,
        commissionAmount: data.commissionAmount,
        metadata: data.metadata
      }
    });
  }

  async deleteInvoiceItem(id: string): Promise<{ success: boolean }> {
    try {
      await this.prisma.invoiceItem.delete({
        where: { id }
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }

  // Utility methods
  async getOverdueInvoices(tenantId: string): Promise<Invoice[]> {
    const today = new Date();
    return this.prisma.invoice.findMany({
      where: {
        tenantId,
        status: {
          in: ['SENT', 'APPROVED']
        },
        dueDate: {
          lt: today
        },
        paidDate: null
      },
      include: {
        items: true,
        order: true,
        seller: true
      },
      orderBy: { dueDate: 'asc' }
    });
  }

  async getInvoicesByStatus(tenantId: string, status: InvoiceStatus): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: {
        tenantId,
        status
      },
      include: {
        items: true,
        order: true,
        seller: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getInvoicesByType(tenantId: string, invoiceType: InvoiceType): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: {
        tenantId,
        invoiceType
      },
      include: {
        items: true,
        order: true,
        seller: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getInvoiceSummary(tenantId: string): Promise<{
    totalInvoices: number;
    totalAmount: number;
    paidInvoices: number;
    pendingInvoices: number;
    overdueInvoices: number;
    salesInvoices: number;
    commissionInvoices: number;
  }> {
    const [
      totalInvoices,
      totalAmount,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      salesInvoices,
      commissionInvoices
    ] = await Promise.all([
      this.prisma.invoice.count({ where: { tenantId } }),
      this.prisma.invoice.aggregate({
        where: { tenantId },
        _sum: { totalAmount: true }
      }),
      this.prisma.invoice.count({
        where: { tenantId, status: 'PAID' }
      }),
      this.prisma.invoice.count({
        where: {
          tenantId,
          status: { in: ['SENT', 'APPROVED'] }
        }
      }),
      this.prisma.invoice.count({
        where: {
          tenantId,
          status: { in: ['SENT', 'APPROVED'] },
          dueDate: { lt: new Date() },
          paidDate: null
        }
      }),
      this.prisma.invoice.count({
        where: { tenantId, invoiceType: 'SALES' }
      }),
      this.prisma.invoice.count({
        where: { tenantId, invoiceType: 'COMMISSION' }
      })
    ]);

    return {
      totalInvoices,
      totalAmount: totalAmount._sum.totalAmount || 0,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      salesInvoices,
      commissionInvoices
    };
  }

  async markInvoiceAsPaid(
    invoiceId: string,
    paymentMethod: string,
    paymentReference?: string
  ): Promise<Invoice> {
    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'PAID',
        paidDate: new Date(),
        paymentMethod,
        paymentReference
      }
    });
  }

  async cancelInvoice(invoiceId: string, reason: string): Promise<Invoice> {
    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'CANCELLED',
        notes: reason
      }
    });
  }

  async getInvoicesNeedingExternalSync(tenantId: string): Promise<Invoice[]> {
    return this.prisma.invoice.findMany({
      where: {
        tenantId,
        status: { in: ['DRAFT', 'PENDING'] },
        externalId: null
      },
      include: {
        items: true,
        order: true,
        seller: true
      },
      orderBy: { createdAt: 'asc' }
    });
  }
}

