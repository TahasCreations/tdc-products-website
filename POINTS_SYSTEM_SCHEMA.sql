-- TDC Products - Advanced Points & Rewards System
-- Google Cloud SQL Console'da çalıştırın

-- ============================================
-- 1. ENUM TYPES
-- ============================================

DO $$ BEGIN
    CREATE TYPE "TaskType" AS ENUM (
        'FIRST_PURCHASE',        -- İlk alışveriş
        'DAILY_LOGIN',           -- Günlük giriş
        'PROFILE_COMPLETE',      -- Profil tamamlama
        'EMAIL_VERIFY',          -- Email doğrulama
        'PHONE_VERIFY',          -- Telefon doğrulama
        'REVIEW_PRODUCT',        -- Ürün yorumu
        'SHARE_SOCIAL',          -- Sosyal medya paylaşımı
        'REFERRAL',              -- Arkadaş davet
        'PURCHASE_AMOUNT',       -- Belirli tutar alışveriş
        'STREAK_LOGIN',          -- Ardışık gün girişi
        'FOLLOW_SOCIAL',         -- Sosyal medya takip
        'WATCH_VIDEO',           -- Video izleme
        'SURVEY_COMPLETE'        -- Anket doldurma
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TaskStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'EXPIRED', 'CLAIMED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TransactionType" AS ENUM (
        'EARN',                  -- Puan kazanma
        'REDEEM',                -- Puan harcama
        'EXPIRE',                -- Puan süresi dolma
        'REFUND',                -- İade
        'BONUS',                 -- Bonus
        'PENALTY'                -- Ceza
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "RewardType" AS ENUM ('DISCOUNT', 'CASHBACK', 'FREE_SHIPPING', 'GIFT', 'VOUCHER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 2. USER POINTS (Kullanıcı Puanları)
-- ============================================

CREATE TABLE IF NOT EXISTS "UserPoints" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "totalPoints" INTEGER DEFAULT 0,           -- Toplam kazanılan puan
    "availablePoints" INTEGER DEFAULT 0,       -- Kullanılabilir puan
    "lifetimePoints" INTEGER DEFAULT 0,        -- Tüm zamanlar puanı
    "level" INTEGER DEFAULT 1,                 -- Kullanıcı seviyesi
    "tier" TEXT DEFAULT 'BRONZE',              -- Tier: BRONZE, SILVER, GOLD, PLATINUM
    "streakDays" INTEGER DEFAULT 0,            -- Ardışık giriş günü
    "lastLoginDate" TIMESTAMP,                 -- Son giriş tarihi
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId")
);

-- ============================================
-- 3. TASKS (Görevler)
-- ============================================

CREATE TABLE IF NOT EXISTS "Task" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "type" "TaskType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "points" INTEGER NOT NULL,                 -- Kazanılacak puan
    "icon" TEXT,                               -- Görev ikonu
    "requirement" INTEGER DEFAULT 1,           -- Gereksinim (örn: 5 ürün yorumu)
    "isRepeatable" BOOLEAN DEFAULT false,      -- Tekrar edilebilir mi?
    "repeatInterval" TEXT,                     -- daily, weekly, monthly
    "isActive" BOOLEAN DEFAULT true,
    "startDate" TIMESTAMP,
    "endDate" TIMESTAMP,
    "order" INTEGER DEFAULT 0,                 -- Sıralama
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 4. USER TASKS (Kullanıcı Görevleri)
-- ============================================

CREATE TABLE IF NOT EXISTS "UserTask" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "taskId" TEXT NOT NULL REFERENCES "Task"("id") ON DELETE CASCADE,
    "status" "TaskStatus" DEFAULT 'ACTIVE',
    "progress" INTEGER DEFAULT 0,              -- İlerleme (örn: 3/5 yorum)
    "completedAt" TIMESTAMP,
    "claimedAt" TIMESTAMP,
    "expiresAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 5. POINTS TRANSACTIONS (Puan İşlemleri)
-- ============================================

CREATE TABLE IF NOT EXISTS "PointsTransaction" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "type" "TransactionType" NOT NULL,
    "points" INTEGER NOT NULL,                 -- Pozitif veya negatif
    "balance" INTEGER NOT NULL,                -- İşlem sonrası bakiye
    "description" TEXT,
    "reference" TEXT,                          -- Referans ID (order, task vb.)
    "referenceType" TEXT,                      -- order, task, withdrawal vb.
    "metadata" JSONB,                          -- Ek bilgiler
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 6. REWARDS (Ödüller)
-- ============================================

CREATE TABLE IF NOT EXISTS "Reward" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "type" "RewardType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "pointsCost" INTEGER NOT NULL,            -- Puan maliyeti
    "value" DECIMAL(10,2),                    -- Değer (TL cinsinden)
    "discountPercent" INTEGER,                -- İndirim yüzdesi
    "code" TEXT,                              -- Kupon kodu
    "stock" INTEGER DEFAULT -1,               -- Stok (-1: sınırsız)
    "usageLimit" INTEGER DEFAULT 1,           -- Kullanım limiti
    "isActive" BOOLEAN DEFAULT true,
    "validFrom" TIMESTAMP,
    "validUntil" TIMESTAMP,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 7. USER REWARDS (Kullanıcı Ödülleri)
-- ============================================

CREATE TABLE IF NOT EXISTS "UserReward" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "rewardId" TEXT NOT NULL REFERENCES "Reward"("id") ON DELETE CASCADE,
    "code" TEXT UNIQUE,                       -- Benzersiz kullanım kodu
    "isUsed" BOOLEAN DEFAULT false,
    "usedAt" TIMESTAMP,
    "expiresAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 8. WITHDRAWALS (Para Çekme)
-- ============================================

CREATE TABLE IF NOT EXISTS "Withdrawal" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "points" INTEGER NOT NULL,                -- Kullanılan puan
    "amount" DECIMAL(10,2) NOT NULL,          -- TL cinsinden tutar
    "rate" DECIMAL(10,2) NOT NULL,            -- Dönüşüm oranı (örn: 100 puan = 1 TL)
    "status" "WithdrawalStatus" DEFAULT 'PENDING',
    "method" TEXT,                            -- IBAN, PayPal, vb.
    "accountDetails" JSONB,                   -- Hesap bilgileri
    "notes" TEXT,
    "processedBy" TEXT,                       -- Admin ID
    "processedAt" TIMESTAMP,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 9. POINT SETTINGS (Sistem Ayarları)
-- ============================================

CREATE TABLE IF NOT EXISTS "PointSettings" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "key" TEXT UNIQUE NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Varsayılan ayarları ekle
INSERT INTO "PointSettings" ("id", "key", "value", "description") VALUES
    (gen_random_uuid()::text, 'POINTS_TO_TL_RATE', '100', '100 puan = 1 TL'),
    (gen_random_uuid()::text, 'MIN_WITHDRAWAL_POINTS', '1000', 'Minimum çekim: 1000 puan'),
    (gen_random_uuid()::text, 'MAX_WITHDRAWAL_AMOUNT', '1000', 'Maksimum çekim: 1000 TL'),
    (gen_random_uuid()::text, 'POINT_EXPIRY_DAYS', '365', 'Puanların geçerlilik süresi'),
    (gen_random_uuid()::text, 'DAILY_LOGIN_POINTS', '10', 'Günlük giriş puanı'),
    (gen_random_uuid()::text, 'REFERRAL_POINTS', '500', 'Arkadaş davet puanı'),
    (gen_random_uuid()::text, 'REVIEW_POINTS', '50', 'Ürün yorumu puanı'),
    (gen_random_uuid()::text, 'PURCHASE_POINTS_RATE', '1', 'Her 1 TL için 1 puan')
ON CONFLICT ("key") DO NOTHING;

-- ============================================
-- 10. INDEXES (Performans için)
-- ============================================

CREATE INDEX IF NOT EXISTS "idx_userpoints_userid" ON "UserPoints"("userId");
CREATE INDEX IF NOT EXISTS "idx_usertask_userid" ON "UserTask"("userId");
CREATE INDEX IF NOT EXISTS "idx_usertask_taskid" ON "UserTask"("taskId");
CREATE INDEX IF NOT EXISTS "idx_usertask_status" ON "UserTask"("status");
CREATE INDEX IF NOT EXISTS "idx_pointstransaction_userid" ON "PointsTransaction"("userId");
CREATE INDEX IF NOT EXISTS "idx_pointstransaction_type" ON "PointsTransaction"("type");
CREATE INDEX IF NOT EXISTS "idx_pointstransaction_created" ON "PointsTransaction"("createdAt");
CREATE INDEX IF NOT EXISTS "idx_userreward_userid" ON "UserReward"("userId");
CREATE INDEX IF NOT EXISTS "idx_withdrawal_userid" ON "Withdrawal"("userId");
CREATE INDEX IF NOT EXISTS "idx_withdrawal_status" ON "Withdrawal"("status");

-- ============================================
-- 11. INITIAL TASKS (Başlangıç Görevleri)
-- ============================================

INSERT INTO "Task" ("id", "type", "title", "description", "points", "icon", "requirement", "isRepeatable", "repeatInterval", "isActive") VALUES
    (gen_random_uuid()::text, 'EMAIL_VERIFY', 'E-posta Doğrula', 'E-posta adresinizi doğrulayın', 100, '📧', 1, false, null, true),
    (gen_random_uuid()::text, 'PHONE_VERIFY', 'Telefon Doğrula', 'Telefon numaranızı doğrulayın', 100, '📱', 1, false, null, true),
    (gen_random_uuid()::text, 'PROFILE_COMPLETE', 'Profili Tamamla', 'Profil bilgilerinizi tamamlayın', 200, '👤', 1, false, null, true),
    (gen_random_uuid()::text, 'FIRST_PURCHASE', 'İlk Alışveriş', 'İlk alışverişinizi yapın', 500, '🛍️', 1, false, null, true),
    (gen_random_uuid()::text, 'DAILY_LOGIN', 'Günlük Giriş', 'Her gün giriş yapın', 10, '⭐', 1, true, 'daily', true),
    (gen_random_uuid()::text, 'REVIEW_PRODUCT', 'Ürün Yorumu', '5 ürüne yorum yapın', 250, '💬', 5, false, null, true),
    (gen_random_uuid()::text, 'REFERRAL', 'Arkadaş Davet', 'Bir arkadaşınızı davet edin', 500, '🎁', 1, true, null, true),
    (gen_random_uuid()::text, 'FOLLOW_SOCIAL', 'Sosyal Medya Takip', 'Bizi sosyal medyada takip edin', 50, '📱', 1, false, null, true),
    (gen_random_uuid()::text, 'STREAK_LOGIN', '7 Gün Ardışık Giriş', '7 gün üst üste giriş yapın', 300, '🔥', 7, false, null, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 12. SAMPLE REWARDS (Örnek Ödüller)
-- ============================================

INSERT INTO "Reward" ("id", "type", "title", "description", "pointsCost", "value", "discountPercent", "stock", "isActive") VALUES
    (gen_random_uuid()::text, 'DISCOUNT', '%10 İndirim Kuponu', 'Tüm ürünlerde %10 indirim', 500, 0, 10, -1, true),
    (gen_random_uuid()::text, 'DISCOUNT', '%20 İndirim Kuponu', 'Tüm ürünlerde %20 indirim', 1000, 0, 20, -1, true),
    (gen_random_uuid()::text, 'CASHBACK', '10 TL İndirim', '10 TL değerinde indirim', 1000, 10, 0, -1, true),
    (gen_random_uuid()::text, 'CASHBACK', '25 TL İndirim', '25 TL değerinde indirim', 2500, 25, 0, -1, true),
    (gen_random_uuid()::text, 'FREE_SHIPPING', 'Ücretsiz Kargo', 'Bir sonraki siparişinizde ücretsiz kargo', 300, 0, 0, -1, true)
ON CONFLICT DO NOTHING;

COMMIT;

