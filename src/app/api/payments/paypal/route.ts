import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, customerInfo } = body;

    // PayPal API entegrasyonu
    const paypalConfig = {
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      baseUrl: process.env.PAYPAL_BASE_URL || 'https://api.sandbox.paypal.com'
    };

    // PayPal Access Token al
    const tokenResponse = await fetch(`${paypalConfig.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${Buffer.from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('PayPal access token alınamadı');
    }

    // PayPal Payment oluştur
    const paymentData = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      transactions: [{
        amount: {
          total: amount.toFixed(2),
          currency: currency
        },
        description: 'TDC Products Order',
        item_list: {
          items: [{
            name: 'TDC Products Order',
            sku: 'tdc-order',
            price: amount.toFixed(2),
            currency: currency,
            quantity: 1
          }]
        }
      }],
      redirect_urls: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/paypal/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/paypal/cancel`
      }
    };

    const paymentResponse = await fetch(`${paypalConfig.baseUrl}/v1/payments/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`
      },
      body: JSON.stringify(paymentData)
    });

    const paymentResult = await paymentResponse.json();

    if (paymentResult.id) {
      return NextResponse.json({
        success: true,
        transactionId: paymentResult.id,
        approvalUrl: paymentResult.links.find((link: any) => link.rel === 'approval_url')?.href,
        ...paymentResult
      });
    } else {
      throw new Error('PayPal payment oluşturulamadı');
    }

  } catch (error) {
    console.error('PayPal payment error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'PayPal ödeme işlemi başarısız' 
    }, { status: 500 });
  }
}
