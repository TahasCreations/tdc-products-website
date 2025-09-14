-- Gelişmiş Analitik ve Raporlama Veritabanı Şeması
-- Milyon lira değerinde e-ticaret platformu için

-- Analitik olayları
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'page_view', 'product_view', 'add_to_cart', 'purchase', 'search', 'click', 'scroll', 'time_on_page'
    event_category VARCHAR(50), -- 'user_behavior', 'ecommerce', 'performance', 'error'
    event_action VARCHAR(100),
    event_label VARCHAR(200),
    event_value DECIMAL(10,2),
    page_url TEXT,
    page_title VARCHAR(200),
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    device_type VARCHAR(20), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(50),
    os VARCHAR(50),
    country VARCHAR(2),
    city VARCHAR(100),
    metadata JSONB, -- event specific data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-ticaret metrikleri
CREATE TABLE IF NOT EXISTS ecommerce_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL,
    transaction_id VARCHAR(100),
    product_id UUID,
    product_name VARCHAR(200),
    product_category VARCHAR(100),
    product_price DECIMAL(10,2),
    quantity INTEGER DEFAULT 1,
    revenue DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'TRY',
    event_type VARCHAR(50) NOT NULL, -- 'view_item', 'add_to_cart', 'remove_from_cart', 'begin_checkout', 'purchase', 'refund'
    checkout_step VARCHAR(50), -- 'shipping', 'payment', 'confirmation'
    payment_method VARCHAR(50),
    shipping_method VARCHAR(50),
    coupon_code VARCHAR(50),
    discount_amount DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcı davranış analizi
CREATE TABLE IF NOT EXISTS user_behavior_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL,
    page_path VARCHAR(500),
    time_on_page INTEGER, -- seconds
    scroll_depth DECIMAL(5,2), -- percentage
    bounce_rate BOOLEAN,
    exit_page BOOLEAN,
    click_count INTEGER DEFAULT 0,
    form_interactions INTEGER DEFAULT 0,
    search_queries INTEGER DEFAULT 0,
    video_plays INTEGER DEFAULT 0,
    file_downloads INTEGER DEFAULT 0,
    social_shares INTEGER DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performans metrikleri
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(100) NOT NULL,
    page_url TEXT,
    page_load_time INTEGER, -- milliseconds
    dom_content_loaded INTEGER,
    first_contentful_paint INTEGER,
    largest_contentful_paint INTEGER,
    first_input_delay INTEGER,
    cumulative_layout_shift DECIMAL(5,4),
    time_to_interactive INTEGER,
    total_blocking_time INTEGER,
    network_type VARCHAR(20), -- 'slow-2g', '2g', '3g', '4g', 'wifi'
    connection_speed DECIMAL(8,2), -- Mbps
    device_memory INTEGER, -- MB
    cpu_cores INTEGER,
    viewport_width INTEGER,
    viewport_height INTEGER,
    screen_width INTEGER,
    screen_height INTEGER,
    pixel_ratio DECIMAL(3,2),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hata ve istisna takibi
CREATE TABLE IF NOT EXISTS error_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL,
    error_type VARCHAR(50) NOT NULL, -- 'javascript', 'network', 'server', 'validation', 'payment'
    error_message TEXT,
    error_stack TEXT,
    error_file VARCHAR(500),
    error_line INTEGER,
    error_column INTEGER,
    page_url TEXT,
    user_agent TEXT,
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES auth.users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Özel raporlar
CREATE TABLE IF NOT EXISTS custom_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL, -- 'dashboard', 'analytics', 'ecommerce', 'performance', 'custom'
    query_config JSONB NOT NULL, -- report query configuration
    filters JSONB, -- report filters
    visualization_config JSONB, -- chart/table configuration
    schedule_config JSONB, -- auto-generation schedule
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    last_generated_at TIMESTAMP WITH TIME ZONE,
    next_generation_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard konfigürasyonları
CREATE TABLE IF NOT EXISTS dashboard_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    dashboard_type VARCHAR(50) NOT NULL, -- 'overview', 'ecommerce', 'performance', 'user_behavior', 'custom'
    layout_config JSONB NOT NULL, -- dashboard layout
    widget_configs JSONB NOT NULL, -- widget configurations
    filters JSONB, -- global dashboard filters
    refresh_interval INTEGER DEFAULT 300, -- seconds
    is_public BOOLEAN DEFAULT false,
    is_default BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    access_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tahmine dayalı analiz sonuçları
CREATE TABLE IF NOT EXISTS predictive_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(20) NOT NULL,
    prediction_type VARCHAR(50) NOT NULL, -- 'revenue', 'conversion', 'churn', 'lifetime_value', 'demand'
    target_entity VARCHAR(50), -- 'user', 'product', 'category', 'campaign'
    target_id UUID,
    prediction_value DECIMAL(15,4),
    confidence_score DECIMAL(5,4),
    prediction_date DATE,
    actual_value DECIMAL(15,4),
    accuracy_score DECIMAL(5,4),
    model_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İş zekası metrikleri
CREATE TABLE IF NOT EXISTS business_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_category VARCHAR(50) NOT NULL, -- 'revenue', 'traffic', 'conversion', 'retention', 'satisfaction'
    metric_value DECIMAL(15,4) NOT NULL,
    metric_unit VARCHAR(20), -- 'currency', 'percentage', 'count', 'time'
    calculation_method VARCHAR(50), -- 'sum', 'average', 'count', 'percentage', 'ratio'
    time_period VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
    period_start DATE,
    period_end DATE,
    comparison_period VARCHAR(20), -- 'previous', 'same_last_year', 'custom'
    comparison_value DECIMAL(15,4),
    change_percentage DECIMAL(8,4),
    trend_direction VARCHAR(10), -- 'up', 'down', 'stable'
    benchmark_value DECIMAL(15,4),
    benchmark_percentage DECIMAL(8,4),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- A/B test sonuçları
CREATE TABLE IF NOT EXISTS ab_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_name VARCHAR(200) NOT NULL,
    test_type VARCHAR(50) NOT NULL, -- 'page', 'feature', 'campaign', 'pricing'
    variant_name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL,
    conversion_event VARCHAR(100),
    conversion_value DECIMAL(10,2),
    is_conversion BOOLEAN DEFAULT false,
    test_start_date DATE,
    test_end_date DATE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_page_url ON analytics_events(page_url);

CREATE INDEX IF NOT EXISTS idx_ecommerce_metrics_user_id ON ecommerce_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_metrics_session_id ON ecommerce_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_metrics_product_id ON ecommerce_metrics(product_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_metrics_event_type ON ecommerce_metrics(event_type);
CREATE INDEX IF NOT EXISTS idx_ecommerce_metrics_created_at ON ecommerce_metrics(created_at);

CREATE INDEX IF NOT EXISTS idx_user_behavior_metrics_user_id ON user_behavior_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_metrics_session_id ON user_behavior_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_metrics_page_path ON user_behavior_metrics(page_path);
CREATE INDEX IF NOT EXISTS idx_user_behavior_metrics_created_at ON user_behavior_metrics(created_at);

CREATE INDEX IF NOT EXISTS idx_performance_metrics_session_id ON performance_metrics(session_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_page_url ON performance_metrics(page_url);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON performance_metrics(created_at);

CREATE INDEX IF NOT EXISTS idx_error_metrics_user_id ON error_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_error_metrics_error_type ON error_metrics(error_type);
CREATE INDEX IF NOT EXISTS idx_error_metrics_severity ON error_metrics(severity);
CREATE INDEX IF NOT EXISTS idx_error_metrics_resolved ON error_metrics(resolved);
CREATE INDEX IF NOT EXISTS idx_error_metrics_created_at ON error_metrics(created_at);

CREATE INDEX IF NOT EXISTS idx_custom_reports_created_by ON custom_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_custom_reports_report_type ON custom_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_custom_reports_is_active ON custom_reports(is_active);

CREATE INDEX IF NOT EXISTS idx_dashboard_configs_created_by ON dashboard_configs(created_by);
CREATE INDEX IF NOT EXISTS idx_dashboard_configs_dashboard_type ON dashboard_configs(dashboard_type);
CREATE INDEX IF NOT EXISTS idx_dashboard_configs_is_default ON dashboard_configs(is_default);

CREATE INDEX IF NOT EXISTS idx_predictive_analytics_model_name ON predictive_analytics(model_name);
CREATE INDEX IF NOT EXISTS idx_predictive_analytics_prediction_type ON predictive_analytics(prediction_type);
CREATE INDEX IF NOT EXISTS idx_predictive_analytics_prediction_date ON predictive_analytics(prediction_date);

CREATE INDEX IF NOT EXISTS idx_business_intelligence_metric_name ON business_intelligence(metric_name);
CREATE INDEX IF NOT EXISTS idx_business_intelligence_metric_category ON business_intelligence(metric_category);
CREATE INDEX IF NOT EXISTS idx_business_intelligence_time_period ON business_intelligence(time_period);
CREATE INDEX IF NOT EXISTS idx_business_intelligence_period_start ON business_intelligence(period_start);

CREATE INDEX IF NOT EXISTS idx_ab_test_results_test_name ON ab_test_results(test_name);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_user_id ON ab_test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_variant_name ON ab_test_results(variant_name);

-- Trigger'lar
CREATE OR REPLACE FUNCTION update_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_reports_updated_at
    BEFORE UPDATE ON custom_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_analytics_updated_at();

CREATE TRIGGER update_dashboard_configs_updated_at
    BEFORE UPDATE ON dashboard_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_analytics_updated_at();

-- Real-time analytics view
CREATE VIEW real_time_analytics AS
SELECT 
    DATE_TRUNC('minute', created_at) as time_bucket,
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '1 hour'
GROUP BY DATE_TRUNC('minute', created_at), event_type
ORDER BY time_bucket DESC, event_count DESC;

-- E-commerce performance view
CREATE VIEW ecommerce_performance AS
SELECT 
    DATE(created_at) as date,
    event_type,
    COUNT(*) as event_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions,
    SUM(revenue) as total_revenue,
    AVG(revenue) as avg_revenue,
    COUNT(CASE WHEN event_type = 'purchase' THEN 1 END) as purchases,
    COUNT(CASE WHEN event_type = 'add_to_cart' THEN 1 END) as add_to_carts,
    ROUND(
        COUNT(CASE WHEN event_type = 'purchase' THEN 1 END)::DECIMAL / 
        COUNT(CASE WHEN event_type = 'add_to_cart' THEN 1 END) * 100, 2
    ) as conversion_rate
FROM ecommerce_metrics
GROUP BY DATE(created_at), event_type
ORDER BY date DESC, event_count DESC;

-- User behavior summary view
CREATE VIEW user_behavior_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_sessions,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(time_on_page) as avg_time_on_page,
    AVG(scroll_depth) as avg_scroll_depth,
    COUNT(CASE WHEN bounce_rate = true THEN 1 END) as bounces,
    ROUND(
        COUNT(CASE WHEN bounce_rate = true THEN 1 END)::DECIMAL / COUNT(*) * 100, 2
    ) as bounce_rate_percentage,
    AVG(click_count) as avg_clicks_per_session,
    AVG(form_interactions) as avg_form_interactions
FROM user_behavior_metrics
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Performance metrics summary view
CREATE VIEW performance_summary AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_measurements,
    AVG(page_load_time) as avg_page_load_time,
    AVG(first_contentful_paint) as avg_fcp,
    AVG(largest_contentful_paint) as avg_lcp,
    AVG(first_input_delay) as avg_fid,
    AVG(cumulative_layout_shift) as avg_cls,
    AVG(time_to_interactive) as avg_tti,
    AVG(total_blocking_time) as avg_tbt,
    COUNT(CASE WHEN page_load_time > 3000 THEN 1 END) as slow_pages,
    ROUND(
        COUNT(CASE WHEN page_load_time > 3000 THEN 1 END)::DECIMAL / COUNT(*) * 100, 2
    ) as slow_page_percentage
FROM performance_metrics
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Business intelligence summary view
CREATE VIEW bi_summary AS
SELECT 
    metric_category,
    time_period,
    COUNT(*) as metric_count,
    AVG(metric_value) as avg_value,
    SUM(metric_value) as total_value,
    AVG(change_percentage) as avg_change,
    COUNT(CASE WHEN trend_direction = 'up' THEN 1 END) as positive_trends,
    COUNT(CASE WHEN trend_direction = 'down' THEN 1 END) as negative_trends,
    COUNT(CASE WHEN trend_direction = 'stable' THEN 1 END) as stable_trends
FROM business_intelligence
GROUP BY metric_category, time_period
ORDER BY metric_category, time_period;

-- RLS (Row Level Security) politikaları
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi verilerini görebilir
CREATE POLICY "Users can view own analytics data" ON analytics_events
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own ecommerce data" ON ecommerce_metrics
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own behavior data" ON user_behavior_metrics
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own error data" ON error_metrics
    FOR SELECT USING (user_id = auth.uid());

-- Admin'ler tüm verileri görebilir
CREATE POLICY "Admins can view all analytics data" ON analytics_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can view all ecommerce data" ON ecommerce_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can view all behavior data" ON user_behavior_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can view all performance data" ON performance_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can view all error data" ON error_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can manage reports" ON custom_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can manage dashboards" ON dashboard_configs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

-- Varsayılan dashboard konfigürasyonları
INSERT INTO dashboard_configs (name, description, dashboard_type, layout_config, widget_configs, is_default) VALUES
('Genel Bakış', 'Ana dashboard - genel metrikler ve KPI''lar', 'overview', 
 '{"columns": 3, "rows": 4, "gaps": {"column": 16, "row": 16}}',
 '{"widgets": [
   {"id": "revenue-chart", "type": "line-chart", "title": "Gelir Trendi", "position": {"x": 0, "y": 0, "w": 2, "h": 2}},
   {"id": "conversion-rate", "type": "metric", "title": "Dönüşüm Oranı", "position": {"x": 2, "y": 0, "w": 1, "h": 1}},
   {"id": "top-products", "type": "table", "title": "En Çok Satan Ürünler", "position": {"x": 0, "y": 2, "w": 2, "h": 2}},
   {"id": "user-sessions", "type": "bar-chart", "title": "Kullanıcı Oturumları", "position": {"x": 2, "y": 1, "w": 1, "h": 1}},
   {"id": "traffic-sources", "type": "pie-chart", "title": "Trafik Kaynakları", "position": {"x": 0, "y": 4, "w": 1, "h": 2}},
   {"id": "performance-metrics", "type": "gauge", "title": "Performans Metrikleri", "position": {"x": 1, "y": 4, "w": 1, "h": 2}},
   {"id": "recent-activity", "type": "activity-feed", "title": "Son Aktiviteler", "position": {"x": 2, "y": 2, "w": 1, "h": 2}}
 ]}',
 true),
('E-ticaret Analizi', 'E-ticaret performans metrikleri', 'ecommerce',
 '{"columns": 3, "rows": 3, "gaps": {"column": 16, "row": 16}}',
 '{"widgets": [
   {"id": "sales-overview", "type": "metric-grid", "title": "Satış Özeti", "position": {"x": 0, "y": 0, "w": 3, "h": 1}},
   {"id": "sales-trend", "type": "line-chart", "title": "Satış Trendi", "position": {"x": 0, "y": 1, "w": 2, "h": 2}},
   {"id": "product-performance", "type": "table", "title": "Ürün Performansı", "position": {"x": 2, "y": 1, "w": 1, "h": 2}}
 ]}',
 false),
('Kullanıcı Davranışı', 'Kullanıcı etkileşim analizi', 'user_behavior',
 '{"columns": 2, "rows": 3, "gaps": {"column": 16, "row": 16}}',
 '{"widgets": [
   {"id": "user-journey", "type": "funnel-chart", "title": "Kullanıcı Yolculuğu", "position": {"x": 0, "y": 0, "w": 2, "h": 1}},
   {"id": "page-views", "type": "bar-chart", "title": "Sayfa Görüntülemeleri", "position": {"x": 0, "y": 1, "w": 1, "h": 1}},
   {"id": "user-engagement", "type": "heatmap", "title": "Kullanıcı Etkileşimi", "position": {"x": 1, "y": 1, "w": 1, "h": 1}},
   {"id": "session-duration", "type": "histogram", "title": "Oturum Süresi", "position": {"x": 0, "y": 2, "w": 2, "h": 1}}
 ]}',
 false);
