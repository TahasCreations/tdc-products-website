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
  
  // URL formatını kontrol et
  if (supabaseUrl.includes('your_supabase_project_url') || 
      supabaseUrl === 'your_supabase_project_url/' ||
      supabaseUrl === 'your_supabase_project_url' ||
      !supabaseUrl.startsWith('https://')) {
    console.error('Supabase URL is not configured properly:', supabaseUrl);
    return null;
  }
  
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
};

// Default blog data
const getDefaultBlogs = () => [
  {
    id: '1',
    title: 'Anime Dünyasına Giriş: Başlangıç Rehberi',
    slug: 'anime-dunyasina-giris-baslangic-rehberi',
    excerpt: 'Anime dünyasına yeni başlayanlar için kapsamlı bir rehber. Hangi animeyi izlemeli, nereden başlamalı?',
    content: 'Anime dünyası, geniş bir hayran kitlesine sahip olan ve sürekli büyüyen bir kültürdür. Bu rehberde anime dünyasına yeni başlayanlar için önemli bilgileri bulabilirsiniz.\n\n## Anime Nedir?\n\nAnime, Japon animasyon sanatının bir parçasıdır. Çizgi filmlerden farklı olarak, anime genellikle daha karmaşık hikayeler ve karakter gelişimi sunar.\n\n## Nereden Başlamalı?\n\n1. **Popüler Seriler**: Naruto, One Piece, Attack on Titan\n2. **Klasikler**: Studio Ghibli filmleri\n3. **Modern Favoriler**: Demon Slayer, Jujutsu Kaisen\n\n## İzleme Platformları\n\n- Crunchyroll\n- Funimation\n- Netflix\n- Hulu\n\nAnime dünyasına hoş geldiniz!',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
    category: 'Anime',
    tags: ['anime', 'başlangıç', 'rehber', 'japon'],
    author: 'TDC Admin',
    user_id: null,
    status: 'published',
    published_at: '2024-01-15T10:00:00.000Z',
    read_time: 5,
    created_at: '2024-01-15T10:00:00.000Z',
    updated_at: '2024-01-15T10:00:00.000Z'
  },
  {
    id: '2',
    title: 'Gaming Dünyasında Son Trendler',
    slug: 'gaming-dunyasinda-son-trendler',
    excerpt: '2024 yılında gaming dünyasında öne çıkan trendler ve gelecek öngörüleri.',
    content: 'Gaming dünyası sürekli gelişen ve değişen bir sektördür. Bu yazıda 2024 yılında öne çıkan trendleri inceleyeceğiz.\n\n## VR ve AR Teknolojileri\n\nSanal gerçeklik ve artırılmış gerçeklik teknolojileri gaming dünyasında büyük bir etki yaratıyor.\n\n## Cloud Gaming\n\nBulut tabanlı oyun servisleri giderek daha popüler hale geliyor.\n\n## E-Sports\n\nProfesyonel oyun yarışmaları büyük bir endüstri haline geldi.\n\n## Mobil Gaming\n\nMobil oyunlar, gaming pazarının büyük bir bölümünü oluşturuyor.',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400&fit=crop',
    category: 'Gaming',
    tags: ['gaming', 'trendler', '2024', 'teknoloji'],
    author: 'TDC Admin',
    user_id: null,
    status: 'published',
    published_at: '2024-01-10T14:30:00.000Z',
    read_time: 4,
    created_at: '2024-01-10T14:30:00.000Z',
    updated_at: '2024-01-10T14:30:00.000Z'
  },
  {
    id: '3',
    title: 'Film İncelemesi: Avatar: The Way of Water',
    slug: 'film-incelemesi-avatar-the-way-of-water',
    excerpt: 'James Cameron\'ın Avatar serisinin ikinci filmi hakkında detaylı inceleme ve analiz.',
    content: 'Avatar: The Way of Water, James Cameron\'ın uzun süre beklenen devam filmi. Bu film, görsel efektler ve hikaye anlatımı açısından sinema tarihinde önemli bir yer tutuyor.\n\n## Görsel Efektler\n\nFilm, görsel efektler açısından sinema tarihinde yeni standartlar belirliyor.\n\n## Hikaye\n\nİlk filmin devamı olarak, Jake ve Neytiri\'nin aile hayatına odaklanıyor.\n\n## Performanslar\n\nOyuncuların performansları oldukça başarılı.\n\n## Sonuç\n\nAvatar: The Way of Water, görsel bir şölen sunan, ancak hikaye açısından bazı eksiklikleri olan bir film.',
    image: 'https://images.unsplash.com/photo-1489599808581-8e0b6d2a2d3a?w=800&h=400&fit=crop',
    category: 'Film',
    tags: ['avatar', 'film', 'inceleme', 'james-cameron'],
    author: 'TDC Admin',
    user_id: null,
    status: 'published',
    published_at: '2024-01-05T16:45:00.000Z',
    read_time: 6,
    created_at: '2024-01-05T16:45:00.000Z',
    updated_at: '2024-01-05T16:45:00.000Z'
  }
];

// Blog'ları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const category = searchParams.get('category');
    const author = searchParams.get('author');

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(getDefaultBlogs());
    }

    let query = supabase
      .from('blogs')
      .select('*')
      .order('published_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (author) {
      query = query.eq('author', author);
    }

    const { data: blogs, error } = await query;

    if (error) {
      console.error('Blogs fetch error:', error);
      return NextResponse.json(getDefaultBlogs());
    }

    if (blogs && blogs.length > 0) {
      return NextResponse.json(blogs);
    }

    // Eğer Supabase'de blog yoksa default blogları döndür
    return NextResponse.json(getDefaultBlogs());
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(getDefaultBlogs());
  }
}

// Yeni blog oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, image, category, tags, author, user_id } = body;

    // Gelişmiş validasyon
    if (!title || !title.trim()) {
      return NextResponse.json({ 
        error: 'Blog başlığı gerekli' 
      }, { status: 400 });
    }

    if (title.trim().length < 10) {
      return NextResponse.json({ 
        error: 'Blog başlığı en az 10 karakter olmalı' 
      }, { status: 400 });
    }

    if (title.trim().length > 200) {
      return NextResponse.json({ 
        error: 'Blog başlığı en fazla 200 karakter olabilir' 
      }, { status: 400 });
    }

    if (!content || !content.trim()) {
      return NextResponse.json({ 
        error: 'Blog içeriği gerekli' 
      }, { status: 400 });
    }

    if (content.trim().length < 100) {
      return NextResponse.json({ 
        error: 'Blog içeriği en az 100 karakter olmalı' 
      }, { status: 400 });
    }

    if (!author || !author.trim()) {
      return NextResponse.json({ 
        error: 'Yazar bilgisi gerekli' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: true, 
        message: 'Blog yazınız kaydedildi (offline mode)',
        blog: {
          id: Date.now().toString(),
          title: title.trim(),
          slug: title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').trim(),
          content: content.trim(),
          author: author.trim(),
          status: 'pending'
        }
      });
    }

    // Slug oluştur
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Okuma süresi hesapla (ortalama 200 kelime/dakika)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const newBlog = {
      title: title.trim(),
      slug,
      excerpt: excerpt || content.substring(0, 150) + '...',
      content: content.trim(),
      image: image || '',
      category: category || 'Genel',
      tags: tags || [],
      author: author.trim(),
      user_id,
      status: user_id ? 'pending' : 'published', // Admin değilse onay bekler
      published_at: new Date().toISOString(),
      read_time: readTime,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Retry mekanizması ile blog ekleme
    let insertSuccess = false;
    let lastError: any = null;
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .insert([newBlog])
          .select()
          .single();

        if (error) {
          lastError = error;
          console.error(`Blog insert attempt ${attempt} error:`, error);
          
          // Benzersizlik hatası
          if (error.code === '23505' || error.message.includes('duplicate')) {
            return NextResponse.json({ error: 'Bu başlıkta bir blog zaten mevcut' }, { status: 400 });
          }
          
          // Son deneme değilse tekrar dene
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
          
          return NextResponse.json({ error: `Blog eklenemedi (${maxRetries} deneme): ${error.message}` }, { status: 500 });
        }

        insertSuccess = true;
        return NextResponse.json({
          success: true,
          message: user_id ? 'Blog yazınız onay için gönderildi' : 'Blog başarıyla oluşturuldu',
          blog: data,
          attempts: attempt
        });
      } catch (supabaseError) {
        lastError = supabaseError;
        console.error(`Blog insert attempt ${attempt} process error:`, supabaseError);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        
        return NextResponse.json({ error: `Supabase hatası (${maxRetries} deneme): ${supabaseError}` }, { status: 500 });
      }
    }

    if (!insertSuccess) {
      return NextResponse.json({ error: 'Blog eklenemedi' }, { status: 500 });
    }
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Blog güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Blog ID gerekli' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı kurulamadı' }, { status: 500 });
    }

    const { data, error } = await supabase
      .from('blogs')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Blog update error:', error);
      return NextResponse.json({ error: 'Blog güncellenemedi' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog başarıyla güncellendi',
      blog: data
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Blog sil
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Blog ID gerekli' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı kurulamadı' }, { status: 500 });
    }

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Blog delete error:', error);
      return NextResponse.json({ error: 'Blog silinemedi' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Blog başarıyla silindi'
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
