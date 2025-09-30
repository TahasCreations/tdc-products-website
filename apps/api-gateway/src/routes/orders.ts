import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaOrderRepository, PrismaOutboxRepository } from '@tdc/infra';
import { env } from '@tdc/config';

const router = Router();

// Validation schemas
const CreateOrderSchema = z.object({
  tenantId: z.string().min(1, 'Tenant ID is required'),
  customerId: z.string().min(1, 'Customer ID is required'),
  sellerId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    variantId: z.string().optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    unitPrice: z.number().min(0, 'Unit price must be positive'),
  })).min(1, 'At least one item is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().optional(),
  customerNote: z.string().optional(),
  shippingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    address1: z.string().min(1, 'Address is required'),
    address2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().default('TR'),
    phone: z.string().optional(),
  }),
  billingAddress: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    company: z.string().optional(),
    address1: z.string().min(1, 'Address is required'),
    address2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().default('TR'),
    phone: z.string().optional(),
  }).optional(),
  paymentMethod: z.string().optional(),
});

// POST /api/orders - Create new order
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = CreateOrderSchema.parse(req.body);
    
    console.log('📦 Creating new order for customer:', validatedData.customerEmail);

    // Calculate totals
    const subtotal = validatedData.items.reduce((sum, item) => 
      sum + (item.unitPrice * item.quantity), 0
    );
    
    const taxRate = 0.18; // 18% KDV
    const taxAmount = subtotal * taxRate;
    const shippingAmount = 0; // Free shipping for now
    const discountAmount = 0; // No discount for now
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create order data
    const orderData = {
      tenantId: validatedData.tenantId,
      orderNumber,
      customerId: validatedData.customerId,
      sellerId: validatedData.sellerId,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      fulfillmentStatus: 'UNFULFILLED',
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      totalAmount,
      customerEmail: validatedData.customerEmail,
      customerPhone: validatedData.customerPhone,
      customerNote: validatedData.customerNote,
      shippingAddress: validatedData.shippingAddress,
      billingAddress: validatedData.billingAddress,
      paymentMethod: validatedData.paymentMethod,
      commissionAmount: 0, // Will be calculated later
      commissionRate: 0, // Will be calculated later
    };

    // Create order items data
    const orderItemsData = validatedData.items.map(item => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
      taxRate,
      taxAmount: (item.unitPrice * item.quantity) * taxRate,
    }));

    // Use transaction to ensure data consistency
    const orderRepo = new PrismaOrderRepository();
    const outboxRepo = new PrismaOutboxRepository();

    // Create order with items
    const order = await orderRepo.create({
      ...orderData,
      items: {
        create: orderItemsData,
      },
    });

    console.log('✅ Order created:', order.id);

    // Create OrderCreated event in outbox
    const orderCreatedEvent = {
      aggregateId: order.id,
      aggregateType: 'Order',
      eventType: 'OrderCreated',
      eventVersion: 1,
      payload: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        tenantId: order.tenantId,
        customerId: order.customerId,
        customerEmail: order.customerEmail,
        totalAmount: order.totalAmount,
        items: orderItemsData.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        shippingAddress: order.shippingAddress,
        billingAddress: order.billingAddress,
        createdAt: order.createdAt,
      },
      metadata: {
        source: 'api-gateway',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };

    // Add event to outbox (this will be processed by the worker)
    await outboxRepo.create(orderCreatedEvent);

    console.log('📤 OrderCreated event added to outbox');

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        items: order.items.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        createdAt: order.createdAt,
      },
      message: 'Order created successfully',
    });

  } catch (error: any) {
    console.error('❌ Error creating order:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orderRepo = new PrismaOrderRepository();
    
    const order = await orderRepo.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });

  } catch (error: any) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// GET /api/orders - List orders
router.get('/', async (req: Request, res: Response) => {
  try {
    const { 
      tenantId, 
      customerId, 
      sellerId, 
      status, 
      limit = '20', 
      offset = '0' 
    } = req.query;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'tenantId is required',
      });
    }

    const orderRepo = new PrismaOrderRepository();
    let orders;

    if (customerId) {
      orders = await orderRepo.findByCustomer(
        tenantId as string, 
        customerId as string,
        parseInt(limit as string),
        parseInt(offset as string)
      );
    } else if (sellerId) {
      orders = await orderRepo.findBySeller(
        tenantId as string, 
        sellerId as string,
        parseInt(limit as string),
        parseInt(offset as string)
      );
    } else if (status) {
      orders = await orderRepo.findByStatus(
        tenantId as string, 
        status as string,
        parseInt(limit as string),
        parseInt(offset as string)
      );
    } else {
      // Default: get recent orders
      orders = await orderRepo.findByCustomer(
        tenantId as string, 
        '', // Empty customerId to get all
        parseInt(limit as string),
        parseInt(offset as string)
      );
    }

    res.json({
      success: true,
      data: orders,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        count: orders.length,
      },
    });

  } catch (error: any) {
    console.error('❌ Error listing orders:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required',
      });
    }

    const orderRepo = new PrismaOrderRepository();
    const outboxRepo = new PrismaOutboxRepository();

    // Update order status
    const order = await orderRepo.updateStatus(id, status);

    // Create OrderStatusChanged event
    const statusChangedEvent = {
      aggregateId: order.id,
      aggregateType: 'Order',
      eventType: 'OrderStatusChanged',
      eventVersion: 1,
      payload: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        oldStatus: order.status,
        newStatus: status,
        changedAt: new Date().toISOString(),
      },
      metadata: {
        source: 'api-gateway',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    };

    // Add event to outbox
    await outboxRepo.create(statusChangedEvent);

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully',
    });

  } catch (error: any) {
    console.error('❌ Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
    });
  }
});

export default router;

