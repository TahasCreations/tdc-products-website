/**
 * Multi-Language Support
 * Turkish, English, Arabic, Russian
 */

export type Language = 'tr' | 'en' | 'ar' | 'ru';

export interface Translation {
  [key: string]: string | Translation;
}

export const translations: Record<Language, Translation> = {
  // Turkish (Default)
  tr: {
    common: {
      search: 'Ara',
      cart: 'Sepet',
      wishlist: 'Favoriler',
      account: 'Hesabım',
      logout: 'Çıkış',
      login: 'Giriş',
      signup: 'Kayıt Ol',
      addToCart: 'Sepete Ekle',
      buyNow: 'Hemen Al',
      outOfStock: 'Stokta Yok',
      inStock: 'Stokta',
      categories: 'Kategoriler',
      price: 'Fiyat',
      rating: 'Değerlendirme',
      reviews: 'Yorumlar'
    },
    product: {
      details: 'Ürün Detayları',
      specifications: 'Özellikler',
      reviews: 'Müşteri Yorumları',
      relatedProducts: 'Benzer Ürünler',
      shipping: 'Kargo Bilgisi',
      returns: 'İade Koşulları'
    },
    checkout: {
      title: 'Ödeme',
      shippingAddress: 'Teslimat Adresi',
      paymentMethod: 'Ödeme Yöntemi',
      orderSummary: 'Sipariş Özeti',
      placeOrder: 'Siparişi Tamamla',
      total: 'Toplam',
      subtotal: 'Ara Toplam',
      shipping: 'Kargo',
      tax: 'KDV'
    }
  },

  // English
  en: {
    common: {
      search: 'Search',
      cart: 'Cart',
      wishlist: 'Wishlist',
      account: 'My Account',
      logout: 'Logout',
      login: 'Login',
      signup: 'Sign Up',
      addToCart: 'Add to Cart',
      buyNow: 'Buy Now',
      outOfStock: 'Out of Stock',
      inStock: 'In Stock',
      categories: 'Categories',
      price: 'Price',
      rating: 'Rating',
      reviews: 'Reviews'
    },
    product: {
      details: 'Product Details',
      specifications: 'Specifications',
      reviews: 'Customer Reviews',
      relatedProducts: 'Related Products',
      shipping: 'Shipping Info',
      returns: 'Return Policy'
    },
    checkout: {
      title: 'Checkout',
      shippingAddress: 'Shipping Address',
      paymentMethod: 'Payment Method',
      orderSummary: 'Order Summary',
      placeOrder: 'Place Order',
      total: 'Total',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax'
    }
  },

  // Arabic
  ar: {
    common: {
      search: 'بحث',
      cart: 'عربة التسوق',
      wishlist: 'المفضلة',
      account: 'حسابي',
      logout: 'تسجيل خروج',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      addToCart: 'أضف إلى السلة',
      buyNow: 'اشتر الآن',
      outOfStock: 'غير متوفر',
      inStock: 'متوفر',
      categories: 'الفئات',
      price: 'السعر',
      rating: 'التقييم',
      reviews: 'المراجعات'
    },
    product: {
      details: 'تفاصيل المنتج',
      specifications: 'المواصفات',
      reviews: 'آراء العملاء',
      relatedProducts: 'منتجات ذات صلة',
      shipping: 'معلومات الشحن',
      returns: 'سياسة الإرجاع'
    },
    checkout: {
      title: 'الدفع',
      shippingAddress: 'عنوان الشحن',
      paymentMethod: 'طريقة الدفع',
      orderSummary: 'ملخص الطلب',
      placeOrder: 'إتمام الطلب',
      total: 'المجموع',
      subtotal: 'المجموع الفرعي',
      shipping: 'الشحن',
      tax: 'الضريبة'
    }
  },

  // Russian
  ru: {
    common: {
      search: 'Поиск',
      cart: 'Корзина',
      wishlist: 'Избранное',
      account: 'Мой Аккаунт',
      logout: 'Выход',
      login: 'Вход',
      signup: 'Регистрация',
      addToCart: 'В корзину',
      buyNow: 'Купить сейчас',
      outOfStock: 'Нет в наличии',
      inStock: 'В наличии',
      categories: 'Категории',
      price: 'Цена',
      rating: 'Рейтинг',
      reviews: 'Отзывы'
    },
    product: {
      details: 'Детали продукта',
      specifications: 'Характеристики',
      reviews: 'Отзывы покупателей',
      relatedProducts: 'Похожие товары',
      shipping: 'Доставка',
      returns: 'Возврат'
    },
    checkout: {
      title: 'Оформление заказа',
      shippingAddress: 'Адрес доставки',
      paymentMethod: 'Способ оплаты',
      orderSummary: 'Итого',
      placeOrder: 'Оформить заказ',
      total: 'Всего',
      subtotal: 'Промежуточный итог',
      shipping: 'Доставка',
      tax: 'Налог'
    }
  }
};

/**
 * Get translation
 */
export function t(key: string, lang: Language = 'tr'): string {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // Fallback to key
    }
  }

  return typeof value === 'string' ? value : key;
}

/**
 * Get current language from localStorage
 */
export function getCurrentLanguage(): Language {
  if (typeof window === 'undefined') return 'tr';
  return (localStorage.getItem('language') as Language) || 'tr';
}

/**
 * Set language
 */
export function setLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('language', lang);
  window.location.reload();
}

/**
 * Detect browser language
 */
export function detectBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'tr';
  
  const browserLang = navigator.language.split('-')[0];
  const supportedLangs: Language[] = ['tr', 'en', 'ar', 'ru'];
  
  return supportedLangs.includes(browserLang as Language) 
    ? (browserLang as Language)
    : 'tr';
}
