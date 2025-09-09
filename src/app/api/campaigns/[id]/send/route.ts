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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id;

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    // Kampanyayı getir
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      console.error('Campaign fetch error:', campaignError);
      return NextResponse.json({ 
        success: false, 
        error: 'Kampanya bulunamadı' 
      }, { status: 404 });
    }

    if (campaign.status !== 'draft') {
      return NextResponse.json({ 
        success: false, 
        error: 'Bu kampanya zaten gönderilmiş' 
      }, { status: 400 });
    }

    // Hedef kullanıcıları getir
    let usersQuery = supabase.from('users').select('id, email, first_name, last_name');
    
    switch (campaign.target_audience) {
      case 'newsletter':
        usersQuery = usersQuery.eq('newsletter_subscription', true);
        break;
      case 'active':
        usersQuery = usersQuery.eq('is_active', true);
        break;
      case 'inactive':
        usersQuery = usersQuery.eq('is_active', false);
        break;
      // 'all' için filtre uygulanmaz
    }

    const { data: users, error: usersError } = await usersQuery;

    if (usersError) {
      console.error('Users fetch error:', usersError);
      return NextResponse.json({ 
        success: false, 
        error: 'Kullanıcı verileri alınamadı' 
      }, { status: 500 });
    }

    // Kampanya durumunu güncelle
    const { data: updatedCampaign, error: updateError } = await supabase
      .from('campaigns')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        recipients_count: users?.length || 0
      })
      .eq('id', campaignId)
      .select()
      .single();

    if (updateError) {
      console.error('Campaign update error:', updateError);
      return NextResponse.json({ 
        success: false, 
        error: 'Kampanya durumu güncellenemedi' 
      }, { status: 500 });
    }

    // E-posta gönderimi simülasyonu
    // Gerçek uygulamada burada e-posta servisi (SendGrid, Mailgun, vb.) kullanılır
    console.log(`Campaign "${campaign.name}" sent to ${users?.length || 0} users`);

    return NextResponse.json({
      success: true,
      campaign: updatedCampaign,
      recipients_count: users?.length || 0
    });

  } catch (error) {
    console.error('Send campaign API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
