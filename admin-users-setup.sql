-- Admin kullanıcıları tablosu
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) etkinleştir
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için policy
CREATE POLICY "Admin users can view all admin users" ON admin_users
  FOR SELECT USING (true);

CREATE POLICY "Admin users can insert admin users" ON admin_users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin users can update admin users" ON admin_users
  FOR UPDATE USING (true);

CREATE POLICY "Admin users can delete admin users" ON admin_users
  FOR DELETE USING (true);

-- Örnek admin kullanıcı ekle (kendi email adresinizi buraya yazın)
INSERT INTO admin_users (email, name, is_active) 
VALUES ('your-email@example.com', 'Admin User', true)
ON CONFLICT (email) DO NOTHING;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON admin_users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
