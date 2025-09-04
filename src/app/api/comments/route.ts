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

// Yorumları getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blog_id');
    const status = searchParams.get('status') || 'approved';
    const parentId = searchParams.get('parent_id'); // Yanıt yorumları için

    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID gerekli' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı kurulamadı' }, { status: 500 });
    }

    let query = supabase
      .from('blog_comments')
      .select(`
        *,
        user:user_id (
          id,
          email,
          raw_user_meta_data
        ),
        reactions:comment_reactions (
          id,
          user_id,
          reaction_type
        )
      `)
      .eq('blog_id', blogId)
      .order('created_at', { ascending: true });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else {
      query = query.is('parent_id', null); // Sadece ana yorumlar
    }

    const { data: comments, error } = await query;

    if (error) {
      console.error('Comments fetch error:', error);
      return NextResponse.json({ error: 'Yorumlar alınamadı' }, { status: 500 });
    }

    // Yanıt yorumlarını da getir
    if (!parentId) {
      const { data: replies } = await supabase
        .from('blog_comments')
        .select(`
          *,
          user:user_id (
            id,
            email,
            raw_user_meta_data
          ),
          reactions:comment_reactions (
            id,
            user_id,
            reaction_type
          )
        `)
        .eq('blog_id', blogId)
        .eq('status', 'approved')
        .not('parent_id', 'is', null)
        .order('created_at', { ascending: true });

      // Ana yorumlara yanıtları ekle
      const commentsWithReplies = comments?.map(comment => ({
        ...comment,
        replies: replies?.filter(reply => reply.parent_id === comment.id) || []
      })) || [];

      return NextResponse.json(commentsWithReplies);
    }

    return NextResponse.json(comments || []);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Yeni yorum oluştur
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blog_id, content, parent_id, author_name, author_email } = body;

    if (!blog_id || !content || !author_name) {
      return NextResponse.json({ 
        error: 'Blog ID, içerik ve yazar adı zorunludur' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı kurulamadı' }, { status: 500 });
    }

    // Rate limiting kontrolü
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    const { data: rateLimit } = await supabase
      .from('comment_rate_limits')
      .select('*')
      .eq('ip_address', clientIP)
      .single();

    const now = new Date();
    const timeWindow = 60 * 60 * 1000; // 1 saat

    if (rateLimit) {
      const timeDiff = now.getTime() - new Date(rateLimit.last_comment_at).getTime();
      
      if (timeDiff < timeWindow && rateLimit.comment_count >= 5) {
        return NextResponse.json({ 
          error: 'Çok fazla yorum gönderiyorsunuz. Lütfen 1 saat bekleyin.' 
        }, { status: 429 });
      }

      // Rate limit güncelle
      await supabase
        .from('comment_rate_limits')
        .update({
          comment_count: rateLimit.comment_count + 1,
          last_comment_at: now.toISOString()
        })
        .eq('id', rateLimit.id);
    } else {
      // Yeni rate limit kaydı oluştur
      await supabase
        .from('comment_rate_limits')
        .insert([{
          ip_address: clientIP,
          comment_count: 1,
          last_comment_at: now.toISOString()
        }]);
    }

    // Spam kontrolü (basit)
    const spamKeywords = ['casino', 'viagra', 'loan', 'credit', 'make money fast'];
    const isSpam = spamKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );

    const newComment = {
      blog_id,
      content,
      parent_id: parent_id || null,
      author_name,
      author_email: author_email || null,
      status: isSpam ? 'spam' : 'pending',
      ip_address: clientIP,
      user_agent: request.headers.get('user-agent') || null,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    const { data, error } = await supabase
      .from('blog_comments')
      .insert([newComment])
      .select()
      .single();

    if (error) {
      console.error('Comment creation error:', error);
      return NextResponse.json({ error: 'Yorum oluşturulamadı' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: isSpam ? 'Yorum spam olarak işaretlendi' : 'Yorumınız onay için gönderildi',
      comment: data
    });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Yorum güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Yorum ID gerekli' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı kurulamadı' }, { status: 500 });
    }

    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Eğer yorum onaylanıyorsa, onay zamanını ekle
    if (updates.status === 'approved') {
      updateData.approved_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_comments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Comment update error:', error);
      return NextResponse.json({ error: 'Yorum güncellenemedi' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Yorum başarıyla güncellendi',
      comment: data
    });
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Yorum sil
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Yorum ID gerekli' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı kurulamadı' }, { status: 500 });
    }

    const { error } = await supabase
      .from('blog_comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Comment delete error:', error);
      return NextResponse.json({ error: 'Yorum silinemedi' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Yorum başarıyla silindi'
    });
  } catch (error) {
    console.error('DELETE Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
