/**
 * Invoice Port - Interface for invoice operations
 * Supports multiple invoice systems (Logo, Paraşüt, etc.)
 */

export interface InvoiceItem {
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
}

export interface InvoiceParty {
  id: string;
  name: string;
  taxNumber?: string;
  address: string;
  phone?: string;
  email?: string;
  type: 'COMPANY' | 'SELLER' | 'CUSTOMER';
}

export interface CreateInvoiceRequest {
  tenantId: string;
  orderId?: string;
  sellerId?: string;
  invoiceType: 'SALES' | 'COMMISSION' | 'REFUND' | 'CREDIT_NOTE' | 'DEBIT_NOTE';
  issuer: InvoiceParty;
  buyer: InvoiceParty;
  items: InvoiceItem[];
  invoiceDate?: Date;
  dueDate?: Date;
  notes?: string;
  metadata?: any;
}

export interface UpdateInvoiceRequest {
  status?: 'DRAFT' | 'PENDING' | 'APPROVED' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED';
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

export interface InvoiceResult {
  id: string;
  invoiceNumber: string;
  status: string;
  externalId?: string;
  externalStatus?: string;
  totalAmount: number;
  currency: string;
  invoiceDate: Date;
  dueDate?: Date;
  paidDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: any;
}

export interface InvoiceListResult {
  invoices: InvoiceResult[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface InvoiceSearchParams {
  tenantId: string;
  sellerId?: string;
  orderId?: string;
  invoiceType?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

export interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  statusBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  type: 'SALES' | 'COMMISSION';
  template: {
    header: any;
    footer: any;
    styling: any;
  };
  isDefault: boolean;
  isActive: boolean;
}

export interface InvoicePort {
  /**
   * Create a new invoice
   */
  createInvoice(request: CreateInvoiceRequest): Promise<InvoiceResult>;

  /**
   * Update an existing invoice
   */
  updateInvoice(invoiceId: string, request: UpdateInvoiceRequest): Promise<InvoiceResult>;

  /**
   * Get invoice by ID
   */
  getInvoice(invoiceId: string): Promise<InvoiceResult | null>;

  /**
   * Get invoice by invoice number
   */
  getInvoiceByNumber(invoiceNumber: string): Promise<InvoiceResult | null>;

  /**
   * List invoices with search parameters
   */
  listInvoices(params: InvoiceSearchParams): Promise<InvoiceListResult>;

  /**
   * Get invoice statistics
   */
  getInvoiceStats(tenantId: string, dateFrom?: Date, dateTo?: Date): Promise<InvoiceStats>;

  /**
   * Send invoice to customer
   */
  sendInvoice(invoiceId: string, method: 'EMAIL' | 'SMS' | 'POST'): Promise<{ success: boolean; message: string }>;

  /**
   * Mark invoice as paid
   */
  markAsPaid(invoiceId: string, paymentMethod: string, paymentReference?: string): Promise<InvoiceResult>;

  /**
   * Cancel invoice
   */
  cancelInvoice(invoiceId: string, reason: string): Promise<InvoiceResult>;

  /**
   * Generate invoice PDF
   */
  generatePDF(invoiceId: string): Promise<{ pdfUrl: string; expiresAt: Date }>;

  /**
   * Get invoice templates
   */
  getTemplates(tenantId: string): Promise<InvoiceTemplate[]>;

  /**
   * Create invoice template
   */
  createTemplate(tenantId: string, template: Omit<InvoiceTemplate, 'id'>): Promise<InvoiceTemplate>;

  /**
   * Update invoice template
   */
  updateTemplate(templateId: string, template: Partial<InvoiceTemplate>): Promise<InvoiceTemplate>;

  /**
   * Delete invoice template
   */
  deleteTemplate(templateId: string): Promise<{ success: boolean }>;

  /**
   * Health check for invoice system
   */
  healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; message: string; details?: any }>;

  /**
   * Get system capabilities
   */
  getCapabilities(): Promise<{
    supportedTypes: string[];
    supportedFormats: string[];
    supportedPaymentMethods: string[];
    maxItemsPerInvoice: number;
    maxInvoiceAmount: number;
  }>;
}

