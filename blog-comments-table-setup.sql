-- Blog Yorumları Tablosu Kurulumu
-- Bu script blog yorumları sistemi için gerekli tabloyu oluşturur

-- Yorumlar tablosu
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
    parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE, -- Yanıt yorumları için
    ip_address INET, -- Spam koruması için
    user_agent TEXT, -- Tarayıcı bilgisi
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);

-- Yorum beğenileri tablosu
CREATE TABLE IF NOT EXISTS comment_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES blog_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(10) NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(comment_id, user_id, reaction_type)
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_user_id ON comment_reactions(user_id);

-- Yorum spam koruması için rate limiting tablosu
CREATE TABLE IF NOT EXISTS comment_rate_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ip_address INET NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    comment_count INTEGER DEFAULT 1,
    last_comment_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_comment_rate_limits_ip ON comment_rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_comment_rate_limits_user ON comment_rate_limits(user_id);

-- RLS (Row Level Security) politikaları
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_rate_limits ENABLE ROW LEVEL SECURITY;

-- Blog yorumları için RLS politikaları
CREATE POLICY "Yorumları herkes okuyabilir" ON blog_comments
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Kullanıcılar yorum yazabilir" ON blog_comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Kullanıcılar kendi yorumlarını düzenleyebilir" ON blog_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Adminler tüm yorumları yönetebilir" ON blog_comments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Yorum beğenileri için RLS politikaları
CREATE POLICY "Beğenileri herkes okuyabilir" ON comment_reactions
    FOR SELECT USING (true);

CREATE POLICY "Kullanıcılar beğeni ekleyebilir" ON comment_reactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi beğenilerini düzenleyebilir" ON comment_reactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Kullanıcılar kendi beğenilerini silebilir" ON comment_reactions
    FOR DELETE USING (auth.uid() = user_id);

-- Rate limiting için RLS politikaları
CREATE POLICY "Rate limiting sadece sistem tarafından yönetilir" ON comment_rate_limits
    FOR ALL USING (false);

-- Trigger fonksiyonu - yorum onaylandığında blog'a yorum sayısını ekle
CREATE OR REPLACE FUNCTION update_blog_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Yeni yorum eklendiğinde
        UPDATE blogs 
        SET comment_count = COALESCE(comment_count, 0) + 1
        WHERE id = NEW.blog_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Yorum durumu değiştiğinde
        IF OLD.status != NEW.status THEN
            IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
                -- Yorum onaylandı
                UPDATE blogs 
                SET comment_count = COALESCE(comment_count, 0) + 1
                WHERE id = NEW.blog_id;
            ELSIF OLD.status = 'approved' AND NEW.status != 'approved' THEN
                -- Yorum onayı kaldırıldı
                UPDATE blogs 
                SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
                WHERE id = NEW.blog_id;
            END IF;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Yorum silindiğinde
        UPDATE blogs 
        SET comment_count = GREATEST(COALESCE(comment_count, 0) - 1, 0)
        WHERE id = OLD.blog_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger oluştur
CREATE TRIGGER trigger_update_blog_comment_count
    AFTER INSERT OR UPDATE OR DELETE ON blog_comments
    FOR EACH ROW EXECUTE FUNCTION update_blog_comment_count();

-- Trigger fonksiyonu - beğeni sayılarını güncelle
CREATE OR REPLACE FUNCTION update_comment_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Yeni beğeni eklendiğinde
        IF NEW.reaction_type = 'like' THEN
            UPDATE blog_comments 
            SET likes_count = COALESCE(likes_count, 0) + 1
            WHERE id = NEW.comment_id;
        ELSIF NEW.reaction_type = 'dislike' THEN
            UPDATE blog_comments 
            SET dislikes_count = COALESCE(dislikes_count, 0) + 1
            WHERE id = NEW.comment_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Beğeni türü değiştiğinde
        IF OLD.reaction_type != NEW.reaction_type THEN
            -- Eski beğeniyi çıkar
            IF OLD.reaction_type = 'like' THEN
                UPDATE blog_comments 
                SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
                WHERE id = OLD.comment_id;
            ELSIF OLD.reaction_type = 'dislike' THEN
                UPDATE blog_comments 
                SET dislikes_count = GREATEST(COALESCE(dislikes_count, 0) - 1, 0)
                WHERE id = OLD.comment_id;
            END IF;
            
            -- Yeni beğeniyi ekle
            IF NEW.reaction_type = 'like' THEN
                UPDATE blog_comments 
                SET likes_count = COALESCE(likes_count, 0) + 1
                WHERE id = NEW.comment_id;
            ELSIF NEW.reaction_type = 'dislike' THEN
                UPDATE blog_comments 
                SET dislikes_count = COALESCE(dislikes_count, 0) + 1
                WHERE id = NEW.comment_id;
            END IF;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Beğeni silindiğinde
        IF OLD.reaction_type = 'like' THEN
            UPDATE blog_comments 
            SET likes_count = GREATEST(COALESCE(likes_count, 0) - 1, 0)
            WHERE id = OLD.comment_id;
        ELSIF OLD.reaction_type = 'dislike' THEN
            UPDATE blog_comments 
            SET dislikes_count = GREATEST(COALESCE(dislikes_count, 0) - 1, 0)
            WHERE id = OLD.comment_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger oluştur
CREATE TRIGGER trigger_update_comment_reaction_counts
    AFTER INSERT OR UPDATE OR DELETE ON comment_reactions
    FOR EACH ROW EXECUTE FUNCTION update_comment_reaction_counts();

-- Blogs tablosuna comment_count kolonu ekle (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blogs' AND column_name = 'comment_count'
    ) THEN
        ALTER TABLE blogs ADD COLUMN comment_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Örnek veri ekleme (test için)
INSERT INTO blog_comments (blog_id, user_id, author_name, content, status, created_at)
SELECT 
    b.id,
    u.id,
    u.raw_user_meta_data->>'full_name' as author_name,
    'Bu harika bir blog yazısı! Çok faydalı bilgiler var.' as content,
    'approved' as status,
    NOW() - INTERVAL '1 day' as created_at
FROM blogs b
CROSS JOIN auth.users u
WHERE u.raw_user_meta_data->>'role' = 'admin'
LIMIT 3;

-- Başarı mesajı
SELECT 'Blog yorumları sistemi başarıyla kuruldu!' as message;
