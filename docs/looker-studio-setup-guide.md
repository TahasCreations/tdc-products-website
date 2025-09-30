# Looker Studio Setup Guide for TDC Analytics

Bu rehber, TDC Analytics verilerini Google Looker Studio ile görselleştirmek için gerekli adımları içerir.

## Ön Gereksinimler

- BigQuery'de `tdc_analytics` dataset'i oluşturulmuş olmalı
- dbt modelleri çalıştırılmış olmalı
- Google Cloud Platform hesabı
- Looker Studio erişimi

## 1. BigQuery Bağlantısı Kurulumu

### 1.1 Service Account Oluşturma

1. Google Cloud Console'da projenizi seçin
2. IAM & Admin > Service Accounts'a gidin
3. "Create Service Account" butonuna tıklayın
4. Service account detaylarını girin:
   - Name: `looker-studio-bigquery-reader`
   - Description: `Looker Studio BigQuery reader service account`
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

## 2. Looker Studio'da Data Source Oluşturma

### 2.1 Yeni Data Source Ekleme

1. [Looker Studio](https://lookerstudio.google.com/) adresine gidin
2. "Create" > "Data source" seçin
3. "BigQuery" connector'ını seçin
4. "Authorize" butonuna tıklayın
5. Google hesabınızla giriş yapın

### 2.2 BigQuery Bağlantı Ayarları

1. Project ID'yi seçin: `your-project-id`
2. Dataset'i seçin: `tdc_analytics`
3. Table'ları seçin:
   - `fct_gmv_daily`
   - `fct_take_rate_analysis`
   - `agg_gmv_monthly`
   - `agg_take_rate_trends`
   - `dim_tenants`

### 2.3 Field Mapping

Aşağıdaki field'ları map edin:

#### fct_gmv_daily
```
order_date → Date dimension
total_gmv → Metric (Sum)
total_commission → Metric (Sum)
total_orders → Metric (Count)
completion_rate → Metric (Average)
avg_order_value → Metric (Average)
```

#### fct_take_rate_analysis
```
order_date → Date dimension
seller_id → Dimension
avg_take_rate → Metric (Average)
effective_take_rate → Metric (Average)
take_rate_tier → Dimension
```

## 3. Dashboard Oluşturma

### 3.1 GMV Analytics Dashboard

1. "Create" > "Report" seçin
2. Data source'u seçin
3. Dashboard adını girin: "TDC GMV Analytics"

#### Chart 1: GMV Trend Line Chart
- Chart Type: Time series
- Dimension: order_date
- Metric: total_gmv (Sum)
- Date Range: Last 30 days
- Filter: tenant_id = "your-tenant-id"

#### Chart 2: Monthly GMV Growth
- Chart Type: Column chart
- Dimension: CONCAT(order_year, '-', order_month)
- Metric: monthly_gmv (Sum)
- Secondary Metric: gmv_growth_rate (Average)
- Sort: By order_year, order_month

#### Chart 3: Top Sellers Table
- Chart Type: Table
- Dimensions: seller_id
- Metrics: total_gmv (Sum), total_orders (Count)
- Sort: By total_gmv (Descending)
- Rows: 10

#### Chart 4: Commission Efficiency Gauge
- Chart Type: Gauge
- Metric: (total_commission / total_gmv) * 100
- Range: 0-20%
- Target: 10%

### 3.2 Take Rate Analysis Dashboard

1. "Create" > "Report" seçin
2. Data source'u seçin
3. Dashboard adını girin: "Take Rate Analysis"

#### Chart 1: Take Rate Trend
- Chart Type: Time series
- Dimension: order_date
- Metrics: avg_take_rate (Average), effective_take_rate (Average)
- Date Range: Last 30 days

#### Chart 2: Take Rate Distribution
- Chart Type: Pie chart
- Dimension: take_rate_tier
- Metric: seller_count (Count)
- Sort: By seller_count (Descending)

#### Chart 3: Seller Performance Scatter Plot
- Chart Type: Scatter plot
- X-axis: total_gmv (Sum)
- Y-axis: avg_take_rate (Average)
- Size: total_orders (Count)
- Color: take_rate_tier

#### Chart 4: Commission Efficiency Trend
- Chart Type: Time series
- Dimension: order_date
- Metric: (total_commission / total_gmv) * 100
- Date Range: Last 30 days

## 4. Advanced Features

### 4.1 Calculated Fields

#### GMV Growth Rate
```sql
CASE 
  WHEN LAG(total_gmv) OVER (ORDER BY order_date) > 0 
  THEN ((total_gmv - LAG(total_gmv) OVER (ORDER BY order_date)) / LAG(total_gmv) OVER (ORDER BY order_date)) * 100
  ELSE NULL
END
```

#### Commission Efficiency
```sql
(total_commission / total_gmv) * 100
```

#### Order Value Tier
```sql
CASE 
  WHEN total_gmv >= 1000 THEN 'High Value'
  WHEN total_gmv >= 100 THEN 'Medium Value'
  ELSE 'Low Value'
END
```

### 4.2 Filters

#### Date Range Filter
- Type: Date range
- Field: order_date
- Default: Last 30 days

#### Tenant Filter
- Type: Drop-down list
- Field: tenant_id
- Default: All tenants

#### Seller Filter
- Type: Drop-down list
- Field: seller_id
- Default: All sellers

#### Take Rate Tier Filter
- Type: Drop-down list
- Field: take_rate_tier
- Default: All tiers

### 4.3 Control Charts

#### Date Range Control
```javascript
// Custom control for date range
function getDateRange() {
  return {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  };
}
```

#### Tenant Selection Control
```javascript
// Custom control for tenant selection
function getTenantList() {
  return [
    { value: 'tenant-1', label: 'Tenant 1' },
    { value: 'tenant-2', label: 'Tenant 2' },
    { value: 'tenant-3', label: 'Tenant 3' }
  ];
}
```

## 5. Scheduled Reports

### 5.1 Daily GMV Report

1. Dashboard'u açın
2. "Share" > "Schedule email delivery" seçin
3. Email adreslerini ekleyin
4. Frequency: Daily
5. Time: 09:00 AM
6. Format: PDF
7. Subject: "Daily GMV Report - {{date}}"

### 5.2 Weekly Take Rate Report

1. Dashboard'u açın
2. "Share" > "Schedule email delivery" seçin
3. Email adreslerini ekleyin
4. Frequency: Weekly (Monday)
5. Time: 10:00 AM
6. Format: PDF
7. Subject: "Weekly Take Rate Report - Week of {{date}}"

## 6. Alerts ve Notifications

### 6.1 GMV Drop Alert

1. Dashboard'da "Alerts" sekmesine gidin
2. "Create Alert" butonuna tıklayın
3. Alert adını girin: "GMV Drop Alert"
4. Condition: total_gmv < 10000
5. Frequency: Daily
6. Email recipients: admin@company.com

### 6.2 Take Rate Anomaly Alert

1. Dashboard'da "Alerts" sekmesine gidin
2. "Create Alert" butonuna tıklayın
3. Alert adını girin: "Take Rate Anomaly Alert"
4. Condition: avg_take_rate > 15 OR avg_take_rate < 5
5. Frequency: Daily
6. Email recipients: admin@company.com

## 7. Data Studio Functions

### 7.1 Custom Functions

#### GMV Growth Rate Function
```javascript
function calculateGMVGrowthRate(currentGMV, previousGMV) {
  if (previousGMV > 0) {
    return ((currentGMV - previousGMV) / previousGMV) * 100;
  }
  return null;
}
```

#### Take Rate Efficiency Function
```javascript
function calculateTakeRateEfficiency(commission, gmv) {
  if (gmv > 0) {
    return (commission / gmv) * 100;
  }
  return 0;
}
```

### 7.2 Data Blending

#### Multiple Data Sources
1. "Resource" > "Manage added data sources" seçin
2. "Add a data source" butonuna tıklayın
3. BigQuery'den ek table'ları ekleyin
4. Join key'leri ayarlayın

#### Custom SQL
```sql
-- Custom SQL for complex queries
SELECT 
  t.tenant_id,
  t.tenant_tier,
  g.order_date,
  g.total_gmv,
  g.total_commission,
  (g.total_commission / g.total_gmv) * 100 as commission_efficiency
FROM `your-project.tdc_analytics.dim_tenants` t
JOIN `your-project.tdc_analytics.fct_gmv_daily` g
  ON t.tenant_id = g.tenant_id
WHERE g.order_date >= '2024-01-01'
ORDER BY g.order_date DESC
```

## 8. Best Practices

### 8.1 Performance Optimization

- Büyük dataset'ler için sampling kullanın
- Gereksiz dimension'ları kaldırın
- Cache ayarlarını optimize edin
- Real-time data için streaming kullanın

### 8.2 Security

- Data source'ları sadece gerekli kişilerle paylaşın
- Sensitive data için access control kullanın
- Regular olarak access log'larını kontrol edin
- Data retention policy'lerini uygulayın

### 8.3 User Experience

- Dashboard'ları responsive tasarlayın
- Loading time'ları optimize edin
- Error handling ekleyin
- User guide'ları hazırlayın

## 9. Troubleshooting

### 9.1 Bağlantı Sorunları

```bash
# BigQuery bağlantısını test et
bq query --use_legacy_sql=false "SELECT COUNT(*) FROM `your-project.tdc_analytics.fct_gmv_daily`"
```

### 9.2 Data Freshness

- BigQuery'de table'ların son update zamanını kontrol edin
- dbt modellerinin güncel olduğundan emin olun
- Data pipeline'ını izleyin

### 9.3 Performance Issues

- Query execution time'larını kontrol edin
- Slow query log'larını inceleyin
- Index'leri optimize edin

## 10. Örnek Dashboard Layout

### GMV Analytics Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  TDC GMV Analytics Dashboard                                │
├─────────────────────────────────────────────────────────────┤
│  [Date Range Filter] [Tenant Filter] [Seller Filter]       │
├─────────────────────────────────────────────────────────────┤
│  [GMV Trend Chart]           [Monthly Growth Chart]        │
│  [Daily GMV Table]           [Top Sellers Table]           │
│  [Commission Efficiency]     [Order Completion Rate]       │
└─────────────────────────────────────────────────────────────┘
```

### Take Rate Analysis Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  Take Rate Analysis Dashboard                               │
├─────────────────────────────────────────────────────────────┤
│  [Date Range Filter] [Tenant Filter] [Tier Filter]         │
├─────────────────────────────────────────────────────────────┤
│  [Take Rate Trend]          [Take Rate Distribution]       │
│  [Seller Performance]       [Commission Efficiency]        │
│  [Anomaly Detection]        [Historical Comparison]        │
└─────────────────────────────────────────────────────────────┘
```

Bu rehberi takip ederek TDC Analytics verilerinizi Looker Studio ile etkili bir şekilde görselleştirebilir ve analiz edebilirsiniz.

