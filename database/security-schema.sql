-- Enterprise Güvenlik Veritabanı Şeması
-- Milyon lira değerinde e-ticaret platformu için

-- Güvenlik rolleri
CREATE TABLE IF NOT EXISTS security_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    permissions JSONB NOT NULL, -- array of permission strings
    is_system_role BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcı rolleri (many-to-many)
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES security_roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, role_id)
);

-- Güvenlik izinleri
CREATE TABLE IF NOT EXISTS security_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(100) NOT NULL, -- 'users', 'products', 'orders', etc.
    action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'manage'
    description TEXT,
    is_system_permission BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcı oturumları
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB, -- device type, browser, os
    location_info JSONB, -- country, city, coordinates
    is_active BOOLEAN DEFAULT true,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multi-Factor Authentication
CREATE TABLE IF NOT EXISTS mfa_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mfa_type VARCHAR(50) NOT NULL, -- 'totp', 'sms', 'email', 'backup_codes'
    secret_key VARCHAR(255), -- encrypted
    backup_codes TEXT[], -- encrypted array
    phone_number VARCHAR(20),
    is_enabled BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, mfa_type)
);

-- MFA doğrulama geçmişi
CREATE TABLE IF NOT EXISTS mfa_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mfa_type VARCHAR(50) NOT NULL,
    verification_code VARCHAR(20),
    is_successful BOOLEAN NOT NULL,
    ip_address INET,
    user_agent TEXT,
    failure_reason VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs - tüm güvenlik olayları
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    event_type VARCHAR(100) NOT NULL, -- 'login', 'logout', 'permission_denied', 'data_access', 'data_modification'
    event_category VARCHAR(50) NOT NULL, -- 'authentication', 'authorization', 'data_access', 'system'
    resource_type VARCHAR(100), -- 'user', 'product', 'order', etc.
    resource_id UUID,
    action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'login', 'logout'
    old_values JSONB, -- previous state
    new_values JSONB, -- new state
    ip_address INET,
    user_agent TEXT,
    location_info JSONB,
    risk_score INTEGER DEFAULT 0, -- 0-100 risk assessment
    is_suspicious BOOLEAN DEFAULT false,
    metadata JSONB, -- additional event data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Güvenlik olayları
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL, -- 'failed_login', 'suspicious_activity', 'data_breach_attempt', 'privilege_escalation'
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    description TEXT NOT NULL,
    details JSONB,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Güvenlik politikaları
CREATE TABLE IF NOT EXISTS security_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    policy_type VARCHAR(50) NOT NULL, -- 'password', 'session', 'mfa', 'access_control'
    description TEXT,
    rules JSONB NOT NULL, -- policy rules and conditions
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0, -- higher number = higher priority
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Güvenlik uyarıları
CREATE TABLE IF NOT EXISTS security_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(100) NOT NULL, -- 'brute_force', 'unusual_location', 'privilege_escalation', 'data_anomaly'
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id UUID REFERENCES user_sessions(id) ON DELETE SET NULL,
    related_event_id UUID REFERENCES security_events(id),
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_by UUID REFERENCES auth.users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Güvenlik ayarları
CREATE TABLE IF NOT EXISTS security_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(50), -- 'authentication', 'authorization', 'encryption', 'monitoring'
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Veri şifreleme anahtarları
CREATE TABLE IF NOT EXISTS encryption_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_name VARCHAR(100) UNIQUE NOT NULL,
    key_type VARCHAR(50) NOT NULL, -- 'aes', 'rsa', 'hmac'
    encrypted_key TEXT NOT NULL, -- encrypted key material
    key_version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rotated_at TIMESTAMP WITH TIME ZONE
);

-- Güvenlik raporları
CREATE TABLE IF NOT EXISTS security_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_type VARCHAR(50) NOT NULL, -- 'audit_summary', 'threat_analysis', 'compliance_report'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    report_data JSONB NOT NULL,
    generated_by UUID REFERENCES auth.users(id),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_public BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_is_active ON user_roles(is_active);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_mfa_settings_user_id ON mfa_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_settings_mfa_type ON mfa_settings(mfa_type);
CREATE INDEX IF NOT EXISTS idx_mfa_settings_is_enabled ON mfa_settings(is_enabled);

CREATE INDEX IF NOT EXISTS idx_mfa_verifications_user_id ON mfa_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_verifications_created_at ON mfa_verifications(created_at);
CREATE INDEX IF NOT EXISTS idx_mfa_verifications_is_successful ON mfa_verifications(is_successful);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event_category ON audit_logs(event_category);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_is_suspicious ON audit_logs(is_suspicious);

CREATE INDEX IF NOT EXISTS idx_security_events_event_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_security_events_is_resolved ON security_events(is_resolved);
CREATE INDEX IF NOT EXISTS idx_security_events_created_at ON security_events(created_at);

CREATE INDEX IF NOT EXISTS idx_security_alerts_alert_type ON security_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_is_acknowledged ON security_alerts(is_acknowledged);
CREATE INDEX IF NOT EXISTS idx_security_alerts_is_resolved ON security_alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_security_alerts_created_at ON security_alerts(created_at);

CREATE INDEX IF NOT EXISTS idx_security_policies_policy_type ON security_policies(policy_type);
CREATE INDEX IF NOT EXISTS idx_security_policies_is_active ON security_policies(is_active);

CREATE INDEX IF NOT EXISTS idx_encryption_keys_key_name ON encryption_keys(key_name);
CREATE INDEX IF NOT EXISTS idx_encryption_keys_is_active ON encryption_keys(is_active);

-- Trigger'lar
CREATE OR REPLACE FUNCTION update_security_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_security_roles_updated_at
    BEFORE UPDATE ON security_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_security_updated_at();

CREATE TRIGGER update_mfa_settings_updated_at
    BEFORE UPDATE ON mfa_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_security_updated_at();

CREATE TRIGGER update_security_policies_updated_at
    BEFORE UPDATE ON security_policies
    FOR EACH ROW
    EXECUTE FUNCTION update_security_updated_at();

CREATE TRIGGER update_security_settings_updated_at
    BEFORE UPDATE ON security_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_security_updated_at();

-- Oturum temizleme fonksiyonu
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    UPDATE user_sessions 
    SET is_active = false 
    WHERE expires_at < NOW() AND is_active = true;
    
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$ language 'plpgsql';

-- Güvenlik olayı oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION create_security_event(
    p_event_type VARCHAR(100),
    p_severity VARCHAR(20),
    p_user_id UUID DEFAULT NULL,
    p_session_id UUID DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO security_events (
        event_type, severity, user_id, session_id, ip_address, 
        user_agent, description, details
    ) VALUES (
        p_event_type, p_severity, p_user_id, p_session_id, p_ip_address,
        p_user_agent, p_description, p_details
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ language 'plpgsql';

-- Varsayılan güvenlik rolleri
INSERT INTO security_roles (name, display_name, description, permissions, is_system_role) VALUES
('super_admin', 'Süper Yönetici', 'Tam sistem erişimi', 
 '["*"]', true),
('admin', 'Yönetici', 'Yönetim paneli erişimi', 
 '["admin.*", "users.*", "products.*", "orders.*", "analytics.*"]', true),
('manager', 'Müdür', 'Sınırlı yönetim erişimi', 
 '["products.read", "products.update", "orders.read", "orders.update", "analytics.read"]', true),
('support', 'Destek', 'Müşteri destek erişimi', 
 '["users.read", "orders.read", "orders.update", "tickets.*"]', true),
('customer', 'Müşteri', 'Standart müşteri erişimi', 
 '["profile.*", "orders.read", "products.read"]', true);

-- Varsayılan güvenlik izinleri
INSERT INTO security_permissions (name, resource, action, description, is_system_permission) VALUES
-- Kullanıcı izinleri
('users.create', 'users', 'create', 'Kullanıcı oluşturma', true),
('users.read', 'users', 'read', 'Kullanıcı okuma', true),
('users.update', 'users', 'update', 'Kullanıcı güncelleme', true),
('users.delete', 'users', 'delete', 'Kullanıcı silme', true),
('users.manage', 'users', 'manage', 'Kullanıcı yönetimi', true),

-- Ürün izinleri
('products.create', 'products', 'create', 'Ürün oluşturma', true),
('products.read', 'products', 'read', 'Ürün okuma', true),
('products.update', 'products', 'update', 'Ürün güncelleme', true),
('products.delete', 'products', 'delete', 'Ürün silme', true),
('products.manage', 'products', 'manage', 'Ürün yönetimi', true),

-- Sipariş izinleri
('orders.create', 'orders', 'create', 'Sipariş oluşturma', true),
('orders.read', 'orders', 'read', 'Sipariş okuma', true),
('orders.update', 'orders', 'update', 'Sipariş güncelleme', true),
('orders.delete', 'orders', 'delete', 'Sipariş silme', true),
('orders.manage', 'orders', 'manage', 'Sipariş yönetimi', true),

-- Analitik izinleri
('analytics.read', 'analytics', 'read', 'Analitik okuma', true),
('analytics.manage', 'analytics', 'manage', 'Analitik yönetimi', true),

-- Güvenlik izinleri
('security.read', 'security', 'read', 'Güvenlik okuma', true),
('security.manage', 'security', 'manage', 'Güvenlik yönetimi', true),

-- Admin izinleri
('admin.access', 'admin', 'access', 'Admin paneline erişim', true),
('admin.manage', 'admin', 'manage', 'Admin yönetimi', true);

-- Varsayılan güvenlik politikaları
INSERT INTO security_policies (name, policy_type, description, rules, priority) VALUES
('Password Policy', 'password', 'Şifre güvenlik politikası', 
 '{"min_length": 8, "require_uppercase": true, "require_lowercase": true, "require_numbers": true, "require_symbols": true, "max_age_days": 90}', 100),
('Session Policy', 'session', 'Oturum güvenlik politikası', 
 '{"max_duration_hours": 24, "idle_timeout_minutes": 30, "max_concurrent_sessions": 3}', 90),
('MFA Policy', 'mfa', 'Çok faktörlü kimlik doğrulama politikası', 
 '{"required_for_admin": true, "required_for_privileged": true, "backup_codes_count": 10}', 80),
('Access Control Policy', 'access_control', 'Erişim kontrol politikası', 
 '{"ip_whitelist": [], "ip_blacklist": [], "geolocation_restrictions": [], "time_restrictions": []}', 70);

-- Varsayılan güvenlik ayarları
INSERT INTO security_settings (setting_key, setting_value, description, category, is_public) VALUES
('max_login_attempts', '5', 'Maksimum giriş denemesi', 'authentication', false),
('lockout_duration_minutes', '15', 'Hesap kilitleme süresi (dakika)', 'authentication', false),
('session_timeout_minutes', '30', 'Oturum zaman aşımı (dakika)', 'authentication', false),
('require_https', 'true', 'HTTPS zorunluluğu', 'encryption', false),
('encrypt_sensitive_data', 'true', 'Hassas veri şifreleme', 'encryption', false),
('audit_log_retention_days', '365', 'Denetim kayıt saklama süresi (gün)', 'monitoring', false),
('security_monitoring_enabled', 'true', 'Güvenlik izleme etkin', 'monitoring', false),
('threat_detection_enabled', 'true', 'Tehdit tespiti etkin', 'monitoring', false);

-- RLS (Row Level Security) politikaları
ALTER TABLE security_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE encryption_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_reports ENABLE ROW LEVEL SECURITY;

-- Admin'ler tüm güvenlik verilerini görebilir
CREATE POLICY "Admins can view all security data" ON security_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can view all user roles" ON user_roles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can view all audit logs" ON audit_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can view all security events" ON security_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

-- Kullanıcılar sadece kendi verilerini görebilir
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own MFA settings" ON mfa_settings
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own audit logs" ON audit_logs
    FOR SELECT USING (user_id = auth.uid());

-- View'lar
CREATE VIEW security_summary AS
SELECT 
    'active_sessions' as metric,
    COUNT(*) as value
FROM user_sessions 
WHERE is_active = true AND expires_at > NOW()
UNION ALL
SELECT 
    'failed_logins_today' as metric,
    COUNT(*) as value
FROM audit_logs 
WHERE event_type = 'login_failed' 
AND DATE(created_at) = CURRENT_DATE
UNION ALL
SELECT 
    'security_events_today' as metric,
    COUNT(*) as value
FROM security_events 
WHERE DATE(created_at) = CURRENT_DATE
UNION ALL
SELECT 
    'unresolved_alerts' as metric,
    COUNT(*) as value
FROM security_alerts 
WHERE is_resolved = false;

CREATE VIEW user_security_status AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(DISTINCT s.id) as active_sessions,
    COUNT(DISTINCT m.id) as mfa_methods,
    MAX(s.last_activity) as last_activity,
    MAX(al.created_at) as last_login,
    COUNT(DISTINCT CASE WHEN al.event_type = 'login_failed' AND DATE(al.created_at) = CURRENT_DATE THEN al.id END) as failed_logins_today
FROM auth.users u
LEFT JOIN user_sessions s ON u.id = s.user_id AND s.is_active = true
LEFT JOIN mfa_settings m ON u.id = m.user_id AND m.is_enabled = true
LEFT JOIN audit_logs al ON u.id = al.user_id AND al.event_type = 'login_success'
GROUP BY u.id, u.email;
