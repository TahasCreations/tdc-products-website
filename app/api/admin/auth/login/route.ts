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

    // Also check database for admin users (if table exists)
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
        select: { 
          id: true, 
          email: true, 
          name: true, 
          role: true,
          password: true 
        },
      });
    } catch (dbError: any) {
      // Database table doesn't exist yet - log but don't show setup buttons
      if (dbError.message?.includes('does not exist')) {
        console.error('Database table error:', dbError.message);
        return NextResponse.json(
          { 
            error: 'Database bağlantı hatası. Lütfen database yöneticinizle iletişime geçin.',
          },
          { status: 503 }
        );
      }
      throw dbError;
    }

    if (!user) {
      console.error('Admin login: User not found', { email });
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    if (user.role !== 'ADMIN') {
      console.error('Admin login: User is not admin', { email, role: user.role });
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      );
    }

    // Verify password if user has one in database
    if (user.password) {
      const isValid = await bcrypt.compare(password, user.password);
      console.log('Password check:', { 
        email, 
        hasPassword: !!user.password, 
        isValid,
        passwordLength: password.length 
      });
      if (!isValid) {
        return NextResponse.json(
          { error: 'Geçersiz e-posta veya şifre' },
          { status: 401 }
        );
      }
    } else {
      console.error('Admin login: User has no password', { email });
      return NextResponse.json(
        { error: 'Kullanıcı şifresi bulunamadı' },
        { status: 401 }
      );
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


