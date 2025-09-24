import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, context } = await request.json();

    // Basit AI yanıt sistemi (gerçek AI entegrasyonu için OpenAI API kullanılabilir)
    const responses = {
      greeting: [
        'Merhaba! TDC Market AI asistanıyım. Size nasıl yardımcı olabilirim?',
        'Selam! TDC Market\'te size yardımcı olmaktan mutluluk duyarım.',
        'Hoş geldiniz! TDC Market AI asistanı olarak buradayım.'
      ],
      products: [
        'TDC Market\'te çok çeşitli ürünler bulabilirsiniz. Hangi kategoride ürün arıyorsunuz?',
        'Ürünlerimiz hakkında detaylı bilgi verebilirim. Hangi ürünle ilgileniyorsunuz?',
        'TDC Market\'te elektronik, ev & yaşam, moda ve daha birçok kategoride ürün bulabilirsiniz.'
      ],
      order: [
        'Sipariş durumunuzu kontrol etmek için lütfen sipariş numaranızı paylaşın.',
        'Siparişinizle ilgili bilgi almak için sipariş numaranızı verebilir misiniz?',
        'Sipariş durumunuzu öğrenmek için sipariş numaranızı paylaşmanız gerekiyor.'
      ],
      shipping: [
        'Kargo bilgileriniz için sipariş numaranızı paylaşabilir misiniz?',
        'Kargo takibi yapmak için sipariş numaranızı verebilir misiniz?',
        'Kargo durumunuzu kontrol etmek için sipariş numaranızı paylaşın.'
      ],
      return: [
        'İade işlemleri için müşteri hizmetlerimizle iletişime geçebilirsiniz.',
        'İade işleminizi başlatmak için sipariş numaranızı paylaşın.',
        'İade sürecinizle ilgili size yardımcı olabilirim.'
      ],
      default: [
        'Anladım. Size nasıl yardımcı olabilirim?',
        'Bu konuda size yardımcı olmaya çalışayım.',
        'Daha detaylı bilgi verebilir misiniz?'
      ]
    };

    // Mesaj analizi
    const lowerMessage = message.toLowerCase();
    let response = '';

    if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam') || lowerMessage.includes('hello')) {
      response = responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (lowerMessage.includes('ürün') || lowerMessage.includes('product')) {
      response = responses.products[Math.floor(Math.random() * responses.products.length)];
    } else if (lowerMessage.includes('sipariş') || lowerMessage.includes('order')) {
      response = responses.order[Math.floor(Math.random() * responses.order.length)];
    } else if (lowerMessage.includes('kargo') || lowerMessage.includes('shipping')) {
      response = responses.shipping[Math.floor(Math.random() * responses.shipping.length)];
    } else if (lowerMessage.includes('iade') || lowerMessage.includes('return')) {
      response = responses.return[Math.floor(Math.random() * responses.return.length)];
    } else {
      response = responses.default[Math.floor(Math.random() * responses.default.length)];
    }

    // Kısa bir gecikme ekle (gerçek AI gibi görünmesi için)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    return NextResponse.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    return NextResponse.json({
      success: false,
      error: 'Bir hata oluştu',
      response: 'Üzgünüm, şu anda bir teknik sorun yaşıyorum. Lütfen daha sonra tekrar deneyin.'
    }, { status: 500 });
  }
}
