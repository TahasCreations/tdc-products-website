import { NextResponse } from 'next/server'

// Bu endpoint yalnızca yapılandırma durumunu bildirir, anahtarları asla döndürmez
export async function GET() {
  try {
    const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)
    const hasAnon = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const hasService = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
    return NextResponse.json({ hasUrl, hasAnon, hasService })
  } catch (e) {
    return NextResponse.json({ hasUrl: false, hasAnon: false, hasService: false })
  }
}

