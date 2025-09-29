// Internationalization configuration for TDC Market
export const supportedLanguages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' }
] as const;

export type SupportedLanguage = typeof supportedLanguages[number]['code'];

export const defaultLanguage: SupportedLanguage = 'tr';

// Translation keys and their translations
export const translations = {
  tr: {
    // Navigation
    nav: {
      products: 'Ürünler',
      campaigns: 'Kampanyalar',
      about: 'Hakkımızda',
      blog: 'Blog',
      contact: 'İletişim',
      becomeSeller: 'Satıcı Ol',
      admin: 'Admin',
      login: 'Giriş Yap',
      register: 'Kayıt Ol',
      logout: 'Çıkış Yap'
    },
    
    // Homepage
    home: {
      hero: {
        title: 'TDC Market',
        subtitle: 'Global Pazaryeri',
        description: '3D Baskı Figürler ve Daha Fazlası',
        details: 'Dünya çapında milyonlarca ürün, güvenli ödeme ve hızlı kargo ile alışveriş deneyiminizi yaşayın.'
      },
      features: {
        trusted_sellers: {
          title: 'Güvenilir Satıcılar',
          description: 'Doğrulanmış satıcılardan alışveriş yapın'
        },
        fast_delivery: {
          title: 'Hızlı Teslimat',
          description: '24 saat içinde kargo, 2-3 gün teslimat'
        },
        secure_payment: {
          title: 'Güvenli Ödeme',
          description: '256-bit SSL şifreleme ile güvenli ödeme'
        }
      }
    },
    
    // Seller
    seller: {
      becomeSeller: 'Satıcı Ol',
      dashboard: 'Satıcı Paneli',
      register: 'Satıcı Kaydı',
      benefits: {
        globalMarket: 'Global Pazar',
        lowCommission: 'Düşük Komisyon',
        shippingIntegration: 'Kargo Entegrasyonu',
        securePayment: 'Güvenli Ödeme',
        ratingSystem: 'Değerlendirme Sistemi',
        detailedAnalytics: 'Detaylı Analitik'
      },
      form: {
        personalInfo: 'Kişisel Bilgiler',
        companyInfo: 'Şirket Bilgileri',
        bankInfo: 'Banka Bilgileri',
        storeInfo: 'Mağaza Bilgileri',
        documents: 'Belgeler ve Onaylar'
      }
    },
    
    // Products
    products: {
      title: 'Ürünler',
      search: 'Ürün ara...',
      categories: 'Kategoriler',
      price: 'Fiyat',
      rating: 'Değerlendirme',
      addToCart: 'Sepete Ekle',
      buyNow: 'Hemen Satın Al',
      outOfStock: 'Stokta Yok',
      inStock: 'Stokta Var'
    },
    
    // Cart
    cart: {
      title: 'Sepetim',
      empty: 'Sepetiniz boş',
      subtotal: 'Ara Toplam',
      shipping: 'Kargo',
      tax: 'Vergi',
      total: 'Toplam',
      checkout: 'Ödemeye Geç',
      continueShopping: 'Alışverişe Devam Et'
    },
    
    // Common
    common: {
      loading: 'Yükleniyor...',
      error: 'Bir hata oluştu',
      success: 'Başarılı',
      cancel: 'İptal',
      save: 'Kaydet',
      delete: 'Sil',
      edit: 'Düzenle',
      view: 'Görüntüle',
      search: 'Ara',
      filter: 'Filtrele',
      sort: 'Sırala',
      next: 'İleri',
      previous: 'Geri',
      submit: 'Gönder',
      close: 'Kapat',
      yes: 'Evet',
      no: 'Hayır',
      ok: 'Tamam',
      currency: '₺',
      dateFormat: 'DD.MM.YYYY'
    }
  },
  
  en: {
    // Navigation
    nav: {
      products: 'Products',
      campaigns: 'Campaigns',
      about: 'About',
      blog: 'Blog',
      contact: 'Contact',
      becomeSeller: 'Become Seller',
      admin: 'Admin',
      login: 'Login',
      register: 'Register',
      logout: 'Logout'
    },
    
    // Homepage
    home: {
      hero: {
        title: 'TDC Market',
        subtitle: 'Global Marketplace',
        description: '3D Printed Figures and More',
        details: 'Shop millions of products worldwide with secure payment and fast shipping.'
      },
      features: {
        trusted_sellers: {
          title: 'Trusted Sellers',
          description: 'Shop from verified sellers'
        },
        fast_delivery: {
          title: 'Fast Delivery',
          description: '24h shipping, 2-3 day delivery'
        },
        secure_payment: {
          title: 'Secure Payment',
          description: 'Secure payment with 256-bit SSL encryption'
        }
      }
    },
    
    // Seller
    seller: {
      becomeSeller: 'Become Seller',
      dashboard: 'Seller Dashboard',
      register: 'Seller Registration',
      benefits: {
        globalMarket: 'Global Market',
        lowCommission: 'Low Commission',
        shippingIntegration: 'Shipping Integration',
        securePayment: 'Secure Payment',
        ratingSystem: 'Rating System',
        detailedAnalytics: 'Detailed Analytics'
      },
      form: {
        personalInfo: 'Personal Information',
        companyInfo: 'Company Information',
        bankInfo: 'Bank Information',
        storeInfo: 'Store Information',
        documents: 'Documents and Approvals'
      }
    },
    
    // Products
    products: {
      title: 'Products',
      search: 'Search products...',
      categories: 'Categories',
      price: 'Price',
      rating: 'Rating',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock'
    },
    
    // Cart
    cart: {
      title: 'My Cart',
      empty: 'Your cart is empty',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      checkout: 'Checkout',
      continueShopping: 'Continue Shopping'
    },
    
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      currency: '$',
      dateFormat: 'MM/DD/YYYY'
    }
  },
  
  de: {
    // Navigation
    nav: {
      products: 'Produkte',
      campaigns: 'Kampagnen',
      about: 'Über uns',
      blog: 'Blog',
      contact: 'Kontakt',
      becomeSeller: 'Verkäufer werden',
      admin: 'Admin',
      login: 'Anmelden',
      register: 'Registrieren',
      logout: 'Abmelden'
    },
    
    // Homepage
    home: {
      hero: {
        title: 'TDC Market',
        subtitle: 'Globaler Marktplatz',
        description: '3D-gedruckte Figuren und mehr',
        details: 'Kaufen Sie Millionen von Produkten weltweit mit sicherer Zahlung und schnellem Versand.'
      },
      features: {
        trusted_sellers: {
          title: 'Vertrauensvolle Verkäufer',
          description: 'Kaufen Sie bei verifizierten Verkäufern'
        },
        fast_delivery: {
          title: 'Schnelle Lieferung',
          description: '24h Versand, 2-3 Tage Lieferung'
        },
        secure_payment: {
          title: 'Sichere Zahlung',
          description: 'Sichere Zahlung mit 256-bit SSL-Verschlüsselung'
        }
      }
    },
    
    // Seller
    seller: {
      becomeSeller: 'Verkäufer werden',
      dashboard: 'Verkäufer-Dashboard',
      register: 'Verkäufer-Registrierung',
      benefits: {
        globalMarket: 'Globaler Markt',
        lowCommission: 'Niedrige Provision',
        shippingIntegration: 'Versand-Integration',
        securePayment: 'Sichere Zahlung',
        ratingSystem: 'Bewertungssystem',
        detailedAnalytics: 'Detaillierte Analytik'
      },
      form: {
        personalInfo: 'Persönliche Informationen',
        companyInfo: 'Firmeninformationen',
        bankInfo: 'Bankinformationen',
        storeInfo: 'Shop-Informationen',
        documents: 'Dokumente und Genehmigungen'
      }
    },
    
    // Products
    products: {
      title: 'Produkte',
      search: 'Produkte suchen...',
      categories: 'Kategorien',
      price: 'Preis',
      rating: 'Bewertung',
      addToCart: 'In den Warenkorb',
      buyNow: 'Jetzt kaufen',
      outOfStock: 'Nicht vorrätig',
      inStock: 'Auf Lager'
    },
    
    // Cart
    cart: {
      title: 'Mein Warenkorb',
      empty: 'Ihr Warenkorb ist leer',
      subtotal: 'Zwischensumme',
      shipping: 'Versand',
      tax: 'Steuer',
      total: 'Gesamt',
      checkout: 'Zur Kasse',
      continueShopping: 'Einkauf fortsetzen'
    },
    
    // Common
    common: {
      loading: 'Wird geladen...',
      error: 'Ein Fehler ist aufgetreten',
      success: 'Erfolgreich',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      view: 'Anzeigen',
      search: 'Suchen',
      filter: 'Filtern',
      sort: 'Sortieren',
      next: 'Weiter',
      previous: 'Zurück',
      submit: 'Senden',
      close: 'Schließen',
      yes: 'Ja',
      no: 'Nein',
      ok: 'OK',
      currency: '€',
      dateFormat: 'DD.MM.YYYY'
    }
  }
} as const;

// Type for translation keys
export type TranslationKeys = typeof translations.tr;

// Get translation function
export function getTranslation(lang: SupportedLanguage, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k as keyof typeof value];
    } else {
      // Fallback to Turkish if key not found
      value = translations.tr;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey as keyof typeof value];
        } else {
          return key; // Return key if not found
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// Format currency based on language
export function formatCurrency(amount: number, lang: SupportedLanguage): string {
  const currencies = {
    tr: 'TRY',
    en: 'USD',
    de: 'EUR',
    fr: 'EUR',
    es: 'EUR',
    it: 'EUR',
    pt: 'EUR',
    ru: 'RUB',
    ar: 'SAR',
    zh: 'CNY',
    ja: 'JPY',
    ko: 'KRW'
  };
  
  const currency = currencies[lang] || 'USD';
  
  try {
    return new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

// Format date based on language
export function formatDate(date: Date | string, lang: SupportedLanguage): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  try {
    return new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  } catch {
    return dateObj.toLocaleDateString();
  }
}

// Get language from browser or default
export function getBrowserLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return defaultLanguage;
  
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  return supportedLanguages.find(lang => lang.code === browserLang)?.code || defaultLanguage;
}

// Save language preference
export function saveLanguagePreference(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('tdc-market-language', lang);
}

// Get saved language preference
export function getSavedLanguagePreference(): SupportedLanguage {
  if (typeof window === 'undefined') return defaultLanguage;
  
  const saved = localStorage.getItem('tdc-market-language') as SupportedLanguage;
  return supportedLanguages.find(lang => lang.code === saved)?.code || defaultLanguage;
}
