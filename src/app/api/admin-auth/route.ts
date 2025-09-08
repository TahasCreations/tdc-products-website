import { NextRequest, NextResponse } from 'next/server';

// Optimized admin credentials
const ADMIN_CREDENTIALS = {
  email: 'bentahasarii@gmail.com',
  password: '35sandalye',
  name: 'Benta Hasarı',
  isMainAdmin: true
} as const;

// Pre-computed admin response for better performance
const ADMIN_RESPONSE = {
  success: true,
  admin: {
    id: 'admin-001',
    email: ADMIN_CREDENTIALS.email,
    name: ADMIN_CREDENTIALS.name,
    is_main_admin: ADMIN_CREDENTIALS.isMainAdmin,
    is_active: true,
    loginTime: new Date().toISOString()
  }
} as const;

const ERROR_RESPONSES = {
  invalid: { success: false, error: 'Geçersiz e-posta veya şifre' },
  server: { success: false, error: 'Sunucu hatası' },
  missing: { success: false, error: 'E-posta ve şifre gerekli' }
} as const;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Fast validation
    if (!email || !password) {
      return NextResponse.json(ERROR_RESPONSES.missing, { status: 400 });
    }

    // Optimized credential check
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      return NextResponse.json(ADMIN_RESPONSE);
    }

    return NextResponse.json(ERROR_RESPONSES.invalid, { status: 401 });

  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(ERROR_RESPONSES.server, { status: 500 });
  }
}