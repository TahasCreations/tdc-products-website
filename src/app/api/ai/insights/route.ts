import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type') || '';
    const impact = searchParams.get('impact') || '';

    let insights = [];

    if (supabase) {
      // Supabase'den AI insights'ları çek
      let query = supabase
        .from('ai_insights')
        .select(`
          id,
          type,
          title,
          description,
          impact,
          confidence,
          action_required,
          created_at
        `)
        .order('created_at', { ascending: false });

      // Filtreler
      if (type) {
        query = query.eq('type', type);
      }
      if (impact) {
        query = query.eq('impact', impact);
      }

      // Sayfalama
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Supabase AI insights error:', error);
        throw error;
      }

      insights = data?.map(insight => ({
        id: insight.id,
        type: insight.type || 'trend',
        title: insight.title,
        description: insight.description || '',
        impact: insight.impact || 'medium',
        confidence: insight.confidence || 0,
        actionRequired: insight.action_required || false,
        createdAt: insight.created_at
      })) || [];

    } else {
      // Fallback: Mock data
      insights = [
        {
          id: '1',
          type: 'trend',
          title: 'Kullanıcı Tercihleri Değişiyor',
          description: 'Son 30 günde kullanıcıların %23\'ü daha fazla mobil cihaz kullanmaya başladı',
          impact: 'high',
          confidence: 89,
          actionRequired: true,
          createdAt: '2024-01-20T10:00:00Z'
        },
        {
          id: '2',
          type: 'opportunity',
          title: 'Yeni Pazar Fırsatı',
          description: 'AI analizi, 25-35 yaş arası kullanıcılar için yeni ürün kategorisi öneriyor',
          impact: 'high',
          confidence: 76,
          actionRequired: true,
          createdAt: '2024-01-19T15:30:00Z'
        },
        {
          id: '3',
          type: 'anomaly',
          title: 'Anormal Satış Artışı',
          description: 'Geçen hafta belirli ürünlerde beklenmedik %150 satış artışı tespit edildi',
          impact: 'medium',
          confidence: 92,
          actionRequired: false,
          createdAt: '2024-01-18T09:15:00Z'
        },
        {
          id: '4',
          type: 'warning',
          title: 'Chatbot Yanıt Kalitesi Düşüşü',
          description: 'Son 7 günde chatbot yanıtlarının memnuniyet skoru %15 düştü',
          impact: 'medium',
          confidence: 84,
          actionRequired: true,
          createdAt: '2024-01-17T14:20:00Z'
        }
      ];
    }

    return NextResponse.json({
      success: true,
      data: insights,
      pagination: {
        page,
        limit,
        total: insights.length
      }
    });

  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch AI insights',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
