import { NextResponse } from 'next/server';
import { testSupabaseConnection, isSupabaseConfigured } from '../../../../lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const configStatus = isSupabaseConfigured();
    const connectionTest = await testSupabaseConnection();

    return NextResponse.json({
      configured: configStatus,
      connection: connectionTest,
      environment: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
        serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'
      },
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      configured: false,
      connection: { success: false, error: 'Test failed' },
      timestamp: new Date().toISOString()
    });
  }
}
