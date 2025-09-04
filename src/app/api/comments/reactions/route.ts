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

// Beğeni ekle/çıkar
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { comment_id, reaction_type, user_id } = body;

    if (!comment_id || !reaction_type || !user_id) {
      return NextResponse.json({ 
        error: 'Yorum ID, beğeni türü ve kullanıcı ID zorunludur' 
      }, { status: 400 });
    }

    if (!['like', 'dislike'].includes(reaction_type)) {
      return NextResponse.json({ 
        error: 'Geçersiz beğeni türü' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı kurulamadı' }, { status: 500 });
    }

    // Mevcut beğeniyi kontrol et
    const { data: existingReaction } = await supabase
      .from('comment_reactions')
      .select('*')
      .eq('comment_id', comment_id)
      .eq('user_id', user_id)
      .single();

    if (existingReaction) {
      if (existingReaction.reaction_type === reaction_type) {
        // Aynı beğeni varsa kaldır
        const { error } = await supabase
          .from('comment_reactions')
          .delete()
          .eq('id', existingReaction.id);

        if (error) {
          console.error('Reaction delete error:', error);
          return NextResponse.json({ error: 'Beğeni kaldırılamadı' }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: 'Beğeni kaldırıldı',
          action: 'removed'
        });
      } else {
        // Farklı beğeni varsa güncelle
        const { error } = await supabase
          .from('comment_reactions')
          .update({ reaction_type })
          .eq('id', existingReaction.id);

        if (error) {
          console.error('Reaction update error:', error);
          return NextResponse.json({ error: 'Beğeni güncellenemedi' }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: 'Beğeni güncellendi',
          action: 'updated'
        });
      }
    } else {
      // Yeni beğeni ekle
      const { error } = await supabase
        .from('comment_reactions')
        .insert([{
          comment_id,
          user_id,
          reaction_type
        }]);

      if (error) {
        console.error('Reaction insert error:', error);
        return NextResponse.json({ error: 'Beğeni eklenemedi' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Beğeni eklendi',
        action: 'added'
      });
    }
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Kullanıcının beğenilerini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Veritabanı bağlantısı kurulamadı' }, { status: 500 });
    }

    const { data: reactions, error } = await supabase
      .from('comment_reactions')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Reactions fetch error:', error);
      return NextResponse.json({ error: 'Beğeniler alınamadı' }, { status: 500 });
    }

    return NextResponse.json(reactions || []);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
