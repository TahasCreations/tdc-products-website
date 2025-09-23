import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, customerInfo } = body;

    // Mock Stripe response (gerçek entegrasyon için stripe paketi yüklenmeli)
    const mockResponse = {
      id: `pi_${Date.now()}`,
      object: 'payment_intent',
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      status: 'succeeded',
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      customer: `cus_${Date.now()}`,
      metadata: {
        order_id: `tdc_${Date.now()}`,
        customer_email: customerInfo.email
      }
    };

    return NextResponse.json({
      success: true,
      transactionId: mockResponse.id,
      clientSecret: mockResponse.client_secret,
      customerId: mockResponse.customer,
      ...mockResponse
    });

  } catch (error) {
    console.error('Stripe payment error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Stripe ödeme işlemi başarısız' 
    }, { status: 500 });
  }
}
