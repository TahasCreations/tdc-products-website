import { Job } from 'bullmq';
import { EventJobData } from '../queue/queue-manager.js';
import { PrismaOutboxRepository } from '@tdc/infra';
import { OrderInvoiceHandler } from '../handlers/order-invoice.handler.js';
import { OrderRiskHandler } from '../handlers/order-risk.handler.js';
import { OrderLoyaltyHandler } from '../handlers/order-loyalty.handler.js';

export class EventProcessor {
  private outboxRepo: PrismaOutboxRepository;
  private orderInvoiceHandler: OrderInvoiceHandler;
  private orderRiskHandler: OrderRiskHandler;
  private orderLoyaltyHandler: OrderLoyaltyHandler;

  constructor() {
    this.outboxRepo = new PrismaOutboxRepository();
    this.orderInvoiceHandler = new OrderInvoiceHandler();
    this.orderRiskHandler = new OrderRiskHandler();
    this.orderLoyaltyHandler = new OrderLoyaltyHandler();
  }

  async processEvent(job: Job<EventJobData>): Promise<void> {
    const { eventId, aggregateId, aggregateType, eventType, payload, metadata } = job.data;

    console.log(`🔄 Processing event: ${eventType} for ${aggregateType}:${aggregateId}`);

    try {
      // Route to specific event handlers
      switch (eventType) {
        case 'OrderCreated':
          await this.handleOrderCreated(payload, metadata);
          break;
        case 'OrderCancelled':
          await this.handleOrderCancelled(payload, metadata);
          break;
        case 'PaymentProcessed':
          await this.handlePaymentProcessed(payload, metadata);
          break;
        case 'OrderCompleted':
          await this.handleOrderCompleted(payload, metadata);
          break;
        case 'UserCreated':
          await this.handleUserCreated(payload, metadata);
          break;
        case 'ProductCreated':
          await this.handleProductCreated(payload, metadata);
          break;
        case 'TenantCreated':
          await this.handleTenantCreated(payload, metadata);
          break;
        default:
          console.log(`⚠️ Unknown event type: ${eventType}`);
          await this.handleGenericEvent(eventType, payload, metadata);
      }

      // Mark event as processed
      await this.outboxRepo.markAsProcessed(eventId);
      console.log(`✅ Event ${eventId} processed successfully`);

    } catch (error: any) {
      console.error(`❌ Error processing event ${eventId}:`, error.message);
      
      // Mark event as failed
      await this.outboxRepo.markAsFailed(eventId, error.message);
      
      // Re-throw to trigger BullMQ retry mechanism
      throw error;
    }
  }

  private async handleOrderCreated(payload: any, metadata?: any): Promise<void> {
    console.log('📦 OrderCreated event handler');
    console.log('   Order ID:', payload.orderId);
    console.log('   Customer:', payload.customerEmail);
    console.log('   Total Amount:', payload.totalAmount);
    console.log('   Items Count:', payload.items?.length || 0);

    try {
      // Handle risk assessment
      const riskResult = await this.orderRiskHandler.handleOrderCreated({
        orderId: payload.orderId,
        tenantId: payload.tenantId,
        customerId: payload.customerId,
        sellerId: payload.sellerId,
        totalAmount: payload.totalAmount,
        itemCount: payload.items?.length || 0,
        paymentMethod: payload.paymentMethod,
        shippingAddress: payload.shippingAddress,
        billingAddress: payload.billingAddress,
        customerHistory: payload.customerHistory,
        sellerHistory: payload.sellerHistory,
        deviceInfo: payload.deviceInfo,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
        createdAt: payload.createdAt || new Date()
      });

      if (riskResult.success) {
        console.log(`   Risk Assessment: ${riskResult.riskLevel} (${riskResult.riskScore})`);
        console.log(`   Should Block: ${riskResult.shouldBlock}`);
        console.log(`   Should Hold: ${riskResult.shouldHold}`);
        
        if (riskResult.shouldBlock) {
          console.log('   ⚠️ Order blocked due to high risk');
          return; // Don't continue processing
        }
        
        if (riskResult.shouldHold) {
          console.log('   ⏸️ Order held for review');
          return; // Don't continue processing
        }
      } else {
        console.error(`   Risk assessment failed: ${riskResult.message}`);
      }

    } catch (error) {
      console.error('❌ Error in OrderCreated risk assessment:', error);
      // Continue processing even if risk assessment fails
    }

    // Handle loyalty points
    try {
      const loyaltyResult = await this.orderLoyaltyHandler.handleOrderCreated({
        orderId: payload.orderId,
        tenantId: payload.tenantId,
        customerId: payload.customerId,
        sellerId: payload.sellerId,
        sellerType: payload.sellerType || 'TYPE_A',
        orderAmount: payload.totalAmount,
        orderItems: payload.items || [],
        categories: payload.categories || [],
      });

      if (loyaltyResult.success) {
        console.log(`   Loyalty: ${loyaltyResult.message}`);
        if (loyaltyResult.tierUpgraded) {
          console.log(`   Tier upgraded to: ${loyaltyResult.newTier}`);
        }
      } else {
        console.error(`   Loyalty failed: ${loyaltyResult.message}`);
      }
    } catch (error) {
      console.error('❌ Error in OrderCreated loyalty processing:', error);
      // Continue processing even if loyalty fails
    }

    // Here you would typically:
    // 1. Send order confirmation email
    // 2. Update inventory
    // 3. Notify seller
    // 4. Create shipping label
    // 5. Update analytics
    // 6. Send to external systems

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('✅ OrderCreated event processed');
  }

  private async handleOrderCancelled(payload: any, metadata?: any): Promise<void> {
    console.log('❌ OrderCancelled event handler');
    console.log('   Order ID:', payload.orderId);
    console.log('   Reason:', payload.reason);

    // Handle loyalty points refund
    try {
      const loyaltyResult = await this.orderLoyaltyHandler.handleOrderCancelled({
        orderId: payload.orderId,
        tenantId: payload.tenantId,
        customerId: payload.customerId,
        sellerId: payload.sellerId,
        sellerType: payload.sellerType || 'TYPE_A',
        orderAmount: payload.totalAmount || 0,
        orderItems: payload.items || [],
        categories: payload.categories || [],
        cancelledAt: new Date(),
      });

      if (loyaltyResult.success) {
        console.log(`   Loyalty: ${loyaltyResult.message}`);
      } else {
        console.error(`   Loyalty failed: ${loyaltyResult.message}`);
      }
    } catch (error) {
      console.error('❌ Error in OrderCancelled loyalty processing:', error);
      // Continue processing even if loyalty fails
    }

    // Here you would typically:
    // 1. Refund payment
    // 2. Restore inventory
    // 3. Send cancellation email
    // 4. Update analytics

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('✅ OrderCancelled event processed');
  }

  private async handlePaymentProcessed(payload: any, metadata?: any): Promise<void> {
    console.log('💳 PaymentProcessed event handler');
    console.log('   Payment ID:', payload.paymentId);
    console.log('   Amount:', payload.amount);
    console.log('   Status:', payload.status);

    // Here you would typically:
    // 1. Update order status
    // 2. Send payment confirmation
    // 3. Trigger fulfillment
    // 4. Update seller earnings

    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('✅ PaymentProcessed event processed');
  }

  private async handleOrderCompleted(payload: any, metadata?: any): Promise<void> {
    console.log('✅ OrderCompleted event handler');
    console.log('   Order ID:', payload.orderId);
    console.log('   Seller ID:', payload.sellerId);
    console.log('   Seller Type:', payload.sellerType);
    console.log('   Order Amount:', payload.orderAmount);

    try {
      // Handle invoice creation
      const result = await this.orderInvoiceHandler.handleOrderCompleted({
        orderId: payload.orderId,
        tenantId: payload.tenantId,
        sellerId: payload.sellerId,
        sellerType: payload.sellerType,
        orderAmount: payload.orderAmount,
        commissionAmount: payload.commissionAmount,
        taxAmount: payload.taxAmount,
        netAmount: payload.netAmount,
        customerId: payload.customerId,
        completedAt: payload.completedAt
      });

      if (result.success) {
        if (result.invoiceCreated) {
          console.log(`   Invoice created: ${result.invoiceNumber} (${result.invoiceId})`);
        } else {
          console.log(`   No invoice needed: ${result.message}`);
        }
      } else {
        console.error(`   Invoice creation failed: ${result.message}`);
      }

    } catch (error) {
      console.error('❌ Error in OrderCompleted handler:', error);
      throw error;
    }

    // Handle loyalty points completion
    try {
      const loyaltyResult = await this.orderLoyaltyHandler.handleOrderCompleted({
        orderId: payload.orderId,
        tenantId: payload.tenantId,
        customerId: payload.customerId,
        sellerId: payload.sellerId,
        sellerType: payload.sellerType,
        orderAmount: payload.orderAmount,
        orderItems: payload.items || [],
        categories: payload.categories || [],
        completedAt: payload.completedAt || new Date(),
      });

      if (loyaltyResult.success) {
        console.log(`   Loyalty: ${loyaltyResult.message}`);
        if (loyaltyResult.costSharing) {
          console.log(`   Cost sharing - Platform: ${loyaltyResult.costSharing.platformShare}%, Seller: ${loyaltyResult.costSharing.sellerShare}%`);
        }
      } else {
        console.error(`   Loyalty failed: ${loyaltyResult.message}`);
      }
    } catch (error) {
      console.error('❌ Error in OrderCompleted loyalty processing:', error);
      // Continue processing even if loyalty fails
    }

    console.log('✅ OrderCompleted event processed');
  }

  private async handleUserCreated(payload: any, metadata?: any): Promise<void> {
    console.log('👤 UserCreated event handler');
    console.log('   User ID:', payload.userId);
    console.log('   Email:', payload.email);
    console.log('   Role:', payload.role);

    // Here you would typically:
    // 1. Send welcome email
    // 2. Create user profile
    // 3. Set up preferences
    // 4. Add to marketing lists

    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('✅ UserCreated event processed');
  }

  private async handleProductCreated(payload: any, metadata?: any): Promise<void> {
    console.log('🛍️ ProductCreated event handler');
    console.log('   Product ID:', payload.productId);
    console.log('   Name:', payload.name);
    console.log('   Seller:', payload.sellerId);

    // Here you would typically:
    // 1. Index in search engine
    // 2. Update category counts
    // 3. Send to external marketplaces
    // 4. Update analytics

    await new Promise(resolve => setTimeout(resolve, 400));
    console.log('✅ ProductCreated event processed');
  }

  private async handleTenantCreated(payload: any, metadata?: any): Promise<void> {
    console.log('🏢 TenantCreated event handler');
    console.log('   Tenant ID:', payload.tenantId);
    console.log('   Name:', payload.name);
    console.log('   Slug:', payload.slug);

    // Here you would typically:
    // 1. Set up tenant-specific resources
    // 2. Configure default settings
    // 3. Send onboarding email
    // 4. Create initial data

    await new Promise(resolve => setTimeout(resolve, 200));
    console.log('✅ TenantCreated event processed');
  }

  private async handleGenericEvent(eventType: string, payload: any, metadata?: any): Promise<void> {
    console.log(`🔧 Generic event handler for: ${eventType}`);
    console.log('   Payload:', JSON.stringify(payload, null, 2));
    
    // Generic event processing
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(`✅ Generic event ${eventType} processed`);
  }
}
