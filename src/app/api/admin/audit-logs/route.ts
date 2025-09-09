import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabaseClient } from '../../../../lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    const tableName = searchParams.get('tableName');
    const limit = parseInt(searchParams.get('limit') || '1000');

    // Audit logları çek
    let query = supabase!
      .from('audit_logs')
      .select('*')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (action) {
      query = query.eq('action', action);
    }

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (tableName) {
      query = query.eq('table_name', tableName);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Audit logs GET error:', error);
    return NextResponse.json(
      { error: 'Audit logları alınamadı' },
      { status: 500 }
    );
  }
}
