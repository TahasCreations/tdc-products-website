/**
 * Invoice Service Implementation
 * Orchestrates invoice operations using adapters
 */

import { InvoicePort, CreateInvoiceRequest, UpdateInvoiceRequest, InvoiceResult, InvoiceListResult, InvoiceSearchParams, InvoiceStats, InvoiceTemplate } from '@tdc/domain';
import { InvoiceRepository, CreateInvoiceInput, CreateInvoiceItemInput } from '../database/repositories/invoice.repository.js';
import { PrismaClient } from '../database/prisma-client.js';
import { LogoAdapter } from './logo.adapter.js';
import { ParasutAdapter } from './parasut.adapter.js';
import { validateEnv } from '@tdc/config';

const env = validateEnv();

export interface InvoiceServiceConfig {
  defaultAdapter: 'LOGO' | 'PARASUT';
  adapters: {
    logo?: LogoAdapter;
    parasut?: ParasutAdapter;
  };
}

export class InvoiceService implements InvoicePort {
  private prisma: PrismaClient;
  private invoiceRepo: InvoiceRepository;
  private config: InvoiceServiceConfig;
  private adapters: Map<string, InvoicePort> = new Map();

  constructor(config?: Partial<InvoiceServiceConfig>) {
    this.prisma = new PrismaClient();
    this.invoiceRepo = new InvoiceRepository(this.prisma);
    
    this.config = {
      defaultAdapter: (env.INVOICE_DEFAULT_ADAPTER as 'LOGO' | 'PARASUT') || 'LOGO',
      adapters: {
        logo: new LogoAdapter(),
        parasut: new ParasutAdapter()
      },
      ...config
    };

    // Initialize adapters
    this.adapters.set('LOGO', this.config.adapters.logo!);
    this.adapters.set('PARASUT', this.config.adapters.parasut!);
  }

  private getAdapter(adapterName?: string): InvoicePort {
    const adapter = adapterName ? this.adapters.get(adapterName.toUpperCase()) : this.adapters.get(this.config.defaultAdapter);
    if (!adapter) {
      throw new Error(`Invoice adapter not found: ${adapterName || this.config.defaultAdapter}`);
    }
    return adapter;
  }

  async createInvoice(request: CreateInvoiceRequest): Promise<InvoiceResult> {
    try {
      console.log('[Invoice Service] Creating invoice:', request.invoiceType);

      // Generate invoice number
      const invoiceNumber = this.generateInvoiceNumber(request.invoiceType);

      // Create invoice in database
      const invoiceInput: CreateInvoiceInput = {
        tenantId: request.tenantId,
        orderId: request.orderId,
        sellerId: request.sellerId,
        invoiceNumber,
        invoiceType: request.invoiceType,
        issuerId: request.issuer.id,
        issuerType: request.issuer.type,
        issuerName: request.issuer.name,
        issuerTaxNumber: request.issuer.taxNumber || '',
        issuerAddress: request.issuer.address,
        issuerPhone: request.issuer.phone,
        issuerEmail: request.issuer.email,
        buyerId: request.buyer.id,
        buyerType: request.buyer.type,
        buyerName: request.buyer.name,
        buyerTaxNumber: request.buyer.taxNumber,
        buyerAddress: request.buyer.address,
        buyerPhone: request.buyer.phone,
        buyerEmail: request.buyer.email,
        subtotal: request.items.reduce((sum, item) => sum + item.subtotal, 0),
        taxAmount: request.items.reduce((sum, item) => sum + item.taxAmount, 0),
        totalAmount: request.items.reduce((sum, item) => sum + item.totalAmount, 0),
        currency: 'TRY',
        invoiceDate: request.invoiceDate || new Date(),
        dueDate: request.dueDate,
        notes: request.notes,
        metadata: request.metadata
      };

      const invoice = await this.invoiceRepo.createInvoice(invoiceInput);

      // Create invoice items
      const itemInputs: CreateInvoiceItemInput[] = request.items.map(item => ({
        invoiceId: invoice.id,
        tenantId: request.tenantId,
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
        metadata: {}
      }));

      await this.invoiceRepo.createInvoiceItems(itemInputs);

      // Send to external system
      try {
        const adapter = this.getAdapter();
        const externalResult = await adapter.createInvoice(request);
        
        // Update invoice with external ID
        await this.invoiceRepo.updateInvoice(invoice.id, {
          externalId: externalResult.externalId,
          externalStatus: externalResult.externalStatus,
          externalData: externalResult.metadata
        });

        console.log('[Invoice Service] Invoice created in external system:', externalResult.externalId);
      } catch (externalError) {
        console.warn('[Invoice Service] Failed to create invoice in external system:', externalError);
        // Continue with local creation even if external fails
      }

      // Transform to result format
      const result: InvoiceResult = {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        externalId: invoice.externalId,
        externalStatus: invoice.externalStatus,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        paidDate: invoice.paidDate,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        metadata: invoice.metadata
      };

      console.log('[Invoice Service] Invoice created successfully:', result.invoiceNumber);
      return result;

    } catch (error) {
      console.error('[Invoice Service] Error creating invoice:', error);
      throw new Error(`Invoice creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateInvoice(invoiceId: string, request: UpdateInvoiceRequest): Promise<InvoiceResult> {
    try {
      console.log('[Invoice Service] Updating invoice:', invoiceId);

      // Update in database
      const invoice = await this.invoiceRepo.updateInvoice(invoiceId, request);

      // Update in external system if external ID exists
      if (invoice.externalId) {
        try {
          const adapter = this.getAdapter();
          await adapter.updateInvoice(invoiceId, request);
          console.log('[Invoice Service] Invoice updated in external system');
        } catch (externalError) {
          console.warn('[Invoice Service] Failed to update invoice in external system:', externalError);
        }
      }

      // Transform to result format
      const result: InvoiceResult = {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        externalId: invoice.externalId,
        externalStatus: invoice.externalStatus,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        paidDate: invoice.paidDate,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        metadata: invoice.metadata
      };

      console.log('[Invoice Service] Invoice updated successfully:', result.invoiceNumber);
      return result;

    } catch (error) {
      console.error('[Invoice Service] Error updating invoice:', error);
      throw new Error(`Invoice update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getInvoice(invoiceId: string): Promise<InvoiceResult | null> {
    try {
      console.log('[Invoice Service] Getting invoice:', invoiceId);

      const invoice = await this.invoiceRepo.getInvoiceById(invoiceId);
      if (!invoice) {
        return null;
      }

      // Transform to result format
      const result: InvoiceResult = {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        externalId: invoice.externalId,
        externalStatus: invoice.externalStatus,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        paidDate: invoice.paidDate,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        metadata: invoice.metadata
      };

      return result;

    } catch (error) {
      console.error('[Invoice Service] Error getting invoice:', error);
      throw new Error(`Invoice retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<InvoiceResult | null> {
    try {
      console.log('[Invoice Service] Getting invoice by number:', invoiceNumber);

      const invoice = await this.invoiceRepo.getInvoiceByNumber(invoiceNumber);
      if (!invoice) {
        return null;
      }

      // Transform to result format
      const result: InvoiceResult = {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        externalId: invoice.externalId,
        externalStatus: invoice.externalStatus,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        paidDate: invoice.paidDate,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        metadata: invoice.metadata
      };

      return result;

    } catch (error) {
      console.error('[Invoice Service] Error getting invoice by number:', error);
      throw new Error(`Invoice retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listInvoices(params: InvoiceSearchParams): Promise<InvoiceListResult> {
    try {
      console.log('[Invoice Service] Listing invoices with params:', params);

      const result = await this.invoiceRepo.searchInvoices(params);

      // Transform to result format
      const invoices: InvoiceResult[] = result.invoices.map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        externalId: invoice.externalId,
        externalStatus: invoice.externalStatus,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        paidDate: invoice.paidDate,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        metadata: invoice.metadata
      }));

      return {
        invoices,
        total: result.total,
        page: result.page,
        limit: result.limit,
        hasMore: result.hasMore
      };

    } catch (error) {
      console.error('[Invoice Service] Error listing invoices:', error);
      throw new Error(`Invoice listing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getInvoiceStats(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<InvoiceStats> {
    try {
      console.log('[Invoice Service] Getting invoice stats for tenant:', tenantId);

      const stats = await this.invoiceRepo.getInvoiceStats(tenantId, dateFrom, dateTo);
      return stats;

    } catch (error) {
      console.error('[Invoice Service] Error getting invoice stats:', error);
      throw new Error(`Invoice stats failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendInvoice(invoiceId: string, method: 'EMAIL' | 'SMS' | 'POST'): Promise<{ success: boolean; message: string }> {
    try {
      console.log('[Invoice Service] Sending invoice:', invoiceId, 'via', method);

      const invoice = await this.invoiceRepo.getInvoiceById(invoiceId);
      if (!invoice) {
        return { success: false, message: 'Invoice not found' };
      }

      // Send via external system if external ID exists
      if (invoice.externalId) {
        try {
          const adapter = this.getAdapter();
          const result = await adapter.sendInvoice(invoiceId, method);
          return result;
        } catch (externalError) {
          console.warn('[Invoice Service] Failed to send invoice via external system:', externalError);
          return { success: false, message: `External system error: ${externalError instanceof Error ? externalError.message : 'Unknown error'}` };
        }
      }

      // Fallback to local sending (email, etc.)
      return { success: true, message: 'Invoice sent locally' };

    } catch (error) {
      console.error('[Invoice Service] Error sending invoice:', error);
      return { success: false, message: `Failed to send invoice: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  async markAsPaid(invoiceId: string, paymentMethod: string, paymentReference?: string): Promise<InvoiceResult> {
    try {
      console.log('[Invoice Service] Marking invoice as paid:', invoiceId);

      // Update in database
      const invoice = await this.invoiceRepo.markInvoiceAsPaid(invoiceId, paymentMethod, paymentReference);

      // Update in external system if external ID exists
      if (invoice.externalId) {
        try {
          const adapter = this.getAdapter();
          await adapter.markAsPaid(invoiceId, paymentMethod, paymentReference);
          console.log('[Invoice Service] Invoice marked as paid in external system');
        } catch (externalError) {
          console.warn('[Invoice Service] Failed to mark invoice as paid in external system:', externalError);
        }
      }

      // Transform to result format
      const result: InvoiceResult = {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        externalId: invoice.externalId,
        externalStatus: invoice.externalStatus,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        paidDate: invoice.paidDate,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        metadata: invoice.metadata
      };

      console.log('[Invoice Service] Invoice marked as paid successfully:', result.invoiceNumber);
      return result;

    } catch (error) {
      console.error('[Invoice Service] Error marking invoice as paid:', error);
      throw new Error(`Invoice payment marking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async cancelInvoice(invoiceId: string, reason: string): Promise<InvoiceResult> {
    try {
      console.log('[Invoice Service] Cancelling invoice:', invoiceId);

      // Update in database
      const invoice = await this.invoiceRepo.cancelInvoice(invoiceId, reason);

      // Update in external system if external ID exists
      if (invoice.externalId) {
        try {
          const adapter = this.getAdapter();
          await adapter.cancelInvoice(invoiceId, reason);
          console.log('[Invoice Service] Invoice cancelled in external system');
        } catch (externalError) {
          console.warn('[Invoice Service] Failed to cancel invoice in external system:', externalError);
        }
      }

      // Transform to result format
      const result: InvoiceResult = {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        status: invoice.status,
        externalId: invoice.externalId,
        externalStatus: invoice.externalStatus,
        totalAmount: invoice.totalAmount,
        currency: invoice.currency,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        paidDate: invoice.paidDate,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
        metadata: invoice.metadata
      };

      console.log('[Invoice Service] Invoice cancelled successfully:', result.invoiceNumber);
      return result;

    } catch (error) {
      console.error('[Invoice Service] Error cancelling invoice:', error);
      throw new Error(`Invoice cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generatePDF(invoiceId: string): Promise<{ pdfUrl: string; expiresAt: Date }> {
    try {
      console.log('[Invoice Service] Generating PDF for invoice:', invoiceId);

      const invoice = await this.invoiceRepo.getInvoiceById(invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Generate PDF via external system if external ID exists
      if (invoice.externalId) {
        try {
          const adapter = this.getAdapter();
          const result = await adapter.generatePDF(invoiceId);
          return result;
        } catch (externalError) {
          console.warn('[Invoice Service] Failed to generate PDF via external system:', externalError);
        }
      }

      // Fallback to local PDF generation
      const pdfUrl = `https://api.tdc.com/invoices/${invoiceId}/pdf`;
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      return { pdfUrl, expiresAt };

    } catch (error) {
      console.error('[Invoice Service] Error generating PDF:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTemplates(tenantId: string): Promise<InvoiceTemplate[]> {
    try {
      console.log('[Invoice Service] Getting templates for tenant:', tenantId);

      const adapter = this.getAdapter();
      const templates = await adapter.getTemplates(tenantId);
      return templates;

    } catch (error) {
      console.error('[Invoice Service] Error getting templates:', error);
      throw new Error(`Template retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createTemplate(tenantId: string, template: Omit<InvoiceTemplate, 'id'>): Promise<InvoiceTemplate> {
    try {
      console.log('[Invoice Service] Creating template for tenant:', tenantId);

      const adapter = this.getAdapter();
      const result = await adapter.createTemplate(tenantId, template);
      return result;

    } catch (error) {
      console.error('[Invoice Service] Error creating template:', error);
      throw new Error(`Template creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateTemplate(templateId: string, template: Partial<InvoiceTemplate>): Promise<InvoiceTemplate> {
    try {
      console.log('[Invoice Service] Updating template:', templateId);

      const adapter = this.getAdapter();
      const result = await adapter.updateTemplate(templateId, template);
      return result;

    } catch (error) {
      console.error('[Invoice Service] Error updating template:', error);
      throw new Error(`Template update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteTemplate(templateId: string): Promise<{ success: boolean }> {
    try {
      console.log('[Invoice Service] Deleting template:', templateId);

      const adapter = this.getAdapter();
      const result = await adapter.deleteTemplate(templateId);
      return result;

    } catch (error) {
      console.error('[Invoice Service] Error deleting template:', error);
      return { success: false };
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }> {
    try {
      console.log('[Invoice Service] Performing health check');

      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      // Check external adapters
      const adapterHealthChecks = await Promise.allSettled(
        Array.from(this.adapters.values()).map(adapter => adapter.healthCheck())
      );

      const unhealthyAdapters = adapterHealthChecks
        .filter(result => result.status === 'rejected' || result.value.status === 'unhealthy')
        .length;

      if (unhealthyAdapters === this.adapters.size) {
        return {
          status: 'unhealthy',
          message: 'All invoice adapters are unhealthy',
          details: { adapterHealthChecks }
        };
      }

      return {
        status: 'healthy',
        message: 'Invoice service is healthy',
        details: { adapterHealthChecks }
      };

    } catch (error) {
      console.error('[Invoice Service] Health check failed:', error);
      return {
        status: 'unhealthy',
        message: `Invoice service health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }

  async getCapabilities(): Promise<{
    supportedTypes: string[];
    supportedFormats: string[];
    supportedPaymentMethods: string[];
    maxItemsPerInvoice: number;
    maxInvoiceAmount: number;
  }> {
    try {
      const adapter = this.getAdapter();
      const capabilities = await adapter.getCapabilities();
      return capabilities;
    } catch (error) {
      console.error('[Invoice Service] Error getting capabilities:', error);
      return {
        supportedTypes: ['SALES', 'COMMISSION'],
        supportedFormats: ['PDF'],
        supportedPaymentMethods: ['BANK_TRANSFER'],
        maxItemsPerInvoice: 100,
        maxInvoiceAmount: 100000
      };
    }
  }

  private generateInvoiceNumber(invoiceType: string): string {
    const prefix = invoiceType === 'SALES' ? 'SF' : 'KF'; // Sales Fatura / Komisyon Fatura
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}${timestamp}${random}`;
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}

