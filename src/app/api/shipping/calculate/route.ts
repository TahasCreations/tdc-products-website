import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weight, dimensions, destination } = body;

    // Kargo hesaplama API'si
    const shippingCompanies = [
      {
        id: 'yurtici',
        name: 'Yurtiçi Kargo',
        basePrice: 15,
        pricePerKg: 2,
        estimatedDays: '1-2 iş günü',
        features: ['Ücretsiz kapıda ödeme', 'SMS takip', 'Online takip'],
        coverage: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya']
      },
      {
        id: 'mng',
        name: 'MNG Kargo',
        basePrice: 12,
        pricePerKg: 1.8,
        estimatedDays: '1-3 iş günü',
        features: ['Hızlı teslimat', 'Güvenli paketleme', 'Sigorta'],
        coverage: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana']
      },
      {
        id: 'aras',
        name: 'Aras Kargo',
        basePrice: 18,
        pricePerKg: 2.2,
        estimatedDays: '2-4 iş günü',
        features: ['Geniş ağ', 'Güvenilir teslimat', 'Müşteri hizmetleri'],
        coverage: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Gaziantep']
      },
      {
        id: 'ptt',
        name: 'PTT Kargo',
        basePrice: 10,
        pricePerKg: 1.5,
        estimatedDays: '2-5 iş günü',
        features: ['Uygun fiyat', 'Tüm Türkiye', 'Resmi kargo'],
        coverage: ['Tüm Türkiye']
      },
      {
        id: 'ups',
        name: 'UPS Kargo',
        basePrice: 25,
        pricePerKg: 3,
        estimatedDays: '1-2 iş günü',
        features: ['Uluslararası', 'Hızlı teslimat', 'Premium hizmet'],
        coverage: ['İstanbul', 'Ankara', 'İzmir']
      }
    ];

    // Hesaplama yap
    const options = shippingCompanies
      .filter(company => 
        company.coverage.includes('Tüm Türkiye') || 
        company.coverage.includes(destination.city)
      )
      .map(company => {
        const basePrice = company.basePrice;
        const weightPrice = weight * company.pricePerKg;
        
        // Boyut hesaplaması (cm³)
        const volume = dimensions.length * dimensions.width * dimensions.height;
        const volumePrice = volume > 10000 ? (volume - 10000) * 0.001 : 0;
        
        const totalPrice = basePrice + weightPrice + volumePrice;

        return {
          id: company.id,
          name: company.name,
          company: company.name,
          price: Math.round(totalPrice * 100) / 100,
          estimatedDays: company.estimatedDays,
          description: `${company.name} ile güvenli teslimat`,
          features: company.features,
          coverage: company.coverage
        };
      })
      .sort((a, b) => a.price - b.price);

    return NextResponse.json({
      success: true,
      options,
      calculation: {
        weight,
        dimensions,
        destination,
        totalOptions: options.length
      }
    });

  } catch (error) {
    console.error('Kargo hesaplama hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Kargo hesaplama sırasında bir hata oluştu' 
    }, { status: 500 });
  }
}
