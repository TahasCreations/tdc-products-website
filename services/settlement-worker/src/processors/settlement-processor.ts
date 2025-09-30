import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { 
  SettlementRepository,
  CreateSellerBalanceInput,
  CreateSettlementRunInput,
  CreatePayoutInput
} from '@tdc/infra';
import {
  calculateSettlement,
  calculateSettlementRunSummary,
  validateSettlementRunInput,
  generateSettlementDescription,
  generatePayoutDescription,
  SellerType
} from '@tdc/domain';

export interface SettlementJobData {
  tenantId: string;
  runType: 'MANUAL' | 'SCHEDULED' | 'ORDER_TRIGGERED';
  periodStart: string;
  periodEnd: string;
  description?: string;
  orderIds?: string[]; // For order-triggered settlements
}

export interface OrderSettlementData {
  tenantId: string;
  orderId: string;
  sellerId: string;
  orderAmount: number;
  sellerType: SellerType;
  customCommissionRate?: number;
}

export class SettlementProcessor {
  private prisma: PrismaClient;
  private settlementRepo: SettlementRepository;

  constructor() {
    this.prisma = new PrismaClient();
    this.settlementRepo = new SettlementRepository(this.prisma);
  }

  /**
   * Process settlement run job
   */
  async processSettlementRun(job: Job<SettlementJobData>) {
    const { tenantId, runType, periodStart, periodEnd, description, orderIds } = job.data;
    
    console.log(`[Settlement] Processing settlement run for tenant ${tenantId}`);

    try {
      // Validate input
      const validation = validateSettlementRunInput({
        tenantId,
        runType,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        description
      });

      if (!validation.isValid) {
        throw new Error(`Invalid settlement run input: ${validation.errors.join(', ')}`);
      }

      // Create settlement run
      const settlementRun = await this.settlementRepo.createSettlementRun({
        tenantId,
        runType,
        periodStart: new Date(periodStart),
        periodEnd: new Date(periodEnd),
        description
      });

      console.log(`[Settlement] Created settlement run ${settlementRun.id}`);

      // Update status to processing
      await this.settlementRepo.updateSettlementRun(settlementRun.id, {
        status: 'PROCESSING',
        processedAt: new Date()
      });

      // Get pending balances for the period
      const pendingBalances = await this.settlementRepo.getPendingSellerBalances(tenantId);
      
      // Filter by period if not order-triggered
      const periodStartDate = new Date(periodStart);
      const periodEndDate = new Date(periodEnd);
      
      const filteredBalances = runType === 'ORDER_TRIGGERED' && orderIds
        ? pendingBalances.filter(balance => orderIds.includes(balance.orderId || ''))
        : pendingBalances.filter(balance => 
            balance.createdAt >= periodStartDate && balance.createdAt <= periodEndDate
          );

      if (filteredBalances.length === 0) {
        console.log(`[Settlement] No pending balances found for period`);
        
        await this.settlementRepo.updateSettlementRun(settlementRun.id, {
          status: 'COMPLETED',
          completedAt: new Date(),
          totalSellers: 0,
          totalOrders: 0,
          totalGrossAmount: 0,
          totalCommission: 0,
          totalTax: 0,
          totalNetAmount: 0
        });

        return { success: true, message: 'No balances to settle' };
      }

      // Group balances by seller
      const sellerBalances = new Map<string, typeof filteredBalances>();
      filteredBalances.forEach(balance => {
        if (!sellerBalances.has(balance.sellerId)) {
          sellerBalances.set(balance.sellerId, []);
        }
        sellerBalances.get(balance.sellerId)!.push(balance);
      });

      // Process each seller's balances
      const sellerSettlements: Array<{
        sellerId: string;
        totalOrders: number;
        totalGrossAmount: number;
        totalCommissionAmount: number;
        totalTaxAmount: number;
        totalNetAmount: number;
      }> = [];

      for (const [sellerId, balances] of sellerBalances) {
        const seller = await this.prisma.seller.findUnique({
          where: { id: sellerId },
          select: { businessName: true, sellerType: true }
        });

        if (!seller) {
          console.warn(`[Settlement] Seller ${sellerId} not found, skipping`);
          continue;
        }

        // Calculate seller summary
        const totalOrders = balances.length;
        const totalGrossAmount = balances.reduce((sum, b) => sum + b.grossAmount, 0);
        const totalCommissionAmount = balances.reduce((sum, b) => sum + b.commissionAmount, 0);
        const totalTaxAmount = balances.reduce((sum, b) => sum + b.taxAmount, 0);
        const totalNetAmount = balances.reduce((sum, b) => sum + b.netAmount, 0);

        sellerSettlements.push({
          sellerId,
          totalOrders,
          totalGrossAmount,
          totalCommissionAmount,
          totalTaxAmount,
          totalNetAmount
        });

        // Mark balances as settled
        const balanceIds = balances.map(b => b.id);
        await this.settlementRepo.markBalancesAsSettled(balanceIds, settlementRun.id);

        console.log(`[Settlement] Settled ${totalOrders} orders for seller ${seller.businessName} (${totalNetAmount.toFixed(2)}₺)`);
      }

      // Calculate run summary
      const summary = calculateSettlementRunSummary(sellerSettlements);

      // Update settlement run with summary
      await this.settlementRepo.updateSettlementRun(settlementRun.id, {
        status: 'COMPLETED',
        completedAt: new Date(),
        totalSellers: summary.totalSellers,
        totalOrders: summary.totalOrders,
        totalGrossAmount: summary.totalGrossAmount,
        totalCommission: summary.totalCommission,
        totalTax: summary.totalTax,
        totalNetAmount: summary.totalNetAmount
      });

      // Create payouts for sellers
      await this.createPayoutsForSellers(settlementRun.id, sellerSettlements);

      console.log(`[Settlement] Settlement run ${settlementRun.id} completed successfully`);
      console.log(`[Settlement] Summary: ${summary.totalSellers} sellers, ${summary.totalOrders} orders, ${summary.totalNetAmount.toFixed(2)}₺ total`);

      return {
        success: true,
        settlementRunId: settlementRun.id,
        summary
      };

    } catch (error) {
      console.error(`[Settlement] Settlement run failed:`, error);
      
      // Update settlement run status to failed
      if (settlementRun) {
        await this.settlementRepo.updateSettlementRun(settlementRun.id, {
          status: 'FAILED',
          failedAt: new Date(),
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      throw error;
    }
  }

  /**
   * Process order settlement (create balance for paid order)
   */
  async processOrderSettlement(job: Job<OrderSettlementData>) {
    const { tenantId, orderId, sellerId, orderAmount, sellerType, customCommissionRate } = job.data;
    
    console.log(`[Settlement] Processing order settlement for order ${orderId}`);

    try {
      // Calculate settlement
      const settlement = calculateSettlement({
        orderAmount,
        sellerType,
        customCommissionRate
      });

      // Create seller balance
      const balanceInput: CreateSellerBalanceInput = {
        tenantId,
        sellerId,
        orderId,
        grossAmount: settlement.grossAmount,
        commissionAmount: settlement.commissionAmount,
        taxAmount: settlement.taxAmount,
        netAmount: settlement.netAmount,
        commissionRate: settlement.commissionRate,
        taxRate: settlement.taxRate,
        sellerType,
        description: generateSettlementDescription(
          sellerType,
          1,
          settlement.grossAmount,
          settlement.netAmount,
          settlement.commissionRate
        )
      };

      const balance = await this.settlementRepo.createSellerBalance(balanceInput);

      console.log(`[Settlement] Created balance ${balance.id} for order ${orderId} (${settlement.netAmount.toFixed(2)}₺)`);

      // Create OrderSettled event in outbox
      await this.createOrderSettledEvent(tenantId, orderId, balance.id, settlement);

      return {
        success: true,
        balanceId: balance.id,
        settlement
      };

    } catch (error) {
      console.error(`[Settlement] Order settlement failed for order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Create payouts for sellers
   */
  private async createPayoutsForSellers(
    settlementRunId: string,
    sellerSettlements: Array<{
      sellerId: string;
      totalOrders: number;
      totalGrossAmount: number;
      totalCommissionAmount: number;
      totalTaxAmount: number;
      totalNetAmount: number;
    }>
  ) {
    for (const sellerSettlement of sellerSettlements) {
      const seller = await this.prisma.seller.findUnique({
        where: { id: sellerSettlement.sellerId },
        select: { businessName: true, bankAccount: true, iban: true }
      });

      if (!seller) continue;

      // Only create payout if amount is positive
      if (sellerSettlement.totalNetAmount <= 0) continue;

      const payoutInput: CreatePayoutInput = {
        tenantId: '', // Will be set from settlement run
        sellerId: sellerSettlement.sellerId,
        settlementRunId,
        amount: sellerSettlement.totalNetAmount,
        currency: 'TRY',
        paymentMethod: 'BANK_TRANSFER',
        bankAccount: seller.bankAccount || seller.iban,
        description: generatePayoutDescription(
          seller.businessName,
          sellerSettlement.totalNetAmount,
          sellerSettlement.totalOrders,
          new Date(), // Will be updated with actual dates
          new Date()
        )
      };

      await this.settlementRepo.createPayout(payoutInput);

      console.log(`[Settlement] Created payout for seller ${seller.businessName} (${sellerSettlement.totalNetAmount.toFixed(2)}₺)`);
    }
  }

  /**
   * Create OrderSettled event in outbox
   */
  private async createOrderSettledEvent(
    tenantId: string,
    orderId: string,
    balanceId: string,
    settlement: any
  ) {
    const eventData = {
      orderId,
      balanceId,
      settlement: {
        grossAmount: settlement.grossAmount,
        commissionAmount: settlement.commissionAmount,
        taxAmount: settlement.taxAmount,
        netAmount: settlement.netAmount,
        commissionRate: settlement.commissionRate,
        taxRate: settlement.taxRate
      },
      timestamp: new Date().toISOString()
    };

    await this.prisma.eventOutbox.create({
      data: {
        tenantId,
        aggregateId: orderId,
        aggregateType: 'Order',
        eventType: 'OrderSettled',
        eventData: JSON.stringify(eventData),
        processedAt: null
      }
    });

    console.log(`[Settlement] Created OrderSettled event for order ${orderId}`);
  }

  /**
   * Cleanup method
   */
  async cleanup() {
    await this.prisma.$disconnect();
  }
}

