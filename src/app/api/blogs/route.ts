import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Server-side Supabase client
const createServerSupabaseClient = () => {
  // Geçici olarak hardcoded değerler kullanıyoruz
  const supabaseUrl = 'https://your-project.supabase.co';
  const supabaseAnonKey = 'your_anon_key_here';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Blog'ları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const category = searchParams.get('category');
    const author = searchParams.get('author');

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı kurulamadı' }, { status: 500 });
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
      return NextResponse.json({ error: 'Blog\'lar alınamadı' }, { status: 500 });
    }

    return NextResponse.json(blogs || []);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Yeni blog oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, excerpt, image, category, tags, author, user_id } = body;

    if (!title || !content || !author) {
      return NextResponse.json({ 
        error: 'Başlık, içerik ve yazar alanları zorunludur' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı kurulamadı' }, { status: 500 });
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
      title,
      slug,
      excerpt: excerpt || content.substring(0, 150) + '...',
      content,
      image: image || '',
      category: category || 'Genel',
      tags: tags || [],
      author,
      user_id,
      status: user_id ? 'pending' : 'published', // Admin değilse onay bekler
      published_at: new Date().toISOString(),
      read_time: readTime,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('blogs')
      .insert([newBlog])
      .select()
      .single();

    if (error) {
      console.error('Blog creation error:', error);
      return NextResponse.json({ error: 'Blog oluşturulamadı' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: user_id ? 'Blog yazınız onay için gönderildi' : 'Blog başarıyla oluşturuldu',
      blog: data
    });
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
