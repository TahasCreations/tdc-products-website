-- Admin kullanıcıları tablosu (RBAC ile genişletilmiş)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255), -- Admin kullanıcıları için özel şifre
  is_main_admin BOOLEAN DEFAULT false, -- Ana admin kontrolü
  is_active BOOLEAN DEFAULT true,
  role VARCHAR(50) DEFAULT 'viewer' CHECK (role IN ('owner', 'accountant', 'cashier', 'auditor', 'viewer')),
  permissions JSONB DEFAULT '[]', -- Özel izinler
  company_id UUID, -- Hangi şirket için yetkili
  created_by UUID REFERENCES admin_users(id), -- Hangi admin tarafından oluşturuldu
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eğer tablo zaten varsa, eksik sütunları ekle
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS is_main_admin BOOLEAN DEFAULT false;

ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES admin_users(id);

ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'viewer';

ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '[]';

ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS company_id UUID;

-- RLS (Row Level Security) etkinleştir
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Mevcut policy'leri sil (eğer varsa)
DROP POLICY IF EXISTS "Admin users can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admin users can delete admin users" ON admin_users;

-- Admin kullanıcıları için policy'leri yeniden oluştur
CREATE POLICY "Admin users can view all admin users" ON admin_users
  FOR SELECT USING (true);

CREATE POLICY "Admin users can insert admin users" ON admin_users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin users can update admin users" ON admin_users
  FOR UPDATE USING (true);

CREATE POLICY "Admin users can delete admin users" ON admin_users
  FOR DELETE USING (true);

-- Ana admin kullanıcı ekle (bentahasarii@gmail.com)
-- Şifre: 35sandalye (bcrypt hash: $2b$10$loCKkO2Y6V6tWTOYFSn9EuSKWbJp2pEdE1.8pTtAXIR/WjJwAHfzW)
INSERT INTO admin_users (email, name, password_hash, is_main_admin, is_active) 
VALUES ('bentahasarii@gmail.com', 'Ana Admin', '$2b$10$loCKkO2Y6V6tWTOYFSn9EuSKWbJp2pEdE1.8pTtAXIR/WjJwAHfzW', true, true)
ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  is_main_admin = EXCLUDED.is_main_admin,
  is_active = EXCLUDED.is_active;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Mevcut trigger'ı sil (eğer varsa) ve yeniden oluştur
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON admin_users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
