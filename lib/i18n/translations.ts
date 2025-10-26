export interface Translation {
  [key: string]: string | Translation;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', rtl: false },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', rtl: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
];

export const translations: Record<string, Translation> = {
  en: {
    common: {
      home: 'Home',
      products: 'Products',
      cart: 'Cart',
      checkout: 'Checkout',
      search: 'Search',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      profile: 'Profile',
      settings: 'Settings',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      remove: 'Remove',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    product: {
      title: 'Products',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      price: 'Price',
      description: 'Description',
      reviews: 'Reviews',
      related: 'Related Products',
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      total: 'Total',
      checkout: 'Proceed to Checkout',
    },
  },
  tr: {
    common: {
      home: 'Ana Sayfa',
      products: 'Ürünler',
      cart: 'Sepet',
      checkout: 'Ödeme',
      search: 'Ara',
      login: 'Giriş',
      signup: 'Kayıt Ol',
      logout: 'Çıkış',
      profile: 'Profil',
      settings: 'Ayarlar',
      save: 'Kaydet',
      cancel: 'İptal',
      delete: 'Sil',
      edit: 'Düzenle',
      add: 'Ekle',
      remove: 'Kaldır',
      loading: 'Yükleniyor...',
      error: 'Hata',
      success: 'Başarılı',
    },
    product: {
      title: 'Ürünler',
      addToCart: 'Sepete Ekle',
      buyNow: 'Hemen Al',
      price: 'Fiyat',
      description: 'Açıklama',
      reviews: 'Yorumlar',
      related: 'İlgili Ürünler',
    },
    cart: {
      title: 'Alışveriş Sepeti',
      empty: 'Sepetiniz boş',
      subtotal: 'Ara Toplam',
      shipping: 'Kargo',
      total: 'Toplam',
      checkout: 'Ödemeye Geç',
    },
  },
};

export class I18nService {
  private static currentLanguage = 'en';

  /**
   * Get translation
   */
  static t(key: string, language?: string): string {
    const lang = language || this.currentLanguage;
    const keys = key.split('.');
    let value: any = translations[lang];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  }

  /**
   * Set current language
   */
  static setLanguage(language: string): void {
    this.currentLanguage = language;
    localStorage.setItem('preferred-language', language);
  }

  /**
   * Get current language
   */
  static getLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Detect user language
   */
  static detectLanguage(): string {
    // Check localStorage
    const saved = localStorage.getItem('preferred-language');
    if (saved) return saved;

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (supportedLanguages.find(l => l.code === browserLang)) {
      return browserLang;
    }

    return 'en';
  }

  /**
   * Format currency
   */
  static formatCurrency(amount: number, currency: string, language?: string): string {
    const lang = language || this.currentLanguage;
    return new Intl.NumberFormat(lang, {
      style: 'currency',
      currency,
    }).format(amount);
  }

  /**
   * Format date
   */
  static formatDate(date: Date, language?: string): string {
    const lang = language || this.currentLanguage;
    return new Intl.DateTimeFormat(lang).format(date);
  }

  /**
   * Format number
   */
  static formatNumber(number: number, language?: string): string {
    const lang = language || this.currentLanguage;
    return new Intl.NumberFormat(lang).format(number);
  }
}

