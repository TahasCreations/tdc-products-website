/**
 * Create First Admin User API
 * İlk admin kullanıcısını oluşturur
 * Güvenlik: Sadece admin yoksa çalışır
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, confirmKey } = body;

    // Güvenlik kontrolü
    if (confirmKey !== 'CREATE_FIRST_ADMIN_TDC_2024') {
      return NextResponse.json(
        { error: 'Invalid confirmation key' },
        { status: 403 }
      );
    }

    // Email ve şifre kontrolü
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Admin kullanıcısı zaten var mı kontrol et
    const existingAdmins = await prisma.user.count({
      where: {
        OR: [
          { role: 'ADMIN' },
          { email: email }
        ]
      }
    });

    if (existingAdmins > 0) {
      return NextResponse.json(
        { 
          error: 'Admin kullanıcısı zaten mevcut',
          message: 'Güvenlik için sadece 1 admin oluşturulabilir. Mevcut admin ile giriş yapın.'
        },
        { status: 400 }
      );
    }

    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(password, 12);

    // Admin kullanıcısı oluştur
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: email,
        password: hashedPassword,
        role: 'ADMIN',
        roles: JSON.stringify(['ADMIN', 'BUYER']),
        emailVerified: new Date(),
        isActive: true,
      },
    });

    console.log('✅ Admin kullanıcısı oluşturuldu:', admin.email);

    return NextResponse.json({
      success: true,
      message: 'Admin kullanıcısı başarıyla oluşturuldu!',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

  } catch (error: any) {
    console.error('❌ Admin oluşturma hatası:', error);
    
    return NextResponse.json(
      {
        error: 'Admin oluşturma başarısız',
        message: error.message,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

