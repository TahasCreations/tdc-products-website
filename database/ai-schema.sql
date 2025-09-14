-- AI (Artificial Intelligence) Veritabanı Şeması
-- Milyon lira değerinde e-ticaret platformu için

-- AI analitik tablosu
CREATE TABLE IF NOT EXISTS ai_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    event_type VARCHAR(50) NOT NULL, -- 'recommendation', 'chatbot_interaction', 'recommendation_click', 'purchase', 'satisfaction_rating'
    event_data JSONB,
    metadata JSONB, -- algorithm, responseTime, category, price, rating, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI öneri sistemi
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    product_id UUID,
    algorithm VARCHAR(50) NOT NULL, -- 'collaborative', 'content-based', 'hybrid', 'trending'
    score DECIMAL(5,4) NOT NULL,
    confidence DECIMAL(5,4) NOT NULL,
    reason TEXT,
    context JSONB, -- user behavior, preferences, etc.
    clicked BOOLEAN DEFAULT false,
    purchased BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI chatbot konuşmaları
CREATE TABLE IF NOT EXISTS ai_chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(100) NOT NULL,
    message_type VARCHAR(20) NOT NULL, -- 'user', 'assistant'
    message_content TEXT NOT NULL,
    intent VARCHAR(100), -- detected intent
    entities JSONB, -- extracted entities
    response_time DECIMAL(5,2), -- response time in seconds
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI içgörüleri
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL, -- 'trend', 'anomaly', 'opportunity', 'warning'
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    impact VARCHAR(10) NOT NULL, -- 'high', 'medium', 'low'
    confidence DECIMAL(5,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    action_required BOOLEAN DEFAULT false,
    category VARCHAR(50), -- 'product', 'pricing', 'sales', 'customer', 'inventory'
    tags TEXT[],
    data JSONB, -- insight specific data
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'resolved', 'dismissed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcı davranış analizi
CREATE TABLE IF NOT EXISTS user_behavior_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    behavior_type VARCHAR(50) NOT NULL, -- 'view', 'click', 'purchase', 'search', 'wishlist'
    target_id UUID, -- product_id, category_id, etc.
    target_type VARCHAR(50), -- 'product', 'category', 'brand'
    metadata JSONB, -- additional behavior data
    session_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI model performansı
CREATE TABLE IF NOT EXISTS ai_model_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(20) NOT NULL,
    algorithm VARCHAR(50) NOT NULL,
    accuracy DECIMAL(5,4),
    precision_score DECIMAL(5,4),
    recall_score DECIMAL(5,4),
    f1_score DECIMAL(5,4),
    training_data_size INTEGER,
    test_data_size INTEGER,
    training_duration INTEGER, -- seconds
    last_trained_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fiyat optimizasyonu
CREATE TABLE IF NOT EXISTS price_optimization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID,
    current_price DECIMAL(10,2) NOT NULL,
    optimized_price DECIMAL(10,2) NOT NULL,
    price_change_percentage DECIMAL(5,2),
    demand_elasticity DECIMAL(5,4),
    competitor_prices JSONB,
    market_conditions JSONB,
    confidence_score DECIMAL(5,4),
    expected_impact JSONB, -- revenue, sales volume, etc.
    applied BOOLEAN DEFAULT false,
    applied_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Müşteri segmentasyonu
CREATE TABLE IF NOT EXISTS customer_segmentation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    segment_name VARCHAR(100) NOT NULL,
    segment_type VARCHAR(50) NOT NULL, -- 'rfm', 'behavioral', 'demographic', 'value'
    segment_score DECIMAL(5,4),
    characteristics JSONB, -- segment characteristics
    predicted_lifetime_value DECIMAL(10,2),
    churn_probability DECIMAL(5,4),
    next_purchase_probability DECIMAL(5,4),
    recommended_actions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI ayarları
CREATE TABLE IF NOT EXISTS ai_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(50), -- 'recommendations', 'chatbot', 'pricing', 'segmentation'
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_ai_analytics_user_id ON ai_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_event_type ON ai_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_created_at ON ai_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_session_id ON ai_analytics(session_id);

CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_algorithm ON ai_recommendations(algorithm);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_score ON ai_recommendations(score);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_created_at ON ai_recommendations(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_chatbot_conversations_user_id ON ai_chatbot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chatbot_conversations_session_id ON ai_chatbot_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chatbot_conversations_intent ON ai_chatbot_conversations(intent);
CREATE INDEX IF NOT EXISTS idx_ai_chatbot_conversations_created_at ON ai_chatbot_conversations(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON ai_insights(type);
CREATE INDEX IF NOT EXISTS idx_ai_insights_impact ON ai_insights(impact);
CREATE INDEX IF NOT EXISTS idx_ai_insights_status ON ai_insights(status);
CREATE INDEX IF NOT EXISTS idx_ai_insights_created_at ON ai_insights(created_at);

CREATE INDEX IF NOT EXISTS idx_user_behavior_analysis_user_id ON user_behavior_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_analysis_behavior_type ON user_behavior_analysis(behavior_type);
CREATE INDEX IF NOT EXISTS idx_user_behavior_analysis_target_type ON user_behavior_analysis(target_type);
CREATE INDEX IF NOT EXISTS idx_user_behavior_analysis_created_at ON user_behavior_analysis(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_model_performance_model_name ON ai_model_performance(model_name);
CREATE INDEX IF NOT EXISTS idx_ai_model_performance_algorithm ON ai_model_performance(algorithm);
CREATE INDEX IF NOT EXISTS idx_ai_model_performance_is_active ON ai_model_performance(is_active);

CREATE INDEX IF NOT EXISTS idx_price_optimization_product_id ON price_optimization(product_id);
CREATE INDEX IF NOT EXISTS idx_price_optimization_applied ON price_optimization(applied);
CREATE INDEX IF NOT EXISTS idx_price_optimization_created_at ON price_optimization(created_at);

CREATE INDEX IF NOT EXISTS idx_customer_segmentation_user_id ON customer_segmentation(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_segmentation_segment_name ON customer_segmentation(segment_name);
CREATE INDEX IF NOT EXISTS idx_customer_segmentation_segment_type ON customer_segmentation(segment_type);
CREATE INDEX IF NOT EXISTS idx_customer_segmentation_created_at ON customer_segmentation(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_settings_setting_key ON ai_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_ai_settings_category ON ai_settings(category);

-- Trigger'lar
CREATE OR REPLACE FUNCTION update_ai_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_insights_updated_at
    BEFORE UPDATE ON ai_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_updated_at();

CREATE TRIGGER update_customer_segmentation_updated_at
    BEFORE UPDATE ON customer_segmentation
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_updated_at();

CREATE TRIGGER update_ai_settings_updated_at
    BEFORE UPDATE ON ai_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_updated_at();

-- AI öneri performansını güncelleme
CREATE OR REPLACE FUNCTION update_recommendation_performance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.clicked = true AND OLD.clicked = false THEN
        -- Update recommendation click analytics
        INSERT INTO ai_analytics (user_id, event_type, event_data, metadata)
        VALUES (NEW.user_id, 'recommendation_click', 
                jsonb_build_object('recommendation_id', NEW.id, 'product_id', NEW.product_id),
                jsonb_build_object('algorithm', NEW.algorithm, 'score', NEW.score));
    END IF;
    
    IF NEW.purchased = true AND OLD.purchased = false THEN
        -- Update recommendation purchase analytics
        INSERT INTO ai_analytics (user_id, event_type, event_data, metadata)
        VALUES (NEW.user_id, 'purchase', 
                jsonb_build_object('recommendation_id', NEW.id, 'product_id', NEW.product_id),
                jsonb_build_object('algorithm', NEW.algorithm, 'score', NEW.score));
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_recommendation_performance_trigger
    AFTER UPDATE ON ai_recommendations
    FOR EACH ROW
    EXECUTE FUNCTION update_recommendation_performance();

-- Varsayılan AI ayarları
INSERT INTO ai_settings (setting_key, setting_value, description, category, is_public) VALUES
('recommendation_enabled', 'true', 'AI öneri sisteminin etkin olup olmadığı', 'recommendations', true),
('recommendation_algorithm', 'hybrid', 'Varsayılan öneri algoritması', 'recommendations', false),
('recommendation_count', '8', 'Varsayılan öneri sayısı', 'recommendations', false),
('recommendation_confidence_threshold', '0.3', 'Minimum güven eşiği', 'recommendations', false),
('chatbot_enabled', 'true', 'AI chatbotun etkin olup olmadığı', 'chatbot', true),
('chatbot_response_time', '2', 'Varsayılan yanıt süresi (saniye)', 'chatbot', false),
('chatbot_language', 'tr', 'Varsayılan chatbot dili', 'chatbot', true),
('price_optimization_enabled', 'true', 'Fiyat optimizasyonunun etkin olup olmadığı', 'pricing', false),
('price_optimization_frequency', 'daily', 'Fiyat optimizasyon sıklığı', 'pricing', false),
('segmentation_enabled', 'true', 'Müşteri segmentasyonunun etkin olup olmadığı', 'segmentation', false),
('segmentation_update_frequency', 'weekly', 'Segmentasyon güncelleme sıklığı', 'segmentation', false);

-- RLS (Row Level Security) politikaları
ALTER TABLE ai_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_segmentation ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi verilerini görebilir
CREATE POLICY "Users can view own AI data" ON ai_analytics
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own recommendations" ON ai_recommendations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own chatbot conversations" ON ai_chatbot_conversations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own behavior analysis" ON user_behavior_analysis
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can view own segmentation" ON customer_segmentation
    FOR SELECT USING (user_id = auth.uid());

-- Admin'ler tüm verileri görebilir
CREATE POLICY "Admins can view all AI data" ON ai_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can view all recommendations" ON ai_recommendations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

CREATE POLICY "Admins can view all chatbot conversations" ON ai_chatbot_conversations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

-- View'lar
CREATE VIEW ai_recommendation_performance AS
SELECT 
    algorithm,
    COUNT(*) as total_recommendations,
    COUNT(CASE WHEN clicked = true THEN 1 END) as clicked_recommendations,
    COUNT(CASE WHEN purchased = true THEN 1 END) as purchased_recommendations,
    ROUND(
        COUNT(CASE WHEN clicked = true THEN 1 END)::DECIMAL / COUNT(*) * 100, 2
    ) as click_rate,
    ROUND(
        COUNT(CASE WHEN purchased = true THEN 1 END)::DECIMAL / COUNT(*) * 100, 2
    ) as conversion_rate,
    ROUND(AVG(score), 4) as average_score,
    ROUND(AVG(confidence), 4) as average_confidence
FROM ai_recommendations
GROUP BY algorithm
ORDER BY total_recommendations DESC;

CREATE VIEW ai_chatbot_performance AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_messages,
    COUNT(CASE WHEN message_type = 'user' THEN 1 END) as user_messages,
    COUNT(CASE WHEN message_type = 'assistant' THEN 1 END) as assistant_messages,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT user_id) as unique_users,
    ROUND(AVG(response_time), 2) as average_response_time,
    ROUND(AVG(satisfaction_rating), 2) as average_satisfaction
FROM ai_chatbot_conversations
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE VIEW customer_segmentation_summary AS
SELECT 
    segment_name,
    segment_type,
    COUNT(*) as customer_count,
    ROUND(AVG(segment_score), 4) as average_score,
    ROUND(AVG(predicted_lifetime_value), 2) as average_ltv,
    ROUND(AVG(churn_probability), 4) as average_churn_probability,
    ROUND(AVG(next_purchase_probability), 4) as average_purchase_probability
FROM customer_segmentation
GROUP BY segment_name, segment_type
ORDER BY customer_count DESC;

CREATE VIEW ai_insights_summary AS
SELECT 
    type,
    impact,
    COUNT(*) as insight_count,
    ROUND(AVG(confidence), 2) as average_confidence,
    COUNT(CASE WHEN action_required = true THEN 1 END) as action_required_count,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count
FROM ai_insights
GROUP BY type, impact
ORDER BY insight_count DESC;
