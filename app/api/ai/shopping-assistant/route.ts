import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Virtual Shopping Assistant (AI Avatar)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message required' },
        { status: 400 }
      );
    }

    // AI Response Logic (in production: use OpenAI/Claude API)
    const response = generateAssistantResponse(message.toLowerCase());

    return NextResponse.json({
      success: true,
      ...response
    });

  } catch (error) {
    console.error('Shopping assistant error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get response' },
      { status: 500 }
    );
  }
}

function generateAssistantResponse(message: string) {
  // Intent detection
  if (message.includes('trend') || message.includes('popüler')) {
    return {
      response: '🔥 En trend ürünlerimiz:\n\nBu hafta en çok satanları size gösteriyorum!',
      products: [], // In production: fetch trending products
      suggestedActions: ['💰 İndirimli ürünler', '⭐ En çok satanlar', '🎁 Hediye önerileri']
    };
  }

  if (message.includes('hediye')) {
    return {
      response: '🎁 Hediye aramak için doğru yerdesiniz!\n\nKime hediye almak istiyorsunuz?',
      suggestedActions: ['👨 Erkeklere hediye', '👩 Kadınlara hediye', '👶 Çocuklara hediye']
    };
  }

  if (message.includes('indirim') || message.includes('kampanya')) {
    return {
      response: '💰 Aktif kampanyalarımız:\n\n• %50\'ye varan indirimler\n• Ücretsiz kargo\n• 2. ürüne %30 indirim',
      suggestedActions: ['🔥 İndirimleri göster', '🎫 Kuponlarım', '💳 Taksit seçenekleri']
    };
  }

  if (message.includes('kargo') || message.includes('teslimat')) {
    return {
      response: '📦 Kargo bilgileri:\n\n• 500₺ üzeri ÜCRETSİZ kargo\n• Hızlı teslimat: 1-2 gün\n• Uluslararası gönderim mevcut',
      suggestedActions: ['🌍 Uluslararası kargo', '⚡ Hızlı teslimat', '📍 Kargo takibi']
    };
  }

  // Default response
  return {
    response: 'Size nasıl yardımcı olabilirim? 😊\n\nÜrün araması, kampanyalar, kargo bilgisi veya öneriler için sorabilirsiniz!',
    suggestedActions: [
      '🔥 Trend ürünler',
      '🎁 Hediye önerileri',
      '💰 İndirimler',
      '📦 Kargo bilgisi'
    ]
  };
}

