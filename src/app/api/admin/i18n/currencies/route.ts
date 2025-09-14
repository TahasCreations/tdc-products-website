import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    
    const { data: currencies, error } = await supabase
      .from('currencies')
      .select('*')
      .order('is_default', { ascending: false })
      .order('name');

    if (error) {
      console.error('Error fetching currencies:', error);
      return NextResponse.json({ error: 'Failed to fetch currencies' }, { status: 500 });
    }

    return NextResponse.json(currencies);
  } catch (error) {
    console.error('Error in admin currencies API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('currencies')
      .insert([{
        code: body.code,
        name: body.name,
        symbol: body.symbol,
        decimal_places: body.decimal_places || 2,
        exchange_rate: body.exchange_rate || 1.0,
        is_active: body.is_active !== undefined ? body.is_active : true,
        is_default: body.is_default || false
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating currency:', error);
      return NextResponse.json({ error: 'Failed to create currency' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in create currency API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
