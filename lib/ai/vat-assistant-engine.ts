/**
 * AI KDV Asistanı - Gelişmiş Vergi Danışmanlık Motoru
 * Türk Vergi Mevzuatı'na uygun akıllı hesaplama ve öneriler
 */

// ============================================
// TÜRK VERGİ SİSTEMİ KURALLARI
// ============================================

export const VAT_RATES = {
  STANDARD: 20,      // Genel oran (2024 itibariyle %20)
  REDUCED: 10,       // İndirimli oran (gıda, kitap, eğitim vb.)
  SUPER_REDUCED: 1,  // Çok indirimli oran (temel gıda)
  ZERO: 0            // İstisna ve muaf işlemler
} as const;

export const WITHHOLDING_RATES = {
  RENT_RESIDENTIAL: 20,      // Konut kirası
  RENT_COMMERCIAL: 20,       // İşyeri kirası
  SERVICE_PROFESSIONAL: 20,  // Serbest meslek
  SERVICE_CONSTRUCTION: 3,   // İnşaat işleri
  CONSULTING: 20,            // Danışmanlık
  SOFTWARE: 0,               // Yazılım (muaf)
} as const;

// ============================================
// GELIŞMIŞ NLP - SORU ANLAMA
// ============================================

interface TaxIntent {
  type: 'kdv' | 'stopaj' | 'kurumlar' | 'beyanname' | 'hesaplama' | 'optimizasyon' | 'genel';
  subtype?: string;
  confidence: number;
  keywords: string[];
}

interface TaxResponse {
  answer: string;
  calculation?: any;
  suggestions?: string[];
  examples?: string[];
  legalReference?: string;
  confidence: number;
}

// Gelişmiş Intent Tanıma Desenleri
const TAX_INTENTS = {
  kdv_calculation: {
    patterns: [
      'kdv hesapla', 'kdv nedir', 'kdv oranı', 'kdv dahil', 'kdv hariç',
      'katma değer vergisi', 'kdv matrah', 'kdv tutarı', 'kdv çıkar'
    ],
    keywords: ['kdv', 'katma değer', 'vergi', '%18', '%8', '%1']
  },
  kdv_return: {
    patterns: [
      'kdv beyannamesi', 'kdv iade', 'kdv iadesi', 'kdv indirimi',
      'kdv mahsubu', 'kdv tevkifat', 'beyanname nasıl'
    ],
    keywords: ['beyanname', 'iade', 'mahsup', 'tevkifat']
  },
  withholding: {
    patterns: [
      'stopaj', 'gelir stopajı', 'kira stopajı', 'serbest meslek stopajı',
      'stopaj oranı', 'stopaj hesapla', 'tevkifat'
    ],
    keywords: ['stopaj', 'tevkifat', 'kira', 'serbest meslek']
  },
  exemptions: {
    patterns: [
      'istisna', 'muaf', 'kdv istisnası', 'ihracat', 'transit',
      'hangi işlemler istisna', 'kdv ödenmez'
    ],
    keywords: ['istisna', 'muaf', 'ihracat', 'transit']
  },
  optimization: {
    patterns: [
      'vergi optimizasyonu', 'kdv azalt', 'vergi tasarrufu',
      'nasıl düşürürüm', 'avantaj', 'indirim fırsatı'
    ],
    keywords: ['optimizasyon', 'tasarruf', 'azalt', 'düşür', 'avantaj']
  }
};

// ============================================
// AKILLI SORU ANLAMA
// ============================================

export function detectTaxIntent(question: string): TaxIntent {
  const normalized = question.toLowerCase().trim();
  let bestMatch: TaxIntent = {
    type: 'genel',
    confidence: 0,
    keywords: []
  };

  // Intent skorlama
  for (const [intentName, intentData] of Object.entries(TAX_INTENTS)) {
    let score = 0;
    const matchedKeywords: string[] = [];

    // Pattern eşleşmesi
    for (const pattern of intentData.patterns) {
      if (normalized.includes(pattern)) {
        score += 30;
        matchedKeywords.push(pattern);
      }
    }

    // Keyword eşleşmesi
    for (const keyword of intentData.keywords) {
      if (normalized.includes(keyword)) {
        score += 10;
        matchedKeywords.push(keyword);
      }
    }

    // En yüksek skoru güncelle
    if (score > bestMatch.confidence) {
      bestMatch = {
        type: intentName.includes('kdv') ? 'kdv' : 
              intentName.includes('stopaj') ? 'stopaj' :
              intentName.includes('kurumlar') ? 'kurumlar' :
              intentName.includes('beyanname') ? 'beyanname' :
              intentName.includes('optimizasyon') ? 'optimizasyon' : 'genel',
        subtype: intentName,
        confidence: Math.min(100, score),
        keywords: matchedKeywords
      };
    }
  }

  return bestMatch;
}

// ============================================
// KDV HESAPLAMA MOTORu
// ============================================

export interface VATCalculation {
  baseAmount: number;
  vatRate: number;
  vatAmount: number;
  totalWithVAT: number;
  explanation: string;
}

export function calculateVAT(amount: number, rate: number = VAT_RATES.STANDARD): VATCalculation {
  const vatAmount = (amount * rate) / 100;
  const totalWithVAT = amount + vatAmount;

  return {
    baseAmount: amount,
    vatRate: rate,
    vatAmount: parseFloat(vatAmount.toFixed(2)),
    totalWithVAT: parseFloat(totalWithVAT.toFixed(2)),
    explanation: `${amount.toLocaleString('tr-TR')} ₺ tutara %${rate} KDV uygulandı. KDV tutarı: ${vatAmount.toLocaleString('tr-TR')} ₺`
  };
}

export function extractVATFromTotal(totalAmount: number, rate: number = VAT_RATES.STANDARD): VATCalculation {
  const baseAmount = (totalAmount * 100) / (100 + rate);
  const vatAmount = totalAmount - baseAmount;

  return {
    baseAmount: parseFloat(baseAmount.toFixed(2)),
    vatRate: rate,
    vatAmount: parseFloat(vatAmount.toFixed(2)),
    totalWithVAT: totalAmount,
    explanation: `${totalAmount.toLocaleString('tr-TR')} ₺ toplam tutarın içindeki %${rate} KDV: ${vatAmount.toLocaleString('tr-TR')} ₺`
  };
}

// ============================================
// STOPAJ HESAPLAMA
// ============================================

export interface WithholdingCalculation {
  grossAmount: number;
  withholdingRate: number;
  withholdingAmount: number;
  netAmount: number;
  type: string;
}

export function calculateWithholding(
  amount: number, 
  type: keyof typeof WITHHOLDING_RATES
): WithholdingCalculation {
  const rate = WITHHOLDING_RATES[type];
  const withholdingAmount = (amount * rate) / 100;
  const netAmount = amount - withholdingAmount;

  return {
    grossAmount: amount,
    withholdingRate: rate,
    withholdingAmount: parseFloat(withholdingAmount.toFixed(2)),
    netAmount: parseFloat(netAmount.toFixed(2)),
    type: type.toString()
  };
}

// ============================================
// AKILLI CEVAP OLUŞTURUCU
// ============================================

export function generateTaxResponse(question: string): TaxResponse {
  const intent = detectTaxIntent(question);
  const normalized = question.toLowerCase();

  // KDV Hesaplama Soruları
  if (intent.type === 'kdv' && (normalized.includes('hesapla') || normalized.includes('nasıl'))) {
    return {
      answer: `**KDV Hesaplama:**\n\n` +
        `Türkiye'de KDV oranları:\n` +
        `• **%20** - Standart oran (çoğu ürün ve hizmet)\n` +
        `• **%10** - İndirimli oran (gıda, kitap, eğitim)\n` +
        `• **%1** - Çok indirimli oran (temel gıda ürünleri)\n` +
        `• **%0** - İstisna ve muaf işlemler\n\n` +
        `**Hesaplama Formülü:**\n` +
        `KDV Dahil Tutar = Matrah × (1 + KDV Oranı/100)\n` +
        `KDV Tutarı = Matrah × (KDV Oranı/100)\n\n` +
        `**Örnek:** 1.000 ₺ + %20 KDV = 1.200 ₺ (KDV: 200 ₺)`,
      examples: [
        '1.000 ₺ + %20 KDV = 1.200 ₺',
        '500 ₺ + %10 KDV = 550 ₺',
        '100 ₺ + %1 KDV = 101 ₺'
      ],
      suggestions: [
        'KDV hesaplayıcıyı kullan',
        'KDV beyannamesi hazırla',
        'KDV istisnalarını gör'
      ],
      confidence: intent.confidence
    };
  }

  // KDV Beyannamesi
  if (intent.type === 'beyanname' || (intent.type === 'kdv' && normalized.includes('beyanname'))) {
    return {
      answer: `**KDV Beyannamesi (Form 2A):**\n\n` +
        `**Beyan Dönemi:** Aylık veya 3 aylık\n` +
        `**Son Tarih:** Takip eden ayın 24'üne kadar\n\n` +
        `**Beyanname Hazırlama Adımları:**\n` +
        `1️⃣ Satışlarınızdaki KDV'yi hesaplayın (Çıktı KDV)\n` +
        `2️⃣ Alımlarınızdaki KDV'yi toplayın (Girdi KDV)\n` +
        `3️⃣ Çıktı - Girdi = Ödenecek KDV\n` +
        `4️⃣ E-beyanname sisteminden beyan edin\n\n` +
        `**İade Durumu:** Girdi > Çıktı ise KDV iadesi alabilirsiniz.`,
      examples: [
        'Çıktı KDV: 50.000 ₺, Girdi KDV: 30.000 ₺ → Ödenecek: 20.000 ₺',
        'Çıktı KDV: 10.000 ₺, Girdi KDV: 15.000 ₺ → İade: 5.000 ₺'
      ],
      suggestions: [
        'Beyanname şablonu indir',
        'KDV iadesi nasıl alınır?',
        'Beyanname verme süresi'
      ],
      legalReference: 'KDV Kanunu Madde 41, 3065 Sayılı Kanun',
      confidence: intent.confidence
    };
  }

  // KDV İstisnaları
  if (intent.type === 'kdv' && (normalized.includes('istisna') || normalized.includes('muaf'))) {
    return {
      answer: `**KDV İstisnaları:**\n\n` +
        `**Tam İstisna:**\n` +
        `• İhracat teslimleri\n` +
        `• Transit taşımacılık\n` +
        `• Deniz ve hava taşımacılığı\n` +
        `• Banka ve sigorta işlemleri\n` +
        `• Eğitim hizmetleri\n` +
        `• Sağlık hizmetleri\n\n` +
        `**Kısmi İstisna:**\n` +
        `• Konut kiralaması (%0 KDV)\n` +
        `• Bazı tarım ürünleri\n\n` +
        `**Önemli:** İstisna kapsamındaki işlemlerde KDV hesaplanmaz ama beyan edilir.`,
      examples: [
        'İhracat: 10.000 $ → %0 KDV',
        'Konut kirası: 5.000 ₺ → %0 KDV',
        'Özel eğitim kursu: 2.000 ₺ → %0 KDV'
      ],
      suggestions: [
        'İhracat KDV iadesi',
        'İstisna belgeleri',
        'Tevkifat uygulaması'
      ],
      legalReference: 'KDV Kanunu Madde 11-17',
      confidence: intent.confidence
    };
  }

  // Stopaj Soruları
  if (intent.type === 'stopaj') {
    return {
      answer: `**Stopaj (Gelir Vergisi Tevkifatı):**\n\n` +
        `**Stopaj Oranları (2024):**\n` +
        `• Kira geliri: **%20**\n` +
        `• Serbest meslek: **%20**\n` +
        `• İnşaat işleri: **%3**\n` +
        `• Danışmanlık: **%20**\n` +
        `• Taşeron iş: **%2-10**\n\n` +
        `**Hesaplama:**\n` +
        `Stopaj Tutarı = Brüt Tutar × (Stopaj Oranı / 100)\n` +
        `Net Ödeme = Brüt Tutar - Stopaj\n\n` +
        `**Örnek:** 10.000 ₺ kira × %20 = 2.000 ₺ stopaj → Net: 8.000 ₺`,
      examples: [
        'Kira 5.000 ₺ → Stopaj 1.000 ₺ → Net 4.000 ₺',
        'Danışmanlık 15.000 ₺ → Stopaj 3.000 ₺ → Net 12.000 ₺'
      ],
      suggestions: [
        'Stopaj hesapla',
        'Muhtasar beyanname',
        'Stopaj oranları tablosu'
      ],
      legalReference: 'Gelir Vergisi Kanunu Madde 94',
      confidence: intent.confidence
    };
  }

  // Optimizasyon Soruları
  if (intent.type === 'optimizasyon') {
    return {
      answer: `**Vergi Optimizasyon Stratejileri:**\n\n` +
        `**KDV Optimizasyonu:**\n` +
        `✅ Gider belgelerini eksiksiz saklayın (Girdi KDV indirilir)\n` +
        `✅ İndirimli oranlı ürünleri değerlendirin\n` +
        `✅ İhracat yaparak KDV iadesinden yararlanın\n` +
        `✅ Aylık/3 aylık beyan seçimini optimize edin\n\n` +
        `**Yasal Yöntemler:**\n` +
        `• Ar-Ge indirimi\n` +
        `• Yatırım teşvikleri\n` +
        `• Bölgesel teşvikler\n` +
        `• İstihdam teşvikleri\n\n` +
        `**Uyarı:** Tüm optimizasyonlar yasal çerçevede kalmalıdır!`,
      suggestions: [
        'Ar-Ge teşviki nedir?',
        'Yatırım indirimi başvurusu',
        'KDV iadesinde hızlandırma'
      ],
      confidence: intent.confidence
    };
  }

  // Kurumlar Vergisi
  if (intent.type === 'kurumlar' || normalized.includes('kurumlar vergisi')) {
    return {
      answer: `**Kurumlar Vergisi:**\n\n` +
        `**Oran:** %25 (2024 itibariyle)\n` +
        `**Matrah:** Ticari bilanço karı\n` +
        `**Beyan:** Yıllık (Nisan ayında)\n\n` +
        `**Hesaplama:**\n` +
        `1. Ticari Kar hesaplanır\n` +
        `2. İndirimler uygulanır\n` +
        `3. Matrah × %25 = Kurumlar Vergisi\n\n` +
        `**İndirimler:**\n` +
        `• Ar-Ge indirimi\n` +
        `• Yatırım indirimi\n` +
        `• Bağış ve yardım indirimi\n\n` +
        `**Geçici Vergi:** 3'er aylık dönemler için %25`,
      examples: [
        'Ticari Kar: 100.000 ₺ → Kurumlar Vergisi: 25.000 ₺',
        'Kar 50.000 ₺ - Ar-Ge İnd. 10.000 ₺ = Matrah 40.000 ₺ → Vergi: 10.000 ₺'
      ],
      suggestions: [
        'Geçici vergi nedir?',
        'Ar-Ge indirimi başvurusu',
        'Kurumlar vergisi beyannamesi'
      ],
      legalReference: 'Kurumlar Vergisi Kanunu 5520 Sayılı',
      confidence: intent.confidence
    };
  }

  // Varsayılan Genel Yanıt
  return {
    answer: `Size yardımcı olmak isterim! 🤖\n\n` +
      `Şu konularda sorularınızı yanıtlayabilirim:\n\n` +
      `💰 **KDV:** Hesaplama, beyanname, iade, istisnalar\n` +
      `📊 **Stopaj:** Oranlar, hesaplama, beyanname\n` +
      `🏢 **Kurumlar Vergisi:** Matrah, indirimler, geçici vergi\n` +
      `⚡ **Optimizasyon:** Vergi tasarrufu, yasal avantajlar\n` +
      `📋 **Beyanname:** Hazırlık, süreçler, son tarihler\n\n` +
      `Lütfen sorunuzu daha detaylı sorar mısınız?`,
    suggestions: [
      'KDV nasıl hesaplanır?',
      'Stopaj oranları nedir?',
      'Vergi optimizasyonu',
      'KDV beyannamesi nasıl verilir?'
    ],
    confidence: 0
  };
}

// ============================================
// SMART SUGGESTIONS - CONTEXT-AWARE
// ============================================

export function getSmartSuggestions(context: {
  revenue?: number;
  expenses?: number;
  vatPayable?: number;
  period?: string;
}): Array<{
  type: 'warning' | 'tip' | 'opportunity' | 'reminder';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}> {
  const suggestions = [];

  // KDV İadesi Fırsatı
  if (context.expenses && context.revenue && context.expenses > context.revenue) {
    suggestions.push({
      type: 'opportunity',
      title: 'KDV İadesi Fırsatı',
      description: `Giderleriniz gelirlerinizden fazla. ${Math.abs((context.expenses - context.revenue) * 0.2).toLocaleString('tr-TR')} ₺ KDV iadesi alabilirsiniz!`,
      action: 'İade Başvurusu Yap',
      priority: 'high'
    });
  }

  // Yüksek KDV Uyarısı
  if (context.vatPayable && context.vatPayable > 50000) {
    suggestions.push({
      type: 'warning',
      title: 'Yüksek KDV Borcu',
      description: `Ödenecek KDV tutarınız ${context.vatPayable.toLocaleString('tr-TR')} ₺. Girdi KDV'nizi kontrol edin.`,
      action: 'Girdi Belgelerini İncele',
      priority: 'high'
    });
  }

  // Beyanname Hatırlatması
  const today = new Date();
  const dayOfMonth = today.getDate();
  if (dayOfMonth >= 20 && dayOfMonth <= 24) {
    suggestions.push({
      type: 'reminder',
      title: 'Beyanname Süresi Yaklaşıyor',
      description: 'KDV beyannamenizi 24\'üne kadar vermelisiniz. Hazırladınız mı?',
      action: 'Beyanname Hazırla',
      priority: 'high'
    });
  }

  // Optimizasyon İpucu
  if (context.revenue && context.revenue > 100000) {
    suggestions.push({
      type: 'tip',
      title: 'Vergi Optimizasyonu',
      description: 'Yüksek cirolu işletmeler için Ar-Ge teşvikleri ve yatırım indirimleri değerlendirilebilir.',
      action: 'Teşvik Detayları',
      priority: 'medium'
    });
  }

  return suggestions;
}

// ============================================
// KDV BEYANI HAZIRLIK
// ============================================

export interface VATReturn {
  period: string;
  outputVAT: number;      // Satış KDV (1. Kısım)
  inputVAT: number;       // Alış KDV (2. Kısım)
  netVAT: number;         // Ödenecek/İade
  submissionDeadline: string;
  status: 'draft' | 'ready' | 'submitted';
}

export function prepareVATReturn(
  period: string,
  sales: Array<{ amount: number; vatRate: number }>,
  purchases: Array<{ amount: number; vatRate: number }>
): VATReturn {
  // Çıktı KDV hesaplama
  const outputVAT = sales.reduce((total, sale) => {
    return total + (sale.amount * sale.vatRate / 100);
  }, 0);

  // Girdi KDV hesaplama
  const inputVAT = purchases.reduce((total, purchase) => {
    return total + (purchase.amount * purchase.vatRate / 100);
  }, 0);

  const netVAT = outputVAT - inputVAT;

  // Beyan son tarihi
  const [year, month] = period.split('-');
  const nextMonth = parseInt(month) + 1;
  const deadline = `${year}-${nextMonth.toString().padStart(2, '0')}-24`;

  return {
    period,
    outputVAT: parseFloat(outputVAT.toFixed(2)),
    inputVAT: parseFloat(inputVAT.toFixed(2)),
    netVAT: parseFloat(netVAT.toFixed(2)),
    submissionDeadline: deadline,
    status: 'draft'
  };
}

// ============================================
// CONVERSATIONAL AI - CONTEXT MEMORY
// ============================================

interface ConversationContext {
  previousQuestions: string[];
  calculationHistory: any[];
  userPreferences: {
    companyType?: 'limited' | 'anonim' | 'sahis';
    sector?: string;
    monthlyRevenue?: number;
  };
}

export class VATAssistantAI {
  private context: ConversationContext = {
    previousQuestions: [],
    calculationHistory: [],
    userPreferences: {}
  };

  ask(question: string): TaxResponse {
    // Soruyu kaydet
    this.context.previousQuestions.push(question);

    // Intent'i tespit et ve yanıt üret
    const response = generateTaxResponse(question);

    // Context-aware ek öneriler
    if (this.context.previousQuestions.length > 1) {
      const lastQuestion = this.context.previousQuestions[this.context.previousQuestions.length - 2];
      if (lastQuestion.includes('kdv') && question.includes('beyanname')) {
        response.answer += '\n\n💡 **İpucu:** Önceki KDV hesaplamanızı beyannamede kullanabilirsiniz.';
      }
    }

    return response;
  }

  setCompanyInfo(info: ConversationContext['userPreferences']) {
    this.context.userPreferences = { ...this.context.userPreferences, ...info };
  }

  getContext(): ConversationContext {
    return this.context;
  }

  reset() {
    this.context = {
      previousQuestions: [],
      calculationHistory: [],
      userPreferences: {}
    };
  }
}

// Export singleton instance
export const vatAI = new VATAssistantAI();

