-- Çoklu Dil ve Para Birimi Sistemi Veritabanı Şeması

-- Para birimleri tablosu
CREATE TABLE IF NOT EXISTS currencies (
  id SERIAL PRIMARY KEY,
  code VARCHAR(3) UNIQUE NOT NULL, -- USD, EUR, TRY, GBP, etc.
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  decimal_places INTEGER DEFAULT 2,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  exchange_rate DECIMAL(10, 6) DEFAULT 1.000000,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Diller tablosu
CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  code VARCHAR(5) UNIQUE NOT NULL, -- tr, en, de, fr, es, ar
  name VARCHAR(100) NOT NULL,
  native_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  is_rtl BOOLEAN DEFAULT false, -- Right-to-left languages
  flag_emoji VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Çeviri anahtarları tablosu
CREATE TABLE IF NOT EXISTS translation_keys (
  id SERIAL PRIMARY KEY,
  key_name VARCHAR(255) UNIQUE NOT NULL,
  namespace VARCHAR(100) DEFAULT 'common',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Çeviriler tablosu
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  translation_key_id INTEGER REFERENCES translation_keys(id) ON DELETE CASCADE,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  translation_text TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(translation_key_id, language_id)
);

-- Kullanıcı dil tercihleri
CREATE TABLE IF NOT EXISTS user_language_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, language_id)
);

-- Kullanıcı para birimi tercihleri
CREATE TABLE IF NOT EXISTS user_currency_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  currency_id INTEGER REFERENCES currencies(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, currency_id)
);

-- Ürün çevirileri
CREATE TABLE IF NOT EXISTS product_translations (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, language_id)
);

-- Kategori çevirileri
CREATE TABLE IF NOT EXISTS category_translations (
  id SERIAL PRIMARY KEY,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category_id, language_id)
);

-- Blog yazısı çevirileri
CREATE TABLE IF NOT EXISTS blog_translations (
  id SERIAL PRIMARY KEY,
  blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(blog_id, language_id)
);

-- Para birimi dönüşüm geçmişi
CREATE TABLE IF NOT EXISTS currency_exchange_history (
  id SERIAL PRIMARY KEY,
  from_currency_id INTEGER REFERENCES currencies(id) ON DELETE CASCADE,
  to_currency_id INTEGER REFERENCES currencies(id) ON DELETE CASCADE,
  exchange_rate DECIMAL(10, 6) NOT NULL,
  source VARCHAR(100) DEFAULT 'manual', -- manual, api, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bölgesel ayarlar
CREATE TABLE IF NOT EXISTS regional_settings (
  id SERIAL PRIMARY KEY,
  country_code VARCHAR(2) UNIQUE NOT NULL, -- TR, US, DE, etc.
  country_name VARCHAR(100) NOT NULL,
  default_language_id INTEGER REFERENCES languages(id),
  default_currency_id INTEGER REFERENCES currencies(id),
  date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
  time_format VARCHAR(10) DEFAULT '24h',
  number_format VARCHAR(20) DEFAULT '1,234.56',
  currency_position VARCHAR(10) DEFAULT 'after', -- before, after
  tax_rate DECIMAL(5, 2) DEFAULT 0.00,
  shipping_zones JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Çoklu dil içerik yönetimi
CREATE TABLE IF NOT EXISTS content_management (
  id SERIAL PRIMARY KEY,
  content_type VARCHAR(50) NOT NULL, -- page, section, banner, etc.
  content_key VARCHAR(255) NOT NULL,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT,
  meta_data JSONB,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(content_type, content_key, language_id)
);

-- Dil ve para birimi istatistikleri
CREATE TABLE IF NOT EXISTS i18n_analytics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  language_id INTEGER REFERENCES languages(id) ON DELETE CASCADE,
  currency_id INTEGER REFERENCES currencies(id) ON DELETE CASCADE,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  revenue DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, language_id, currency_id)
);

-- Varsayılan verileri ekle
INSERT INTO currencies (code, name, symbol, decimal_places, is_default, exchange_rate) VALUES
('TRY', 'Turkish Lira', '₺', 2, true, 1.000000),
('USD', 'US Dollar', '$', 2, false, 0.033000),
('EUR', 'Euro', '€', 2, false, 0.030000),
('GBP', 'British Pound', '£', 2, false, 0.026000),
('JPY', 'Japanese Yen', '¥', 0, false, 4.500000),
('CAD', 'Canadian Dollar', 'C$', 2, false, 0.044000),
('AUD', 'Australian Dollar', 'A$', 2, false, 0.048000),
('CHF', 'Swiss Franc', 'CHF', 2, false, 0.029000),
('CNY', 'Chinese Yuan', '¥', 2, false, 0.235000),
('RUB', 'Russian Ruble', '₽', 2, false, 2.800000);

INSERT INTO languages (code, name, native_name, is_default, is_rtl, flag_emoji) VALUES
('tr', 'Turkish', 'Türkçe', true, false, '🇹🇷'),
('en', 'English', 'English', false, false, '🇺🇸'),
('de', 'German', 'Deutsch', false, false, '🇩🇪'),
('fr', 'French', 'Français', false, false, '🇫🇷'),
('es', 'Spanish', 'Español', false, false, '🇪🇸'),
('ar', 'Arabic', 'العربية', false, true, '🇸🇦'),
('it', 'Italian', 'Italiano', false, false, '🇮🇹'),
('pt', 'Portuguese', 'Português', false, false, '🇵🇹'),
('ru', 'Russian', 'Русский', false, false, '🇷🇺'),
('ja', 'Japanese', '日本語', false, false, '🇯🇵'),
('ko', 'Korean', '한국어', false, false, '🇰🇷'),
('zh', 'Chinese', '中文', false, false, '🇨🇳');

INSERT INTO regional_settings (country_code, country_name, default_language_id, default_currency_id, date_format, time_format, number_format, currency_position, tax_rate) VALUES
('TR', 'Turkey', 1, 1, 'DD/MM/YYYY', '24h', '1.234,56', 'after', 20.00),
('US', 'United States', 2, 2, 'MM/DD/YYYY', '12h', '1,234.56', 'before', 8.00),
('DE', 'Germany', 3, 3, 'DD.MM.YYYY', '24h', '1.234,56', 'after', 19.00),
('FR', 'France', 4, 3, 'DD/MM/YYYY', '24h', '1 234,56', 'after', 20.00),
('ES', 'Spain', 5, 3, 'DD/MM/YYYY', '24h', '1.234,56', 'after', 21.00),
('SA', 'Saudi Arabia', 6, 1, 'DD/MM/YYYY', '12h', '1,234.56', 'before', 15.00);

-- İndeksler
CREATE INDEX idx_translations_key_language ON translations(translation_key_id, language_id);
CREATE INDEX idx_translations_language ON translations(language_id);
CREATE INDEX idx_product_translations_product ON product_translations(product_id);
CREATE INDEX idx_product_translations_language ON product_translations(language_id);
CREATE INDEX idx_category_translations_category ON category_translations(category_id);
CREATE INDEX idx_category_translations_language ON category_translations(language_id);
CREATE INDEX idx_blog_translations_blog ON blog_translations(blog_id);
CREATE INDEX idx_blog_translations_language ON blog_translations(language_id);
CREATE INDEX idx_user_language_preferences_user ON user_language_preferences(user_id);
CREATE INDEX idx_user_currency_preferences_user ON user_currency_preferences(user_id);
CREATE INDEX idx_currency_exchange_history_currencies ON currency_exchange_history(from_currency_id, to_currency_id);
CREATE INDEX idx_currency_exchange_history_date ON currency_exchange_history(created_at);
CREATE INDEX idx_i18n_analytics_date ON i18n_analytics(date);
CREATE INDEX idx_i18n_analytics_language_currency ON i18n_analytics(language_id, currency_id);
