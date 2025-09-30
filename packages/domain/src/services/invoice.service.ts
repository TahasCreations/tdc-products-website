/**
 * Invoice service - Pure functions for invoice logic
 * Handles invoice type determination and business rules
 */

import { SellerType } from './commission.service.js';

export interface InvoiceCreationInput {
  orderId: string;
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
}

export interface InvoiceCreationResult {
  invoiceType: 'SALES' | 'COMMISSION';
  issuer: {
    id: string;
    name: string;
    taxNumber: string;
    address: string;
    phone?: string;
    email?: string;
    type: 'COMPANY' | 'SELLER';
  };
  buyer: {
    id: string;
    name: string;
    taxNumber?: string;
    address: string;
    phone?: string;
    email?: string;
    type: 'CUSTOMER' | 'SELLER';
  };
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
    commissionRate?: number;
    commissionAmount?: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  notes: string;
}

/**
 * Determine invoice type based on seller type
 * Pure function - no side effects
 */
export function determineInvoiceType(sellerType: SellerType): 'SALES' | 'COMMISSION' {
  switch (sellerType) {
    case SellerType.TYPE_A:
      // Company sellers issue commission invoices (we pay them commission)
      return 'COMMISSION';
    case SellerType.TYPE_B:
      // Individual/IG sellers get sales invoices (we sell on their behalf)
      return 'SALES';
    default:
      throw new Error(`Unknown seller type: ${sellerType}`);
  }
}

/**
 * Determine invoice issuer and buyer based on invoice type
 * Pure function - no side effects
 */
export function determineInvoiceParties(
  invoiceType: 'SALES' | 'COMMISSION',
  customerInfo: InvoiceCreationInput['customerInfo'],
  sellerInfo: InvoiceCreationInput['sellerInfo'],
  companyInfo: {
    id: string;
    name: string;
    taxNumber: string;
    address: string;
    phone?: string;
    email?: string;
  }
): {
  issuer: InvoiceCreationResult['issuer'];
  buyer: InvoiceCreationResult['buyer'];
} {
  if (invoiceType === 'SALES') {
    // For sales invoices: Company issues invoice to customer
    return {
      issuer: {
        id: companyInfo.id,
        name: companyInfo.name,
        taxNumber: companyInfo.taxNumber,
        address: companyInfo.address,
        phone: companyInfo.phone,
        email: companyInfo.email,
        type: 'COMPANY'
      },
      buyer: {
        id: customerInfo.id,
        name: customerInfo.name,
        taxNumber: customerInfo.taxNumber,
        address: customerInfo.address,
        phone: customerInfo.phone,
        email: customerInfo.email,
        type: 'CUSTOMER'
      }
    };
  } else {
    // For commission invoices: Seller issues invoice to company
    return {
      issuer: {
        id: sellerInfo.id,
        name: sellerInfo.name,
        taxNumber: sellerInfo.taxNumber || '',
        address: sellerInfo.address,
        phone: sellerInfo.phone,
        email: sellerInfo.email,
        type: 'SELLER'
      },
      buyer: {
        id: companyInfo.id,
        name: companyInfo.name,
        taxNumber: companyInfo.taxNumber,
        address: companyInfo.address,
        phone: companyInfo.phone,
        email: companyInfo.email,
        type: 'COMPANY'
      }
    };
  }
}

/**
 * Transform order items to invoice items based on invoice type
 * Pure function - no side effects
 */
export function transformItemsForInvoice(
  items: InvoiceCreationInput['items'],
  invoiceType: 'SALES' | 'COMMISSION',
  commissionRate: number
): InvoiceCreationResult['items'] {
  return items.map(item => {
    if (invoiceType === 'SALES') {
      // For sales invoices: Show product details as-is
      return {
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
      };
    } else {
      // For commission invoices: Show commission service details
      const commissionAmount = item.subtotal * commissionRate;
      return {
        productId: item.productId,
        productName: `Komisyon Hizmeti - ${item.productName}`,
        productSku: `COMM-${item.productSku || 'SERVICE'}`,
        description: `${item.productName} ürünü için komisyon hizmeti`,
        quantity: 1,
        unitPrice: commissionAmount,
        subtotal: commissionAmount,
        taxRate: item.taxRate,
        taxAmount: commissionAmount * item.taxRate,
        totalAmount: commissionAmount + (commissionAmount * item.taxRate),
        commissionRate: commissionRate,
        commissionAmount: commissionAmount
      };
    }
  });
}

/**
 * Calculate invoice totals
 * Pure function - no side effects
 */
export function calculateInvoiceTotals(
  items: InvoiceCreationResult['items']
): {
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const taxAmount = items.reduce((sum, item) => sum + item.taxAmount, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100
  };
}

/**
 * Generate invoice notes based on invoice type and order details
 * Pure function - no side effects
 */
export function generateInvoiceNotes(
  invoiceType: 'SALES' | 'COMMISSION',
  orderId: string,
  sellerName: string,
  orderAmount: number,
  commissionAmount: number
): string {
  if (invoiceType === 'SALES') {
    return `Satış Faturası - Sipariş No: ${orderId}\nSatıcı: ${sellerName}\nSipariş Tutarı: ₺${orderAmount.toFixed(2)}`;
  } else {
    return `Komisyon Faturası - Sipariş No: ${orderId}\nSatıcı: ${sellerName}\nKomisyon Tutarı: ₺${commissionAmount.toFixed(2)}`;
  }
}

/**
 * Validate invoice creation input
 * Pure function - no side effects
 */
export function validateInvoiceCreationInput(input: InvoiceCreationInput): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.orderId || input.orderId.trim().length === 0) {
    errors.push('Order ID is required');
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

  if (!input.items || input.items.length === 0) {
    errors.push('At least one item is required');
  }

  // Validate items
  input.items.forEach((item, index) => {
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
 * Main invoice creation function
 * Pure function - no side effects, deterministic
 */
export function createInvoiceData(
  input: InvoiceCreationInput,
  companyInfo: {
    id: string;
    name: string;
    taxNumber: string;
    address: string;
    phone?: string;
    email?: string;
  }
): InvoiceCreationResult {
  // Validate input
  const validation = validateInvoiceCreationInput(input);
  if (!validation.isValid) {
    throw new Error(`Invalid invoice creation input: ${validation.errors.join(', ')}`);
  }

  // Determine invoice type
  const invoiceType = determineInvoiceType(input.sellerType);

  // Determine parties
  const parties = determineInvoiceParties(invoiceType, input.customerInfo, input.sellerInfo, companyInfo);

  // Calculate commission rate
  const commissionRate = input.orderAmount > 0 ? input.commissionAmount / input.orderAmount : 0;

  // Transform items
  const items = transformItemsForInvoice(input.items, invoiceType, commissionRate);

  // Calculate totals
  const totals = calculateInvoiceTotals(items);

  // Generate notes
  const notes = generateInvoiceNotes(
    invoiceType,
    input.orderId,
    input.sellerInfo.name,
    input.orderAmount,
    input.commissionAmount
  );

  return {
    invoiceType,
    issuer: parties.issuer,
    buyer: parties.buyer,
    items,
    subtotal: totals.subtotal,
    taxAmount: totals.taxAmount,
    totalAmount: totals.totalAmount,
    currency: 'TRY',
    notes
  };
}

/**
 * Create multiple invoices for an order (if needed)
 * Pure function - no side effects
 */
export function createMultipleInvoicesForOrder(
  input: InvoiceCreationInput,
  companyInfo: {
    id: string;
    name: string;
    taxNumber: string;
    address: string;
    phone?: string;
    email?: string;
  }
): InvoiceCreationResult[] {
  const invoiceData = createInvoiceData(input, companyInfo);
  return [invoiceData];
}

/**
 * Generate invoice number
 * Pure function - no side effects
 */
export function generateInvoiceNumber(
  invoiceType: 'SALES' | 'COMMISSION',
  tenantId: string,
  year: number = new Date().getFullYear()
): string {
  const prefix = invoiceType === 'SALES' ? 'SF' : 'KF'; // Sales Fatura / Komisyon Fatura
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${prefix}${year}${timestamp}${random}`;
}

/**
 * Calculate invoice due date
 * Pure function - no side effects
 */
export function calculateInvoiceDueDate(
  invoiceDate: Date,
  paymentTerms: number = 30 // days
): Date {
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + paymentTerms);
  return dueDate;
}

/**
 * Check if invoice is overdue
 * Pure function - no side effects
 */
export function isInvoiceOverdue(
  dueDate: Date,
  currentDate: Date = new Date()
): boolean {
  return currentDate > dueDate;
}

/**
 * Calculate invoice aging
 * Pure function - no side effects
 */
export function calculateInvoiceAging(
  invoiceDate: Date,
  currentDate: Date = new Date()
): {
  daysOld: number;
  agingCategory: 'CURRENT' | '1-30' | '31-60' | '61-90' | 'OVER_90';
} {
  const daysOld = Math.floor((currentDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));

  let agingCategory: 'CURRENT' | '1-30' | '31-60' | '61-90' | 'OVER_90';
  if (daysOld <= 0) {
    agingCategory = 'CURRENT';
  } else if (daysOld <= 30) {
    agingCategory = '1-30';
  } else if (daysOld <= 60) {
    agingCategory = '31-60';
  } else if (daysOld <= 90) {
    agingCategory = '61-90';
  } else {
    agingCategory = 'OVER_90';
  }

  return {
    daysOld,
    agingCategory
  };
}

