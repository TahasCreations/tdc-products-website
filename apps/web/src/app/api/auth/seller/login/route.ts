import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

interface Seller {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  storeName: string;
  status: 'active' | 'pending' | 'suspended';
  role: 'seller';
  createdAt: string;
  lastLoginAt?: string;
}

// Mock seller database - In production, this would be a real database
const mockSellers: Seller[] = [
  {
    id: 'seller_1',
    email: 'seller@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'Ahmet',
    lastName: 'Yılmaz',
    storeName: 'Ahmet\'in 3D Mağazası',
    status: 'active',
    role: 'seller',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'seller_2',
    email: 'test@test.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    firstName: 'Fatma',
    lastName: 'Demir',
    storeName: 'Fatma\'nın Figür Dünyası',
    status: 'pending',
    role: 'seller',
    createdAt: '2024-01-15T00:00:00Z'
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre gereklidir' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta adresi giriniz' },
        { status: 400 }
      );
    }

    // Find seller by email
    const seller = mockSellers.find(s => s.email.toLowerCase() === email.toLowerCase());
    
    if (!seller) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi ile kayıtlı satıcı bulunamadı' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, seller.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Şifre hatalı' },
        { status: 401 }
      );
    }

    // Check seller status
    if (seller.status === 'suspended') {
      return NextResponse.json(
        { error: 'Hesabınız askıya alınmış. Lütfen destek ekibi ile iletişime geçin.' },
        { status: 403 }
      );
    }

    // Update last login
    seller.lastLoginAt = new Date().toISOString();

    // Create session token (in production, use JWT)
    const token = `seller_token_${seller.id}_${Date.now()}`;

    // Return seller data (without password)
    const { password: _, ...sellerData } = seller;

    return NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      seller: sellerData,
      token: token,
      redirectTo: seller.status === 'pending' 
        ? '/seller/dashboard?status=pending' 
        : '/seller/dashboard'
    });

  } catch (error) {
    console.error('Seller login error:', error);
    return NextResponse.json(
      { error: 'Giriş sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Generate hash for new passwords (utility endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');

    if (!password) {
      return NextResponse.json(
        { error: 'Password parameter is required' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    return NextResponse.json({
      password: password,
      hashedPassword: hashedPassword
    });

  } catch (error) {
    console.error('Hash generation error:', error);
    return NextResponse.json(
      { error: 'Hash generation failed' },
      { status: 500 }
    );
  }
}
