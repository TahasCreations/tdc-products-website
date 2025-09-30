/**
 * Order Invoice Handler
 * Handles invoice creation when orders are completed
 */

import { PrismaClient } from '@prisma/client';
import { InvoiceService } from '@tdc/infra';
import { 
  createInvoiceForOrder, 
  OrderInvoiceInput, 
  OrderInvoiceResult 
} from '@tdc/domain';
import { SellerType } from '@tdc/domain';

export interface OrderCompletedEvent {
  orderId: string;
  tenantId: string;
  sellerId: string;
  sellerType: 'TYPE_A' | 'TYPE_B';
  orderAmount: number;
  commissionAmount: number;
  taxAmount: number;
  netAmount: number;
  customerId: string;
  completedAt: string;
}

export class OrderInvoiceHandler {
  private prisma: PrismaClient;
  private invoiceService: InvoiceService;

  constructor() {
    this.prisma = new PrismaClient();
    this.invoiceService = new InvoiceService();
  }

  /**
   * Handle order completed event and create invoice if needed
   */
  async handleOrderCompleted(event: OrderCompletedEvent): Promise<{
    success: boolean;
    invoiceCreated: boolean;
    invoiceId?: string;
    invoiceNumber?: string;
    message: string;
  }> {
    try {
      console.log(`[Order Invoice Handler] Processing order completed event for order ${event.orderId}`);

      // Get order details
      const order = await this.prisma.order.findUnique({
        where: { id: event.orderId },
        include: {
          items: {
            include: {
              product: true,
              variant: true
            }
          },
          customer: true,
          seller: true
        }
      });

      if (!order) {
        throw new Error(`Order ${event.orderId} not found`);
      }

      // Get company information
      const companyInfo = await this.getCompanyInfo(event.tenantId);

      // Prepare invoice input
      const invoiceInput: OrderInvoiceInput = {
        orderId: event.orderId,
        tenantId: event.tenantId,
        sellerId: event.sellerId,
        sellerType: event.sellerType as SellerType,
        orderAmount: event.orderAmount,
        commissionAmount: event.commissionAmount,
        taxAmount: event.taxAmount,
        netAmount: event.netAmount,
        customerInfo: {
          id: order.customer.id,
          name: order.customer.firstName + ' ' + order.customer.lastName,
          taxNumber: order.customer.taxNumber,
          address: order.customer.address || '',
          phone: order.customer.phone,
          email: order.customer.email
        },
        sellerInfo: {
          id: order.seller.id,
          name: order.seller.businessName,
          taxNumber: order.seller.taxNumber,
          address: order.seller.address || '',
          phone: order.seller.phone,
          email: order.seller.email
        },
        orderItems: order.items.map(item => ({
          productId: item.productId,
          productName: item.product.name,
          productSku: item.product.sku,
          description: item.variant?.name || item.product.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          taxRate: item.taxRate,
          taxAmount: item.taxAmount,
          totalAmount: item.totalAmount
        })),
        companyInfo
      };

      // Create invoice data
      const invoiceResult = createInvoiceForOrder(invoiceInput);

      if (!invoiceResult.shouldCreateInvoice) {
        console.log(`[Order Invoice Handler] No invoice needed for order ${event.orderId}: ${invoiceResult.reason}`);
        return {
          success: true,
          invoiceCreated: false,
          message: invoiceResult.reason
        };
      }

      // Create invoice via service
      const invoice = await this.invoiceService.createInvoice({
        tenantId: event.tenantId,
        orderId: event.orderId,
        sellerId: event.sellerId,
        invoiceType: invoiceResult.invoiceType,
        issuer: invoiceResult.invoiceData.issuer,
        buyer: invoiceResult.invoiceData.buyer,
        items: invoiceResult.invoiceData.items,
        invoiceDate: new Date(),
        dueDate: this.calculateDueDate(event.sellerType as SellerType),
        notes: invoiceResult.invoiceData.notes,
        metadata: {
          orderId: event.orderId,
          sellerType: event.sellerType,
          orderAmount: event.orderAmount,
          commissionAmount: event.commissionAmount,
          netAmount: event.netAmount
        }
      });

      console.log(`[Order Invoice Handler] Invoice created successfully for order ${event.orderId}: ${invoice.invoiceNumber}`);

      // Create OrderInvoiced event in outbox
      await this.createOrderInvoicedEvent(event.tenantId, event.orderId, invoice.id, invoice.invoiceNumber);

      return {
        success: true,
        invoiceCreated: true,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        message: `${invoiceResult.invoiceType} invoice created successfully`
      };

    } catch (error) {
      console.error(`[Order Invoice Handler] Error processing order completed event for order ${event.orderId}:`, error);
      return {
        success: false,
        invoiceCreated: false,
        message: `Invoice creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Get company information for invoice creation
   */
  private async getCompanyInfo(tenantId: string): Promise<{
    id: string;
    name: string;
    taxNumber: string;
    address: string;
    phone?: string;
    email?: string;
  }> {
    // Get tenant information
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    // Return company information
    // In a real implementation, this would come from company settings
    return {
      id: tenant.id,
      name: tenant.name || 'TDC Market',
      taxNumber: tenant.taxNumber || '1234567890',
      address: tenant.address || 'İstanbul, Türkiye',
      phone: tenant.phone,
      email: tenant.email
    };
  }

  /**
   * Calculate invoice due date based on seller type
   */
  private calculateDueDate(sellerType: SellerType): Date {
    const paymentTerms = sellerType === SellerType.TYPE_A ? 30 : 15; // days
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + paymentTerms);
    return dueDate;
  }

  /**
   * Create OrderInvoiced event in outbox
   */
  private async createOrderInvoicedEvent(
    tenantId: string,
    orderId: string,
    invoiceId: string,
    invoiceNumber: string
  ) {
    const eventData = {
      orderId,
      invoiceId,
      invoiceNumber,
      timestamp: new Date().toISOString()
    };

    await this.prisma.eventOutbox.create({
      data: {
        tenantId,
        aggregateId: orderId,
        aggregateType: 'Order',
        eventType: 'OrderInvoiced',
        eventData: JSON.stringify(eventData),
        processedAt: null
      }
    });

    console.log(`[Order Invoice Handler] Created OrderInvoiced event for order ${orderId}`);
  }

  /**
   * Cleanup method
   */
  async cleanup() {
    await this.prisma.$disconnect();
    await this.invoiceService.cleanup();
  }
}

