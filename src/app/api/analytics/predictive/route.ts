import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';
    const model = searchParams.get('model') || 'all';

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client could not be created' }, { status: 500 });
    }

    // Mock predictive analytics data
    const predictions = [
      {
        id: '1',
        type: 'revenue' as const,
        title: 'Gelir Tahmini',
        currentValue: 2345678,
        predictedValue: 2678901,
        confidence: 87.5,
        timeframe: 'Sonraki 30 gün',
        trend: 'up' as const,
        impact: 'high' as const,
        recommendation: 'Gelir artışı bekleniyor. Stok seviyelerini artırmayı düşünün.',
        riskFactors: [
          'Ekonomik belirsizlik',
          'Rekabet artışı',
          'Sezonsal dalgalanmalar'
        ],
        opportunities: [
          'Yeni ürün lansmanları',
          'Pazarlama kampanyaları',
          'Müşteri sadakat programları'
        ]
      },
      {
        id: '2',
        type: 'conversion' as const,
        title: 'Dönüşüm Oranı',
        currentValue: 3.2,
        predictedValue: 3.8,
        confidence: 82.3,
        timeframe: 'Sonraki 14 gün',
        trend: 'up' as const,
        impact: 'medium' as const,
        recommendation: 'Dönüşüm oranı iyileşecek. UX optimizasyonlarına devam edin.',
        riskFactors: [
          'Sayfa yükleme hızı',
          'Mobil deneyim sorunları'
        ],
        opportunities: [
          'A/B test sonuçları',
          'Kullanıcı geri bildirimleri',
          'Performans iyileştirmeleri'
        ]
      },
      {
        id: '3',
        type: 'churn' as const,
        title: 'Müşteri Kaybı',
        currentValue: 12.5,
        predictedValue: 10.8,
        confidence: 79.1,
        timeframe: 'Sonraki 60 gün',
        trend: 'down' as const,
        impact: 'high' as const,
        recommendation: 'Müşteri kaybı azalacak. Sadakat programlarını güçlendirin.',
        riskFactors: [
          'Müşteri memnuniyetsizliği',
          'Fiyat artışları',
          'Rekabet'
        ],
        opportunities: [
          'Müşteri hizmetleri iyileştirmeleri',
          'Kişiselleştirilmiş öneriler',
          'İndirim kampanyaları'
        ]
      },
      {
        id: '4',
        type: 'lifetime_value' as const,
        title: 'Müşteri Yaşam Değeri',
        currentValue: 1250,
        predictedValue: 1420,
        confidence: 85.7,
        timeframe: 'Sonraki 90 gün',
        trend: 'up' as const,
        impact: 'medium' as const,
        recommendation: 'Müşteri değeri artacak. Cross-selling stratejilerini geliştirin.',
        riskFactors: [
          'Ekonomik koşullar',
          'Müşteri davranış değişiklikleri'
        ],
        opportunities: [
          'Ürün çeşitliliği',
          'Premium üyelik programları',
          'Kişiselleştirilmiş pazarlama'
        ]
      },
      {
        id: '5',
        type: 'demand' as const,
        title: 'Ürün Talebi',
        currentValue: 1250,
        predictedValue: 1580,
        confidence: 91.2,
        timeframe: 'Sonraki 45 gün',
        trend: 'up' as const,
        impact: 'high' as const,
        recommendation: 'Talep artışı bekleniyor. Üretim kapasitesini artırın.',
        riskFactors: [
          'Tedarik zinciri sorunları',
          'Hammadde fiyat artışları'
        ],
        opportunities: [
          'Yeni tedarikçi anlaşmaları',
          'Stok optimizasyonu',
          'Üretim verimliliği'
        ]
      },
      {
        id: '6',
        type: 'traffic' as const,
        title: 'Web Trafiği',
        currentValue: 45678,
        predictedValue: 52341,
        confidence: 88.9,
        timeframe: 'Sonraki 21 gün',
        trend: 'up' as const,
        impact: 'medium' as const,
        recommendation: 'Trafik artışı bekleniyor. Sunucu kapasitesini kontrol edin.',
        riskFactors: [
          'Sunucu performansı',
          'SEO değişiklikleri'
        ],
        opportunities: [
          'İçerik pazarlama',
          'Sosyal medya kampanyaları',
          'SEO optimizasyonu'
        ]
      }
    ];

    // Filter predictions based on model parameter
    const filteredPredictions = model === 'all' 
      ? predictions 
      : predictions.filter(p => p.type === model);

    // Mock model performance data
    const modelPerformance = [
      {
        modelName: 'Gelir Modeli',
        accuracy: 0.875,
        precision: 0.892,
        recall: 0.856,
        f1Score: 0.874,
        lastTrained: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active' as const
      },
      {
        modelName: 'Dönüşüm Modeli',
        accuracy: 0.823,
        precision: 0.845,
        recall: 0.798,
        f1Score: 0.821,
        lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active' as const
      },
      {
        modelName: 'Churn Modeli',
        accuracy: 0.791,
        precision: 0.812,
        recall: 0.768,
        f1Score: 0.789,
        lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'training' as const
      },
      {
        modelName: 'Talep Modeli',
        accuracy: 0.912,
        precision: 0.925,
        recall: 0.898,
        f1Score: 0.911,
        lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'needs_update' as const
      }
    ];

    // Mock accuracy trend data
    const accuracyTrend = [
      { date: '2024-01-01', accuracy: 0.85 },
      { date: '2024-01-02', accuracy: 0.86 },
      { date: '2024-01-03', accuracy: 0.87 },
      { date: '2024-01-04', accuracy: 0.88 },
      { date: '2024-01-05', accuracy: 0.89 },
      { date: '2024-01-06', accuracy: 0.90 },
      { date: '2024-01-07', accuracy: 0.91 }
    ];

    // Mock feature importance data
    const featureImportance = [
      { feature: 'Sayfa Görüntüleme Süresi', importance: 0.234 },
      { feature: 'Sepete Ekleme Oranı', importance: 0.198 },
      { feature: 'Önceki Satın Alma Geçmişi', importance: 0.176 },
      { feature: 'Kullanıcı Yaşı', importance: 0.154 },
      { feature: 'Cihaz Türü', importance: 0.132 },
      { feature: 'Lokasyon', importance: 0.106 }
    ];

    const predictiveData = {
      predictions: filteredPredictions,
      modelPerformance,
      accuracyTrend,
      featureImportance
    };

    return NextResponse.json(predictiveData);
  } catch (error) {
    console.error('Predictive analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
