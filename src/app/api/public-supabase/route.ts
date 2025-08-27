import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    return NextResponse.json({ url, anon })
  } catch (e) {
    return NextResponse.json({ url: '', anon: '' })
  }
}


