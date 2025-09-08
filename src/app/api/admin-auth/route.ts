import { NextRequest, NextResponse } from 'next/server';

// Basit admin giriş sistemi - hardcoded
const ADMIN_CREDENTIALS = {
  email: 'bentahasarii@gmail.com',
  password: '35sandalye',
  name: 'Benta Hasarı',
  isMainAdmin: true
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Giriş bilgilerini kontrol et
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      return NextResponse.json({
        success: true,
        admin: {
          id: 'admin-001',
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          is_main_admin: ADMIN_CREDENTIALS.isMainAdmin,
          is_active: true
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Geçersiz e-posta veya şifre'
    }, { status: 401 });

  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({
      success: false,
      error: 'Sunucu hatası'
    }, { status: 500 });
  }
}