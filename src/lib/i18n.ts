export type SupportedLanguage = 'tr' | 'en' | 'de' | 'ar' | 'fr';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
  currency: string;
  dateFormat: string;
  numberFormat: Intl.NumberFormatOptions;
}

export const supportedLanguages: LanguageConfig[] = [
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    rtl: false,
    currency: 'TRY',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    rtl: false,
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    rtl: false,
    currency: 'EUR',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    rtl: true,
    currency: 'SAR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    rtl: false,
    currency: 'EUR',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }
  }
];

// Translation keys interface
export interface Translations {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    sort: string;
    export: string;
    import: string;
    yes: string;
    no: string;
    confirm: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    open: string;
    view: string;
    details: string;
    settings: string;
    help: string;
    about: string;
    contact: string;
    home: string;
    dashboard: string;
    profile: string;
    logout: string;
    login: string;
    register: string;
  };
  
  // Navigation
  navigation: {
    home: string;
    products: string;
    categories: string;
    cart: string;
    wishlist: string;
    orders: string;
    profile: string;
    admin: string;
    analytics: string;
    reports: string;
    settings: string;
    help: string;
  };
  
  // E-commerce
  ecommerce: {
    addToCart: string;
    buyNow: string;
    addToWishlist: string;
    removeFromWishlist: string;
    outOfStock: string;
    inStock: string;
    price: string;
    quantity: string;
    total: string;
    subtotal: string;
    tax: string;
    shipping: string;
    discount: string;
    checkout: string;
    payment: string;
    orderSummary: string;
    orderHistory: string;
    orderStatus: string;
    trackingNumber: string;
    estimatedDelivery: string;
    reviews: string;
    rating: string;
    writeReview: string;
    productDetails: string;
    specifications: string;
    description: string;
    relatedProducts: string;
    recommendedProducts: string;
    recentlyViewed: string;
    bestSellers: string;
    newArrivals: string;
    onSale: string;
    freeShipping: string;
    returnPolicy: string;
    warranty: string;
    customerService: string;
  };
  
  // Business/Admin
  business: {
    dashboard: string;
    sales: string;
    revenue: string;
    profit: string;
    customers: string;
    orders: string;
    products: string;
    inventory: string;
    suppliers: string;
    employees: string;
    reports: string;
    analytics: string;
    accounting: string;
    invoices: string;
    payments: string;
    expenses: string;
    taxes: string;
    payroll: string;
    marketing: string;
    campaigns: string;
    leads: string;
    crm: string;
    support: string;
    tickets: string;
    knowledgeBase: string;
    settings: string;
    users: string;
    roles: string;
    permissions: string;
    security: string;
    backup: string;
    integrations: string;
    api: string;
    webhooks: string;
  };
  
  // AI Features
  ai: {
    chatbot: string;
    recommendations: string;
    predictions: string;
    analytics: string;
    automation: string;
    insights: string;
    smartSearch: string;
    personalization: string;
    optimization: string;
    forecasting: string;
    segmentation: string;
    pricing: string;
    inventory: string;
    customerService: string;
    salesForecast: string;
    demandPrediction: string;
    priceOptimization: string;
    customerInsights: string;
    marketAnalysis: string;
    trendAnalysis: string;
    anomalyDetection: string;
    naturalLanguageQuery: string;
    voiceAssistant: string;
    imageRecognition: string;
    sentimentAnalysis: string;
  };
  
  // Payment
  payment: {
    creditCard: string;
    bankTransfer: string;
    bitcoin: string;
    ethereum: string;
    paypal: string;
    applePay: string;
    googlePay: string;
    mobilePayment: string;
    digitalWallet: string;
    cashOnDelivery: string;
    installment: string;
    paymentMethod: string;
    paymentStatus: string;
    transactionId: string;
    processingFee: string;
    totalAmount: string;
    currency: string;
    exchangeRate: string;
    paymentSuccessful: string;
    paymentFailed: string;
    paymentPending: string;
    refund: string;
    chargeback: string;
  };
  
  // Error Messages
  errors: {
    networkError: string;
    serverError: string;
    notFound: string;
    unauthorized: string;
    forbidden: string;
    validationError: string;
    paymentError: string;
    inventoryError: string;
    userError: string;
    systemError: string;
    timeoutError: string;
    connectionError: string;
    authenticationError: string;
    authorizationError: string;
    dataError: string;
    fileError: string;
    uploadError: string;
    downloadError: string;
    processingError: string;
    configurationError: string;
  };
  
  // Success Messages
  success: {
    saved: string;
    updated: string;
    deleted: string;
    created: string;
    uploaded: string;
    downloaded: string;
    exported: string;
    imported: string;
    sent: string;
    received: string;
    processed: string;
    completed: string;
    approved: string;
    rejected: string;
    published: string;
    unpublished: string;
    activated: string;
    deactivated: string;
    connected: string;
    disconnected: string;
    synchronized: string;
    backedUp: string;
    restored: string;
  };
}

// Default Turkish translations
export const defaultTranslations: Translations = {
  common: {
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'Düzenle',
    add: 'Ekle',
    search: 'Ara',
    filter: 'Filtrele',
    sort: 'Sırala',
    export: 'Dışa Aktar',
    import: 'İçe Aktar',
    yes: 'Evet',
    no: 'Hayır',
    confirm: 'Onayla',
    back: 'Geri',
    next: 'İleri',
    previous: 'Önceki',
    close: 'Kapat',
    open: 'Aç',
    view: 'Görüntüle',
    details: 'Detaylar',
    settings: 'Ayarlar',
    help: 'Yardım',
    about: 'Hakkında',
    contact: 'İletişim',
    home: 'Ana Sayfa',
    dashboard: 'Panel',
    profile: 'Profil',
    logout: 'Çıkış',
    login: 'Giriş',
    register: 'Kayıt Ol'
  },
  navigation: {
    home: 'Ana Sayfa',
    products: 'Ürünler',
    categories: 'Kategoriler',
    cart: 'Sepet',
    wishlist: 'Favoriler',
    orders: 'Siparişler',
    profile: 'Profil',
    admin: 'Yönetim',
    analytics: 'Analitik',
    reports: 'Raporlar',
    settings: 'Ayarlar',
    help: 'Yardım'
  },
  ecommerce: {
    addToCart: 'Sepete Ekle',
    buyNow: 'Hemen Satın Al',
    addToWishlist: 'Favorilere Ekle',
    removeFromWishlist: 'Favorilerden Çıkar',
    outOfStock: 'Stokta Yok',
    inStock: 'Stokta Var',
    price: 'Fiyat',
    quantity: 'Miktar',
    total: 'Toplam',
    subtotal: 'Ara Toplam',
    tax: 'Vergi',
    shipping: 'Kargo',
    discount: 'İndirim',
    checkout: 'Ödeme',
    payment: 'Ödeme',
    orderSummary: 'Sipariş Özeti',
    orderHistory: 'Sipariş Geçmişi',
    orderStatus: 'Sipariş Durumu',
    trackingNumber: 'Takip Numarası',
    estimatedDelivery: 'Tahmini Teslimat',
    reviews: 'Yorumlar',
    rating: 'Değerlendirme',
    writeReview: 'Yorum Yaz',
    productDetails: 'Ürün Detayları',
    specifications: 'Özellikler',
    description: 'Açıklama',
    relatedProducts: 'İlgili Ürünler',
    recommendedProducts: 'Önerilen Ürünler',
    recentlyViewed: 'Son Görüntülenenler',
    bestSellers: 'En Çok Satanlar',
    newArrivals: 'Yeni Gelenler',
    onSale: 'İndirimde',
    freeShipping: 'Ücretsiz Kargo',
    returnPolicy: 'İade Politikası',
    warranty: 'Garanti',
    customerService: 'Müşteri Hizmetleri'
  },
  business: {
    dashboard: 'Panel',
    sales: 'Satışlar',
    revenue: 'Gelir',
    profit: 'Kar',
    customers: 'Müşteriler',
    orders: 'Siparişler',
    products: 'Ürünler',
    inventory: 'Stok',
    suppliers: 'Tedarikçiler',
    employees: 'Çalışanlar',
    reports: 'Raporlar',
    analytics: 'Analitik',
    accounting: 'Muhasebe',
    invoices: 'Faturalar',
    payments: 'Ödemeler',
    expenses: 'Giderler',
    taxes: 'Vergiler',
    payroll: 'Bordro',
    marketing: 'Pazarlama',
    campaigns: 'Kampanyalar',
    leads: 'Potansiyel Müşteriler',
    crm: 'Müşteri İlişkileri',
    support: 'Destek',
    tickets: 'Destek Talepleri',
    knowledgeBase: 'Bilgi Bankası',
    settings: 'Ayarlar',
    users: 'Kullanıcılar',
    roles: 'Roller',
    permissions: 'İzinler',
    security: 'Güvenlik',
    backup: 'Yedekleme',
    integrations: 'Entegrasyonlar',
    api: 'API',
    webhooks: 'Webhook\'lar'
  },
  ai: {
    chatbot: 'AI Asistan',
    recommendations: 'Öneriler',
    predictions: 'Tahminler',
    analytics: 'Analitik',
    automation: 'Otomasyon',
    insights: 'İçgörüler',
    smartSearch: 'Akıllı Arama',
    personalization: 'Kişiselleştirme',
    optimization: 'Optimizasyon',
    forecasting: 'Tahminleme',
    segmentation: 'Segmentasyon',
    pricing: 'Fiyatlandırma',
    inventory: 'Stok',
    customerService: 'Müşteri Hizmetleri',
    salesForecast: 'Satış Tahmini',
    demandPrediction: 'Talep Tahmini',
    priceOptimization: 'Fiyat Optimizasyonu',
    customerInsights: 'Müşteri İçgörüleri',
    marketAnalysis: 'Pazar Analizi',
    trendAnalysis: 'Trend Analizi',
    anomalyDetection: 'Anomali Tespiti',
    naturalLanguageQuery: 'Doğal Dil Sorgusu',
    voiceAssistant: 'Sesli Asistan',
    imageRecognition: 'Görüntü Tanıma',
    sentimentAnalysis: 'Duygu Analizi'
  },
  payment: {
    creditCard: 'Kredi Kartı',
    bankTransfer: 'Banka Havalesi',
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    paypal: 'PayPal',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    mobilePayment: 'Mobil Ödeme',
    digitalWallet: 'Dijital Cüzdan',
    cashOnDelivery: 'Kapıda Ödeme',
    installment: 'Taksit',
    paymentMethod: 'Ödeme Yöntemi',
    paymentStatus: 'Ödeme Durumu',
    transactionId: 'İşlem ID',
    processingFee: 'İşlem Ücreti',
    totalAmount: 'Toplam Tutar',
    currency: 'Para Birimi',
    exchangeRate: 'Döviz Kuru',
    paymentSuccessful: 'Ödeme Başarılı',
    paymentFailed: 'Ödeme Başarısız',
    paymentPending: 'Ödeme Beklemede',
    refund: 'İade',
    chargeback: 'Geri Çekme'
  },
  errors: {
    networkError: 'Ağ bağlantı hatası',
    serverError: 'Sunucu hatası',
    notFound: 'Bulunamadı',
    unauthorized: 'Yetkisiz erişim',
    forbidden: 'Erişim engellendi',
    validationError: 'Doğrulama hatası',
    paymentError: 'Ödeme hatası',
    inventoryError: 'Stok hatası',
    userError: 'Kullanıcı hatası',
    systemError: 'Sistem hatası',
    timeoutError: 'Zaman aşımı',
    connectionError: 'Bağlantı hatası',
    authenticationError: 'Kimlik doğrulama hatası',
    authorizationError: 'Yetkilendirme hatası',
    dataError: 'Veri hatası',
    fileError: 'Dosya hatası',
    uploadError: 'Yükleme hatası',
    downloadError: 'İndirme hatası',
    processingError: 'İşleme hatası',
    configurationError: 'Yapılandırma hatası'
  },
  success: {
    saved: 'Kaydedildi',
    updated: 'Güncellendi',
    deleted: 'Silindi',
    created: 'Oluşturuldu',
    uploaded: 'Yüklendi',
    downloaded: 'İndirildi',
    exported: 'Dışa aktarıldı',
    imported: 'İçe aktarıldı',
    sent: 'Gönderildi',
    received: 'Alındı',
    processed: 'İşlendi',
    completed: 'Tamamlandı',
    approved: 'Onaylandı',
    rejected: 'Reddedildi',
    published: 'Yayınlandı',
    unpublished: 'Yayından kaldırıldı',
    activated: 'Aktifleştirildi',
    deactivated: 'Deaktifleştirildi',
    connected: 'Bağlandı',
    disconnected: 'Bağlantı kesildi',
    synchronized: 'Senkronize edildi',
    backedUp: 'Yedeklendi',
    restored: 'Geri yüklendi'
  }
};

// English translations
export const englishTranslations: Translations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    export: 'Export',
    import: 'Import',
    yes: 'Yes',
    no: 'No',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    open: 'Open',
    view: 'View',
    details: 'Details',
    settings: 'Settings',
    help: 'Help',
    about: 'About',
    contact: 'Contact',
    home: 'Home',
    dashboard: 'Dashboard',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    register: 'Register'
  },
  navigation: {
    home: 'Home',
    products: 'Products',
    categories: 'Categories',
    cart: 'Cart',
    wishlist: 'Wishlist',
    orders: 'Orders',
    profile: 'Profile',
    admin: 'Admin',
    analytics: 'Analytics',
    reports: 'Reports',
    settings: 'Settings',
    help: 'Help'
  },
  ecommerce: {
    addToCart: 'Add to Cart',
    buyNow: 'Buy Now',
    addToWishlist: 'Add to Wishlist',
    removeFromWishlist: 'Remove from Wishlist',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    price: 'Price',
    quantity: 'Quantity',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    shipping: 'Shipping',
    discount: 'Discount',
    checkout: 'Checkout',
    payment: 'Payment',
    orderSummary: 'Order Summary',
    orderHistory: 'Order History',
    orderStatus: 'Order Status',
    trackingNumber: 'Tracking Number',
    estimatedDelivery: 'Estimated Delivery',
    reviews: 'Reviews',
    rating: 'Rating',
    writeReview: 'Write Review',
    productDetails: 'Product Details',
    specifications: 'Specifications',
    description: 'Description',
    relatedProducts: 'Related Products',
    recommendedProducts: 'Recommended Products',
    recentlyViewed: 'Recently Viewed',
    bestSellers: 'Best Sellers',
    newArrivals: 'New Arrivals',
    onSale: 'On Sale',
    freeShipping: 'Free Shipping',
    returnPolicy: 'Return Policy',
    warranty: 'Warranty',
    customerService: 'Customer Service'
  },
  business: {
    dashboard: 'Dashboard',
    sales: 'Sales',
    revenue: 'Revenue',
    profit: 'Profit',
    customers: 'Customers',
    orders: 'Orders',
    products: 'Products',
    inventory: 'Inventory',
    suppliers: 'Suppliers',
    employees: 'Employees',
    reports: 'Reports',
    analytics: 'Analytics',
    accounting: 'Accounting',
    invoices: 'Invoices',
    payments: 'Payments',
    expenses: 'Expenses',
    taxes: 'Taxes',
    payroll: 'Payroll',
    marketing: 'Marketing',
    campaigns: 'Campaigns',
    leads: 'Leads',
    crm: 'CRM',
    support: 'Support',
    tickets: 'Tickets',
    knowledgeBase: 'Knowledge Base',
    settings: 'Settings',
    users: 'Users',
    roles: 'Roles',
    permissions: 'Permissions',
    security: 'Security',
    backup: 'Backup',
    integrations: 'Integrations',
    api: 'API',
    webhooks: 'Webhooks'
  },
  ai: {
    chatbot: 'AI Assistant',
    recommendations: 'Recommendations',
    predictions: 'Predictions',
    analytics: 'Analytics',
    automation: 'Automation',
    insights: 'Insights',
    smartSearch: 'Smart Search',
    personalization: 'Personalization',
    optimization: 'Optimization',
    forecasting: 'Forecasting',
    segmentation: 'Segmentation',
    pricing: 'Pricing',
    inventory: 'Inventory',
    customerService: 'Customer Service',
    salesForecast: 'Sales Forecast',
    demandPrediction: 'Demand Prediction',
    priceOptimization: 'Price Optimization',
    customerInsights: 'Customer Insights',
    marketAnalysis: 'Market Analysis',
    trendAnalysis: 'Trend Analysis',
    anomalyDetection: 'Anomaly Detection',
    naturalLanguageQuery: 'Natural Language Query',
    voiceAssistant: 'Voice Assistant',
    imageRecognition: 'Image Recognition',
    sentimentAnalysis: 'Sentiment Analysis'
  },
  payment: {
    creditCard: 'Credit Card',
    bankTransfer: 'Bank Transfer',
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    paypal: 'PayPal',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    mobilePayment: 'Mobile Payment',
    digitalWallet: 'Digital Wallet',
    cashOnDelivery: 'Cash on Delivery',
    installment: 'Installment',
    paymentMethod: 'Payment Method',
    paymentStatus: 'Payment Status',
    transactionId: 'Transaction ID',
    processingFee: 'Processing Fee',
    totalAmount: 'Total Amount',
    currency: 'Currency',
    exchangeRate: 'Exchange Rate',
    paymentSuccessful: 'Payment Successful',
    paymentFailed: 'Payment Failed',
    paymentPending: 'Payment Pending',
    refund: 'Refund',
    chargeback: 'Chargeback'
  },
  errors: {
    networkError: 'Network connection error',
    serverError: 'Server error',
    notFound: 'Not found',
    unauthorized: 'Unauthorized access',
    forbidden: 'Access forbidden',
    validationError: 'Validation error',
    paymentError: 'Payment error',
    inventoryError: 'Inventory error',
    userError: 'User error',
    systemError: 'System error',
    timeoutError: 'Timeout error',
    connectionError: 'Connection error',
    authenticationError: 'Authentication error',
    authorizationError: 'Authorization error',
    dataError: 'Data error',
    fileError: 'File error',
    uploadError: 'Upload error',
    downloadError: 'Download error',
    processingError: 'Processing error',
    configurationError: 'Configuration error'
  },
  success: {
    saved: 'Saved',
    updated: 'Updated',
    deleted: 'Deleted',
    created: 'Created',
    uploaded: 'Uploaded',
    downloaded: 'Downloaded',
    exported: 'Exported',
    imported: 'Imported',
    sent: 'Sent',
    received: 'Received',
    processed: 'Processed',
    completed: 'Completed',
    approved: 'Approved',
    rejected: 'Rejected',
    published: 'Published',
    unpublished: 'Unpublished',
    activated: 'Activated',
    deactivated: 'Deactivated',
    connected: 'Connected',
    disconnected: 'Disconnected',
    synchronized: 'Synchronized',
    backedUp: 'Backed up',
    restored: 'Restored'
  }
};

// Translation function
export function getTranslation(key: string, language: SupportedLanguage = 'tr'): string {
  const translations = language === 'en' ? englishTranslations : defaultTranslations;
  
  const keys = key.split('.');
  let value: any = translations;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// Format currency based on language
export function formatCurrency(amount: number, language: SupportedLanguage = 'tr'): string {
  const config = supportedLanguages.find(lang => lang.code === language);
  if (!config) return amount.toString();
  
  const formatter = new Intl.NumberFormat(
    language === 'tr' ? 'tr-TR' : 
    language === 'en' ? 'en-US' :
    language === 'de' ? 'de-DE' :
    language === 'ar' ? 'ar-SA' :
    'fr-FR',
    { 
      style: 'currency', 
      currency: config.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );
  
  return formatter.format(amount);
}

// Format date based on language
export function formatDate(date: Date, language: SupportedLanguage = 'tr'): string {
  const config = supportedLanguages.find(lang => lang.code === language);
  if (!config) return date.toLocaleDateString();
  
  const locale = language === 'tr' ? 'tr-TR' : 
                language === 'en' ? 'en-US' :
                language === 'de' ? 'de-DE' :
                language === 'ar' ? 'ar-SA' :
                'fr-FR';
  
  return date.toLocaleDateString(locale);
}

// Format number based on language
export function formatNumber(number: number, language: SupportedLanguage = 'tr'): string {
  const config = supportedLanguages.find(lang => lang.code === language);
  if (!config) return number.toString();
  
  const locale = language === 'tr' ? 'tr-TR' : 
                language === 'en' ? 'en-US' :
                language === 'de' ? 'de-DE' :
                language === 'ar' ? 'ar-SA' :
                'fr-FR';
  
  return number.toLocaleString(locale, config.numberFormat);
}
