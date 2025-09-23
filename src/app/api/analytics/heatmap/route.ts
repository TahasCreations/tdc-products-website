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

export async function POST(request: NextRequest) {
  try {
    const heatmapData = await request.json();
    const { x, y, timestamp, element, page, userId, type } = heatmapData;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Heatmap verisini veritabanına kaydet
    const { error } = await supabase
      .from('heatmap_data')
      .insert([{
        x,
        y,
        timestamp,
        element,
        page,
        user_id: userId,
        type: type || 'click',
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Heatmap data kaydetme hatası:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Heatmap verisi kaydedilemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Heatmap verisi kaydedildi'
    });

  } catch (error) {
    console.error('Heatmap API hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Heatmap verisi işlenemedi' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    let query = supabase
      .from('heatmap_data')
      .select('*')
      .order('timestamp', { ascending: false });

    if (page) {
      query = query.eq('page', page);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (startDate) {
      query = query.gte('timestamp', startDate);
    }

    if (endDate) {
      query = query.lte('timestamp', endDate);
    }

    const { data, error } = await query.limit(1000);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Heatmap verileri alınamadı' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Heatmap veri alma hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Heatmap verileri alınamadı' 
    }, { status: 500 });
  }
}
