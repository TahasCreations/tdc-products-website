#!/bin/bash

# Vercel Postgres Setup Script
# Bu script Vercel'de production database kurulumunu yapar

echo "🗄️  Vercel Postgres Setup"
echo "========================="

# 1. Check if running on Vercel
if [ "$VERCEL" = "1" ]; then
  echo "✅ Running on Vercel"
  
  # 2. Check for Postgres environment variables
  if [ -z "$POSTGRES_PRISMA_URL" ]; then
    echo "❌ POSTGRES_PRISMA_URL not found"
    echo "Please create a Postgres database in Vercel Dashboard"
    exit 1
  fi
  
  echo "✅ Postgres credentials found"
  
  # 3. Generate Prisma Client
  echo "📦 Generating Prisma Client..."
  npx prisma generate
  
  # 4. Deploy migrations
  echo "🚀 Deploying migrations..."
  npx prisma migrate deploy
  
  echo "✅ Database setup complete!"
else
  echo "ℹ️  Not running on Vercel, skipping..."
  echo "For local development, use SQLite"
fi

