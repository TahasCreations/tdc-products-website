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

// Pazarlama & SEO verilerini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const supabase = createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Veritabanı bağlantısı kurulamadı' 
      }, { status: 500 });
    }

    if (type === 'dashboard') {
      // Pazarlama Dashboard verileri
      const { data: socialAccounts, error: socialError } = await supabase
        .from('social_media_accounts')
        .select('followers_count, platform')
        .eq('is_active', true);

      if (socialError) {
        console.error('Social accounts fetch error:', socialError);
      }

      const { data: keywords, error: keywordsError } = await supabase
        .from('keywords')
        .select('is_targeted, current_ranking, target_ranking')
        .eq('is_targeted', true);

      if (keywordsError) {
        console.error('Keywords fetch error:', keywordsError);
      }

      const { data: campaigns, error: campaignsError } = await supabase
        .from('email_campaigns')
        .select('status, open_rate, click_rate')
        .eq('status', 'sent');

      if (campaignsError) {
        console.error('Campaigns fetch error:', campaignsError);
      }

      // İstatistikler
      const totalFollowers = socialAccounts?.reduce((sum, account) => sum + account.followers_count, 0) || 0;
      const targetedKeywords = keywords?.length || 0;
      const avgRanking = keywords?.length > 0 ? 
        keywords.reduce((sum, kw) => sum + (kw.current_ranking || 0), 0) / keywords.length : 0;
      const avgOpenRate = campaigns?.length > 0 ?
        campaigns.reduce((sum, camp) => sum + (camp.open_rate || 0), 0) / campaigns.length : 0;

      return NextResponse.json({
        success: true,
        data: {
          totalFollowers,
          targetedKeywords,
          avgRanking: Math.round(avgRanking),
          avgOpenRate: Math.round(avgOpenRate * 100) / 100
        }
      });
    }

    if (type === 'seo_settings') {
      // SEO ayarlarını getir
      const { data: seoSettings, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('SEO settings fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'SEO ayarları alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        seoSettings: seoSettings || []
      });
    }

    if (type === 'keywords') {
      // Anahtar kelimeleri getir
      const { data: keywords, error } = await supabase
        .from('keywords')
        .select('*')
        .order('search_volume', { ascending: false });

      if (error) {
        console.error('Keywords fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Anahtar kelimeler alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        keywords: keywords || []
      });
    }

    if (type === 'backlinks') {
      // Backlink'leri getir
      const { data: backlinks, error } = await supabase
        .from('backlinks')
        .select('*')
        .order('discovered_date', { ascending: false });

      if (error) {
        console.error('Backlinks fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Backlink\'ler alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        backlinks: backlinks || []
      });
    }

    if (type === 'social_accounts') {
      // Sosyal medya hesaplarını getir
      const { data: accounts, error } = await supabase
        .from('social_media_accounts')
        .select('*')
        .eq('is_active', true)
        .order('followers_count', { ascending: false });

      if (error) {
        console.error('Social accounts fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Sosyal medya hesapları alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        accounts: accounts || []
      });
    }

    if (type === 'social_posts') {
      // Sosyal medya gönderilerini getir
      const { data: posts, error } = await supabase
        .from('social_media_posts')
        .select(`
          *,
          account:account_id (
            username,
            platform
          )
        `)
        .order('published_date', { ascending: false });

      if (error) {
        console.error('Social posts fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Sosyal medya gönderileri alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        posts: posts || []
      });
    }

    if (type === 'email_campaigns') {
      // E-posta kampanyalarını getir
      const { data: campaigns, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Email campaigns fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'E-posta kampanyaları alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        campaigns: campaigns || []
      });
    }

    if (type === 'email_templates') {
      // E-posta şablonlarını getir
      const { data: templates, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Email templates fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'E-posta şablonları alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        templates: templates || []
      });
    }

    if (type === 'analytics') {
      // Analytics verilerini getir
      const { data: analytics, error } = await supabase
        .from('analytics_data')
        .select('*')
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) {
        console.error('Analytics fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Analytics verileri alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        analytics: analytics || []
      });
    }

    if (type === 'ab_tests') {
      // A/B testlerini getir
      const { data: tests, error } = await supabase
        .from('ab_tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('A/B tests fetch error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'A/B testleri alınamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        tests: tests || []
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz tip parametresi' 
    }, { status: 400 });

  } catch (error) {
    console.error('Marketing API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}

// Pazarlama & SEO işlemleri
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

    if (action === 'create_seo_setting') {
      const {
        page_type,
        page_id,
        title,
        meta_description,
        meta_keywords,
        og_title,
        og_description,
        og_image,
        canonical_url,
        robots_meta,
        schema_markup
      } = data;

      const { data: newSeoSetting, error } = await supabase
        .from('seo_settings')
        .insert({
          page_type,
          page_id,
          title,
          meta_description,
          meta_keywords,
          og_title,
          og_description,
          og_image,
          canonical_url,
          robots_meta,
          schema_markup
        })
        .select()
        .single();

      if (error) {
        console.error('Create SEO setting error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'SEO ayarı oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        seoSetting: newSeoSetting
      });
    }

    if (action === 'create_keyword') {
      const {
        keyword,
        search_volume,
        difficulty_score,
        cpc,
        competition,
        trend,
        related_keywords,
        is_targeted,
        target_page_id,
        target_page_type,
        current_ranking,
        target_ranking,
        notes
      } = data;

      const { data: newKeyword, error } = await supabase
        .from('keywords')
        .insert({
          keyword,
          search_volume: search_volume ? parseInt(search_volume) : null,
          difficulty_score: difficulty_score ? parseInt(difficulty_score) : null,
          cpc: cpc ? parseFloat(cpc) : null,
          competition,
          trend,
          related_keywords,
          is_targeted: is_targeted || false,
          target_page_id,
          target_page_type,
          current_ranking: current_ranking ? parseInt(current_ranking) : null,
          target_ranking: target_ranking ? parseInt(target_ranking) : null,
          notes
        })
        .select()
        .single();

      if (error) {
        console.error('Create keyword error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Anahtar kelime oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        keyword: newKeyword
      });
    }

    if (action === 'create_social_account') {
      const {
        platform,
        username,
        display_name,
        profile_url,
        followers_count,
        following_count,
        posts_count,
        engagement_rate
      } = data;

      const { data: newAccount, error } = await supabase
        .from('social_media_accounts')
        .insert({
          platform,
          username,
          display_name,
          profile_url,
          followers_count: followers_count ? parseInt(followers_count) : 0,
          following_count: following_count ? parseInt(following_count) : 0,
          posts_count: posts_count ? parseInt(posts_count) : 0,
          engagement_rate: engagement_rate ? parseFloat(engagement_rate) : null
        })
        .select()
        .single();

      if (error) {
        console.error('Create social account error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Sosyal medya hesabı oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        account: newAccount
      });
    }

    if (action === 'create_social_post') {
      const {
        account_id,
        platform,
        content,
        media_urls,
        post_type,
        scheduled_date,
        hashtags,
        mentions
      } = data;

      const { data: newPost, error } = await supabase
        .from('social_media_posts')
        .insert({
          account_id,
          platform,
          content,
          media_urls,
          post_type: post_type || 'text',
          scheduled_date,
          hashtags,
          mentions
        })
        .select()
        .single();

      if (error) {
        console.error('Create social post error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'Sosyal medya gönderisi oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        post: newPost
      });
    }

    if (action === 'create_email_campaign') {
      const {
        name,
        subject,
        from_name,
        from_email,
        template_id,
        content,
        target_audience,
        send_date,
        created_by
      } = data;

      const { data: newCampaign, error } = await supabase
        .from('email_campaigns')
        .insert({
          name,
          subject,
          from_name,
          from_email,
          template_id,
          content,
          target_audience,
          send_date,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create email campaign error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'E-posta kampanyası oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        campaign: newCampaign
      });
    }

    if (action === 'create_email_template') {
      const {
        name,
        subject,
        html_content,
        text_content,
        template_type,
        variables,
        created_by
      } = data;

      const { data: newTemplate, error } = await supabase
        .from('email_templates')
        .insert({
          name,
          subject,
          html_content,
          text_content,
          template_type,
          variables,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create email template error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'E-posta şablonu oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        template: newTemplate
      });
    }

    if (action === 'create_ab_test') {
      const {
        name,
        description,
        test_type,
        target_element,
        original_version,
        variant_version,
        traffic_split,
        start_date,
        end_date,
        primary_metric,
        created_by
      } = data;

      const { data: newTest, error } = await supabase
        .from('ab_tests')
        .insert({
          name,
          description,
          test_type,
          target_element,
          original_version,
          variant_version,
          traffic_split: traffic_split ? parseFloat(traffic_split) : 50.0,
          start_date,
          end_date,
          primary_metric,
          created_by
        })
        .select()
        .single();

      if (error) {
        console.error('Create A/B test error:', error);
        return NextResponse.json({ 
          success: false, 
          error: 'A/B testi oluşturulamadı' 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        test: newTest
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Geçersiz işlem' 
    }, { status: 400 });

  } catch (error) {
    console.error('Marketing POST API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Sunucu hatası' 
    }, { status: 500 });
  }
}
