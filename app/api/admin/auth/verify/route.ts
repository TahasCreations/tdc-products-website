import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'Token bulunamadı' },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'tdc-admin-secret-key-change-in-production'
    );

    const { payload } = await jwtVerify(token, secret);

    if (!payload.isAdmin || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { authenticated: false, error: 'Yetkisiz erişim' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: payload.email,
        role: payload.role,
        userId: payload.userId,
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Geçersiz token' },
      { status: 401 }
    );
  }
}


