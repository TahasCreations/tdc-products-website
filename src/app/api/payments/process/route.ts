import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

interface PaymentRequest {
  method: string;
  request: {
    amount: number;
    currency: string;
    orderId: string;
    customerInfo: {
      email: string;
      phone: string;
      name: string;
    };
    description: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { method, request: paymentRequest }: PaymentRequest = await request.json();

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Validate payment request
    if (!paymentRequest.amount || paymentRequest.amount <= 0) {
      return NextResponse.json({ error: 'Geçersiz ödeme tutarı' }, { status: 400 });
    }

    if (!paymentRequest.customerInfo.email || !paymentRequest.customerInfo.name) {
      return NextResponse.json({ error: 'Müşteri bilgileri eksik' }, { status: 400 });
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Process payment based on method
    const paymentResult = await processPaymentByMethod(method, paymentRequest, transactionId);

    if (!paymentResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: paymentResult.error,
        transactionId 
      }, { status: 400 });
    }

    // Save payment record to database
    const { data: paymentRecord, error: dbError } = await supabase
      .from('payments')
      .insert({
        transaction_id: transactionId,
        order_id: paymentRequest.orderId,
        amount: paymentRequest.amount,
        currency: paymentRequest.currency,
        payment_method: method,
        customer_email: paymentRequest.customerInfo.email,
        customer_name: paymentRequest.customerInfo.name,
        customer_phone: paymentRequest.customerInfo.phone,
        description: paymentRequest.description,
        status: 'completed',
        provider_response: paymentResult.providerResponse,
        fees: paymentResult.fees,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Payment succeeded but database save failed - this is a critical issue
      return NextResponse.json({ 
        success: false, 
        error: 'Ödeme kaydedilemedi',
        transactionId 
      }, { status: 500 });
    }

    // Update order status if orderId is provided
    if (paymentRequest.orderId) {
      await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          payment_id: transactionId,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentRequest.orderId);
    }

    // Send confirmation email (simulated)
    await sendPaymentConfirmation(paymentRequest.customerInfo.email, {
      transactionId,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      method: method
    });

    return NextResponse.json({
      success: true,
      transactionId,
      amount: paymentRequest.amount,
      currency: paymentRequest.currency,
      fees: paymentResult.fees,
      netAmount: paymentRequest.amount - paymentResult.fees,
      paymentRecord
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Ödeme işlemi sırasında hata oluştu' },
      { status: 500 }
    );
  }
}

async function processPaymentByMethod(method: string, request: any, transactionId: string) {
  try {
    switch (method) {
      case 'credit-card':
        return await processCreditCardPayment(request, transactionId);
      
      case 'bank-transfer':
        return await processBankTransfer(request, transactionId);
      
      case 'bitcoin':
      case 'ethereum':
        return await processCryptoPayment(method, request, transactionId);
      
      case 'mobile-payment':
        return await processMobilePayment(request, transactionId);
      
      case 'paypal':
        return await processPayPalPayment(request, transactionId);
      
      case 'apple-pay':
      case 'google-pay':
        return await processDigitalWalletPayment(method, request, transactionId);
      
      default:
        return { success: false, error: 'Desteklenmeyen ödeme yöntemi' };
    }
  } catch (error) {
    return { success: false, error: 'Ödeme işlemi başarısız' };
  }
}

async function processCreditCardPayment(request: any, transactionId: string) {
  // Simulate iyzico or other credit card processor
  const success = Math.random() > 0.05; // 95% success rate
  
  if (!success) {
    return { 
      success: false, 
      error: 'Kredi kartı işlemi reddedildi' 
    };
  }

  const fees = (request.amount * 0.029) + 0.30; // 2.9% + 0.30 TRY

  return {
    success: true,
    fees,
    providerResponse: {
      provider: 'iyzico',
      transactionId: `IYZ-${Date.now()}`,
      status: 'approved',
      authCode: Math.random().toString(36).substr(2, 8).toUpperCase()
    }
  };
}

async function processBankTransfer(request: any, transactionId: string) {
  // Bank transfers are always successful but take time
  const fees = 0; // Usually no fees for bank transfers

  return {
    success: true,
    fees,
    providerResponse: {
      provider: 'bank',
      transactionId: `BANK-${Date.now()}`,
      status: 'pending',
      estimatedCompletion: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  };
}

async function processCryptoPayment(method: string, request: any, transactionId: string) {
  // Simulate crypto payment processing
  const success = Math.random() > 0.02; // 98% success rate
  
  if (!success) {
    return { 
      success: false, 
      error: 'Kripto para işlemi başarısız' 
    };
  }

  const fees = request.amount * 0.015; // 1.5% fee

  return {
    success: true,
    fees,
    providerResponse: {
      provider: 'coinbase',
      transactionId: `CRYPTO-${Date.now()}`,
      status: 'confirmed',
      blockchainHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      confirmations: 3
    }
  };
}

async function processMobilePayment(request: any, transactionId: string) {
  // Simulate mobile payment (Papara, etc.)
  const success = Math.random() > 0.03; // 97% success rate
  
  if (!success) {
    return { 
      success: false, 
      error: 'Mobil ödeme işlemi başarısız' 
    };
  }

  const fees = (request.amount * 0.035) + 0.50; // 3.5% + 0.50 TRY

  return {
    success: true,
    fees,
    providerResponse: {
      provider: 'papara',
      transactionId: `MOBILE-${Date.now()}`,
      status: 'completed'
    }
  };
}

async function processPayPalPayment(request: any, transactionId: string) {
  // Simulate PayPal processing
  const success = Math.random() > 0.04; // 96% success rate
  
  if (!success) {
    return { 
      success: false, 
      error: 'PayPal işlemi başarısız' 
    };
  }

  const fees = (request.amount * 0.034) + 0.35; // 3.4% + 0.35

  return {
    success: true,
    fees,
    providerResponse: {
      provider: 'paypal',
      transactionId: `PP-${Date.now()}`,
      status: 'completed',
      payerId: `PAYER-${Math.random().toString(36).substr(2, 8)}`
    }
  };
}

async function processDigitalWalletPayment(method: string, request: any, transactionId: string) {
  // Simulate Apple Pay / Google Pay
  const success = Math.random() > 0.02; // 98% success rate
  
  if (!success) {
    return { 
      success: false, 
      error: `${method} işlemi başarısız` 
    };
  }

  const fees = (request.amount * 0.029) + 0.30; // 2.9% + 0.30

  return {
    success: true,
    fees,
    providerResponse: {
      provider: method,
      transactionId: `WALLET-${Date.now()}`,
      status: 'completed',
      deviceId: `DEVICE-${Math.random().toString(36).substr(2, 8)}`
    }
  };
}

async function sendPaymentConfirmation(email: string, paymentDetails: any) {
  // Simulate email sending
  console.log(`Payment confirmation email sent to ${email}:`, paymentDetails);
  
  // In production, integrate with email service like SendGrid, Mailgun, etc.
  // await emailService.send({
  //   to: email,
  //   template: 'payment-confirmation',
  //   data: paymentDetails
  // });
}
