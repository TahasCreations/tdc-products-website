/**
 * Logo Invoice Adapter
 * Integration with Logo Invoice Management System
 */

import { InvoicePort, CreateInvoiceRequest, UpdateInvoiceRequest, InvoiceResult, InvoiceListResult, InvoiceSearchParams, InvoiceStats, InvoiceTemplate } from '@tdc/domain';
import { validateEnv } from '@tdc/config';

const env = validateEnv();

export interface LogoConfig {
  apiUrl: string;
  apiKey: string;
  companyId: string;
  username: string;
  password: string;
  timeout: number;
  retryAttempts: number;
}

export interface LogoInvoiceData {
  // Logo specific invoice structure
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  customerId: string;
  customerName: string;
  customerTaxNumber?: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  items: Array<{
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
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  metadata?: any;
}

export class LogoAdapter implements InvoicePort {
  private config: LogoConfig;
  private apiClient: any; // Logo API client

  constructor(config?: Partial<LogoConfig>) {
    this.config = {
      apiUrl: env.LOGO_API_URL || 'https://api.logo.com.tr',
      apiKey: env.LOGO_API_KEY || '',
      companyId: env.LOGO_COMPANY_ID || '',
      username: env.LOGO_USERNAME || '',
      password: env.LOGO_PASSWORD || '',
      timeout: 30000,
      retryAttempts: 3,
      ...config
    };

    this.initializeApiClient();
  }

  private initializeApiClient() {
    // Initialize Logo API client
    // This would typically use Logo's official SDK or REST API client
    this.apiClient = {
      // Mock implementation - replace with actual Logo API client
      createInvoice: this.createInvoiceInLogo.bind(this),
      updateInvoice: this.updateInvoiceInLogo.bind(this),
      getInvoice: this.getInvoiceFromLogo.bind(this),
      listInvoices: this.listInvoicesFromLogo.bind(this),
      sendInvoice: this.sendInvoiceInLogo.bind(this),
      markAsPaid: this.markAsPaidInLogo.bind(this),
      cancelInvoice: this.cancelInvoiceInLogo.bind(this),
      generatePDF: this.generatePDFInLogo.bind(this)
    };
  }

  async createInvoice(request: CreateInvoiceRequest): Promise<InvoiceResult> {
    try {
      console.log('[Logo Adapter] Creating invoice:', request.invoiceType);

      // Transform request to Logo format
      const logoInvoiceData = this.transformToLogoFormat(request);

      // Call Logo API
      const logoResponse = await this.apiClient.createInvoice(logoInvoiceData);

      // Transform response to standard format
      const result = this.transformFromLogoFormat(logoResponse);

      console.log('[Logo Adapter] Invoice created successfully:', result.invoiceNumber);
      return result;

    } catch (error) {
      console.error('[Logo Adapter] Error creating invoice:', error);
      throw new Error(`Logo invoice creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateInvoice(invoiceId: string, request: UpdateInvoiceRequest): Promise<InvoiceResult> {
    try {
      console.log('[Logo Adapter] Updating invoice:', invoiceId);

      // Transform request to Logo format
      const logoUpdateData = this.transformUpdateToLogoFormat(request);

      // Call Logo API
      const logoResponse = await this.apiClient.updateInvoice(invoiceId, logoUpdateData);

      // Transform response to standard format
      const result = this.transformFromLogoFormat(logoResponse);

      console.log('[Logo Adapter] Invoice updated successfully:', result.invoiceNumber);
      return result;

    } catch (error) {
      console.error('[Logo Adapter] Error updating invoice:', error);
      throw new Error(`Logo invoice update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getInvoice(invoiceId: string): Promise<InvoiceResult | null> {
    try {
      console.log('[Logo Adapter] Getting invoice:', invoiceId);

      const logoResponse = await this.apiClient.getInvoice(invoiceId);

      if (!logoResponse) {
        return null;
      }

      const result = this.transformFromLogoFormat(logoResponse);
      return result;

    } catch (error) {
      console.error('[Logo Adapter] Error getting invoice:', error);
      throw new Error(`Logo invoice retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<InvoiceResult | null> {
    try {
      console.log('[Logo Adapter] Getting invoice by number:', invoiceNumber);

      // Logo API call to get invoice by number
      const logoResponse = await this.apiClient.getInvoiceByNumber(invoiceNumber);

      if (!logoResponse) {
        return null;
      }

      const result = this.transformFromLogoFormat(logoResponse);
      return result;

    } catch (error) {
      console.error('[Logo Adapter] Error getting invoice by number:', error);
      throw new Error(`Logo invoice retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listInvoices(params: InvoiceSearchParams): Promise<InvoiceListResult> {
    try {
      console.log('[Logo Adapter] Listing invoices with params:', params);

      // Transform search params to Logo format
      const logoSearchParams = this.transformSearchParamsToLogoFormat(params);

      // Call Logo API
      const logoResponse = await this.apiClient.listInvoices(logoSearchParams);

      // Transform response to standard format
      const result = this.transformListFromLogoFormat(logoResponse);
      return result;

    } catch (error) {
      console.error('[Logo Adapter] Error listing invoices:', error);
      throw new Error(`Logo invoice listing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getInvoiceStats(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<InvoiceStats> {
    try {
      console.log('[Logo Adapter] Getting invoice stats for tenant:', tenantId);

      // Call Logo API for statistics
      const logoResponse = await this.apiClient.getInvoiceStats(tenantId, dateFrom, dateTo);

      // Transform response to standard format
      const result = this.transformStatsFromLogoFormat(logoResponse);
      return result;

    } catch (error) {
      console.error('[Logo Adapter] Error getting invoice stats:', error);
      throw new Error(`Logo invoice stats failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendInvoice(invoiceId: string, method: 'EMAIL' | 'SMS' | 'POST'): Promise<{ success: boolean; message: string }> {
    try {
      console.log('[Logo Adapter] Sending invoice:', invoiceId, 'via', method);

      const logoResponse = await this.apiClient.sendInvoice(invoiceId, method);

      return {
        success: logoResponse.success || false,
        message: logoResponse.message || 'Invoice sent successfully'
      };

    } catch (error) {
      console.error('[Logo Adapter] Error sending invoice:', error);
      return {
        success: false,
        message: `Failed to send invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async markAsPaid(invoiceId: string, paymentMethod: string, paymentReference?: string): Promise<InvoiceResult> {
    try {
      console.log('[Logo Adapter] Marking invoice as paid:', invoiceId);

      const logoResponse = await this.apiClient.markAsPaid(invoiceId, paymentMethod, paymentReference);

      const result = this.transformFromLogoFormat(logoResponse);
      return result;

    } catch (error) {
      console.error('[Logo Adapter] Error marking invoice as paid:', error);
      throw new Error(`Logo invoice payment marking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async cancelInvoice(invoiceId: string, reason: string): Promise<InvoiceResult> {
    try {
      console.log('[Logo Adapter] Cancelling invoice:', invoiceId);

      const logoResponse = await this.apiClient.cancelInvoice(invoiceId, reason);

      const result = this.transformFromLogoFormat(logoResponse);
      return result;

    } catch (error) {
      console.error('[Logo Adapter] Error cancelling invoice:', error);
      throw new Error(`Logo invoice cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generatePDF(invoiceId: string): Promise<{ pdfUrl: string; expiresAt: Date }> {
    try {
      console.log('[Logo Adapter] Generating PDF for invoice:', invoiceId);

      const logoResponse = await this.apiClient.generatePDF(invoiceId);

      return {
        pdfUrl: logoResponse.pdfUrl,
        expiresAt: new Date(logoResponse.expiresAt)
      };

    } catch (error) {
      console.error('[Logo Adapter] Error generating PDF:', error);
      throw new Error(`Logo PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTemplates(tenantId: string): Promise<InvoiceTemplate[]> {
    try {
      console.log('[Logo Adapter] Getting templates for tenant:', tenantId);

      const logoResponse = await this.apiClient.getTemplates(tenantId);

      return logoResponse.templates || [];

    } catch (error) {
      console.error('[Logo Adapter] Error getting templates:', error);
      throw new Error(`Logo template retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createTemplate(tenantId: string, template: Omit<InvoiceTemplate, 'id'>): Promise<InvoiceTemplate> {
    try {
      console.log('[Logo Adapter] Creating template for tenant:', tenantId);

      const logoResponse = await this.apiClient.createTemplate(tenantId, template);

      return logoResponse;

    } catch (error) {
      console.error('[Logo Adapter] Error creating template:', error);
      throw new Error(`Logo template creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateTemplate(templateId: string, template: Partial<InvoiceTemplate>): Promise<InvoiceTemplate> {
    try {
      console.log('[Logo Adapter] Updating template:', templateId);

      const logoResponse = await this.apiClient.updateTemplate(templateId, template);

      return logoResponse;

    } catch (error) {
      console.error('[Logo Adapter] Error updating template:', error);
      throw new Error(`Logo template update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteTemplate(templateId: string): Promise<{ success: boolean }> {
    try {
      console.log('[Logo Adapter] Deleting template:', templateId);

      const logoResponse = await this.apiClient.deleteTemplate(templateId);

      return { success: logoResponse.success || false };

    } catch (error) {
      console.error('[Logo Adapter] Error deleting template:', error);
      return { success: false };
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }> {
    try {
      console.log('[Logo Adapter] Performing health check');

      // Call Logo API health endpoint
      const logoResponse = await this.apiClient.healthCheck();

      return {
        status: logoResponse.status === 'ok' ? 'healthy' : 'unhealthy',
        message: logoResponse.message || 'Logo API is healthy',
        details: logoResponse.details
      };

    } catch (error) {
      console.error('[Logo Adapter] Health check failed:', error);
      return {
        status: 'unhealthy',
        message: `Logo API health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
    return {
      supportedTypes: ['SALES', 'COMMISSION', 'REFUND', 'CREDIT_NOTE', 'DEBIT_NOTE'],
      supportedFormats: ['PDF', 'XML', 'JSON'],
      supportedPaymentMethods: ['BANK_TRANSFER', 'CREDIT_CARD', 'CASH', 'CHECK'],
      maxItemsPerInvoice: 1000,
      maxInvoiceAmount: 1000000
    };
  }

  // Private helper methods for transformation

  private transformToLogoFormat(request: CreateInvoiceRequest): LogoInvoiceData {
    return {
      invoiceNumber: this.generateInvoiceNumber(),
      invoiceDate: request.invoiceDate?.toISOString() || new Date().toISOString(),
      dueDate: request.dueDate?.toISOString(),
      customerId: request.buyer.id,
      customerName: request.buyer.name,
      customerTaxNumber: request.buyer.taxNumber,
      customerAddress: request.buyer.address,
      customerPhone: request.buyer.phone,
      customerEmail: request.buyer.email,
      items: request.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        taxRate: item.taxRate,
        taxAmount: item.taxAmount,
        totalAmount: item.totalAmount
      })),
      subtotal: request.items.reduce((sum, item) => sum + item.subtotal, 0),
      taxAmount: request.items.reduce((sum, item) => sum + item.taxAmount, 0),
      totalAmount: request.items.reduce((sum, item) => sum + item.totalAmount, 0),
      currency: 'TRY',
      notes: request.notes,
      metadata: request.metadata
    };
  }

  private transformUpdateToLogoFormat(request: UpdateInvoiceRequest): any {
    return {
      status: request.status,
      paidDate: request.paidDate?.toISOString(),
      paymentMethod: request.paymentMethod,
      paymentReference: request.paymentReference,
      paymentNotes: request.paymentNotes,
      externalId: request.externalId,
      externalStatus: request.externalStatus,
      externalData: request.externalData,
      notes: request.notes,
      metadata: request.metadata
    };
  }

  private transformSearchParamsToLogoFormat(params: InvoiceSearchParams): any {
    return {
      tenantId: params.tenantId,
      sellerId: params.sellerId,
      orderId: params.orderId,
      invoiceType: params.invoiceType,
      status: params.status,
      dateFrom: params.dateFrom?.toISOString(),
      dateTo: params.dateTo?.toISOString(),
      page: params.page || 1,
      limit: params.limit || 50
    };
  }

  private transformFromLogoFormat(logoResponse: any): InvoiceResult {
    return {
      id: logoResponse.id,
      invoiceNumber: logoResponse.invoiceNumber,
      status: logoResponse.status,
      externalId: logoResponse.externalId,
      externalStatus: logoResponse.externalStatus,
      totalAmount: logoResponse.totalAmount,
      currency: logoResponse.currency,
      invoiceDate: new Date(logoResponse.invoiceDate),
      dueDate: logoResponse.dueDate ? new Date(logoResponse.dueDate) : undefined,
      paidDate: logoResponse.paidDate ? new Date(logoResponse.paidDate) : undefined,
      createdAt: new Date(logoResponse.createdAt),
      updatedAt: new Date(logoResponse.updatedAt),
      metadata: logoResponse.metadata
    };
  }

  private transformListFromLogoFormat(logoResponse: any): InvoiceListResult {
    return {
      invoices: logoResponse.invoices.map((invoice: any) => this.transformFromLogoFormat(invoice)),
      total: logoResponse.total,
      page: logoResponse.page,
      limit: logoResponse.limit,
      hasMore: logoResponse.hasMore
    };
  }

  private transformStatsFromLogoFormat(logoResponse: any): InvoiceStats {
    return {
      totalInvoices: logoResponse.totalInvoices,
      totalAmount: logoResponse.totalAmount,
      paidAmount: logoResponse.paidAmount,
      pendingAmount: logoResponse.pendingAmount,
      overdueAmount: logoResponse.overdueAmount,
      statusBreakdown: logoResponse.statusBreakdown,
      typeBreakdown: logoResponse.typeBreakdown
    };
  }

  private generateInvoiceNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `LOGO-${timestamp}-${random}`;
  }

  // Mock Logo API methods - replace with actual Logo API calls
  private async createInvoiceInLogo(data: LogoInvoiceData): Promise<any> {
    // Mock implementation
    return {
      id: `logo-${Date.now()}`,
      invoiceNumber: data.invoiceNumber,
      status: 'DRAFT',
      totalAmount: data.totalAmount,
      currency: data.currency,
      invoiceDate: data.invoiceDate,
      dueDate: data.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private async updateInvoiceInLogo(invoiceId: string, data: any): Promise<any> {
    // Mock implementation
    return {
      id: invoiceId,
      status: data.status || 'DRAFT',
      updatedAt: new Date().toISOString()
    };
  }

  private async getInvoiceFromLogo(invoiceId: string): Promise<any> {
    // Mock implementation
    return {
      id: invoiceId,
      invoiceNumber: `LOGO-${invoiceId}`,
      status: 'DRAFT',
      totalAmount: 1000,
      currency: 'TRY',
      invoiceDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private async listInvoicesFromLogo(params: any): Promise<any> {
    // Mock implementation
    return {
      invoices: [],
      total: 0,
      page: 1,
      limit: 50,
      hasMore: false
    };
  }

  private async sendInvoiceInLogo(invoiceId: string, method: string): Promise<any> {
    // Mock implementation
    return {
      success: true,
      message: `Invoice sent via ${method}`
    };
  }

  private async markAsPaidInLogo(invoiceId: string, paymentMethod: string, paymentReference?: string): Promise<any> {
    // Mock implementation
    return {
      id: invoiceId,
      status: 'PAID',
      paidDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private async cancelInvoiceInLogo(invoiceId: string, reason: string): Promise<any> {
    // Mock implementation
    return {
      id: invoiceId,
      status: 'CANCELLED',
      updatedAt: new Date().toISOString()
    };
  }

  private async generatePDFInLogo(invoiceId: string): Promise<any> {
    // Mock implementation
    return {
      pdfUrl: `https://api.logo.com.tr/invoices/${invoiceId}/pdf`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }
}

