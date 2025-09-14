import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '../../../../lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    // For now, return default preferences
    // In a real app, you would get the user from the session
    if (type === 'language') {
      return NextResponse.json({ language: 'tr' });
    } else if (type === 'currency') {
      return NextResponse.json({ 
        currency: {
          id: 1,
          code: 'TRY',
          name: 'Turkish Lira',
          symbol: '₺',
          decimal_places: 2,
          is_active: true,
          is_default: true,
          exchange_rate: 1.0,
          last_updated: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({ 
      language: 'tr',
      currency: {
        id: 1,
        code: 'TRY',
        name: 'Turkish Lira',
        symbol: '₺',
        decimal_places: 2,
        is_active: true,
        is_default: true,
        exchange_rate: 1.0,
        last_updated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in user preferences API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, language, currency } = body;
    
    // For now, just return success
    // In a real app, you would save the user preferences to the database
    console.log('User preference update:', { type, language, currency });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in update user preferences API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
