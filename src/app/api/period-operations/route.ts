import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
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

    const { data: operations, error } = await supabase
      .from('period_operations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Period operations fetch error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Dönem işlemleri alınamadı' 
      }, { status: 500 });
    }

    // İstatistikleri hesapla
    const stats = {
      totalOperations: operations?.length || 0,
      pendingOperations: operations?.filter(op => op.status === 'pending').length || 0,
      completedOperations: operations?.filter(op => op.status === 'completed').length || 0,
      failedOperations: operations?.filter(op => op.status === 'failed').length || 0,
      currentPeriod: '2024',
      lastClosingDate: operations?.find(op => op.type === 'closing' && op.status === 'completed')?.completed_at
    };

    return NextResponse.json({
      success: true,
      operations: operations || [],
      stats
    });

  } catch (error) {
    console.error('Period operations API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      period,
      description,
      created_by
    } = body;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { data: newOperation, error } = await supabase
      .from('period_operations')
      .insert({
        name,
        type,
        period,
        description,
        status: 'pending',
        affected_records: 0,
        created_by
      })
      .select()
      .single();

    if (error) {
      console.error('Create period operation error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Dönem işlemi oluşturulamadı' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      operation: newOperation
    });

  } catch (error) {
    console.error('Create period operation API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
