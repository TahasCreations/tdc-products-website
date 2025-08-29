import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase';

export const runtime = 'nodejs';

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

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Sadece görsel dosyaları yüklenebilir' 
      }, { status: 400 });
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false, 
        error: 'Dosya boyutu 5MB\'dan büyük olamaz' 
      }, { status: 400 });
    }

            // Benzersiz dosya adı oluştur
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.name}`;
        const filePath = `products/${fileName}`;

        // Önce bucket'ın var olup olmadığını kontrol et
        const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
        
        if (bucketError) {
          console.error('Bucket list error:', bucketError);
          return NextResponse.json({ 
            success: false, 
            error: 'Storage bucket hatası: ' + bucketError.message 
          }, { status: 500 });
        }

        // 'images' bucket'ının var olup olmadığını kontrol et
        const imagesBucket = buckets?.find(bucket => bucket.name === 'images');
        if (!imagesBucket) {
          return NextResponse.json({ 
            success: false, 
            error: 'Storage bucket bulunamadı. Lütfen Supabase Dashboard\'da "images" bucket\'ını oluşturun.' 
          }, { status: 500 });
        }

        // Supabase Storage'a yükle
        const { data, error } = await supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error:', error);
          return NextResponse.json({ 
            success: false, 
            error: error.message 
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
    // Storage bucket listesi
    const { data, error } = await supabase.storage.listBuckets();

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
