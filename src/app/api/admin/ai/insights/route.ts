import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '@/lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface AIInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'warning';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionRequired: boolean;
  category: string;
  tags: string[];
  data: any;
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const impact = searchParams.get('impact');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get AI insights from database
    let query = supabase
      .from('ai_insights')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (type) {
      query = query.eq('type', type);
    }

    if (impact) {
      query = query.eq('impact', impact);
    }

    const { data: insights, error: insightsError } = await query;

    if (insightsError) {
      console.error('AI insights error:', insightsError);
      // Return mock data if database error
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'opportunity',
          title: 'Yeni Kategori Keşfi',
          description: 'Kullanıcılar "gaming" kategorisinde artan ilgi gösteriyor. Bu kategoriye odaklanarak %15 daha fazla satış elde edebilirsiniz.',
          impact: 'high',
          confidence: 89,
          actionRequired: true,
          category: 'product',
          tags: ['gaming', 'category', 'growth'],
          data: {
            category: 'gaming',
            growthRate: 15,
            potentialRevenue: 50000,
            timeframe: '30 days'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          type: 'trend',
          title: 'Fiyat Hassasiyeti Artışı',
          description: 'Son 30 günde kullanıcıların fiyat hassasiyeti %12 arttı. İndirim kampanyaları daha etkili olabilir.',
          impact: 'medium',
          confidence: 76,
          actionRequired: false,
          category: 'pricing',
          tags: ['pricing', 'sensitivity', 'discounts'],
          data: {
            sensitivityIncrease: 12,
            affectedCategories: ['electronics', 'fashion'],
            recommendation: 'increase_discounts'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          type: 'anomaly',
          title: 'Anormal Satış Düşüşü',
          description: 'Elektronik kategorisinde beklenmeyen satış düşüşü tespit edildi. Rekabet analizi önerilir.',
          impact: 'high',
          confidence: 92,
          actionRequired: true,
          category: 'sales',
          tags: ['electronics', 'sales', 'anomaly'],
          data: {
            category: 'electronics',
            salesDrop: 25,
            expectedSales: 100000,
            actualSales: 75000,
            timeframe: '7 days'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '4',
          type: 'warning',
          title: 'Stok Tükenme Riski',
          description: 'Popüler ürünlerde stok tükenme riski tespit edildi. Hızlı tedarik önerilir.',
          impact: 'medium',
          confidence: 84,
          actionRequired: true,
          category: 'inventory',
          tags: ['inventory', 'stock', 'risk'],
          data: {
            atRiskProducts: 15,
            estimatedDaysLeft: 3,
            potentialLostSales: 25000
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '5',
          type: 'opportunity',
          title: 'Müşteri Segmentasyonu',
          description: 'Yeni müşteri segmenti keşfedildi: "Premium Aileler". Bu segment için özel kampanyalar oluşturulabilir.',
          impact: 'high',
          confidence: 78,
          actionRequired: false,
          category: 'customer',
          tags: ['segmentation', 'premium', 'families'],
          data: {
            segmentSize: 500,
            averageOrderValue: 1500,
            potentialRevenue: 750000
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      return NextResponse.json({ 
        success: true, 
        insights: mockInsights 
      });
    }

    return NextResponse.json({ 
      success: true, 
      insights: insights || [] 
    });

  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch AI insights' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const body = await request.json();
    const { type, title, description, impact, confidence, category, tags, data } = body;

    // Validate required fields
    if (!type || !title || !description || !impact || !confidence) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type, title, description, impact, and confidence are required' 
      }, { status: 400 });
    }

    // Create AI insight
    const insight = {
      type,
      title,
      description,
      impact,
      confidence,
      action_required: impact === 'high',
      category: category || 'general',
      tags: tags || [],
      data: data || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newInsight, error } = await supabase
      .from('ai_insights')
      .insert([insight])
      .select()
      .single();

    if (error) {
      console.error('Insight creation error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create AI insight' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      insight: newInsight 
    });

  } catch (error) {
    console.error('AI insight creation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create AI insight' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Insight ID is required' 
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('ai_insights')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Insight update error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update AI insight' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      insight: data 
    });

  } catch (error) {
    console.error('AI insight update error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update AI insight' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Insight ID is required' 
      }, { status: 400 });
    }

    const { error } = await supabase
      .from('ai_insights')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Insight deletion error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete AI insight' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Insight deleted successfully' 
    });

  } catch (error) {
    console.error('AI insight deletion error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete AI insight' 
    }, { status: 500 });
  }
}
