-- HR Performans Değerlendirmeleri Tablosu
CREATE TABLE IF NOT EXISTS performance_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  review_period VARCHAR(50) NOT NULL,
  overall_rating DECIMAL(3,1) NOT NULL CHECK (overall_rating >= 1.0 AND overall_rating <= 5.0),
  goals_achieved INTEGER NOT NULL DEFAULT 0,
  goals_total INTEGER NOT NULL DEFAULT 1,
  feedback TEXT,
  reviewer_id UUID REFERENCES employees(id),
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HR Eğitim Programları Tablosu
CREATE TABLE IF NOT EXISTS trainings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  training_type VARCHAR(20) NOT NULL CHECK (training_type IN ('internal', 'external')),
  duration_hours INTEGER NOT NULL DEFAULT 1,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 10,
  requirements TEXT,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HR İş İlanları Tablosu
CREATE TABLE IF NOT EXISTS recruitments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position_title VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  salary_range VARCHAR(100),
  requirements TEXT NOT NULL,
  deadline DATE NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  employment_type VARCHAR(20) NOT NULL CHECK (employment_type IN ('full_time', 'part_time')),
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_performance_reviews_employee_id ON performance_reviews(employee_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_reviewer_id ON performance_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_performance_reviews_created_at ON performance_reviews(created_at);

CREATE INDEX IF NOT EXISTS idx_trainings_start_date ON trainings(start_date);
CREATE INDEX IF NOT EXISTS idx_trainings_end_date ON trainings(end_date);
CREATE INDEX IF NOT EXISTS idx_trainings_training_type ON trainings(training_type);

CREATE INDEX IF NOT EXISTS idx_recruitments_deadline ON recruitments(deadline);
CREATE INDEX IF NOT EXISTS idx_recruitments_department ON recruitments(department);
CREATE INDEX IF NOT EXISTS idx_recruitments_employment_type ON recruitments(employment_type);

-- RLS Politikaları
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruitments ENABLE ROW LEVEL SECURITY;

-- Performans değerlendirmeleri için RLS
CREATE POLICY "Admin users can view all performance reviews" ON performance_reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'hr_manager')
    )
  );

CREATE POLICY "Admin users can insert performance reviews" ON performance_reviews
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'hr_manager')
    )
  );

CREATE POLICY "Admin users can update performance reviews" ON performance_reviews
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'hr_manager')
    )
  );

CREATE POLICY "Admin users can delete performance reviews" ON performance_reviews
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'hr_manager')
    )
  );

-- Eğitim programları için RLS
CREATE POLICY "Admin users can view all trainings" ON trainings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'hr_manager')
    )
  );

CREATE POLICY "Admin users can insert trainings" ON trainings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'hr_manager')
    )
  );

CREATE POLICY "Admin users can update trainings" ON trainings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'hr_manager')
    )
  );

CREATE POLICY "Admin users can delete trainings" ON trainings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'hr_manager')
    )
  );

-- İş ilanları için RLS
CREATE POLICY "Admin users can view all recruitments" ON recruitments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'hr_manager')
    )
  );

CREATE POLICY "Admin users can insert recruitments" ON recruitments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'hr_manager')
    )
  );

CREATE POLICY "Admin users can update recruitments" ON recruitments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'hr_manager')
    )
  );

CREATE POLICY "Admin users can delete recruitments" ON recruitments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'hr_manager')
    )
  );

-- Trigger fonksiyonları
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ları ekle
CREATE TRIGGER update_performance_reviews_updated_at 
  BEFORE UPDATE ON performance_reviews 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainings_updated_at 
  BEFORE UPDATE ON trainings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recruitments_updated_at 
  BEFORE UPDATE ON recruitments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Örnek veriler
INSERT INTO performance_reviews (employee_id, review_period, overall_rating, goals_achieved, goals_total, feedback, reviewer_id, created_by) VALUES
  ((SELECT id FROM employees LIMIT 1), '2024 Q1', 4.2, 8, 10, 'Çok başarılı bir dönem geçirdi. Hedeflerinin %80''ini başardı.', (SELECT id FROM employees LIMIT 1), (SELECT id FROM admin_users LIMIT 1)),
  ((SELECT id FROM employees LIMIT 1), '2024 Q2', 4.5, 9, 10, 'Mükemmel performans gösterdi. Takım çalışması çok iyi.', (SELECT id FROM employees LIMIT 1), (SELECT id FROM admin_users LIMIT 1));

INSERT INTO trainings (title, description, training_type, duration_hours, start_date, end_date, instructor, max_participants, requirements, created_by) VALUES
  ('React.js Gelişmiş Teknikler', 'Modern React uygulamaları geliştirme eğitimi', 'internal', 16, '2024-02-01', '2024-02-15', 'Ahmet Yılmaz', 15, 'Temel JavaScript bilgisi gerekli', (SELECT id FROM admin_users LIMIT 1)),
  ('Proje Yönetimi Sertifikası', 'PMP sertifikasyon hazırlık eğitimi', 'external', 40, '2024-03-01', '2024-03-30', 'Mehmet Kaya', 20, 'En az 2 yıl proje yönetimi deneyimi', (SELECT id FROM admin_users LIMIT 1));

INSERT INTO recruitments (position_title, department, salary_range, requirements, deadline, description, location, employment_type, created_by) VALUES
  ('Frontend Developer', 'IT', '15.000 - 25.000 TL', 'React, TypeScript, 3+ yıl deneyim', '2024-12-31', 'Modern web uygulamaları geliştirecek frontend developer arıyoruz.', 'İstanbul', 'full_time', (SELECT id FROM admin_users LIMIT 1)),
  ('Muhasebe Uzmanı', 'Muhasebe', '12.000 - 18.000 TL', 'Muhasebe lisansı, 2+ yıl deneyim', '2024-11-30', 'Mali işler departmanında çalışacak muhasebe uzmanı arıyoruz.', 'Ankara', 'full_time', (SELECT id FROM admin_users LIMIT 1));
