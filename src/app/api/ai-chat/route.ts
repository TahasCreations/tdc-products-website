import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI client initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  context?: {
    userType?: 'customer' | 'admin';
    currentPage?: string;
    userPreferences?: any;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [], context }: ChatRequest = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Mesaj boş olamaz'
      }, { status: 400 });
    }

    // Demo mode için fallback
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
      return NextResponse.json({
        success: true,
        response: getDemoResponse(message, context),
        conversationId: Date.now().toString(),
        timestamp: new Date().toISOString()
      });
    }

    // System prompt based on context
    const systemPrompt = getSystemPrompt(context);

    // Prepare messages for OpenAI
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Son 10 mesajı al
      { role: 'user', content: message }
    ];

    // OpenAI API call
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const response = completion.choices[0]?.message?.content || 'Üzgünüm, bir yanıt oluşturamadım.';

    return NextResponse.json({
      success: true,
      response: response,
      conversationId: Date.now().toString(),
      timestamp: new Date().toISOString(),
      usage: completion.usage
    });

  } catch (error) {
    console.error('AI Chat API Error:', error);
    
    // Fallback response
    return NextResponse.json({
      success: true,
      response: getDemoResponse('', { userType: 'customer' }),
      conversationId: Date.now().toString(),
      timestamp: new Date().toISOString(),
      error: 'AI servisi geçici olarak kullanılamıyor'
    });
  }
}

function getSystemPrompt(context?: any): string {
  const basePrompt = `Sen TDC Products'ın AI asistanısın. Anime, oyun ve film karakterlerinin 3D baskı figürlerini satan bir e-ticaret sitesi için çalışıyorsun.

Temel bilgiler:
- Türkçe konuşuyorsun
- Samimi ve yardımsever bir ton kullanıyorsun
- Ürünler hakkında detaylı bilgi verebilirsin
- Sipariş süreçleri konusunda yardım edebilirsin
- Teknik destek sağlayabilirsin

Kurallar:
- Her zaman Türkçe yanıt ver
- Kısa ve öz ol
- Emojiler kullanabilirsin
- Müşteri memnuniyetini öncelikle tut
- Bilmediğin konularda dürüst ol`;

  if (context?.userType === 'admin') {
    return basePrompt + `

Admin Modu:
- Admin paneli özellikleri hakkında bilgi verebilirsin
- Muhasebe, CRM, analitik modülleri konusunda yardım edebilirsin
- Sistem yönetimi konularında destek sağlayabilirsin`;
  }

  return basePrompt;
}

function getDemoResponse(message: string, context?: any): string {
  const responses = {
    greeting: [
      "Merhaba! 👋 TDC Products'a hoş geldiniz! Size nasıl yardımcı olabilirim?",
      "Selam! 😊 Anime figürleri konusunda yardıma mı ihtiyacınız var?",
      "Merhaba! 🎌 Hangi karakterin figürünü arıyorsunuz?"
    ],
    products: [
      "Harika bir seçim! 🎯 Bu figürlerimiz hakkında detaylı bilgi verebilirim.",
      "Bu karakterin figürü gerçekten popüler! ⭐ Stok durumunu kontrol edeyim.",
      "Mükemmel bir tercih! 🎨 Bu figürün özelliklerini anlatayım."
    ],
    order: [
      "Sipariş sürecinizde size yardımcı olabilirim! 📦",
      "Sepetinize ekleme konusunda rehberlik edebilirim! 🛒",
      "Ödeme ve kargo bilgileri için buradayım! 💳"
    ],
    support: [
      "Teknik destek konusunda yardımcı olabilirim! 🔧",
      "Sorununuzu çözmek için buradayım! 💪",
      "Size en iyi şekilde yardımcı olmaya çalışacağım! 🤝"
    ],
    default: [
      "Bu konuda size yardımcı olabilirim! 😊",
      "Harika bir soru! 💡 Size detaylı bilgi verebilirim.",
      "Bu konuda uzmanım! 🎯 Nasıl yardımcı olabilirim?"
    ]
  };

  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam') || lowerMessage.includes('hello')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  
  if (lowerMessage.includes('ürün') || lowerMessage.includes('figür') || lowerMessage.includes('karakter')) {
    return responses.products[Math.floor(Math.random() * responses.products.length)];
  }
  
  if (lowerMessage.includes('sipariş') || lowerMessage.includes('sepet') || lowerMessage.includes('satın')) {
    return responses.order[Math.floor(Math.random() * responses.order.length)];
  }
  
  if (lowerMessage.includes('yardım') || lowerMessage.includes('destek') || lowerMessage.includes('sorun')) {
    return responses.support[Math.floor(Math.random() * responses.support.length)];
  }
  
  return responses.default[Math.floor(Math.random() * responses.default.length)];
}
