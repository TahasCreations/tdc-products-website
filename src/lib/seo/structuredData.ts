import { Product, Order } from '@prisma/client';

// Schema.org JSON-LD generator for TDC Market

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    email?: string;
  };
  sameAs?: string[];
}

export interface ProductData {
  id: string;
  name: string;
  description: string;
  image: string[];
  url: string;
  brand: string;
  sku: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  condition: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition';
  category: string;
  rating?: {
    value: number;
    reviewCount: number;
  };
  shippingDetails?: {
    handlingTime: string;
    transitTime: string;
    deliveryTime: string;
    shippingRate: number;
  };
}

export interface FAQData {
  question: string;
  answer: string;
}

export interface BreadcrumbData {
  name: string;
  url: string;
}

// Organization JSON-LD
export function generateOrganizationSchema(data: OrganizationData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    ...(data.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: data.address.streetAddress,
        addressLocality: data.address.addressLocality,
        addressRegion: data.address.addressRegion,
        postalCode: data.address.postalCode,
        addressCountry: data.address.addressCountry
      }
    }),
    ...(data.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: data.contactPoint.telephone,
        contactType: data.contactPoint.contactType,
        ...(data.contactPoint.email && { email: data.contactPoint.email })
      }
    }),
    ...(data.sameAs && { sameAs: data.sameAs })
  };
}

// Product JSON-LD
export function generateProductSchema(data: ProductData) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    image: data.image,
    url: data.url,
    brand: {
      '@type': 'Brand',
      name: data.brand
    },
    sku: data.sku,
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency,
      availability: `https://schema.org/${data.availability}`,
      itemCondition: `https://schema.org/${data.condition}`,
      seller: {
        '@type': 'Organization',
        name: 'TDC Market'
      }
    },
    category: data.category
  };

  // Rating ekle
  if (data.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.rating.value,
      reviewCount: data.rating.reviewCount,
      bestRating: 5,
      worstRating: 1
    };
  }

  // Shipping details ekle
  if (data.shippingDetails) {
    schema.offers.shippingDetails = {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: data.shippingDetails.shippingRate,
        currency: data.currency
      },
      ...(data.shippingDetails.handlingTime && {
        handlingTime: {
          '@type': 'QuantitativeValue',
          value: data.shippingDetails.handlingTime,
          unitCode: 'DAY'
        }
      }),
      ...(data.shippingDetails.transitTime && {
        transitTime: {
          '@type': 'QuantitativeValue',
          value: data.shippingDetails.transitTime,
          unitCode: 'DAY'
        }
      }),
      ...(data.shippingDetails.deliveryTime && {
        deliveryTime: {
          '@type': 'QuantitativeValue',
          value: data.shippingDetails.deliveryTime,
          unitCode: 'DAY'
        }
      })
    };
  }

  return schema;
}

// FAQ JSON-LD
export function generateFAQSchema(faqs: FAQData[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

// Breadcrumb JSON-LD
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbData[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url
    }))
  };
}

// Category JSON-LD
export function generateCategorySchema(category: Category) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description || `TDC Market ${category.name} kategorisi`,
    url: `https://tdcmarket.com/k/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      name: category.name,
      description: category.description || `TDC Market ${category.name} ürünleri`
    }
  };
}

// Search Results JSON-LD
export function generateSearchResultsSchema(query: string, results: Product[], totalCount: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `"${query}" için arama sonuçları`,
    description: `${totalCount} ürün bulundu`,
    mainEntity: {
      '@type': 'ItemList',
      name: `"${query}" arama sonuçları`,
      numberOfItems: totalCount,
      itemListElement: results.slice(0, 10).map((product, index) => ({
        '@type': 'Product',
        position: index + 1,
        name: product.title,
        description: product.description,
        url: `https://tdcmarket.com/urun/${product.slug}`,
        image: product.images?.[0] || '/placeholder-image.jpg',
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'TRY',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        }
      }))
    }
  };
}

// Local Business JSON-LD (for contact page)
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'TDC Market',
    description: 'Premium koleksiyon ve tasarım ürünleri mağazası',
    url: 'https://tdcmarket.com',
    logo: 'https://tdcmarket.com/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Örnek Mahallesi, Tasarım Sokak No: 123',
      addressLocality: 'İstanbul',
      addressRegion: 'İstanbul',
      postalCode: '34000',
      addressCountry: 'TR'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-212-XXX-XXXX',
      contactType: 'Customer Service',
      email: 'info@tdcmarket.com'
    },
    openingHours: 'Mo-Fr 09:00-18:00, Sa 10:00-16:00',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card'],
    priceRange: '$$'
  };
}

// WebSite JSON-LD (for search)
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TDC Market',
    url: 'https://tdcmarket.com',
    description: 'Premium koleksiyon ve tasarım ürünleri',
    publisher: {
      '@type': 'Organization',
      name: 'TDC Market',
      logo: 'https://tdcmarket.com/logo.png'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://tdcmarket.com/arama?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

// Article JSON-LD (for blog posts)
export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  image: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'TDC Market',
      logo: 'https://tdcmarket.com/logo.png'
    },
    datePublished: article.datePublished,
    ...(article.dateModified && { dateModified: article.dateModified }),
    ...(article.category && { articleSection: article.category })
  };
}

// Event JSON-LD (for special events/campaigns)
export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: {
    name: string;
    address?: string;
  };
  url?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    ...(event.endDate && { endDate: event.endDate }),
    ...(event.location && {
      location: {
        '@type': 'Place',
        name: event.location.name,
        ...(event.location.address && { address: event.location.address })
      }
    }),
    ...(event.url && { url: event.url }),
    ...(event.image && { image: event.image }),
    organizer: {
      '@type': 'Organization',
      name: 'TDC Market'
    }
  };
}

// Helper function to combine multiple schemas
export function combineSchemas(...schemas: any[]) {
  return schemas.filter(Boolean);
}

// Default organization data for TDC Market
export const defaultOrganizationData: OrganizationData = {
  name: 'TDC Market',
  url: 'https://tdcmarket.com',
  logo: 'https://tdcmarket.com/logo.png',
  description: 'Premium koleksiyon ve tasarım ürünleri mağazası',
  address: {
    streetAddress: 'Örnek Mahallesi, Tasarım Sokak No: 123',
    addressLocality: 'İstanbul',
    addressRegion: 'İstanbul',
    postalCode: '34000',
    addressCountry: 'TR'
  },
  contactPoint: {
    telephone: '+90-212-XXX-XXXX',
    contactType: 'Customer Service',
    email: 'info@tdcmarket.com'
  },
  sameAs: [
    'https://www.instagram.com/tdcmarket',
    'https://www.facebook.com/tdcmarket',
    'https://twitter.com/tdcmarket'
  ]
};

// Common FAQ data
export const commonFAQs: FAQData[] = [
  {
    question: 'TDC Market güvenilir mi?',
    answer: 'Evet, TDC Market 2020 yılından beri müşterilerimize güvenli alışveriş deneyimi sunmaktadır. SSL sertifikası ve güvenli ödeme sistemleri kullanmaktayız.'
  },
  {
    question: 'Ürünler ne kadar sürede teslim edilir?',
    answer: 'Stoklu ürünler 1-3 iş günü içinde, özel üretim ürünler 7-14 iş günü içinde teslim edilir. Detaylı teslimat bilgileri ürün sayfasında belirtilmiştir.'
  },
  {
    question: 'İade ve değişim politikası nedir?',
    answer: 'Ürünlerinizi teslim aldığınız tarihten itibaren 14 gün içinde koşulsuz iade edebilirsiniz. Ürün orijinal ambalajında ve kullanılmamış olmalıdır.'
  },
  {
    question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    answer: 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini kabul ediyoruz. Tüm ödemeler SSL ile güvence altındadır.'
  }
];
