-- E-commerce Schema for TDC Market
-- Categories, Products, Sellers, and related tables

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    meta_description TEXT,
    icon VARCHAR(50), -- Lucide icon name
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sellers table
CREATE TABLE IF NOT EXISTS sellers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    description TEXT,
    logo_url TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    policies JSONB DEFAULT '{}', -- shipping, returns, etc.
    badges TEXT[] DEFAULT '{}', -- verified, premium, etc.
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES sellers(id) ON DELETE SET NULL,
    brand VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    list_price DECIMAL(10,2), -- Original price for discounts
    currency VARCHAR(3) DEFAULT 'TRY',
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0,
    sku VARCHAR(100),
    images TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    attributes JSONB DEFAULT '{}', -- Size, color, material, etc.
    variants JSONB DEFAULT '{}', -- Product variations
    weight DECIMAL(8,2), -- in kg
    dimensions JSONB, -- {length, width, height} in cm
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID, -- References site_users or customers
    user_name VARCHAR(100),
    user_email VARCHAR(100),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product filters schema (for dynamic filtering)
CREATE TABLE IF NOT EXISTS product_filters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    filter_key VARCHAR(50) NOT NULL, -- brand, size, color, etc.
    filter_type VARCHAR(20) NOT NULL, -- select, multi, range, toggle
    filter_label VARCHAR(100) NOT NULL,
    filter_options JSONB DEFAULT '{}', -- Available options
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

CREATE INDEX IF NOT EXISTS idx_sellers_slug ON sellers(slug);
CREATE INDEX IF NOT EXISTS idx_sellers_is_active ON sellers(is_active);
CREATE INDEX IF NOT EXISTS idx_sellers_rating ON sellers(rating);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_is_approved ON product_reviews(is_approved);

CREATE INDEX IF NOT EXISTS idx_product_filters_category_id ON product_filters(category_id);

-- RLS policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_filters ENABLE ROW LEVEL SECURITY;

-- Public read access for active items
CREATE POLICY "Public read access to active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to active sellers" ON sellers FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to approved reviews" ON product_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read access to active filters" ON product_filters FOR SELECT USING (is_active = true);

-- Admin full access
CREATE POLICY "Admin full access to categories" ON categories FOR ALL USING (true);
CREATE POLICY "Admin full access to sellers" ON sellers FOR ALL USING (true);
CREATE POLICY "Admin full access to products" ON products FOR ALL USING (true);
CREATE POLICY "Admin full access to product_reviews" ON product_reviews FOR ALL USING (true);
CREATE POLICY "Admin full access to product_filters" ON product_filters FOR ALL USING (true);

-- Update triggers
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_sellers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_product_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_categories_updated_at();

CREATE TRIGGER trigger_update_sellers_updated_at
    BEFORE UPDATE ON sellers
    FOR EACH ROW
    EXECUTE FUNCTION update_sellers_updated_at();

CREATE TRIGGER trigger_update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_products_updated_at();

CREATE TRIGGER trigger_update_product_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_product_reviews_updated_at();
