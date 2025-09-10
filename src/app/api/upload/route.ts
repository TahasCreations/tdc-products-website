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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'Dosya bulunamadı' 
      }, { status: 400 });
    }

    // Dosya tipi kontrolü - daha esnek
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Desteklenen dosya formatları: JPEG, PNG, GIF, WebP, SVG' 
      }, { status: 400 });
    }

    // Dosya boyutu kontrolü (10MB'a çıkarıldı)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        error: 'Dosya boyutu 10MB\'dan büyük olamaz' 
      }, { status: 400 });
    }

    // Dosya adı kontrolü
    if (!file.name || file.name.trim() === '') {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz dosya adı' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = `products/${fileName}`;

    // Bucket kontrolünü atla, doğrudan yükleme yap
    // Bucket kontrolü atlandı, doğrudan yükleme yapılıyor

    // Supabase Storage'a yükle - Retry mekanizması ile
    let uploadSuccess = false;
    let lastError: any = null;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await supabase!.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: attempt > 1 // İkinci denemeden sonra üzerine yaz
          });

        if (error) {
          lastError = error;
          console.error(`Upload attempt ${attempt} error:`, error);
          
          // RLS hatası ise detaylı hata mesajı
          if (error.message.includes('row-level security')) {
            return NextResponse.json({ 
              success: false, 
              error: 'RLS politikası hatası. Lütfen Supabase Dashboard\'da storage politikalarını kontrol edin.' 
            }, { status: 500 });
          }
          
          // Son deneme değilse tekrar dene
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            continue;
          }
          
          return NextResponse.json({ 
            success: false, 
            error: `Yükleme başarısız (${maxRetries} deneme): ${error.message}` 
          }, { status: 500 });
        }

        uploadSuccess = true;
        break;
      } catch (uploadError) {
        lastError = uploadError;
        console.error(`Upload attempt ${attempt} process error:`, uploadError);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        
        return NextResponse.json({ 
          success: false, 
          error: `Görsel yükleme hatası (${maxRetries} deneme): ${uploadError}` 
        }, { status: 500 });
      }
    }

    if (!uploadSuccess) {
      return NextResponse.json({ 
        success: false, 
        error: 'Yükleme başarısız' 
      }, { status: 500 });
    }

    // Public URL al
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return NextResponse.json({ 
      success: true, 
      url: urlData.publicUrl,
      path: filePath
    });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }
    
    // Storage bucket listesi
    const { data, error } = await supabase!.storage.listBuckets();

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      buckets: data 
    });

  } catch (error) {
    console.error('Storage API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
