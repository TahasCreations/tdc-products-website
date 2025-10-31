// /app/api/webhooks/payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createOrder, handlePaymentSuccess, handlePaymentCancelled } from '../../../(dynamic)/checkout/actions';
// Prisma Client Edge'de çalışmaz, Node.js runtime kullan
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Webhook event'ini kaydet
    await prisma.webhookEvent.create({
      data: {
        provider: 'payment',
        type: body.type || 'unknown',
        payload: body,
      },
    });

    // Event tipine göre işlem yap
    switch (body.type) {
      case 'payment.success':
        if (body.orderId) {
          await handlePaymentSuccess(body.orderId, body.paymentRef);
          console.log('✅ Payment success processed:', body.orderId);
        }
        break;
        
      case 'payment.cancelled':
        if (body.orderId) {
          await handlePaymentCancelled(body.orderId);
          console.log('❌ Payment cancelled processed:', body.orderId);
        }
        break;
        
      case 'payment.failed':
        if (body.orderId) {
          await prisma.order.update({
            where: { id: body.orderId },
            data: { status: 'cancelled' },
          });
          console.log('💥 Payment failed processed:', body.orderId);
        }
        break;
        
      default:
        console.log('ℹ️ Unknown webhook event:', body.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Test endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Payment webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
