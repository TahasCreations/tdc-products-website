#!/bin/bash

# Vercel Deploy Script
echo "🚀 Starting Vercel deployment..."

# Clean everything
echo "🧹 Cleaning cache and build files..."
rm -rf .next
rm -rf node_modules
rm -rf .vercel
rm -rf .turbo
rm -rf dist
rm -rf out
rm -rf .git

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --force

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Ready for Vercel deployment!"
else
    echo "❌ Build failed!"
    exit 1
fi
