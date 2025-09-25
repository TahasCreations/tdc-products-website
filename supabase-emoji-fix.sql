-- Supabase Categories Table Emoji Field Fix
-- Bu script categories tablosuna emoji alanını ekler

-- Emoji alanını ekle (eğer yoksa)
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS emoji VARCHAR(10) DEFAULT '📦';

-- Mevcut kategorilere varsayılan emoji ata
UPDATE categories 
SET emoji = '📦' 
WHERE emoji IS NULL;

-- Emoji alanını NOT NULL yap
ALTER TABLE categories 
ALTER COLUMN emoji SET NOT NULL;

-- Index ekle (performans için)
CREATE INDEX IF NOT EXISTS idx_categories_emoji ON categories(emoji);

-- RLS policy'sini güncelle (eğer gerekirse)
-- Admin kullanıcıları için tam erişim zaten mevcut olmalı
-- CREATE POLICY "Admin full access to categories" ON categories FOR ALL USING (true);

-- Test verisi ekle (isteğe bağlı)
-- INSERT INTO categories (name, slug, description, emoji, is_active) 
-- VALUES ('Test Kategori', 'test-kategori', 'Test açıklaması', '🧪', true)
-- ON CONFLICT (slug) DO NOTHING;

COMMIT;
