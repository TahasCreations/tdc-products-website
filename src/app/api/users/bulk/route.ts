import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase environment variables are missing');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, user_ids } = body;

    if (!action || !user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Geçersiz parametreler' 
      }, { status: 400 });
    }

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    let updateData: any = {};
    let errorMessage = '';

    switch (action) {
      case 'activate':
        updateData = { is_active: true };
        errorMessage = 'Kullanıcılar aktifleştirilemedi';
        break;
      case 'deactivate':
        updateData = { is_active: false };
        errorMessage = 'Kullanıcılar pasifleştirilemedi';
        break;
      case 'delete':
        // Kullanıcıları sil
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .in('id', user_ids);

        if (deleteError) {
          console.error('Bulk delete error:', deleteError);
          return NextResponse.json({ 
            success: false, 
            error: 'Kullanıcılar silinemedi' 
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: `${user_ids.length} kullanıcı başarıyla silindi`
        });
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Geçersiz işlem' 
        }, { status: 400 });
    }

    // Güncelleme işlemi
    const { error } = await supabase
      .from('users')
      .update(updateData)
      .in('id', user_ids);

    if (error) {
      console.error('Bulk update error:', error);
      return NextResponse.json({ 
        success: false, 
        error: errorMessage 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${user_ids.length} kullanıcı için işlem başarıyla tamamlandı`
    });

  } catch (error) {
    console.error('Bulk actions API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
