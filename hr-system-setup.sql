-- İnsan Kaynakları Sistemi
-- Bu script HR yönetimi için gerekli tabloları oluşturur

-- Departmanlar tablosu
CREATE TABLE IF NOT EXISTS departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL, -- Departman kodu
  description TEXT,
  manager_id UUID REFERENCES admin_users(id), -- Departman müdürü
  budget DECIMAL(12,2), -- Departman bütçesi
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pozisyonlar tablosu
CREATE TABLE IF NOT EXISTS positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL, -- Pozisyon kodu
  department_id UUID REFERENCES departments(id),
  description TEXT,
  requirements TEXT, -- Gereksinimler
  responsibilities TEXT, -- Sorumluluklar
  min_salary DECIMAL(10,2), -- Minimum maaş
  max_salary DECIMAL(10,2), -- Maksimum maaş
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Çalışanlar tablosu
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_number VARCHAR(20) UNIQUE NOT NULL, -- Çalışan numarası
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  mobile VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  postal_code VARCHAR(20),
  birth_date DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  marital_status VARCHAR(20) CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  nationality VARCHAR(100) DEFAULT 'Türk',
  
  -- İş bilgileri
  department_id UUID REFERENCES departments(id),
  position_id UUID REFERENCES positions(id),
  manager_id UUID REFERENCES employees(id), -- Üst yönetici
  employment_type VARCHAR(20) DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'intern')),
  employment_status VARCHAR(20) DEFAULT 'active' CHECK (employment_status IN ('active', 'inactive', 'terminated', 'on_leave')),
  hire_date DATE NOT NULL,
  termination_date DATE,
  probation_end_date DATE, -- Deneme süresi bitiş tarihi
  
  -- Maaş bilgileri
  base_salary DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  payment_frequency VARCHAR(20) DEFAULT 'monthly' CHECK (payment_frequency IN ('monthly', 'weekly', 'daily')),
  bank_account VARCHAR(50), -- Banka hesap numarası
  iban VARCHAR(34), -- IBAN
  
  -- SGK bilgileri
  sgk_number VARCHAR(20), -- SGK sicil numarası
  sgk_start_date DATE, -- SGK başlangıç tarihi
  
  -- Kimlik bilgileri
  tc_number VARCHAR(11), -- TC kimlik numarası
  passport_number VARCHAR(50), -- Pasaport numarası
  
  -- Acil durum iletişim
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(50),
  
  -- Sistem bilgileri
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

-- Maaş Bordroları tablosu
CREATE TABLE IF NOT EXISTS payrolls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  payroll_period VARCHAR(20) NOT NULL, -- 2024-01, 2024-02 formatında
  base_salary DECIMAL(10,2) NOT NULL,
  
  -- Gelirler
  overtime_pay DECIMAL(10,2) DEFAULT 0, -- Mesai ücreti
  bonus DECIMAL(10,2) DEFAULT 0, -- Prim
  commission DECIMAL(10,2) DEFAULT 0, -- Komisyon
  allowance DECIMAL(10,2) DEFAULT 0, -- Yol, yemek vb. ödenekler
  other_income DECIMAL(10,2) DEFAULT 0, -- Diğer gelirler
  
  -- Kesintiler
  income_tax DECIMAL(10,2) DEFAULT 0, -- Gelir vergisi
  stamp_tax DECIMAL(10,2) DEFAULT 0, -- Damga vergisi
  sgk_employee DECIMAL(10,2) DEFAULT 0, -- SGK işçi payı
  sgk_employer DECIMAL(10,2) DEFAULT 0, -- SGK işveren payı
  unemployment_employee DECIMAL(10,2) DEFAULT 0, -- İşsizlik işçi payı
  unemployment_employer DECIMAL(10,2) DEFAULT 0, -- İşsizlik işveren payı
  other_deductions DECIMAL(10,2) DEFAULT 0, -- Diğer kesintiler
  
  -- Hesaplanan tutarlar
  gross_salary DECIMAL(10,2) NOT NULL, -- Brüt maaş
  total_deductions DECIMAL(10,2) NOT NULL, -- Toplam kesintiler
  net_salary DECIMAL(10,2) NOT NULL, -- Net maaş
  
  -- Durum
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'paid')),
  payment_date DATE,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

-- İzin Türleri tablosu
CREATE TABLE IF NOT EXISTS leave_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  description TEXT,
  max_days_per_year INTEGER, -- Yıllık maksimum gün
  is_paid BOOLEAN DEFAULT true, -- Ücretli mi?
  requires_approval BOOLEAN DEFAULT true, -- Onay gerekiyor mu?
  advance_notice_days INTEGER DEFAULT 0, -- Kaç gün önceden bildirim
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İzin Talepleri tablosu
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id UUID REFERENCES leave_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by UUID REFERENCES admin_users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İzin Kullanımları tablosu
CREATE TABLE IF NOT EXISTS leave_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id UUID REFERENCES leave_types(id),
  year INTEGER NOT NULL,
  used_days INTEGER DEFAULT 0,
  remaining_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(employee_id, leave_type_id, year)
);

-- Performans Değerlendirmeleri tablosu
CREATE TABLE IF NOT EXISTS performance_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  review_period VARCHAR(20) NOT NULL, -- 2024-Q1, 2024-Q2 formatında
  reviewer_id UUID REFERENCES admin_users(id), -- Değerlendiren kişi
  
  -- Değerlendirme kriterleri (1-5 arası puan)
  work_quality INTEGER CHECK (work_quality >= 1 AND work_quality <= 5),
  productivity INTEGER CHECK (productivity >= 1 AND productivity <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  teamwork INTEGER CHECK (teamwork >= 1 AND teamwork <= 5),
  leadership INTEGER CHECK (leadership >= 1 AND leadership <= 5),
  problem_solving INTEGER CHECK (problem_solving >= 1 AND problem_solving <= 5),
  initiative INTEGER CHECK (initiative >= 1 AND initiative <= 5),
  attendance INTEGER CHECK (attendance >= 1 AND attendance <= 5),
  
  -- Genel değerlendirme
  overall_rating DECIMAL(3,2), -- Ortalama puan
  strengths TEXT, -- Güçlü yönler
  areas_for_improvement TEXT, -- Gelişim alanları
  goals_achieved TEXT, -- Başarılan hedefler
  goals_next_period TEXT, -- Gelecek dönem hedefleri
  comments TEXT, -- Genel yorumlar
  
  -- Durum
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved')),
  employee_comments TEXT, -- Çalışan yorumları
  employee_signed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Eğitimler tablosu
CREATE TABLE IF NOT EXISTS trainings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  training_type VARCHAR(50), -- 'internal', 'external', 'online', 'conference'
  provider VARCHAR(255), -- Eğitim sağlayıcısı
  duration_hours INTEGER, -- Süre (saat)
  cost DECIMAL(10,2), -- Maliyet
  max_participants INTEGER, -- Maksimum katılımcı sayısı
  start_date DATE,
  end_date DATE,
  location VARCHAR(255),
  is_mandatory BOOLEAN DEFAULT false, -- Zorunlu mu?
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

-- Eğitim Katılımları tablosu
CREATE TABLE IF NOT EXISTS training_participations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  training_id UUID REFERENCES trainings(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'completed', 'failed', 'cancelled')),
  completion_date DATE,
  certificate_url VARCHAR(255), -- Sertifika URL'si
  feedback TEXT, -- Geri bildirim
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_employees_employee_number ON employees(employee_number);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_position_id ON employees(position_id);
CREATE INDEX IF NOT EXISTS idx_employees_employment_status ON employees(employment_status);
CREATE INDEX IF NOT EXISTS idx_employees_hire_date ON employees(hire_date);
CREATE INDEX IF NOT EXISTS idx_payrolls_employee_id ON payrolls(employee_id);
CREATE INDEX IF NOT EXISTS idx_payrolls_payroll_period ON payrolls(payroll_period);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_start_date ON leave_requests(start_date);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_employee_id ON performance_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_review_period ON performance_reviews(review_period);
CREATE INDEX IF NOT EXISTS idx_training_participations_training_id ON training_participations(training_id);
CREATE INDEX IF NOT EXISTS idx_training_participations_employee_id ON training_participations(employee_id);

-- RLS (Row Level Security) etkinleştir
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_participations ENABLE ROW LEVEL SECURITY;

-- Policy'ler (Admin kullanıcıları tüm HR verilerine erişebilir)
CREATE POLICY "Admin users can manage departments" ON departments FOR ALL USING (true);
CREATE POLICY "Admin users can manage positions" ON positions FOR ALL USING (true);
CREATE POLICY "Admin users can manage employees" ON employees FOR ALL USING (true);
CREATE POLICY "Admin users can manage payrolls" ON payrolls FOR ALL USING (true);
CREATE POLICY "Admin users can manage leave_types" ON leave_types FOR ALL USING (true);
CREATE POLICY "Admin users can manage leave_requests" ON leave_requests FOR ALL USING (true);
CREATE POLICY "Admin users can manage leave_usage" ON leave_usage FOR ALL USING (true);
CREATE POLICY "Admin users can manage performance_reviews" ON performance_reviews FOR ALL USING (true);
CREATE POLICY "Admin users can manage trainings" ON trainings FOR ALL USING (true);
CREATE POLICY "Admin users can manage training_participations" ON training_participations FOR ALL USING (true);

-- Trigger'lar için fonksiyon
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Maaş bordrosu hesaplama fonksiyonu
CREATE OR REPLACE FUNCTION calculate_payroll_amounts()
RETURNS TRIGGER AS $$
BEGIN
    -- Brüt maaş hesaplama
    NEW.gross_salary = NEW.base_salary + NEW.overtime_pay + NEW.bonus + NEW.commission + NEW.allowance + NEW.other_income;
    
    -- Toplam kesintiler
    NEW.total_deductions = NEW.income_tax + NEW.stamp_tax + NEW.sgk_employee + NEW.sgk_employer + 
                          NEW.unemployment_employee + NEW.unemployment_employer + NEW.other_deductions;
    
    -- Net maaş
    NEW.net_salary = NEW.gross_salary - NEW.total_deductions;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Performans değerlendirmesi ortalama hesaplama fonksiyonu
CREATE OR REPLACE FUNCTION calculate_performance_rating()
RETURNS TRIGGER AS $$
DECLARE
    total_score INTEGER := 0;
    criteria_count INTEGER := 0;
BEGIN
    -- Tüm kriterleri topla
    IF NEW.work_quality IS NOT NULL THEN
        total_score := total_score + NEW.work_quality;
        criteria_count := criteria_count + 1;
    END IF;
    
    IF NEW.productivity IS NOT NULL THEN
        total_score := total_score + NEW.productivity;
        criteria_count := criteria_count + 1;
    END IF;
    
    IF NEW.communication IS NOT NULL THEN
        total_score := total_score + NEW.communication;
        criteria_count := criteria_count + 1;
    END IF;
    
    IF NEW.teamwork IS NOT NULL THEN
        total_score := total_score + NEW.teamwork;
        criteria_count := criteria_count + 1;
    END IF;
    
    IF NEW.leadership IS NOT NULL THEN
        total_score := total_score + NEW.leadership;
        criteria_count := criteria_count + 1;
    END IF;
    
    IF NEW.problem_solving IS NOT NULL THEN
        total_score := total_score + NEW.problem_solving;
        criteria_count := criteria_count + 1;
    END IF;
    
    IF NEW.initiative IS NOT NULL THEN
        total_score := total_score + NEW.initiative;
        criteria_count := criteria_count + 1;
    END IF;
    
    IF NEW.attendance IS NOT NULL THEN
        total_score := total_score + NEW.attendance;
        criteria_count := criteria_count + 1;
    END IF;
    
    -- Ortalama hesapla
    IF criteria_count > 0 THEN
        NEW.overall_rating = ROUND((total_score::DECIMAL / criteria_count), 2);
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ları oluştur
DROP TRIGGER IF EXISTS update_departments_updated_at ON departments;
CREATE TRIGGER update_departments_updated_at 
  BEFORE UPDATE ON departments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_positions_updated_at ON positions;
CREATE TRIGGER update_positions_updated_at 
  BEFORE UPDATE ON positions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at 
  BEFORE UPDATE ON employees 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payrolls_updated_at ON payrolls;
CREATE TRIGGER update_payrolls_updated_at 
  BEFORE UPDATE ON payrolls 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS calculate_payroll_amounts_trigger ON payrolls;
CREATE TRIGGER calculate_payroll_amounts_trigger 
  BEFORE INSERT OR UPDATE ON payrolls 
  FOR EACH ROW 
  EXECUTE FUNCTION calculate_payroll_amounts();

DROP TRIGGER IF EXISTS update_leave_requests_updated_at ON leave_requests;
CREATE TRIGGER update_leave_requests_updated_at 
  BEFORE UPDATE ON leave_requests 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leave_usage_updated_at ON leave_usage;
CREATE TRIGGER update_leave_usage_updated_at 
  BEFORE UPDATE ON leave_usage 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_performance_reviews_updated_at ON performance_reviews;
CREATE TRIGGER update_performance_reviews_updated_at 
  BEFORE UPDATE ON performance_reviews 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS calculate_performance_rating_trigger ON performance_reviews;
CREATE TRIGGER calculate_performance_rating_trigger 
  BEFORE INSERT OR UPDATE ON performance_reviews 
  FOR EACH ROW 
  EXECUTE FUNCTION calculate_performance_rating();

DROP TRIGGER IF EXISTS update_trainings_updated_at ON trainings;
CREATE TRIGGER update_trainings_updated_at 
  BEFORE UPDATE ON trainings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_training_participations_updated_at ON training_participations;
CREATE TRIGGER update_training_participations_updated_at 
  BEFORE UPDATE ON training_participations 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Örnek veriler
INSERT INTO departments (name, code, description) VALUES
('İnsan Kaynakları', 'HR', 'İnsan kaynakları departmanı'),
('Bilgi İşlem', 'IT', 'Bilgi işlem departmanı'),
('Muhasebe', 'ACC', 'Muhasebe departmanı'),
('Satış', 'SALES', 'Satış departmanı'),
('Pazarlama', 'MKT', 'Pazarlama departmanı')
ON CONFLICT (code) DO NOTHING;

INSERT INTO leave_types (name, code, description, max_days_per_year, is_paid, advance_notice_days) VALUES
('Yıllık İzin', 'ANNUAL', 'Yıllık ücretli izin', 20, true, 7),
('Hastalık İzni', 'SICK', 'Hastalık izni', 10, true, 0),
('Doğum İzni', 'MATERNITY', 'Doğum izni', 105, true, 30),
('Babalık İzni', 'PATERNITY', 'Babalık izni', 10, true, 0),
('Evlilik İzni', 'MARRIAGE', 'Evlilik izni', 3, true, 7),
('Vefat İzni', 'BEREAVEMENT', 'Vefat izni', 3, true, 0),
('Ücretsiz İzin', 'UNPAID', 'Ücretsiz izin', 30, false, 14)
ON CONFLICT (code) DO NOTHING;
