import { PrismaClient } from '../prisma-client.js';
import { 
  SellerBalance, 
  SettlementRun, 
  Payout, 
  BalanceStatus, 
  SettlementStatus, 
  PayoutStatus,
  PaymentMethod,
  SellerType
} from '@prisma/client';

export interface CreateSellerBalanceInput {
  tenantId: string;
  sellerId: string;
  orderId?: string;
  orderItemId?: string;
  grossAmount: number;
  commissionAmount: number;
  taxAmount: number;
  netAmount: number;
  commissionRate: number;
  taxRate: number;
  sellerType: SellerType;
  description?: string;
  metadata?: any;
}

export interface UpdateSellerBalanceInput {
  status?: BalanceStatus;
  isSettled?: boolean;
  settledAt?: Date;
  settlementRunId?: string;
  description?: string;
  metadata?: any;
}

export interface CreateSettlementRunInput {
  tenantId: string;
  runType: 'MANUAL' | 'SCHEDULED' | 'ORDER_TRIGGERED';
  periodStart: Date;
  periodEnd: Date;
  description?: string;
  metadata?: any;
}

export interface UpdateSettlementRunInput {
  status?: SettlementStatus;
  totalSellers?: number;
  totalOrders?: number;
  totalGrossAmount?: number;
  totalCommission?: number;
  totalTax?: number;
  totalNetAmount?: number;
  processedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  errorMessage?: string;
}

export interface CreatePayoutInput {
  tenantId: string;
  sellerId: string;
  settlementRunId: string;
  amount: number;
  currency?: string;
  paymentMethod?: PaymentMethod;
  bankAccount?: string;
  bankName?: string;
  accountHolder?: string;
  description?: string;
  metadata?: any;
}

export interface UpdatePayoutInput {
  status?: PayoutStatus;
  processedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  externalId?: string;
  transactionId?: string;
}

export class SettlementRepository {
  constructor(private prisma: PrismaClient) {}

  // SellerBalance methods
  async createSellerBalance(input: CreateSellerBalanceInput): Promise<SellerBalance> {
    return this.prisma.sellerBalance.create({
      data: {
        tenantId: input.tenantId,
        sellerId: input.sellerId,
        orderId: input.orderId,
        orderItemId: input.orderItemId,
        grossAmount: input.grossAmount,
        commissionAmount: input.commissionAmount,
        taxAmount: input.taxAmount,
        netAmount: input.netAmount,
        commissionRate: input.commissionRate,
        taxRate: input.taxRate,
        sellerType: input.sellerType,
        description: input.description,
        metadata: input.metadata
      }
    });
  }

  async updateSellerBalance(id: string, input: UpdateSellerBalanceInput): Promise<SellerBalance> {
    return this.prisma.sellerBalance.update({
      where: { id },
      data: input
    });
  }

  async getSellerBalanceById(id: string): Promise<SellerBalance | null> {
    return this.prisma.sellerBalance.findUnique({
      where: { id },
      include: {
        seller: true,
        order: true,
        settlementRun: true
      }
    });
  }

  async getSellerBalancesBySeller(
    tenantId: string, 
    sellerId: string,
    status?: BalanceStatus
  ): Promise<SellerBalance[]> {
    return this.prisma.sellerBalance.findMany({
      where: {
        tenantId,
        sellerId,
        ...(status && { status })
      },
      include: {
        order: true,
        settlementRun: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getPendingSellerBalances(tenantId: string): Promise<SellerBalance[]> {
    return this.prisma.sellerBalance.findMany({
      where: {
        tenantId,
        status: 'PENDING',
        isSettled: false
      },
      include: {
        seller: true,
        order: true
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async getSellerBalancesBySettlementRun(settlementRunId: string): Promise<SellerBalance[]> {
    return this.prisma.sellerBalance.findMany({
      where: { settlementRunId },
      include: {
        seller: true,
        order: true
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async getSellerBalanceSummary(
    tenantId: string, 
    sellerId: string,
    periodStart?: Date,
    periodEnd?: Date
  ): Promise<{
    totalBalances: number;
    totalGrossAmount: number;
    totalCommissionAmount: number;
    totalTaxAmount: number;
    totalNetAmount: number;
    pendingAmount: number;
    settledAmount: number;
    paidAmount: number;
  }> {
    const where = {
      tenantId,
      sellerId,
      ...(periodStart && periodEnd && {
        createdAt: {
          gte: periodStart,
          lte: periodEnd
        }
      })
    };

    const balances = await this.prisma.sellerBalance.findMany({
      where,
      select: {
        grossAmount: true,
        commissionAmount: true,
        taxAmount: true,
        netAmount: true,
        status: true
      }
    });

    const summary = balances.reduce((acc, balance) => {
      acc.totalBalances += 1;
      acc.totalGrossAmount += balance.grossAmount;
      acc.totalCommissionAmount += balance.commissionAmount;
      acc.totalTaxAmount += balance.taxAmount;
      acc.totalNetAmount += balance.netAmount;

      if (balance.status === 'PENDING') {
        acc.pendingAmount += balance.netAmount;
      } else if (balance.status === 'SETTLED') {
        acc.settledAmount += balance.netAmount;
      } else if (balance.status === 'PAID') {
        acc.paidAmount += balance.netAmount;
      }

      return acc;
    }, {
      totalBalances: 0,
      totalGrossAmount: 0,
      totalCommissionAmount: 0,
      totalTaxAmount: 0,
      totalNetAmount: 0,
      pendingAmount: 0,
      settledAmount: 0,
      paidAmount: 0
    });

    return summary;
  }

  // SettlementRun methods
  async createSettlementRun(input: CreateSettlementRunInput): Promise<SettlementRun> {
    return this.prisma.settlementRun.create({
      data: {
        tenantId: input.tenantId,
        runType: input.runType,
        periodStart: input.periodStart,
        periodEnd: input.periodEnd,
        description: input.description,
        metadata: input.metadata
      }
    });
  }

  async updateSettlementRun(id: string, input: UpdateSettlementRunInput): Promise<SettlementRun> {
    return this.prisma.settlementRun.update({
      where: { id },
      data: input
    });
  }

  async getSettlementRunById(id: string): Promise<SettlementRun | null> {
    return this.prisma.settlementRun.findUnique({
      where: { id },
      include: {
        balances: {
          include: {
            seller: true,
            order: true
          }
        },
        payouts: {
          include: {
            seller: true
          }
        }
      }
    });
  }

  async getSettlementRunsByTenant(
    tenantId: string,
    status?: SettlementStatus,
    limit: number = 50,
    offset: number = 0
  ): Promise<SettlementRun[]> {
    return this.prisma.settlementRun.findMany({
      where: {
        tenantId,
        ...(status && { status })
      },
      include: {
        balances: {
          select: {
            id: true,
            sellerId: true,
            netAmount: true,
            status: true
          }
        },
        payouts: {
          select: {
            id: true,
            sellerId: true,
            amount: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });
  }

  async getSettlementRunSummary(tenantId: string): Promise<{
    totalRuns: number;
    completedRuns: number;
    failedRuns: number;
    totalSettledAmount: number;
    totalPayoutAmount: number;
    pendingRuns: number;
  }> {
    const runs = await this.prisma.settlementRun.findMany({
      where: { tenantId },
      select: {
        status: true,
        totalNetAmount: true,
        payouts: {
          select: {
            amount: true,
            status: true
          }
        }
      }
    });

    const summary = runs.reduce((acc, run) => {
      acc.totalRuns += 1;
      acc.totalSettledAmount += run.totalNetAmount;

      if (run.status === 'COMPLETED') {
        acc.completedRuns += 1;
      } else if (run.status === 'FAILED') {
        acc.failedRuns += 1;
      } else if (run.status === 'PENDING' || run.status === 'PROCESSING') {
        acc.pendingRuns += 1;
      }

      run.payouts.forEach(payout => {
        if (payout.status === 'COMPLETED') {
          acc.totalPayoutAmount += payout.amount;
        }
      });

      return acc;
    }, {
      totalRuns: 0,
      completedRuns: 0,
      failedRuns: 0,
      totalSettledAmount: 0,
      totalPayoutAmount: 0,
      pendingRuns: 0
    });

    return summary;
  }

  // Payout methods
  async createPayout(input: CreatePayoutInput): Promise<Payout> {
    return this.prisma.payout.create({
      data: {
        tenantId: input.tenantId,
        sellerId: input.sellerId,
        settlementRunId: input.settlementRunId,
        amount: input.amount,
        currency: input.currency || 'TRY',
        paymentMethod: input.paymentMethod || 'BANK_TRANSFER',
        bankAccount: input.bankAccount,
        bankName: input.bankName,
        accountHolder: input.accountHolder,
        description: input.description,
        metadata: input.metadata
      }
    });
  }

  async updatePayout(id: string, input: UpdatePayoutInput): Promise<Payout> {
    return this.prisma.payout.update({
      where: { id },
      data: input
    });
  }

  async getPayoutById(id: string): Promise<Payout | null> {
    return this.prisma.payout.findUnique({
      where: { id },
      include: {
        seller: true,
        settlementRun: true
      }
    });
  }

  async getPayoutsBySeller(
    tenantId: string,
    sellerId: string,
    status?: PayoutStatus,
    limit: number = 50,
    offset: number = 0
  ): Promise<Payout[]> {
    return this.prisma.payout.findMany({
      where: {
        tenantId,
        sellerId,
        ...(status && { status })
      },
      include: {
        settlementRun: true
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });
  }

  async getPayoutsBySettlementRun(settlementRunId: string): Promise<Payout[]> {
    return this.prisma.payout.findMany({
      where: { settlementRunId },
      include: {
        seller: true
      },
      orderBy: { createdAt: 'asc' }
    });
  }

  async getPayoutSummary(tenantId: string): Promise<{
    totalPayouts: number;
    completedPayouts: number;
    failedPayouts: number;
    pendingPayouts: number;
    totalAmount: number;
    completedAmount: number;
    failedAmount: number;
    pendingAmount: number;
  }> {
    const payouts = await this.prisma.payout.findMany({
      where: { tenantId },
      select: {
        amount: true,
        status: true
      }
    });

    const summary = payouts.reduce((acc, payout) => {
      acc.totalPayouts += 1;
      acc.totalAmount += payout.amount;

      if (payout.status === 'COMPLETED') {
        acc.completedPayouts += 1;
        acc.completedAmount += payout.amount;
      } else if (payout.status === 'FAILED') {
        acc.failedPayouts += 1;
        acc.failedAmount += payout.amount;
      } else if (payout.status === 'PENDING' || payout.status === 'PROCESSING') {
        acc.pendingPayouts += 1;
        acc.pendingAmount += payout.amount;
      }

      return acc;
    }, {
      totalPayouts: 0,
      completedPayouts: 0,
      failedPayouts: 0,
      pendingPayouts: 0,
      totalAmount: 0,
      completedAmount: 0,
      failedAmount: 0,
      pendingAmount: 0
    });

    return summary;
  }

  // Utility methods
  async markBalancesAsSettled(
    balanceIds: string[],
    settlementRunId: string
  ): Promise<{ count: number }> {
    const result = await this.prisma.sellerBalance.updateMany({
      where: {
        id: { in: balanceIds }
      },
      data: {
        status: 'SETTLED',
        isSettled: true,
        settledAt: new Date(),
        settlementRunId
      }
    });

    return { count: result.count };
  }

  async getSellersWithPendingBalances(tenantId: string): Promise<Array<{
    sellerId: string;
    sellerName: string;
    sellerType: SellerType;
    totalPendingAmount: number;
    balanceCount: number;
  }>> {
    const result = await this.prisma.sellerBalance.groupBy({
      by: ['sellerId'],
      where: {
        tenantId,
        status: 'PENDING',
        isSettled: false
      },
      _sum: {
        netAmount: true
      },
      _count: {
        id: true
      }
    });

    // Get seller details
    const sellerIds = result.map(r => r.sellerId);
    const sellers = await this.prisma.seller.findMany({
      where: {
        id: { in: sellerIds }
      },
      select: {
        id: true,
        businessName: true,
        sellerType: true
      }
    });

    const sellerMap = new Map(sellers.map(s => [s.id, s]));

    return result.map(r => {
      const seller = sellerMap.get(r.sellerId);
      return {
        sellerId: r.sellerId,
        sellerName: seller?.businessName || 'Unknown',
        sellerType: seller?.sellerType || 'TYPE_B',
        totalPendingAmount: r._sum.netAmount || 0,
        balanceCount: r._count.id
      };
    });
  }
}

