import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    
    const { data: languages, error } = await supabase
      .from('languages')
      .select('*')
      .order('is_default', { ascending: false })
      .order('name');

    if (error) {
      console.error('Error fetching languages:', error);
      return NextResponse.json({ error: 'Failed to fetch languages' }, { status: 500 });
    }

    return NextResponse.json(languages);
  } catch (error) {
    console.error('Error in admin languages API:', error);
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
      .from('languages')
      .insert([{
        code: body.code,
        name: body.name,
        native_name: body.native_name,
        is_rtl: body.is_rtl || false,
        flag_emoji: body.flag_emoji,
        is_active: body.is_active !== undefined ? body.is_active : true,
        is_default: body.is_default || false
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating language:', error);
      return NextResponse.json({ error: 'Failed to create language' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in create language API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
