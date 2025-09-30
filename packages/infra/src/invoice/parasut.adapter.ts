/**
 * Paraşüt Invoice Adapter
 * Integration with Paraşüt Accounting System
 */

import { InvoicePort, CreateInvoiceRequest, UpdateInvoiceRequest, InvoiceResult, InvoiceListResult, InvoiceSearchParams, InvoiceStats, InvoiceTemplate } from '@tdc/domain';
import { validateEnv } from '@tdc/config';

const env = validateEnv();

export interface ParasutConfig {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  companyId: string;
  timeout: number;
  retryAttempts: number;
}

export interface ParasutInvoiceData {
  // Paraşüt specific invoice structure
  data: {
    type: 'sales_invoice' | 'purchase_invoice' | 'e_invoice';
    attributes: {
      invoice_series: string;
      invoice_id: string;
      invoice_date: string;
      due_date?: string;
      net_total: number;
      gross_total: number;
      currency: string;
      exchange_rate: number;
      withholding_rate: number;
      vat_withholding_rate: number;
      invoice_discount_type: string;
      invoice_discount: number;
      cash_sale: boolean;
      payment_date?: string;
      payment_account_id?: string;
      notes?: string;
      tags?: string[];
    };
    relationships: {
      category: {
        data: {
          type: 'item_categories';
          id: string;
        };
      };
      contact: {
        data: {
          type: 'contacts';
          id: string;
        };
      };
      details: {
        data: Array<{
          type: 'sales_invoice_details';
          attributes: {
            product_id?: string;
            description: string;
            quantity: number;
            unit_price: number;
            vat_rate: number;
            discount_type: string;
            discount_value: number;
            excise_duty_type: string;
            excise_duty_value: number;
            communications_tax_rate: number;
            communications_tax_value: number;
          };
        }>;
      };
    };
  };
}

export class ParasutAdapter implements InvoicePort {
  private config: ParasutConfig;
  private apiClient: any; // Paraşüt API client
  private accessToken: string | null = null;
  private tokenExpiresAt: Date | null = null;

  constructor(config?: Partial<ParasutConfig>) {
    this.config = {
      apiUrl: env.PARASUT_API_URL || 'https://api.parasut.com',
      clientId: env.PARASUT_CLIENT_ID || '',
      clientSecret: env.PARASUT_CLIENT_SECRET || '',
      username: env.PARASUT_USERNAME || '',
      password: env.PARASUT_PASSWORD || '',
      companyId: env.PARASUT_COMPANY_ID || '',
      timeout: 30000,
      retryAttempts: 3,
      ...config
    };

    this.initializeApiClient();
  }

  private async initializeApiClient() {
    // Initialize Paraşüt API client
    // This would typically use Paraşüt's official SDK or REST API client
    this.apiClient = {
      // Mock implementation - replace with actual Paraşüt API client
      authenticate: this.authenticate.bind(this),
      createInvoice: this.createInvoiceInParasut.bind(this),
      updateInvoice: this.updateInvoiceInParasut.bind(this),
      getInvoice: this.getInvoiceFromParasut.bind(this),
      listInvoices: this.listInvoicesFromParasut.bind(this),
      sendInvoice: this.sendInvoiceInParasut.bind(this),
      markAsPaid: this.markAsPaidInParasut.bind(this),
      cancelInvoice: this.cancelInvoiceInParasut.bind(this),
      generatePDF: this.generatePDFInParasut.bind(this)
    };

    // Authenticate on initialization
    await this.authenticate();
  }

  private async authenticate(): Promise<void> {
    try {
      console.log('[Paraşüt Adapter] Authenticating...');

      // Check if token is still valid
      if (this.accessToken && this.tokenExpiresAt && this.tokenExpiresAt > new Date()) {
        return;
      }

      // Mock authentication - replace with actual Paraşüt OAuth flow
      this.accessToken = 'mock-access-token-' + Date.now();
      this.tokenExpiresAt = new Date(Date.now() + 3600 * 1000); // 1 hour

      console.log('[Paraşüt Adapter] Authentication successful');

    } catch (error) {
      console.error('[Paraşüt Adapter] Authentication failed:', error);
      throw new Error(`Paraşüt authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createInvoice(request: CreateInvoiceRequest): Promise<InvoiceResult> {
    try {
      console.log('[Paraşüt Adapter] Creating invoice:', request.invoiceType);

      // Ensure we're authenticated
      await this.authenticate();

      // Transform request to Paraşüt format
      const parasutInvoiceData = this.transformToParasutFormat(request);

      // Call Paraşüt API
      const parasutResponse = await this.apiClient.createInvoice(parasutInvoiceData);

      // Transform response to standard format
      const result = this.transformFromParasutFormat(parasutResponse);

      console.log('[Paraşüt Adapter] Invoice created successfully:', result.invoiceNumber);
      return result;

    } catch (error) {
      console.error('[Paraşüt Adapter] Error creating invoice:', error);
      throw new Error(`Paraşüt invoice creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateInvoice(invoiceId: string, request: UpdateInvoiceRequest): Promise<InvoiceResult> {
    try {
      console.log('[Paraşüt Adapter] Updating invoice:', invoiceId);

      // Ensure we're authenticated
      await this.authenticate();

      // Transform request to Paraşüt format
      const parasutUpdateData = this.transformUpdateToParasutFormat(request);

      // Call Paraşüt API
      const parasutResponse = await this.apiClient.updateInvoice(invoiceId, parasutUpdateData);

      // Transform response to standard format
      const result = this.transformFromParasutFormat(parasutResponse);

      console.log('[Paraşüt Adapter] Invoice updated successfully:', result.invoiceNumber);
      return result;

    } catch (error) {
      console.error('[Paraşüt Adapter] Error updating invoice:', error);
      throw new Error(`Paraşüt invoice update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getInvoice(invoiceId: string): Promise<InvoiceResult | null> {
    try {
      console.log('[Paraşüt Adapter] Getting invoice:', invoiceId);

      // Ensure we're authenticated
      await this.authenticate();

      const parasutResponse = await this.apiClient.getInvoice(invoiceId);

      if (!parasutResponse) {
        return null;
      }

      const result = this.transformFromParasutFormat(parasutResponse);
      return result;

    } catch (error) {
      console.error('[Paraşüt Adapter] Error getting invoice:', error);
      throw new Error(`Paraşüt invoice retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<InvoiceResult | null> {
    try {
      console.log('[Paraşüt Adapter] Getting invoice by number:', invoiceNumber);

      // Ensure we're authenticated
      await this.authenticate();

      // Paraşüt API call to get invoice by number
      const parasutResponse = await this.apiClient.getInvoiceByNumber(invoiceNumber);

      if (!parasutResponse) {
        return null;
      }

      const result = this.transformFromParasutFormat(parasutResponse);
      return result;

    } catch (error) {
      console.error('[Paraşüt Adapter] Error getting invoice by number:', error);
      throw new Error(`Paraşüt invoice retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async listInvoices(params: InvoiceSearchParams): Promise<InvoiceListResult> {
    try {
      console.log('[Paraşüt Adapter] Listing invoices with params:', params);

      // Ensure we're authenticated
      await this.authenticate();

      // Transform search params to Paraşüt format
      const parasutSearchParams = this.transformSearchParamsToParasutFormat(params);

      // Call Paraşüt API
      const parasutResponse = await this.apiClient.listInvoices(parasutSearchParams);

      // Transform response to standard format
      const result = this.transformListFromParasutFormat(parasutResponse);
      return result;

    } catch (error) {
      console.error('[Paraşüt Adapter] Error listing invoices:', error);
      throw new Error(`Paraşüt invoice listing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getInvoiceStats(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<InvoiceStats> {
    try {
      console.log('[Paraşüt Adapter] Getting invoice stats for tenant:', tenantId);

      // Ensure we're authenticated
      await this.authenticate();

      // Call Paraşüt API for statistics
      const parasutResponse = await this.apiClient.getInvoiceStats(tenantId, dateFrom, dateTo);

      // Transform response to standard format
      const result = this.transformStatsFromParasutFormat(parasutResponse);
      return result;

    } catch (error) {
      console.error('[Paraşüt Adapter] Error getting invoice stats:', error);
      throw new Error(`Paraşüt invoice stats failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendInvoice(invoiceId: string, method: 'EMAIL' | 'SMS' | 'POST'): Promise<{ success: boolean; message: string }> {
    try {
      console.log('[Paraşüt Adapter] Sending invoice:', invoiceId, 'via', method);

      // Ensure we're authenticated
      await this.authenticate();

      const parasutResponse = await this.apiClient.sendInvoice(invoiceId, method);

      return {
        success: parasutResponse.success || false,
        message: parasutResponse.message || 'Invoice sent successfully'
      };

    } catch (error) {
      console.error('[Paraşüt Adapter] Error sending invoice:', error);
      return {
        success: false,
        message: `Failed to send invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  async markAsPaid(invoiceId: string, paymentMethod: string, paymentReference?: string): Promise<InvoiceResult> {
    try {
      console.log('[Paraşüt Adapter] Marking invoice as paid:', invoiceId);

      // Ensure we're authenticated
      await this.authenticate();

      const parasutResponse = await this.apiClient.markAsPaid(invoiceId, paymentMethod, paymentReference);

      const result = this.transformFromParasutFormat(parasutResponse);
      return result;

    } catch (error) {
      console.error('[Paraşüt Adapter] Error marking invoice as paid:', error);
      throw new Error(`Paraşüt invoice payment marking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async cancelInvoice(invoiceId: string, reason: string): Promise<InvoiceResult> {
    try {
      console.log('[Paraşüt Adapter] Cancelling invoice:', invoiceId);

      // Ensure we're authenticated
      await this.authenticate();

      const parasutResponse = await this.apiClient.cancelInvoice(invoiceId, reason);

      const result = this.transformFromParasutFormat(parasutResponse);
      return result;

    } catch (error) {
      console.error('[Paraşüt Adapter] Error cancelling invoice:', error);
      throw new Error(`Paraşüt invoice cancellation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generatePDF(invoiceId: string): Promise<{ pdfUrl: string; expiresAt: Date }> {
    try {
      console.log('[Paraşüt Adapter] Generating PDF for invoice:', invoiceId);

      // Ensure we're authenticated
      await this.authenticate();

      const parasutResponse = await this.apiClient.generatePDF(invoiceId);

      return {
        pdfUrl: parasutResponse.pdfUrl,
        expiresAt: new Date(parasutResponse.expiresAt)
      };

    } catch (error) {
      console.error('[Paraşüt Adapter] Error generating PDF:', error);
      throw new Error(`Paraşüt PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTemplates(tenantId: string): Promise<InvoiceTemplate[]> {
    try {
      console.log('[Paraşüt Adapter] Getting templates for tenant:', tenantId);

      // Ensure we're authenticated
      await this.authenticate();

      const parasutResponse = await this.apiClient.getTemplates(tenantId);

      return parasutResponse.templates || [];

    } catch (error) {
      console.error('[Paraşüt Adapter] Error getting templates:', error);
      throw new Error(`Paraşüt template retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createTemplate(tenantId: string, template: Omit<InvoiceTemplate, 'id'>): Promise<InvoiceTemplate> {
    try {
      console.log('[Paraşüt Adapter] Creating template for tenant:', tenantId);

      // Ensure we're authenticated
      await this.authenticate();

      const parasutResponse = await this.apiClient.createTemplate(tenantId, template);

      return parasutResponse;

    } catch (error) {
      console.error('[Paraşüt Adapter] Error creating template:', error);
      throw new Error(`Paraşüt template creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateTemplate(templateId: string, template: Partial<InvoiceTemplate>): Promise<InvoiceTemplate> {
    try {
      console.log('[Paraşüt Adapter] Updating template:', templateId);

      // Ensure we're authenticated
      await this.authenticate();

      const parasutResponse = await this.apiClient.updateTemplate(templateId, template);

      return parasutResponse;

    } catch (error) {
      console.error('[Paraşüt Adapter] Error updating template:', error);
      throw new Error(`Paraşüt template update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteTemplate(templateId: string): Promise<{ success: boolean }> {
    try {
      console.log('[Paraşüt Adapter] Deleting template:', templateId);

      // Ensure we're authenticated
      await this.authenticate();

      const parasutResponse = await this.apiClient.deleteTemplate(templateId);

      return { success: parasutResponse.success || false };

    } catch (error) {
      console.error('[Paraşüt Adapter] Error deleting template:', error);
      return { success: false };
    }
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }> {
    try {
      console.log('[Paraşüt Adapter] Performing health check');

      // Ensure we're authenticated
      await this.authenticate();

      // Call Paraşüt API health endpoint
      const parasutResponse = await this.apiClient.healthCheck();

      return {
        status: parasutResponse.status === 'ok' ? 'healthy' : 'unhealthy',
        message: parasutResponse.message || 'Paraşüt API is healthy',
        details: parasutResponse.details
      };

    } catch (error) {
      console.error('[Paraşüt Adapter] Health check failed:', error);
      return {
        status: 'unhealthy',
        message: `Paraşüt API health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
      supportedFormats: ['PDF', 'XML', 'JSON', 'E_INVOICE'],
      supportedPaymentMethods: ['BANK_TRANSFER', 'CREDIT_CARD', 'CASH', 'CHECK', 'E_INVOICE'],
      maxItemsPerInvoice: 500,
      maxInvoiceAmount: 5000000
    };
  }

  // Private helper methods for transformation

  private transformToParasutFormat(request: CreateInvoiceRequest): ParasutInvoiceData {
    const invoiceType = request.invoiceType === 'SALES' ? 'sales_invoice' : 
                       request.invoiceType === 'COMMISSION' ? 'purchase_invoice' : 'sales_invoice';

    return {
      data: {
        type: invoiceType,
        attributes: {
          invoice_series: 'E',
          invoice_id: this.generateInvoiceNumber(),
          invoice_date: request.invoiceDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          due_date: request.dueDate?.toISOString().split('T')[0],
          net_total: request.items.reduce((sum, item) => sum + item.subtotal, 0),
          gross_total: request.items.reduce((sum, item) => sum + item.totalAmount, 0),
          currency: 'TRY',
          exchange_rate: 1,
          withholding_rate: 0,
          vat_withholding_rate: 0,
          invoice_discount_type: 'percentage',
          invoice_discount: 0,
          cash_sale: false,
          payment_date: request.dueDate?.toISOString().split('T')[0],
          notes: request.notes
        },
        relationships: {
          category: {
            data: {
              type: 'item_categories',
              id: 'default-category-id' // This should be mapped from your system
            }
          },
          contact: {
            data: {
              type: 'contacts',
              id: request.buyer.id
            }
          },
          details: {
            data: request.items.map(item => ({
              type: 'sales_invoice_details',
              attributes: {
                product_id: item.productId,
                description: item.description || item.productName,
                quantity: item.quantity,
                unit_price: item.unitPrice,
                vat_rate: item.taxRate,
                discount_type: 'percentage',
                discount_value: 0,
                excise_duty_type: 'percentage',
                excise_duty_value: 0,
                communications_tax_rate: 0,
                communications_tax_value: 0
              }
            }))
          }
        }
      }
    };
  }

  private transformUpdateToParasutFormat(request: UpdateInvoiceRequest): any {
    return {
      data: {
        type: 'sales_invoice',
        attributes: {
          status: request.status?.toLowerCase(),
          payment_date: request.paidDate?.toISOString().split('T')[0],
          notes: request.notes
        }
      }
    };
  }

  private transformSearchParamsToParasutFormat(params: InvoiceSearchParams): any {
    return {
      company_id: this.config.companyId,
      contact_id: params.sellerId,
      invoice_type: params.invoiceType?.toLowerCase(),
      status: params.status?.toLowerCase(),
      start_date: params.dateFrom?.toISOString().split('T')[0],
      end_date: params.dateTo?.toISOString().split('T')[0],
      page: params.page || 1,
      per_page: params.limit || 50
    };
  }

  private transformFromParasutFormat(parasutResponse: any): InvoiceResult {
    const attributes = parasutResponse.data?.attributes || parasutResponse.attributes;
    return {
      id: parasutResponse.data?.id || parasutResponse.id,
      invoiceNumber: attributes?.invoice_id || attributes?.invoice_number,
      status: this.mapParasutStatus(attributes?.status),
      externalId: parasutResponse.data?.id || parasutResponse.id,
      externalStatus: attributes?.status,
      totalAmount: attributes?.gross_total || attributes?.total_amount,
      currency: attributes?.currency || 'TRY',
      invoiceDate: new Date(attributes?.invoice_date || new Date()),
      dueDate: attributes?.due_date ? new Date(attributes.due_date) : undefined,
      paidDate: attributes?.payment_date ? new Date(attributes.payment_date) : undefined,
      createdAt: new Date(parasutResponse.data?.created_at || new Date()),
      updatedAt: new Date(parasutResponse.data?.updated_at || new Date()),
      metadata: parasutResponse.meta
    };
  }

  private transformListFromParasutFormat(parasutResponse: any): InvoiceListResult {
    return {
      invoices: parasutResponse.data?.map((invoice: any) => this.transformFromParasutFormat(invoice)) || [],
      total: parasutResponse.meta?.total_count || 0,
      page: parasutResponse.meta?.current_page || 1,
      limit: parasutResponse.meta?.per_page || 50,
      hasMore: (parasutResponse.meta?.current_page || 1) < (parasutResponse.meta?.total_pages || 1)
    };
  }

  private transformStatsFromParasutFormat(parasutResponse: any): InvoiceStats {
    return {
      totalInvoices: parasutResponse.total_invoices || 0,
      totalAmount: parasutResponse.total_amount || 0,
      paidAmount: parasutResponse.paid_amount || 0,
      pendingAmount: parasutResponse.pending_amount || 0,
      overdueAmount: parasutResponse.overdue_amount || 0,
      statusBreakdown: parasutResponse.status_breakdown || {},
      typeBreakdown: parasutResponse.type_breakdown || {}
    };
  }

  private mapParasutStatus(parasutStatus: string): string {
    const statusMap: Record<string, string> = {
      'draft': 'DRAFT',
      'pending': 'PENDING',
      'approved': 'APPROVED',
      'sent': 'SENT',
      'paid': 'PAID',
      'overdue': 'OVERDUE',
      'cancelled': 'CANCELLED',
      'refunded': 'REFUNDED'
    };
    return statusMap[parasutStatus?.toLowerCase()] || 'DRAFT';
  }

  private generateInvoiceNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PARASUT-${timestamp}-${random}`;
  }

  // Mock Paraşüt API methods - replace with actual Paraşüt API calls
  private async createInvoiceInParasut(data: ParasutInvoiceData): Promise<any> {
    // Mock implementation
    return {
      data: {
        id: `parasut-${Date.now()}`,
        type: 'sales_invoice',
        attributes: {
          invoice_id: data.data.attributes.invoice_id,
          status: 'draft',
          gross_total: data.data.attributes.gross_total,
          currency: data.data.attributes.currency,
          invoice_date: data.data.attributes.invoice_date,
          due_date: data.data.attributes.due_date,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    };
  }

  private async updateInvoiceInParasut(invoiceId: string, data: any): Promise<any> {
    // Mock implementation
    return {
      data: {
        id: invoiceId,
        type: 'sales_invoice',
        attributes: {
          status: data.data.attributes.status || 'draft',
          updated_at: new Date().toISOString()
        }
      }
    };
  }

  private async getInvoiceFromParasut(invoiceId: string): Promise<any> {
    // Mock implementation
    return {
      data: {
        id: invoiceId,
        type: 'sales_invoice',
        attributes: {
          invoice_id: `PARASUT-${invoiceId}`,
          status: 'draft',
          gross_total: 1000,
          currency: 'TRY',
          invoice_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    };
  }

  private async listInvoicesFromParasut(params: any): Promise<any> {
    // Mock implementation
    return {
      data: [],
      meta: {
        total_count: 0,
        current_page: 1,
        total_pages: 1,
        per_page: 50
      }
    };
  }

  private async sendInvoiceInParasut(invoiceId: string, method: string): Promise<any> {
    // Mock implementation
    return {
      success: true,
      message: `Invoice sent via ${method}`
    };
  }

  private async markAsPaidInParasut(invoiceId: string, paymentMethod: string, paymentReference?: string): Promise<any> {
    // Mock implementation
    return {
      data: {
        id: invoiceId,
        type: 'sales_invoice',
        attributes: {
          status: 'paid',
          payment_date: new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        }
      }
    };
  }

  private async cancelInvoiceInParasut(invoiceId: string, reason: string): Promise<any> {
    // Mock implementation
    return {
      data: {
        id: invoiceId,
        type: 'sales_invoice',
        attributes: {
          status: 'cancelled',
          updated_at: new Date().toISOString()
        }
      }
    };
  }

  private async generatePDFInParasut(invoiceId: string): Promise<any> {
    // Mock implementation
    return {
      pdfUrl: `https://api.parasut.com/invoices/${invoiceId}/pdf`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }
}

