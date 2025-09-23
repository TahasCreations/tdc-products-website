import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Server-side Supabase client
const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Kupon listesi getir
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kuponlar yüklenemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      coupons: coupons || []
    });

  } catch (error) {
    console.error('Kupon listesi hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Kuponlar yüklenemedi' 
    }, { status: 500 });
  }
}

// Kupon doğrulama
export async function POST(request: NextRequest) {
  try {
    const { code, total_amount } = await request.json();

    if (!code) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kupon kodu gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Kuponu veritabanından getir
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz kupon kodu' 
      }, { status: 404 });
    }

    // Kupon süresi kontrolü
    if (coupon.expires_at && new Date() > new Date(coupon.expires_at)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kupon süresi dolmuş' 
      }, { status: 400 });
    }

    // Maksimum kullanım kontrolü
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kupon kullanım limiti dolmuş' 
      }, { status: 400 });
    }

    // Minimum tutar kontrolü
    if (coupon.min_amount && total_amount < coupon.min_amount) {
      return NextResponse.json({ 
        success: false, 
        error: `Minimum ${coupon.min_amount.toLocaleString('tr-TR')}₺ alışveriş gerekli` 
      }, { status: 400 });
    }

    // İndirim hesaplama
    let discount_amount = 0;
    if (coupon.type === 'percentage') {
      discount_amount = (total_amount * coupon.value) / 100;
    } else {
      discount_amount = coupon.value;
    }

    // İndirim tutarı toplam tutardan fazla olamaz
    if (discount_amount > total_amount) {
      discount_amount = total_amount;
    }

    return NextResponse.json({
      success: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount_amount: Math.round(discount_amount * 100) / 100,
        min_amount: coupon.min_amount
      }
    });

  } catch (error) {
    console.error('Kupon doğrulama hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Kupon doğrulanırken hata oluştu' 
    }, { status: 500 });
  }
}

// Kupon kullanım sayısını artır
// Kupon oluştur/güncelle
export async function PUT(request: NextRequest) {
  try {
    const couponData = await request.json();

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Kupon oluştur veya güncelle
    const { data, error } = await supabase
      .from('coupons')
      .upsert([{
        id: couponData.id,
        code: couponData.code.toUpperCase(),
        name: couponData.name,
        type: couponData.type,
        value: couponData.value,
        min_amount: couponData.minAmount,
        max_discount: couponData.maxDiscount,
        usage_limit: couponData.usageLimit,
        valid_from: couponData.validFrom,
        valid_until: couponData.validUntil,
        is_active: true,
        created_at: couponData.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kupon kaydedilemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      coupon: data
    });

  } catch (error) {
    console.error('Kupon kaydetme hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Kupon kaydedilemedi' 
    }, { status: 500 });
  }
}

// Kupon sil
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kupon ID gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Kuponu sil
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kupon silinemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Kupon başarıyla silindi'
    });

  } catch (error) {
    console.error('Kupon silme hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Kupon silinemedi' 
    }, { status: 500 });
  }
}

// Kupon kullanım sayısını artır
export async function PATCH(request: NextRequest) {
  try {
    const { coupon_id } = await request.json();

    if (!coupon_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Kupon ID gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Kupon kullanım sayısını artır
    const { error } = await supabase
      .from('coupons')
      .update({ 
        used_count: supabase.rpc('increment', { row_id: coupon_id, column_name: 'used_count' }),
        updated_at: new Date().toISOString()
      })
      .eq('id', coupon_id);

    if (error) {
      console.error('Kupon kullanım hatası:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Kupon kullanım sayısı güncellenemedi' 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Kupon kullanım hatası:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Kupon kullanım sayısı güncellenirken hata oluştu' 
    }, { status: 500 });
  }
}
