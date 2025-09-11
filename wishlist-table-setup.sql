-- Wishlist tablosu oluşturma
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Index'ler oluşturma
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON wishlists(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_created_at ON wishlists(created_at);

-- RLS (Row Level Security) politikaları
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi wishlist'lerini görebilir
CREATE POLICY "Users can view their own wishlist" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

-- Kullanıcılar kendi wishlist'lerine ürün ekleyebilir
CREATE POLICY "Users can insert their own wishlist items" ON wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kullanıcılar kendi wishlist'lerinden ürün silebilir
CREATE POLICY "Users can delete their own wishlist items" ON wishlists
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger fonksiyonu - updated_at otomatik güncelleme
CREATE OR REPLACE FUNCTION update_wishlists_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger oluşturma
CREATE TRIGGER update_wishlists_updated_at_trigger
  BEFORE UPDATE ON wishlists
  FOR EACH ROW
  EXECUTE FUNCTION update_wishlists_updated_at();

-- Örnek veri ekleme (test için)
-- INSERT INTO wishlists (user_id, product_id) VALUES 
-- ('user-uuid-here', 'product-uuid-here');

-- Wishlist sayısını döndüren fonksiyon
CREATE OR REPLACE FUNCTION get_wishlist_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM wishlists 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kullanıcının wishlist'inde ürün var mı kontrol eden fonksiyon
CREATE OR REPLACE FUNCTION is_product_in_wishlist(user_uuid UUID, product_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 
    FROM wishlists 
    WHERE user_id = user_uuid AND product_id = product_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;





