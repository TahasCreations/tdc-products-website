import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

// E-ticaret verilerini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const customerId = searchParams.get('customer_id');
    const productId = searchParams.get('product_id');

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    if (type === 'shipping_companies') {
      // Kargo firmalarını getir
      const { data: companies, error } = await supabase
        .from('shipping_companies')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kargo firmaları alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        companies: companies || []
      });
    }

    if (type === 'payment_methods') {
      // Ödeme yöntemlerini getir
      const { data: methods, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'Ödeme yöntemleri alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        methods: methods || []
      });
    }

    if (type === 'coupons') {
      // Kuponları getir
      const { data: coupons, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .gte('valid_until', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'Kuponlar alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        coupons: coupons || []
      });
    }

    if (type === 'validate_coupon') {
      const code = searchParams.get('code');
      const orderAmount = parseFloat(searchParams.get('order_amount') || '0');

      if (!code) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kupon kodu gerekli' 
        }, { status: 400 });
      }

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
        }, { status: 400 });
      }

      // Kupon geçerlilik kontrolü
      const now = new Date();
      if (coupon.valid_from && new Date(coupon.valid_from) > now) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kupon henüz geçerli değil' 
        }, { status: 400 });
      }

      if (coupon.valid_until && new Date(coupon.valid_until) < now) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kupon süresi dolmuş' 
        }, { status: 400 });
      }

      // Minimum sipariş tutarı kontrolü
      if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
        return NextResponse.json({ 
          success: false, 
          error: `Minimum sipariş tutarı: ${coupon.min_order_amount} TL` 
        }, { status: 400 });
      }

      // Kullanım limiti kontrolü
      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return NextResponse.json({ 
          success: false, 
          error: 'Kupon kullanım limiti dolmuş' 
        }, { status: 400 });
      }

      // İndirim hesaplama
      let discountAmount = 0;
      if (coupon.type === 'percentage') {
        discountAmount = (orderAmount * coupon.value) / 100;
        if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
          discountAmount = coupon.max_discount_amount;
        }
      } else if (coupon.type === 'fixed_amount') {
        discountAmount = coupon.value;
      } else if (coupon.type === 'free_shipping') {
        discountAmount = 0; // Kargo ücreti ayrı hesaplanacak
      }

      return NextResponse.json({
        success: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          name: coupon.name,
          type: coupon.type,
          value: coupon.value,
          discount_amount: discountAmount,
          min_order_amount: coupon.min_order_amount,
          max_discount_amount: coupon.max_discount_amount
        }
      });
    }

    if (type === 'wishlist' && customerId) {
      // Wishlist'i getir
      const { data: wishlist, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          product:product_id (
            id,
            name,
            price,
            images
          )
        `)
        .eq('customer_id', customerId)
        .order('added_at', { ascending: false });

      if (error) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'Wishlist alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        wishlist: wishlist || []
      });
    }

    if (type === 'product_reviews' && productId) {
      // Ürün incelemelerini getir
      const { data: reviews, error } = await supabase
        .from('product_reviews')
        .select(`
          *,
          customer:customer_id (
            first_name,
            last_name
          ),
          replies:product_review_replies (
            *,
            admin:admin_id (
              name
            )
          )
        `)
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'Ürün incelemeleri alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        reviews: reviews || []
      });
    }

    if (type === 'shipping_rates') {
      const weight = parseFloat(searchParams.get('weight') || '0');
      const city = searchParams.get('city');

      if (!weight || !city) {
        return NextResponse.json({ 
          success: false, 
          error: 'Ağırlık ve şehir bilgisi gerekli' 
        }, { status: 400 });
      }

      // Kargo fiyatlarını hesapla
      const { data: rates, error } = await supabase
        .from('shipping_rates')
        .select(`
          *,
          shipping_company:shipping_company_id (
            name,
            code,
            logo_url
          )
        `)
        .eq('is_active', true)
        .lte('weight_from', weight)
        .gte('weight_to', weight);

      if (error) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'Kargo fiyatları alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        rates: rates || []
      });
    }

    if (type === 'stats') {
      // E-ticaret istatistiklerini hesapla
      const [
        { data: orders, error: ordersError },
        { data: products, error: productsError },
        { data: customers, error: customersError }
      ] = await Promise.all([
        supabase.from('orders').select('total_amount, created_at'),
        supabase.from('products').select('id, category'),
        supabase.from('customer_profiles').select('id')
      ]);

      if (ordersError || productsError || customersError) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'İstatistikler alınamadı' 
        }, { status: 500 });
      }

      // Bu ayın siparişleri
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const currentMonthOrders = orders?.filter(order => 
        new Date(order.created_at) >= currentMonth
      ) || [];

      const totalRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      const totalOrders = currentMonthOrders.length;
      const totalProducts = products?.length || 0;
      const totalCustomers = customers?.length || 0;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // En çok satan kategori
      const categoryCounts = products?.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topSellingCategory = Object.keys(categoryCounts).reduce((a, b) => 
        categoryCounts[a] > categoryCounts[b] ? a : b, 'Henüz kategori yok'
      );

      return NextResponse.json({
        success: true,
        stats: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalCustomers,
          conversionRate: 0, // Bu daha sonra hesaplanacak
          averageOrderValue,
          monthlyGrowth: 0, // Bu daha sonra hesaplanacak
          topSellingCategory
        }
      });
    }

    if (type === 'products') {
      // Ürünleri getir
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'Ürünler alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        products: products || []
      });
    }

    if (type === 'orders') {
      // Siparişleri getir
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_name,
            quantity,
            unit_price
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'Siparişler alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        orders: orders || []
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz tip parametresi' 
    }, { status: 400 });

  } catch (error) {
    
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// E-ticaret işlemleri
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    if (action === 'add_to_wishlist') {
      const { customer_id, product_id } = data;

      const { data: wishlistItem, error } = await supabase
        .from('wishlists')
        .insert({
          customer_id,
          product_id
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return NextResponse.json({ 
            success: false, 
            error: 'Ürün zaten wishlist\'te' 
          }, { status: 400 });
        }
        
        return NextResponse.json({ 
          success: false, 
          error: 'Wishlist\'e eklenemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        wishlistItem
      });
    }

    if (action === 'remove_from_wishlist') {
      const { customer_id, product_id } = data;

      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('customer_id', customer_id)
        .eq('product_id', product_id);

      if (error) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'Wishlist\'ten çıkarılamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true
      });
    }

    if (action === 'add_product_review') {
      const {
        product_id,
        customer_id,
        order_id,
        rating,
        title,
        content
      } = data;

      const { data: review, error } = await supabase
        .from('product_reviews')
        .insert({
          product_id,
          customer_id,
          order_id,
          rating,
          title,
          content,
          is_verified_purchase: !!order_id
        })
        .select()
        .single();

      if (error) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'İnceleme eklenemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        review
      });
    }

    if (action === 'create_coupon') {
      const {
        code,
        name,
        description,
        type,
        value,
        min_order_amount,
        max_discount_amount,
        usage_limit,
        usage_limit_per_customer,
        valid_from,
        valid_until,
        created_by
      } = data;

      const { data: coupon, error } = await supabase
        .from('coupons')
        .insert({
          code: code.toUpperCase(),
          name,
          description,
          type,
          value,
          min_order_amount,
          max_discount_amount,
          usage_limit,
          usage_limit_per_customer,
          valid_from,
          valid_until,
          created_by
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return NextResponse.json({ 
            success: false, 
            error: 'Bu kupon kodu zaten kullanılıyor' 
          }, { status: 400 });
        }
        
        return NextResponse.json({ 
          success: false, 
          error: 'Kupon oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        coupon
      });
    }

    if (action === 'create_shipping_company') {
      const {
        name,
        code,
        delivery_time_min,
        delivery_time_max,
        base_price,
        pricing_type,
        price_per_kg,
        free_shipping_threshold
      } = data;

      const { data: company, error } = await supabase
        .from('shipping_companies')
        .insert({
          name,
          code: code.toUpperCase(),
          delivery_time_min,
          delivery_time_max,
          base_price,
          pricing_type,
          price_per_kg,
          free_shipping_threshold
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return NextResponse.json({ 
            success: false, 
            error: 'Bu kargo kodu zaten kullanılıyor' 
          }, { status: 400 });
        }
        
        return NextResponse.json({ 
          success: false, 
          error: 'Kargo firması oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        company
      });
    }

    if (action === 'create_payment_method') {
      const {
        name,
        code,
        type,
        provider,
        is_online,
        processing_fee_percentage,
        processing_fee_fixed,
        min_amount,
        max_amount
      } = data;

      const { data: method, error } = await supabase
        .from('payment_methods')
        .insert({
          name,
          code: code.toUpperCase(),
          type,
          provider,
          is_online,
          processing_fee_percentage,
          processing_fee_fixed,
          min_amount,
          max_amount
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return NextResponse.json({ 
            success: false, 
            error: 'Bu ödeme kodu zaten kullanılıyor' 
          }, { status: 400 });
        }
        
        return NextResponse.json({ 
          success: false, 
          error: 'Ödeme yöntemi oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        method
      });
    }

    if (action === 'create_product') {
      const {
        title,
        slug,
        price,
        category,
        stock,
        image,
        description,
        status
      } = data;

      const { data: product, error } = await supabase
        .from('products')
        .insert({
          title,
          slug,
          price,
          category,
          stock,
          image,
          description,
          status
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          return NextResponse.json({ 
            success: false, 
            error: 'Bu slug zaten kullanılıyor' 
          }, { status: 400 });
        }
        
        return NextResponse.json({ 
          success: false, 
          error: 'Ürün oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        product
      });
    }

    if (action === 'update_product') {
      const {
        id,
        title,
        slug,
        price,
        category,
        stock,
        image,
        description,
        status
      } = data;

      const { data: product, error } = await supabase
        .from('products')
        .update({
          title,
          slug,
          price,
          category,
          stock,
          image,
          description,
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'Ürün güncellenemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        product
      });
    }

    if (action === 'delete_product') {
      const { id } = data;

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'Ürün silinemedi' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true
      });
    }

    if (action === 'create_test_order') {
      const {
        customer_name,
        customer_email,
        total_amount,
        items
      } = data;

      // Test siparişi oluştur
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name,
          customer_email,
          customer_phone: '555-0123',
          customer_address: 'Test Adresi, Test Mahallesi, Test Şehri',
          customer_city: 'İstanbul',
          customer_postal_code: '34000',
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'credit_card',
          shipping_method: 'standard',
          shipping_cost: 0,
          tax_amount: 0,
          discount_amount: 0,
          subtotal: total_amount,
          total_amount,
          currency_code: 'TRY',
          notes: 'Test siparişi'
        })
        .select()
        .single();

      if (orderError) {
        
        return NextResponse.json({ 
          success: false, 
          error: 'Test siparişi oluşturulamadı' 
        }, { status: 500 });
      }

      // Sipariş öğelerini ekle
      if (items && items.length > 0) {
        const orderItems = items.map((item: any) => ({
          order_id: order.id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.quantity * item.unit_price
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          
          // Sipariş oluşturuldu ama öğeler eklenemedi - siparişi sil
          await supabase.from('orders').delete().eq('id', order.id);
          return NextResponse.json({ 
            success: false, 
            error: 'Sipariş öğeleri eklenemedi' 
          }, { status: 500 });
        }
      }

      return NextResponse.json({
        success: true,
        order
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz işlem' 
    }, { status: 400 });

  } catch (error) {
    
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
