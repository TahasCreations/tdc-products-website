/**
 * Simple Chatbot Logic
 * AI-powered responses için OpenAI entegrasyonu eklenebilir
 */

interface ChatResponse {
  reply: string;
  suggestedActions?: string[];
}

const FAQ_RESPONSES: Record<string, ChatResponse> = {
  'sipariş durumu': {
    reply: 'Sipariş durumunuzu öğrenmek için sipariş numaranızı paylaşabilir misiniz? Veya hesabınıza giriş yaparak "Siparişlerim" sayfasından takip edebilirsiniz.',
    suggestedActions: ['Siparişlerim', 'Sipariş Takip'],
  },
  'iade/değişim': {
    reply: 'Ürün iadesini 14 gün içinde yapabilirsiniz. Ürün kullanılmamış ve orijinal ambalajında olmalıdır. İade sürecini başlatmak ister misiniz?',
    suggestedActions: ['İade Talebi Oluştur', 'İade Şartları'],
  },
  'ürün bilgisi': {
    reply: 'Hangi ürün hakkında bilgi almak istersiniz? Ürün adını veya kodunu paylaşabilirsiniz.',
    suggestedActions: ['Ürünlere Göz At', 'Popüler Ürünler'],
  },
  'ödeme sorunları': {
    reply: 'Ödeme sırasında sorun mu yaşıyorsunuz? Lütfen sorunun detaylarını paylaşın. Kredi kartı, havale veya kapıda ödeme seçeneklerimiz mevcuttur.',
    suggestedActions: ['Ödeme Yöntemleri', 'Teknik Destek'],
  },
  'kargo': {
    reply: 'Kargo sürecimiz genellikle 2-3 iş günü sürmektedir. Ücretsiz kargo için minimum 500 TL alışveriş yapabilirsiniz. Kargo takip kodu siparişiniz kargoya verildiğinde SMS ile gönderilecektir.',
    suggestedActions: ['Kargo Takip', 'Kargo Şirketleri'],
  },
  'indirim': {
    reply: 'Şu anda aktif kampanyalarımız için ana sayfamızı ziyaret edebilirsiniz. Ayrıca e-bültene abone olarak özel indirim fırsatlarından haberdar olabilirsiniz!',
    suggestedActions: ['Kampanyalar', 'E-bülten Kayıt'],
  },
  'iletişim': {
    reply: 'Bize ulaşmak için:\n📧 E-posta: destek@tdc.com\n📱 WhatsApp: 0850 XXX XX XX\n🕐 Çalışma Saatleri: Hafta içi 09:00-18:00',
    suggestedActions: ['WhatsApp', 'E-posta Gönder'],
  },
};

const GREETING_KEYWORDS = ['merhaba', 'selam', 'hey', 'hi', 'hello', 'iyi günler'];
const THANKS_KEYWORDS = ['teşekkür', 'sağol', 'thanks', 'teşekkürler'];

export function generateChatbotResponse(userMessage: string): ChatResponse {
  const message = userMessage.toLowerCase().trim();

  // Greeting
  if (GREETING_KEYWORDS.some(keyword => message.includes(keyword))) {
    return {
      reply: 'Merhaba! 👋 Size nasıl yardımcı olabilirim? Aşağıdaki konulardan birini seçebilir veya sorunuzu doğrudan yazabilirsiniz.',
      suggestedActions: Object.keys(FAQ_RESPONSES).slice(0, 4),
    };
  }

  // Thanks
  if (THANKS_KEYWORDS.some(keyword => message.includes(keyword))) {
    return {
      reply: 'Rica ederim! 😊 Başka bir konuda yardımcı olabilir miyim?',
    };
  }

  // Check FAQ responses
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (message.includes(key) || message.includes(key.replace(/\//g, ''))) {
      return response;
    }
  }

  // Product search
  if (message.includes('ürün') || message.includes('product') || message.includes('fiyat')) {
    return {
      reply: 'Ürünlerimize göz atmak için katalogmuzu ziyaret edebilirsiniz. Belirli bir ürün arıyorsanız, ürün adını veya kategorisini belirtebilir misiniz?',
      suggestedActions: ['Ürünler', 'Kategoriler', 'Popüler Ürünler'],
    };
  }

  // Shipping
  if (message.includes('kargo') || message.includes('teslimat') || message.includes('gönder')) {
    return FAQ_RESPONSES['kargo'];
  }

  // Discount/Campaign
  if (message.includes('indirim') || message.includes('kampanya') || message.includes('kupon')) {
    return FAQ_RESPONSES['indirim'];
  }

  // Default response
  return {
    reply: 'Anlayamadım, biraz daha detay verebilir misiniz? Veya canlı destek ekibimize bağlanmak ister misiniz?',
    suggestedActions: ['Canlı Destek', 'Sık Sorulan Sorular', 'İletişim'],
  };
}

/**
 * AI-Powered Response (OpenAI entegrasyonu için)
 */
export async function getAIResponse(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  // OpenAI API çağrısı yapılabilir
  // Şimdilik basit chatbot kullanıyoruz
  const response = generateChatbotResponse(userMessage);
  return response.reply;
}

/**
 * Intent Detection
 */
export function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('sipariş')) return 'order_status';
  if (lowerMessage.includes('iade') || lowerMessage.includes('değişim')) return 'return';
  if (lowerMessage.includes('kargo') || lowerMessage.includes('teslimat')) return 'shipping';
  if (lowerMessage.includes('ödeme')) return 'payment';
  if (lowerMessage.includes('ürün')) return 'product_info';
  if (lowerMessage.includes('indirim') || lowerMessage.includes('kampanya')) return 'discount';

  return 'general';
}

/**
 * Sentiment Analysis (Basit)
 */
export function analyzeSentiment(message: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['teşekkür', 'harika', 'mükemmel', 'güzel', 'iyi', 'süper'];
  const negativeWords = ['kötü', 'berbat', 'sorun', 'şikayet', 'olmadı', 'beğenmedim'];

  const lowerMessage = message.toLowerCase();
  const hasPositive = positiveWords.some(word => lowerMessage.includes(word));
  const hasNegative = negativeWords.some(word => lowerMessage.includes(word));

  if (hasPositive && !hasNegative) return 'positive';
  if (hasNegative && !hasPositive) return 'negative';
  return 'neutral';
}

