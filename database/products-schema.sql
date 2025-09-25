-- Ürün Yönetimi Sistemi
-- E-ticaret ürünleri ve kategoriler

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    description TEXT,
    image_url TEXT,
    emoji VARCHAR(10) DEFAULT '📦',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    weight DECIMAL(8,3),
    dimensions JSONB, -- {length, width, height}
    images JSONB, -- Array of image URLs
    main_image TEXT,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'draft', 'archived'
    stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    track_inventory BOOLEAN DEFAULT true,
    allow_backorder BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_digital BOOLEAN DEFAULT false,
    download_url TEXT,
    seo_title VARCHAR(200),
    seo_description TEXT,
    seo_keywords TEXT,
    tags TEXT[],
    attributes JSONB, -- Custom product attributes
    variants JSONB, -- Product variants (size, color, etc.)
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ürün varyantları tablosu
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE,
    title VARCHAR(200) NOT NULL,
    price DECIMAL(10,2),
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    weight DECIMAL(8,3),
    dimensions JSONB,
    image_url TEXT,
    attributes JSONB, -- {size: 'L', color: 'Red'}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ürün görselleri tablosu
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(200),
    sort_order INTEGER DEFAULT 0,
    is_main BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ürün incelemeleri tablosu
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ürün inceleme yanıtları
CREATE TABLE IF NOT EXISTS product_review_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES product_reviews(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist tablosu
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customer_id, product_id)
);

-- Ürün etiketleri tablosu
CREATE TABLE IF NOT EXISTS product_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ürün-etiket ilişkisi
CREATE TABLE IF NOT EXISTS product_tag_relations (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES product_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, tag_id)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_customer_id ON product_reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_is_approved ON product_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_wishlists_customer_id ON wishlists(customer_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);

-- RLS politikaları
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_review_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tag_relations ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için tam erişim
CREATE POLICY "Admin full access to categories" ON categories FOR ALL USING (true);
CREATE POLICY "Admin full access to products" ON products FOR ALL USING (true);
CREATE POLICY "Admin full access to product_variants" ON product_variants FOR ALL USING (true);
CREATE POLICY "Admin full access to product_images" ON product_images FOR ALL USING (true);
CREATE POLICY "Admin full access to product_reviews" ON product_reviews FOR ALL USING (true);
CREATE POLICY "Admin full access to product_review_replies" ON product_review_replies FOR ALL USING (true);
CREATE POLICY "Admin full access to wishlists" ON wishlists FOR ALL USING (true);
CREATE POLICY "Admin full access to product_tags" ON product_tags FOR ALL USING (true);
CREATE POLICY "Admin full access to product_tag_relations" ON product_tag_relations FOR ALL USING (true);

-- Müşteriler için okuma erişimi (aktif ürünler)
CREATE POLICY "Customers can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Customers can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Customers can view approved reviews" ON product_reviews FOR SELECT USING (is_approved = true);

-- Müşteriler için wishlist yönetimi
CREATE POLICY "Customers can manage own wishlist" ON wishlists FOR ALL USING (auth.uid() = customer_id);

-- Müşteriler için inceleme yazma
CREATE POLICY "Customers can create reviews" ON product_reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can update own reviews" ON product_reviews FOR UPDATE USING (auth.uid() = customer_id);

-- Trigger: Güncelleme zamanını otomatik güncelle
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_products_updated_at();

CREATE TRIGGER trigger_update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_products_updated_at();

-- Trigger: Ana görseli otomatik ayarla
CREATE OR REPLACE FUNCTION set_main_product_image()
RETURNS TRIGGER AS $$
BEGIN
    -- Eğer ana görsel yoksa, ilk eklenen görseli ana yap
    IF NOT EXISTS (SELECT 1 FROM product_images WHERE product_id = NEW.product_id AND is_main = true) THEN
        UPDATE product_images SET is_main = true WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_main_product_image
    AFTER INSERT ON product_images
    FOR EACH ROW
    EXECUTE FUNCTION set_main_product_image();

-- Trigger: Stok seviyesi kontrolü
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Stok seviyesi düşükse bildirim gönder (burada sadece log)
    IF NEW.stock <= NEW.low_stock_threshold AND OLD.stock > OLD.low_stock_threshold THEN
        -- Burada bildirim sistemi entegre edilebilir
        RAISE NOTICE 'Low stock alert for product %: % units remaining', NEW.title, NEW.stock;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_low_stock
    AFTER UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION check_low_stock();
