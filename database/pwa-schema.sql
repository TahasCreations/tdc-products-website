-- PWA (Progressive Web App) Veritabanı Şeması
-- Milyon lira değerinde e-ticaret platformu için

-- PWA analitik tablosu
CREATE TABLE IF NOT EXISTS pwa_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    event_type VARCHAR(50) NOT NULL, -- 'install', 'page_view', 'push_subscribe', 'offline_usage', 'page_load'
    event_data JSONB,
    metadata JSONB, -- loadTime, userAgent, screenSize, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Push bildirim abonelikleri
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bildirim kampanyaları
CREATE TABLE IF NOT EXISTS notification_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    target_audience VARCHAR(50) NOT NULL, -- 'all', 'active_users', 'premium_users', 'specific'
    target_users UUID[], -- Specific user IDs if target_audience is 'specific'
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'failed'
    sent_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    open_rate DECIMAL(5,2) DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bildirim gönderim logları
CREATE TABLE IF NOT EXISTS notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES notification_campaigns(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES push_subscriptions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL, -- 'sent', 'delivered', 'opened', 'clicked', 'failed'
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE
);

-- PWA yükleme istatistikleri
CREATE TABLE IF NOT EXISTS pwa_installs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    install_source VARCHAR(50), -- 'browser_prompt', 'manual', 'share'
    user_agent TEXT,
    device_type VARCHAR(20), -- 'mobile', 'tablet', 'desktop'
    platform VARCHAR(20), -- 'android', 'ios', 'windows', 'macos', 'linux'
    browser VARCHAR(50),
    install_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uninstall_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Offline kullanım logları
CREATE TABLE IF NOT EXISTS offline_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    offline_duration INTEGER, -- seconds
    actions_performed JSONB, -- List of actions performed offline
    sync_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'synced', 'failed'
    synced_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cache performans metrikleri
CREATE TABLE IF NOT EXISTS cache_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_name VARCHAR(50) NOT NULL,
    hit_count INTEGER DEFAULT 0,
    miss_count INTEGER DEFAULT 0,
    hit_rate DECIMAL(5,2) DEFAULT 0,
    total_size BIGINT DEFAULT 0, -- bytes
    entry_count INTEGER DEFAULT 0,
    last_cleared_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PWA ayarları
CREATE TABLE IF NOT EXISTS pwa_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- App Store dağıtım bilgileri
CREATE TABLE IF NOT EXISTS app_store_distributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(20) NOT NULL, -- 'play_store', 'app_store', 'microsoft_store'
    app_id VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'submitted', 'review', 'approved', 'rejected'
    submission_date TIMESTAMP WITH TIME ZONE,
    approval_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    download_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_pwa_analytics_user_id ON pwa_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_pwa_analytics_event_type ON pwa_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_pwa_analytics_created_at ON pwa_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_pwa_analytics_session_id ON pwa_analytics(session_id);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

CREATE INDEX IF NOT EXISTS idx_notification_campaigns_status ON notification_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_scheduled_at ON notification_campaigns(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_notification_campaigns_created_at ON notification_campaigns(created_at);

CREATE INDEX IF NOT EXISTS idx_notification_logs_campaign_id ON notification_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_notification_logs_sent_at ON notification_logs(sent_at);

CREATE INDEX IF NOT EXISTS idx_pwa_installs_user_id ON pwa_installs(user_id);
CREATE INDEX IF NOT EXISTS idx_pwa_installs_platform ON pwa_installs(platform);
CREATE INDEX IF NOT EXISTS idx_pwa_installs_install_date ON pwa_installs(install_date);
CREATE INDEX IF NOT EXISTS idx_pwa_installs_is_active ON pwa_installs(is_active);

CREATE INDEX IF NOT EXISTS idx_offline_usage_logs_user_id ON offline_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_offline_usage_logs_sync_status ON offline_usage_logs(sync_status);
CREATE INDEX IF NOT EXISTS idx_offline_usage_logs_created_at ON offline_usage_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_cache_performance_cache_name ON cache_performance(cache_name);
CREATE INDEX IF NOT EXISTS idx_cache_performance_updated_at ON cache_performance(updated_at);

CREATE INDEX IF NOT EXISTS idx_pwa_settings_setting_key ON pwa_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_pwa_settings_is_public ON pwa_settings(is_public);

CREATE INDEX IF NOT EXISTS idx_app_store_distributions_platform ON app_store_distributions(platform);
CREATE INDEX IF NOT EXISTS idx_app_store_distributions_status ON app_store_distributions(status);

-- Trigger'lar
CREATE OR REPLACE FUNCTION update_pwa_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_push_subscriptions_updated_at
    BEFORE UPDATE ON push_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_pwa_updated_at();

CREATE TRIGGER update_notification_campaigns_updated_at
    BEFORE UPDATE ON notification_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_pwa_updated_at();

CREATE TRIGGER update_cache_performance_updated_at
    BEFORE UPDATE ON cache_performance
    FOR EACH ROW
    EXECUTE FUNCTION update_pwa_updated_at();

CREATE TRIGGER update_pwa_settings_updated_at
    BEFORE UPDATE ON pwa_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_pwa_updated_at();

CREATE TRIGGER update_app_store_distributions_updated_at
    BEFORE UPDATE ON app_store_distributions
    FOR EACH ROW
    EXECUTE FUNCTION update_pwa_updated_at();

-- Bildirim kampanyası istatistiklerini güncelleme
CREATE OR REPLACE FUNCTION update_campaign_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'opened' AND OLD.status != 'opened' THEN
        UPDATE notification_campaigns 
        SET open_count = open_count + 1,
            open_rate = CASE 
                WHEN sent_count > 0 THEN (open_count + 1)::DECIMAL / sent_count * 100
                ELSE 0
            END
        WHERE id = NEW.campaign_id;
    END IF;
    
    IF NEW.status = 'clicked' AND OLD.status != 'clicked' THEN
        UPDATE notification_campaigns 
        SET click_count = click_count + 1,
            click_rate = CASE 
                WHEN sent_count > 0 THEN (click_count + 1)::DECIMAL / sent_count * 100
                ELSE 0
            END
        WHERE id = NEW.campaign_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaign_stats_trigger
    AFTER UPDATE ON notification_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_campaign_stats();

-- Varsayılan PWA ayarları
INSERT INTO pwa_settings (setting_key, setting_value, description, is_public) VALUES
('pwa_enabled', 'true', 'PWA özelliklerinin etkin olup olmadığı', true),
('push_notifications_enabled', 'true', 'Push bildirimlerinin etkin olup olmadığı', true),
('offline_support_enabled', 'true', 'Offline desteğinin etkin olup olmadığı', true),
('cache_duration_days', '30', 'Cache süresi (gün)', false),
('max_cache_size_mb', '100', 'Maksimum cache boyutu (MB)', false),
('auto_update_enabled', 'true', 'Otomatik güncellemelerin etkin olup olmadığı', true),
('background_sync_enabled', 'true', 'Arka plan senkronizasyonunun etkin olup olmadığı', false),
('install_prompt_enabled', 'true', 'Yükleme isteminin etkin olup olmadığı', true),
('share_target_enabled', 'true', 'Paylaşım hedefinin etkin olup olmadığı', true),
('file_handler_enabled', 'true', 'Dosya işleyicisinin etkin olup olmadığı', true);

-- Varsayılan cache performans kayıtları
INSERT INTO cache_performance (cache_name, hit_count, miss_count, hit_rate, total_size, entry_count) VALUES
('tdc-static-v2.0.0', 0, 0, 0, 0, 0),
('tdc-dynamic-v2.0.0', 0, 0, 0, 0, 0),
('tdc-api-v2.0.0', 0, 0, 0, 0, 0),
('tdc-images-v2.0.0', 0, 0, 0, 0, 0);

-- RLS (Row Level Security) politikaları
ALTER TABLE pwa_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pwa_installs ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_usage_logs ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi verilerini görebilir
CREATE POLICY "Users can view own PWA data" ON pwa_analytics
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own push subscriptions" ON push_subscriptions
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view own installs" ON pwa_installs
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view own offline usage" ON offline_usage_logs
    FOR ALL USING (user_id = auth.uid());

-- Admin'ler tüm verileri görebilir
CREATE POLICY "Admins can view all PWA data" ON pwa_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can view all push subscriptions" ON push_subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can view all notification campaigns" ON notification_campaigns
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

-- View'lar
CREATE VIEW pwa_daily_stats AS
SELECT 
    DATE(created_at) as date,
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions
FROM pwa_analytics
GROUP BY DATE(created_at), event_type
ORDER BY date DESC, event_type;

CREATE VIEW notification_campaign_summary AS
SELECT 
    nc.id,
    nc.title,
    nc.target_audience,
    nc.status,
    nc.sent_count,
    nc.open_count,
    nc.click_count,
    nc.open_rate,
    nc.click_rate,
    nc.created_at,
    nc.scheduled_at,
    nc.sent_at,
    COUNT(nl.id) as total_logs,
    COUNT(CASE WHEN nl.status = 'sent' THEN 1 END) as sent_logs,
    COUNT(CASE WHEN nl.status = 'opened' THEN 1 END) as opened_logs,
    COUNT(CASE WHEN nl.status = 'clicked' THEN 1 END) as clicked_logs
FROM notification_campaigns nc
LEFT JOIN notification_logs nl ON nc.id = nl.campaign_id
GROUP BY nc.id, nc.title, nc.target_audience, nc.status, nc.sent_count, 
         nc.open_count, nc.click_count, nc.open_rate, nc.click_rate, 
         nc.created_at, nc.scheduled_at, nc.sent_at;

CREATE VIEW pwa_install_summary AS
SELECT 
    platform,
    device_type,
    COUNT(*) as total_installs,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_installs,
    COUNT(CASE WHEN is_active = false THEN 1 END) as uninstalls,
    AVG(CASE WHEN uninstall_date IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (uninstall_date - install_date)) / 86400 
        ELSE NULL END) as avg_days_until_uninstall
FROM pwa_installs
GROUP BY platform, device_type
ORDER BY total_installs DESC;
