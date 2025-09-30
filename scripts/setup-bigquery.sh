#!/bin/bash

# BigQuery Setup Script for TDC Analytics
# This script sets up BigQuery dataset and tables for TDC Analytics

set -e

# Configuration
PROJECT_ID=${GOOGLE_CLOUD_PROJECT_ID:-"your-project-id"}
DATASET_ID=${BIGQUERY_DATASET_ID:-"tdc_analytics"}
LOCATION=${BIGQUERY_LOCATION:-"US"}

echo "🚀 Setting up BigQuery for TDC Analytics..."
echo "Project ID: $PROJECT_ID"
echo "Dataset ID: $DATASET_ID"
echo "Location: $LOCATION"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Check if bq is available
if ! command -v bq &> /dev/null; then
    echo "❌ bq CLI is not available. Please install BigQuery CLI."
    exit 1
fi

# Authenticate with Google Cloud
echo "🔐 Authenticating with Google Cloud..."
gcloud auth login

# Set project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Create dataset
echo "📊 Creating dataset $DATASET_ID..."
bq mk --location=$LOCATION --description="TDC Analytics Dataset" $DATASET_ID || echo "Dataset already exists"

# Create events table
echo "📝 Creating events table..."
bq mk --table \
  --description="TDC Events Data" \
  --schema="event_id:STRING,tenant_id:STRING,event_type:STRING,event_version:STRING,source:STRING,data:JSON,metadata:JSON,status:STRING,processed_at:TIMESTAMP,error_message:STRING,created_at:TIMESTAMP,updated_at:TIMESTAMP,event_date:DATE,event_hour:INTEGER,event_day_of_week:INTEGER,event_month:INTEGER,event_year:INTEGER" \
  $PROJECT_ID:$DATASET_ID.events || echo "Events table already exists"

# Create orders table
echo "📝 Creating orders table..."
bq mk --table \
  --description="TDC Orders Data" \
  --schema="order_id:STRING,tenant_id:STRING,customer_id:STRING,seller_id:STRING,status:STRING,total_amount:NUMERIC,commission_amount:NUMERIC,take_rate:NUMERIC,gmv:NUMERIC,currency:STRING,created_at:TIMESTAMP,updated_at:TIMESTAMP,order_date:DATE,order_hour:INTEGER,order_day_of_week:INTEGER,order_month:INTEGER,order_year:INTEGER" \
  $PROJECT_ID:$DATASET_ID.orders || echo "Orders table already exists"

# Create settlements table
echo "📝 Creating settlements table..."
bq mk --table \
  --description="TDC Settlements Data" \
  --schema="settlement_id:STRING,tenant_id:STRING,seller_id:STRING,settlement_run_id:STRING,status:STRING,total_amount:NUMERIC,commission_amount:NUMERIC,net_amount:NUMERIC,currency:STRING,settlement_date:DATE,created_at:TIMESTAMP,updated_at:TIMESTAMP" \
  $PROJECT_ID:$DATASET_ID.settlements || echo "Settlements table already exists"

# Create products table
echo "📝 Creating products table..."
bq mk --table \
  --description="TDC Products Data" \
  --schema="product_id:STRING,tenant_id:STRING,seller_id:STRING,name:STRING,description:STRING,price:NUMERIC,currency:STRING,category:STRING,status:STRING,created_at:TIMESTAMP,updated_at:TIMESTAMP" \
  $PROJECT_ID:$DATASET_ID.products || echo "Products table already exists"

# Create customers table
echo "📝 Creating customers table..."
bq mk --table \
  --description="TDC Customers Data" \
  --schema="customer_id:STRING,tenant_id:STRING,email:STRING,first_name:STRING,last_name:STRING,phone:STRING,status:STRING,created_at:TIMESTAMP,updated_at:TIMESTAMP" \
  $PROJECT_ID:$DATASET_ID.customers || echo "Customers table already exists"

# Create sellers table
echo "📝 Creating sellers table..."
bq mk --table \
  --description="TDC Sellers Data" \
  --schema="seller_id:STRING,tenant_id:STRING,name:STRING,email:STRING,phone:STRING,status:STRING,commission_rate:NUMERIC,created_at:TIMESTAMP,updated_at:TIMESTAMP" \
  $PROJECT_ID:$DATASET_ID.sellers || echo "Sellers table already exists"

# Create webhook_deliveries table
echo "📝 Creating webhook_deliveries table..."
bq mk --table \
  --description="TDC Webhook Deliveries Data" \
  --schema="delivery_id:STRING,tenant_id:STRING,subscription_id:STRING,event_type:STRING,event_id:STRING,payload:JSON,status:STRING,http_status:INTEGER,response_body:STRING,attempt_count:INTEGER,max_retries:INTEGER,started_at:TIMESTAMP,completed_at:TIMESTAMP,duration:INTEGER,error_message:STRING,created_at:TIMESTAMP,updated_at:TIMESTAMP" \
  $PROJECT_ID:$DATASET_ID.webhook_deliveries || echo "Webhook deliveries table already exists"

# Create partitions for time-series tables
echo "🔧 Creating partitions for time-series tables..."

# Partition events table by event_date
bq query --use_legacy_sql=false "
CREATE OR REPLACE TABLE \`$PROJECT_ID.$DATASET_ID.events_partitioned\`
PARTITION BY event_date
AS
SELECT * FROM \`$PROJECT_ID.$DATASET_ID.events\`
WHERE 1=0
" || echo "Events partitioned table already exists"

# Partition orders table by order_date
bq query --use_legacy_sql=false "
CREATE OR REPLACE TABLE \`$PROJECT_ID.$DATASET_ID.orders_partitioned\`
PARTITION BY order_date
AS
SELECT * FROM \`$PROJECT_ID.$DATASET_ID.orders\`
WHERE 1=0
" || echo "Orders partitioned table already exists"

# Create views for common queries
echo "👁️ Creating views for common queries..."

# GMV daily view
bq query --use_legacy_sql=false "
CREATE OR REPLACE VIEW \`$PROJECT_ID.$DATASET_ID.gmv_daily_view\` AS
SELECT
  tenant_id,
  order_date,
  COUNT(DISTINCT order_id) as total_orders,
  COUNT(DISTINCT customer_id) as unique_customers,
  COUNT(DISTINCT seller_id) as unique_sellers,
  SUM(gmv) as total_gmv,
  SUM(commission_amount) as total_commission,
  AVG(take_rate) as avg_take_rate,
  SUM(CASE WHEN status IN ('COMPLETED', 'PAID', 'SETTLED') THEN gmv ELSE 0 END) as completed_gmv,
  COUNT(CASE WHEN status IN ('COMPLETED', 'PAID', 'SETTLED') THEN 1 END) as completed_orders
FROM \`$PROJECT_ID.$DATASET_ID.orders\`
GROUP BY tenant_id, order_date
ORDER BY order_date DESC
" || echo "GMV daily view already exists"

# Take rate analysis view
bq query --use_legacy_sql=false "
CREATE OR REPLACE VIEW \`$PROJECT_ID.$DATASET_ID.take_rate_analysis_view\` AS
SELECT
  tenant_id,
  seller_id,
  order_date,
  COUNT(DISTINCT order_id) as total_orders,
  SUM(gmv) as total_gmv,
  SUM(commission_amount) as total_commission,
  AVG(take_rate) as avg_take_rate,
  CASE 
    WHEN SUM(gmv) > 0 THEN (SUM(commission_amount) / SUM(gmv)) * 100
    ELSE 0
  END as effective_take_rate,
  CASE 
    WHEN AVG(take_rate) >= 10 THEN 'high'
    WHEN AVG(take_rate) >= 5 THEN 'medium'
    ELSE 'low'
  END as take_rate_tier
FROM \`$PROJECT_ID.$DATASET_ID.orders\`
GROUP BY tenant_id, seller_id, order_date
ORDER BY order_date DESC, total_gmv DESC
" || echo "Take rate analysis view already exists"

# Set up data retention policies
echo "⏰ Setting up data retention policies..."

# Set retention for events table (2 years)
bq query --use_legacy_sql=false "
ALTER TABLE \`$PROJECT_ID.$DATASET_ID.events\`
SET OPTIONS (
  partition_expiration_days = 730
)
" || echo "Events retention policy already set"

# Set retention for orders table (2 years)
bq query --use_legacy_sql=false "
ALTER TABLE \`$PROJECT_ID.$DATASET_ID.orders\`
SET OPTIONS (
  partition_expiration_days = 730
)
" || echo "Orders retention policy already set"

# Set retention for webhook_deliveries table (1 year)
bq query --use_legacy_sql=false "
ALTER TABLE \`$PROJECT_ID.$DATASET_ID.webhook_deliveries\`
SET OPTIONS (
  partition_expiration_days = 365
)
" || echo "Webhook deliveries retention policy already set"

# Create service account for dbt
echo "🔑 Creating service account for dbt..."
gcloud iam service-accounts create dbt-bigquery-service \
  --display-name="dbt BigQuery Service Account" \
  --description="Service account for dbt to access BigQuery" || echo "Service account already exists"

# Grant necessary roles to service account
echo "🔐 Granting roles to service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:dbt-bigquery-service@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataEditor" || echo "Data editor role already granted"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:dbt-bigquery-service@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/bigquery.jobUser" || echo "Job user role already granted"

# Create key for service account
echo "🔑 Creating service account key..."
gcloud iam service-accounts keys create dbt-service-account-key.json \
  --iam-account=dbt-bigquery-service@$PROJECT_ID.iam.gserviceaccount.com || echo "Service account key already exists"

echo "✅ BigQuery setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the service account key to your dbt project:"
echo "   cp dbt-service-account-key.json dbt/"
echo ""
echo "2. Set environment variables:"
echo "   export GOOGLE_APPLICATION_CREDENTIALS=\"./dbt-service-account-key.json\""
echo "   export GOOGLE_CLOUD_PROJECT_ID=\"$PROJECT_ID\""
echo "   export BIGQUERY_DATASET_ID=\"$DATASET_ID\""
echo ""
echo "3. Run dbt models:"
echo "   cd dbt && dbt deps && dbt run"
echo ""
echo "4. Set up Metabase or Looker Studio using the provided guides"
echo ""
echo "🔗 Useful links:"
echo "- BigQuery Console: https://console.cloud.google.com/bigquery?project=$PROJECT_ID"
echo "- Dataset: https://console.cloud.google.com/bigquery?project=$PROJECT_ID&ws=!1m4!1m3!3m2!1s$PROJECT_ID!2s$DATASET_ID"

