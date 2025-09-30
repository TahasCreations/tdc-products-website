/**
 * Commission calculation service for TDC Market
 * Pure functions for calculating seller commissions based on seller type
 */

export enum SellerType {
  TYPE_A = 'TYPE_A', // Company with tax number - 7% + KDV commission
  TYPE_B = 'TYPE_B', // Individual/IG seller - 10% + KDV commission, invoicing by platform
}

export interface CommissionCalculationInput {
  orderAmount: number;
  sellerType: SellerType;
  customCommissionRate?: number; // Optional custom rate override
  taxRate?: number; // Default is 18% KDV for Turkey
}

export interface CommissionCalculationResult {
  baseAmount: number;
  commissionRate: number;
  commissionAmount: number;
  taxRate: number;
  taxAmount: number;
  totalCommission: number;
  sellerAmount: number;
  platformAmount: number;
  isInvoiceEligible: boolean;
  invoiceIssuer: 'SELLER' | 'PLATFORM';
}

/**
 * Get base commission rate based on seller type
 * Pure function - no side effects
 */
export function getBaseCommissionRate(sellerType: SellerType): number {
  switch (sellerType) {
    case SellerType.TYPE_A:
      return 0.07; // 7%
    case SellerType.TYPE_B:
      return 0.10; // 10%
    default:
      throw new Error(`Unknown seller type: ${sellerType}`);
  }
}

/**
 * Get tax rate (KDV) for Turkey
 * Pure function - no side effects
 */
export function getTaxRate(): number {
  return 0.18; // 18% KDV for Turkey
}

/**
 * Check if seller is eligible to issue invoices
 * Pure function - no side effects
 */
export function isInvoiceEligible(sellerType: SellerType): boolean {
  return sellerType === SellerType.TYPE_A;
}

/**
 * Determine who issues the invoice
 * Pure function - no side effects
 */
export function getInvoiceIssuer(sellerType: SellerType): 'SELLER' | 'PLATFORM' {
  return sellerType === SellerType.TYPE_A ? 'SELLER' : 'PLATFORM';
}

/**
 * Calculate commission for a seller
 * Pure function - no side effects, deterministic
 * 
 * @param input - Commission calculation input
 * @returns Commission calculation result
 */
export function calculateCommission(input: CommissionCalculationInput): CommissionCalculationResult {
  const {
    orderAmount,
    sellerType,
    customCommissionRate,
    taxRate = getTaxRate()
  } = input;

  // Validate input
  if (orderAmount <= 0) {
    throw new Error('Order amount must be greater than 0');
  }

  if (taxRate < 0 || taxRate > 1) {
    throw new Error('Tax rate must be between 0 and 1');
  }

  // Get commission rate
  const baseCommissionRate = getBaseCommissionRate(sellerType);
  const commissionRate = customCommissionRate ?? baseCommissionRate;

  if (commissionRate < 0 || commissionRate > 1) {
    throw new Error('Commission rate must be between 0 and 1');
  }

  // Calculate amounts
  const baseAmount = orderAmount;
  const commissionAmount = baseAmount * commissionRate;
  const taxAmount = commissionAmount * taxRate;
  const totalCommission = commissionAmount + taxAmount;
  const sellerAmount = baseAmount - totalCommission;
  const platformAmount = totalCommission;

  return {
    baseAmount,
    commissionRate,
    commissionAmount,
    taxRate,
    taxAmount,
    totalCommission,
    sellerAmount,
    platformAmount,
    isInvoiceEligible: isInvoiceEligible(sellerType),
    invoiceIssuer: getInvoiceIssuer(sellerType)
  };
}

/**
 * Calculate commission for multiple order items
 * Pure function - no side effects
 * 
 * @param items - Array of order items with seller type and amount
 * @returns Commission calculation result for all items
 */
export function calculateCommissionForItems(
  items: Array<{
    amount: number;
    sellerType: SellerType;
    customCommissionRate?: number;
  }>,
  taxRate?: number
): CommissionCalculationResult {
  if (items.length === 0) {
    throw new Error('Items array cannot be empty');
  }

  // Calculate commission for each item
  const itemCommissions = items.map(item => 
    calculateCommission({
      orderAmount: item.amount,
      sellerType: item.sellerType,
      customCommissionRate: item.customCommissionRate,
      taxRate
    })
  );

  // Aggregate results
  const totalBaseAmount = itemCommissions.reduce((sum, item) => sum + item.baseAmount, 0);
  const totalCommissionAmount = itemCommissions.reduce((sum, item) => sum + item.commissionAmount, 0);
  const totalTaxAmount = itemCommissions.reduce((sum, item) => sum + item.taxAmount, 0);
  const totalCommission = itemCommissions.reduce((sum, item) => sum + item.totalCommission, 0);
  const totalSellerAmount = itemCommissions.reduce((sum, item) => sum + item.sellerAmount, 0);
  const totalPlatformAmount = itemCommissions.reduce((sum, item) => sum + item.platformAmount, 0);

  // Calculate weighted average commission rate
  const weightedCommissionRate = totalBaseAmount > 0 
    ? totalCommissionAmount / totalBaseAmount 
    : 0;

  // Check if all sellers are invoice eligible (only if all are TYPE_A)
  const allInvoiceEligible = itemCommissions.every(item => item.isInvoiceEligible);
  const allSameInvoiceIssuer = itemCommissions.every(
    item => item.invoiceIssuer === itemCommissions[0].invoiceIssuer
  );

  return {
    baseAmount: totalBaseAmount,
    commissionRate: weightedCommissionRate,
    commissionAmount: totalCommissionAmount,
    taxRate: taxRate ?? getTaxRate(),
    taxAmount: totalTaxAmount,
    totalCommission,
    sellerAmount: totalSellerAmount,
    platformAmount: totalPlatformAmount,
    isInvoiceEligible: allInvoiceEligible,
    invoiceIssuer: allSameInvoiceIssuer ? itemCommissions[0].invoiceIssuer : 'PLATFORM'
  };
}

/**
 * Validate seller type for commission calculation
 * Pure function - no side effects
 */
export function validateSellerType(sellerType: string): sellerType is SellerType {
  return Object.values(SellerType).includes(sellerType as SellerType);
}

/**
 * Get commission summary for reporting
 * Pure function - no side effects
 */
export function getCommissionSummary(
  calculations: CommissionCalculationResult[]
): {
  totalOrders: number;
  totalBaseAmount: number;
  totalCommission: number;
  totalTax: number;
  totalSellerAmount: number;
  totalPlatformAmount: number;
  averageCommissionRate: number;
  typeABreakdown: {
    count: number;
    totalAmount: number;
    totalCommission: number;
  };
  typeBBreakdown: {
    count: number;
    totalAmount: number;
    totalCommission: number;
  };
} {
  const totalOrders = calculations.length;
  const totalBaseAmount = calculations.reduce((sum, calc) => sum + calc.baseAmount, 0);
  const totalCommission = calculations.reduce((sum, calc) => sum + calc.totalCommission, 0);
  const totalTax = calculations.reduce((sum, calc) => sum + calc.taxAmount, 0);
  const totalSellerAmount = calculations.reduce((sum, calc) => sum + calc.sellerAmount, 0);
  const totalPlatformAmount = calculations.reduce((sum, calc) => sum + calc.platformAmount, 0);
  const averageCommissionRate = totalBaseAmount > 0 ? totalCommission / totalBaseAmount : 0;

  // Separate by seller type (this would need to be passed in the calculations)
  // For now, return aggregated data
  return {
    totalOrders,
    totalBaseAmount,
    totalCommission,
    totalTax,
    totalSellerAmount,
    totalPlatformAmount,
    averageCommissionRate,
    typeABreakdown: {
      count: 0, // Would need seller type info
      totalAmount: 0,
      totalCommission: 0
    },
    typeBBreakdown: {
      count: 0, // Would need seller type info
      totalAmount: 0,
      totalCommission: 0
    }
  };
}

