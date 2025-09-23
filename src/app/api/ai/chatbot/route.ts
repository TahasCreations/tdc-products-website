import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ChatContext {
  userType: 'customer' | 'admin';
  currentPage?: string;
  userId?: string;
  messageHistory?: any[];
}

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();
    const { userType, currentPage, userId, messageHistory } = context as ChatContext;

    // Basit AI yanıt sistemi (gerçek AI entegrasyonu için OpenAI, Claude vb. kullanılabilir)
    const response = generateAIResponse(message, userType, currentPage, messageHistory);

    return NextResponse.json({
      success: true,
      response: response.message,
      suggestions: response.suggestions,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Mesaj işlenemedi' 
    }, { status: 500 });
  }
}

function generateAIResponse(message: string, userType: string, currentPage?: string, messageHistory?: any[]) {
  const lowerMessage = message.toLowerCase();

  // Müşteri yanıtları
  if (userType === 'customer') {
    return generateCustomerResponse(lowerMessage, currentPage);
  }
  
  // Admin yanıtları
  if (userType === 'admin') {
    return generateAdminResponse(lowerMessage, currentPage);
  }

  // Varsayılan yanıt
  return {
    message: "Merhaba! Size nasıl yardımcı olabilirim?",
    suggestions: [
      "Ürünleriniz hakkında bilgi alabilir miyim?",
      "Sipariş durumumu nasıl kontrol ederim?",
      "İade işlemi nasıl yapılır?"
    ]
  };
}

function generateCustomerResponse(message: string, currentPage?: string) {
  // Ürün sorguları
  if (message.includes('ürün') || message.includes('figür') || message.includes('3d')) {
    return {
      message: "TDC Products'ta anime, oyun ve film karakterlerinin yüksek kaliteli 3D baskı figürlerini bulabilirsiniz. Hangi karakteri arıyorsunuz?",
      suggestions: [
        "Naruto figürleri",
        "Dragon Ball figürleri",
        "Minecraft figürleri",
        "Marvel figürleri"
      ]
    };
  }

  // Sipariş sorguları
  if (message.includes('sipariş') || message.includes('siparişim')) {
    return {
      message: "Sipariş durumunuzu kontrol etmek için 'Siparişlerim' sayfasına gidebilir veya sipariş numaranızı paylaşabilirsiniz. Size nasıl yardımcı olabilirim?",
      suggestions: [
        "Sipariş numaramı nasıl bulurum?",
        "Siparişimi iptal edebilir miyim?",
        "Sipariş durumu nasıl değişir?"
      ]
    };
  }

  // Kargo sorguları
  if (message.includes('kargo') || message.includes('teslimat') || message.includes('gönderi')) {
    return {
      message: "Kargo sürelerimiz standart olarak 2-5 iş günü, hızlı kargo seçeneği ile 1-2 iş günüdür. 500 TL üzeri siparişlerde kargo ücretsizdir.",
      suggestions: [
        "Kargo takip numarası nasıl alırım?",
        "Kargo ücreti ne kadar?",
        "Hangi kargo firmalarını kullanıyorsunuz?"
      ]
    };
  }

  // İade sorguları
  if (message.includes('iade') || message.includes('değişim') || message.includes('iptal')) {
    return {
      message: "Ürünlerimizi teslim tarihinden itibaren 14 gün içinde iade edebilirsiniz. İade koşulları için 'İade ve Değişim' sayfamızı inceleyebilirsiniz.",
      suggestions: [
        "İade işlemi nasıl yapılır?",
        "İade ücreti var mı?",
        "Hangi durumlarda iade yapılamaz?"
      ]
    };
  }

  // Fiyat sorguları
  if (message.includes('fiyat') || message.includes('ücret') || message.includes('ne kadar')) {
    return {
      message: "Figürlerimizin fiyatları 199 TL ile 599 TL arasında değişmektedir. Detaylı fiyat bilgisi için ürün sayfalarını inceleyebilirsiniz.",
      suggestions: [
        "En ucuz figürler hangileri?",
        "Toplu alım indirimi var mı?",
        "Kampanya var mı?"
      ]
    };
  }

  // Kalite sorguları
  if (message.includes('kalite') || message.includes('malzeme') || message.includes('baskı')) {
    return {
      message: "Tüm figürlerimiz profesyonel 3D yazıcılarla yüksek kaliteli PLA filament kullanılarak üretilmektedir. Detaylı ve dayanıklıdır.",
      suggestions: [
        "Hangi malzeme kullanılıyor?",
        "Figür boyutları nasıl?",
        "Renk seçenekleri var mı?"
      ]
    };
  }

  // Genel yardım
  if (message.includes('yardım') || message.includes('nasıl') || message.includes('ne yapabilirim')) {
    return {
      message: "Size nasıl yardımcı olabilirim? Ürünler, siparişler, kargo, iade ve diğer konularda sorularınızı yanıtlayabilirim.",
      suggestions: [
        "Ürünleriniz hakkında bilgi",
        "Sipariş durumu kontrolü",
        "Kargo bilgileri",
        "İade işlemleri"
      ]
    };
  }

  // Varsayılan müşteri yanıtı
  return {
    message: "Anladım! Size daha iyi yardımcı olabilmem için sorunuzu biraz daha detaylandırabilir misiniz?",
    suggestions: [
      "Ürünleriniz hakkında bilgi alabilir miyim?",
      "Sipariş durumumu nasıl kontrol ederim?",
      "Kargo süreleri ne kadar?",
      "İade işlemi nasıl yapılır?"
    ]
  };
}

function generateAdminResponse(message: string, currentPage?: string) {
  // Sipariş yönetimi
  if (message.includes('sipariş') || message.includes('siparişler')) {
    return {
      message: "Sipariş yönetimi için admin panelindeki 'E-ticaret' > 'Siparişler' bölümünü kullanabilirsiniz. Siparişleri filtreleyebilir, durumlarını güncelleyebilir ve detaylarını görüntüleyebilirsiniz.",
      suggestions: [
        "Bekleyen siparişleri nasıl görürüm?",
        "Sipariş durumunu nasıl güncellerim?",
        "Sipariş raporları nasıl alınır?"
      ]
    };
  }

  // Ürün yönetimi
  if (message.includes('ürün') || message.includes('ürünler')) {
    return {
      message: "Ürün yönetimi için 'E-ticaret' > 'Ürünler' bölümünü kullanın. Yeni ürün ekleyebilir, mevcut ürünleri düzenleyebilir, stok durumlarını güncelleyebilirsiniz.",
      suggestions: [
        "Yeni ürün nasıl eklenir?",
        "Ürün kategorileri nasıl yönetilir?",
        "Stok durumu nasıl güncellenir?"
      ]
    };
  }

  // Analitik
  if (message.includes('analiz') || message.includes('rapor') || message.includes('istatistik')) {
    return {
      message: "Detaylı analitik raporlar için 'Analitik' bölümünü kullanabilirsiniz. Satış raporları, müşteri analizleri, ürün performansı ve daha fazlasını görüntüleyebilirsiniz.",
      suggestions: [
        "Satış raporları nasıl alınır?",
        "Müşteri analizleri nerede?",
        "Ürün performansı nasıl takip edilir?"
      ]
    };
  }

  // Müşteri yönetimi
  if (message.includes('müşteri') || message.includes('kullanıcı')) {
    return {
      message: "Müşteri yönetimi için 'E-ticaret' > 'Müşteriler' bölümünü kullanabilirsiniz. Müşteri bilgilerini görüntüleyebilir, sipariş geçmişlerini inceleyebilirsiniz.",
      suggestions: [
        "Müşteri arama nasıl yapılır?",
        "Müşteri sipariş geçmişi nasıl görülür?",
        "Müşteri grupları nasıl oluşturulur?"
      ]
    };
  }

  // Stok yönetimi
  if (message.includes('stok') || message.includes('envanter')) {
    return {
      message: "Stok yönetimi için 'E-ticaret' > 'Ürünler' bölümündeki stok sütununu kullanabilirsiniz. Stok uyarıları ve otomatik yeniden sipariş özellikleri mevcuttur.",
      suggestions: [
        "Stok uyarıları nasıl ayarlanır?",
        "Düşük stoklu ürünler nasıl görülür?",
        "Otomatik stok güncellemesi nasıl yapılır?"
      ]
    };
  }

  // Kampanya yönetimi
  if (message.includes('kampanya') || message.includes('indirim') || message.includes('kupon')) {
    return {
      message: "Kampanya yönetimi için 'Pazarlama' bölümünü kullanabilirsiniz. Kupon oluşturabilir, email kampanyaları düzenleyebilir, indirim kodları yönetebilirsiniz.",
      suggestions: [
        "Kupon nasıl oluşturulur?",
        "Email kampanyası nasıl düzenlenir?",
        "İndirim kuralları nasıl ayarlanır?"
      ]
    };
  }

  // Sistem durumu
  if (message.includes('sistem') || message.includes('durum') || message.includes('performans')) {
    return {
      message: "Sistem durumu ve performans metrikleri için 'Analitik' > 'Real-Time Dashboard' bölümünü kontrol edebilirsiniz. Sunucu durumu, veritabanı performansı ve kullanıcı aktivitelerini görebilirsiniz.",
      suggestions: [
        "Sistem performansı nasıl kontrol edilir?",
        "Hata logları nerede?",
        "Yedekleme durumu nasıl kontrol edilir?"
      ]
    };
  }

  // Varsayılan admin yanıtı
  return {
    message: "Admin paneline hoş geldiniz! Size nasıl yardımcı olabilirim? Siparişler, ürünler, müşteriler veya sistem durumu hakkında sorularınızı yanıtlayabilirim.",
    suggestions: [
      "Sipariş yönetimi",
      "Ürün yönetimi",
      "Müşteri yönetimi",
      "Analitik raporlar",
      "Sistem durumu"
    ]
  };
}
