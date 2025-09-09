-- Gelişmiş Rapor Tasarımcısı Sistemi
-- Drag & drop rapor tasarımcısı, özel raporlar ve şablonlar

-- Rapor kategorileri
CREATE TABLE IF NOT EXISTS report_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7) DEFAULT '#6b7280',
    parent_id UUID REFERENCES report_categories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rapor şablonları
CREATE TABLE IF NOT EXISTS report_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES report_categories(id) ON DELETE SET NULL,
    template_type VARCHAR(50) NOT NULL, -- 'financial', 'inventory', 'sales', 'custom'
    data_source VARCHAR(100) NOT NULL, -- 'accounting', 'inventory', 'sales', 'hr'
    template_config JSONB NOT NULL, -- Rapor konfigürasyonu
    layout_config JSONB NOT NULL, -- Layout ve tasarım ayarları
    filters_config JSONB, -- Filtre ayarları
    export_formats TEXT[] DEFAULT ARRAY['pdf', 'excel', 'csv'], -- Desteklenen formatlar
    is_public BOOLEAN DEFAULT false, -- Herkese açık mı
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rapor çalıştırma geçmişi
CREATE TABLE IF NOT EXISTS report_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES report_templates(id) ON DELETE CASCADE,
    execution_name VARCHAR(200),
    parameters JSONB, -- Çalıştırma parametreleri
    filters JSONB, -- Uygulanan filtreler
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    progress INTEGER DEFAULT 0, -- 0-100
    result_data JSONB, -- Rapor sonuç verisi
    error_message TEXT,
    file_path TEXT, -- Oluşturulan dosya yolu
    file_size INTEGER, -- Dosya boyutu (bytes)
    execution_time INTEGER, -- Milisaniye
    executed_by UUID,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rapor widget'ları
CREATE TABLE IF NOT EXISTS report_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    widget_type VARCHAR(50) NOT NULL, -- 'chart', 'table', 'metric', 'text', 'image'
    category VARCHAR(50) NOT NULL, -- 'financial', 'sales', 'inventory', 'hr'
    widget_config JSONB NOT NULL, -- Widget konfigürasyonu
    data_query TEXT, -- SQL sorgusu veya API endpoint
    icon VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard'lar
CREATE TABLE IF NOT EXISTS report_dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    layout_config JSONB NOT NULL, -- Dashboard layout
    widgets_config JSONB NOT NULL, -- Widget konfigürasyonları
    refresh_interval INTEGER DEFAULT 300, -- Saniye
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard widget'ları
CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dashboard_id UUID REFERENCES report_dashboards(id) ON DELETE CASCADE,
    widget_id UUID REFERENCES report_widgets(id) ON DELETE CASCADE,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    width INTEGER NOT NULL DEFAULT 4,
    height INTEGER NOT NULL DEFAULT 3,
    widget_config JSONB, -- Widget özel konfigürasyonu
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rapor veri kaynakları
CREATE TABLE IF NOT EXISTS report_data_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'database', 'api', 'file', 'external'
    connection_config JSONB NOT NULL, -- Bağlantı ayarları
    schema_config JSONB, -- Veri şeması
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rapor filtreleri
CREATE TABLE IF NOT EXISTS report_filters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES report_templates(id) ON DELETE CASCADE,
    filter_name VARCHAR(100) NOT NULL,
    filter_type VARCHAR(50) NOT NULL, -- 'date', 'text', 'select', 'number', 'boolean'
    field_name VARCHAR(100) NOT NULL,
    filter_config JSONB NOT NULL, -- Filtre konfigürasyonu
    is_required BOOLEAN DEFAULT false,
    default_value TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rapor paylaşımları
CREATE TABLE IF NOT EXISTS report_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES report_templates(id) ON DELETE CASCADE,
    dashboard_id UUID REFERENCES report_dashboards(id) ON DELETE CASCADE,
    share_type VARCHAR(20) NOT NULL, -- 'template', 'dashboard'
    share_token VARCHAR(100) UNIQUE NOT NULL,
    access_level VARCHAR(20) DEFAULT 'view', -- 'view', 'edit', 'admin'
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    shared_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rapor abonelikleri
CREATE TABLE IF NOT EXISTS report_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES report_templates(id) ON DELETE CASCADE,
    dashboard_id UUID REFERENCES report_dashboards(id) ON DELETE CASCADE,
    subscription_type VARCHAR(20) NOT NULL, -- 'template', 'dashboard'
    schedule_type VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly', 'custom'
    schedule_config JSONB NOT NULL, -- Zamanlama ayarları
    email_recipients TEXT[] NOT NULL, -- E-posta alıcıları
    export_format VARCHAR(20) DEFAULT 'pdf',
    is_active BOOLEAN DEFAULT true,
    last_executed_at TIMESTAMP WITH TIME ZONE,
    next_execution_at TIMESTAMP WITH TIME ZONE,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rapor cache
CREATE TABLE IF NOT EXISTS report_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key VARCHAR(200) UNIQUE NOT NULL,
    template_id UUID REFERENCES report_templates(id) ON DELETE CASCADE,
    cache_data JSONB NOT NULL,
    parameters_hash VARCHAR(64) NOT NULL, -- Parametre hash'i
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rapor logları
CREATE TABLE IF NOT EXISTS report_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES report_templates(id) ON DELETE SET NULL,
    dashboard_id UUID REFERENCES report_dashboards(id) ON DELETE SET NULL,
    execution_id UUID REFERENCES report_executions(id) ON DELETE SET NULL,
    log_type VARCHAR(50) NOT NULL, -- 'execution', 'error', 'access', 'export'
    log_level VARCHAR(20) NOT NULL, -- 'info', 'warning', 'error', 'debug'
    message TEXT NOT NULL,
    details JSONB,
    user_id UUID,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_report_templates_category_id ON report_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_report_templates_template_type ON report_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_report_templates_data_source ON report_templates(data_source);
CREATE INDEX IF NOT EXISTS idx_report_executions_template_id ON report_executions(template_id);
CREATE INDEX IF NOT EXISTS idx_report_executions_status ON report_executions(status);
CREATE INDEX IF NOT EXISTS idx_report_executions_executed_by ON report_executions(executed_by);
CREATE INDEX IF NOT EXISTS idx_report_widgets_category ON report_widgets(category);
CREATE INDEX IF NOT EXISTS idx_report_widgets_widget_type ON report_widgets(widget_type);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_dashboard_id ON dashboard_widgets(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_widget_id ON dashboard_widgets(widget_id);
CREATE INDEX IF NOT EXISTS idx_report_filters_template_id ON report_filters(template_id);
CREATE INDEX IF NOT EXISTS idx_report_shares_template_id ON report_shares(template_id);
CREATE INDEX IF NOT EXISTS idx_report_shares_dashboard_id ON report_shares(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_report_shares_share_token ON report_shares(share_token);
CREATE INDEX IF NOT EXISTS idx_report_subscriptions_template_id ON report_subscriptions(template_id);
CREATE INDEX IF NOT EXISTS idx_report_subscriptions_dashboard_id ON report_subscriptions(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_report_subscriptions_next_execution ON report_subscriptions(next_execution_at);
CREATE INDEX IF NOT EXISTS idx_report_cache_template_id ON report_cache(template_id);
CREATE INDEX IF NOT EXISTS idx_report_cache_expires_at ON report_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_report_logs_template_id ON report_logs(template_id);
CREATE INDEX IF NOT EXISTS idx_report_logs_dashboard_id ON report_logs(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_report_logs_log_type ON report_logs(log_type);
CREATE INDEX IF NOT EXISTS idx_report_logs_created_at ON report_logs(created_at);

-- Trigger fonksiyonları
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'lar
CREATE TRIGGER update_report_categories_updated_at BEFORE UPDATE ON report_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_report_templates_updated_at BEFORE UPDATE ON report_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_report_widgets_updated_at BEFORE UPDATE ON report_widgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_report_dashboards_updated_at BEFORE UPDATE ON report_dashboards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_report_data_sources_updated_at BEFORE UPDATE ON report_data_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_report_subscriptions_updated_at BEFORE UPDATE ON report_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data
INSERT INTO report_categories (name, description, icon, color, sort_order) VALUES
('Finansal Raporlar', 'Gelir, gider, kar-zarar raporları', 'ri-money-dollar-circle-line', '#10b981', 1),
('Satış Raporları', 'Satış performansı ve analiz raporları', 'ri-shopping-cart-line', '#3b82f6', 2),
('Stok Raporları', 'Envanter ve stok hareket raporları', 'ri-box-line', '#f59e0b', 3),
('Müşteri Raporları', 'Müşteri analizi ve CRM raporları', 'ri-user-line', '#8b5cf6', 4),
('İnsan Kaynakları', 'Bordro ve personel raporları', 'ri-team-line', '#ef4444', 5),
('Muhasebe Raporları', 'Mizan, yevmiye ve hesap raporları', 'ri-calculator-line', '#06b6d4', 6),
('Özel Raporlar', 'Kullanıcı tanımlı özel raporlar', 'ri-file-chart-line', '#6b7280', 7)
ON CONFLICT DO NOTHING;

-- Varsayılan widget'lar
INSERT INTO report_widgets (name, widget_type, category, widget_config, data_query, icon, description) VALUES
('Gelir Grafiği', 'chart', 'financial', '{"chartType": "line", "xAxis": "date", "yAxis": "amount"}', 'SELECT date, SUM(amount) as amount FROM income GROUP BY date', 'ri-line-chart-line', 'Zaman bazlı gelir grafiği'),
('Gider Grafiği', 'chart', 'financial', '{"chartType": "bar", "xAxis": "category", "yAxis": "amount"}', 'SELECT category, SUM(amount) as amount FROM expenses GROUP BY category', 'ri-bar-chart-line', 'Kategori bazlı gider grafiği'),
('Kar-Zarar Tablosu', 'table', 'financial', '{"columns": ["date", "income", "expense", "profit"]}', 'SELECT date, income, expense, (income - expense) as profit FROM financial_summary', 'ri-table-line', 'Aylık kar-zarar tablosu'),
('Toplam Satış', 'metric', 'sales', '{"format": "currency", "trend": true}', 'SELECT SUM(total) as total FROM sales WHERE date >= CURRENT_DATE - INTERVAL ''30 days''', 'ri-shopping-bag-line', 'Son 30 günlük toplam satış'),
('Stok Durumu', 'table', 'inventory', '{"columns": ["product", "stock", "min_stock", "status"]}', 'SELECT product_name, stock_quantity, min_stock, CASE WHEN stock_quantity <= min_stock THEN ''Düşük'' ELSE ''Normal'' END as status FROM products', 'ri-box-line', 'Ürün stok durumu tablosu'),
('Müşteri Sayısı', 'metric', 'customer', '{"format": "number", "trend": true}', 'SELECT COUNT(*) as count FROM customers WHERE created_at >= CURRENT_DATE - INTERVAL ''30 days''', 'ri-user-line', 'Yeni müşteri sayısı'),
('Bordro Özeti', 'table', 'hr', '{"columns": ["employee", "salary", "bonus", "total"]}', 'SELECT employee_name, base_salary, bonus, (base_salary + bonus) as total FROM payroll', 'ri-team-line', 'Aylık bordro özeti')
ON CONFLICT DO NOTHING;

-- RLS politikaları
ALTER TABLE report_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_logs ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için tam erişim
CREATE POLICY "Admin full access to report_categories" ON report_categories FOR ALL USING (true);
CREATE POLICY "Admin full access to report_templates" ON report_templates FOR ALL USING (true);
CREATE POLICY "Admin full access to report_executions" ON report_executions FOR ALL USING (true);
CREATE POLICY "Admin full access to report_widgets" ON report_widgets FOR ALL USING (true);
CREATE POLICY "Admin full access to report_dashboards" ON report_dashboards FOR ALL USING (true);
CREATE POLICY "Admin full access to dashboard_widgets" ON dashboard_widgets FOR ALL USING (true);
CREATE POLICY "Admin full access to report_data_sources" ON report_data_sources FOR ALL USING (true);
CREATE POLICY "Admin full access to report_filters" ON report_filters FOR ALL USING (true);
CREATE POLICY "Admin full access to report_shares" ON report_shares FOR ALL USING (true);
CREATE POLICY "Admin full access to report_subscriptions" ON report_subscriptions FOR ALL USING (true);
CREATE POLICY "Admin full access to report_cache" ON report_cache FOR ALL USING (true);
CREATE POLICY "Admin full access to report_logs" ON report_logs FOR ALL USING (true);
