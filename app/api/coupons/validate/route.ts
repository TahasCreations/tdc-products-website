import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { code, cartTotal = 0, userId, items = [] } = await request.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, message: 'Kupon kodu gerekli' },
        { status: 400 }
      );
    }

    // Kuponu database'den bul
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: 'Geçersiz kupon kodu' },
        { status: 404 }
      );
    }

    // Aktif mi kontrol et
    if (!coupon.isActive) {
      return NextResponse.json(
        { valid: false, message: 'Bu kupon aktif değil' },
        { status: 400 }
      );
    }

    // Geçerlilik tarihi kontrolü
    const now = new Date();
    if (coupon.validFrom > now) {
      return NextResponse.json(
        { valid: false, message: 'Bu kupon henüz geçerli değil' },
        { status: 400 }
      );
    }

    if (coupon.validUntil && coupon.validUntil < now) {
      return NextResponse.json(
        { valid: false, message: 'Bu kuponun süresi dolmuş' },
        { status: 400 }
      );
    }

    // Minimum tutar kontrolü
    if (cartTotal < coupon.minOrderAmount) {
      return NextResponse.json(
        { 
          valid: false, 
          message: `Bu kupon için minimum ₺${coupon.minOrderAmount.toFixed(2)} alışveriş gerekli (Şu an: ₺${cartTotal.toFixed(2)})` 
        },
        { status: 400 }
      );
    }

    // Kullanım limiti kontrolü
    if (coupon.usageLimit) {
      const usageCount = await prisma.couponUsage.count({
        where: { couponId: coupon.id },
      });

      if (usageCount >= coupon.usageLimit) {
        return NextResponse.json(
          { valid: false, message: 'Bu kuponun kullanım limiti dolmuş' },
          { status: 400 }
        );
      }
    }

    // Kullanıcı başına kullanım limiti kontrolü
    if (userId) {
      const userUsageCount = await prisma.couponUsage.count({
        where: {
          couponId: coupon.id,
          userId: userId,
        },
      });

      if (userUsageCount >= coupon.usageLimitPerUser) {
        return NextResponse.json(
          { valid: false, message: 'Bu kuponu daha önce kullandınız' },
          { status: 400 }
        );
      }
    }

    // Ürün/kategori kısıtlamaları kontrol et
    if (items.length > 0) {
      const applicableProducts = coupon.applicableProducts ? JSON.parse(coupon.applicableProducts) : [];
      const applicableCategories = coupon.applicableCategories ? JSON.parse(coupon.applicableCategories) : [];
      const excludedProducts = coupon.excludedProducts ? JSON.parse(coupon.excludedProducts) : [];

      if (applicableProducts.length > 0 || applicableCategories.length > 0) {
        const itemProductIds = items.map((item: any) => item.productId || item.id);
        const hasApplicableProduct = itemProductIds.some((id: string) => applicableProducts.includes(id));
        
        if (!hasApplicableProduct && applicableProducts.length > 0) {
          return NextResponse.json(
            { valid: false, message: 'Bu kupon sepetinizdeki ürünlere uygulanamaz' },
            { status: 400 }
          );
        }
      }

      if (excludedProducts.length > 0) {
        const itemProductIds = items.map((item: any) => item.productId || item.id);
        const hasExcludedProduct = itemProductIds.some((id: string) => excludedProducts.includes(id));
        
        if (hasExcludedProduct) {
          return NextResponse.json(
            { valid: false, message: 'Bu kupon sepetinizdeki bazı ürünlere uygulanamaz' },
            { status: 400 }
          );
        }
      }
    }

    // İndirim hesapla
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.discountValue;
    } else if (coupon.type === 'free_shipping') {
      // Kargo ücreti hesaplanacak, şimdilik sabit değer
      discountAmount = coupon.discountValue || 125; // Varsayılan kargo ücreti
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        discount: discountAmount,
        description: coupon.description || coupon.name,
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


