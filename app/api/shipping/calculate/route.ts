import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getShippingManager } from "@/lib/shipping/shipping-manager";

interface ShippingRequest {
  items: Array<{
    productId: string;
    quantity: number;
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
  }>;
  destination: {
    city: string;
    district?: string;
    postalCode?: string;
    country?: string;
  };
  origin?: {
    city: string;
    district?: string;
    postalCode?: string;
  };
}

interface ShippingOption {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
  price: number;
  estimatedDays: {
    min: number;
    max: number;
  };
  deliveryTime: string;
  features: string[];
  isRecommended?: boolean;
  trackingUrl?: string;
}

export async function POST(req: Request) {
  try {
    const body: ShippingRequest = await req.json();
    const { items, destination, origin } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Ürün bilgileri gerekli" }, { status: 400 });
    }

    if (!destination?.city) {
      return NextResponse.json({ error: "Teslimat adresi gerekli" }, { status: 400 });
    }

    // Ürün bilgilerini al
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        title: true,
        weight: true,
        dimensions: true,
        price: true,
        shippingEstimate: true,
      }
    });

    // Toplam ağırlık ve boyutları hesapla
    let totalWeight = 0;
    let totalVolume = 0;
    let totalValue = 0;
    let maxDimensions = { length: 0, width: 0, height: 0 };

    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) continue;

      const itemWeight = item.weight || product.weight || 0.5; // Default 0.5kg
      const itemVolume = product.dimensions ? 
        (product.dimensions as any).length * (product.dimensions as any).width * (product.dimensions as any).height : 
        1000; // Default volume

      totalWeight += itemWeight * item.quantity;
      totalVolume += itemVolume * item.quantity;
      totalValue += product.price * item.quantity;

      // Max dimensions
      if (product.dimensions) {
        const dims = product.dimensions as any;
        maxDimensions.length = Math.max(maxDimensions.length, dims.length || 0);
        maxDimensions.width = Math.max(maxDimensions.width, dims.width || 0);
        maxDimensions.height = Math.max(maxDimensions.height, dims.height || 0);
      }
    }

    // Kargo seçeneklerini hesapla (gerçek API'lerle)
    let shippingOptions: ShippingOption[] = [];
    
    try {
      const shippingManager = getShippingManager();
      
      // Satıcı adres bilgilerini al (origin için)
      const firstProduct = products[0];
      if (firstProduct) {
        const seller = await prisma.sellerProfile.findUnique({
          where: { id: (firstProduct as any).sellerId },
          select: { userId: true },
        });
        
        if (seller) {
          const sellerUser = await prisma.user.findUnique({
            where: { id: seller.userId },
            select: { name: true, email: true, phone: true },
          });
          
          // Gerçek kargo API'lerinden quote al
          const quotes = await shippingManager.getAllQuotes(
            {
              name: sellerUser?.name || 'Satıcı',
              phone: sellerUser?.phone || '',
              email: sellerUser?.email || '',
              address: 'Satıcı Adresi', // TODO: Seller address
              city: origin?.city || 'İstanbul',
              district: origin?.district,
              postalCode: origin?.postalCode,
              country: 'Turkey',
            },
            {
              name: 'Müşteri',
              phone: '',
              email: '',
              address: destination.address || '',
              city: destination.city,
              district: destination.district,
              postalCode: destination.postalCode,
              country: destination.country || 'Turkey',
            },
            {
              weight: totalWeight,
              dimensions: maxDimensions.length > 0 ? maxDimensions : undefined,
              value: totalValue,
            }
          );

          // Quotes'u ShippingOption formatına çevir
          shippingOptions = quotes.map(quote => ({
            id: quote.carrier.toLowerCase().replace(/\s+/g, '-'),
            name: quote.carrier,
            code: quote.carrier.split(' ')[0].toUpperCase(),
            price: quote.price,
            estimatedDays: quote.estimatedDays,
            deliveryTime: formatDeliveryTime(quote.estimatedDays.min, quote.estimatedDays.max),
            features: quote.features || [],
            trackingUrl: getTrackingUrl(quote.carrier),
          }));
        }
      }
    } catch (error) {
      console.error('Kargo API hatası, fallback kullanılıyor:', error);
    }

    // Eğer gerçek API'lerden sonuç alınamadıysa, mock hesaplama kullan
    if (shippingOptions.length === 0) {
      shippingOptions = await calculateShippingOptions({
        weight: totalWeight,
        volume: totalVolume,
        value: totalValue,
        dimensions: maxDimensions,
        destination,
        origin
      });
    }

    // Önerilen seçeneği belirle (en hızlı ve uygun fiyatlı)
    if (shippingOptions.length > 0) {
      const recommended = shippingOptions.reduce((best, current) => {
        const bestScore = best.estimatedDays.min + (best.price / 100);
        const currentScore = current.estimatedDays.min + (current.price / 100);
        return currentScore < bestScore ? current : best;
      });
      recommended.isRecommended = true;
    }

    return NextResponse.json({
      options: shippingOptions,
      summary: {
        totalWeight: Math.round(totalWeight * 100) / 100,
        totalVolume: Math.round(totalVolume * 100) / 100,
        totalValue: Math.round(totalValue * 100) / 100,
        itemCount: items.length
      }
    });

  } catch (error) {
    console.error('Kargo hesaplama hatası:', error);
    return NextResponse.json({ 
      error: "Kargo hesaplama sırasında bir hata oluştu" 
    }, { status: 500 });
  }
}

async function calculateShippingOptions(params: {
  weight: number;
  volume: number;
  value: number;
  dimensions: { length: number; width: number; height: number };
  destination: { city: string; district?: string; postalCode?: string; country?: string };
  origin?: { city: string; district?: string; postalCode?: string };
}): Promise<ShippingOption[]> {
  const { weight, volume, value, dimensions, destination } = params;

  // Mock kargo firmaları - gerçek uygulamada veritabanından gelecek
  const shippingCompanies = [
    {
      id: 'yurtici',
      name: 'Yurtiçi Kargo',
      code: 'YURTICI',
      logoUrl: '/logos/yurtici.png',
      basePrice: 25,
      pricePerKg: 5,
      deliveryTimeMin: 1,
      deliveryTimeMax: 2,
      freeShippingThreshold: 150,
      features: ['Hızlı Teslimat', 'Güvenli', 'Takip'],
      trackingUrl: 'https://www.yurticikargo.com/tr/kargo-takip'
    },
    {
      id: 'aras',
      name: 'Aras Kargo',
      code: 'ARAS',
      logoUrl: '/logos/aras.png',
      basePrice: 20,
      pricePerKg: 4,
      deliveryTimeMin: 1,
      deliveryTimeMax: 3,
      freeShippingThreshold: 200,
      features: ['Ekonomik', 'Geniş Ağ', 'Kapıda Ödeme'],
      trackingUrl: 'https://www.araskargo.com.tr/kargo-takip'
    },
    {
      id: 'mng',
      name: 'MNG Kargo',
      code: 'MNG',
      logoUrl: '/logos/mng.png',
      basePrice: 22,
      pricePerKg: 4.5,
      deliveryTimeMin: 2,
      deliveryTimeMax: 4,
      freeShippingThreshold: 180,
      features: ['Uygun Fiyat', 'Güvenilir', 'SMS Bildirim'],
      trackingUrl: 'https://www.mngkargo.com.tr/kargo-takip'
    },
    {
      id: 'ptt',
      name: 'PTT Kargo',
      code: 'PTT',
      logoUrl: '/logos/ptt.png',
      basePrice: 18,
      pricePerKg: 3,
      deliveryTimeMin: 3,
      deliveryTimeMax: 5,
      freeShippingThreshold: 250,
      features: ['En Ekonomik', 'Tüm Türkiye', 'Güvenli'],
      trackingUrl: 'https://www.ptt.gov.tr/kargo-takip'
    },
    {
      id: 'ups',
      name: 'UPS Kargo',
      code: 'UPS',
      logoUrl: '/logos/ups.png',
      basePrice: 45,
      pricePerKg: 8,
      deliveryTimeMin: 1,
      deliveryTimeMax: 2,
      freeShippingThreshold: 300,
      features: ['Premium Hizmet', 'Uluslararası', 'Hızlı'],
      trackingUrl: 'https://www.ups.com/tr/kargo-takip'
    }
  ];

  const options: ShippingOption[] = [];

  for (const company of shippingCompanies) {
    // Fiyat hesaplama
    let price = company.basePrice;
    
    // Ağırlık bazlı fiyatlandırma
    if (weight > 1) {
      price += (weight - 1) * company.pricePerKg;
    }

    // Boyut bazlı ek ücret (volumetric weight)
    const volumetricWeight = (dimensions.length * dimensions.width * dimensions.height) / 6000;
    if (volumetricWeight > weight) {
      price += (volumetricWeight - weight) * company.pricePerKg;
    }

    // Bölge bazlı ek ücret (uzak bölgeler için)
    const remoteAreaMultiplier = getRemoteAreaMultiplier(destination.city);
    if (remoteAreaMultiplier > 1) {
      price *= remoteAreaMultiplier;
    }

    // Ücretsiz kargo kontrolü
    if (value >= company.freeShippingThreshold) {
      price = 0;
    }

    // Minimum fiyat kontrolü
    price = Math.max(price, 10);

    // Teslimat süresi hesaplama
    let deliveryDaysMin = company.deliveryTimeMin;
    let deliveryDaysMax = company.deliveryTimeMax;

    // Uzak bölgeler için teslimat süresi artışı
    if (remoteAreaMultiplier > 1.5) {
      deliveryDaysMin += 1;
      deliveryDaysMax += 2;
    }

    // Hafta sonu teslimat kontrolü
    const today = new Date();
    const dayOfWeek = today.getDay();
    if (dayOfWeek === 5 || dayOfWeek === 6) { // Cuma veya Cumartesi
      deliveryDaysMin += 1;
      deliveryDaysMax += 1;
    }

    options.push({
      id: company.id,
      name: company.name,
      code: company.code,
      logoUrl: company.logoUrl,
      price: Math.round(price * 100) / 100,
      estimatedDays: {
        min: deliveryDaysMin,
        max: deliveryDaysMax
      },
      deliveryTime: formatDeliveryTime(deliveryDaysMin, deliveryDaysMax),
      features: company.features,
      trackingUrl: company.trackingUrl
    });
  }

  // Fiyata göre sırala
  return options.sort((a, b) => a.price - b.price);
}

function getRemoteAreaMultiplier(city: string): number {
  const remoteAreas = {
    'istanbul': 1.0,
    'ankara': 1.0,
    'izmir': 1.0,
    'bursa': 1.1,
    'antalya': 1.1,
    'adana': 1.2,
    'konya': 1.2,
    'gaziantep': 1.3,
    'mersin': 1.3,
    'diyarbakir': 1.5,
    'van': 1.8,
    'hakkari': 2.0
  };

  const normalizedCity = city.toLowerCase().replace(/[^a-z]/g, '');
  return remoteAreas[normalizedCity as keyof typeof remoteAreas] || 1.4;
}

function formatDeliveryTime(min: number, max: number): string {
  if (min === max) {
    return `${min} iş günü`;
  }
  return `${min}-${max} iş günü`;
}

function getTrackingUrl(carrier: string): string {
  const urls: Record<string, string> = {
    'Yurtiçi Kargo': 'https://www.yurticikargo.com/tr/kargo-takip',
    'Aras Kargo': 'https://www.araskargo.com.tr/kargo-takip',
    'MNG Kargo': 'https://www.mngkargo.com.tr/kargo-takip',
    'PTT Kargo': 'https://www.ptt.gov.tr/kargo-takip',
    'UPS Kargo': 'https://www.ups.com/tr/kargo-takip',
  };
  
  return urls[carrier] || '';
}
