/**
 * Order Invoice Service
 * Handles invoice creation when orders are completed
 */

import { SellerType } from './commission.service.js';
import { 
  createInvoiceData, 
  InvoiceCreationInput, 
  InvoiceCreationResult 
} from './invoice.service.js';

export interface OrderInvoiceInput {
  orderId: string;
  tenantId: string;
  sellerId: string;
  sellerType: SellerType;
  orderAmount: number;
  commissionAmount: number;
  taxAmount: number;
  netAmount: number;
  customerInfo: {
    id: string;
    name: string;
    taxNumber?: string;
    address: string;
    phone?: string;
    email?: string;
  };
  sellerInfo: {
    id: string;
    name: string;
    taxNumber?: string;
    address: string;
    phone?: string;
    email?: string;
  };
  orderItems: Array<{
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
  companyInfo: {
    id: string;
    name: string;
    taxNumber: string;
    address: string;
    phone?: string;
    email?: string;
  };
}

export interface OrderInvoiceResult {
  invoiceType: 'SALES' | 'COMMISSION';
  invoiceData: InvoiceCreationResult;
  shouldCreateInvoice: boolean;
  reason: string;
}

/**
 * Determine if invoice should be created for an order
 * Pure function - no side effects
 */
export function shouldCreateInvoiceForOrder(
  sellerType: SellerType,
  orderAmount: number,
  netAmount: number
): {
  shouldCreate: boolean;
  reason: string;
} {
  // Always create invoices for orders above minimum amount
  const minimumAmount = 1; // ₺1 minimum

  if (orderAmount < minimumAmount) {
    return {
      shouldCreate: false,
      reason: `Order amount (₺${orderAmount.toFixed(2)}) is below minimum invoice amount (₺${minimumAmount})`
    };
  }

  if (netAmount <= 0) {
    return {
      shouldCreate: false,
      reason: `Net amount (₺${netAmount.toFixed(2)}) is zero or negative`
    };
  }

  // TYPE_A (Company): Create commission invoice (seller invoices us)
  // TYPE_B (Individual/IG): Create sales invoice (we invoice customer)
  return {
    shouldCreate: true,
    reason: `Invoice required for ${sellerType === SellerType.TYPE_A ? 'commission' : 'sales'} transaction`
  };
}

/**
 * Create invoice data for a completed order
 * Pure function - no side effects
 */
export function createInvoiceForOrder(input: OrderInvoiceInput): OrderInvoiceResult {
  // Check if invoice should be created
  const shouldCreate = shouldCreateInvoiceForOrder(
    input.sellerType,
    input.orderAmount,
    input.netAmount
  );

  if (!shouldCreate.shouldCreate) {
    return {
      invoiceType: input.sellerType === SellerType.TYPE_A ? 'COMMISSION' : 'SALES',
      invoiceData: {} as InvoiceCreationResult, // Empty data
      shouldCreateInvoice: false,
      reason: shouldCreate.reason
    };
  }

  // Transform order data to invoice creation input
  const invoiceInput: InvoiceCreationInput = {
    orderId: input.orderId,
    sellerId: input.sellerId,
    sellerType: input.sellerType,
    orderAmount: input.orderAmount,
    commissionAmount: input.commissionAmount,
    taxAmount: input.taxAmount,
    netAmount: input.netAmount,
    customerInfo: input.customerInfo,
    sellerInfo: input.sellerInfo,
    items: input.orderItems
  };

  // Create invoice data
  const invoiceData = createInvoiceData(invoiceInput, input.companyInfo);

  return {
    invoiceType: invoiceData.invoiceType,
    invoiceData,
    shouldCreateInvoice: true,
    reason: shouldCreate.reason
  };
}

/**
 * Create multiple invoices for an order (if needed)
 * Pure function - no side effects
 */
export function createMultipleInvoicesForOrder(input: OrderInvoiceInput): OrderInvoiceResult[] {
  const result = createInvoiceForOrder(input);
  return [result];
}

/**
 * Validate order invoice input
 * Pure function - no side effects
 */
export function validateOrderInvoiceInput(input: OrderInvoiceInput): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.orderId || input.orderId.trim().length === 0) {
    errors.push('Order ID is required');
  }

  if (!input.tenantId || input.tenantId.trim().length === 0) {
    errors.push('Tenant ID is required');
  }

  if (!input.sellerId || input.sellerId.trim().length === 0) {
    errors.push('Seller ID is required');
  }

  if (input.orderAmount <= 0) {
    errors.push('Order amount must be positive');
  }

  if (input.netAmount <= 0) {
    errors.push('Net amount must be positive');
  }

  if (!input.customerInfo.name || input.customerInfo.name.trim().length === 0) {
    errors.push('Customer name is required');
  }

  if (!input.customerInfo.address || input.customerInfo.address.trim().length === 0) {
    errors.push('Customer address is required');
  }

  if (!input.sellerInfo.name || input.sellerInfo.name.trim().length === 0) {
    errors.push('Seller name is required');
  }

  if (!input.sellerInfo.address || input.sellerInfo.address.trim().length === 0) {
    errors.push('Seller address is required');
  }

  if (!input.companyInfo.name || input.companyInfo.name.trim().length === 0) {
    errors.push('Company name is required');
  }

  if (!input.companyInfo.taxNumber || input.companyInfo.taxNumber.trim().length === 0) {
    errors.push('Company tax number is required');
  }

  if (!input.orderItems || input.orderItems.length === 0) {
    errors.push('At least one order item is required');
  }

  // Validate order items
  input.orderItems.forEach((item, index) => {
    if (!item.productName || item.productName.trim().length === 0) {
      errors.push(`Item ${index + 1}: Product name is required`);
    }
    if (item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Quantity must be positive`);
    }
    if (item.unitPrice < 0) {
      errors.push(`Item ${index + 1}: Unit price cannot be negative`);
    }
  });

  // Validate seller type specific requirements
  if (input.sellerType === SellerType.TYPE_A) {
    if (!input.sellerInfo.taxNumber || input.sellerInfo.taxNumber.trim().length === 0) {
      errors.push('Company seller tax number is required for commission invoices');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Generate invoice creation summary
 * Pure function - no side effects
 */
export function generateInvoiceSummary(result: OrderInvoiceResult): {
  summary: string;
  details: string[];
} {
  const details: string[] = [];

  if (!result.shouldCreateInvoice) {
    return {
      summary: 'No invoice will be created',
      details: [result.reason]
    };
  }

  const invoiceTypeText = result.invoiceType === 'SALES' ? 'Sales Invoice' : 'Commission Invoice';
  const issuerText = result.invoiceType === 'SALES' ? 'Company' : 'Seller';
  const buyerText = result.invoiceType === 'SALES' ? 'Customer' : 'Company';

  details.push(`Invoice Type: ${invoiceTypeText}`);
  details.push(`Issuer: ${issuerText} (${result.invoiceData.issuer.name})`);
  details.push(`Buyer: ${buyerText} (${result.invoiceData.buyer.name})`);
  details.push(`Total Amount: ₺${result.invoiceData.totalAmount.toFixed(2)}`);
  details.push(`Items: ${result.invoiceData.items.length}`);
  details.push(`Reason: ${result.reason}`);

  return {
    summary: `${invoiceTypeText} will be created`,
    details
  };
}

/**
 * Check if order requires immediate invoice creation
 * Pure function - no side effects
 */
export function requiresImmediateInvoiceCreation(
  sellerType: SellerType,
  orderAmount: number
): boolean {
  // Always create invoices immediately for completed orders
  // This can be customized based on business rules
  return orderAmount > 0;
}

/**
 * Get invoice creation priority
 * Pure function - no side effects
 */
export function getInvoiceCreationPriority(
  sellerType: SellerType,
  orderAmount: number
): 'HIGH' | 'NORMAL' | 'LOW' {
  // High priority for large orders
  if (orderAmount >= 10000) {
    return 'HIGH';
  }

  // High priority for company sellers (commission invoices)
  if (sellerType === SellerType.TYPE_A) {
    return 'HIGH';
  }

  // Normal priority for regular orders
  return 'NORMAL';
}

/**
 * Calculate invoice due date based on seller type
 * Pure function - no side effects
 */
export function calculateInvoiceDueDate(
  sellerType: SellerType,
  invoiceDate: Date = new Date()
): Date {
  // Company sellers (TYPE_A): 30 days for commission invoices
  // Individual sellers (TYPE_B): 15 days for sales invoices
  const paymentTerms = sellerType === SellerType.TYPE_A ? 30 : 15;
  
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + paymentTerms);
  return dueDate;
}

/**
 * Generate invoice notes based on order and seller type
 * Pure function - no side effects
 */
export function generateInvoiceNotes(
  orderId: string,
  sellerType: SellerType,
  sellerName: string,
  orderAmount: number,
  commissionAmount: number
): string {
  if (sellerType === SellerType.TYPE_A) {
    return `Komisyon Faturası\nSipariş No: ${orderId}\nSatıcı: ${sellerName}\nKomisyon Tutarı: ₺${commissionAmount.toFixed(2)}`;
  } else {
    return `Satış Faturası\nSipariş No: ${orderId}\nSatıcı: ${sellerName}\nSipariş Tutarı: ₺${orderAmount.toFixed(2)}`;
  }
}

