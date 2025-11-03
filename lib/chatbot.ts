/**
 * Advanced AI Chatbot with Natural Language Processing
 * Gelişmiş Türkçe NLP ve Intent Detection
 */

interface ChatResponse {
  reply: string;
  suggestedActions?: string[];
  confidence?: number;
}

interface Intent {
  name: string;
  patterns: string[];
  responses: string[];
  followUp?: string[];
}

// Gelişmiş Intent Tanımları
const INTENTS: Intent[] = [
  {
    name: 'order_status',
    patterns: [
      'sipariş', 'sipariş durumu', 'nerede', 'kargoya verildi mi', 'geldi mi',
      'sipariş takip', 'siparişim', 'sipariş sorgula', 'sipariş nerede',
      'ne zaman gelir', 'ne zaman gelecek', 'teslim tarihi', 'kargoda mı',
      'order', 'tracking', 'where is my order'
    ],
    responses: [
      'Sipariş durumunuzu öğrenmek için sipariş numaranızı paylaşabilir misiniz? 📦',
      'Siparişinizi takip edebilmeniz için sipariş numaranıza ihtiyacım var. Sipariş numaranızı biliyorsanız paylaşabilir misiniz?',
      'Hesabınıza giriş yaparak "Siparişlerim" sayfasından güncel durumu görebilirsiniz. Yardımcı olmamı ister misiniz?'
    ],
    followUp: ['Siparişlerim', 'Sipariş Takip', 'Hesabım']
  },
  {
    name: 'return_exchange',
    patterns: [
      'iade', 'değişim', 'geri gönder', 'beğenmedim', 'iptal', 'para iadesi',
      'iade et', 'ürün iade', 'nasıl iade', 'iade şartları', 'iade süreci',
      'değiştir', 'bozuk geldi', 'hatalı ürün', 'yanlış ürün', 'eksik geldi',
      'return', 'refund', 'exchange'
    ],
    responses: [
      'Ürün iadesini 14 gün içinde kolayca yapabilirsiniz! ✅ Ürününüz kullanılmamış ve orijinal ambalajında olmalı. İade sürecini başlatmak ister misiniz?',
      'Size yardımcı olabilmem için lütfen sipariş numaranızı ve iade nedeninizi paylaşır mısınız? Hemen çözüme kavuşturalım! 💙',
      'İade işleminizi 3 kolay adımda tamamlayabilirsiniz:\n1️⃣ Hesabınıza giriş yapın\n2️⃣ İade talebini oluşturun\n3️⃣ Kargo firması ürünü sizden alsın\n\nYardımcı olayım mı?'
    ],
    followUp: ['İade Talebi Oluştur', 'İade Şartları', 'Müşteri Hizmetleri']
  },
  {
    name: 'product_info',
    patterns: [
      'ürün', 'fiyat', 'fiyatı ne kadar', 'özellik', 'detay', 'bilgi',
      'stok', 'var mı', 'renk', 'beden', 'ölçü', 'marka', 'model',
      'özellikler', 'ürün bilgisi', 'ne kadar', 'kaç para', 'kaç tl',
      'product', 'price', 'features', 'details', 'specification'
    ],
    responses: [
      'Hangi ürün hakkında bilgi almak istersiniz? 🛍️ Ürün adını, kodunu veya kategorisini paylaşabilirsiniz.',
      'Size yardımcı olabilmem için ürün adını veya ne aradığınızı söyleyebilir misiniz? Detaylı bilgi vereceğim! 😊',
      'Ürünlerimiz arasında arama yapmak için ürün adını yazın veya kategorilere göz atın.'
    ],
    followUp: ['Ürünlere Göz At', 'Kategoriler', 'Popüler Ürünler', 'Yeni Gelenler']
  },
  {
    name: 'payment_issue',
    patterns: [
      'ödeme', 'ödeme sorunu', 'kart', 'kredi kartı', 'ödeyemiyorum',
      'ödeme yapamıyorum', 'hata alıyorum', '3d secure', 'güvenli ödeme',
      'taksit', 'havale', 'eft', 'kapıda ödeme', 'ödeme yöntemi',
      'payment', 'credit card', 'pay', 'transaction'
    ],
    responses: [
      'Ödeme sırasında sorun mu yaşıyorsunuz? 💳 Detayları paylaşırsanız hemen yardımcı olabilirim. Hangi ödeme yöntemini kullanmayı tercih ediyorsunuz?',
      'Güvenli ödeme seçeneklerimiz:\n💳 Kredi/Banka Kartı (Tek çekim ve taksit)\n🏦 Havale/EFT\n📦 Kapıda Ödeme\n\nHangisini tercih edersiniz?',
      'Ödeme hatası alıyorsanız, lütfen:\n1️⃣ Kart bilgilerinizi kontrol edin\n2️⃣ 3D Secure şifrenizi doğru girin\n3️⃣ Kartınızda yeterli limit olduğundan emin olun\n\nHala sorun devam ederse size yardımcı olayım.'
    ],
    followUp: ['Ödeme Yöntemleri', 'Taksit Seçenekleri', 'Güvenli Alışveriş', 'Teknik Destek']
  },
  {
    name: 'shipping',
    patterns: [
      'kargo', 'teslimat', 'gönder', 'ücretsiz kargo', 'kargo ücreti',
      'ne zaman gelir', 'kargo takip', 'kargo firması', 'hangi kargo',
      'hızlı kargo', 'express', 'aynı gün', 'shipping', 'delivery'
    ],
    responses: [
      'Kargo bilgileri:\n📦 Teslimat: 2-3 iş günü\n🚚 Ücretsiz kargo: 500 TL ve üzeri\n📍 Tüm Türkiye\'ye gönderim\n📱 SMS ile kargo takip kodu\n\nBaşka bir sorunuz var mı?',
      '500 TL ve üzeri alışverişlerinizde kargo ÜCRETSİZ! 🎉\nSiparişiniz kargoya verildiğinde takip numaranız SMS ile gönderilecek.',
      'Kargo süremiz genellikle 2-3 iş günü. Yoğun dönemlerde 1-2 gün uzayabilir. Hızlı teslimat için express kargo seçeneğini tercih edebilirsiniz! ⚡'
    ],
    followUp: ['Kargo Takip', 'Kargo Firmaları', 'Ücretsiz Kargo']
  },
  {
    name: 'discount_campaign',
    patterns: [
      'indirim', 'kampanya', 'kupon', 'promosyon', 'fırsat', 'teklif',
      'kod', 'indirim kodu', 'kupon kodu', 'indirimsiz mi', 'ucuz',
      'sale', 'discount', 'coupon', 'promo', 'offer'
    ],
    responses: [
      'Harika fırsatlarımız var! 🎁\n✨ Aktif kampanyalar için ana sayfayı ziyaret edin\n💌 E-bültene abone olun, özel indirim kodları kazanın\n🎉 İlk alışverişinizde %10 indirim!\n\nHangi ürün kategorisiyle ilgileniyorsunuz?',
      'İndirim fırsatlarını kaçırmayın! 🏷️\nE-bültenimize abone olarak:\n• Özel indirim kodları\n• Erken erişim fırsatları\n• Haftalık kampanyalar\nalabilirsiniz!',
      'Şu anda aktif kampanyalarımızı görüntülemek ister misiniz? Belirli bir ürün kategorisinde indirim arıyorsanız yardımcı olabilirim! 🛍️'
    ],
    followUp: ['Kampanyalar', 'İndirimli Ürünler', 'E-bülten Kayıt']
  },
  {
    name: 'contact',
    patterns: [
      'iletişim', 'telefon', 'whatsapp', 'mail', 'e-posta', 'email',
      'ulaş', 'ara', 'yaz', 'konuş', 'canlı destek', 'müşteri hizmetleri',
      'destek', 'yardım', 'contact', 'support', 'help'
    ],
    responses: [
      'Size nasıl ulaşabiliriz? 📞\n\n📧 E-posta: destek@tdc.com\n💬 WhatsApp: 0850 XXX XX XX\n🕐 Çalışma Saatleri: Hafta içi 09:00-18:00\n\nEn hızlı yanıt için WhatsApp\'tan yazabilirsiniz!',
      'Müşteri hizmetlerimiz size yardımcı olmak için burada! 💙\nWhatsApp, e-posta veya canlı sohbet üzerinden bize ulaşabilirsiniz.',
      'Canlı destek ekibimize bağlanmak ister misiniz? Veya WhatsApp üzerinden 7/24 yazabilirsiniz! 📱'
    ],
    followUp: ['WhatsApp', 'E-posta Gönder', 'Canlı Destek']
  },
  {
    name: 'account',
    patterns: [
      'hesap', 'giriş', 'kayıt', 'şifre', 'profil', 'üyelik',
      'şifremi unuttum', 'giriş yapamıyorum', 'hesabım', 'kullanıcı',
      'account', 'login', 'register', 'password', 'profile'
    ],
    responses: [
      'Hesap işlemlerinde yardımcı olabilirim! 👤\n• Şifrenizi mi unuttunuz?\n• Giriş sorunu mu yaşıyorsunuz?\n• Yeni hesap mı oluşturmak istiyorsunuz?\n\nHangi konuda yardıma ihtiyacınız var?',
      'Giriş yapamıyorsanız "Şifremi Unuttum" seçeneğini kullanarak şifrenizi sıfırlayabilirsiniz. Daha fazla yardıma ihtiyacınız varsa söyleyin! 🔐',
      'Üye olmak çok kolay! Hemen kayıt olarak:\n✅ Siparişlerinizi takip edin\n✅ Hızlı alışveriş yapın\n✅ Özel fırsatlardan yararlanın'
    ],
    followUp: ['Giriş Yap', 'Kayıt Ol', 'Şifremi Unuttum']
  },
  {
    name: 'complaint',
    patterns: [
      'şikayet', 'memnun değilim', 'kötü', 'berbat', 'sorun', 'problem',
      'olmadı', 'kızgınım', 'hayal kırıklığı', 'rezalet', 'complaint'
    ],
    responses: [
      'Yaşadığınız sorun için çok üzgünüm. 😔 Lütfen sorununuzu detaylı anlatın, size en kısa sürede yardımcı olalım. Müşteri memnuniyeti bizim için çok önemli.',
      'Hemen yardımcı olalım! Size yaşattığımız olumsuz deneyim için özür dilerim. Sorununuzu çözmek için elimden geleni yapacağım. Detayları paylaşır mısınız?',
      'Üzgünüm, memnun kalmadınız. 💙 Lütfen bize ne olduğunu anlatin, durumu hemen düzeltelim. Müşteri hizmetleri ekibimiz size yardımcı olmak için burada.'
    ],
    followUp: ['Müşteri Hizmetleri', 'Şikayet Formu', 'Canlı Destek']
  },
  {
    name: 'positive_feedback',
    patterns: [
      'teşekkür', 'sağol', 'süper', 'harika', 'mükemmel', 'çok iyi',
      'beğendim', 'güzel', 'thanks', 'great', 'perfect', 'excellent'
    ],
    responses: [
      'Rica ederim! 😊 Memnuniyetiniz bizim için en değerli ödül! Başka bir konuda yardımcı olabilir miyim?',
      'Çok teşekkür ederiz! 💙 Sizlere hizmet etmekten mutluluk duyuyoruz. İyi alışverişler!',
      'Geri bildiriminiz için teşekkürler! ⭐ Başka ihtiyacınız olursa her zaman buradayım.'
    ],
    followUp: []
  }
];

// Doğal Dil İşleme - Kelime Normalizasyonu
const WORD_NORMALIZATIONS: Record<string, string> = {
  'siparişim': 'sipariş',
  'siparişimi': 'sipariş',
  'siparişlerim': 'sipariş',
  'ürünü': 'ürün',
  'ürünüm': 'ürün',
  'ürünler': 'ürün',
  'kargom': 'kargo',
  'kargoda': 'kargo',
  'kargoya': 'kargo',
  'iadeyi': 'iade',
  'iadem': 'iade',
  'ödemem': 'ödeme',
  'ödememi': 'ödeme',
  'kampanyalar': 'kampanya',
  'kampanyaları': 'kampanya',
  'indirimleri': 'indirim',
  'indirimler': 'indirim',
};

// Türkçe karakter normalizasyonu
function normalizeText(text: string): string {
  let normalized = text.toLowerCase().trim();
  
  // Kelime normalizasyonu
  Object.entries(WORD_NORMALIZATIONS).forEach(([key, value]) => {
    normalized = normalized.replace(new RegExp(key, 'g'), value);
  });
  
  return normalized;
}

// Gelişmiş Intent Detection
function detectIntent(message: string): { intent: Intent | null; confidence: number } {
  const normalized = normalizeText(message);
  let bestMatch: Intent | null = null;
  let highestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;
    const matchedPatterns = intent.patterns.filter(pattern => 
      normalized.includes(pattern.toLowerCase())
    );
    
    if (matchedPatterns.length > 0) {
      // Eşleşen pattern sayısına göre skor
      score = matchedPatterns.length * 10;
      
      // Tam kelime eşleşmesi bonusu
      const words = normalized.split(/\s+/);
      matchedPatterns.forEach(pattern => {
        if (words.includes(pattern.toLowerCase())) {
          score += 15;
        }
      });
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = intent;
      }
    }
  }

  const confidence = Math.min(100, highestScore);
  return { intent: bestMatch, confidence };
}

// Sentiment Analysis (Geliştirilmiş)
export function analyzeSentiment(message: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = [
    'teşekkür', 'harika', 'mükemmel', 'güzel', 'iyi', 'süper', 'beğendim',
    'çok iyi', 'muhteşem', 'fevkalade', 'hızlı', 'kaliteli', 'başarılı'
  ];
  const negativeWords = [
    'kötü', 'berbat', 'sorun', 'şikayet', 'olmadı', 'beğenmedim', 'problem',
    'hata', 'yanlış', 'geç', 'gelmedi', 'eksik', 'bozuk', 'kırık', 'rezalet'
  ];

  const lowerMessage = message.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;

  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Ana Chatbot Response Generator
export function generateChatbotResponse(userMessage: string): ChatResponse {
  const normalized = normalizeText(userMessage);
  
  // Greeting kontrolü
  const greetings = ['merhaba', 'selam', 'hey', 'hi', 'hello', 'iyi günler', 'günaydın', 'iyi akşamlar'];
  if (greetings.some(g => normalized.includes(g))) {
    return {
      reply: 'Merhaba! 👋 Ben TDC Market\'in yapay zeka asistanıyım. Size nasıl yardımcı olabilirim?\n\nAşağıdaki konularda size yardımcı olabilirim:\n• Sipariş takibi\n• Ürün bilgileri\n• İade/Değişim\n• Kargo bilgisi\n• Kampanyalar\n• Ödeme sorunları',
      suggestedActions: ['Sipariş Durumu', 'Ürün Ara', 'İade/Değişim', 'Kampanyalar'],
      confidence: 100
    };
  }

  // Intent detection
  const { intent, confidence } = detectIntent(userMessage);

  if (intent && confidence > 20) {
    // Rastgele bir yanıt seç (daha doğal görünüm için)
    const randomResponse = intent.responses[Math.floor(Math.random() * intent.responses.length)];
    
    return {
      reply: randomResponse,
      suggestedActions: intent.followUp,
      confidence
    };
  }

  // Soru işareti varsa - soru olarak algıla
  if (userMessage.includes('?')) {
    return {
      reply: 'Bu konuda size yardımcı olmak isterim! Lütfen biraz daha detay verebilir misiniz? Veya aşağıdaki konulardan birini seçebilirsiniz:',
      suggestedActions: ['Sipariş Durumu', 'Ürün Bilgisi', 'Kargo Takip', 'İade İşlemi', 'Canlı Destek'],
      confidence: 30
    };
  }

  // Sentiment-based default responses
  const sentiment = analyzeSentiment(userMessage);
  
  if (sentiment === 'negative') {
    return {
      reply: 'Yaşadığınız sorunu anlıyorum ve çözmek istiyorum. 💙 Lütfen sorununuzu biraz daha detaylı anlatır mısınız? Veya doğrudan müşteri hizmetlerimize bağlanabilirsiniz.',
      suggestedActions: ['Canlı Destek', 'Müşteri Hizmetleri', 'WhatsApp'],
      confidence: 50
    };
  }

  // Default response
  return {
    reply: 'Üzgünüm, tam olarak anlayamadım. 🤔 Sorunuzu farklı bir şekilde ifade edebilir misiniz?\n\nVeya size şu konularda yardımcı olabilirim:',
    suggestedActions: ['Sipariş Takibi', 'Ürün Sorgusu', 'İade/Değişim', 'Kargo Bilgisi', 'Canlı Destek'],
    confidence: 0
  };
}

/**
 * AI-Powered Response (OpenAI entegrasyonu için hazır)
 */
export async function getAIResponse(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> {
  // Gelecekte OpenAI/GPT entegrasyonu buraya eklenebilir
  // Şimdilik gelişmiş rule-based system kullanıyoruz
  const response = generateChatbotResponse(userMessage);
  return response.reply;
}

/**
 * Intent Detection Export
 */
export function detectUserIntent(message: string): string {
  const { intent } = detectIntent(message);
  return intent?.name || 'general';
}

// Export types
export type { ChatResponse, Intent };
