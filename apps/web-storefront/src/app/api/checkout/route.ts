import { NextRequest, NextResponse } from 'next/server';
import { container } from '@tdc/infra';
import { PaymentRequest } from '@tdc/domain';
import { z } from 'zod';

// Validation schema
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validatedData = CheckoutRequestSchema.parse(body);
    
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

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.sessionId,
        paymentUrl: session.paymentUrl,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Checkout session creation failed',
      },
      { status: 400 }
    );
  }
}


