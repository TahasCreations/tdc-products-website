# Metabase Setup Guide for TDC Analytics

Bu rehber, TDC Analytics verilerini Metabase ile görselleştirmek için gerekli adımları içerir.

## Ön Gereksinimler

- BigQuery'de `tdc_analytics` dataset'i oluşturulmuş olmalı
- dbt modelleri çalıştırılmış olmalı
- Metabase kurulumu yapılmış olmalı

## 1. BigQuery Bağlantısı Kurulumu

### 1.1 Service Account Oluşturma

1. Google Cloud Console'da projenizi seçin
2. IAM & Admin > Service Accounts'a gidin
3. "Create Service Account" butonuna tıklayın
4. Service account detaylarını girin:
   - Name: `metabase-bigquery-reader`
   - Description: `Metabase BigQuery reader service account`
5. "Create and Continue" butonuna tıklayın

### 1.2 Gerekli Rolleri Atama

Service account'a aşağıdaki rolleri atayın:
- `BigQuery Data Viewer`
- `BigQuery Job User`
- `BigQuery Metadata Viewer`

### 1.3 Key Oluşturma

1. Service account'u seçin
2. "Keys" sekmesine gidin
3. "Add Key" > "Create new key" seçin
4. JSON formatını seçin
5. Key dosyasını indirin ve güvenli bir yerde saklayın

## 2. Metabase Kurulumu

### 2.1 Docker ile Kurulum

```bash
# Metabase Docker container'ını çalıştır
docker run -d \
  --name metabase \
  -p 3000:3000 \
  -e MB_DB_TYPE=postgres \
  -e MB_DB_DBNAME=metabase \
  -e MB_DB_PORT=5432 \
  -e MB_DB_USER=metabase \
  -e MB_DB_PASS=your_password \
  -e MB_DB_HOST=your_postgres_host \
  metabase/metabase:latest
```

### 2.2 Environment Variables

```bash
# BigQuery bağlantısı için
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
export GOOGLE_CLOUD_PROJECT_ID="your-project-id"
export BIGQUERY_DATASET_ID="tdc_analytics"
```

## 3. Metabase'de Database Bağlantısı

### 3.1 Admin Panel'e Giriş

1. `http://localhost:3000` adresine gidin
2. İlk kurulum adımlarını tamamlayın
3. Admin panel'e giriş yapın

### 3.2 BigQuery Database Ekleme

1. Admin > Databases'e gidin
2. "Add database" butonuna tıklayın
3. BigQuery'yi seçin
4. Aşağıdaki bilgileri girin:

```
Display Name: TDC Analytics
Project ID: your-project-id
Dataset ID: tdc_analytics
Service Account JSON: (service account key dosyasının içeriği)
```

### 3.3 Bağlantı Testi

1. "Test connection" butonuna tıklayın
2. Başarılı olursa "Save" butonuna tıklayın

## 4. Dashboard Oluşturma

### 4.1 GMV Dashboard

1. "New" > "Dashboard" seçin
2. Dashboard adını girin: "TDC GMV Analytics"
3. Aşağıdaki kartları ekleyin:

#### GMV Trend Chart
```sql
SELECT 
  order_date,
  SUM(total_gmv) as daily_gmv
FROM `your-project.tdc_analytics.fct_gmv_daily`
WHERE tenant_id = '{{tenant_id}}'
  AND order_date >= '{{start_date}}'
  AND order_date <= '{{end_date}}'
GROUP BY order_date
ORDER BY order_date
```

#### Monthly GMV Growth
```sql
SELECT 
  CONCAT(order_year, '-', LPAD(order_month, 2, '0')) as month,
  monthly_gmv,
  gmv_growth_rate
FROM `your-project.tdc_analytics.agg_gmv_monthly`
WHERE tenant_id = '{{tenant_id}}'
ORDER BY order_year, order_month
```

#### Top Sellers by GMV
```sql
SELECT 
  seller_id,
  SUM(total_gmv) as total_gmv,
  COUNT(DISTINCT order_id) as total_orders
FROM `your-project.tdc_analytics.stg_orders`
WHERE tenant_id = '{{tenant_id}}'
  AND order_date >= '{{start_date}}'
  AND order_date <= '{{end_date}}'
GROUP BY seller_id
ORDER BY total_gmv DESC
LIMIT 10
```

### 4.2 Take Rate Analysis Dashboard

1. "New" > "Dashboard" seçin
2. Dashboard adını girin: "Take Rate Analysis"
3. Aşağıdaki kartları ekleyin:

#### Take Rate Trend
```sql
SELECT 
  order_date,
  AVG(avg_take_rate) as avg_take_rate,
  AVG(effective_take_rate) as effective_take_rate
FROM `your-project.tdc_analytics.fct_take_rate_analysis`
WHERE tenant_id = '{{tenant_id}}'
  AND order_date >= '{{start_date}}'
  AND order_date <= '{{end_date}}'
GROUP BY order_date
ORDER BY order_date
```

#### Take Rate Distribution
```sql
SELECT 
  take_rate_tier,
  COUNT(*) as seller_count,
  AVG(avg_take_rate) as avg_take_rate
FROM `your-project.tdc_analytics.fct_take_rate_analysis`
WHERE tenant_id = '{{tenant_id}}'
  AND order_date >= '{{start_date}}'
  AND order_date <= '{{end_date}}'
GROUP BY take_rate_tier
ORDER BY avg_take_rate DESC
```

#### Commission Efficiency
```sql
SELECT 
  order_date,
  SUM(total_commission) as total_commission,
  SUM(total_gmv) as total_gmv,
  (SUM(total_commission) / SUM(total_gmv)) * 100 as commission_efficiency
FROM `your-project.tdc_analytics.fct_gmv_daily`
WHERE tenant_id = '{{tenant_id}}'
  AND order_date >= '{{start_date}}'
  AND order_date <= '{{end_date}}'
GROUP BY order_date
ORDER BY order_date
```

## 5. Scheduled Reports

### 5.1 Daily GMV Report

1. "New" > "Pulse" seçin
2. Pulse adını girin: "Daily GMV Report"
3. Aşağıdaki soruyu ekleyin:

```sql
SELECT 
  order_date,
  SUM(total_gmv) as daily_gmv,
  SUM(total_commission) as daily_commission,
  COUNT(DISTINCT order_id) as daily_orders
FROM `your-project.tdc_analytics.fct_gmv_daily`
WHERE tenant_id = '{{tenant_id}}'
  AND order_date = CURRENT_DATE() - 1
GROUP BY order_date
```

4. Email adreslerini ekleyin
5. Günlük saat 09:00'da gönderilecek şekilde ayarlayın

### 5.2 Weekly Take Rate Report

1. "New" > "Pulse" seçin
2. Pulse adını girin: "Weekly Take Rate Report"
3. Aşağıdaki soruyu ekleyin:

```sql
SELECT 
  AVG(avg_take_rate) as weekly_avg_take_rate,
  AVG(effective_take_rate) as weekly_effective_take_rate,
  COUNT(DISTINCT seller_id) as active_sellers
FROM `your-project.tdc_analytics.fct_take_rate_analysis`
WHERE tenant_id = '{{tenant_id}}'
  AND order_date >= CURRENT_DATE() - 7
  AND order_date < CURRENT_DATE()
```

4. Email adreslerini ekleyin
5. Haftalık Pazartesi saat 10:00'da gönderilecek şekilde ayarlayın

## 6. Alerts Kurulumu

### 6.1 GMV Drop Alert

1. "New" > "Alert" seçin
2. Alert adını girin: "GMV Drop Alert"
3. Aşağıdaki soruyu ekleyin:

```sql
SELECT 
  order_date,
  SUM(total_gmv) as daily_gmv
FROM `your-project.tdc_analytics.fct_gmv_daily`
WHERE tenant_id = '{{tenant_id}}'
  AND order_date = CURRENT_DATE() - 1
GROUP BY order_date
```

4. Threshold'u ayarlayın: "Daily GMV < 10000"
5. Email adreslerini ekleyin

### 6.2 Take Rate Anomaly Alert

1. "New" > "Alert" seçin
2. Alert adını girin: "Take Rate Anomaly Alert"
3. Aşağıdaki soruyu ekleyin:

```sql
SELECT 
  AVG(avg_take_rate) as current_take_rate
FROM `your-project.tdc_analytics.fct_take_rate_analysis`
WHERE tenant_id = '{{tenant_id}}'
  AND order_date >= CURRENT_DATE() - 7
  AND order_date < CURRENT_DATE()
```

4. Threshold'u ayarlayın: "Take Rate > 15 OR Take Rate < 5"
5. Email adreslerini ekleyin

## 7. Best Practices

### 7.1 Performance Optimization

- Büyük sorgular için `LIMIT` kullanın
- Tarih filtreleri ekleyin
- Gereksiz JOIN'lerden kaçının
- Index'lenmiş kolonları kullanın

### 7.2 Security

- Service account'a minimum gerekli yetkileri verin
- Key dosyalarını güvenli bir yerde saklayın
- Metabase'i HTTPS ile çalıştırın
- Regular olarak key'leri rotate edin

### 7.3 Monitoring

- Dashboard'ları düzenli olarak kontrol edin
- Alert'leri test edin
- Performance metriklerini izleyin
- User access log'larını kontrol edin

## 8. Troubleshooting

### 8.1 Bağlantı Sorunları

```bash
# Service account key'ini test et
gcloud auth activate-service-account --key-file=path/to/key.json
gcloud config set project your-project-id
bq ls tdc_analytics
```

### 8.2 Query Performance

- BigQuery'de query execution details'i kontrol edin
- Slow query log'larını inceleyin
- Query plan'ını analiz edin

### 8.3 Data Freshness

- dbt modellerinin güncel olduğundan emin olun
- BigQuery export job'larının çalıştığını kontrol edin
- Data pipeline'ını izleyin

## 9. Örnek Dashboard Layout

### GMV Analytics Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  TDC GMV Analytics Dashboard                                │
├─────────────────────────────────────────────────────────────┤
│  [GMV Trend Chart]           [Monthly Growth]              │
│  [Daily GMV Table]           [Top Sellers]                 │
│  [Commission Efficiency]     [Order Completion Rate]       │
└─────────────────────────────────────────────────────────────┘
```

### Take Rate Analysis Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  Take Rate Analysis Dashboard                               │
├─────────────────────────────────────────────────────────────┤
│  [Take Rate Trend]          [Take Rate Distribution]       │
│  [Commission Efficiency]    [Seller Performance]           │
│  [Anomaly Detection]        [Historical Comparison]        │
└─────────────────────────────────────────────────────────────┘
```

Bu rehberi takip ederek TDC Analytics verilerinizi Metabase ile etkili bir şekilde görselleştirebilir ve analiz edebilirsiniz.

