/**
 * Settlement service - Pure functions for settlement calculations
 * Handles commission calculations and settlement logic
 */

import { SellerType, calculateCommission } from './commission.service.js';

export interface SettlementInput {
  orderAmount: number;
  sellerType: SellerType;
  customCommissionRate?: number;
  taxRate?: number;
  loyaltyDiscount?: number;
  loyaltyCostSharing?: {
    platformShare: number;
    sellerShare: number;
    customerShare: number;
  };
}

export interface SettlementResult {
  grossAmount: number;
  commissionAmount: number;
  taxAmount: number;
  netAmount: number;
  commissionRate: number;
  taxRate: number;
  sellerType: SellerType;
  loyaltyCost?: {
    totalDiscount: number;
    platformShare: number;
    sellerShare: number;
    customerShare: number;
    platformCost: number;
    sellerCost: number;
    customerCost: number;
  };
  breakdown: {
    grossAmount: number;
    commission: {
      rate: number;
      amount: number;
    };
    tax: {
      rate: number;
      amount: number;
    };
    loyalty: {
      discount: number;
      platformCost: number;
      sellerCost: number;
      customerCost: number;
    };
    netAmount: number;
  };
}

export interface SettlementRunInput {
  tenantId: string;
  periodStart: Date;
  periodEnd: Date;
  runType: 'MANUAL' | 'SCHEDULED' | 'ORDER_TRIGGERED';
  description?: string;
}

export interface SettlementRunResult {
  runId: string;
  totalSellers: number;
  totalOrders: number;
  totalGrossAmount: number;
  totalCommission: number;
  totalTax: number;
  totalNetAmount: number;
  sellerBalances: Array<{
    sellerId: string;
    grossAmount: number;
    netAmount: number;
    commissionAmount: number;
    taxAmount: number;
  }>;
}

/**
 * Calculate settlement for a single order
 * Pure function - no side effects
 */
export function calculateSettlement(input: SettlementInput): SettlementResult {
  const { orderAmount, sellerType, customCommissionRate, taxRate, loyaltyDiscount, loyaltyCostSharing } = input;

  if (orderAmount <= 0) {
    throw new Error('Order amount must be positive');
  }

  // Use commission service for calculation
  const commissionResult = calculateCommission({
    orderAmount,
    sellerType,
    customCommissionRate,
    taxRate
  });

  const grossAmount = orderAmount;
  const commissionAmount = commissionResult.commissionAmount;
  const taxAmount = commissionResult.taxAmount;
  let netAmount = commissionResult.sellerAmount;

  // Calculate loyalty cost sharing if applicable
  let loyaltyCost: SettlementResult['loyaltyCost'] | undefined;
  if (loyaltyDiscount && loyaltyDiscount > 0 && loyaltyCostSharing) {
    const platformCost = (loyaltyDiscount * loyaltyCostSharing.platformShare) / 100;
    const sellerCost = (loyaltyDiscount * loyaltyCostSharing.sellerShare) / 100;
    const customerCost = (loyaltyDiscount * loyaltyCostSharing.customerShare) / 100;

    // Adjust net amount by seller's share of loyalty cost
    netAmount -= sellerCost;

    loyaltyCost = {
      totalDiscount: loyaltyDiscount,
      platformShare: loyaltyCostSharing.platformShare,
      sellerShare: loyaltyCostSharing.sellerShare,
      customerShare: loyaltyCostSharing.customerShare,
      platformCost,
      sellerCost,
      customerCost,
    };
  }

  return {
    grossAmount,
    commissionAmount,
    taxAmount,
    netAmount,
    commissionRate: commissionResult.commissionRate,
    taxRate: commissionResult.taxRate,
    sellerType,
    loyaltyCost,
    breakdown: {
      grossAmount,
      commission: {
        rate: commissionResult.commissionRate,
        amount: commissionAmount
      },
      tax: {
        rate: commissionResult.taxRate,
        amount: taxAmount
      },
      loyalty: {
        discount: loyaltyDiscount || 0,
        platformCost: loyaltyCost?.platformCost || 0,
        sellerCost: loyaltyCost?.sellerCost || 0,
        customerCost: loyaltyCost?.customerCost || 0,
      },
      netAmount
    }
  };
}

/**
 * Calculate settlement for multiple orders
 * Pure function - no side effects
 */
export function calculateSettlementForOrders(
  orders: Array<{
    orderId: string;
    sellerId: string;
    amount: number;
    sellerType: SellerType;
    customCommissionRate?: number;
  }>,
  taxRate?: number
): Array<{
  orderId: string;
  sellerId: string;
  settlement: SettlementResult;
}> {
  return orders.map(order => ({
    orderId: order.orderId,
    sellerId: order.sellerId,
    settlement: calculateSettlement({
      orderAmount: order.amount,
      sellerType: order.sellerType,
      customCommissionRate: order.customCommissionRate,
      taxRate
    })
  }));
}

/**
 * Calculate settlement summary for a seller
 * Pure function - no side effects
 */
export function calculateSellerSettlementSummary(
  orders: Array<{
    orderId: string;
    amount: number;
    sellerType: SellerType;
    customCommissionRate?: number;
  }>,
  taxRate?: number
): {
  totalOrders: number;
  totalGrossAmount: number;
  totalCommissionAmount: number;
  totalTaxAmount: number;
  totalNetAmount: number;
  averageCommissionRate: number;
  breakdown: Array<{
    orderId: string;
    grossAmount: number;
    netAmount: number;
    commissionAmount: number;
    taxAmount: number;
  }>;
} {
  if (orders.length === 0) {
    return {
      totalOrders: 0,
      totalGrossAmount: 0,
      totalCommissionAmount: 0,
      totalTaxAmount: 0,
      totalNetAmount: 0,
      averageCommissionRate: 0,
      breakdown: []
    };
  }

  let totalGrossAmount = 0;
  let totalCommissionAmount = 0;
  let totalTaxAmount = 0;
  let totalNetAmount = 0;
  let totalCommissionRate = 0;

  const breakdown = orders.map(order => {
    const settlement = calculateSettlement({
      orderAmount: order.amount,
      sellerType: order.sellerType,
      customCommissionRate: order.customCommissionRate,
      taxRate
    });

    totalGrossAmount += settlement.grossAmount;
    totalCommissionAmount += settlement.commissionAmount;
    totalTaxAmount += settlement.taxAmount;
    totalNetAmount += settlement.netAmount;
    totalCommissionRate += settlement.commissionRate;

    return {
      orderId: order.orderId,
      grossAmount: settlement.grossAmount,
      netAmount: settlement.netAmount,
      commissionAmount: settlement.commissionAmount,
      taxAmount: settlement.taxAmount
    };
  });

  const averageCommissionRate = totalCommissionRate / orders.length;

  return {
    totalOrders: orders.length,
    totalGrossAmount,
    totalCommissionAmount,
    totalTaxAmount,
    totalNetAmount,
    averageCommissionRate,
    breakdown
  };
}

/**
 * Calculate settlement run summary
 * Pure function - no side effects
 */
export function calculateSettlementRunSummary(
  sellerSettlements: Array<{
    sellerId: string;
    totalOrders: number;
    totalGrossAmount: number;
    totalCommissionAmount: number;
    totalTaxAmount: number;
    totalNetAmount: number;
  }>
): {
  totalSellers: number;
  totalOrders: number;
  totalGrossAmount: number;
  totalCommission: number;
  totalTax: number;
  totalNetAmount: number;
  averageCommissionRate: number;
  sellerBreakdown: Array<{
    sellerId: string;
    grossAmount: number;
    netAmount: number;
    commissionAmount: number;
    taxAmount: number;
    orderCount: number;
  }>;
} {
  if (sellerSettlements.length === 0) {
    return {
      totalSellers: 0,
      totalOrders: 0,
      totalGrossAmount: 0,
      totalCommission: 0,
      totalTax: 0,
      totalNetAmount: 0,
      averageCommissionRate: 0,
      sellerBreakdown: []
    };
  }

  const totalSellers = sellerSettlements.length;
  const totalOrders = sellerSettlements.reduce((sum, s) => sum + s.totalOrders, 0);
  const totalGrossAmount = sellerSettlements.reduce((sum, s) => sum + s.totalGrossAmount, 0);
  const totalCommission = sellerSettlements.reduce((sum, s) => sum + s.totalCommissionAmount, 0);
  const totalTax = sellerSettlements.reduce((sum, s) => sum + s.totalTaxAmount, 0);
  const totalNetAmount = sellerSettlements.reduce((sum, s) => sum + s.totalNetAmount, 0);

  const averageCommissionRate = totalGrossAmount > 0 ? totalCommission / totalGrossAmount : 0;

  const sellerBreakdown = sellerSettlements.map(s => ({
    sellerId: s.sellerId,
    grossAmount: s.totalGrossAmount,
    netAmount: s.totalNetAmount,
    commissionAmount: s.totalCommissionAmount,
    taxAmount: s.totalTaxAmount,
    orderCount: s.totalOrders
  }));

  return {
    totalSellers,
    totalOrders,
    totalGrossAmount,
    totalCommission,
    totalTax,
    totalNetAmount,
    averageCommissionRate,
    sellerBreakdown
  };
}

/**
 * Validate settlement run input
 * Pure function - no side effects
 */
export function validateSettlementRunInput(input: SettlementRunInput): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!input.tenantId || input.tenantId.trim().length === 0) {
    errors.push('Tenant ID is required');
  }

  if (!input.periodStart || !(input.periodStart instanceof Date)) {
    errors.push('Valid period start date is required');
  }

  if (!input.periodEnd || !(input.periodEnd instanceof Date)) {
    errors.push('Valid period end date is required');
  }

  if (input.periodStart && input.periodEnd && input.periodStart >= input.periodEnd) {
    errors.push('Period start must be before period end');
  }

  if (!['MANUAL', 'SCHEDULED', 'ORDER_TRIGGERED'].includes(input.runType)) {
    errors.push('Invalid run type');
  }

  // Check if period is not too far in the future
  const now = new Date();
  const maxFutureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  if (input.periodEnd && input.periodEnd > maxFutureDate) {
    errors.push('Period end cannot be more than 30 days in the future');
  }

  // Check if period is not too long
  if (input.periodStart && input.periodEnd) {
    const periodDays = Math.ceil((input.periodEnd.getTime() - input.periodStart.getTime()) / (1000 * 60 * 60 * 24));
    if (periodDays > 90) {
      errors.push('Settlement period cannot exceed 90 days');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Calculate minimum payout amount
 * Pure function - no side effects
 */
export function calculateMinimumPayoutAmount(
  sellerType: SellerType,
  baseAmount: number = 0
): number {
  // Different minimum amounts based on seller type
  const minimumAmounts = {
    [SellerType.TYPE_A]: 100, // Company sellers - higher minimum
    [SellerType.TYPE_B]: 50   // Individual sellers - lower minimum
  };

  const minimumAmount = minimumAmounts[sellerType] || 50;
  return Math.max(minimumAmount, baseAmount);
}

/**
 * Check if payout amount meets minimum requirement
 * Pure function - no side effects
 */
export function isPayoutAmountValid(
  amount: number,
  sellerType: SellerType
): {
  isValid: boolean;
  minimumRequired: number;
  shortfall: number;
} {
  const minimumRequired = calculateMinimumPayoutAmount(sellerType);
  const shortfall = Math.max(0, minimumRequired - amount);

  return {
    isValid: amount >= minimumRequired,
    minimumRequired,
    shortfall
  };
}

/**
 * Calculate payout fees
 * Pure function - no side effects
 */
export function calculatePayoutFees(
  amount: number,
  paymentMethod: 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE' | 'WISE' | 'CASH'
): {
  feeAmount: number;
  feeRate: number;
  netAmount: number;
} {
  const feeRates = {
    BANK_TRANSFER: 0.005, // 0.5%
    PAYPAL: 0.034,        // 3.4%
    STRIPE: 0.029,        // 2.9%
    WISE: 0.004,          // 0.4%
    CASH: 0               // No fee
  };

  const feeRate = feeRates[paymentMethod] || 0;
  const feeAmount = amount * feeRate;
  const netAmount = amount - feeAmount;

  return {
    feeAmount,
    feeRate,
    netAmount
  };
}

/**
 * Generate settlement description
 * Pure function - no side effects
 */
export function generateSettlementDescription(
  sellerType: SellerType,
  orderCount: number,
  grossAmount: number,
  netAmount: number,
  commissionRate: number
): string {
  const sellerTypeText = sellerType === SellerType.TYPE_A ? 'Şirket' : 'Bireysel';
  const commissionPercent = (commissionRate * 100).toFixed(1);
  
  return `${sellerTypeText} satıcı - ${orderCount} sipariş, ${grossAmount.toFixed(2)}₺ brüt, ${netAmount.toFixed(2)}₺ net (${commissionPercent}% komisyon)`;
}

/**
 * Generate payout description
 * Pure function - no side effects
 */
export function generatePayoutDescription(
  sellerName: string,
  amount: number,
  orderCount: number,
  periodStart: Date,
  periodEnd: Date
): string {
  const periodText = `${periodStart.toLocaleDateString('tr-TR')} - ${periodEnd.toLocaleDateString('tr-TR')}`;
  return `${sellerName} - ${amount.toFixed(2)}₺ (${orderCount} sipariş, ${periodText})`;
}
