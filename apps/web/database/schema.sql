-- TDC Market Global Pazaryeri Database Schema
-- PostgreSQL Database Schema for Advanced Marketplace

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table (Ana kullanıcı tablosu)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    language VARCHAR(5) DEFAULT 'tr',
    timezone VARCHAR(50) DEFAULT 'Europe/Istanbul',
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Address information
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'Turkey',
    
    -- Preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^\+?[1-9]\d{1,14}$' OR phone IS NULL),
    CONSTRAINT valid_gender CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say') OR gender IS NULL)
);

-- Sellers Table (Satıcı tablosu)
CREATE TABLE sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) NOT NULL, -- 'individual', 'company', 'corporation'
    tax_number VARCHAR(50),
    business_registration_number VARCHAR(100),
    business_address JSONB NOT NULL,
    business_phone VARCHAR(20),
    business_email VARCHAR(255),
    business_website TEXT,
    business_description TEXT,
    
    -- Business documents
    business_license_url TEXT,
    tax_certificate_url TEXT,
    identity_document_url TEXT,
    
    -- Bank information
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    bank_iban VARCHAR(34),
    bank_swift_code VARCHAR(11),
    
    -- Status and verification
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'suspended', 'rejected'
    verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    verification_notes TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES users(id),
    
    -- Commission and fees
    commission_rate DECIMAL(5,2) DEFAULT 5.00, -- Percentage
    minimum_commission DECIMAL(10,2) DEFAULT 1.00,
    maximum_commission DECIMAL(10,2) DEFAULT 50.00,
    
    -- Performance metrics
    total_sales DECIMAL(15,2) DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    
    -- Settings
    auto_accept_orders BOOLEAN DEFAULT FALSE,
    shipping_policy TEXT,
    return_policy TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_business_type CHECK (business_type IN ('individual', 'company', 'corporation')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'suspended', 'rejected')),
    CONSTRAINT valid_verification_status CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    CONSTRAINT valid_commission_rate CHECK (commission_rate >= 0 AND commission_rate <= 100)
);

-- Categories Table (Kategori tablosu)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url TEXT,
    icon VARCHAR(100),
    emoji VARCHAR(10),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[],
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$')
);

-- Products Table (Ürün tablosu)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    -- Basic information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    
    -- Pricing
    price DECIMAL(12,2) NOT NULL,
    compare_price DECIMAL(12,2), -- Original price for discounts
    cost_price DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'TRY',
    
    -- Inventory
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    track_inventory BOOLEAN DEFAULT TRUE,
    allow_backorder BOOLEAN DEFAULT FALSE,
    
    -- Physical properties
    weight DECIMAL(8,2), -- in kg
    dimensions JSONB, -- {length, width, height, unit}
    
    -- Media
    images JSONB DEFAULT '[]', -- Array of image URLs
    videos JSONB DEFAULT '[]', -- Array of video URLs
    documents JSONB DEFAULT '[]', -- Array of document URLs
    
    -- Status and visibility
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'inactive', 'archived'
    visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'private', 'unlisted'
    is_featured BOOLEAN DEFAULT FALSE,
    is_digital BOOLEAN DEFAULT FALSE,
    
    -- SEO
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT[],
    
    -- Performance metrics
    view_count INTEGER DEFAULT 0,
    purchase_count INTEGER DEFAULT 0,
    wishlist_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    
    -- Timestamps
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    CONSTRAINT valid_price CHECK (price > 0),
    CONSTRAINT valid_compare_price CHECK (compare_price IS NULL OR compare_price > 0),
    CONSTRAINT valid_cost_price CHECK (cost_price IS NULL OR cost_price >= 0),
    CONSTRAINT valid_stock_quantity CHECK (stock_quantity >= 0),
    CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'inactive', 'archived')),
    CONSTRAINT valid_visibility CHECK (visibility IN ('public', 'private', 'unlisted')),
    CONSTRAINT valid_currency CHECK (currency IN ('TRY', 'USD', 'EUR', 'GBP')),
    
    -- Unique constraint for seller and slug
    UNIQUE(seller_id, slug)
);

-- Product Variants Table (Ürün varyantları)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    
    -- Variant information
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    
    -- Pricing
    price DECIMAL(12,2),
    compare_price DECIMAL(12,2),
    cost_price DECIMAL(12,2),
    
    -- Inventory
    stock_quantity INTEGER DEFAULT 0,
    track_inventory BOOLEAN DEFAULT TRUE,
    
    -- Physical properties
    weight DECIMAL(8,2),
    dimensions JSONB,
    
    -- Variant options (color, size, etc.)
    option1_name VARCHAR(50),
    option1_value VARCHAR(100),
    option2_name VARCHAR(50),
    option2_value VARCHAR(100),
    option3_name VARCHAR(50),
    option3_value VARCHAR(100),
    
    -- Media
    image_url TEXT,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_variant_price CHECK (price IS NULL OR price > 0),
    CONSTRAINT valid_variant_stock CHECK (stock_quantity >= 0)
);

-- Orders Table (Sipariş tablosu)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Order status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
    fulfillment_status VARCHAR(20) DEFAULT 'unfulfilled', -- 'unfulfilled', 'fulfilled', 'partially_fulfilled'
    
    -- Pricing
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0.00,
    shipping_amount DECIMAL(12,2) DEFAULT 0.00,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    total_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    
    -- Customer information
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    billing_address JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    
    -- Shipping information
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(100),
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    
    -- Payment information
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Notes
    customer_notes TEXT,
    internal_notes TEXT,
    
    -- Timestamps
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_subtotal CHECK (subtotal >= 0),
    CONSTRAINT valid_total_amount CHECK (total_amount >= 0),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    CONSTRAINT valid_payment_status CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
    CONSTRAINT valid_fulfillment_status CHECK (fulfillment_status IN ('unfulfilled', 'fulfilled', 'partially_fulfilled'))
);

-- Order Items Table (Sipariş kalemleri)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    
    -- Item information
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    variant_name VARCHAR(255),
    
    -- Pricing
    unit_price DECIMAL(12,2) NOT NULL,
    quantity INTEGER NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    
    -- Product snapshot (at time of order)
    product_snapshot JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_quantity CHECK (quantity > 0),
    CONSTRAINT valid_unit_price CHECK (unit_price >= 0),
    CONSTRAINT valid_total_price CHECK (total_price >= 0)
);

-- Reviews Table (Değerlendirmeler)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    -- Review content
    rating INTEGER NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    
    -- Media
    images JSONB DEFAULT '[]',
    videos JSONB DEFAULT '[]',
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Helpfulness
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected')),
    
    -- One review per user per product
    UNIQUE(user_id, product_id)
);

-- Wishlists Table (İstek listesi)
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- One wishlist entry per user per product
    UNIQUE(user_id, product_id)
);

-- Cart Items Table (Sepet kalemleri)
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    
    quantity INTEGER NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_quantity CHECK (quantity > 0),
    
    -- One cart item per user per product variant
    UNIQUE(user_id, product_variant_id)
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_sellers_user_id ON sellers(user_id);
CREATE INDEX idx_sellers_status ON sellers(status);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- Full-text search indexes
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('turkish', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_categories_search ON categories USING gin(to_tsvector('turkish', name || ' ' || COALESCE(description, '')));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON sellers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO categories (name, slug, description, emoji, sort_order) VALUES
('3D Baskı Figürler', '3d-baski-figurler', 'Anime, oyun ve film karakterlerinin 3D baskı figürleri', '🎭', 1),
('Anime Figürler', 'anime-figurler', 'Popüler anime karakterlerinin figürleri', '🎌', 2),
('Oyun Figürler', 'oyun-figurler', 'Video oyun karakterlerinin figürleri', '🎮', 3),
('Film Figürler', 'film-figurler', 'Hollywood ve dünya sineması karakterleri', '🎬', 4),
('Özel Tasarım', 'ozel-tasarim', 'Kişiye özel tasarım figürler', '🎨', 5);

-- Insert subcategories
INSERT INTO categories (name, slug, description, parent_id, emoji, sort_order) VALUES
('Naruto', 'naruto', 'Naruto anime karakterleri', (SELECT id FROM categories WHERE slug = 'anime-figurler'), '🍜', 1),
('One Piece', 'one-piece', 'One Piece anime karakterleri', (SELECT id FROM categories WHERE slug = 'anime-figurler'), '🏴‍☠️', 2),
('Dragon Ball', 'dragon-ball', 'Dragon Ball anime karakterleri', (SELECT id FROM categories WHERE slug = 'anime-figurler'), '🐉', 3),
('League of Legends', 'league-of-legends', 'LoL karakter figürleri', (SELECT id FROM categories WHERE slug = 'oyun-figurler'), '⚔️', 1),
('World of Warcraft', 'world-of-warcraft', 'WoW karakter figürleri', (SELECT id FROM categories WHERE slug = 'oyun-figurler'), '🗡️', 2),
('Marvel', 'marvel', 'Marvel karakter figürleri', (SELECT id FROM categories WHERE slug = 'film-figurler'), '🦸', 1),
('DC Comics', 'dc-comics', 'DC karakter figürleri', (SELECT id FROM categories WHERE slug = 'film-figurler'), '🦇', 2);

-- Create admin user
INSERT INTO users (email, password_hash, first_name, last_name, is_email_verified, is_active) VALUES
('admin@tdcmarket.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', true, true);

-- Create sample seller
INSERT INTO users (email, password_hash, first_name, last_name, is_email_verified, is_active) VALUES
('seller@tdcmarket.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ahmet', 'Yılmaz', true, true);

INSERT INTO sellers (user_id, business_name, business_type, business_address, status, verification_status) VALUES
((SELECT id FROM users WHERE email = 'seller@tdcmarket.com'), 'Ahmet''in 3D Mağazası', 'individual', 
'{"address_line1": "Örnek Mahallesi", "city": "İstanbul", "state": "İstanbul", "postal_code": "34000", "country": "Turkey"}',
'approved', 'verified');

-- Create sample products
INSERT INTO products (seller_id, category_id, name, slug, description, price, stock_quantity, status, published_at) VALUES
((SELECT id FROM sellers WHERE business_name = 'Ahmet''in 3D Mağazası'), 
 (SELECT id FROM categories WHERE slug = 'naruto'),
 'Naruto Uzumaki Figürü', 'naruto-uzumaki-figuru', 
 'Naruto anime serisinin ana karakteri Naruto Uzumaki''nin detaylı 3D baskı figürü. 15cm yükseklik, yüksek kalite PLA malzeme.', 
 89.99, 50, 'active', NOW()),

((SELECT id FROM sellers WHERE business_name = 'Ahmet''in 3D Mağazası'), 
 (SELECT id FROM categories WHERE slug = 'one-piece'),
 'Monkey D. Luffy Figürü', 'monkey-d-luffy-figuru', 
 'One Piece serisinin ana karakteri Luffy''nin epik pozda 3D baskı figürü. 18cm yükseklik, dayanıklı ABS malzeme.', 
 129.99, 30, 'active', NOW()),

((SELECT id FROM sellers WHERE business_name = 'Ahmet''in 3D Mağazası'), 
 (SELECT id FROM categories WHERE slug = 'league-of-legends'),
 'Ahri Figürü', 'ahri-figuru', 
 'League of Legends''in popüler karakteri Ahri''nin zarif 3D baskı figürü. 20cm yükseklik, premium kalite malzeme.', 
 149.99, 25, 'active', NOW());

-- Update sequence numbers for order_number generation
CREATE SEQUENCE order_number_seq START 1000;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'TDC-' || LPAD(nextval('order_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed for your environment)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tdcmarket_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tdcmarket_user;
