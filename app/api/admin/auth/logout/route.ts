import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ 
    success: true, 
    message: 'Çıkış başarılı' 
  });

  // Clear admin token cookie
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  // Also clear old adminAuth cookie if exists
  response.cookies.set('adminAuth', '', {
    maxAge: 0,
    path: '/',
  });

  return response;
}


