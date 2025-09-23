import { NextRequest, NextResponse } from 'next/server';

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  size: number;
  percentage: number;
  averageValue: number;
  totalValue: number;
  growth: number;
  characteristics: string[];
  demographics: {
    ageRange: string;
    gender: string;
    location: string;
    income: string;
  };
  behavior: {
    purchaseFrequency: string;
    averageOrderValue: number;
    preferredCategories: string[];
    lastPurchase: string;
  };
  recommendations: string[];
  status: 'active' | 'inactive' | 'testing';
  createdAt: string;
  updatedAt: string;
}

interface SegmentFilter {
  id: string;
  name: string;
  type: 'demographic' | 'behavioral' | 'value' | 'engagement';
  conditions: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  isActive: boolean;
}

// Advanced customer segmentation data
const mockSegments: CustomerSegment[] = [
  {
    id: '1',
    name: 'VIP Müşteriler',
    description: 'En yüksek değerli ve sadık müşteriler',
    size: 150,
    percentage: 3.2,
    averageValue: 2500,
    totalValue: 375000,
    growth: 25.5,
    characteristics: [
      'Aylık 2000+ TL harcama',
      'Premium ürün tercihi',
      'Yüksek sadakat puanı',
      'Aktif sosyal medya kullanımı'
    ],
    demographics: {
      ageRange: '35-50',
      gender: 'Mixed',
      location: 'Metropolitan',
      income: 'High'
    },
    behavior: {
      purchaseFrequency: 'Weekly',
      averageOrderValue: 2500,
      preferredCategories: ['Electronics', 'Fashion', 'Home'],
      lastPurchase: '2024-01-14'
    },
    recommendations: [
      'VIP program oluştur',
      'Özel indirimler sun',
      'Kişisel müşteri temsilcisi ata',
      'Erken erişim fırsatları'
    ],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Genç Profesyoneller',
    description: '25-35 yaş arası teknoloji meraklısı müşteriler',
    size: 850,
    percentage: 18.1,
    averageValue: 850,
    totalValue: 722500,
    growth: 42.3,
    characteristics: [
      'Teknoloji odaklı',
      'Online alışveriş tercihi',
      'Sosyal medya aktif',
      'Hızlı karar verme'
    ],
    demographics: {
      ageRange: '25-35',
      gender: 'Mixed',
      location: 'Urban',
      income: 'Medium-High'
    },
    behavior: {
      purchaseFrequency: 'Bi-weekly',
      averageOrderValue: 850,
      preferredCategories: ['Electronics', 'Fashion', 'Sports'],
      lastPurchase: '2024-01-13'
    },
    recommendations: [
      'Mobil uygulama optimizasyonu',
      'Sosyal medya kampanyaları',
      'Hızlı teslimat seçenekleri',
      'Teknoloji odaklı ürünler'
    ],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '3',
    name: 'Fırsat Avcıları',
    description: 'İndirim odaklı, fiyat hassas müşteriler',
    size: 1200,
    percentage: 25.5,
    averageValue: 320,
    totalValue: 384000,
    growth: 15.2,
    characteristics: [
      'İndirim odaklı',
      'Düşük fiyat tercihi',
      'Toplu alım yapma',
      'E-posta takibi'
    ],
    demographics: {
      ageRange: '30-55',
      gender: 'Mixed',
      location: 'Mixed',
      income: 'Medium'
    },
    behavior: {
      purchaseFrequency: 'Monthly',
      averageOrderValue: 320,
      preferredCategories: ['Home', 'Fashion', 'Beauty'],
      lastPurchase: '2024-01-10'
    },
    recommendations: [
      'Flash sale kampanyaları',
      'Toplu alım indirimleri',
      'E-posta pazarlama',
      'Kupon sistemi'
    ],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '4',
    name: 'Aile Müşterileri',
    description: 'Aile odaklı, güvenlik ve kalite arayan müşteriler',
    size: 650,
    percentage: 13.8,
    averageValue: 1200,
    totalValue: 780000,
    growth: 8.7,
    characteristics: [
      'Aile odaklı',
      'Güvenlik odaklı',
      'Kalite tercihi',
      'Uzun vadeli düşünme'
    ],
    demographics: {
      ageRange: '35-50',
      gender: 'Mixed',
      location: 'Suburban',
      income: 'Medium-High'
    },
    behavior: {
      purchaseFrequency: 'Monthly',
      averageOrderValue: 1200,
      preferredCategories: ['Home', 'Kids', 'Health'],
      lastPurchase: '2024-01-12'
    },
    recommendations: [
      'Güvenlik vurgusu',
      'Aile paketleri',
      'Güvenilir markalar',
      'Uzun vadeli garantiler'
    ],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '5',
    name: 'Yeni Müşteriler',
    description: 'Son 30 gün içinde ilk kez alışveriş yapan müşteriler',
    size: 300,
    percentage: 6.4,
    averageValue: 450,
    totalValue: 135000,
    growth: 0,
    characteristics: [
      'İlk alışveriş',
      'Keşif aşamasında',
      'Hassas müşteri',
      'Yüksek potansiyel'
    ],
    demographics: {
      ageRange: 'Mixed',
      gender: 'Mixed',
      location: 'Mixed',
      income: 'Mixed'
    },
    behavior: {
      purchaseFrequency: 'One-time',
      averageOrderValue: 450,
      preferredCategories: ['Mixed'],
      lastPurchase: '2024-01-15'
    },
    recommendations: [
      'Hoş geldin kampanyası',
      'Kişiselleştirilmiş öneriler',
      'Müşteri hizmetleri odaklı',
      'Takip e-postaları'
    ],
    status: 'testing',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  }
];

const mockFilters: SegmentFilter[] = [
  {
    id: '1',
    name: 'Yüksek Değerli Müşteriler',
    type: 'value',
    conditions: [
      { field: 'total_spent', operator: 'gte', value: 10000 },
      { field: 'order_count', operator: 'gte', value: 10 }
    ],
    isActive: true
  },
  {
    id: '2',
    name: 'Genç Müşteriler',
    type: 'demographic',
    conditions: [
      { field: 'age', operator: 'between', value: [18, 35] },
      { field: 'location', operator: 'in', value: ['Istanbul', 'Ankara', 'Izmir'] }
    ],
    isActive: true
  },
  {
    id: '3',
    name: 'Aktif Alışverişçiler',
    type: 'behavioral',
    conditions: [
      { field: 'last_purchase', operator: 'gte', value: '30 days ago' },
      { field: 'website_visits', operator: 'gte', value: 5 }
    ],
    isActive: false
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const includeFilters = searchParams.get('includeFilters') === 'true';

    let segments = mockSegments;
    
    if (status) {
      segments = segments.filter(s => s.status === status);
    }

    segments = segments.slice(0, limit);

    const response: any = {
      success: true,
      data: {
        segments,
        total: mockSegments.length,
        summary: {
          totalCustomers: 4700,
          totalValue: 2396500,
          averageValue: 510,
          growthRate: 22.1
        }
      }
    };

    if (includeFilters) {
      response.data.filters = mockFilters;
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Customer Segmentation API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Müşteri segmentasyonu verileri alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, segmentData, filterData } = body;

    switch (action) {
      case 'create_segment':
        const newSegment: CustomerSegment = {
          id: Date.now().toString(),
          ...segmentData,
          status: 'testing',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return NextResponse.json({
          success: true,
          data: newSegment,
          message: 'Müşteri segmenti başarıyla oluşturuldu'
        });

      case 'create_filter':
        const newFilter: SegmentFilter = {
          id: Date.now().toString(),
          ...filterData,
          isActive: true
        };
        
        return NextResponse.json({
          success: true,
          data: newFilter,
          message: 'Filtre başarıyla oluşturuldu'
        });

      case 'analyze_segment':
        // Simulate segment analysis
        const analysis = {
          segmentId: segmentData.segmentId,
          insights: [
            'Bu segment %15 büyüme gösteriyor',
            'Ortalama sipariş değeri segment ortalamasının %20 üzerinde',
            'En çok tercih edilen kategori: Electronics'
          ],
          recommendations: [
            'Bu segment için özel kampanya oluştur',
            'Ürün önerilerini optimize et',
            'Fiyat stratejisini gözden geçir'
          ],
          predictedGrowth: 18.5,
          riskFactors: ['Rekabet artışı', 'Ekonomik belirsizlik']
        };

        return NextResponse.json({
          success: true,
          data: analysis,
          message: 'Segment analizi tamamlandı'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Geçersiz işlem' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Customer Segmentation Action Error:', error);
    return NextResponse.json(
      { success: false, error: 'İşlem sırasında hata oluştu' },
      { status: 500 }
    );
  }
}
