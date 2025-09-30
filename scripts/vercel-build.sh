#!/bin/bash

# Vercel Build Script for TDC Market
echo "🚀 Starting Vercel build process..."

# Set environment
export NODE_ENV=production

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build web app
echo "🔨 Building web application..."
cd apps/web
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Output directory: apps/web/.next"
    echo "🚀 Ready for Vercel deployment!"
else
    echo "❌ Build failed!"
    exit 1
fi
