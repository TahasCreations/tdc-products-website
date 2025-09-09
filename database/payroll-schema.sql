-- Bordro ve Maaş Yönetimi Sistemi
-- Çalışan bordroları, maaş hesaplamaları ve HR süreçleri

-- Çalışan bilgileri
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    postal_code VARCHAR(10),
    birth_date DATE,
    hire_date DATE NOT NULL,
    termination_date DATE,
    department_id UUID,
    position_id UUID,
    manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    employment_type VARCHAR(20) DEFAULT 'full_time', -- 'full_time', 'part_time', 'contract', 'intern'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'terminated'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departmanlar
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    parent_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    budget DECIMAL(15,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pozisyonlar
CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    level INTEGER DEFAULT 1,
    min_salary DECIMAL(10,2),
    max_salary DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maaş bilgileri
CREATE TABLE IF NOT EXISTS employee_salaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    base_salary DECIMAL(10,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'TRY',
    salary_type VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'hourly', 'daily', 'annual'
    effective_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Maaş bileşenleri
CREATE TABLE IF NOT EXISTS salary_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    component_type VARCHAR(20) NOT NULL, -- 'allowance', 'deduction', 'bonus', 'overtime'
    calculation_type VARCHAR(20) NOT NULL, -- 'fixed', 'percentage', 'formula'
    calculation_value DECIMAL(10,2),
    is_taxable BOOLEAN DEFAULT true,
    is_mandatory BOOLEAN DEFAULT false,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Çalışan maaş bileşenleri
CREATE TABLE IF NOT EXISTS employee_salary_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    component_id UUID REFERENCES salary_components(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    effective_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bordro dönemleri
CREATE TABLE IF NOT EXISTS payroll_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_name VARCHAR(100) NOT NULL,
    period_type VARCHAR(20) NOT NULL, -- 'monthly', 'bi_weekly', 'weekly'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pay_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'processing', 'completed', 'cancelled'
    total_employees INTEGER DEFAULT 0,
    total_gross_pay DECIMAL(15,2) DEFAULT 0,
    total_net_pay DECIMAL(15,2) DEFAULT 0,
    total_taxes DECIMAL(15,2) DEFAULT 0,
    total_deductions DECIMAL(15,2) DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bordro kayıtları
CREATE TABLE IF NOT EXISTS payroll_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID REFERENCES payroll_periods(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    base_salary DECIMAL(10,2) NOT NULL,
    gross_salary DECIMAL(10,2) NOT NULL,
    net_salary DECIMAL(10,2) NOT NULL,
    total_allowances DECIMAL(10,2) DEFAULT 0,
    total_deductions DECIMAL(10,2) DEFAULT 0,
    total_taxes DECIMAL(10,2) DEFAULT 0,
    working_days INTEGER DEFAULT 30,
    actual_working_days INTEGER DEFAULT 30,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    overtime_pay DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'approved', 'paid', 'cancelled'
    payment_method VARCHAR(20) DEFAULT 'bank_transfer', -- 'bank_transfer', 'cash', 'check'
    payment_reference VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bordro detayları
CREATE TABLE IF NOT EXISTS payroll_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_record_id UUID REFERENCES payroll_records(id) ON DELETE CASCADE,
    component_id UUID REFERENCES salary_components(id) ON DELETE CASCADE,
    component_type VARCHAR(20) NOT NULL, -- 'allowance', 'deduction', 'bonus', 'overtime'
    amount DECIMAL(10,2) NOT NULL,
    calculation_basis DECIMAL(10,2),
    calculation_rate DECIMAL(5,4),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vergi hesaplamaları
CREATE TABLE IF NOT EXISTS tax_calculations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_record_id UUID REFERENCES payroll_records(id) ON DELETE CASCADE,
    tax_type VARCHAR(50) NOT NULL, -- 'income_tax', 'social_security', 'unemployment', 'health_insurance'
    taxable_amount DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,4) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    employer_contribution DECIMAL(10,2) DEFAULT 0,
    employee_contribution DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İzin türleri
CREATE TABLE IF NOT EXISTS leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    is_paid BOOLEAN DEFAULT true,
    max_days_per_year INTEGER,
    carry_over_allowed BOOLEAN DEFAULT false,
    max_carry_over_days INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İzin kayıtları
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID REFERENCES leave_types(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days DECIMAL(5,2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
    approved_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mesai kayıtları
CREATE TABLE IF NOT EXISTS overtime_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_hours DECIMAL(5,2) NOT NULL,
    overtime_type VARCHAR(20) DEFAULT 'regular', -- 'regular', 'weekend', 'holiday'
    rate_multiplier DECIMAL(3,2) DEFAULT 1.5,
    approved_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performans değerlendirmeleri
CREATE TABLE IF NOT EXISTS performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    overall_rating DECIMAL(3,2), -- 1.00 - 5.00
    goals_achieved INTEGER DEFAULT 0,
    total_goals INTEGER DEFAULT 0,
    strengths TEXT,
    areas_for_improvement TEXT,
    development_plan TEXT,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'submitted', 'approved', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bordro şablonları
CREATE TABLE IF NOT EXISTS payroll_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    template_config JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bordro logları
CREATE TABLE IF NOT EXISTS payroll_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period_id UUID REFERENCES payroll_periods(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'approved', 'paid', 'cancelled'
    details JSONB,
    user_id UUID,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_employees_employee_number ON employees(employee_number);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_position_id ON employees(position_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employee_salaries_employee_id ON employee_salaries(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_salaries_effective_date ON employee_salaries(effective_date);
CREATE INDEX IF NOT EXISTS idx_employee_salary_components_employee_id ON employee_salary_components(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_periods_start_date ON payroll_periods(start_date);
CREATE INDEX IF NOT EXISTS idx_payroll_periods_status ON payroll_periods(status);
CREATE INDEX IF NOT EXISTS idx_payroll_records_period_id ON payroll_records(period_id);
CREATE INDEX IF NOT EXISTS idx_payroll_records_employee_id ON payroll_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_records_status ON payroll_records(status);
CREATE INDEX IF NOT EXISTS idx_payroll_details_payroll_record_id ON payroll_details(payroll_record_id);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_payroll_record_id ON tax_calculations(payroll_record_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_overtime_records_employee_id ON overtime_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_overtime_records_date ON overtime_records(date);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_employee_id ON performance_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_logs_period_id ON payroll_logs(period_id);
CREATE INDEX IF NOT EXISTS idx_payroll_logs_employee_id ON payroll_logs(employee_id);

-- Trigger fonksiyonları
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'lar
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_salaries_updated_at BEFORE UPDATE ON employee_salaries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_salary_components_updated_at BEFORE UPDATE ON salary_components FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_salary_components_updated_at BEFORE UPDATE ON employee_salary_components FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_periods_updated_at BEFORE UPDATE ON payroll_periods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_records_updated_at BEFORE UPDATE ON payroll_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_types_updated_at BEFORE UPDATE ON leave_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_overtime_records_updated_at BEFORE UPDATE ON overtime_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_performance_reviews_updated_at BEFORE UPDATE ON performance_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_templates_updated_at BEFORE UPDATE ON payroll_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data
INSERT INTO departments (name, code, description) VALUES
('İnsan Kaynakları', 'HR', 'İnsan kaynakları ve personel yönetimi'),
('Muhasebe', 'ACC', 'Muhasebe ve finans işlemleri'),
('Bilgi İşlem', 'IT', 'Teknoloji ve sistem yönetimi'),
('Satış', 'SALES', 'Satış ve pazarlama'),
('Üretim', 'PROD', 'Üretim ve operasyon'),
('Kalite', 'QA', 'Kalite kontrol ve güvence')
ON CONFLICT (code) DO NOTHING;

INSERT INTO positions (title, code, description, level, min_salary, max_salary) VALUES
('Genel Müdür', 'GM', 'Şirket genel müdürü', 10, 50000, 100000),
('Müdür', 'MGR', 'Departman müdürü', 8, 30000, 60000),
('Uzman', 'EXP', 'Alan uzmanı', 6, 20000, 40000),
('Analist', 'ANL', 'Veri analisti', 4, 15000, 30000),
('Asistan', 'AST', 'Yönetici asistanı', 2, 10000, 20000),
('Stajyer', 'INT', 'Stajyer', 1, 5000, 10000)
ON CONFLICT (code) DO NOTHING;

INSERT INTO salary_components (name, code, component_type, calculation_type, calculation_value, is_taxable, is_mandatory) VALUES
('Temel Maaş', 'BASE_SALARY', 'allowance', 'fixed', 0, true, true),
('Yemek Yardımı', 'MEAL_ALLOWANCE', 'allowance', 'fixed', 500, true, false),
('Ulaşım Yardımı', 'TRANSPORT_ALLOWANCE', 'allowance', 'fixed', 300, true, false),
('Performans Primi', 'PERFORMANCE_BONUS', 'bonus', 'percentage', 10, true, false),
('Mesai Ücreti', 'OVERTIME_PAY', 'overtime', 'formula', 1.5, true, false),
('Gelir Vergisi', 'INCOME_TAX', 'deduction', 'percentage', 15, false, true),
('SGK Primi', 'SOCIAL_SECURITY', 'deduction', 'percentage', 14, false, true),
('İşsizlik Sigortası', 'UNEMPLOYMENT_INS', 'deduction', 'percentage', 1, false, true),
('GSS Primi', 'HEALTH_INS', 'deduction', 'percentage', 1, false, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO leave_types (name, code, description, is_paid, max_days_per_year, carry_over_allowed, max_carry_over_days) VALUES
('Yıllık İzin', 'ANNUAL', 'Yıllık ücretli izin', true, 20, true, 5),
('Hastalık İzni', 'SICK', 'Hastalık izni', true, 10, false, 0),
('Doğum İzni', 'MATERNITY', 'Doğum izni', true, 105, false, 0),
('Babalık İzni', 'PATERNITY', 'Babalık izni', true, 10, false, 0),
('Ücretsiz İzin', 'UNPAID', 'Ücretsiz izin', false, 30, false, 0),
('Mazeret İzni', 'EXCUSE', 'Mazeret izni', true, 5, false, 0)
ON CONFLICT (code) DO NOTHING;

-- RLS politikaları
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE overtime_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_logs ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için tam erişim
CREATE POLICY "Admin full access to employees" ON employees FOR ALL USING (true);
CREATE POLICY "Admin full access to departments" ON departments FOR ALL USING (true);
CREATE POLICY "Admin full access to positions" ON positions FOR ALL USING (true);
CREATE POLICY "Admin full access to employee_salaries" ON employee_salaries FOR ALL USING (true);
CREATE POLICY "Admin full access to salary_components" ON salary_components FOR ALL USING (true);
CREATE POLICY "Admin full access to employee_salary_components" ON employee_salary_components FOR ALL USING (true);
CREATE POLICY "Admin full access to payroll_periods" ON payroll_periods FOR ALL USING (true);
CREATE POLICY "Admin full access to payroll_records" ON payroll_records FOR ALL USING (true);
CREATE POLICY "Admin full access to payroll_details" ON payroll_details FOR ALL USING (true);
CREATE POLICY "Admin full access to tax_calculations" ON tax_calculations FOR ALL USING (true);
CREATE POLICY "Admin full access to leave_types" ON leave_types FOR ALL USING (true);
CREATE POLICY "Admin full access to leave_requests" ON leave_requests FOR ALL USING (true);
CREATE POLICY "Admin full access to overtime_records" ON overtime_records FOR ALL USING (true);
CREATE POLICY "Admin full access to performance_reviews" ON performance_reviews FOR ALL USING (true);
CREATE POLICY "Admin full access to payroll_templates" ON payroll_templates FOR ALL USING (true);
CREATE POLICY "Admin full access to payroll_logs" ON payroll_logs FOR ALL USING (true);
