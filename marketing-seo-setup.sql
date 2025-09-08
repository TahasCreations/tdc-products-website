-- Pazarlama & SEO Optimizasyonu Sistemi
-- Bu script pazarlama ve SEO yönetimi için gerekli tabloları oluşturur

-- SEO Ayarları tablosu
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type VARCHAR(50) NOT NULL, -- 'home', 'product', 'category', 'blog', 'custom'
  page_id UUID, -- İlgili sayfa ID'si (ürün, kategori, blog vb.)
  title VARCHAR(255) NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title VARCHAR(255), -- Open Graph title
  og_description TEXT, -- Open Graph description
  og_image VARCHAR(255), -- Open Graph image URL
  canonical_url VARCHAR(255), -- Canonical URL
  robots_meta VARCHAR(100), -- robots meta tag
  schema_markup JSONB, -- JSON-LD structured data
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Anahtar Kelimeler tablosu
CREATE TABLE IF NOT EXISTS keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  search_volume INTEGER, -- Aylık arama hacmi
  difficulty_score INTEGER CHECK (difficulty_score >= 1 AND difficulty_score <= 100), -- Zorluk skoru
  cpc DECIMAL(8,2), -- Cost per click
  competition VARCHAR(20) CHECK (competition IN ('low', 'medium', 'high')),
  trend VARCHAR(20) CHECK (trend IN ('rising', 'stable', 'declining')),
  related_keywords TEXT[], -- İlgili anahtar kelimeler
  is_targeted BOOLEAN DEFAULT false, -- Hedeflenen anahtar kelime mi?
  target_page_id UUID, -- Hedef sayfa ID'si
  target_page_type VARCHAR(50), -- Hedef sayfa tipi
  current_ranking INTEGER, -- Mevcut sıralama
  target_ranking INTEGER, -- Hedef sıralama
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Backlink'ler tablosu
CREATE TABLE IF NOT EXISTS backlinks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_url VARCHAR(500) NOT NULL, -- Kaynak URL
  target_url VARCHAR(500) NOT NULL, -- Hedef URL
  anchor_text VARCHAR(255), -- Anchor text
  link_type VARCHAR(20) CHECK (link_type IN ('dofollow', 'nofollow', 'sponsored', 'ugc')),
  domain_authority INTEGER, -- Domain authority skoru
  page_authority INTEGER, -- Page authority skoru
  traffic_volume INTEGER, -- Trafik hacmi
  is_lost BOOLEAN DEFAULT false, -- Kaybedilen link mi?
  discovered_date DATE, -- Keşfedilme tarihi
  last_checked_date DATE, -- Son kontrol tarihi
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sosyal Medya Hesapları tablosu
CREATE TABLE IF NOT EXISTS social_media_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform VARCHAR(50) NOT NULL, -- 'facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'
  username VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  profile_url VARCHAR(500),
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2), -- Etkileşim oranı
  is_active BOOLEAN DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sosyal Medya Gönderileri tablosu
CREATE TABLE IF NOT EXISTS social_media_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES social_media_accounts(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  post_id VARCHAR(255), -- Platform'daki post ID'si
  content TEXT NOT NULL,
  media_urls TEXT[], -- Medya URL'leri
  post_type VARCHAR(20) CHECK (post_type IN ('text', 'image', 'video', 'carousel', 'story', 'reel')),
  scheduled_date TIMESTAMP WITH TIME ZONE, -- Planlanan yayın tarihi
  published_date TIMESTAMP WITH TIME ZONE, -- Yayın tarihi
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0, -- Erişim sayısı
  impressions INTEGER DEFAULT 0, -- Görüntülenme sayısı
  engagement_rate DECIMAL(5,2), -- Etkileşim oranı
  hashtags TEXT[], -- Hashtag'ler
  mentions TEXT[], -- Mention'lar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-posta Kampanyaları tablosu
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  from_name VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  template_id UUID, -- E-posta şablonu ID'si
  content TEXT, -- E-posta içeriği
  target_audience JSONB, -- Hedef kitle kriterleri
  send_date TIMESTAMP WITH TIME ZONE, -- Gönderim tarihi
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  total_recipients INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2), -- Açılma oranı
  click_rate DECIMAL(5,2), -- Tıklama oranı
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-posta Şablonları tablosu
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT, -- Plain text versiyonu
  template_type VARCHAR(50), -- 'newsletter', 'promotional', 'transactional', 'welcome'
  variables JSONB, -- Kullanılabilir değişkenler
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Google Analytics Verileri tablosu
CREATE TABLE IF NOT EXISTS analytics_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  metric_type VARCHAR(50) NOT NULL, -- 'pageviews', 'sessions', 'users', 'bounce_rate', 'avg_session_duration'
  value DECIMAL(12,2) NOT NULL,
  page_path VARCHAR(500), -- Sayfa yolu
  source VARCHAR(100), -- Trafik kaynağı
  medium VARCHAR(100), -- Trafik ortamı
  campaign VARCHAR(100), -- Kampanya adı
  device_category VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
  country VARCHAR(100), -- Ülke
  city VARCHAR(100), -- Şehir
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B Testleri tablosu
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  test_type VARCHAR(50) NOT NULL, -- 'page', 'element', 'email', 'ad'
  target_element VARCHAR(255), -- Test edilen element
  original_version TEXT, -- Orijinal versiyon
  variant_version TEXT, -- Varyant versiyon
  traffic_split DECIMAL(5,2) DEFAULT 50.00, -- Trafik dağılımı (%)
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'paused')),
  primary_metric VARCHAR(100), -- Ana metrik (conversion_rate, click_rate, etc.)
  original_conversions INTEGER DEFAULT 0,
  variant_conversions INTEGER DEFAULT 0,
  original_traffic INTEGER DEFAULT 0,
  variant_traffic INTEGER DEFAULT 0,
  confidence_level DECIMAL(5,2), -- Güven seviyesi
  is_significant BOOLEAN, -- Sonuç anlamlı mı?
  winner VARCHAR(20) CHECK (winner IN ('original', 'variant', 'inconclusive')),
  notes TEXT,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_seo_settings_page_type ON seo_settings(page_type);
CREATE INDEX IF NOT EXISTS idx_seo_settings_page_id ON seo_settings(page_id);
CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_keywords_is_targeted ON keywords(is_targeted);
CREATE INDEX IF NOT EXISTS idx_backlinks_source_url ON backlinks(source_url);
CREATE INDEX IF NOT EXISTS idx_backlinks_target_url ON backlinks(target_url);
CREATE INDEX IF NOT EXISTS idx_backlinks_is_lost ON backlinks(is_lost);
CREATE INDEX IF NOT EXISTS idx_social_media_accounts_platform ON social_media_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_account_id ON social_media_posts(account_id);
CREATE INDEX IF NOT EXISTS idx_social_media_posts_published_date ON social_media_posts(published_date);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_email_campaigns_send_date ON email_campaigns(send_date);
CREATE INDEX IF NOT EXISTS idx_analytics_data_date ON analytics_data(date);
CREATE INDEX IF NOT EXISTS idx_analytics_data_metric_type ON analytics_data(metric_type);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_start_date ON ab_tests(start_date);

-- RLS (Row Level Security) etkinleştir
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

-- Policy'ler (Admin kullanıcıları tüm pazarlama verilerine erişebilir)
CREATE POLICY "Admin users can manage seo_settings" ON seo_settings FOR ALL USING (true);
CREATE POLICY "Admin users can manage keywords" ON keywords FOR ALL USING (true);
CREATE POLICY "Admin users can manage backlinks" ON backlinks FOR ALL USING (true);
CREATE POLICY "Admin users can manage social_media_accounts" ON social_media_accounts FOR ALL USING (true);
CREATE POLICY "Admin users can manage social_media_posts" ON social_media_posts FOR ALL USING (true);
CREATE POLICY "Admin users can manage email_campaigns" ON email_campaigns FOR ALL USING (true);
CREATE POLICY "Admin users can manage email_templates" ON email_templates FOR ALL USING (true);
CREATE POLICY "Admin users can manage analytics_data" ON analytics_data FOR ALL USING (true);
CREATE POLICY "Admin users can manage ab_tests" ON ab_tests FOR ALL USING (true);

-- Trigger'lar için fonksiyon
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- A/B test sonuçlarını hesaplama fonksiyonu
CREATE OR REPLACE FUNCTION calculate_ab_test_results()
RETURNS TRIGGER AS $$
DECLARE
    original_rate DECIMAL(5,2);
    variant_rate DECIMAL(5,2);
    confidence DECIMAL(5,2);
BEGIN
    -- Conversion rate'leri hesapla
    IF NEW.original_traffic > 0 THEN
        original_rate = (NEW.original_conversions::DECIMAL / NEW.original_traffic) * 100;
    ELSE
        original_rate = 0;
    END IF;
    
    IF NEW.variant_traffic > 0 THEN
        variant_rate = (NEW.variant_conversions::DECIMAL / NEW.variant_traffic) * 100;
    ELSE
        variant_rate = 0;
    END IF;
    
    -- Basit güven seviyesi hesaplama (gerçek uygulamada daha karmaşık istatistiksel testler kullanılmalı)
    IF NEW.original_traffic > 100 AND NEW.variant_traffic > 100 THEN
        confidence = 95.0; -- Örnek değer
    ELSE
        confidence = 0;
    END IF;
    
    NEW.confidence_level = confidence;
    
    -- Anlamlılık kontrolü
    IF confidence >= 95.0 AND ABS(original_rate - variant_rate) > 5.0 THEN
        NEW.is_significant = true;
        
        -- Kazananı belirle
        IF variant_rate > original_rate THEN
            NEW.winner = 'variant';
        ELSE
            NEW.winner = 'original';
        END IF;
    ELSE
        NEW.is_significant = false;
        NEW.winner = 'inconclusive';
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ları oluştur
DROP TRIGGER IF EXISTS update_seo_settings_updated_at ON seo_settings;
CREATE TRIGGER update_seo_settings_updated_at 
  BEFORE UPDATE ON seo_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_keywords_updated_at ON keywords;
CREATE TRIGGER update_keywords_updated_at 
  BEFORE UPDATE ON keywords 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_backlinks_updated_at ON backlinks;
CREATE TRIGGER update_backlinks_updated_at 
  BEFORE UPDATE ON backlinks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_social_media_posts_updated_at ON social_media_posts;
CREATE TRIGGER update_social_media_posts_updated_at 
  BEFORE UPDATE ON social_media_posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_campaigns_updated_at ON email_campaigns;
CREATE TRIGGER update_email_campaigns_updated_at 
  BEFORE UPDATE ON email_campaigns 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_templates_updated_at ON email_templates;
CREATE TRIGGER update_email_templates_updated_at 
  BEFORE UPDATE ON email_templates 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ab_tests_updated_at ON ab_tests;
CREATE TRIGGER update_ab_tests_updated_at 
  BEFORE UPDATE ON ab_tests 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS calculate_ab_test_results_trigger ON ab_tests;
CREATE TRIGGER calculate_ab_test_results_trigger 
  BEFORE UPDATE ON ab_tests 
  FOR EACH ROW 
  EXECUTE FUNCTION calculate_ab_test_results();

-- Örnek veriler
INSERT INTO social_media_accounts (platform, username, display_name, followers_count) VALUES
('facebook', 'tdcproducts', 'TDC Products', 1500),
('instagram', 'tdcproducts', 'TDC Products', 2500),
('twitter', 'tdcproducts', 'TDC Products', 800),
('linkedin', 'tdc-products', 'TDC Products', 1200),
('youtube', 'tdcproducts', 'TDC Products', 500)
ON CONFLICT DO NOTHING;

INSERT INTO email_templates (name, subject, html_content, template_type) VALUES
('Hoş Geldin E-postası', 'TDC Products''a Hoş Geldiniz!', 
 '<html><body><h1>Hoş Geldiniz!</h1><p>Bizi tercih ettiğiniz için teşekkürler.</p></body></html>', 
 'welcome'),
('Haftalık Bülten', 'Bu Haftanın En İyi Ürünleri', 
 '<html><body><h1>Haftalık Bülten</h1><p>Bu haftanın öne çıkan ürünleri...</p></body></html>', 
 'newsletter'),
('Promosyon E-postası', 'Özel İndirim Fırsatı!', 
 '<html><body><h1>Özel İndirim</h1><p>%20 indirim fırsatı...</p></body></html>', 
 'promotional')
ON CONFLICT DO NOTHING;

INSERT INTO keywords (keyword, search_volume, difficulty_score, competition, is_targeted) VALUES
('mobilya', 12000, 65, 'high', true),
('ev dekorasyonu', 8500, 55, 'medium', true),
('modern mobilya', 3200, 45, 'medium', true),
('ahşap mobilya', 2800, 50, 'medium', false),
('ofis mobilyası', 1500, 40, 'low', false)
ON CONFLICT DO NOTHING;
