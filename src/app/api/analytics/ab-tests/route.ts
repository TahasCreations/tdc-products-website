import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Server-side Supabase client
const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { data: tests, error } = await supabase
      .from('ab_tests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'A/B testleri alınamadı' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      tests: tests || []
    });

  } catch (error) {
    console.error('A/B testleri alma hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'A/B testleri alınamadı' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const testData = await request.json();
    const { name, description, startDate, endDate, variants, status } = testData;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('ab_tests')
      .insert([{
        name,
        description,
        start_date: startDate,
        end_date: endDate,
        variants: JSON.stringify(variants),
        status: status || 'draft',
        metrics: JSON.stringify(variants.map(() => ({
          visitors: 0,
          conversions: 0,
          conversionRate: 0,
          revenue: 0
        }))),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'A/B test oluşturulamadı' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      test: data
    });

  } catch (error) {
    console.error('A/B test oluşturma hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'A/B test oluşturulamadı' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('id');
    const updateData = await request.json();

    if (!testId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Test ID gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('ab_tests')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', testId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'A/B test güncellenemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      test: data
    });

  } catch (error) {
    console.error('A/B test güncelleme hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'A/B test güncellenemedi' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('id');

    if (!testId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Test ID gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { error } = await supabase
      .from('ab_tests')
      .delete()
      .eq('id', testId);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'A/B test silinemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'A/B test başarıyla silindi'
    });

  } catch (error) {
    console.error('A/B test silme hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'A/B test silinemedi' 
    }, { status: 500 });
  }
}
