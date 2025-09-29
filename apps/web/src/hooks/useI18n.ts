'use client';

import { useMemo } from 'react';

interface Translations {
  home: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      details: string;
    };
    features: {
      trusted_sellers: {
        title: string;
        description: string;
      };
      fast_delivery: {
        title: string;
        description: string;
      };
      secure_payment: {
        title: string;
        description: string;
      };
    };
  };
}

const translations: Record<string, Translations> = {
  tr: {
    home: {
      hero: {
        title: 'TDC Products',
        subtitle: '3D Yazıcı Teknolojisi ile Üretilen Premium Figürler',
        description: 'En sevdiğiniz karakterlerin detaylı figürlerini keşfedin',
        details: '3D yazıcı teknolojisi ile üretilen, yüksek kaliteli anime, manga ve oyun karakterlerinin figürleri. Her detay özenle işlenmiş, koleksiyonunuza değer katacak eserler.'
      },
      features: {
        trusted_sellers: {
          title: 'Güvenilir Satıcılar',
          description: 'Sadece onaylı ve güvenilir satıcılardan ürünler'
        },
        fast_delivery: {
          title: 'Hızlı Teslimat',
          description: 'Türkiye geneli ücretsiz kargo ile hızlı teslimat'
        },
        secure_payment: {
          title: 'Güvenli Ödeme',
          description: 'SSL sertifikalı güvenli ödeme sistemi'
        }
      }
    }
  },
  en: {
    home: {
      hero: {
        title: 'TDC Products',
        subtitle: 'Premium Figures Made with 3D Printing Technology',
        description: 'Discover detailed figures of your favorite characters',
        details: 'High-quality figures of anime, manga and game characters produced with 3D printing technology. Every detail is carefully crafted, artworks that will add value to your collection.'
      },
      features: {
        trusted_sellers: {
          title: 'Trusted Sellers',
          description: 'Products only from verified and trusted sellers'
        },
        fast_delivery: {
          title: 'Fast Delivery',
          description: 'Fast delivery with free shipping across Turkey'
        },
        secure_payment: {
          title: 'Secure Payment',
          description: 'SSL certified secure payment system'
        }
      }
    }
  }
};

export function useI18n(locale: string = 'tr') {
  const t = useMemo(() => {
    return (key: string): string => {
      const keys = key.split('.');
      let value: any = translations[locale] || translations['tr'];
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to Turkish if key not found
          value = translations['tr'];
          for (const fallbackKey of keys) {
            if (value && typeof value === 'object' && fallbackKey in value) {
              value = value[fallbackKey];
            } else {
              return key; // Return key if translation not found
            }
          }
          break;
        }
      }
      
      return typeof value === 'string' ? value : key;
    };
  }, [locale]);

  return { t, locale };
}
