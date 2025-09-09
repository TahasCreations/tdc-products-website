-- Gelişmiş Muhasebe Sistemi - TDC Products
-- Bu script muhasebe modülü için gerekli tabloları oluşturur

-- 1. Şirketler tablosu (çok şirket desteği)
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  tax_number VARCHAR(50) UNIQUE,
  tax_office VARCHAR(100),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  currency_base VARCHAR(3) DEFAULT 'TRY', -- Ana para birimi
  fiscal_year_start DATE DEFAULT '2024-01-01',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Hesap planı tablosu
CREATE TABLE IF NOT EXISTS accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  code VARCHAR(20) NOT NULL, -- Hesap kodu (100, 101, 120, vb.)
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
  parent_id UUID REFERENCES accounts(id), -- Hiyerarşik yapı
  level INTEGER DEFAULT 1, -- Seviye (1=ana hesap, 2=alt hesap)
  is_active BOOLEAN DEFAULT true,
  is_leaf BOOLEAN DEFAULT true, -- Yaprak hesap mı?
  balance_type VARCHAR(10) DEFAULT 'DEBIT' CHECK (balance_type IN ('DEBIT', 'CREDIT')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, code)
);

-- 3. Yevmiye fişleri (Journal Entries)
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  no VARCHAR(50) NOT NULL, -- Fiş numarası
  description TEXT,
  period VARCHAR(7) NOT NULL, -- YYYY-MM formatında
  status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'POSTED', 'REVERSED')),
  total_debit DECIMAL(15,2) DEFAULT 0,
  total_credit DECIMAL(15,2) DEFAULT 0,
  created_by UUID, -- Admin user ID
  posted_by UUID,
  posted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, no)
);

-- 4. Yevmiye satırları (Journal Lines)
CREATE TABLE IF NOT EXISTS journal_lines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,
  account_id UUID REFERENCES accounts(id),
  debit DECIMAL(15,2) DEFAULT 0,
  credit DECIMAL(15,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'TRY',
  fx_rate DECIMAL(10,4) DEFAULT 1.0000,
  amount_base DECIMAL(15,2) DEFAULT 0, -- Baz para biriminde tutar
  description TEXT,
  aux_ref VARCHAR(100), -- Yardımcı referans
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Cari hesaplar (Müşteri/Tedarikçi)
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('CUSTOMER', 'SUPPLIER', 'OTHER')),
  code VARCHAR(50), -- Cari kodu
  name VARCHAR(255) NOT NULL,
  tax_number VARCHAR(50),
  tax_office VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Türkiye',
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  credit_limit DECIMAL(15,2) DEFAULT 0,
  payment_terms VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Faturalar
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  date DATE NOT NULL,
  due_date DATE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('SALE', 'PURCHASE', 'RETURN')),
  status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'PAID', 'CANCELLED')),
  invoice_number VARCHAR(50) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  fx_rate DECIMAL(10,4) DEFAULT 1.0000,
  subtotal DECIMAL(15,2) DEFAULT 0,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  total DECIMAL(15,2) DEFAULT 0,
  total_base DECIMAL(15,2) DEFAULT 0, -- Baz para biriminde toplam
  kdv_sum DECIMAL(15,2) DEFAULT 0, -- KDV toplamı
  withhold_sum DECIMAL(15,2) DEFAULT 0, -- Tevkifat toplamı
  e_tag VARCHAR(100), -- e-Fatura etag
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, invoice_number)
);

-- 7. Fatura satırları
CREATE TABLE IF NOT EXISTS invoice_lines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  stock_id UUID, -- Stok referansı (opsiyonel)
  description TEXT NOT NULL,
  qty DECIMAL(10,3) DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  kdv_rate DECIMAL(5,2) DEFAULT 0, -- KDV oranı %
  kdv_amount DECIMAL(15,2) DEFAULT 0,
  withhold_rate DECIMAL(5,2) DEFAULT 0, -- Tevkifat oranı %
  withhold_amount DECIMAL(15,2) DEFAULT 0,
  total_line DECIMAL(15,2) NOT NULL,
  accounts_map JSONB, -- Hesap eşleştirmesi {revenue: '600', tax: '191', etc.}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Stok kalemleri
CREATE TABLE IF NOT EXISTS stock_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  sku VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(20) DEFAULT 'adet',
  tracking VARCHAR(20) DEFAULT 'NONE' CHECK (tracking IN ('NONE', 'SERIAL', 'BATCH')),
  accounts JSONB, -- Hesap eşleştirmesi {asset: '153', cogs: '621', etc.}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, sku)
);

-- 9. Stok hareketleri
CREATE TABLE IF NOT EXISTS inventory_txns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  stock_id UUID REFERENCES stock_items(id),
  date DATE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('IN', 'OUT', 'ADJUST')),
  qty DECIMAL(10,3) NOT NULL,
  cost DECIMAL(15,2) DEFAULT 0,
  warehouse_id UUID, -- Depo referansı
  ref_type VARCHAR(50), -- Referans tipi (INVOICE, JOURNAL, etc.)
  ref_id UUID, -- Referans ID
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Kasa hesapları
CREATE TABLE IF NOT EXISTS cashboxes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Kasa hareketleri
CREATE TABLE IF NOT EXISTS cash_txns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cashbox_id UUID REFERENCES cashboxes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('IN', 'OUT')),
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  fx_rate DECIMAL(10,4) DEFAULT 1.0000,
  amount_base DECIMAL(15,2) NOT NULL,
  ref_type VARCHAR(50), -- Referans tipi
  ref_id UUID, -- Referans ID
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Banka hesapları
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  iban VARCHAR(34) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  account_name VARCHAR(255),
  currency VARCHAR(3) DEFAULT 'TRY',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Banka hareketleri
CREATE TABLE IF NOT EXISTS bank_txns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('IN', 'OUT', 'FEE', 'INTEREST')),
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  fx_rate DECIMAL(10,4) DEFAULT 1.0000,
  amount_base DECIMAL(15,2) NOT NULL,
  ref_type VARCHAR(50), -- Referans tipi
  ref_id UUID, -- Referans ID
  statement_ref VARCHAR(100), -- Ekstre referansı
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Vergi ayarları
CREATE TABLE IF NOT EXISTS tax_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  kdv_rates JSONB DEFAULT '{"1": 1, "10": 10, "20": 20}', -- KDV oranları
  withholding_presets JSONB DEFAULT '{"20": 20, "10": 10, "5": 5}', -- Tevkifat presetleri
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Dönem kilitleme
CREATE TABLE IF NOT EXISTS period_locks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  period VARCHAR(7) NOT NULL, -- YYYY-MM formatında
  locked_by UUID, -- Admin user ID
  locked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, period)
);

-- 16. Audit log
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  actor_id UUID, -- Admin user ID
  action VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, POST, REVERSE
  entity VARCHAR(50) NOT NULL, -- Tablo adı
  entity_id UUID NOT NULL,
  diff_json JSONB, -- Değişiklik detayları
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_accounts_company_code ON accounts(company_id, code);
CREATE INDEX IF NOT EXISTS idx_journal_entries_company_period ON journal_entries(company_id, period);
CREATE INDEX IF NOT EXISTS idx_journal_lines_account ON journal_lines(account_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_date ON invoices(company_id, date);
CREATE INDEX IF NOT EXISTS idx_contacts_company_type ON contacts(company_id, type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_company_entity ON audit_logs(company_id, entity, entity_id);

-- RLS (Row Level Security) aktif et
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_txns ENABLE ROW LEVEL SECURITY;
ALTER TABLE cashboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_txns ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_txns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE period_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Politikaları (Service role full access)
CREATE POLICY "Service role full access" ON companies FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON accounts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON journal_entries FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON journal_lines FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON contacts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON invoices FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON invoice_lines FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON stock_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON inventory_txns FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON cashboxes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON cash_txns FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON bank_accounts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON bank_txns FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON tax_configs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON period_locks FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON audit_logs FOR ALL USING (auth.role() = 'service_role');

-- Updated_at trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Updated_at trigger'ları
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stock_items_updated_at BEFORE UPDATE ON stock_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cashboxes_updated_at BEFORE UPDATE ON cashboxes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_configs_updated_at BEFORE UPDATE ON tax_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Journal entry balance check trigger
CREATE OR REPLACE FUNCTION check_journal_balance()
RETURNS TRIGGER AS $$
BEGIN
    -- Sadece POSTED durumunda kontrol et
    IF NEW.status = 'POSTED' AND (NEW.total_debit != NEW.total_credit) THEN
        RAISE EXCEPTION 'Journal entry must be balanced: debit % != credit %', NEW.total_debit, NEW.total_credit;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER check_journal_balance_trigger 
    BEFORE UPDATE ON journal_entries 
    FOR EACH ROW EXECUTE FUNCTION check_journal_balance();
