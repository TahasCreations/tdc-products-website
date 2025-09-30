import { Router, Request, Response } from 'express';
import { container } from '@tdc/infra';
import { PaymentRequest } from '@tdc/domain';
import { z } from 'zod';

const router = Router();

// Validation schemas
const CheckoutRequestSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('TRY'),
  orderId: z.string().min(1),
  customerId: z.string().min(1),
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'digital_wallet']).default('credit_card'),
  metadata: z.object({
    email: z.string().email().optional(),
    userName: z.string().optional(),
    userAddress: z.string().optional(),
    userPhone: z.string().optional(),
    basket: z.array(z.any()).optional(),
    userIp: z.string().optional(),
  }).optional(),
});

// POST /checkout/create-session
router.post('/create-session', async (req: Request, res: Response) => {
  try {
    // Validate request
    const validatedData = CheckoutRequestSchema.parse(req.body);
    
    // Get payment service from DI container
    const paymentService = container.getPaymentService();
    
    // Create payment request
    const paymentRequest: PaymentRequest = {
      amount: validatedData.amount,
      currency: validatedData.currency,
      orderId: validatedData.orderId,
      customerId: validatedData.customerId,
      paymentMethod: validatedData.paymentMethod,
      metadata: validatedData.metadata,
    };

    // Create checkout session
    const session = await paymentService.createCheckoutSession(paymentRequest);

    res.json({
      success: true,
      data: {
        sessionId: session.sessionId,
        paymentUrl: session.paymentUrl,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Checkout session creation failed',
    });
  }
});

// POST /checkout/capture
router.post('/capture', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.body;
    
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required',
      });
    }

    // Get payment service from DI container
    const paymentService = container.getPaymentService();
    
    // Capture payment
    const result = await paymentService.capturePayment(transactionId);

    res.json({
      success: result.success,
      data: {
        transactionId: result.transactionId,
        status: result.status,
        message: result.message,
      },
    });
  } catch (error) {
    console.error('Payment capture failed:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment capture failed',
    });
  }
});

// GET /checkout/status/:transactionId
router.get('/status/:transactionId', async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    
    // Get payment service from DI container
    const paymentService = container.getPaymentService();
    
    // Get payment status
    const status = await paymentService.getPaymentStatus(transactionId);

    res.json({
      success: true,
      data: {
        transactionId: status.transactionId,
        status: status.status,
        amount: status.amount,
        currency: status.currency,
        createdAt: status.createdAt,
        updatedAt: status.updatedAt,
      },
    });
  } catch (error) {
    console.error('Payment status check failed:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment status check failed',
    });
  }
});

// POST /checkout/refund
router.post('/refund', async (req: Request, res: Response) => {
  try {
    const { transactionId, amount } = req.body;
    
    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'Transaction ID is required',
      });
    }

    // Get payment service from DI container
    const paymentService = container.getPaymentService();
    
    // Process refund
    const result = await paymentService.refundPayment(transactionId, amount);

    res.json({
      success: result.success,
      data: {
        refundId: result.refundId,
        amount: result.amount,
        status: result.status,
        message: result.message,
      },
    });
  } catch (error) {
    console.error('Payment refund failed:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Payment refund failed',
    });
  }
});

export default router;



