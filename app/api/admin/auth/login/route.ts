import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';

// Admin credentials - Production'da environment variable'dan alınmalı
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@tdcproducts.com',
  password: process.env.ADMIN_PASSWORD || 'TDCAdmin2024!', // Hash'lenmiş olmalı
};

export async function POST(req: NextRequest) {
  try {
    const { email, password, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Check if credentials match admin
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Create JWT token
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'tdc-admin-secret-key-change-in-production'
      );

      const token = await new SignJWT({ 
        email, 
        role: 'ADMIN',
        isAdmin: true 
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(rememberMe ? '30d' : '1d')
        .sign(secret);

      // Set cookie
      const maxAge = rememberMe ? 86400 * 30 : 86400; // 30 days or 1 day
      
      const response = NextResponse.json({ 
        success: true, 
        message: 'Giriş başarılı',
        user: {
          email,
          role: 'ADMIN'
        }
      });

      response.cookies.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
        path: '/',
      });

      return response;
    }

    // Also check database for admin users
    const user = await prisma.user.findUnique({
      where: { email },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true,
        password: true 
      },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    // Verify password if user has one in database
    if (user.password) {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Geçersiz e-posta veya şifre' },
          { status: 401 }
        );
      }
    }

    // Create JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'tdc-admin-secret-key-change-in-production'
    );

    const token = await new SignJWT({ 
      userId: user.id,
      email: user.email, 
      role: user.role,
      isAdmin: true 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(rememberMe ? '30d' : '1d')
      .sign(secret);

    const maxAge = rememberMe ? 86400 * 30 : 86400;
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Giriş başarılı',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Giriş işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}


