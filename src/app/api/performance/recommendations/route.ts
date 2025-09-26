import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const priority = searchParams.get('priority') || '';

    let recommendations = [];

    if (supabase) {
      // Supabase'den optimizasyon önerilerini çek
      let query = supabase
        .from('performance_recommendations')
        .select(`
          id,
          title,
          description,
          category,
          priority,
          impact,
          effort,
          status,
          actions,
          created_at,
          updated_at
        `)
        .order('priority', { ascending: false });

      // Filtreler
      if (category) {
        query = query.eq('category', category);
      }
      if (priority) {
        query = query.eq('priority', priority);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase recommendations error:', error);
        throw error;
      }

      recommendations = data?.map(rec => ({
        id: rec.id,
        title: rec.title,
        description: rec.description,
        category: rec.category || 'General',
        priority: rec.priority || 'medium',
        impact: rec.impact || 'medium',
        effort: rec.effort || 'medium',
        status: rec.status || 'pending',
        actions: rec.actions || [],
        createdAt: rec.created_at,
        updatedAt: rec.updated_at
      })) || [];

    } else {
      // Fallback: Mock data
      recommendations = [
        {
          id: '1',
          title: 'Görsel Optimizasyonu',
          description: 'WebP formatına çevirerek görsel boyutlarını %30-50 azaltabilirsiniz.',
          category: 'Core Web Vitals',
          priority: 'high',
          impact: 'high',
          effort: 'medium',
          status: 'pending',
          actions: [
            'Mevcut görselleri WebP formatına çevirin',
            'Next.js Image component kullanın',
            'Lazy loading uygulayın',
            'Responsive görseller oluşturun'
          ],
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z'
        },
        {
          id: '2',
          title: 'JavaScript Bundle Optimizasyonu',
          description: 'Code splitting ve tree shaking ile bundle boyutunu %40 azaltabilirsiniz.',
          category: 'Bundle Analysis',
          priority: 'high',
          impact: 'high',
          effort: 'high',
          status: 'pending',
          actions: [
            'Dynamic imports kullanın',
            'Unused code\'u kaldırın',
            'Bundle analyzer çalıştırın',
            'Third-party kütüphaneleri optimize edin'
          ],
          createdAt: '2024-01-20T09:30:00Z',
          updatedAt: '2024-01-20T09:30:00Z'
        },
        {
          id: '3',
          title: 'CDN Kullanımı',
          description: 'CDN ile statik dosyaların yükleme süresini %50 azaltabilirsiniz.',
          category: 'Infrastructure',
          priority: 'medium',
          impact: 'high',
          effort: 'low',
          status: 'pending',
          actions: [
            'CDN servisi seçin (Cloudflare, AWS CloudFront)',
            'Statik dosyaları CDN\'e yükleyin',
            'Cache headers ayarlayın',
            'Gzip compression aktifleştirin'
          ],
          createdAt: '2024-01-20T09:00:00Z',
          updatedAt: '2024-01-20T09:00:00Z'
        },
        {
          id: '4',
          title: 'Database Query Optimizasyonu',
          description: 'Index ve query optimizasyonu ile veritabanı yanıt süresini %60 azaltabilirsiniz.',
          category: 'Database',
          priority: 'high',
          impact: 'high',
          effort: 'high',
          status: 'in_progress',
          actions: [
            'Slow query log\'u analiz edin',
            'Eksik index\'leri ekleyin',
            'N+1 query problemini çözün',
            'Connection pooling kullanın'
          ],
          createdAt: '2024-01-20T08:30:00Z',
          updatedAt: '2024-01-20T08:30:00Z'
        },
        {
          id: '5',
          title: 'Cache Stratejisi',
          description: 'Redis cache ile API yanıt sürelerini %70 azaltabilirsiniz.',
          category: 'Caching',
          priority: 'medium',
          impact: 'high',
          effort: 'medium',
          status: 'pending',
          actions: [
            'Redis kurulumu yapın',
            'Cache key stratejisi belirleyin',
            'TTL değerlerini optimize edin',
            'Cache invalidation stratejisi uygulayın'
          ],
          createdAt: '2024-01-20T08:00:00Z',
          updatedAt: '2024-01-20T08:00:00Z'
        },
        {
          id: '6',
          title: 'Font Loading Optimizasyonu',
          description: 'Font preloading ile CLS değerini %40 azaltabilirsiniz.',
          category: 'Core Web Vitals',
          priority: 'medium',
          impact: 'medium',
          effort: 'low',
          status: 'pending',
          actions: [
            'Font preload link\'leri ekleyin',
            'Font display: swap kullanın',
            'Font subset\'leri oluşturun',
            'System font fallback\'leri ekleyin'
          ],
          createdAt: '2024-01-20T07:30:00Z',
          updatedAt: '2024-01-20T07:30:00Z'
        },
        {
          id: '7',
          title: 'Service Worker Uygulaması',
          description: 'PWA özellikleri ile offline deneyimi ve performansı artırın.',
          category: 'PWA',
          priority: 'low',
          impact: 'medium',
          effort: 'high',
          status: 'pending',
          actions: [
            'Service worker oluşturun',
            'Cache stratejisi belirleyin',
            'Offline fallback sayfaları ekleyin',
            'Push notification\'ları entegre edin'
          ],
          createdAt: '2024-01-20T07:00:00Z',
          updatedAt: '2024-01-20T07:00:00Z'
        },
        {
          id: '8',
          title: 'HTTP/2 ve HTTP/3 Kullanımı',
          description: 'Modern HTTP protokolleri ile network performansını artırın.',
          category: 'Infrastructure',
          priority: 'low',
          impact: 'medium',
          effort: 'low',
          status: 'completed',
          actions: [
            'HTTP/2 desteğini aktifleştirin',
            'HTTP/3 (QUIC) desteğini ekleyin',
            'Server push kullanın',
            'Multiplexing avantajlarından yararlanın'
          ],
          createdAt: '2024-01-20T06:30:00Z',
          updatedAt: '2024-01-20T06:30:00Z'
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
      total: recommendations.length
    });

  } catch (error) {
    console.error('Performance recommendations error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch performance recommendations',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id, ...recommendationData } = body;

    if (action === 'update' && id) {
      if (supabase) {
        const { data, error } = await supabase
          .from('performance_recommendations')
          .update({
            status: recommendationData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        return NextResponse.json({
          success: true,
          message: 'Recommendation updated successfully',
          data
        });
      } else {
        // Fallback: Mock update
        return NextResponse.json({
          success: true,
          message: 'Recommendation updated successfully (mock)',
          data: { id, ...recommendationData }
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('Performance recommendations error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process recommendation request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
