/**
 * AI Muhasebe Asistanı - Akıllı Muhasebe Danışmanlık Motoru
 * Yevmiye, mizan, bilanço ve mali analiz desteği
 */

// ============================================
// MUHASEBE SİSTEMİ TEMEL KURALLARI
// ============================================

export const ACCOUNT_TYPES = {
  ASSET: { code: '1', name: 'Varlıklar', debitNormal: true },
  LIABILITY: { code: '3', name: 'Yükümlülükler', debitNormal: false },
  EQUITY: { code: '5', name: 'Özkaynaklar', debitNormal: false },
  REVENUE: { code: '6', name: 'Gelirler', debitNormal: false },
  EXPENSE: { code: '7', name: 'Giderler', debitNormal: true }
} as const;

// Türkiye Muhasebe Standartları - Temel Hesaplar
export const STANDARD_ACCOUNTS = {
  // Varlıklar (1)
  '100': 'Kasa',
  '102': 'Bankalar',
  '108': 'Diğer Hazır Değerler',
  '120': 'Alıcılar',
  '153': 'Ticari Mallar',
  '191': 'İndirilecek KDV',
  '253': 'Tesis Makine ve Cihazlar',
  
  // Yükümlülükler (3) 
  '320': 'Satıcılar',
  '360': 'Ödenecek Vergi ve Fonlar',
  '391': 'Hesaplanan KDV',
  
  // Özkaynaklar (5)
  '500': 'Sermaye',
  '570': 'Geçmiş Yıllar Karları',
  '590': 'Dönem Net Karı',
  
  // Gelirler (6)
  '600': 'Yurtiçi Satışlar',
  '601': 'Yurtdışı Satışlar',
  
  // Giderler (7)
  '710': 'Direkt İlk Madde ve Malzeme Giderleri',
  '720': 'Direkt İşçilik Giderleri',
  '750': 'Pazarlama Satış ve Dağıtım Giderleri',
  '770': 'Genel Yönetim Giderleri'
} as const;

// ============================================
// MUHASEBE AI - NLP INTENT DETECTION
// ============================================

interface AccountingIntent {
  type: 'journal' | 'account' | 'report' | 'analysis' | 'help' | 'calculation';
  subtype?: string;
  confidence: number;
  keywords: string[];
}

interface AccountingResponse {
  answer: string;
  journalEntry?: JournalEntry;
  suggestions?: string[];
  examples?: string[];
  relatedAccounts?: string[];
  confidence: number;
}

export interface JournalEntry {
  date: string;
  description: string;
  debit: Array<{ account: string; amount: number }>;
  credit: Array<{ account: string; amount: number }>;
  explanation?: string;
}

// Muhasebe Intent Patterns
const ACCOUNTING_INTENTS = {
  journal_entry: {
    patterns: [
      'yevmiye', 'kayıt', 'nasıl kaydedilir', 'muhasebe kaydı',
      'borç alacak', 'hangi hesap', 'journal entry'
    ],
    keywords: ['yevmiye', 'kayıt', 'kaydet', 'borç', 'alacak']
  },
  account_search: {
    patterns: [
      'hesap', 'hesap kodu', 'hangi hesap', 'hesap planı',
      'chart of accounts', 'account code'
    ],
    keywords: ['hesap', 'kod', 'plan', 'hesaba']
  },
  financial_report: {
    patterns: [
      'bilanço', 'gelir tablosu', 'mizan', 'rapor',
      'mali tablo', 'balance sheet', 'income statement'
    ],
    keywords: ['bilanço', 'tablo', 'rapor', 'mizan']
  },
  ratio_analysis: {
    patterns: [
      'oran', 'analiz', 'performans', 'kârlılık', 'likidite',
      'financial ratios', 'analysis'
    ],
    keywords: ['oran', 'analiz', 'performans', 'kârlılık']
  }
};

export function detectAccountingIntent(question: string): AccountingIntent {
  const normalized = question.toLowerCase().trim();
  let bestMatch: AccountingIntent = {
    type: 'help',
    confidence: 0,
    keywords: []
  };

  for (const [intentName, intentData] of Object.entries(ACCOUNTING_INTENTS)) {
    let score = 0;
    const matchedKeywords: string[] = [];

    // Pattern matching
    for (const pattern of intentData.patterns) {
      if (normalized.includes(pattern)) {
        score += 25;
        matchedKeywords.push(pattern);
      }
    }

    // Keyword matching
    for (const keyword of intentData.keywords) {
      if (normalized.includes(keyword)) {
        score += 10;
        matchedKeywords.push(keyword);
      }
    }

    if (score > bestMatch.confidence) {
      bestMatch = {
        type: intentName.split('_')[0] as any,
        subtype: intentName,
        confidence: Math.min(100, score),
        keywords: matchedKeywords
      };
    }
  }

  return bestMatch;
}

// ============================================
// AKILLI YEVMIYE KAYDICI
// ============================================

export function generateJournalEntry(transaction: {
  type: 'sale' | 'purchase' | 'payment' | 'receipt' | 'expense' | 'salary';
  amount: number;
  vatRate?: number;
  description?: string;
}): JournalEntry {
  const date = new Date().toISOString().split('T')[0];
  let entry: JournalEntry = {
    date,
    description: transaction.description || '',
    debit: [],
    credit: []
  };

  switch (transaction.type) {
    case 'sale':
      // Satış işlemi
      const vatAmount = transaction.vatRate ? (transaction.amount * transaction.vatRate / 100) : 0;
      const totalAmount = transaction.amount + vatAmount;
      
      entry.description = 'Mal/Hizmet Satışı';
      entry.debit = [
        { account: '120 Alıcılar', amount: totalAmount }
      ];
      entry.credit = [
        { account: '600 Yurtiçi Satışlar', amount: transaction.amount },
        { account: '391 Hesaplanan KDV', amount: vatAmount }
      ];
      entry.explanation = `KDV'li satış işlemi. Matrah: ${transaction.amount.toLocaleString('tr-TR')} ₺, KDV (%${transaction.vatRate}): ${vatAmount.toLocaleString('tr-TR')} ₺`;
      break;

    case 'purchase':
      // Alış işlemi
      const purchaseVAT = transaction.vatRate ? (transaction.amount * transaction.vatRate / 100) : 0;
      const purchaseTotal = transaction.amount + purchaseVAT;
      
      entry.description = 'Mal/Hizmet Alışı';
      entry.debit = [
        { account: '153 Ticari Mallar', amount: transaction.amount },
        { account: '191 İndirilecek KDV', amount: purchaseVAT }
      ];
      entry.credit = [
        { account: '320 Satıcılar', amount: purchaseTotal }
      ];
      entry.explanation = `KDV'li alış işlemi. Girdi KDV indirilecek.`;
      break;

    case 'payment':
      // Ödeme
      entry.description = 'Satıcıya Ödeme';
      entry.debit = [
        { account: '320 Satıcılar', amount: transaction.amount }
      ];
      entry.credit = [
        { account: '102 Bankalar', amount: transaction.amount }
      ];
      entry.explanation = 'Satıcı borcunun bankadan ödenmesi';
      break;

    case 'receipt':
      // Tahsilat
      entry.description = 'Alıcıdan Tahsilat';
      entry.debit = [
        { account: '102 Bankalar', amount: transaction.amount }
      ];
      entry.credit = [
        { account: '120 Alıcılar', amount: transaction.amount }
      ];
      entry.explanation = 'Alıcı alacağının bankaya tahsili';
      break;

    case 'expense':
      // Gider
      entry.description = 'İşletme Gideri';
      entry.debit = [
        { account: '770 Genel Yönetim Giderleri', amount: transaction.amount }
      ];
      entry.credit = [
        { account: '102 Bankalar', amount: transaction.amount }
      ];
      entry.explanation = 'Genel işletme giderinin bankadan ödenmesi';
      break;

    case 'salary':
      // Maaş
      const netSalary = transaction.amount * 0.85; // Basit hesaplama
      const taxes = transaction.amount * 0.15;
      
      entry.description = 'Maaş Ödemesi';
      entry.debit = [
        { account: '720 Direkt İşçilik Giderleri', amount: transaction.amount }
      ];
      entry.credit = [
        { account: '102 Bankalar', amount: netSalary },
        { account: '360 Ödenecek Vergi', amount: taxes }
      ];
      entry.explanation = 'Personel maaş ödemesi (vergi ve SGK kesintileri ile)';
      break;
  }

  return entry;
}

// ============================================
// MUHASEBE SORU-CEVAP MOTORU
// ============================================

export function generateAccountingResponse(question: string): AccountingResponse {
  const intent = detectAccountingIntent(question);
  const normalized = question.toLowerCase();

  // Satış kaydı
  if (normalized.includes('satış') && (normalized.includes('kayıt') || normalized.includes('nasıl'))) {
    const exampleEntry = generateJournalEntry({
      type: 'sale',
      amount: 10000,
      vatRate: 20,
      description: 'Mal satışı'
    });

    return {
      answer: `**Satış İşlemi Muhasebe Kaydı:**\n\n` +
        `KDV'li bir satış işlemini şu şekilde kaydederiz:\n\n` +
        `**Borç:**\n` +
        `└─ 120 Alıcılar: ${(10000 * 1.2).toLocaleString('tr-TR')} ₺\n\n` +
        `**Alacak:**\n` +
        `├─ 600 Yurtiçi Satışlar: 10.000 ₺\n` +
        `└─ 391 Hesaplanan KDV: 2.000 ₺\n\n` +
        `**Açıklama:** Satış yapıldığında alıcı borçlanır, satış geliri ve KDV borcu oluşur.`,
      journalEntry: exampleEntry,
      examples: [
        '5.000 ₺ + %20 KDV satış',
        '15.000 ₺ + %10 KDV satış (gıda)',
        'İhracat satışı (%0 KDV)'
      ],
      suggestions: [
        'Alış kaydı nasıl yapılır?',
        'Tahsilat kaydı',
        'KDV beyanı'
      ],
      relatedAccounts: ['120', '600', '391'],
      confidence: intent.confidence
    };
  }

  // Alış kaydı
  if (normalized.includes('alış') || normalized.includes('satın alma')) {
    return {
      answer: `**Alış İşlemi Muhasebe Kaydı:**\n\n` +
        `Mal veya hizmet alımında:\n\n` +
        `**Borç:**\n` +
        `├─ 153 Ticari Mallar: 8.000 ₺\n` +
        `└─ 191 İndirilecek KDV: 1.600 ₺\n\n` +
        `**Alacak:**\n` +
        `└─ 320 Satıcılar: 9.600 ₺\n\n` +
        `**Önemli:** Girdi KDV'si (191 hesap) çıktı KDV'den mahsup edilir.`,
      examples: [
        '10.000 ₺ + %20 KDV mal alımı',
        '5.000 ₺ + %10 KDV hizmet alımı',
        'Kırtasiye 500 ₺ + %20 KDV'
      ],
      suggestions: [
        'Ödeme kaydı nasıl yapılır?',
        'Stok takibi',
        'Girdi KDV nedir?'
      ],
      relatedAccounts: ['153', '191', '320'],
      confidence: intent.confidence
    };
  }

  // Maaş kaydı
  if (normalized.includes('maaş') || normalized.includes('ücret') || normalized.includes('personel')) {
    return {
      answer: `**Maaş Bordrosu Muhasebe Kaydı:**\n\n` +
        `Personel maaşları için:\n\n` +
        `**Borç:**\n` +
        `└─ 720 Direkt İşçilik Giderleri: 50.000 ₺\n\n` +
        `**Alacak:**\n` +
        `├─ 102 Bankalar: 34.750 ₺ (Net maaş)\n` +
        `├─ 360 Ödenecek Gelir Vergisi: 7.500 ₺\n` +
        `├─ 361 Ödenecek SGK: 6.750 ₺\n` +
        `└─ 335 Personele Borçlar: 1.000 ₺ (Diğer kesintiler)\n\n` +
        `**Açıklama:** Brüt maaş gider yazılır, vergiler ve SGK ayrı hesaplara alınır.`,
      examples: [
        'Toplam maaş: 100.000 ₺',
        'Yönetici maaşı: 25.000 ₺',
        'İşçi ücretleri: 75.000 ₺'
      ],
      suggestions: [
        'SGK hesaplama',
        'Gelir vergisi dilimi',
        'Kıdem tazminatı kaydı'
      ],
      relatedAccounts: ['720', '102', '360', '361'],
      confidence: intent.confidence
    };
  }

  // Amortisman
  if (normalized.includes('amortisman') || normalized.includes('aşınma')) {
    return {
      answer: `**Amortisman Kaydı:**\n\n` +
        `Duran varlıkların yıpranması:\n\n` +
        `**Borç:**\n` +
        `└─ 770 Genel Yönetim Giderleri: 2.000 ₺\n\n` +
        `**Alacak:**\n` +
        `└─ 257 Birikmiş Amortismanlar: 2.000 ₺\n\n` +
        `**Amortisman Oranları:**\n` +
        `• Binalar: %2-4\n` +
        `• Makine ve Teçhizat: %10-20\n` +
        `• Taşıtlar: %20-25\n` +
        `• Mobilya: %10-20\n` +
        `• Bilgisayar: %20-40\n\n` +
        `**Hesaplama:** (Maliyet × Oran) / 12 = Aylık amortisman`,
      examples: [
        'Makine 120.000 ₺, %20 oran → Yıllık 24.000 ₺, Aylık 2.000 ₺',
        'Araç 300.000 ₺, %25 oran → Yıllık 75.000 ₺, Aylık 6.250 ₺'
      ],
      suggestions: [
        'Amortisman oranları tablosu',
        'Hızlandırılmış amortisman',
        'Sabit kıymet kaydı'
      ],
      relatedAccounts: ['253', '257', '770'],
      confidence: intent.confidence
    };
  }

  // Kasa/Banka
  if (normalized.includes('kasa') || normalized.includes('banka') || normalized.includes('ödeme')) {
    return {
      answer: `**Kasa ve Banka İşlemleri:**\n\n` +
        `**Kasaya Para Girişi:**\n` +
        `Borç: 100 Kasa / Alacak: 102 Bankalar\n\n` +
        `**Bankadan Ödeme:**\n` +
        `Borç: 320 Satıcılar / Alacak: 102 Bankalar\n\n` +
        `**Kasadan Gider:**\n` +
        `Borç: 770 Genel Giderler / Alacak: 100 Kasa\n\n` +
        `**İpucu:** Kasa ve Banka varlık hesaplarıdır, borç artarsa artar.`,
      examples: [
        'Kasaya 10.000 ₺ konuldu',
        'Bankadan 5.000 ₺ ödeme yapıldı',
        'Kasadan 2.000 ₺ kırtasiye alındı'
      ],
      suggestions: [
        'Kasa sayımı nasıl yapılır?',
        'Banka mutabakatı',
        'Çek kaydı'
      ],
      relatedAccounts: ['100', '102', '103'],
      confidence: intent.confidence
    };
  }

  // Bilanço
  if (normalized.includes('bilanço')) {
    return {
      answer: `**Bilanço (Balance Sheet):**\n\n` +
        `Bir işletmenin mali durumunu gösteren tablodur.\n\n` +
        `**Aktif (Varlıklar) = Pasif (Kaynaklar)**\n\n` +
        `**AKTİF:**\n` +
        `├─ Dönen Varlıklar (Kasa, Banka, Alıcılar, Stok)\n` +
        `└─ Duran Varlıklar (Binalar, Makineler, Araçlar)\n\n` +
        `**PASİF:**\n` +
        `├─ Kısa Vadeli Yükümlülükler (Satıcılar, Krediler)\n` +
        `├─ Uzun Vadeli Yükümlülükler (Uzun vadeli krediler)\n` +
        `└─ Özkaynaklar (Sermaye, Kar Yedekleri)\n\n` +
        `**Temel Denklik:** Aktif = Pasif (Dengeli olmalı!)`,
      examples: [
        'Aktif: 500.000 ₺ = Pasif: 500.000 ₺',
        'Varlıklar: 1M ₺ = Borçlar 600k ₺ + Sermaye 400k ₺'
      ],
      suggestions: [
        'Gelir tablosu nedir?',
        'Mizan ne demek?',
        'Bilanço nasıl hazırlanır?'
      ],
      confidence: intent.confidence
    };
  }

  // Gelir Tablosu
  if (normalized.includes('gelir tablosu') || normalized.includes('kâr')) {
    return {
      answer: `**Gelir Tablosu (Income Statement):**\n\n` +
        `İşletmenin karlılığını gösteren rapor.\n\n` +
        `**Hesaplama:**\n` +
        `Satışlar (600)\n` +
        `- Satışların Maliyeti (710, 720)\n` +
        `= **Brüt Kar**\n\n` +
        `Brüt Kar\n` +
        `- Faaliyet Giderleri (750, 770)\n` +
        `= **Faaliyet Karı**\n\n` +
        `Faaliyet Karı\n` +
        `+ Diğer Gelirler\n` +
        `- Diğer Giderler\n` +
        `- Vergiler\n` +
        `= **Net Kar**\n\n` +
        `**Kârlılık Oranı:** (Net Kar / Satışlar) × 100`,
      examples: [
        'Satış 500k ₺, Maliyet 300k ₺, Gider 100k ₺ → Kar 100k ₺',
        'Brüt Kar Marjı: %40, Net Kar Marjı: %20'
      ],
      suggestions: [
        'Brüt kar nasıl artırılır?',
        'Gider azaltma teknikleri',
        'Karlılık analizi'
      ],
      confidence: intent.confidence
    };
  }

  // Borç-Alacak mantığı
  if (normalized.includes('borç') || normalized.includes('alacak')) {
    return {
      answer: `**Borç-Alacak Mantığı (Çift Taraflı Kayıt):**\n\n` +
        `Muhasebede her işlem 2 yönlü kaydedilir:\n\n` +
        `**BORÇ ARTAR:**\n` +
        `• Varlıklar (Kasa, Banka, Stok, Alacaklar)\n` +
        `• Giderler\n\n` +
        `**ALACAK ARTAR:**\n` +
        `• Kaynaklar (Sermaye, Yedekler)\n` +
        `• Borçlar (Satıcı, Kredi)\n` +
        `• Gelirler\n\n` +
        `**Temel Kural:** Toplam Borç = Toplam Alacak\n\n` +
        `**Örnek:** 10.000 ₺ nakit satış\n` +
        `Borç: Kasa 10.000 ₺\n` +
        `Alacak: Satışlar 10.000 ₺`,
      examples: [
        'Kasa arttı → Borç',
        'Satıcı borcu arttı → Alacak',
        'Gider yapıldı → Borç, Kasa azaldı → Alacak'
      ],
      suggestions: [
        'Mizan nedir?',
        'Borç-Alacak dengesi',
        'Yevmiye örneği'
      ],
      confidence: intent.confidence
    };
  }

  // Genel yardım
  return {
    answer: `**AI Muhasebe Asistanınız 🤖**\n\n` +
      `Size şu konularda yardımcı olabilirim:\n\n` +
      `📝 **Muhasebe Kayıtları:**\n` +
      `• Satış, alış, ödeme kayıtları\n` +
      `• Yevmiye fişi oluşturma\n` +
      `• Borç-alacak mantığı\n\n` +
      `📊 **Mali Raporlar:**\n` +
      `• Bilanço hazırlama\n` +
      `• Gelir tablosu analizi\n` +
      `• Mizan kontrolü\n\n` +
      `🧮 **Hesaplamalar:**\n` +
      `• Amortisman hesaplama\n` +
      `• Kar-zarar analizi\n` +
      `• Oran analizleri\n\n` +
      `Hangi konuda yardım istersiniz?`,
    suggestions: [
      'Satış nasıl kaydedilir?',
      'Bilanço nedir?',
      'Amortisman hesaplama',
      'Maaş kaydı örneği'
    ],
    confidence: 0
  };
}

// ============================================
// FİNANSAL ORAN ANALİZLERİ
// ============================================

export interface FinancialRatios {
  profitability: {
    grossProfitMargin: number;      // (Brüt Kar / Satışlar) × 100
    netProfitMargin: number;        // (Net Kar / Satışlar) × 100
    returnOnAssets: number;         // (Net Kar / Toplam Aktif) × 100
    returnOnEquity: number;         // (Net Kar / Özkaynaklar) × 100
  };
  liquidity: {
    currentRatio: number;           // Dönen Varlıklar / Kısa Vadeli Borçlar
    quickRatio: number;             // (Dönen Varlıklar - Stok) / Kısa Vadeli Borçlar
    cashRatio: number;              // Hazır Değerler / Kısa Vadeli Borçlar
  };
  leverage: {
    debtToAssets: number;           // Toplam Borç / Toplam Aktif
    debtToEquity: number;           // Toplam Borç / Özkaynaklar
    equityMultiplier: number;       // Toplam Aktif / Özkaynaklar
  };
}

export function calculateFinancialRatios(data: {
  revenue: number;
  grossProfit: number;
  netProfit: number;
  totalAssets: number;
  currentAssets: number;
  inventory: number;
  cash: number;
  currentLiabilities: number;
  totalLiabilities: number;
  equity: number;
}): FinancialRatios {
  return {
    profitability: {
      grossProfitMargin: (data.grossProfit / data.revenue) * 100,
      netProfitMargin: (data.netProfit / data.revenue) * 100,
      returnOnAssets: (data.netProfit / data.totalAssets) * 100,
      returnOnEquity: (data.netProfit / data.equity) * 100
    },
    liquidity: {
      currentRatio: data.currentAssets / data.currentLiabilities,
      quickRatio: (data.currentAssets - data.inventory) / data.currentLiabilities,
      cashRatio: data.cash / data.currentLiabilities
    },
    leverage: {
      debtToAssets: (data.totalLiabilities / data.totalAssets) * 100,
      debtToEquity: (data.totalLiabilities / data.equity) * 100,
      equityMultiplier: data.totalAssets / data.equity
    }
  };
}

// ============================================
// AKILLI ÖNERİ SİSTEMİ
// ============================================

export function getAccountingInsights(ratios: FinancialRatios): Array<{
  type: 'success' | 'warning' | 'danger' | 'info';
  category: string;
  message: string;
  recommendation: string;
}> {
  const insights = [];

  // Kârlılık analizi
  if (ratios.profitability.netProfitMargin < 5) {
    insights.push({
      type: 'danger',
      category: 'Kârlılık',
      message: `Net kar marjınız %${ratios.profitability.netProfitMargin.toFixed(2)} - sektör ortalamasının altında!`,
      recommendation: 'Giderlerinizi gözden geçirin ve fiyatlandırma stratejinizi optimize edin.'
    });
  } else if (ratios.profitability.netProfitMargin > 15) {
    insights.push({
      type: 'success',
      category: 'Kârlılık',
      message: `Harika! Net kar marjınız %${ratios.profitability.netProfitMargin.toFixed(2)} - sektör ortalamasının üzerinde.`,
      recommendation: 'Bu performansı sürdürün ve büyüme fırsatlarını değerlendirin.'
    });
  }

  // Likidite analizi
  if (ratios.liquidity.currentRatio < 1) {
    insights.push({
      type: 'danger',
      category: 'Likidite',
      message: `Cari oran ${ratios.liquidity.currentRatio.toFixed(2)} - kısa vadeli borç ödeme riski var!`,
      recommendation: 'Acil nakit girişi sağlayın veya borç yapılandırması yapın.'
    });
  } else if (ratios.liquidity.currentRatio >= 1.5 && ratios.liquidity.currentRatio <= 3) {
    insights.push({
      type: 'success',
      category: 'Likidite',
      message: `Cari oran ${ratios.liquidity.currentRatio.toFixed(2)} - sağlıklı likidite.`,
      recommendation: 'Likidite durumunuz ideal seviyede.'
    });
  }

  // Borçluluk analizi
  if (ratios.leverage.debtToAssets > 70) {
    insights.push({
      type: 'warning',
      category: 'Borçluluk',
      message: `Borç/Aktif oranı %${ratios.leverage.debtToAssets.toFixed(2)} - yüksek borçlanma!`,
      recommendation: 'Özkaynak artırımı veya borç azaltımı düşünün.'
    });
  }

  // Verimlilik
  if (ratios.profitability.returnOnAssets < 5) {
    insights.push({
      type: 'warning',
      category: 'Verimlilik',
      message: `Aktif karlılık oranı %${ratios.profitability.returnOnAssets.toFixed(2)} - varlıklarınızı yeteri kadar verimli kullanmıyorsunuz.`,
      recommendation: 'Varlık devir hızını artırın, atıl varlıkları değerlendirin.'
    });
  }

  return insights;
}

// ============================================
// CONVERSATIONAL AI CLASS
// ============================================

export class AccountingAssistantAI {
  private conversationHistory: Array<{ question: string; answer: string }> = [];

  ask(question: string): AccountingResponse {
    const response = generateAccountingResponse(question);
    
    // Conversation history'ye ekle
    this.conversationHistory.push({
      question,
      answer: response.answer
    });

    // Context-aware ek bilgiler
    if (this.conversationHistory.length > 1) {
      const prevQuestion = this.conversationHistory[this.conversationHistory.length - 2].question;
      
      // İlgili sorular tespit et
      if (prevQuestion.includes('satış') && question.includes('alış')) {
        response.answer += '\n\n💡 **İlgili:** Satış ve alış kayıtları birlikte çalışır. Girdi KDV\'si çıktı KDV\'den düşülür.';
      }
    }

    return response;
  }

  getHistory() {
    return this.conversationHistory;
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}

// Export singleton
export const accountingAI = new AccountingAssistantAI();

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function formatCurrency(amount: number, currency: string = 'TRY'): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `%${value.toFixed(decimals)}`;
}

