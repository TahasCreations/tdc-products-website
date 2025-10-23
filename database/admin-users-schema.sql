-- Admin Kullanıcıları Yönetimi
-- Güvenlik ve yetkilendirme sistemi

-- Admin kullanıcıları tablosu
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_main_admin BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin oturumları tablosu
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin aktivite logları
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin güvenlik ayarları
CREATE TABLE IF NOT EXISTS admin_security_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX IF NOT EXISTS idx_admin_users_last_login ON admin_users(last_login_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_user_id ON admin_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_action ON admin_activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at);

-- RLS politikaları
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_security_settings ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için tam erişim
CREATE POLICY "Admin full access to admin_users" ON admin_users FOR ALL USING (true);
CREATE POLICY "Admin full access to admin_sessions" ON admin_sessions FOR ALL USING (true);
CREATE POLICY "Admin full access to admin_activity_logs" ON admin_activity_logs FOR ALL USING (true);
CREATE POLICY "Admin full access to admin_security_settings" ON admin_security_settings FOR ALL USING (true);

-- Varsayılan güvenlik ayarları
INSERT INTO admin_security_settings (setting_key, setting_value, description) VALUES
('max_login_attempts', '5', 'Maksimum başarısız giriş denemesi'),
('lockout_duration_minutes', '30', 'Hesap kilitleme süresi (dakika)'),
('session_timeout_minutes', '480', 'Oturum zaman aşımı (dakika)'),
('password_min_length', '8', 'Minimum şifre uzunluğu'),
('password_require_special', 'true', 'Şifrede özel karakter zorunluluğu'),
('two_factor_enabled', 'false', 'İki faktörlü kimlik doğrulama'),
('login_notification_email', 'true', 'Giriş bildirim e-postası'),
('audit_log_retention_days', '90', 'Denetim log saklama süresi (gün)')
ON CONFLICT (setting_key) DO NOTHING;

-- Ana admin kullanıcısı oluştur (şifre: 35sandalye)
INSERT INTO admin_users (email, name, password_hash, is_main_admin, is_active) VALUES
('bentahasarii@gmail.com', 'Ana Admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', true, true)
ON CONFLICT (email) DO NOTHING;

-- Trigger: Güncelleme zamanını otomatik güncelle
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_users_updated_at();

-- Trigger: Şifre değişikliği zamanını güncelle
CREATE OR REPLACE FUNCTION update_admin_users_password_changed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.password_hash != NEW.password_hash THEN
        NEW.password_changed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_admin_users_password_changed_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW,

    EXECUTE FUNCTION update_admin_users_password_changed_at();
