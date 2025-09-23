import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, cardData, installment, customerInfo } = body;

    // iyzico API entegrasyonu
    // Bu gerçek iyzico API'si ile değiştirilmeli
    const iyzicoConfig = {
      apiKey: process.env.IYZICO_API_KEY,
      secretKey: process.env.IYZICO_SECRET_KEY,
      baseUrl: process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com'
    };

    // Mock iyzico response
    const mockResponse = {
      status: 'success',
      paymentId: `iyz_${Date.now()}`,
      conversationId: `conv_${Date.now()}`,
      price: amount.toString(),
      paidPrice: amount.toString(),
      currency: currency,
      installment: installment,
      paymentStatus: 'SUCCESS',
      fraudStatus: 1,
      merchantCommissionRate: '0.0000000000',
      merchantCommissionRateAmount: '0.00',
      iyziCommissionRateAmount: '0.00',
      iyziCommissionFee: '0.00',
      cardType: 'CREDIT_CARD',
      cardAssociation: 'VISA',
      cardFamily: 'Bonus',
      cardToken: `token_${Date.now()}`,
      cardUserKey: `user_${Date.now()}`,
      binNumber: cardData.cardNumber.substring(0, 6),
      lastFourDigits: cardData.cardNumber.slice(-4),
      basketId: `basket_${Date.now()}`,
      paymentItems: [
        {
          id: '1',
          name: 'TDC Products Order',
          category1: 'E-commerce',
          itemType: 'PHYSICAL',
          price: amount.toString(),
          subMerchantKey: null,
          subMerchantPrice: '0.00'
        }
      ]
    };

    // Gerçek iyzico entegrasyonu için:
    /*
    const iyzico = require('iyzipay');
    const iyzipay = new iyzico(iyzicoConfig);
    
    const request = {
      locale: 'tr',
      conversationId: `conv_${Date.now()}`,
      price: amount.toString(),
      paidPrice: amount.toString(),
      currency: currency,
      installment: installment.toString(),
      basketId: `basket_${Date.now()}`,
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/iyzico/callback`,
      enabledInstallments: [2, 3, 6, 9, 12],
      buyer: {
        id: customerInfo.email,
        name: customerInfo.name,
        surname: customerInfo.name.split(' ')[1] || '',
        gsmNumber: customerInfo.phone,
        email: customerInfo.email,
        identityNumber: '11111111110',
        lastLoginDate: new Date().toISOString(),
        registrationDate: new Date().toISOString(),
        registrationAddress: 'Test Address',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34000',
        ip: '127.0.0.1'
      },
      shippingAddress: {
        contactName: customerInfo.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Test Address',
        zipCode: '34000'
      },
      billingAddress: {
        contactName: customerInfo.name,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Test Address',
        zipCode: '34000'
      },
      basketItems: [
        {
          id: '1',
          name: 'TDC Products Order',
          category1: 'E-commerce',
          itemType: 'PHYSICAL',
          price: amount.toString()
        }
      ],
      paymentCard: {
        cardHolderName: cardData.cardHolderName,
        cardNumber: cardData.cardNumber.replace(/\s/g, ''),
        expireMonth: cardData.expiryMonth,
        expireYear: `20${cardData.expiryYear}`,
        cvc: cardData.cvv,
        registerCard: 0
      }
    };
    
    iyzipay.payment.create(request, (err: any, result: any) => {
      if (err) {
        return NextResponse.json({ 
          success: false, 
          error: err.message 
        }, { status: 400 });
      }
      
      return NextResponse.json({
        success: true,
        transactionId: result.paymentId,
        ...result
      });
    });
    */

    // Mock response döndür
    return NextResponse.json({
      success: true,
      transactionId: mockResponse.paymentId,
      ...mockResponse
    });

  } catch (error) {
    console.error('iyzico payment error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Ödeme işlemi başarısız' 
    }, { status: 500 });
  }
}
