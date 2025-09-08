-- Finans Sistemi Kurulumu
-- Bu script finans yönetimi için gerekli tabloları oluşturur

-- Siparişler tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  customer_address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method VARCHAR(50),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sipariş detayları tablosu
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID,
  product_name VARCHAR(255) NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Faturalar tablosu
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  order_id UUID REFERENCES orders(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_tax_number VARCHAR(50),
  subtotal DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 20.00, -- KDV oranı
  tax_amount DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  invoice_date DATE NOT NULL,
  due_date DATE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'cancelled')),
  payment_date DATE,
  notes TEXT,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fatura detayları tablosu
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Giderler tablosu
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_number VARCHAR(50) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'vergi', 'maas', 'sgk', 'kira', 'elektrik', 'su', 'internet', 'diger'
  subcategory VARCHAR(100), -- 'gelir_vergisi', 'kurumlar_vergisi', 'kdv', 'otv' vb.
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  payment_method VARCHAR(50), -- 'nakit', 'banka', 'kredi_karti'
  payment_reference VARCHAR(255), -- Fatura numarası, dekont numarası vb.
  supplier_name VARCHAR(255), -- Tedarikçi/ödeme yapılan kişi
  supplier_tax_number VARCHAR(50),
  is_recurring BOOLEAN DEFAULT false, -- Tekrarlanan gider mi?
  recurring_frequency VARCHAR(20), -- 'monthly', 'yearly', 'quarterly'
  status VARCHAR(20) DEFAULT 'paid' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gelirler tablosu (faturalı satışlar için)
CREATE TABLE IF NOT EXISTS revenues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  revenue_number VARCHAR(50) UNIQUE NOT NULL,
  invoice_id UUID REFERENCES invoices(id),
  order_id UUID REFERENCES orders(id),
  customer_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL,
  net_amount DECIMAL(10,2) NOT NULL, -- Vergi hariç tutar
  revenue_date DATE NOT NULL,
  payment_date DATE,
  status VARCHAR(20) DEFAULT 'received' CHECK (status IN ('pending', 'received', 'cancelled')),
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finansal raporlar tablosu
CREATE TABLE IF NOT EXISTS financial_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type VARCHAR(50) NOT NULL, -- 'monthly', 'yearly', 'quarterly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_revenue DECIMAL(10,2) NOT NULL,
  total_expenses DECIMAL(10,2) NOT NULL,
  net_profit DECIMAL(10,2) NOT NULL,
  profit_margin DECIMAL(5,2) NOT NULL, -- Kar marjı yüzdesi
  report_data JSONB, -- Detaylı rapor verileri
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_revenues_revenue_date ON revenues(revenue_date);
CREATE INDEX IF NOT EXISTS idx_financial_reports_period ON financial_reports(period_start, period_end);

-- RLS (Row Level Security) etkinleştir
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_reports ENABLE ROW LEVEL SECURITY;

-- Policy'ler (Admin kullanıcıları tüm finansal verilere erişebilir)
CREATE POLICY "Admin users can manage orders" ON orders FOR ALL USING (true);
CREATE POLICY "Admin users can manage order_items" ON order_items FOR ALL USING (true);
CREATE POLICY "Admin users can manage invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Admin users can manage invoice_items" ON invoice_items FOR ALL USING (true);
CREATE POLICY "Admin users can manage expenses" ON expenses FOR ALL USING (true);
CREATE POLICY "Admin users can manage revenues" ON revenues FOR ALL USING (true);
CREATE POLICY "Admin users can manage financial_reports" ON financial_reports FOR ALL USING (true);

-- Trigger'lar için fonksiyon
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ları oluştur
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at 
  BEFORE UPDATE ON invoices 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at 
  BEFORE UPDATE ON expenses 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_revenues_updated_at ON revenues;
CREATE TRIGGER update_revenues_updated_at 
  BEFORE UPDATE ON revenues 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Örnek gider kategorileri ekle
INSERT INTO expenses (expense_number, category, subcategory, description, amount, expense_date, supplier_name, created_by) VALUES
('EXP-2024-001', 'vergi', 'gelir_vergisi', 'Aylık gelir vergisi ödemesi', 5000.00, CURRENT_DATE, 'Vergi Dairesi', (SELECT id FROM admin_users WHERE email = 'bentahasarii@gmail.com' LIMIT 1)),
('EXP-2024-002', 'vergi', 'kurumlar_vergisi', 'Kurumlar vergisi ödemesi', 15000.00, CURRENT_DATE, 'Vergi Dairesi', (SELECT id FROM admin_users WHERE email = 'bentahasarii@gmail.com' LIMIT 1)),
('EXP-2024-003', 'maas', 'personel_maasi', 'Personel maaşları', 25000.00, CURRENT_DATE, 'Personel', (SELECT id FROM admin_users WHERE email = 'bentahasarii@gmail.com' LIMIT 1)),
('EXP-2024-004', 'sgk', 'sgk_primleri', 'SGK işveren primleri', 7500.00, CURRENT_DATE, 'SGK', (SELECT id FROM admin_users WHERE email = 'bentahasarii@gmail.com' LIMIT 1))
ON CONFLICT (expense_number) DO NOTHING;
