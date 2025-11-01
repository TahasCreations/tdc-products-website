import { NextRequest, NextResponse } from 'next/server';

// Örnek kuponlar - Production'da database'den alınacak
const VALID_COUPONS = [
  {
    code: 'HOSGELDIN',
    type: 'percentage' as const,
    discount: 10,
    minAmount: 100,
    description: 'İlk alışverişinizde %10 indirim',
    expiryDate: '2025-12-31',
  },
  {
    code: 'YILBASI',
    type: 'percentage' as const,
    discount: 15,
    minAmount: 200,
    description: 'Yılbaşı özel %15 indirim',
    expiryDate: '2025-12-31',
  },
  {
    code: 'SUPER50',
    type: 'fixed' as const,
    discount: 50,
    minAmount: 300,
    description: '300 TL üzeri alışverişlerde 50 TL indirim',
    expiryDate: '2025-12-31',
  },
  {
    code: 'KARGO',
    type: 'free_shipping' as const,
    discount: 125,
    minAmount: 0,
    description: 'Ücretsiz kargo',
    expiryDate: '2025-12-31',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { code, cartTotal = 0 } = await request.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'Kupon kodu gerekli' },
        { status: 400 }
      );
    }

    // Kuponu bul
    const coupon = VALID_COUPONS.find(
      (c) => c.code === code.toUpperCase()
    );

    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: 'Geçersiz kupon kodu' },
        { status: 404 }
      );
    }

    // Son kullanma tarihini kontrol et
    const expiryDate = new Date(coupon.expiryDate);
    if (expiryDate < new Date()) {
      return NextResponse.json(
        { valid: false, message: 'Bu kuponun süresi dolmuş' },
        { status: 400 }
      );
    }

    // Minimum tutar kontrolü
    if (cartTotal < coupon.minAmount) {
      return NextResponse.json(
        { 
          valid: false, 
          message: `Bu kupon için minimum ${coupon.minAmount} TL alışveriş gerekli (Şu an: ${cartTotal.toFixed(2)} TL)` 
        },
        { status: 400 }
      );
    }

    // İndirim hesapla
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (cartTotal * coupon.discount) / 100;
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.discount;
    } else if (coupon.type === 'free_shipping') {
      discountAmount = coupon.discount; // Kargo ücreti
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        discount: discountAmount,
        description: coupon.description,
      },
      message: 'Kupon başarıyla uygulandı! 🎉',
    });
  } catch (error) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { valid: false, message: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
}


