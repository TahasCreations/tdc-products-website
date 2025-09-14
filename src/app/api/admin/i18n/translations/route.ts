import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    
    const { data: translations, error } = await supabase
      .from('translations')
      .select(`
        *,
        translation_keys (
          key_name,
          namespace
        ),
        languages (
          code,
          native_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching translations:', error);
      return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
    }

    return NextResponse.json(translations);
  } catch (error) {
    console.error('Error in admin translations API:', error);
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
    
    // First, create or get the translation key
    let translationKeyId;
    const { data: existingKey, error: keyError } = await supabase
      .from('translation_keys')
      .select('id')
      .eq('key_name', body.key_name)
      .eq('namespace', body.namespace || 'common')
      .single();

    if (existingKey) {
      translationKeyId = existingKey.id;
    } else {
      const { data: newKey, error: newKeyError } = await supabase
        .from('translation_keys')
        .insert([{
          key_name: body.key_name,
          namespace: body.namespace || 'common',
          description: body.description
        }])
        .select()
        .single();

      if (newKeyError) {
        console.error('Error creating translation key:', newKeyError);
        return NextResponse.json({ error: 'Failed to create translation key' }, { status: 500 });
      }

      translationKeyId = newKey.id;
    }

    // Create the translation
    const { data, error } = await supabase
      .from('translations')
      .insert([{
        translation_key_id: translationKeyId,
        language_id: body.language_id,
        translation_text: body.translation_text,
        is_approved: body.is_approved || false
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating translation:', error);
      return NextResponse.json({ error: 'Failed to create translation' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in create translation API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
