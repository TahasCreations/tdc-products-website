#!/bin/bash

# dbt Run Script for TDC Analytics
# This script runs dbt models for TDC Analytics

set -e

echo "🚀 Running dbt models for TDC Analytics..."

# Check if dbt is installed
if ! command -v dbt &> /dev/null; then
    echo "❌ dbt is not installed. Please install it first:"
    echo "   pip install dbt-bigquery"
    exit 1
fi

# Check if we're in the dbt directory
if [ ! -f "dbt_project.yml" ]; then
    echo "❌ dbt_project.yml not found. Please run this script from the dbt directory."
    exit 1
fi

# Check environment variables
if [ -z "$GOOGLE_CLOUD_PROJECT_ID" ]; then
    echo "❌ GOOGLE_CLOUD_PROJECT_ID environment variable is not set."
    exit 1
fi

if [ -z "$GOOGLE_APPLICATION_CREDENTIALS" ]; then
    echo "❌ GOOGLE_APPLICATION_CREDENTIALS environment variable is not set."
    exit 1
fi

echo "📋 Configuration:"
echo "  Project ID: $GOOGLE_CLOUD_PROJECT_ID"
echo "  Dataset ID: ${BIGQUERY_DATASET_ID:-tdc_analytics}"
echo "  Credentials: $GOOGLE_APPLICATION_CREDENTIALS"

# Install dbt packages
echo "📦 Installing dbt packages..."
dbt deps

# Test connection
echo "🔌 Testing BigQuery connection..."
dbt debug

# Run dbt models
echo "🏗️ Running dbt models..."

# Run staging models first
echo "  📊 Running staging models..."
dbt run --models staging

# Run marts models
echo "  🏪 Running marts models..."
dbt run --models marts

# Run core models
echo "  🎯 Running core models..."
dbt run --models core

# Run tests
echo "🧪 Running dbt tests..."
dbt test

# Generate documentation
echo "📚 Generating documentation..."
dbt docs generate

# Show model summary
echo "📊 Model summary:"
dbt list --output name

echo "✅ dbt run completed successfully!"
echo ""
echo "🔗 Next steps:"
echo "1. View documentation: dbt docs serve"
echo "2. Set up Metabase or Looker Studio using the provided guides"
echo "3. Schedule regular dbt runs using cron or your scheduler"
echo ""
echo "📈 Available models:"
echo "- stg_events: Staging model for events data"
echo "- stg_orders: Staging model for orders data"
echo "- fct_gmv_daily: Daily GMV fact table"
echo "- fct_take_rate_analysis: Take rate analysis fact table"
echo "- dim_tenants: Tenant dimension table"
echo "- agg_gmv_monthly: Monthly GMV aggregation"
echo "- agg_take_rate_trends: Take rate trends analysis"

